// ==========================================================================
// BEGEHUNGSLISTE — Maßnahmen-Seite (Karten, Unterschriften, PDF/Teilen/Drucken)
// ==========================================================================

let signaturePads = {};

// ===== Maßnahmen-Karten rendern =====
function renderMeasures() {
    const container = document.getElementById('measures-container');
    const noMeasures = document.getElementById('no-measures');
    if (!container) return;

    if (state.measures.length === 0) {
        container.style.display = 'none';
        if (noMeasures) noMeasures.style.display = 'block';
        return;
    }

    container.style.display = 'flex';
    if (noMeasures) noMeasures.style.display = 'none';

    container.innerHTML = state.measures.map((measure, index) => {
        const found = findItemById(measure.itemId);
        const questionText = found ? `[${measure.itemId}] ${found.item.text}` : 'Manuell erfasste Maßnahme';

        return `
        <div class="measure-card card">
            <div class="measure-question">
                <span class="measure-number">${index + 1}.</span>
                <span class="measure-question-text">${questionText}</span>
            </div>
            <div class="measure-answer">
                <span class="measure-answer-label">Maßnahme</span>
                <textarea onchange="updateMeasureField('${measure.id}', 'description', this.value)">${measure.description || ''}</textarea>
                ${measure.comment ? `<p class="measure-comment">Kommentar: ${measure.comment}</p>` : ''}
            </div>
            <div class="measure-tile">
                <div class="tile-field">
                    <span class="label">Verantwortlich</span>
                    <input type="text" value="${measure.responsible || ''}" placeholder="Name" onchange="updateMeasureField('${measure.id}', 'responsible', this.value)">
                </div>
                <div class="tile-field">
                    <span class="label">Frist</span>
                    <input type="date" value="${measure.dueDate || ''}" onchange="updateMeasureField('${measure.id}', 'dueDate', this.value)">
                </div>
                <div class="tile-field">
                    <span class="label">Status</span>
                    <select class="status-badge ${measure.status}" onchange="updateMeasureField('${measure.id}', 'status', this.value); this.className='status-badge ' + this.value;">
                        <option value="offen" ${measure.status === 'offen' ? 'selected' : ''}>Offen</option>
                        <option value="bearbeitung" ${measure.status === 'bearbeitung' ? 'selected' : ''}>In Bearbeitung</option>
                        <option value="erledigt" ${measure.status === 'erledigt' ? 'selected' : ''}>Erledigt</option>
                    </select>
                </div>
            </div>
        </div>`;
    }).join('');
}

function updateMeasureField(id, field, value) {
    const measure = state.measures.find(m => m.id === id);
    if (!measure) return;
    measure[field] = value;
    saveState();
}

