// ===== Measures State =====
let measuresState = {
    measures: []
};

let editingMeasureId = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadMeasures();
    renderCompanyInfo();
    renderMeasures();
    updateMeasureStats();
});

// ===== Render Company Info (Betriebsinformationen aus der Checkliste) =====
function renderCompanyInfo() {
    const saved = localStorage.getItem('auditState');
    let companyInfo = {};

    if (saved) {
        try {
            const data = JSON.parse(saved);
            companyInfo = data.companyInfo || {};
        } catch (e) {
            console.error('Failed to load company info:', e);
        }
    }

    const teilnehmer = [companyInfo.teilnehmer1, companyInfo.teilnehmer2].filter(Boolean).join(', ');

    const fields = {
        'info-firma': companyInfo.firma,
        'info-standort': companyInfo.standort,
        'info-verantwortlicher': companyInfo.verantwortlicher,
        'info-pruefer': companyInfo.pruefer,
        'info-teilnehmer': teilnehmer,
        'info-datum': companyInfo.datum ? formatDate(companyInfo.datum) : ''
    };

    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = fields[id] || '-';
        }
    });
}

// ===== Load Measures =====
function loadMeasures() {
    const saved = localStorage.getItem('auditState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            measuresState.measures = data.measures || [];
        } catch (e) {
            console.error('Failed to load measures:', e);
        }
    }
}

// ===== Save Measures =====
function saveMeasuresToStorage() {
    const saved = localStorage.getItem('auditState');
    let auditState = {};
    
    if (saved) {
        try {
            auditState = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }
    }
    
    auditState.measures = measuresState.measures;
    localStorage.setItem('auditState', JSON.stringify(auditState));
}

