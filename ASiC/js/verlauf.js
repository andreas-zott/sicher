// ==========================================================================
// ASiC Handel — Verlauf (archivierte Begehungen)
// ==========================================================================

let archiveCache = [];

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

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderArchive();
});