// ===== Unterschriften-Canvas =====
function initSignaturePad(key, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1c2226';

    let drawing = false;
    let hasStroke = false;

    function pos(e) {
        const r = canvas.getBoundingClientRect();
        const point = e.touches ? e.touches[0] : e;
        return { x: point.clientX - r.left, y: point.clientY - r.top };
    }

    function start(e) {
        e.preventDefault();
        drawing = true;
        hasStroke = true;
        const p = pos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }

    function move(e) {
        if (!drawing) return;
        e.preventDefault();
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    function end() {
        if (!drawing) return;
        drawing = false;
        state.signatures[key] = canvas.toDataURL('image/png');
        saveState();
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    signaturePads[key] = { canvas, ctx, ratio, clear: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasStroke = false;
        state.signatures[key] = null;
        saveState();
    } };
}

function restoreSignatures() {
    Object.keys(signaturePads).forEach(key => {
        const dataUrl = state.signatures[key];
        const pad = signaturePads[key];
        if (!dataUrl || !pad) return;
        const img = new Image();
        img.onload = () => {
            pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
            pad.ctx.drawImage(img, 0, 0, pad.canvas.width / pad.ratio, pad.canvas.height / pad.ratio);
        };
        img.src = dataUrl;
    });
}

// ===== PDF erzeugen (Kartenlayout, inkl. Betriebsdaten + Unterschriften) =====
function buildPdf(includeChecklist) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    // Kopfbereich
    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text(includeChecklist ? 'ASiC Handel – Gesamtbericht' : 'ASiC Handel – Maßnahmen', pageWidth / 2, y, { align: 'center' });
    y += 9;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 100, 108);
    const ci = state.companyInfo;
    const teilnehmer = ci.teilnehmer || '-';
    const line1 = `Firma/Markt: ${ci.firma || '-'}    Standort: ${ci.standort || '-'}    Datum: ${ci.datum ? formatDate(ci.datum) : '-'}`;
    const line2 = `Prüfer: ${ci.pruefername || '-'}    Marktleitung: ${ci.marktleitung || '-'}    Teilnehmer: ${teilnehmer}`;
    doc.text(line1, pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text(line2, pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Checkliste (nur bei aktivierter Option "Komplette Checkliste einschließen")
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

    // Maßnahmen-Karten
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

    // Unterschriften
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

function pdfFilename() {
    const firma = (state.companyInfo.firma || 'begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    return `Massnahmenplan_${firma}_${datum}.pdf`;
}

// ===== Teilen (iPad-Teilen-Menü) mit Download-Fallback =====
async function sharePdf() {
    const includeChecklist = document.getElementById('include-checklist')?.checked || false;
    const doc = buildPdf(includeChecklist);
    const filename = includeChecklist ? checklistPdfFilename().replace('Checkliste_', 'Gesamtbericht_') : pdfFilename();
    await sharePdfDoc(doc, filename, SHARE_EMAIL_TITLE, buildShareEmailText());
}

// ===== Initialisierung =====
document.addEventListener('DOMContentLoaded', () => {
    initSignaturePad('pruefer', 'sig-pruefer-canvas');
    initSignaturePad('marktleitung', 'sig-marktleitung-canvas');

    const sigPrueferName = document.getElementById('sig-pruefer-name');
    if (sigPrueferName) {
        sigPrueferName.value = state.companyInfo.pruefername || '';
        sigPrueferName.addEventListener('change', () => {
            state.companyInfo.pruefername = sigPrueferName.value;
            saveState();
            renderCompanyInfoStrip();
        });
    }

    const sigMarktleitungName = document.getElementById('sig-marktleitung-name');
    if (sigMarktleitungName) {
        sigMarktleitungName.value = state.companyInfo.marktleitung || '';
        sigMarktleitungName.addEventListener('change', () => {
            state.companyInfo.marktleitung = sigMarktleitungName.value;
            saveState();
            renderCompanyInfoStrip();
        });
    }

    renderMeasures();
    restoreSignatures();

    const clearPruefer = document.getElementById('clear-sig-pruefer');
    if (clearPruefer) clearPruefer.addEventListener('click', () => signaturePads.pruefer && signaturePads.pruefer.clear());

    const clearMarktleitung = document.getElementById('clear-sig-marktleitung');
    if (clearMarktleitung) clearMarktleitung.addEventListener('click', () => signaturePads.marktleitung && signaturePads.marktleitung.clear());

    const btnSave = document.getElementById('btn-save-measures');
    if (btnSave) btnSave.addEventListener('click', () => {
        saveState();
        showToast('Gespeichert');
    });

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) btnPrint.addEventListener('click', () => {
        const includeChecklist = document.getElementById('include-checklist')?.checked || false;
        const printContainer = document.getElementById('print-checklist-container');
        if (printContainer) {
            printContainer.innerHTML = includeChecklist ? buildChecklistHtml(true) : '';
        }
        // Kurz warten, bis der Druck-Container tatsaechlich befuellt/layoutet ist
        setTimeout(() => window.print(), 50);
    });

    // Druck-Container nach dem Drucken wieder leeren (spart DOM/Speicher)
    window.addEventListener('afterprint', () => {
        const printContainer = document.getElementById('print-checklist-container');
        if (printContainer) printContainer.innerHTML = '';
    });

    const btnShare = document.getElementById('btn-share-pdf');
    if (btnShare) btnShare.addEventListener('click', sharePdf);
});
