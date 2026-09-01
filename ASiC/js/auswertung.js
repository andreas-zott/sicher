// ==========================================================================
// ASiC Handel — Auswertung über alle archivierten Begehungen
// ==========================================================================

let auswertungArchiv = [];

// null = "Alles", sonst Anzahl Monate rückwirkend ab heute.
let zeitraumMonate = null;

async function loadAuswertungData() {
    try {
        auswertungArchiv = await getAllArchivedAudits();
    } catch (err) {
        console.error('Archiv konnte für die Auswertung nicht geladen werden:', err);
        auswertungArchiv = [];
    }
    renderAlleAuswertungen();
}

// filterNachZeitraum() liegt jetzt in js/auswertung-logik.js (gemeinsam
// mit auswertung-team.js genutzt) - hier nur noch der Wrapper, der die
// Modulvariablen dieser Seite (auswertungArchiv, zeitraumMonate) einsetzt.

// Liefert die archivierten Begehungen, gefiltert auf den aktuell gewählten
// Zeitraum. Wird von den meisten Auswertungsbereichen sowie CSV- und
// PDF-Export genutzt. BEWUSST NICHT genutzt von "Wiederkehrende Mängel"
// (soll immer die tatsächlich letzte archivierte Begehung eines Marktes
// finden, unabhängig vom Zeitraum) und "Offene Maßnahmen" (ein altes,
// noch offenes Maßnahme wäre sonst ausgerechnet dann unsichtbar, wenn sie
// am dringendsten Aufmerksamkeit bräuchte).
function gefilterteArchivDaten() {
    return filterNachZeitraum(auswertungArchiv, zeitraumMonate);
}

function renderAlleAuswertungen() {
    renderWiederkehrend();
    renderGesamtverteilung();
    renderKategorienSchwachstellen();
    renderAuffaelligeMaerkte();
    renderVerlaufProMarkt();
    renderOffeneMassnahmen();
    updateZeitraumInfo();
}

function renderGesamtverteilung() {
    const container = document.getElementById('gesamtverteilung-content');
    if (!container) return;
    container.innerHTML = renderGesamtverteilungHtml(gefilterteArchivDaten());
}

function updateZeitraumInfo() {
    const info = document.getElementById('zeitraum-info');
    if (!info) return;
    const gefiltert = gefilterteArchivDaten().length;
    const gesamt = auswertungArchiv.length;
    info.textContent = zeitraumMonate === null
        ? `${gesamt} archivierte Begehung${gesamt === 1 ? '' : 'en'}`
        : `${gefiltert} von ${gesamt} archivierten Begehungen im gewählten Zeitraum`;
}

// ===== 1. Wiederkehrende Mängel (aktuell laufende Begehung vs. letzte archivierte desselben Marktes) =====
function renderWiederkehrend() {
    const container = document.getElementById('wiederkehrend-content');
    if (!container) return;
    const marktnummer = (state.companyInfo && state.companyInfo.marktnummer || '').trim();

    if (!marktnummer) {
        container.innerHTML = '<p class="auswertung-empty">Für die aktuell laufende Begehung ist noch kein Markt eingetragen (Prüfkatalog-Seite → Betriebsdaten).</p>';
        return;
    }

    const previous = auswertungArchiv
        .filter(r => (r.companyInfo.marktnummer || '').trim() === marktnummer)
        .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!previous) {
        container.innerHTML = `<p class="auswertung-empty">Für „${escapeHtml(marktnummer)}“ liegt noch keine archivierte Begehung zum Vergleich vor.</p>`;
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
        container.innerHTML = `<div class="auswertung-good">✓ Keine wiederkehrenden Mängel gegenüber der letzten Begehung von „${escapeHtml(marktnummer)}“ am ${vorherDatum}.</div>`;
        return;
    }

    container.innerHTML = `
        <p class="auswertung-hint">Diese Punkte waren bei der letzten Begehung von „${escapeHtml(marktnummer)}“ am ${vorherDatum} bereits ein Mangel:</p>
        <table class="doku-table">
            <tr><th>Frage</th><th>Aktueller Status</th></tr>
            ${recurring.map(r => `<tr><td>[${r.itemId}] ${escapeHtml(r.text)}</td><td>${escapeHtml(r.currentRating)}</td></tr>`).join('')}
        </table>`;
}