// ===== Render Measures =====
function renderMeasures() {
    const container = document.getElementById('measures-container');
    const noMeasures = document.getElementById('no-measures');

    if (!container) return;

    if (measuresState.measures.length === 0) {
        container.style.display = 'none';
        noMeasures.style.display = 'block';
        return;
    }

    container.style.display = 'flex';
    noMeasures.style.display = 'none';

    container.innerHTML = measuresState.measures.map((measure, index) => {
        // Frage aus AUDIT_CATEGORIES nachschlagen (findItemById kommt aus app.js)
        const item = measure.itemId && typeof findItemById === 'function' ? findItemById(measure.itemId) : null;
        const questionText = item
            ? `${measure.itemId ? `[${measure.itemId}] ` : ''}${item.text}`
            : null;

        return `
        <div class="measure-card">
            <div class="measure-question">
                <span class="measure-number">${index + 1}.</span>
                ${questionText
                    ? `<span class="measure-question-text">${questionText}</span>`
                    : `<span class="measure-question-text measure-question-manual">Manuell erfasste Massnahme</span>`}
            </div>
            <div class="measure-answer">
                <span class="measure-answer-label">Massnahme</span>
                <p class="measure-answer-text">${measure.description}</p>
                ${measure.comment ? `<p class="measure-comment">Kommentar: ${measure.comment}</p>` : ''}
            </div>
            <div class="measure-tile">
                <div class="tile-field">
                    <span class="tile-label">Prioritaet</span>
                    <span class="priority-badge ${measure.priority}">${capitalize(measure.priority)}</span>
                </div>
                <div class="tile-field">
                    <span class="tile-label">Verantwortlich</span>
                    <span class="tile-value">${measure.responsible || '-'}</span>
                </div>
                <div class="tile-field">
                    <span class="tile-label">Faellig bis</span>
                    <span class="tile-value">${measure.dueDate ? formatDate(measure.dueDate) : '-'}</span>
                </div>
                <div class="tile-field">
                    <span class="tile-label">Status</span>
                    <span class="status-badge ${measure.status}">${formatStatus(measure.status)}</span>
                </div>
                <div class="tile-field tile-actions">
                    <span class="tile-label">Aktionen</span>
                    <div class="actions-row">
                        <button class="btn-secondary btn-small" onclick="editMeasure('${measure.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="btn-secondary btn-small btn-danger" onclick="deleteMeasure('${measure.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// ===== Update Statistics =====
function updateMeasureStats() {
    let offen = 0, bearbeitung = 0, erledigt = 0;
    
    measuresState.measures.forEach(m => {
        if (m.status === 'offen') offen++;
        else if (m.status === 'in-bearbeitung') bearbeitung++;
        else if (m.status === 'erledigt') erledigt++;
    });
    
    document.getElementById('stat-offen').textContent = offen;
    document.getElementById('stat-bearbeitung').textContent = bearbeitung;
    document.getElementById('stat-erledigt').textContent = erledigt;
}

// ===== Modal Functions =====
function openAddMeasureModal() {
    editingMeasureId = null;
    document.getElementById('modal-title').textContent = 'Neue Massnahme';
    document.getElementById('measure-form').reset();
    document.getElementById('measure-modal').style.display = 'flex';
}

function editMeasure(id) {
    const measure = measuresState.measures.find(m => m.id === id);
    if (!measure) return;
    
    editingMeasureId = id;
    document.getElementById('modal-title').textContent = 'Massnahme bearbeiten';
    document.getElementById('measure-id').value = id;
    document.getElementById('measure-description').value = measure.description;
    document.getElementById('measure-priority').value = measure.priority;
    document.getElementById('measure-responsible').value = measure.responsible || '';
    document.getElementById('measure-due').value = measure.dueDate || '';
    document.getElementById('measure-status').value = measure.status;
    document.getElementById('measure-modal').style.display = 'flex';
}

function closeMeasureModal() {
    document.getElementById('measure-modal').style.display = 'none';
    editingMeasureId = null;
}

function saveMeasure() {
    const description = document.getElementById('measure-description').value.trim();
    if (!description) {
        alert('Bitte geben Sie eine Beschreibung ein.');
        return;
    }
    
    const measureData = {
        id: editingMeasureId || Date.now().toString(),
        description: description,
        priority: document.getElementById('measure-priority').value,
        responsible: document.getElementById('measure-responsible').value.trim(),
        dueDate: document.getElementById('measure-due').value,
        status: document.getElementById('measure-status').value
    };
    
    if (editingMeasureId) {
        const index = measuresState.measures.findIndex(m => m.id === editingMeasureId);
        if (index !== -1) {
            // Preserve itemId and comment if they exist
            measureData.itemId = measuresState.measures[index].itemId;
            measureData.comment = measuresState.measures[index].comment;
            measuresState.measures[index] = measureData;
        }
    } else {
        measuresState.measures.push(measureData);
    }
    
    saveMeasuresToStorage();
    renderMeasures();
    updateMeasureStats();
    closeMeasureModal();
    showToast('Massnahme gespeichert', 'success');
}

function deleteMeasure(id) {
    if (!confirm('Moechten Sie diese Massnahme wirklich loeschen?')) return;
    
    measuresState.measures = measuresState.measures.filter(m => m.id !== id);
    saveMeasuresToStorage();
    renderMeasures();
    updateMeasureStats();
    showToast('Massnahme geloescht', 'success');
}

// ===== PDF Export =====
// ===== PDF Export Tauri Optimiert (Kartenlayout, analog zur Bildschirmansicht) =====
async function exportMeasuresPDF() {

    try {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 14;
        const contentWidth = pageWidth - margin * 2;

        let y = 18;

        function drawHeader() {

            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            doc.setTextColor(179, 0, 0);

            doc.text("Massnahmenplan", pageWidth / 2, y, { align: "center" });

            y += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, "normal");
            doc.setTextColor(100);

            doc.text(
                `Erstellt am: ${new Date().toLocaleDateString("de-DE")}`,
                pageWidth / 2,
                y,
                { align: "center" }
            );

            y += 10;

            // Betriebsinformationen aus der Checkliste
            const saved = localStorage.getItem('auditState');
            let companyInfo = {};
            if (saved) {
                try {
                    companyInfo = JSON.parse(saved).companyInfo || {};
                } catch (e) {}
            }
            const teilnehmer = [companyInfo.teilnehmer1, companyInfo.teilnehmer2].filter(Boolean).join(', ');

            const infoLine1 = `Firma: ${companyInfo.firma || '-'}    Standort: ${companyInfo.standort || '-'}    Datum: ${companyInfo.datum ? formatDate(companyInfo.datum) : '-'}`;
            const infoLine2 = `Verantwortlicher: ${companyInfo.verantwortlicher || '-'}    Pruefer: ${companyInfo.pruefer || '-'}    Teilnehmer: ${teilnehmer || '-'}`;

            doc.setFontSize(9);
            doc.setTextColor(60);
            doc.text(infoLine1, margin, y);
            y += 5;
            doc.text(infoLine2, margin, y);
            y += 5;

            doc.setDrawColor(220);
            doc.line(margin, y, pageWidth - margin, y);

            y += 8;
        }

        drawHeader();

        if (measuresState.measures.length === 0) {

            doc.setFontSize(11);
            doc.setTextColor(0);
            doc.text("Keine Massnahmen vorhanden.", margin, y);

        } else {

            const padding = 6;
            const innerWidth = contentWidth - padding * 2;
            const colWidth = innerWidth / 4;
            const colX = [0, 1, 2, 3].map(i => margin + padding + i * colWidth);

            measuresState.measures.forEach((measure, index) => {

                const item = measure.itemId && typeof findItemById === 'function' ? findItemById(measure.itemId) : null;
                const questionText = item
                    ? `${index + 1}. ${measure.itemId ? `[${measure.itemId}] ` : ''}${item.text}`
                    : `${index + 1}. Manuell erfasste Massnahme`;

                doc.setFont(undefined, "bold");
                doc.setFontSize(10);
                const questionLines = doc.splitTextToSize(questionText, innerWidth);

                doc.setFont(undefined, "normal");
                doc.setFontSize(9);
                const answerLines = doc.splitTextToSize(measure.description || "-", innerWidth);

                const commentLines = measure.comment
                    ? doc.splitTextToSize("Kommentar: " + measure.comment, innerWidth)
                    : [];

                const questionH = questionLines.length * 5;
                const answerH = answerLines.length * 4.3;
                const commentH = commentLines.length ? commentLines.length * 4 + 2 : 0;
                const tileH = 11;
                const cardHeight = padding + questionH + 1 + 4.5 + answerH + commentH + 6 + tileH + padding;

                // Seitenumbruch
                if (y + cardHeight > pageHeight - 22) {
                    doc.addPage();
                    y = 18;
                }

                // Kartenrahmen
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.3);
                doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "S");

                let cy = y + padding + 3.5;

                // Frage
                doc.setFont(undefined, "bold");
                doc.setFontSize(10);
                doc.setTextColor(30, 41, 59);
                doc.text(questionLines, margin + padding, cy);
                cy += questionH + 1;

                // Trennlinie
                doc.setDrawColor(241, 245, 249);
                doc.line(margin + padding, cy, margin + contentWidth - padding, cy);
                cy += 4.5;

                // Massnahme-Label + Text
                doc.setFont(undefined, "bold");
                doc.setFontSize(7.5);
                doc.setTextColor(146, 64, 14);
                doc.text("MASSNAHME", margin + padding, cy);
                cy += 4.3;

                doc.setFont(undefined, "normal");
                doc.setFontSize(9);
                doc.setTextColor(51, 65, 85);
                doc.text(answerLines, margin + padding, cy);
                cy += answerH;

                if (commentLines.length) {
                    doc.setFontSize(8);
                    doc.setTextColor(100, 116, 139);
                    doc.text(commentLines, margin + padding, cy);
                    cy += commentH;
                }
                cy += 6;

                // Prioritaet | Verantwortlich | Faellig bis | Status
                const labels = ["PRIORITAET", "VERANTWORTLICH", "FAELLIG BIS", "STATUS"];
                doc.setFont(undefined, "bold");
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                labels.forEach((label, i) => doc.text(label, colX[i], cy));
                cy += 4.3;

                doc.setFont(undefined, "normal");
                doc.setFontSize(9);
                doc.setTextColor(30, 41, 59);
                doc.text(capitalize(measure.priority), colX[0], cy);
                doc.text(measure.responsible || "-", colX[1], cy);
                doc.text(measure.dueDate ? formatDate(measure.dueDate) : "-", colX[2], cy);

                const statusColor = measure.status === "offen"
                    ? [220, 38, 38]
                    : measure.status === "in-bearbeitung"
                        ? [217, 119, 6]
                        : [22, 163, 74];
                doc.setFont(undefined, "bold");
                doc.setTextColor(...statusColor);
                doc.text(formatStatus(measure.status), colX[3], cy);
                doc.setTextColor(0);

                y += cardHeight + 5;
            });
        }

        const totalPages = doc.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text(
                `Seite ${i} von ${totalPages}`,
                pageWidth - margin,
                pageHeight - 8,
                { align: "right" }
            );
        }

        doc.save(
            `Massnahmenplan_${new Date().toISOString().split("T")[0]}.pdf`
        );

        showToast("PDF erfolgreich exportiert", "success");

    } catch (error) {

        console.error("PDF Export Fehler:", error);

        alert("PDF Export fehlgeschlagen.");
    }
}
// ===== Helper Functions =====
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE');
}

function formatStatus(status) {
    const statusMap = {
        'offen': 'Offen',
        'in-bearbeitung': 'In Bearbeitung',
        'erledigt': 'Erledigt'
    };
    return statusMap[status] || status;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${type === 'success' 
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'
            }
        </svg>
        ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
