// ==========================================================================
// ASiC Handel — Auswertung über alle archivierten Begehungen
// ==========================================================================

let auswertungArchiv = [];

async function loadAuswertungData() {
    try {
        auswertungArchiv = await getAllArchivedAudits();
    } catch (err) {
        console.error('Archiv konnte für die Auswertung nicht geladen werden:', err);
        auswertungArchiv = [];
    }
    renderWiederkehrend();
    renderKategorienSchwachstellen();
    renderVerlaufProMarkt();
    renderOffeneMassnahmen();
}

// ===== 1. Wiederkehrende Mängel (aktuell laufende Begehung vs. letzte archivierte desselben Marktes) =====
function renderWiederkehrend() {
    const container = document.getElementById('wiederkehrend-content');
    if (!container) return;
    const firma = (state.companyInfo && state.companyInfo.firma || '').trim();

    if (!firma) {
        container.innerHTML = '<p class="auswertung-empty">Für die aktuell laufende Begehung ist noch kein Markt eingetragen (Prüfkatalog-Seite → Betriebsdaten).</p>';
        return;
    }

    const previous = auswertungArchiv
        .filter(r => (r.companyInfo.firma || '').trim() === firma)
        .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!previous) {
        container.innerHTML = `<p class="auswertung-empty">Für „${escapeHtml(firma)}“ liegt noch keine archivierte Begehung zum Vergleich vor.</p>`;
        return;
    }

    const recurring = [];
    Object.keys(previous.ratings || {}).forEach(itemId => {
        if (previous.ratings[itemId] !== 'mangel') return;
        const currentRating = state.ratings[itemId];
        if (currentRating === 'mangel' || !currentRating) {
            const found = findItemById(itemId);
            if (found) recurring.push({ itemId, text: found.item.text, currentRating: currentRating || 'noch nicht bewertet' });
        }
    });

    const vorherDatum = formatDate(previous.companyInfo.datum) || new Date(previous.createdAt).toLocaleDateString('de-DE');

    if (recurring.length === 0) {
        container.innerHTML = `<div class="auswertung-good">✓ Keine wiederkehrenden Mängel gegenüber der letzten Begehung von „${escapeHtml(firma)}“ am ${vorherDatum}.</div>`;
        return;
    }

    container.innerHTML = `
        <p class="auswertung-hint">Diese Punkte waren bei der letzten Begehung von „${escapeHtml(firma)}“ am ${vorherDatum} bereits ein Mangel:</p>
        <table class="doku-table">
            <tr><th>Frage</th><th>Aktueller Status</th></tr>
            ${recurring.map(r => `<tr><td>[${r.itemId}] ${escapeHtml(r.text)}</td><td>${escapeHtml(r.currentRating)}</td></tr>`).join('')}
        </table>`;
}

// ===== 2. Kategorien-Schwachstellen über alle archivierten Begehungen =====
function renderKategorienSchwachstellen() {
    const container = document.getElementById('kategorien-content');
    if (!container) return;

    if (auswertungArchiv.length === 0) {
        container.innerHTML = '<p class="auswertung-empty">Noch keine archivierten Begehungen vorhanden.</p>';
        return;
    }

    const counts = {};
    AUDIT_CATEGORIES.forEach(cat => { counts[cat.name] = { mangel: 0, total: 0 }; });

    auswertungArchiv.forEach(record => {
        AUDIT_CATEGORIES.forEach(cat => {
            cat.items.forEach(item => {
                const rating = record.ratings ? record.ratings[item.id] : undefined;
                if (!rating || rating === 'na') return;
                counts[cat.name].total++;
                if (rating === 'mangel') counts[cat.name].mangel++;
            });
        });
    });

    const rows = Object.entries(counts)
        .filter(([, c]) => c.total > 0)
        .map(([name, c]) => ({ name, mangel: c.mangel, total: c.total, pct: Math.round((c.mangel / c.total) * 100) }))
        .sort((a, b) => b.pct - a.pct);

    if (rows.length === 0) {
        container.innerHTML = '<p class="auswertung-empty">Für die archivierten Begehungen liegen keine auswertbaren Antworten vor.</p>';
        return;
    }

    container.innerHTML = `
        <table class="doku-table">
            <tr><th>Kategorie</th><th>Mängelquote</th><th></th></tr>
            ${rows.map(r => `
                <tr>
                    <td>${escapeHtml(r.name)}</td>
                    <td>${r.mangel} / ${r.total} (${r.pct}%)</td>
                    <td><div class="auswertung-bar"><div class="auswertung-bar-fill" style="width:${r.pct}%"></div></div></td>
                </tr>`).join('')}
        </table>`;
}

// ===== 3. Verlauf pro Markt =====
function renderVerlaufProMarkt() {
    const container = document.getElementById('verlauf-markt-content');
    if (!container) return;

    if (auswertungArchiv.length === 0) {
        container.innerHTML = '<p class="auswertung-empty">Noch keine archivierten Begehungen vorhanden.</p>';
        return;
    }

    const byMarket = {};
    auswertungArchiv.forEach(r => {
        const firma = (r.companyInfo.firma || 'Ohne Markt-Angabe').trim();
        if (!byMarket[firma]) byMarket[firma] = [];
        byMarket[firma].push(r);
    });

    const marketNames = Object.keys(byMarket).sort();
    container.innerHTML = marketNames.map(firma => {
        const list = byMarket[firma].sort((a, b) => a.createdAt - b.createdAt);
        const entries = list.map((r, i) => {
            const stats = r.stats || { mangel: 0 };
            let trend = '';
            if (i > 0) {
                const prevMangel = (list[i - 1].stats || {}).mangel || 0;
                if (stats.mangel < prevMangel) trend = '<span class="trend-besser">▼ besser</span>';
                else if (stats.mangel > prevMangel) trend = '<span class="trend-schlechter">▲ schlechter</span>';
                else trend = '<span class="trend-gleich">– gleich</span>';
            }
            const datum = formatDate(r.companyInfo.datum) || new Date(r.createdAt).toLocaleDateString('de-DE');
            return `<li>${datum} — ${stats.mangel || 0} Mangel/Mängel ${trend}</li>`;
        }).join('');
        return `
            <div class="auswertung-market-block">
                <h4>${escapeHtml(firma)} <span class="auswertung-market-count">(${list.length} archivierte Begehung${list.length === 1 ? '' : 'en'})</span></h4>
                <ul class="auswertung-market-list">${entries}</ul>
            </div>`;
    }).join('');
}

