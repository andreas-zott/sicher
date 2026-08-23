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
// buildPdf(), pdfFilename() sowie das komplette Export-Menü (Modus-Auswahl,
// Drucken, Teilen, Mail) leben jetzt zentral in app.js, damit sowohl die
// Checkliste als auch die Maßnahmen-Seite darauf zugreifen können.

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
});
