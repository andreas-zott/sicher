// ==========================================================================
// BEGEHUNGSLISTE — Gemeinsame App-Logik (State, Checkliste, Betriebsdaten)
// Wird auf index.html UND massnahmen.html geladen — alle DOM-Zugriffe sind
// deshalb per Null-Check abgesichert, damit keine Seite die andere stoert.
// ==========================================================================

const STORAGE_KEY = 'begehungState';

// Revisionsstand der App/Checkliste (in Fusszeile und PDF sichtbar,
// bei inhaltlichen Aenderungen an Fragenkatalog/Massnahmen hochzaehlen)
const APP_REVISION = '2.0';
const APP_REVISION_DATE = '2026-08-21';

function renderFooterMeta() {
    const el = document.getElementById('footer-version');
    if (el) el.textContent = `Rev. ${APP_REVISION} · Stand ${formatDate(APP_REVISION_DATE)}`;

    const copyright = document.getElementById('footer-copyright');
    if (copyright) copyright.innerHTML = '© 2026 Andreas Zott – Alle Rechte vorbehalten<br>(Sifa) Arbeitssicherheit 2026';
}

function defaultState() {
    return {
        companyInfo: {
            firma: '',
            standort: '',
            datum: new Date().toISOString().split('T')[0],
            pruefername: '',
            marktleitung: '',
            teilnehmer: ''
        },
        ratings: {},
        comments: {},
        measures: [],
        signatures: {
            pruefer: null,
            marktleitung: null
        },
        notApplicable: {}
    };
}

let state = defaultState();
let openCategoryId = null;

// ===== State laden/speichern =====
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        state = {
            companyInfo: { ...defaultState().companyInfo, ...(data.companyInfo || {}) },
            ratings: data.ratings || {},
            comments: data.comments || {},
            measures: data.measures || [],
            signatures: { ...defaultState().signatures, ...(data.signatures || {}) },
            notApplicable: data.notApplicable || {}
        };
    } catch (e) {
        console.error('ASiC Handel: Zustand konnte nicht geladen werden:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (e) {
        console.error('ASiC Handel: Zustand konnte nicht gespeichert werden:', e);
        return false;
    }
}

// ===== Hilfsfunktionen =====
function findItemById(itemId) {
    for (const category of AUDIT_CATEGORIES) {
        const item = category.items.find(i => i.id === itemId);
        if (item) return { item, category };
    }
    return null;
}

// getMeasureText(itemId, style) und setMeasureStyle(style) werden von js/text.js bereitgestellt.

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('de-DE');
}

function totalItemCount() {
    return AUDIT_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
}

function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), type === 'error' ? 6000 : 2600);
}

// ===== Vorgefertigter Mail-Text beim PDF-Versand =====
// Traegt automatisch Markt (aus "Firma / Markt") und den Namen des Pruefers ein.
// Wird von allen drei PDF-Varianten (Checkliste, Massnahmen, Gesamtbericht) genutzt.
function buildShareEmailSubject() {
    const markt = state.companyInfo.firma || '-';
    return `Arbeitssicherheitsbegehung Markt ${markt}`;
}

function buildShareEmailText() {
    const markt = state.companyInfo.firma || '-';
    const pruefer = state.companyInfo.pruefername ? state.companyInfo.pruefername + '\n' : '';
    return `Sehr geehrte Damen und Herren,\n\nim Rahmen der turnusmäßigen Arbeitssicherheitsbegehung übersende ich Ihnen anbei das Begehungsprotokoll des Marktes ${markt} zur sachlichen Prüfung.\n\nBitte prüfen Sie die dokumentierten Feststellungen und veranlassen Sie die Umsetzung der erforderlichen Maßnahmen.\n\nMit freundlichen Grüßen\n${pruefer}Fachkraft für Arbeitssicherheit (SiFa)`;
}

// Zuverlaessige Alternative zu navigator.share() fuer Betreff/Text:
// iOS uebernimmt title/text beim Teilen an die Mail-App oft nicht zuverlaessig.
// mailto: oeffnet eine neue Mail mit korrekt befuelltem Betreff/Text - kann aber
// aus einer Web-App heraus keinen Anhang setzen.
function openPrefilledMail() {
    const subject = encodeURIComponent(buildShareEmailSubject());
    const body = encodeURIComponent(buildShareEmailText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ===== Aufklappbares Menü (generisch, fuer Export- UND Datei-Menü nutzbar) =====
function initDropdownMenu(toggleId, panelId) {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return;

    function closeMenu() {
        panel.classList.remove('open');
        document.removeEventListener('click', onOutsideClick);
    }

    function onOutsideClick(e) {
        if (!panel.contains(e.target) && e.target !== toggle) closeMenu();
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !panel.classList.contains('open');
        panel.classList.toggle('open', willOpen);
        if (willOpen) {
            document.addEventListener('click', onOutsideClick);
        } else {
            document.removeEventListener('click', onOutsideClick);
        }
    });

    // Menü nach Auswahl eines Punktes automatisch wieder schliessen
    panel.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

// ===== Export-Menü: Modus-Auswahl (Checkliste / Maßnahmen / Beide) + Aktionen =====
// Auf beiden Seiten identisch nutzbar - Vorauswahl richtet sich danach, auf
// welcher Seite man sich gerade befindet (erkennbar an den vorhandenen Elementen).
let exportMode = document.getElementById('measures-container') ? 'massnahmen'
    : document.getElementById('photo-grid') ? 'fotos'
    : 'checkliste';

function initExportMenu() {
    initDropdownMenu('export-menu-toggle', 'export-menu-panel');

    const panel = document.getElementById('export-menu-panel');
    if (!panel) return;

    const modeButtons = panel.querySelectorAll('.mode-btn');

    function updateModeButtons() {
        modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === exportMode));
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMode = btn.dataset.mode;
            updateModeButtons();
        });
    });
    updateModeButtons();

    const btnPrint = panel.querySelector('[data-action="print"]');
    if (btnPrint) btnPrint.addEventListener('click', () => printReport(exportMode));

    const btnShare = panel.querySelector('[data-action="share"]');
    if (btnShare) btnShare.addEventListener('click', () => shareReportPdf(exportMode));

    const btnMail = panel.querySelector('[data-action="mail"]');
    if (btnMail) btnMail.addEventListener('click', openPrefilledMail);
}

