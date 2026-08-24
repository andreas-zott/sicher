// ==========================================================================
// ASiC Handel — WebDAV-Anbindung (Synology-NAS-Backup)
// ==========================================================================
// Laedt archivierte Begehungen zusaetzlich zur lokalen IndexedDB-Speicherung
// als JSON-Datei auf einen per WebDAV erreichbaren Ordner hoch (z. B. eine
// Synology-NAS, ueber Tailscale erreichbar). Rein optional - wenn nichts
// konfiguriert ist, bleibt alles wie bisher rein lokal.
//
// WICHTIGER HINWEIS ZU CORS:
// Ein normal eingerichtetes Synology-"WebDAV Server"-Paket sendet keine
// CORS-Freigabe-Header, die Browser-JavaScript fuer Cross-Origin-Anfragen
// (andere Portnummer als die App selbst) benoetigt. Ohne einen Reverse
// Proxy in der DSM-Systemsteuerung (der die noetigen Access-Control-*-Header
// ergaenzt) wird der Upload mit einem generischen Netzwerkfehler
// fehlschlagen, obwohl Server/Zugangsdaten korrekt sind. Der Verbindungstest
// unten versucht, diesen Fall von anderen Fehlern (falsches Passwort,
// falscher Ordner) zu unterscheiden.
//
// SICHERHEITSHINWEIS: Server-Adresse, Benutzername und Passwort werden in
// localStorage auf diesem Geraet gespeichert (Klartext) - eine technische
// Einschraenkung reiner Web-Apps ohne Zugriff auf einen sicheren
// Betriebssystem-Schluesselbund. Deshalb wird ausdruecklich empfohlen,
// einen eigenen, eingeschraenkten Benutzer zu verwenden (nicht das
// Admin-Konto) mit Schreibrechten nur auf den Backup-Ordner.

const WEBDAV_CONFIG_KEY = 'webdavConfig';

function getWebDAVConfig() {
    try {
        const raw = localStorage.getItem(WEBDAV_CONFIG_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        return null;
    }
}

function saveWebDAVConfig(config) {
    localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(config));
}

function isWebDAVConfigured() {
    const c = getWebDAVConfig();
    return !!(c && c.host && c.username && c.password);
}