// ===== 4. CSV-Export =====
function csvEscape(val) {
    const s = String(val === undefined || val === null ? '' : val);
    if (s.includes(';') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

function exportAuswertungCsv() {
    const rows = [['Firma', 'Datum', 'Kategorie', 'Frage-ID', 'Frage', 'Bewertung', 'Kommentar']];
    auswertungArchiv.forEach(record => {
        AUDIT_CATEGORIES.forEach(cat => {
            cat.items.forEach(item => {
                const rating = record.ratings ? record.ratings[item.id] : undefined;
                if (!rating) return;
                rows.push([
                    record.companyInfo.firma || '',
                    record.companyInfo.datum || '',
                    cat.name,
                    item.id,
                    item.text,
                    rating,
                    (record.comments && record.comments[item.id]) || ''
                ]);
            });
        });
    });

    if (rows.length === 1) {
        showToast('Keine archivierten Daten zum Exportieren vorhanden', 'error');
        return;
    }

    const csv = rows.map(r => r.map(csvEscape).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ASiC_Handel_Auswertung_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSV-Datei wird heruntergeladen');
}

// ===== 5. Offene Maßnahmen mit Fristen-Ampel =====
// Ampel nach Alter der Maßnahme statt manuell gepflegter Frist - berechnet
// aus dem Begehungsdatum, das ohnehin immer vorhanden ist. Löst das Problem,
// dass eine manuelle Frist in der Praxis selten gepflegt wird, ohne dass
// dafür zusätzlicher Aufwand entsteht.
function ampelStatus(begehungsDatum, today) {
    if (!begehungsDatum) return 'grau';
    const d = new Date(begehungsDatum);
    if (isNaN(d.getTime())) return 'grau';
    const alterTage = Math.round((today - d) / 86400000);
    if (alterTage > 60) return 'rot';
    if (alterTage >= 14) return 'orange';
    return 'gruen';
}

function renderOffeneMassnahmen() {
    const container = document.getElementById('offene-massnahmen-content');
    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allOpen = [];
    auswertungArchiv.forEach(record => {
        (record.measures || []).forEach(m => {
            if (m.status === 'erledigt') return;
            allOpen.push({
                firma: record.companyInfo.firma || '',
                begehungsDatum: record.companyInfo.datum || '',
                itemId: m.itemId,
                description: m.description,
                status: m.status,
                aktuell: false
            });
        });
    });
    // Aktuell laufende (noch nicht archivierte) Begehung ebenfalls einbeziehen
    (state.measures || []).forEach(m => {
        if (m.status === 'erledigt') return;
        allOpen.push({
            firma: (state.companyInfo && state.companyInfo.firma) || '',
            begehungsDatum: (state.companyInfo && state.companyInfo.datum) || '',
            itemId: m.itemId,
            description: m.description,
            status: m.status,
            aktuell: true
        });
    });

    if (allOpen.length === 0) {
        container.innerHTML = '<div class="auswertung-good">✓ Keine offenen Maßnahmen vorhanden.</div>';
        return;
    }

    allOpen.sort((a, b) => {
        if (!a.begehungsDatum && !b.begehungsDatum) return 0;
        if (!a.begehungsDatum) return 1;
        if (!b.begehungsDatum) return -1;
        return a.begehungsDatum.localeCompare(b.begehungsDatum);
    });

    const ampelLabel = { rot: 'Seit über 60 Tagen offen', orange: 'Seit 14–60 Tagen offen', gruen: 'Weniger als 14 Tage offen', grau: 'Kein Begehungsdatum' };

    container.innerHTML = `
        <table class="doku-table">
            <tr><th>Ampel</th><th>Markt</th><th>Maßnahme</th><th>Offen seit</th></tr>
            ${allOpen.map(m => {
                const ampel = ampelStatus(m.begehungsDatum, today);
                let seitText = '—';
                if (m.begehungsDatum) {
                    const d = new Date(m.begehungsDatum);
                    if (!isNaN(d.getTime())) {
                        const alterTage = Math.max(0, Math.round((today - d) / 86400000));
                        seitText = alterTage + ' Tag' + (alterTage === 1 ? '' : 'en');
                    }
                }
                return `<tr>
                    <td><span class="ampel-punkt ampel-${ampel}" title="${ampelLabel[ampel]}"></span></td>
                    <td>${escapeHtml(m.firma)}${m.aktuell ? ' <span class="auswertung-aktuell-tag">aktuell</span>' : ''}</td>
                    <td>${escapeHtml(m.description || '')}</td>
                    <td>${seitText}</td>
                </tr>`;
            }).join('')}
        </table>`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str === undefined || str === null ? '' : String(str);
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    loadAuswertungData();
    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) btnCsv.addEventListener('click', exportAuswertungCsv);
});