// ===== PDF teilen (iPad-Teilen-Menü, inkl. AirPrint) mit Download-Fallback =====
// Gemeinsam genutzt von der Checkliste (app.js) und den Maßnahmen (massnahmen.js).
// Bewaehrter Trick (aus dem Schwesterprojekt): navigator.share() mit der PDF-Datei
// oeffnet z. B. Mail bereits mit Anhang; unmittelbar danach zusaetzlich per mailto:
// den vollstaendigen Betreff/Text nachreichen - Mail uebernimmt das in denselben,
// bereits offenen Entwurf und behaelt dabei den Anhang. Nur der Betreff wird von
// Mail auf iOS dabei meist nicht mehr uebernommen (bekannte Einschraenkung).
async function sharePdfDoc(doc, filename, shareTitle) {
    try {
        const blob = doc.output('blob');

        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: shareTitle, text: 'PDF im Anhang' });
                    showToast('PDF geteilt');
                    openPrefilledMail();
                    return;
                } catch (err) {
                    if (err && err.name === 'AbortError') return; // Nutzer hat abgebrochen
                    console.error('Teilen fehlgeschlagen, falle auf Download zurück:', err);
                }
            }
        }

        // Fallback: direkter Download (Desktop-Browser ohne Teilen-Funktion)
        doc.save(filename);
        showToast('PDF heruntergeladen');
    } catch (err) {
        console.error('PDF-Erzeugung fehlgeschlagen:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// ===== Checkliste als PDF-Karten-Text rendern (kompakt, fuer bis zu ~160 Fragen) =====
// Wird sowohl fuer den eigenstaendigen Checklisten-Export als auch optional
// fuer den kombinierten Bericht auf der Maßnahmen-Seite genutzt.
function renderChecklistPdfSection(doc, yStart, margin, contentWidth, pageHeight) {
    let y = yStart;
    const ratingLabel = { ok: 'OK', mangel: 'MANGEL', na: 'N.V.' };
    const ratingColor = { ok: [47, 158, 100], mangel: [204, 7, 30], na: [124, 135, 144] };
    const textX = margin + 20;
    const textWidth = contentWidth - 20;

    AUDIT_CATEGORIES.forEach(category => {
        if (y + 12 > pageHeight - 18) {
            doc.addPage();
            y = 18;
        }

        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.setTextColor(28, 34, 38);
        doc.text(category.name, margin, y);
        y += 3;
        doc.setDrawColor(220);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5.5;

        category.items.forEach(item => {
            const rating = state.ratings[item.id] || '';
            const comment = state.comments[item.id] || '';

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8.5);
            const lines = doc.splitTextToSize(`${item.id}  ${item.text}`, textWidth);
            const commentLines = (rating === 'mangel' && comment)
                ? doc.splitTextToSize('→ ' + comment, textWidth - 4)
                : [];

            // Seitenumbruch pruefen, bevor die Frage (inkl. Rating-Badge) beginnt
            if (y + 4.2 > pageHeight - 16) {
                doc.addPage();
                y = 18;
            }

            const badgeY = y - 3.2;
            const color = ratingColor[rating] || [190, 195, 200];
            doc.setFillColor(color[0], color[1], color[2]);
            doc.roundedRect(margin, badgeY, 16, 4.4, 1, 1, 'F');
            doc.setFont(undefined, 'bold');
            doc.setFontSize(6.2);
            doc.setTextColor(255, 255, 255);
            doc.text(rating ? ratingLabel[rating] : '–', margin + 8, y - 0.2, { align: 'center' });

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);

            lines.forEach((line, i) => {
                if (i > 0 && y + 4.2 > pageHeight - 16) {
                    doc.addPage();
                    y = 18;
                }
                doc.text(line, textX, y);
                y += 4.2;
            });

            if (commentLines.length) {
                doc.setFontSize(8);
                doc.setTextColor(150, 60, 55);
                commentLines.forEach(line => {
                    if (y + 3.8 > pageHeight - 16) {
                        doc.addPage();
                        y = 18;
                    }
                    doc.text(line, textX, y);
                    y += 3.8;
                });
                doc.setTextColor(30, 41, 59);
            }

            y += 2.4;
        });

        y += 4;
    });

    return y;
}

function checklistPdfHeaderLines() {
    const ci = state.companyInfo;
    const teilnehmer = ci.teilnehmer || '-';
    return [
        `Firma/Markt: ${ci.firma || '-'}    Standort: ${ci.standort || '-'}    Datum: ${ci.datum ? formatDate(ci.datum) : '-'}`,
        `Prüfer: ${ci.pruefername || '-'}    Marktleitung: ${ci.marktleitung || '-'}    Teilnehmer: ${teilnehmer}`
    ];
}

