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
        <div class="archive-item card" data-id="${escapeHtml(record.id)}">
            <div class="archive-item-head">
                <div>
                    <div class="archive-item-firma">${escapeHtml(ci.marktnummer || 'Ohne Markt-Angabe')}</div>
                    <div class="archive-item-meta">Begehung vom ${escapeHtml(auditDatum)} · archiviert am ${escapeHtml(archiviertAm)}${fotoAnzahl ? ' · ' + fotoAnzahl + ' Foto(s)' : ''}</div>
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
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onArchiveExport', record.id)}>📤 PDF exportieren</button>
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onArchiveRestore', record.id)}>📂 In App anzeigen</button>
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onArchiveFollowUp', record.id)} title="Neue Begehung für diesen Markt mit den offenen Maßnahmen dieser Begehung">🔁 Wiederholungsbegehung</button>
                </div>
                <button class="btn-link photo-delete" ${aktionAttr('click', 'onArchiveDelete', record.id)}>🗑️ Löschen</button>
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

    const ci = record.companyInfo || {};
    const wahl = await frageVorErsetzen(
        { marktnummer: ci.marktnummer, datum: ci.datum ? formatDatumDe(ci.datum) : '', plzOrt: ci.plzOrt, firma: ci.firma },
        { sub: 'Begehung aus „Mein Verlauf“ öffnen', punkte: [
            'Die Begehung wird auf diesem Gerät geöffnet und kann weiterbearbeitet werden.',
            (record.photos && record.photos.length ? record.photos.length + ' Foto' + (record.photos.length === 1 ? '' : 's') + ' dieser Begehung werden wiederhergestellt.' : 'Zu dieser Begehung sind keine Fotos archiviert.'),
            'Archivierte Begehungen bleiben unverändert.'
        ] });
    if (!wahl) return;

    try {
        if (wahl === 'archiv' && !(await archiviereAktuelleBegehung())) return;
        try { localStorage.removeItem(MARKT_CONTAINER_KEY); } catch (e) { /* egal */ }
        const restoredState = {
            companyInfo: { ...record.companyInfo },
            ratings: { ...(record.ratings || {}) },
            comments: { ...(record.comments || {}) },
            measures: JSON.parse(JSON.stringify(record.measures || [])),
            signatures: { ...(record.signatures || {}) },
            notApplicable: { ...(record.notApplicable || {}) },
            subgroupNotApplicable: { ...(record.subgroupNotApplicable || {}) }
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

// Wiederholungsbegehung aus einer archivierten Begehung (ab Rev. 1.52)
async function onArchiveFollowUp(id) {
    const record = archiveCache.find(r => r.id === id);
    if (!record) return;
    try {
        const ergebnis = await startFollowUpAudit(record, 'lokal');
        if (!ergebnis) return;
        showToast('Wiederholungsbegehung angelegt' + (ergebnis.uebernommen ? ' – ' + ergebnis.uebernommen + ' offene Maßnahme(n) übernommen' : ''));
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Wiederholungsbegehung konnte nicht angelegt werden:', err);
        showToast('Wiederholungsbegehung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
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

// ===== Team-Archiv (alle auf dem Server gespeicherten Begehungen) =====
// Nutzt dieselben PHP-Endpunkte wie "Auf Server speichern"/"Vom Server laden" -
// funktioniert deshalb nur, wenn diese Seite direkt ueber den Server
// mit den PHP-Skripten aufgerufen wird, nicht auf
// GitHub Pages (dort gibt es save.php/list.php/load.php nicht).

// ===== Ladestatus Team-Archiv (ab Rev. 1.54, gleiche Anzeige wie die
// Team-Auswertung) =====
// Zeigt ueber der Liste: wird geladen (Spinner + durchlaufender Balken,
// da list.php die Liste in EINEM Abruf liefert), fertig (gruen, Anzahl +
// Uhrzeit), Fehler (rot, Grund + "Erneut versuchen"). Auch die Knoepfe an
// den Eintraegen (PDF, In App anzeigen, Wiederholungsbegehung) laden vom
// Server und melden das hier.

let teamArchivLaedt = false;
let teamArchivFertigText = null;   // letzter "fertig"-Stand, nach Einzelaktionen wiederherstellen

function setzeTeamArchivStatus(zustand, titel, detail) {
    const box = document.getElementById('team-archive-loading');
    if (!box) return;
    box.style.display = 'flex';
    box.classList.remove('is-laden', 'is-fertig', 'is-warnung', 'is-fehler');
    box.classList.add('is-' + zustand, 'is-unbestimmt');
    const titelEl = document.getElementById('team-archiv-lade-titel');
    const detailEl = document.getElementById('team-archiv-lade-detail');
    if (titelEl) titelEl.textContent = titel;
    if (detailEl) detailEl.textContent = detail || '';
    const btn = document.getElementById('team-archiv-neu-laden');
    if (btn) {
        btn.hidden = zustand === 'laden';
        btn.textContent = zustand === 'fehler' ? '↻ Erneut versuchen' : '↻ Neu laden';
    }
    // Knoepfe an den Eintraegen waehrend des Ladens sperren (kein Doppelklick)
    document.querySelectorAll('#team-archive-list button').forEach(b => { b.disabled = zustand === 'laden'; });
}

function teamArchivUhrzeit() {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

async function loadAndRenderTeamArchive() {
    if (teamArchivLaedt) return;
    const listEl = document.getElementById('team-archive-list');
    const statusEl = document.getElementById('team-archive-loading');
    const emptyEl = document.getElementById('no-team-archive');
    const unavailableEl = document.getElementById('team-archive-unavailable');

    if (window.location.hostname.endsWith('.github.io') && !getNasBaseUrl()) {
        listEl.style.display = 'none';
        statusEl.style.display = 'none';
        emptyEl.style.display = 'none';
        unavailableEl.style.display = 'block';
        return;
    }

    teamArchivLaedt = true;
    unavailableEl.style.display = 'none';
    emptyEl.style.display = 'none';
    setzeTeamArchivStatus('laden', 'Team-Archiv wird geladen …', 'Dateiliste wird vom Server abgerufen');
    const start = Date.now();

    try {
        teamArchiveCache = await getServerFiles();
        const dauer = ((Date.now() - start) / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 });
        const n = teamArchiveCache.length;

        const sucheEl = document.getElementById('team-archiv-suche');
        if (sucheEl) sucheEl.style.display = n > 0 ? 'flex' : 'none';

        if (n === 0) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
            teamArchivFertigText = ['Team-Archiv geladen', 'Noch keine Begehung im Team-Archiv · Stand ' + teamArchivUhrzeit() + ' Uhr'];
        } else {
            listEl.style.display = 'block';
            renderTeamArchiveList();
            teamArchivFertigText = ['Team-Archiv geladen', n + ' Begehung' + (n === 1 ? '' : 'en') + ' in ' + dauer + ' s · Stand ' + teamArchivUhrzeit() + ' Uhr'];
        }
        setzeTeamArchivStatus('fertig', teamArchivFertigText[0], teamArchivFertigText[1]);
    } catch (err) {
        console.error('Team-Archiv konnte nicht geladen werden:', err);
        const grund = err && err.message ? err.message : 'unbekannter Fehler';
        listEl.style.display = 'none';
        teamArchivFertigText = null;
        ['team-archiv-suche', 'team-archiv-keine-treffer'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        setzeTeamArchivStatus('fehler', 'Team-Archiv konnte nicht geladen werden',
            grund + ' – Server erreichbar? Zugriffsschlüssel unter „Einstellungen“ korrekt?');
    } finally {
        teamArchivLaedt = false;
    }
}

// Laedt eine einzelne Begehung fuer die Knoepfe an den Eintraegen und
// zeigt das im Statusfeld an. Danach (Erfolg) wieder der letzte Listenstand.
async function ladeTeamBegehungMitStatus(fileName, aktion) {
    setzeTeamArchivStatus('laden', 'Begehung wird geladen …', aktion + ' · ' + fileName);
    try {
        const record = await fetchServerRecord(fileName);
        if (teamArchivFertigText) setzeTeamArchivStatus('fertig', teamArchivFertigText[0], teamArchivFertigText[1]);
        return record;
    } catch (err) {
        setzeTeamArchivStatus('fehler', 'Begehung konnte nicht geladen werden',
            (err && err.message ? err.message : 'unbekannter Fehler') + ' · ' + fileName);
        throw err;
    }
}

function renderTeamArchiveList() {
    const container = document.getElementById('team-archive-list');
    if (!container) return;

    // Neueste Begehung zuerst (list.php liefert bereits sortiert, hier zur
    // Sicherheit nochmal explizit nach Speicherzeitpunkt).
    const alle = [...teamArchiveCache].sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));

    // Suche (ab Ausgabestand 1.54-3): alle Suchwoerter muessen vorkommen,
    // in Marktnummer, Ort/Firma, Begehungsdatum oder Dateiname.
    const suchEl = document.getElementById('team-archiv-suchfeld');
    const woerter = (suchEl ? suchEl.value : '').toLowerCase().split(/\s+/).filter(Boolean);
    const sorted = woerter.length === 0 ? alle : alle.filter(entry => {
        const text = [entry.marktnummer, entry.plzOrt, entry.firma, entry.datum, entry.fileName]
            .map(v => String(v || '').toLowerCase()).join(' ');
        return woerter.every(w => text.includes(w));
    });
    const trefferEl = document.getElementById('team-archiv-treffer');
    if (trefferEl) {
        trefferEl.textContent = woerter.length === 0
            ? alle.length + ' Begehung' + (alle.length === 1 ? '' : 'en')
            : sorted.length + ' von ' + alle.length;
    }
    const keineEl = document.getElementById('team-archiv-keine-treffer');
    if (keineEl) keineEl.style.display = (woerter.length > 0 && sorted.length === 0) ? 'block' : 'none';

    container.innerHTML = sorted.map(entry => {
        const gespeichertAm = entry.savedAt
            ? new Date(entry.savedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' + new Date(entry.savedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            : '-';

        const stand = (typeof leseServerStand === 'function') ? leseServerStand() : null;
        const offen = stand && typeof sicherungsZustand === 'function' && sicherungsZustand() !== 'leer' && stand.datei === entry.fileName;
        const ort = entry.plzOrt || entry.firma || 'ohne Ortsangabe';
        const zusatz = entry.plzOrt && entry.firma ? ' · ' + entry.firma : '';
        return `
        <div class="archive-item card ta-karte" data-filename="${escapeHtml(entry.fileName)}">
            <div class="ta-kopf">
                <span class="srv-markt">${entry.marktnummer ? 'Markt ' + escapeHtml(entry.marktnummer) : 'ohne Marktnummer'}${fassungVon(entry.fileName) ? ' <span class="srv-fassung">Fassung ' + fassungVon(entry.fileName) + '</span>' : ''}</span>
                <span class="srv-datum">${escapeHtml(entry.datum || '–')}</span>
            </div>
            <div class="srv-ort">${escapeHtml(ort)}${escapeHtml(zusatz)}</div>
            <div class="srv-meta">gespeichert ${escapeHtml(gespeichertAm)} Uhr${vorWieLange(entry.savedAt) ? ' · ' + escapeHtml(vorWieLange(entry.savedAt)) : ''}${kuerzlichGespeichert(entry.savedAt) && !offen ? '<span class="srv-badge srv-badge-frisch">kürzlich gespeichert</span>' : ''}${offen ? '<span class="srv-badge">auf diesem Gerät geöffnet</span>' : ''}</div>
            <div class="archive-item-actions">
                <div class="archive-item-actions-primary">
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onTeamArchiveExport', '$closest-filename')}>📤 PDF exportieren</button>
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onTeamArchiveRestore', '$closest-filename')}>📂 In App anzeigen</button>
                    <button class="btn btn-secondary btn-small" ${aktionAttr('click', 'onTeamArchiveFollowUp', '$closest-filename')} title="Neue Begehung für diesen Markt mit den offenen Maßnahmen dieser Begehung">🔁 Wiederholungsbegehung</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

async function onTeamArchiveExport(fileName) {
    try {
        const record = await ladeTeamBegehungMitStatus(fileName, 'PDF exportieren');
        showToast('PDF wird erzeugt…');
        // Team-Archiv-Datensaetze vom Server enthalten keine Fotos (save.php
        // speichert nur die reinen Text-/Bewertungsdaten als JSON) - das PDF
        // enthaelt deshalb Checkliste/Massnahmen, aber keine Fotoabschnitte.
        await shareArchivedReportPdf(record, 'alle');
    } catch (err) {
        console.error('Team-Archiv-Begehung konnte nicht exportiert werden:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Wie onArchiveRestore() (lokales Archiv), aber fuer eine vom Server geladene
// Team-Archiv-Begehung. WICHTIGER UNTERSCHIED: Team-Archiv-Datensaetze
// enthalten keine Fotos (siehe onTeamArchiveExport) - ein evtl. lokal
// vorhandener Fotobestand wird deshalb nur GELEERT, nicht durch etwas
// Neues ersetzt. Der Hinweistext macht das vorher explizit klar, damit es
// nicht ueberrascht, wenn die geoeffnete Begehung ohne Fotos erscheint,
// obwohl die urspruengliche Kollegin/der urspruengliche Kollege welche
// hatte.
async function onTeamArchiveRestore(fileName) {
    const eintrag = (teamArchiveCache || []).find(e => e.fileName === fileName) || {};
    // Kuerzlich gespeichert: Hinweis, dass gerade jemand anderes daran
    // arbeiten koennte (ab 1.54-9)
    const punkte = [
        'Die Begehung wird auf diesem Gerät geöffnet und kann weiterbearbeitet werden.',
        'Daten aus dem Team-Archiv enthalten keine Fotos.'
    ];
    const standJetzt = (typeof leseServerStand === 'function') ? leseServerStand() : null;
    const hierGeoeffnet = !!(standJetzt && standJetzt.datei === fileName && sicherungsZustand() !== 'leer');
    if (kuerzlichGespeichert(eintrag.savedAt) && !hierGeoeffnet) {
        punkte.push('Zuletzt gespeichert ' + vorWieLange(eintrag.savedAt) + ' – möglicherweise bearbeitet sie gerade jemand anderes. Beim Speichern meldet die App, falls inzwischen ein neuerer Stand im Team-Archiv liegt.');
    }
    const wahl = await frageVorErsetzen(eintrag, { punkte });
    if (!wahl) return;

    try {
        const record = await ladeTeamBegehungMitStatus(fileName, 'In App anzeigen');
        if (wahl === 'archiv' && !(await archiviereAktuelleBegehung())) return;

        const restoredState = {
            companyInfo: { ...record.companyInfo },
            ratings: { ...(record.ratings || {}) },
            comments: { ...(record.comments || {}) },
            measures: JSON.parse(JSON.stringify(record.measures || [])),
            signatures: { ...(record.signatures || {}) },
            notApplicable: { ...(record.notApplicable || {}) },
            subgroupNotApplicable: { ...(record.subgroupNotApplicable || {}) }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredState));
        merkeMarktContainer(record);
        // gilt als im Team-Archiv gesichert (wird im Pruefkatalog nach dem
        // Seitenaufbau als Sicherungsstand uebernommen, ab Ausgabestand 1.54-3)
        try {
            localStorage.setItem('asicServerStandAusstehend', JSON.stringify({
                datei: fileName,
                serverZeit: (record._nas && record._nas.savedAt) || eintrag.savedAt || ''
            }));
        } catch (e) {}

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

// Wiederholungsbegehung aus einer Begehung im Team-Archiv (ab Rev. 1.52)
async function onTeamArchiveFollowUp(fileName) {
    try {
        const record = await ladeTeamBegehungMitStatus(fileName, 'Wiederholungsbegehung');
        const ergebnis = await startFollowUpAudit(record, 'team');
        if (!ergebnis) return;
        showToast('Wiederholungsbegehung angelegt' + (ergebnis.uebernommen ? ' – ' + ergebnis.uebernommen + ' offene Maßnahme(n) übernommen' : ''));
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Wiederholungsbegehung konnte nicht angelegt werden:', err);
        showToast('Wiederholungsbegehung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function switchVerlaufTab(tab) {
    ['lokal', 'team'].forEach(t => {
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
    ['team-archiv-suche', 'team-archiv-keine-treffer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (tab === 'team') {
        loadAndRenderTeamArchive();
    } else {
        // "lokal" (Mein Verlauf)
        document.getElementById('archive-list').style.display = 'block';
        renderArchiveList();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderArchive();

    ['lokal', 'team'].forEach(tab => {
        const btn = document.getElementById('tab-' + tab);
        if (btn) btn.addEventListener('click', () => switchVerlaufTab(tab));
    });

    const suchfeld = document.getElementById('team-archiv-suchfeld');
    if (suchfeld) suchfeld.addEventListener('input', renderTeamArchiveList);

    const btnTeamNeu = document.getElementById('team-archiv-neu-laden');
    if (btnTeamNeu) btnTeamNeu.addEventListener('click', loadAndRenderTeamArchive);
});
