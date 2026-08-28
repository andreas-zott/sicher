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

function switchVerlaufTab(tab) {
    const tabLokal = document.getElementById('tab-lokal');
    const tabTeam = document.getElementById('tab-team');
    const archiveList = document.getElementById('archive-list');
    const noArchive = document.getElementById('no-archive');
    const teamList = document.getElementById('team-archive-list');
    const noTeam = document.getElementById('no-team-archive');
    const teamLoading = document.getElementById('team-archive-loading');
    const teamUnavailable = document.getElementById('team-archive-unavailable');

    if (tab === 'team') {
        tabTeam.classList.add('active');
        tabLokal.classList.remove('active');

        archiveList.style.display = 'none';
        noArchive.style.display = 'none';

        loadAndRenderTeamArchive();
    } else {
        tabLokal.classList.add('active');
        tabTeam.classList.remove('active');

        teamList.style.display = 'none';
        noTeam.style.display = 'none';
        teamLoading.style.display = 'none';
        teamUnavailable.style.display = 'none';

        // Beim Wechsel zu "team" wird archive-list auf display:none gesetzt -
        // das muss beim Zurueckwechseln wieder aufgehoben werden, sonst
        // bleibt die Liste dauerhaft unsichtbar (renderArchiveList() selbst
        // aendert nur den Inhalt, nicht die Sichtbarkeit des Containers).
        archiveList.style.display = 'block';

        renderArchiveList();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderArchive();

    const tabLokal = document.getElementById('tab-lokal');
    const tabTeam = document.getElementById('tab-team');
    if (tabLokal) tabLokal.addEventListener('click', () => switchVerlaufTab('lokal'));
    if (tabTeam) tabTeam.addEventListener('click', () => switchVerlaufTab('team'));
});