// ===== Deckblatt (Titelseite mit Betriebsdaten), wird jedem PDF vorangestellt =====
function drawCoverPage(doc, pageWidth, pageHeight, margin, documentTitle, documentSubtitle) {
    // Roter Kopfbalken mit Markenname
    doc.setFillColor(204, 7, 30);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('ASiC Handel', pageWidth / 2, 24, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('Arbeitssicherheits-Check', pageWidth / 2, 33, { align: 'center' });

    let y = 80;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(28, 34, 38);
    doc.text(documentTitle, pageWidth / 2, y, { align: 'center' });
    y += 8;
    if (documentSubtitle) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(120, 130, 138);
        doc.text(documentSubtitle, pageWidth / 2, y, { align: 'center' });
        y += 14;
    } else {
        y += 14;
    }

    // Betriebsdaten zentriert als Liste
    const ci = state.companyInfo;
    const rows = [
        ['Firma / Markt', ci.firma || '-'],
        ['Standort', ci.standort || '-'],
        ['Datum', ci.datum ? formatDate(ci.datum) : '-'],
        ['Prüfer', ci.pruefername || '-'],
        ['Marktleitung', ci.marktleitung || '-'],
        ['Teilnehmer', ci.teilnehmer || '-']
    ];

    const boxWidth = 120;
    const boxX = (pageWidth - boxWidth) / 2;

    rows.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(140, 148, 155);
        doc.text(label.toUpperCase(), boxX, y);
        y += 5.5;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(12.5);
        doc.setTextColor(28, 34, 38);
        const lines = doc.splitTextToSize(String(value), boxWidth);
        doc.text(lines, boxX, y);
        y += lines.length * 5.5 + 2;
        doc.setDrawColor(225);
        doc.setLineWidth(0.25);
        doc.line(boxX, y, boxX + boxWidth, y);
        y += 9;
    });

    // Statistik: Status der Begehung als horizontaler Segmentbalken + Legende
    y = drawCoverStats(doc, y, pageWidth, boxX, boxWidth);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(150);
    const erstellt = new Date().toISOString().split('T')[0];
    doc.text(`ASiC Handel Rev. ${APP_REVISION} · Erstellt am ${formatDate(erstellt)}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    doc.addPage();
}

// Segmentbalken (OK/Mangel/N.V./Offen) + Legende mit Zahlen und Prozentwerten,
// spiegelt dieselbe Berechnung wie die Fortschrittsanzeige auf der Checkliste-Seite.
function drawCoverStats(doc, y, pageWidth, boxX, boxWidth) {
    const { total, ok, mangel, na, offen, answered } = computeStats();
    if (total === 0) return y;

    y += 6;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(80, 88, 95);
    doc.text('STATUS DER BEGEHUNG', boxX, y);
    doc.setFont(undefined, 'normal');
    doc.text(`${answered} / ${total} geprüft`, boxX + boxWidth, y, { align: 'right' });
    y += 5;

    // Segmentbalken
    const barHeight = 6;
    const segments = [
        { value: ok, color: [47, 158, 100] },      // Gruen - In Ordnung
        { value: mangel, color: [214, 69, 63] },   // Rot - Mangel
        { value: na, color: [124, 135, 144] },     // Grau - N.V.
        { value: offen, color: [222, 226, 229] }   // Hellgrau - noch offen
    ];
    let segX = boxX;
    segments.forEach(seg => {
        const segWidth = (seg.value / total) * boxWidth;
        if (segWidth > 0) {
            doc.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
            doc.rect(segX, y, segWidth, barHeight, 'F');
        }
        segX += segWidth;
    });
    doc.setDrawColor(210);
    doc.setLineWidth(0.25);
    doc.rect(boxX, y, boxWidth, barHeight, 'S');
    y += barHeight + 7;

    // Legende: vier Spalten mit Farbpunkt, Label und Anzahl
    const legend = [
        { label: 'In Ordnung', value: ok, color: [47, 158, 100] },
        { label: 'Mangel', value: mangel, color: [214, 69, 63] },
        { label: 'N.V.', value: na, color: [124, 135, 144] },
        { label: 'Offen', value: offen, color: [180, 186, 191] }
    ];
    const colWidth = boxWidth / legend.length;
    legend.forEach((item, i) => {
        const x = boxX + i * colWidth;
        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.circle(x + 1.5, y - 1, 1.5, 'F');
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.setTextColor(28, 34, 38);
        doc.text(String(item.value), x + 5, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 130, 138);
        doc.text(item.label, x + 5, y + 4);
    });
    y += 12;

    return y;
}

// Zeichnet bis zu 4 Fotos pro DIN-A4-Seite (2x2-Raster) inkl. Kommentarzeile in
// ein bereits geoeffnetes jsPDF-Dokument, beginnend bei der uebergebenen
// Y-Position. Foto-Blobs kommen aus IndexedDB, daher async. Legt bei Bedarf
// automatisch neue Seiten an (max. 4 Fotos je Seite).
async function renderFotosSection(doc, yStart, margin, contentWidth, pageHeight, photos) {
    let y = yStart;

    if (!photos || photos.length === 0) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text('Keine Fotos erfasst.', margin, y);
        return y + 10;
    }

    const gapX = 8;
    const gapY = 10;
    const cellWidth = (contentWidth - gapX) / 2;
    const imageHeight = 62;
    const commentHeight = 16;
    const cellHeight = imageHeight + commentHeight + 6;
    const pageStartY = y;

    for (let i = 0; i < photos.length; i++) {
        const posOnPage = i % 4;
        const col = posOnPage % 2;
        const row = Math.floor(posOnPage / 2);

        if (posOnPage === 0 && i > 0) {
            doc.addPage();
            y = pageStartY;
        }

        const cellX = margin + col * (cellWidth + gapX);
        const cellY = y + row * (cellHeight + gapY);
        const photo = photos[i];

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(cellX, cellY, cellWidth, cellHeight, 2, 2, 'S');

        try {
            const dataUrl = await blobToDataUrl(photo.blob);
            const dims = await getImageDimensions(dataUrl);
            const fit = fitImage(dims.width, dims.height, cellWidth - 4, imageHeight - 4);
            const imgX = cellX + (cellWidth - fit.width) / 2;
            const imgY = cellY + 2 + (imageHeight - 4 - fit.height) / 2;
            doc.addImage(dataUrl, 'JPEG', imgX, imgY, fit.width, fit.height);
        } catch (e) {
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
            doc.setTextColor(180);
            doc.text('Bild konnte nicht geladen werden', cellX + 3, cellY + imageHeight / 2);
        }

        doc.setFont(undefined, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const commentText = photo.comment && photo.comment.trim() ? photo.comment : '(kein Kommentar)';
        const commentLines = doc.splitTextToSize(commentText, cellWidth - 6).slice(0, 3);
        doc.text(commentLines, cellX + 3, cellY + imageHeight + 6);
    }

    // Y-Position ans Ende des zuletzt genutzten Rasters setzen (fuer evtl. nachfolgenden Inhalt)
    const lastRow = Math.floor(((photos.length - 1) % 4) / 2);
    return pageStartY + (lastRow + 1) * (cellHeight + gapY) + 4;
}

// Eigenstaendiger Foto-PDF-Export (Modus "fotos"): Deckblatt mit Bezug zur
// Begehungsliste + alle Fotos im 2x2-Raster. Async, da Fotos aus IndexedDB
// geladen werden.
async function buildFotosPdf() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 14;
    const contentWidth = pageWidth - margin * 2;

    drawCoverPage(doc, pageWidth, pageHeight, margin, 'Fotodokumentation', 'Begehungsprotokoll – Bildanhang');

    let y = 18;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text('ASiC Handel – Fotodokumentation', pageWidth / 2, y, { align: 'center' });
    y += 9;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 100, 108);
    checklistPdfHeaderLines().forEach(line => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 5;
    });
    y += 1;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    const photos = await getAllPhotos();
    await renderFotosSection(doc, y, margin, contentWidth, pageHeight, photos);

    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return doc;
}

function fotosPdfFilename() {
    const firma = (state.companyInfo.firma || 'markt').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    return `Fotodokumentation_${firma}_${datum}.pdf`;
}

function checklistPdfFilename() {
    const firma = (state.companyInfo.firma || 'markt').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    return `Checkliste_${firma}_${datum}.pdf`;
}

function buildChecklistPdf() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 14;
    const contentWidth = pageWidth - margin * 2;

    drawCoverPage(doc, pageWidth, pageHeight, margin, 'Checkliste');

    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text('ASiC Handel – Checkliste', pageWidth / 2, y, { align: 'center' });
    y += 9;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 100, 108);
    checklistPdfHeaderLines().forEach(line => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 5;
    });
    y += 1;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    y = renderChecklistPdfSection(doc, y, margin, contentWidth, pageHeight);

    // Seitenzahl auf allen Seiten AUSSER dem Deckblatt (Seite 1)
    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return doc;
}

async function shareChecklistPdf() {
    try {
        const doc = buildChecklistPdf();
        const filename = checklistPdfFilename();
        await sharePdfDoc(doc, filename, buildShareEmailSubject());
    } catch (err) {
        console.error('Checkliste-PDF konnte nicht erzeugt werden:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// ===== Maßnahmen-PDF (mit optionaler Checkliste voran) =====
// Uebernommen aus massnahmen.js, damit auch die Checkliste-Seite Maßnahmen exportieren kann.
function pdfFilename() {
    const firma = (state.companyInfo.firma || 'begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    return `Massnahmenplan_${firma}_${datum}.pdf`;
}

async function buildPdf(includeChecklist, includeFotos) {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 14;
    const contentWidth = pageWidth - margin * 2;

    const coverTitle = includeChecklist ? 'Gesamtbericht' : 'Maßnahmen';
    drawCoverPage(doc, pageWidth, pageHeight, margin, coverTitle);

    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text(includeChecklist ? 'ASiC Handel – Gesamtbericht' : 'ASiC Handel – Maßnahmen', pageWidth / 2, y, { align: 'center' });
    y += 9;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 100, 108);
    checklistPdfHeaderLines().forEach(line => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 5;
    });
    y += 1;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    if (includeChecklist) {
        y = renderChecklistPdfSection(doc, y, margin, contentWidth, pageHeight);
        doc.addPage();
        y = 18;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(28, 34, 38);
        doc.text('Maßnahmen', margin, y);
        y += 9;
    }

    if (state.measures.length === 0) {
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text('Keine Mängel erfasst.', margin, y);
        y += 10;
    } else {
        const padding = 6;
        const innerWidth = contentWidth - padding * 2;
        const colWidth = innerWidth / 3;
        const colX = [0, 1, 2].map(i => margin + padding + i * colWidth);

        state.measures.forEach((measure, index) => {
            const found = findItemById(measure.itemId);
            const questionText = found ? `${index + 1}. [${measure.itemId}] ${found.item.text}` : `${index + 1}. Manuell erfasste Maßnahme`;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            const questionLines = doc.splitTextToSize(questionText, innerWidth);

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            const answerLines = doc.splitTextToSize(measure.description || '-', innerWidth);

            const questionH = questionLines.length * 5;
            const answerH = answerLines.length * 4.3;
            const tileH = 11;
            const cardHeight = padding + questionH + 1 + 4.5 + answerH + 6 + tileH + padding;

            if (y + cardHeight > pageHeight - 24) {
                doc.addPage();
                y = 18;
            }

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'S');

            let cy = y + padding + 3.5;
            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59);
            doc.text(questionLines, margin + padding, cy);
            cy += questionH + 1;

            doc.setDrawColor(241, 245, 249);
            doc.line(margin + padding, cy, margin + contentWidth - padding, cy);
            cy += 4.5;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(200, 130, 20);
            doc.text('MASSNAHME', margin + padding, cy);
            cy += 4.3;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            doc.text(answerLines, margin + padding, cy);
            cy += answerH + 6;

            const labels = ['VERANTWORTLICH', 'FRIST', 'STATUS'];
            doc.setFont(undefined, 'bold');
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            labels.forEach((label, i) => doc.text(label, colX[i], cy));
            cy += 4.3;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.setTextColor(30, 41, 59);
            doc.text(measure.responsible || '-', colX[0], cy);
            doc.text(measure.dueDate ? formatDate(measure.dueDate) : '-', colX[1], cy);

            const statusLabel = measure.status === 'offen' ? 'Offen' : measure.status === 'bearbeitung' ? 'In Bearbeitung' : 'Erledigt';
            const statusColor = measure.status === 'offen' ? [214, 69, 63] : measure.status === 'bearbeitung' ? [201, 127, 26] : [47, 158, 100];
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...statusColor);
            doc.text(statusLabel, colX[2], cy);
            doc.setTextColor(0);

            y += cardHeight + 5;
        });
    }

    if (y + 55 > pageHeight - 20) {
        doc.addPage();
        y = 18;
    } else {
        y += 6;
    }

    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(28, 34, 38);
    doc.text('Unterschriften', margin, y);
    y += 8;

    const sigWidth = (contentWidth - 10) / 2;
    const sigHeight = 28;

    [
        { key: 'pruefer', label: 'Prüfer', name: state.companyInfo.pruefername },
        { key: 'marktleitung', label: 'Marktleitung', name: state.companyInfo.marktleitung }
    ].forEach((sig, i) => {
        const x = margin + i * (sigWidth + 10);
        doc.setDrawColor(220);
        doc.rect(x, y, sigWidth, sigHeight, 'S');
        if (state.signatures[sig.key]) {
            try {
                doc.addImage(state.signatures[sig.key], 'PNG', x + 2, y + 2, sigWidth - 4, sigHeight - 4);
            } catch (e) { /* ignore */ }
        }
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(90, 100, 108);
        doc.text(`${sig.label}: ${sig.name || '-'}`, x, y + sigHeight + 5);
    });

    if (includeFotos) {
        doc.addPage();
        y = 18;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(28, 34, 38);
        doc.text('Fotodokumentation', margin, y);
        y += 9;
        const photos = await getAllPhotos();
        await renderFotosSection(doc, y, margin, contentWidth, pageHeight, photos);
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return doc;
}

// ===== Vereinheitlichter Export: Modus 'checkliste' | 'massnahmen' | 'fotos' | 'alle' =====
function reportFilename(mode) {
    if (mode === 'checkliste') return checklistPdfFilename();
    if (mode === 'massnahmen') return pdfFilename();
    if (mode === 'fotos') return fotosPdfFilename();
    return checklistPdfFilename().replace('Checkliste_', 'Gesamtbericht_');
}

async function buildReportPdf(mode) {
    if (mode === 'checkliste') return buildChecklistPdf();
    if (mode === 'massnahmen') return buildPdf(false, false);
    if (mode === 'fotos') return await buildFotosPdf();
    return await buildPdf(true, true);
}

async function shareReportPdf(mode) {
    try {
        const doc = await buildReportPdf(mode);
        await sharePdfDoc(doc, reportFilename(mode), buildShareEmailSubject());
    } catch (err) {
        console.error('Report-PDF konnte nicht erzeugt werden:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Druckt je nach Modus die Checkliste, die Maßnahmen (inkl. Unterschriften), die Fotos
// oder alles zusammen - funktioniert unabhaengig davon, auf welcher Seite man sich
// gerade befindet. Drucken: erzeugt dieselbe fertig paginierte PDF wie "PDF teilen"
// (mit korrektem Zeilenumbruch, Seitenabstand, Deckblatt und Seitenzahlen) und
// oeffnet sie in einem neuen Tab. Dort druckt man ueber den nativen PDF-Betrachter
// (auf dem iPad: Teilen-Symbol -> Drucken/AirPrint). Dieser Weg umgeht zuverlaessig
// die Einschraenkungen von window.print() auf einer HTML-Seite (Browser-eigene
// Kopf-/Fusszeile mit URL/Datum, unzuverlaessige Seitenumbrueche).
async function printReport(mode) {
    try {
        const doc = await buildReportPdf(mode);
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
            showToast('PDF geöffnet – über das Teilen-Symbol drucken');
        } else {
            // Pop-up blockiert: PDF stattdessen herunterladen, manuell drucken
            doc.save(reportFilename(mode));
            showToast('Pop-up blockiert – PDF heruntergeladen');
        }
    } catch (err) {
        console.error('Drucken fehlgeschlagen:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// ===== Betriebsdaten: Formular (index.html) =====
function initCompanyForm() {
    const fields = ['firma', 'standort', 'datum', 'pruefername', 'marktleitung', 'teilnehmer'];
    let anyField = false;

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (!input) return;
        anyField = true;
        input.value = state.companyInfo[field] || '';
        input.addEventListener('change', () => {
            state.companyInfo[field] = input.value;
            saveState();
        });
    });

    return anyField;
}

// ===== Betriebsdaten: Anzeige (massnahmen.html) =====
function renderCompanyInfoStrip() {
    const strip = document.getElementById('company-info-strip');
    if (!strip) return;

    const map = {
        'info-firma': state.companyInfo.firma,
        'info-standort': state.companyInfo.standort,
        'info-datum': state.companyInfo.datum ? formatDate(state.companyInfo.datum) : '',
        'info-pruefer': state.companyInfo.pruefername,
        'info-marktleitung': state.companyInfo.marktleitung,
        'info-teilnehmer': state.companyInfo.teilnehmer
    };

    Object.keys(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = map[id] || '–';
    });
}

// Kategorien mit "nicht in jedem Markt vorhanden"-Schalter: Ausstattung/Räumlichkeit,
// die bei Aktivierung komplett als N.V. markiert und gesperrt wird.
const OPTIONAL_CATEGORIES = {
    'kundenaufzug': 'Kein Kundenaufzug im Markt vorhanden',
    'lastenaufzug': 'Kein Lastenaufzug im Markt vorhanden',
    'barrierefreies-wc': 'Kein barrierefreies WC im Markt vorhanden',
    'praktikanten': 'Keine Praktikanten/Schüleraushilfen im Markt beschäftigt',
    'co2-kuehleinrichtungen': 'Keine CO2-Kühleinrichtungen im Markt vorhanden'
};

// ===== Checkliste rendern (index.html) =====
// buildChecklistHtml() erzeugt das HTML separat, damit es auch fuer den
// Druck-Container auf der Maßnahmen-Seite wiederverwendet werden kann.
function buildChecklistHtml(forceOpenAll) {
    return AUDIT_CATEGORIES.map(category => {
        const isOpen = forceOpenAll || openCategoryId === category.id;
        const toggleLabel = OPTIONAL_CATEGORIES[category.id];
        const locked = !!toggleLabel && !!state.notApplicable[category.id];
        const answered = category.items.filter(i => state.ratings[i.id]).length;
        const complete = answered === category.items.length;

        return `
        <section class="category card ${isOpen ? 'open' : ''}" id="cat-${category.id}">
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <div class="category-header-left">
                    <svg class="category-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span class="category-name">${category.name}</span>
                </div>
                <span class="category-count ${complete ? 'complete' : ''}">${answered} / ${category.items.length}</span>
            </div>
            <div class="category-body">
                ${toggleLabel ? `
                <div class="category-toggle-row" onclick="event.stopPropagation()">
                    <label class="toggle-switch">
                        <input type="checkbox" ${locked ? 'checked' : ''} onchange="toggleNotApplicable('${category.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label">${toggleLabel} – alle Fragen automatisch als „N.V." markieren</span>
                </div>` : ''}
                ${category.items.map(item => renderItem(item, locked)).join('')}
            </div>
        </section>`;
    }).join('');
}

function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;
    container.innerHTML = buildChecklistHtml(false);
    updateStats();
}

function renderItem(item, locked) {
    const rating = state.ratings[item.id] || '';
    const comment = state.comments[item.id] || '';
    const isMangel = rating === 'mangel';

    return `
    <div class="item ${isMangel ? 'is-mangel' : ''}" data-item-id="${item.id}">
        <div class="item-row">
            <div class="item-text"><span class="item-id">${item.id}</span>${item.text}</div>
            <div class="item-actions">
                <button class="rating-btn ok ${rating === 'ok' ? 'selected' : ''}" ${locked ? 'disabled' : ''} onclick="setRating('${item.id}', 'ok')" aria-label="In Ordnung">OK</button>
                <button class="rating-btn mangel ${rating === 'mangel' ? 'selected' : ''}" ${locked ? 'disabled' : ''} onclick="setRating('${item.id}', 'mangel')" aria-label="Mangel">!</button>
                <button class="rating-btn na ${rating === 'na' ? 'selected' : ''}" ${locked ? 'disabled' : ''} onclick="setRating('${item.id}', 'na')" aria-label="Nicht vorhanden">N.V.</button>
            </div>
        </div>
        ${isMangel ? `
        <div class="item-detail">
            <label for="comment-${item.id}">Beschreibung des Mangels</label>
            <textarea id="comment-${item.id}" placeholder="Was wurde festgestellt? (optional)" onchange="updateComment('${item.id}', this.value)">${comment}</textarea>
            <div class="measure-preview">
                <span class="label">Empfohlene Maßnahme</span>
                ${getMeasureText(item.id)}
            </div>
        </div>` : ''}
    </div>`;
}

function toggleCategory(categoryId) {
    openCategoryId = openCategoryId === categoryId ? null : categoryId;
    renderChecklist();
}

// ===== "Nicht vorhanden"-Schalter fuer optionale Kategorien =====
function toggleNotApplicable(categoryId, checked) {
    state.notApplicable[categoryId] = checked;
    const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);

    if (checked && category) {
        category.items.forEach(item => {
            state.ratings[item.id] = 'na';
            delete state.comments[item.id];
            state.measures = state.measures.filter(m => m.itemId !== item.id);
        });
    }

    saveState();
    renderChecklist();
}

function setRating(itemId, rating) {
    // Schutz: waehrend eine Kategorie per Schalter als "nicht vorhanden" markiert ist,
    // bleiben ihre Fragen gesperrt auf N.V. (Buttons sind zusaetzlich disabled).
    for (const categoryId in OPTIONAL_CATEGORIES) {
        if (!state.notApplicable[categoryId]) continue;
        const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);
        if (category && category.items.some(i => i.id === itemId)) return;
    }

    const current = state.ratings[itemId];
    state.ratings[itemId] = current === rating ? '' : rating;
    if (!state.ratings[itemId]) delete state.ratings[itemId];

    if (state.ratings[itemId] !== 'mangel') {
        delete state.comments[itemId];
        state.measures = state.measures.filter(m => m.itemId !== itemId);
    } else if (!state.measures.find(m => m.itemId === itemId)) {
        state.measures.push({
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
            itemId: itemId,
            description: getMeasureText(itemId),
            responsible: '',
            dueDate: '',
            status: 'offen'
        });
    }

    renderChecklist();
    saveState();
}

function updateComment(itemId, value) {
    state.comments[itemId] = value;
    saveState();
}

// Reine Berechnung, getrennt von der DOM-Aktualisierung - so kann sie auch
// vom PDF-Deckblatt (drawCoverPage) genutzt werden.
function computeStats() {
    const total = totalItemCount();
    const values = Object.values(state.ratings);
    const ok = values.filter(v => v === 'ok').length;
    const mangel = values.filter(v => v === 'mangel').length;
    const na = values.filter(v => v === 'na').length;
    const answered = ok + mangel + na;
    const offen = total - answered;
    return { total, ok, mangel, na, offen, answered };
}

function updateStats() {
    const { total, ok, mangel, na, offen, answered } = computeStats();

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('stat-ok', ok);
    setText('stat-mangel', mangel);
    setText('stat-na', na);
    setText('stat-offen', offen);
    setText('progress-label', `${answered} / ${total} geprüft`);

    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = total ? `${Math.round((answered / total) * 100)}%` : '0%';
}

// ===== JSON Export / Import =====
function exportJson() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    const firma = (state.companyInfo.firma || 'begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    a.download = `ASiC-Handel_${firma}_${datum}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON exportiert');
}

function importJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            state = {
                companyInfo: { ...defaultState().companyInfo, ...(data.companyInfo || {}) },
                ratings: data.ratings || {},
                comments: data.comments || {},
                measures: data.measures || [],
                signatures: { ...defaultState().signatures, ...(data.signatures || {}) },
                notApplicable: data.notApplicable || {}
            };
            saveState();
            initCompanyForm();
            renderChecklist();
            renderCompanyInfoStrip();
            if (typeof renderMeasures === 'function') renderMeasures();
            if (typeof restoreSignatures === 'function') restoreSignatures();
            showToast('JSON geladen');
        } catch (err) {
            console.error(err);
            showToast('Datei konnte nicht gelesen werden', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== Archiv: aktuelle Begehung sichern, spaeter erneut exportieren =====
// Ein Archiv-Datensatz ist ein vollstaendiger Schnappschuss (Betriebsdaten,
// Antworten, Kommentare, Massnahmen, Unterschriften, Statistik-Zahlen zum
// Zeitpunkt der Archivierung) inklusive der zu diesem Zeitpunkt vorhandenen
// Fotos. Archivieren loescht NICHT die aktuelle Begehung - beides bleibt
// parallel bestehen, bis man separat "Zurücksetzen" nutzt.
async function archiveCurrentAudit() {
    if (!confirm('Aktuelle Begehung jetzt archivieren? Die laufende Begehung bleibt zusätzlich unverändert bestehen, bis Sie „Zurücksetzen“ nutzen.')) return;
    try {
        const photos = await getAllPhotos();
        const record = {
            id: 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            createdAt: Date.now(),
            companyInfo: JSON.parse(JSON.stringify(state.companyInfo)),
            ratings: JSON.parse(JSON.stringify(state.ratings)),
            comments: JSON.parse(JSON.stringify(state.comments)),
            measures: JSON.parse(JSON.stringify(state.measures)),
            signatures: JSON.parse(JSON.stringify(state.signatures)),
            notApplicable: JSON.parse(JSON.stringify(state.notApplicable || {})),
            stats: computeStats(),
            photos: photos
        };
        await saveArchivedAudit(record);
        showToast('Begehung archiviert');

        // Optionaler automatischer NAS-Upload (nur wenn in den Einstellungen
        // konfiguriert UND aktiviert). Eigener, getrennter Try/Catch-Block:
        // ein Fehlschlag hier darf NICHT die bereits erfolgreich
        // abgeschlossene lokale Archivierung als Fehler erscheinen lassen.
        const webdavConfig = (typeof getWebDAVConfig === 'function') ? getWebDAVConfig() : null;
        if (webdavConfig && webdavConfig.autoUpload) {
            try {
                await uploadArchivedAuditToWebDAV(record);
                showToast('Zusätzlich auf NAS gesichert');
            } catch (uploadErr) {
                console.error('NAS-Upload fehlgeschlagen:', uploadErr);
                showToast('Lokal archiviert, NAS-Upload fehlgeschlagen: ' + (uploadErr && uploadErr.message ? uploadErr.message : 'unbekannter Fehler'), 'error');
            }
        }
    } catch (err) {
        console.error('Archivieren fehlgeschlagen:', err);
        showToast('Archivieren fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Erzeugt eine PDF fuer einen ARCHIVIERTEN Datensatz, indem die bestehenden,
// bereits ausfuehrlich getesteten PDF-Funktionen (die auf dem globalen "state"
// und getAllPhotos() arbeiten) kurzzeitig auf den archivierten Schnappschuss
// umgeleitet und danach wieder zurueckgesetzt werden. Bewusster Kompromiss:
// spart eine komplette Parallel-Implementierung der PDF-Erzeugung, die exakt
// dasselbe noch einmal tun muesste.
async function buildArchivedReportPdf(record, mode) {
    const originalState = state;
    const originalGetAllPhotos = getAllPhotos;
    state = {
        companyInfo: record.companyInfo,
        ratings: record.ratings,
        comments: record.comments,
        measures: record.measures,
        signatures: record.signatures,
        notApplicable: record.notApplicable || {}
    };
    getAllPhotos = async () => record.photos || [];
    try {
        return await buildReportPdf(mode);
    } finally {
        state = originalState;
        getAllPhotos = originalGetAllPhotos;
    }
}

// Wie buildArchivedReportPdf(), haelt die Umleitung aber zusaetzlich waehrend
// des Teilens aktiv - sharePdfDoc() ruft bei Erfolg intern openPrefilledMail()
// auf, das wiederum Betreff/Text aus state.companyInfo baut. Ohne die
// Umleitung wuerde die Mail faelschlich Markt/Datum der AKTUELL laufenden
// Begehung zeigen statt der archivierten.
async function shareArchivedReportPdf(record, mode) {
    const originalState = state;
    const originalGetAllPhotos = getAllPhotos;
    state = {
        companyInfo: record.companyInfo,
        ratings: record.ratings,
        comments: record.comments,
        measures: record.measures,
        signatures: record.signatures,
        notApplicable: record.notApplicable || {}
    };
    getAllPhotos = async () => record.photos || [];
    try {
        const doc = await buildReportPdf(mode);
        await sharePdfDoc(doc, reportFilename(mode).replace(/^(Checkliste|Massnahmenplan|Gesamtbericht)_/, 'Archiv_'), buildShareEmailSubject());
    } finally {
        state = originalState;
        getAllPhotos = originalGetAllPhotos;
    }
}

function resetAll() {
    if (!confirm('Wirklich alle Eingaben zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) return;
    state = defaultState();
    saveState();
    initCompanyForm();
    openCategoryId = null;
    renderChecklist();

    // Fotos gehoeren zur selben Begehung und sollten bei einem Reset ebenfalls
    // verschwinden - sie liegen aber separat in IndexedDB, nicht im state.
    if (typeof deleteAllPhotos === 'function') {
        deleteAllPhotos().then(() => {
            if (typeof loadAndRenderPhotos === 'function') loadAndRenderPhotos();
        }).catch(err => console.error('Fotos konnten beim Zurücksetzen nicht gelöscht werden:', err));
    }

    showToast('Zurückgesetzt');
}

// ===== Sprachstil-Umschalter (Einfach / BGHW-konform / Rechtlich) =====
function initStyleSwitch() {
    const switchEl = document.getElementById('style-switch');
    if (!switchEl) return;

    function updateActiveButton() {
        switchEl.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.style === MEASURE_STYLE);
        });
    }

    switchEl.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setMeasureStyle(btn.dataset.style);
            updateActiveButton();
            renderChecklist(); // aktualisiert die Live-Vorschau bei offenen Mangel-Punkten
        });
    });

    updateActiveButton();
}