// ===== 2. Kategorien-Schwachstellen über alle archivierten Begehungen =====
// Reine Berechnungslogik liegt in js/auswertung-logik.js (gemeinsam mit
// verlauf.js genutzt) - hier nur noch der Zeitraum-Filter und die Bindung
// an den DOM-Container dieser Seite.
function renderKategorienSchwachstellen() {
    const container = document.getElementById('kategorien-content');
    if (!container) return;
    container.innerHTML = renderKategorienSchwachstellenHtml(gefilterteArchivDaten());
}

// ===== 2B. Auffällige Märkte (Ranking nach Mängelquote) =====
function renderAuffaelligeMaerkte() {
    const container = document.getElementById('auffaellige-maerkte-content');
    if (!container) return;
    container.innerHTML = renderAuffaelligeMaerkteHtml(gefilterteArchivDaten());
}

// ===== 3. Verlauf pro Markt =====
// Reine Berechnungslogik liegt in js/auswertung-logik.js.
function renderVerlaufProMarkt() {
    const container = document.getElementById('verlauf-markt-content');
    if (!container) return;
    container.innerHTML = renderVerlaufProMarktHtml(gefilterteArchivDaten());
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
    const rows = [['Marktnummer', 'Datum', 'Kategorie', 'Frage-ID', 'Frage', 'Bewertung', 'Kommentar']];
    daten.forEach(record => {
        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating) return;
            const found = findItemById(itemId);
            rows.push([
                record.companyInfo.marktnummer || '',
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
async function ladeAuswertungCsvZeilen(fehlermeldungKontext, datenOverride) {
    let daten;
    if (datenOverride) {
        daten = datenOverride;
    } else {
        try {
            daten = await getAllArchivedAudits();
        } catch (err) {
            console.error('Archiv konnte nicht geladen werden:', err);
            showToast(fehlermeldungKontext + ' fehlgeschlagen: Archiv konnte nicht geladen werden', 'error');
            return null;
        }
        daten = filterNachZeitraum(daten, zeitraumMonate);
    }

    const rows = buildAuswertungCsvRows(daten);

    if (rows.length === 1) {
        showToast('Keine archivierten Daten zum ' + fehlermeldungKontext + ' im gewählten Zeitraum vorhanden', 'error');
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

// ===== 4B. Gesamtauswertung als PDF =====
// Fasst Kategorien-Schwachstellen, auffaellige Maerkte und den
// Marktverlauf im gewaehlten Zeitraum als ein PDF zusammen. Nutzt
// bewusst dieselben berechne*()-Funktionen wie die Bildschirmanzeige,
// damit PDF und Anzeige garantiert dieselben Zahlen zeigen.
function auswertungPdfFilename() {
    const datum = new Date().toISOString().split('T')[0];
    return `ASiC_Handel_Gesamtauswertung_${datum}.pdf`;
}

// ===== PDF-Diagramme (dieselben Farben/Zahlen wie die SVGs am Bildschirm) =====
// jsPDF kennt keine Kreissegmente von Haus aus - die Torte wird deshalb aus
// vielen schmalen Dreiecken zusammengesetzt (Fächer-Prinzip), die bei
// ausreichend feiner Unterteilung rund wirken.

const PDF_DIAGRAMM_FARBEN = { ok: [47, 158, 100], mangel: [214, 69, 63], na: [124, 135, 144] };

function zeichneBalkendiagrammPdf(doc, rows, x, y, breite, hoehe) {
    if (rows.length === 0) return;
    const margenUnten = 16;
    const plotHoehe = hoehe - margenUnten;
    const abstand = breite / rows.length;
    const balkenBreite = Math.min(16, abstand * 0.6);

    doc.setDrawColor(223, 227, 230);
    doc.setLineWidth(0.2);
    doc.line(x, y + plotHoehe, x + breite, y + plotHoehe);

    rows.forEach((r, i) => {
        const bx = x + i * abstand + (abstand - balkenBreite) / 2;
        const balkenHoehe = Math.max(0.8, (r.pct / 100) * plotHoehe);
        const by = y + (plotHoehe - balkenHoehe);
        const farbe = r.pct >= 50 ? PDF_DIAGRAMM_FARBEN.mangel : (r.pct >= 20 ? [217, 119, 6] : PDF_DIAGRAMM_FARBEN.ok);
        doc.setFillColor(...farbe);
        doc.roundedRect(bx, by, balkenBreite, balkenHoehe, 0.8, 0.8, 'F');

        doc.setFont(undefined, 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(28, 34, 38);
        doc.text(`${r.pct}%`, bx + balkenBreite / 2, by - 1.5, { align: 'center' });

        const kurzName = r.name.length > 12 ? r.name.slice(0, 11) + '…' : r.name;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(91, 102, 112);
        doc.text(kurzName, bx + balkenBreite / 2, y + plotHoehe + 5, { align: 'center', angle: 35 });
    });
}

function zeichneTortendiagrammPdf(doc, verteilung, cx, cy, radius) {
    const { ok, mangel, na, total } = verteilung;
    if (total === 0) return;

    const segmente = [
        { wert: ok, farbe: PDF_DIAGRAMM_FARBEN.ok },
        { wert: mangel, farbe: PDF_DIAGRAMM_FARBEN.mangel },
        { wert: na, farbe: PDF_DIAGRAMM_FARBEN.na }
    ].filter(s => s.wert > 0);

    let startWinkel = -90;
    segmente.forEach(s => {
        const anteil = s.wert / total;
        const endWinkel = startWinkel + anteil * 360;
        doc.setFillColor(...s.farbe);
        const schrittGrad = 3;
        for (let w = startWinkel; w < endWinkel; w += schrittGrad) {
            const w2 = Math.min(w + schrittGrad, endWinkel);
            const x1 = cx + radius * Math.cos(w * Math.PI / 180);
            const y1 = cy + radius * Math.sin(w * Math.PI / 180);
            const x2 = cx + radius * Math.cos(w2 * Math.PI / 180);
            const y2 = cy + radius * Math.sin(w2 * Math.PI / 180);
            doc.triangle(cx, cy, x1, y1, x2, y2, 'F');
        }
        startWinkel = endWinkel;
    });
}

function zeichnePdfLegende(doc, segmente, x, y) {
    segmente.forEach(s => {
        doc.setFillColor(...s.farbe);
        doc.rect(x, y - 2.8, 3.2, 3.2, 'F');
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(28, 34, 38);
        doc.text(s.label, x + 5, y);
        y += 5.5;
    });
    return y;
}

async function buildAuswertungPdf(datenOverride, titel, zeitraumMonateOverride) {
    let daten;
    let effektiverZeitraum = zeitraumMonate;
    if (datenOverride) {
        daten = datenOverride;
        effektiverZeitraum = zeitraumMonateOverride !== undefined ? zeitraumMonateOverride : null;
    } else {
        try {
            daten = await getAllArchivedAudits();
        } catch (err) {
            throw new Error('Archiv konnte nicht geladen werden');
        }
        daten = filterNachZeitraum(daten, zeitraumMonate);
    }

    if (daten.length === 0) {
        throw new Error('Keine archivierten Daten im gewählten Zeitraum vorhanden');
    }

    if (!window.jspdf) {
        throw new Error('jsPDF-Bibliothek nicht geladen');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;

    // Kopfbereich (bewusst eigenständig, nicht drawCoverPage() aus app.js,
    // da diese an state.companyInfo einer EINZELNEN Begehung gebunden ist -
    // hier geht es um alle Märkte zusammen)
    doc.setFillColor(204, 7, 30);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(titel || 'Gesamtauswertung', pageWidth / 2, 22, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const zeitraumText = effektiverZeitraum === null ? 'Gesamter bisheriger Zeitraum' : `Letzte ${effektiverZeitraum} Monate`;
    doc.text(zeitraumText, pageWidth / 2, 30, { align: 'center' });

    let y = 55;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
        `Erstellt am ${new Date().toLocaleDateString('de-DE')} · ${daten.length} archivierte Begehung${daten.length === 1 ? '' : 'en'} ausgewertet`,
        pageWidth / 2, y, { align: 'center' }
    );
    y += 16;

    function ueberschrift(text) {
        if (y > pageHeight - 30) { doc.addPage(); y = 18; }
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(28, 34, 38);
        doc.text(text, margin, y);
        y += 8;
    }

    function zeile(links, rechts, farbe) {
        if (y > pageHeight - 18) { doc.addPage(); y = 18; }
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(farbe[0], farbe[1], farbe[2]);
        doc.text(links, margin, y);
        if (rechts) {
            doc.setTextColor(100, 116, 139);
            doc.text(rechts, pageWidth - margin, y, { align: 'right' });
        }
        y += 6;
    }

    // Gesamtverteilung (Torte)
    ueberschrift('Gesamtverteilung');
    const verteilung = berechneGesamtverteilung(daten);
    if (verteilung.total === 0) {
        zeile('Keine auswertbaren Antworten im gewählten Zeitraum.', null, [100, 116, 139]);
    } else {
        const tortenRadius = 20;
        const tortenCx = margin + tortenRadius;
        const tortenCy = y + tortenRadius;
        zeichneTortendiagrammPdf(doc, verteilung, tortenCx, tortenCy, tortenRadius);
        const legendeSegmente = [
            { farbe: PDF_DIAGRAMM_FARBEN.ok, label: `In Ordnung: ${verteilung.ok} (${Math.round(verteilung.ok / verteilung.total * 100)}%)` },
            { farbe: PDF_DIAGRAMM_FARBEN.mangel, label: `Mangel: ${verteilung.mangel} (${Math.round(verteilung.mangel / verteilung.total * 100)}%)` },
            { farbe: PDF_DIAGRAMM_FARBEN.na, label: `Nicht vorhanden: ${verteilung.na} (${Math.round(verteilung.na / verteilung.total * 100)}%)` }
        ].filter(s => s.label.match(/: (\d+)/)[1] !== '0');
        zeichnePdfLegende(doc, legendeSegmente, tortenCx + tortenRadius + 12, y + 8);
        y += tortenRadius * 2 + 10;
    }

    // Kategorien-Schwachstellen
    ueberschrift('Kategorien-Schwachstellen');
    const kategorienRows = berechneKategorienSchwachstellen(daten);
    if (kategorienRows.length === 0) {
        zeile('Keine auswertbaren Antworten im gewählten Zeitraum.', null, [100, 116, 139]);
    } else {
        if (y + 62 > pageHeight - 20) { doc.addPage(); y = 18; }
        zeichneBalkendiagrammPdf(doc, kategorienRows, margin, y, pageWidth - margin * 2, 55);
        y += 62;
        kategorienRows.forEach(r => zeile(r.name, `${r.mangel}/${r.total} (${r.pct}%)`, [28, 34, 38]));
    }
    y += 8;

    // Auffällige Märkte
    ueberschrift('Auffällige Märkte');
    const { durchschnitt, auffaellig } = berechneAuffaelligeMaerkte(daten);
    zeile(`Durchschnittliche Mängelquote: ${Math.round(durchschnitt)}%`, null, [100, 116, 139]);
    if (auffaellig.length === 0) {
        zeile('Kein Markt liegt über dem Durchschnitt.', null, [50, 140, 90]);
    } else {
        auffaellig.forEach(m => zeile(m.name, `${m.mangel}/${m.total} (${Math.round(m.pct)}%)`, [28, 34, 38]));
    }
    y += 8;

    // Verlauf pro Markt (kompakt)
    ueberschrift('Verlauf pro Markt');
    const markets = berechneVerlaufProMarkt(daten);
    const trendKlartext = { besser: '(besser)', schlechter: '(schlechter)', gleich: '(gleich)' };
    markets.forEach(({ marktnummer, entries }) => {
        if (y > pageHeight - 25) { doc.addPage(); y = 18; }
        doc.setFont(undefined, 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(28, 34, 38);
        doc.text(marktnummer, margin, y);
        y += 5.5;
        entries.forEach(e => {
            const text = `  ${e.datum} — ${e.mangel} Mangel/Mängel ${e.trend ? trendKlartext[e.trend] : ''}`;
            zeile(text, null, [80, 90, 98]);
        });
        y += 3;
    });

    // Seitenzahlen
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return doc;
}

async function exportAuswertungPdf() {
    try {
        showToast('PDF wird erzeugt…');
        const doc = await buildAuswertungPdf();
        doc.save(auswertungPdfFilename());
        showToast('PDF heruntergeladen');
    } catch (err) {
        console.error('PDF-Export fehlgeschlagen:', err);
        showToast('PDF-Export fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function shareAuswertungPdf() {
    let doc;
    try {
        doc = await buildAuswertungPdf();
    } catch (err) {
        console.error('PDF-Erzeugung fehlgeschlagen:', err);
        showToast('PDF-Erzeugung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
        return;
    }

    const filename = auswertungPdfFilename();
    const blob = doc.output('blob');
    const zeitraumText = zeitraumMonate === null ? 'den gesamten bisherigen Zeitraum' : `die letzten ${zeitraumMonate} Monate`;
    const text = `Anbei die Gesamtauswertung (Kategorien-Schwachstellen, auffällige Märkte, Marktverlauf) für ${zeitraumText}.`;

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'ASiC Handel – Gesamtauswertung', text });
                    showToast('PDF geteilt');
                    return;
                } catch (err) {
                    if (err && err.name === 'AbortError') return;
                    console.error('Teilen fehlgeschlagen, falle auf Download zurück:', err);
                }
            }
        }
        doc.save(filename);
        showToast('PDF heruntergeladen (Teilen auf diesem Gerät nicht verfügbar)');
    } catch (err) {
        console.error('PDF-Teilen fehlgeschlagen:', err);
        showToast('PDF-Teilen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
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
                marktnummer: record.companyInfo.marktnummer || '',
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
            marktnummer: (state.companyInfo && state.companyInfo.marktnummer) || '',
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
                    <td>${escapeHtml(m.marktnummer)}${m.aktuell ? ' <span class="auswertung-aktuell-tag">aktuell</span>' : ''}</td>
                    <td>${escapeHtml(m.description || '')}</td>
                    <td>${seitText}</td>
                </tr>`;
            }).join('')}
        </table>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadAuswertungData();
    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) btnCsv.addEventListener('click', exportAuswertungCsv);
    const btnShareCsv = document.getElementById('btn-share-csv');
    if (btnShareCsv) btnShareCsv.addEventListener('click', shareAuswertungCsv);

    const btnPdf = document.getElementById('btn-export-auswertung-pdf');
    if (btnPdf) btnPdf.addEventListener('click', exportAuswertungPdf);
    const btnSharePdf = document.getElementById('btn-share-auswertung-pdf');
    if (btnSharePdf) btnSharePdf.addEventListener('click', shareAuswertungPdf);

    const zeitraumSelect = document.getElementById('zeitraum-filter');
    if (zeitraumSelect) {
        zeitraumSelect.addEventListener('change', () => {
            const val = zeitraumSelect.value;
            zeitraumMonate = val === 'alle' ? null : parseInt(val, 10);
            renderAlleAuswertungen();
        });
    }
});
