// ==========================================================================
// ASiC Handel — Verlauf (archivierte Begehungen)
// ==========================================================================

let archiveCache = [];
let teamArchiveCache = [];

async function loadAndRenderArchive() {
    try {
        archiveCache = await getAllArchivedAudits();
        renderArchiveList();
    } catch (err) {
        console.error('Archiv konnte nicht geladen werden:', err);
        showToast('Archiv konnte nicht geladen werden: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function renderArchiveList() {
    const container = document.getElementById('archive-list');
    const empty = document.getElementById('no-archive');
    if (!container) return;

    if (archiveCache.length === 0) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    container.innerHTML = archiveCache.map(record => {
        const ci = record.companyInfo || {};
        const stats = record.stats || { ok: 0, mangel: 0, na: 0, offen: 0, total: 0 };
        const auditDatum = ci.datum ? formatDate(ci.datum) : '-';
        const archiviertAm = new Date(record.createdAt).toLocaleDateString('de-DE') + ' ' + new Date(record.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const fotoAnzahl = (record.photos || []).length;

        return `
        <div class="archive-item card" data-id="${record.id}">
            <div class="archive-item-head">
                <div>
                    <div class="archive-item-firma">${ci.firma || 'Ohne Markt-Angabe'}</div>
                    <div class="archive-item-meta">Begehung vom ${auditDatum} · archiviert am ${archiviertAm}${fotoAnzahl ? ' · ' + fotoAnzahl + ' Foto(s)' : ''}</div>
                </div>
            </div>
            <div class="stat-pills">
                <span class="stat-pill ok">✓ ${stats.ok} In Ordnung</span>
                <span class="stat-pill mangel">! ${stats.mangel} Mangel</span>
                <span class="stat-pill na">– ${stats.na} N.V.</span>
                <span class="stat-pill offen">${stats.offen} Offen</span>
            </div>
            <div class="archive-item-actions">
                <div class="archive-item-actions-primary">
                    <button class="btn btn-secondary btn-small" onclick="onArchiveExport('${record.id}')">📤 PDF exportieren</button>
                    <button class="btn btn-secondary btn-small" onclick="onArchiveRestore('${record.id}')">📂 In App anzeigen</button>
                </div>
                <button class="btn-link photo-delete" onclick="onArchiveDelete('${record.id}')">🗑️ Löschen</button>
            </div>
        </div>`;
    }).join('');
}

async function onArchiveExport(id) {
    const record = archiveCache.find(r => r.id === id);
    if (!record) return;
    try {
        showToast('PDF wird erzeugt…');
        await shareArchivedReportPdf(record, 'alle');
    } catch (err) {
        console.error('Archivierte Begehung konnte nicht exportiert werden:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Laedt eine archivierte Begehung zurueck in den "lebenden" Arbeitsstand
// (Prüfkatalog/Aktionsplan/Fotos) - inklusive der zugehoerigen Fotos, mit
// original erhaltener measureId-Zuordnung. Ueberschreibt bewusst NICHT das
// Archiv selbst, sondern nur den aktuell laufenden, noch nicht archivierten
// Bearbeitungsstand auf diesem Geraet - deshalb vorher eine Bestaetigung.
async function onArchiveRestore(id) {
    const record = archiveCache.find(r => r.id === id);
    if (!record) return;

    if (!confirm('Diese archivierte Begehung in der App anzeigen? Der aktuell laufende, noch nicht archivierte Bearbeitungsstand auf diesem Gerät wird dabei überschrieben. Bereits archivierte Begehungen bleiben davon unberührt.')) return;

    try {
        const restoredState = {
            companyInfo: { ...record.companyInfo },
            ratings: { ...(record.ratings || {}) },
            comments: { ...(record.comments || {}) },
            measures: JSON.parse(JSON.stringify(record.measures || [])),
            signatures: { ...(record.signatures || {}) },
            notApplicable: { ...(record.notApplicable || {}) }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredState));

        if (typeof deleteAllPhotos === 'function' && typeof restorePhotos === 'function') {
            await deleteAllPhotos();
            if (record.photos && record.photos.length > 0) {
                await restorePhotos(record.photos);
            }
        }

        showToast('Begehung wird geöffnet…');
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Begehung konnte nicht wiederhergestellt werden:', err);
        showToast('Wiederherstellen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function onArchiveDelete(id) {
    if (!confirm('Diese archivierte Begehung wirklich unwiderruflich löschen?')) return;
    try {
        await deleteArchivedAudit(id);
        archiveCache = archiveCache.filter(r => r.id !== id);
        renderArchiveList();
        showToast('Aus dem Archiv gelöscht');
    } catch (err) {
        console.error('Löschen fehlgeschlagen:', err);
        showToast('Löschen fehlgeschlagen', 'error');
    }
}

// ===== Team-Archiv (alle auf dem NAS gespeicherten Begehungen) =====
// Nutzt dieselben PHP-Endpunkte wie "Auf NAS speichern"/"Vom NAS laden" -
// funktioniert deshalb nur, wenn diese Seite direkt ueber die Synology
// selbst (bzw. deren Tailscale-Adresse) aufgerufen wird, nicht auf
// GitHub Pages (dort gibt es save.php/list.php/load.php nicht).

async function loadAndRenderTeamArchive() {
    const listEl = document.getElementById('team-archive-list');
    const loadingEl = document.getElementById('team-archive-loading');
    const emptyEl = document.getElementById('no-team-archive');
    const unavailableEl = document.getElementById('team-archive-unavailable');

    if (window.location.hostname.endsWith('.github.io') && !getNasBaseUrl()) {
        listEl.style.display = 'none';
        loadingEl.style.display = 'none';
        emptyEl.style.display = 'none';
        unavailableEl.style.display = 'block';
        return;
    }

    unavailableEl.style.display = 'none';
    emptyEl.style.display = 'none';
    listEl.style.display = 'none';
    loadingEl.style.display = 'block';

    try {
        teamArchiveCache = await getSynologyFiles();
        loadingEl.style.display = 'none';

        if (teamArchiveCache.length === 0) {
            emptyEl.style.display = 'block';
            return;
        }

        listEl.style.display = 'block';
        renderTeamArchiveList();
    } catch (err) {
        loadingEl.style.display = 'none';
        console.error('Team-Archiv konnte nicht geladen werden:', err);
        showToast('Team-Archiv konnte nicht geladen werden: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function renderTeamArchiveList() {
    const container = document.getElementById('team-archive-list');
    if (!container) return;

    // Neueste Begehung zuerst (list.php liefert bereits sortiert, hier zur
    // Sicherheit nochmal explizit nach Speicherzeitpunkt).
    const sorted = [...teamArchiveCache].sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));

    container.innerHTML = sorted.map(entry => {
        const gespeichertAm = entry.savedAt
            ? new Date(entry.savedAt).toLocaleDateString('de-DE') + ' ' + new Date(entry.savedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            : '-';

        return `
        <div class="archive-item card" data-filename="${entry.fileName}">
            <div class="archive-item-head">
                <div>
                    <div class="archive-item-firma">${entry.firma || 'Ohne Markt-Angabe'}${entry.marktnummer ? ' (Nr. ' + entry.marktnummer + ')' : ''}</div>
                    <div class="archive-item-meta">Begehung vom ${entry.datum || '-'} · auf NAS gespeichert am ${gespeichertAm}</div>
                </div>
            </div>
            <div class="archive-item-actions">
                <div class="archive-item-actions-primary">
                    <button class="btn btn-secondary btn-small" onclick="onTeamArchiveExport('${entry.fileName}')">📤 PDF exportieren</button>
                    <button class="btn btn-secondary btn-small" onclick="onTeamArchiveRestore('${entry.fileName}')">📂 In App anzeigen</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

async function onTeamArchiveExport(fileName) {
    try {
        showToast('Lade Begehung vom NAS …');
        const record = await fetchSynologyRecord(fileName);
        showToast('PDF wird erzeugt…');
        // Team-Archiv-Datensaetze vom NAS enthalten keine Fotos (save.php
        // speichert nur die reinen Text-/Bewertungsdaten als JSON) - das PDF
        // enthaelt deshalb Checkliste/Massnahmen, aber keine Fotoabschnitte.
        await shareArchivedReportPdf(record, 'alle');
    } catch (err) {
        console.error('Team-Archiv-Begehung konnte nicht exportiert werden:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Wie onArchiveRestore() (lokales Archiv), aber fuer eine vom NAS geladene
// Team-Archiv-Begehung. WICHTIGER UNTERSCHIED: Team-Archiv-Datensaetze
// enthalten keine Fotos (siehe onTeamArchiveExport) - ein evtl. lokal
// vorhandener Fotobestand wird deshalb nur GELEERT, nicht durch etwas
// Neues ersetzt. Der Hinweistext macht das vorher explizit klar, damit es
// nicht ueberrascht, wenn die geoeffnete Begehung ohne Fotos erscheint,
// obwohl die urspruengliche Kollegin/der urspruengliche Kollege welche
// hatte.
async function onTeamArchiveRestore(fileName) {
    if (!confirm('Diese Begehung vom NAS in der App anzeigen? Der aktuell laufende, noch nicht archivierte Bearbeitungsstand auf diesem Gerät wird dabei überschrieben. Hinweis: Team-Archiv-Datensätze enthalten keine Fotos – ein evtl. vorhandener lokaler Fotobestand wird dabei geleert, nicht ersetzt.')) return;

    try {
        showToast('Lade Begehung vom NAS …');
        const record = await fetchSynologyRecord(fileName);

        const restoredState = {
            companyInfo: { ...record.companyInfo },
            ratings: { ...(record.ratings || {}) },
            comments: { ...(record.comments || {}) },
            measures: JSON.parse(JSON.stringify(record.measures || [])),
            signatures: { ...(record.signatures || {}) },
            notApplicable: { ...(record.notApplicable || {}) }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredState));

        if (typeof deleteAllPhotos === 'function') {
            await deleteAllPhotos();
        }

        showToast('Begehung wird geöffnet…');
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Team-Archiv-Begehung konnte nicht geöffnet werden:', err);
        showToast('Laden fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function switchVerlaufTab(tab) {
    ['lokal', 'team', 'auswertung-verlauf', 'auswertung-team'].forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (btn) btn.classList.toggle('active', t === tab);
    });

    // Alle Panels zunaechst verstecken, danach nur das gewaehlte einblenden.
    document.getElementById('archive-list').style.display = 'none';
    document.getElementById('no-archive').style.display = 'none';
    document.getElementById('team-archive-list').style.display = 'none';
    document.getElementById('no-team-archive').style.display = 'none';
    document.getElementById('team-archive-loading').style.display = 'none';
    document.getElementById('team-archive-unavailable').style.display = 'none';
    document.getElementById('auswertung-verlauf-panel').style.display = 'none';
    document.getElementById('auswertung-team-panel').style.display = 'none';

    if (tab === 'team') {
        loadAndRenderTeamArchive();
    } else if (tab === 'auswertung-verlauf') {
        document.getElementById('auswertung-verlauf-panel').style.display = 'block';
        renderAuswertungVerlaufTab();
    } else if (tab === 'auswertung-team') {
        document.getElementById('auswertung-team-panel').style.display = 'block';
        renderAuswertungTeamTab();
    } else {
        // "lokal" (Mein Verlauf)
        document.getElementById('archive-list').style.display = 'block';
        renderArchiveList();
    }
}

// ===== Auswertung Verlauf (lokales Archiv, direkt auf der Verlauf-Seite) =====
// Nutzt dieselbe Berechnungslogik wie auswertung.html (js/auswertung-logik.js),
// laedt das Archiv aber bewusst frisch, statt sich auf archiveCache zu
// verlassen (analog zum Race-Condition-Fix beim CSV-Export).
async function renderAuswertungVerlaufTab() {
    let daten;
    try {
        daten = await getAllArchivedAudits();
    } catch (err) {
        console.error('Archiv konnte für die Auswertung nicht geladen werden:', err);
        daten = [];
    }
    document.getElementById('av-kategorien-content').innerHTML = renderKategorienSchwachstellenHtml(daten);
    document.getElementById('av-maerkte-content').innerHTML = renderAuffaelligeMaerkteHtml(daten);
    document.getElementById('av-verlauf-content').innerHTML = renderVerlaufProMarktHtml(daten);
}

// ===== Auswertung Team (alle Begehungen aus dem Team-Archiv/NAS) =====
// list.php liefert nur Metadaten (Firma, Datum, Marktnummer) - fuer eine
// echte Auswertung werden die vollstaendigen Bewertungen benoetigt, daher
// wird hier fuer JEDE gefundene Datei fetchSynologyRecord() aufgerufen.
// Einzelne fehlgeschlagene Dateien werden uebersprungen (Promise.allSettled),
// statt die gesamte Auswertung an einer einzelnen defekten Datei scheitern
// zu lassen.
async function renderAuswertungTeamTab() {
    const containerIds = ['at-kategorien-content', 'at-maerkte-content', 'at-verlauf-content'];
    const zeigeInAllen = (html) => containerIds.forEach(id => { document.getElementById(id).innerHTML = html; });

    zeigeInAllen('<p class="auswertung-empty">Lade Team-Daten vom NAS …</p>');

    if (window.location.hostname.endsWith('.github.io') && !getNasBaseUrl()) {
        zeigeInAllen('<p class="auswertung-empty">Team-Auswertung ist hier nicht verfügbar (siehe Reiter „Team-Archiv (NAS)").</p>');
        return;
    }

    let fileList;
    try {
        fileList = await getSynologyFiles();
    } catch (err) {
        console.error('Team-Archiv-Liste konnte nicht geladen werden:', err);
        zeigeInAllen('<p style="color:var(--mangel);">Team-Archiv konnte nicht geladen werden: ' + (err && err.message ? err.message : 'unbekannter Fehler') + '</p>');
        return;
    }

    if (fileList.length === 0) {
        zeigeInAllen('<p class="auswertung-empty">Noch keine Begehung im Team-Archiv.</p>');
        return;
    }

    const ergebnisse = await Promise.allSettled(fileList.map(f => fetchSynologyRecord(f.fileName)));
    const daten = ergebnisse.filter(r => r.status === 'fulfilled').map(r => r.value);
    const fehlgeschlagen = ergebnisse.length - daten.length;

    document.getElementById('at-kategorien-content').innerHTML = renderKategorienSchwachstellenHtml(daten);
    document.getElementById('at-maerkte-content').innerHTML = renderAuffaelligeMaerkteHtml(daten);
    document.getElementById('at-verlauf-content').innerHTML = renderVerlaufProMarktHtml(daten);

    if (fehlgeschlagen > 0) {
        showToast(fehlgeschlagen + ' von ' + ergebnisse.length + ' Team-Dateien konnten nicht geladen werden', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderArchive();

    ['lokal', 'team', 'auswertung-verlauf', 'auswertung-team'].forEach(tab => {
        const btn = document.getElementById('tab-' + tab);
        if (btn) btn.addEventListener('click', () => switchVerlaufTab(tab));
    });
});