// ===== Initialisierung =====
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initCompanyForm();
    initStyleSwitch();
    renderChecklist();
    renderCompanyInfoStrip();
    renderFooterMeta();

    const btnSave = document.getElementById('btn-save');
    if (btnSave) btnSave.addEventListener('click', () => {
        saveState();
        showToast('Gespeichert');
    });

    const btnExport = document.getElementById('btn-json-export');
    if (btnExport) btnExport.addEventListener('click', exportJson);

    const importInput = document.getElementById('json-import-input');
    if (importInput) importInput.addEventListener('change', (e) => {
        if (e.target.files[0]) importJson(e.target.files[0]);
        e.target.value = '';
    });

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) btnReset.addEventListener('click', resetAll);

    const btnArchive = document.getElementById('btn-archive');
    if (btnArchive) btnArchive.addEventListener('click', archiveCurrentAudit);

    // Aufklappbares Export-Menü (Checkliste/Maßnahmen/Fotos/Alles, Drucken, PDF teilen, Mail) - alle Seiten
    initExportMenu();

    // Aufklappbares Datei-Menü (Speichern, JSON exportieren/laden, Zurücksetzen) - alle Seiten
    initDropdownMenu('file-menu-toggle', 'file-menu-panel');
});

// ===== Service Worker registrieren (fuer Offline-Start ohne Netzwerk) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            // Fehlschlag ist unkritisch - App funktioniert auch ohne SW,
            // dann eben nur nicht komplett offline startfaehig.
            console.warn('Service Worker konnte nicht registriert werden:', err);
        });
    });
}
