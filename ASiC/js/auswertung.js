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
// Wie beim CSV-Export: iteriert ueber die in jeder Begehung selbst
// gespeicherten Bewertungs-Schluessel, nicht ueber den aktuellen Katalog
// (siehe ausfuehrlicher Kommentar bei buildAuswertungCsvRows()).
function renderKategorienSchwachstellen() {
    const container = document.getElementById('kategorien-content');
    if (!container) return;

    if (auswertungArchiv.length === 0) {
        container.innerHTML = '<p class="auswertung-empty">Noch keine archivierten Begehungen vorhanden.</p>';
        return;
    }

    const counts = {};

    auswertungArchiv.forEach(record => {
        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating || rating === 'na') return;

            const found = findItemById(itemId);
            const kategorieName = found ? found.category.name : '(Kategorie nicht mehr im aktuellen Katalog)';

            if (!counts[kategorieName]) counts[kategorieName] = { mangel: 0, total: 0 };
            counts[kategorieName].total++;
            if (rating === 'mangel') counts[kategorieName].mangel++;
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

// Baut die Zeilen fuer den CSV-Rohdatenexport aus einer Liste archivierter
// Begehungen. Gemeinsam genutzt von "Herunterladen" und "Per Mail teilen",
// damit beide garantiert denselben Inhalt liefern.
//
// WICHTIG: iteriert bewusst ueber die in JEDER Begehung selbst gespeicherten
// Bewertungs-Schluessel (record.ratings), NICHT ueber den aktuellen
// AUDIT_CATEGORIES-Katalog. Bei einer Suche ueber den aktuellen Katalog
// wuerden archivierte Begehungen mit inzwischen anders nummerierten oder
// entfernten Frage-IDs faelschlich als "keine Daten" erscheinen, obwohl die
// Bewertungen sehr wohl gespeichert sind - genau das Verhalten, das schon
// bei "Wiederkehrende Maengel" bewusst so (ueber Object.keys) gebaut wurde.
function buildAuswertungCsvRows(daten) {
    const rows = [['Firma', 'Datum', 'Kategorie', 'Frage-ID', 'Frage', 'Bewertung', 'Kommentar']];
    daten.forEach(record => {
        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating) return;
            const found = findItemById(itemId);
            rows.push([
                record.companyInfo.firma || '',
                record.companyInfo.datum || '',
                found ? found.category.name : '(Kategorie nicht mehr im aktuellen Katalog)',
                itemId,
                found ? found.item.text : '(Frage nicht mehr im aktuellen Katalog)',
                rating,
                (record.comments && record.comments[itemId]) || ''
            ]);
        });
    });
    return rows;
}

function csvRowsToBlob(rows) {
    const csv = rows.map(r => r.map(csvEscape).join(';')).join('\r\n');
    return new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
}

function csvExportFilename() {
    return 'ASiC_Handel_Auswertung_' + new Date().toISOString().split('T')[0] + '.csv';
}

// Laedt das Archiv frisch (nicht die evtl. noch nicht fertig geladene
// auswertungArchiv-Modulvariable, siehe Kommentar weiter unten) und liefert
// die fertigen CSV-Zeilen, oder null bei einem Ladefehler bzw. wenn es
// nichts zu exportieren gibt (inkl. passender Toast-Meldung).
async function ladeAuswertungCsvZeilen(fehlermeldungKontext) {
    let daten;
    try {
        daten = await getAllArchivedAudits();
    } catch (err) {
        console.error('Archiv konnte nicht geladen werden:', err);
        showToast(fehlermeldungKontext + ' fehlgeschlagen: Archiv konnte nicht geladen werden', 'error');
        return null;
    }

    const rows = buildAuswertungCsvRows(daten);

    if (rows.length === 1) {
        showToast('Keine archivierten Daten zum ' + fehlermeldungKontext + ' vorhanden', 'error');
        return null;
    }

    return rows;
}

async function exportAuswertungCsv() {
    // Bewusst hier nochmal frisch laden statt sich auf die schon vorhandene
    // auswertungArchiv-Variable zu verlassen: Falls der Klick erfolgt,
    // bevor das anfängliche asynchrone Laden beim Seitenaufruf fertig war,
    // waere auswertungArchiv sonst faelschlich noch leer gewesen, obwohl
    // tatsaechlich archivierte Begehungen vorhanden sind.
    const rows = await ladeAuswertungCsvZeilen('Exportieren');
    if (!rows) return;

    const blob = csvRowsToBlob(rows);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = csvExportFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSV-Datei wird heruntergeladen');
}

// Teilt die CSV-Rohdaten ueber das native Teilen-Menue (z. B. direkt an
// die Mail-App) - fuer den Fall, dass kein Zugriff auf das NAS besteht und
// die Datei stattdessen manuell per Mail an eine Kollegin/einen Kollegen
// weitergegeben werden soll, die/der sie im Team-Ordner ablegt.
async function shareAuswertungCsv() {
    const rows = await ladeAuswertungCsvZeilen('Teilen');
    if (!rows) return;

    const blob = csvRowsToBlob(rows);
    const filename = csvExportFilename();
    const text = 'Anbei der aktuelle Rohdaten-Export (CSV) der archivierten Begehungen aus ASiC Handel.\n\nBitte im gemeinsamen Team-Ordner ablegen, falls der direkte NAS-Zugriff gerade nicht möglich war.';

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'text/csv' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'ASiC Handel – Rohdaten-Export', text });
                    showToast('CSV geteilt');
                    return;
                } catch (err) {
                    if (err && err.name === 'AbortError') return; // Nutzer hat abgebrochen
                    console.error('Teilen fehlgeschlagen, falle auf Download zurück:', err);
                }
            }
        }

        // Fallback: direkter Download (Desktop-Browser ohne Teilen-Funktion)
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('CSV-Datei wird heruntergeladen (Teilen auf diesem Gerät nicht verfügbar)');
    } catch (err) {
        console.error('CSV-Teilen fehlgeschlagen:', err);
        showToast('CSV-Teilen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
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
    const btnShareCsv = document.getElementById('btn-share-csv');
    if (btnShareCsv) btnShareCsv.addEventListener('click', shareAuswertungCsv);
});