// Baut die vollstaendige URL fuer eine Datei im konfigurierten Backup-Ordner.
function buildWebDAVUrl(config, filename) {
    const proto = config.useHttps ? 'https' : 'http';
    const port = config.port || (config.useHttps ? 5006 : 5005);
    const folder = (config.folder || '').replace(/^\/+|\/+$/g, '');
    const host = (config.host || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const folderPart = folder ? '/' + folder : '';
    return `${proto}://${host}:${port}${folderPart}/${encodeURIComponent(filename)}`;
}

function buildAuthHeader(config) {
    return 'Basic ' + btoa(`${config.username}:${config.password}`);
}

// Verbindungstest: schreibt eine kleine Testdatei in den Backup-Ordner und
// loescht sie danach wieder. Liefert ein Ergebnisobjekt mit klarer
// Fehlerdiagnose statt nur "geht"/"geht nicht".
async function testWebDAVConnection(config) {
    if (!config || !config.host || !config.username || !config.password) {
        return { ok: false, reason: 'unvollstaendig', message: 'Bitte Server-Adresse, Benutzername und Passwort ausfüllen.' };
    }
    const testUrl = buildWebDAVUrl(config, '.asic-handel-verbindungstest.txt');
    try {
        const putResponse = await fetch(testUrl, {
            method: 'PUT',
            headers: {
                'Authorization': buildAuthHeader(config),
                'Content-Type': 'text/plain'
            },
            body: 'Verbindungstest von ASiC Handel — kann gelöscht werden.'
        });

        if (putResponse.status === 401 || putResponse.status === 403) {
            return { ok: false, reason: 'auth', message: 'Zugriff verweigert (401/403) — Benutzername oder Passwort falsch, oder der Benutzer hat keine Schreibrechte auf diesen Ordner.' };
        }
        if (putResponse.status === 404 || putResponse.status === 409) {
            return { ok: false, reason: 'ordner', message: `Ordner nicht gefunden (HTTP ${putResponse.status}) — bitte prüfen, ob der freigegebene Ordner „${config.folder || ''}" auf der Synology existiert und der Pfad korrekt eingetragen ist.` };
        }
        if (!putResponse.ok) {
            return { ok: false, reason: 'sonstiger-fehler', message: `Unerwartete Antwort vom Server (HTTP ${putResponse.status}).` };
        }

        // Testdatei wieder aufräumen (Fehler beim Löschen sind unkritisch)
        try {
            await fetch(testUrl, { method: 'DELETE', headers: { 'Authorization': buildAuthHeader(config) } });
        } catch (cleanupErr) { /* unkritisch */ }

        return { ok: true, message: 'Verbindung erfolgreich — Testdatei wurde geschrieben und wieder gelöscht.' };

    } catch (networkErr) {
        // fetch() wirft bei durch CORS blockierten Anfragen einen generischen
        // "Failed to fetch"-TypeError ohne HTTP-Statuscode - das ist das
        // typische Symptom, wenn der Reverse Proxy mit den CORS-Headern
        // fehlt oder die Adresse/der Port grundsaetzlich nicht erreichbar ist.
        return {
            ok: false,
            reason: 'netzwerk-oder-cors',
            message: 'Verbindung fehlgeschlagen, ohne dass der Server überhaupt geantwortet hat. Häufigste Ursachen: (1) CORS — der Synology-WebDAV-Server erlaubt Browser-Zugriffe von dieser App-Adresse nicht; dafür ist ein Reverse Proxy mit passenden Access-Control-Headern in der DSM-Systemsteuerung nötig. (2) Server über Tailscale gerade nicht erreichbar. (3) Falscher Port. Bitte diese drei Punkte der Reihe nach prüfen.'
        };
    }
}

// Laedt einen archivierten Begehungs-Datensatz als JSON auf die NAS hoch.
// Wirft bei Fehlern eine Error mit verstaendlicher Meldung (gleiche
// Diagnose-Logik wie testWebDAVConnection).
async function uploadArchivedAuditToWebDAV(record) {
    const config = getWebDAVConfig();
    if (!config || !config.host || !config.username || !config.password) {
        throw new Error('WebDAV ist noch nicht eingerichtet (siehe Einstellungen).');
    }

    const firma = (record.companyInfo.firma || 'Begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = record.companyInfo.datum || new Date(record.createdAt).toISOString().split('T')[0];
    const kurzId = record.id.slice(-8);
    const filename = `Archiv_${firma}_${datum}_${kurzId}.json`;

    // Fotos NICHT mit hochladen (Blobs sind fuer eine reine JSON-Sicherung zu
    // groß und WebDAV-PUT hier bewusst einfach gehalten) - die Fotos bleiben
    // separat lokal im Geraet archiviert; die JSON-Datei sichert die
    // eigentlichen Pruefdaten (Antworten, Maßnahmen, Unterschriften).
    const exportRecord = {
        id: record.id,
        createdAt: record.createdAt,
        companyInfo: record.companyInfo,
        ratings: record.ratings,
        comments: record.comments,
        measures: record.measures,
        signatures: record.signatures,
        notApplicable: record.notApplicable,
        stats: record.stats,
        fotoAnzahlHinweis: (record.photos || []).length + ' Foto(s) — nicht in dieser Datei enthalten, bleiben lokal auf dem Gerät archiviert.'
    };

    const url = buildWebDAVUrl(config, filename);
    let response;
    try {
        response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': buildAuthHeader(config),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exportRecord, null, 2)
        });
    } catch (networkErr) {
        throw new Error('Upload fehlgeschlagen: Server nicht erreichbar oder CORS blockiert die Anfrage (siehe Einstellungen → Verbindung testen für Details).');
    }

    if (response.status === 401 || response.status === 403) {
        throw new Error('Upload fehlgeschlagen: Zugriff verweigert (falsches Passwort oder keine Schreibrechte).');
    }
    if (!response.ok) {
        throw new Error(`Upload fehlgeschlagen (HTTP ${response.status}).`);
    }
    return filename;
}
