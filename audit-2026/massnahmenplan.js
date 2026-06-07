// ===== Measures State =====
let measuresState = {
    measures: []
};

let editingMeasureId = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadMeasures();
    renderMeasures();
    updateMeasureStats();
});

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
    const tbody = document.getElementById('measures-body');
    const noMeasures = document.getElementById('no-measures');
    const table = document.getElementById('measures-table');
    
    if (!tbody) return;
    
    if (measuresState.measures.length === 0) {
        table.style.display = 'none';
        noMeasures.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noMeasures.style.display = 'none';
    
    tbody.innerHTML = measuresState.measures.map((measure, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <strong>${measure.itemId ? `[${measure.itemId}] ` : ''}${measure.description}</strong>
                ${measure.comment ? `<br><small style="color: var(--muted);">${measure.comment}</small>` : ''}
            </td>
            <td><span class="priority-badge ${measure.priority}">${capitalize(measure.priority)}</span></td>
            <td>${measure.responsible || '-'}</td>
            <td>${measure.dueDate ? formatDate(measure.dueDate) : '-'}</td>
            <td><span class="status-badge ${measure.status}">${formatStatus(measure.status)}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-secondary btn-small" onclick="editMeasure('${measure.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <button class="btn-secondary btn-small btn-danger" onclick="deleteMeasure('${measure.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
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
// ===== PDF Export Tauri Optimiert =====
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

        const marginLeft = 12;
        const marginRight = 12;
        const marginTop = 15;
        const marginBottom = 15;

        let y = marginTop;

        function drawHeader() {

            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            doc.setTextColor(179, 0, 0);

            doc.text(
                "Massnahmenplan",
                pageWidth / 2,
                y,
                { align: "center" }
            );

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

            y += 12;

            drawTableHeader();
        }

        function drawTableHeader() {

            doc.setFillColor(235, 235, 235);
            doc.rect(10, y - 5, 190, 8, "F");

            doc.setFontSize(9);
            doc.setFont(undefined, "bold");
            doc.setTextColor(0);

            doc.text("Nr.", 12, y);
            doc.text("Beschreibung", 22, y);
            doc.text("Priorität", 120, y);
            doc.text("Status", 145, y);
            doc.text("Fällig", 175, y);

            y += 8;

            doc.setFont(undefined, "normal");
        }

        drawHeader();

        if (measuresState.measures.length === 0) {

            doc.setFontSize(11);
            doc.text(
                "Keine Maßnahmen vorhanden.",
                marginLeft,
                y + 10
            );

        } else {

            measuresState.measures.forEach((measure, index) => {

                const descLines =
                    doc.splitTextToSize(
                        measure.description || "",
                        90
                    );

                const commentLines =
                    measure.comment
                        ? doc.splitTextToSize(
                              "Kommentar: " + measure.comment,
                              90
                          )
                        : [];

                const rowHeight =
                    (descLines.length * 5) +
                    (commentLines.length * 4) +
                    8;

                if (
                    y + rowHeight >
                    pageHeight - marginBottom
                ) {

                    doc.addPage();

                    y = marginTop;

                    drawTableHeader();
                }

                doc.setFontSize(8);

                doc.text(
                    String(index + 1),
                    12,
                    y
                );

                let textY = y;

                doc.setFont(undefined, "bold");

                descLines.forEach(line => {

                    doc.text(
                        line,
                        22,
                        textY
                    );

                    textY += 5;
                });

                doc.setFont(undefined, "normal");

                if (commentLines.length > 0) {

                    doc.setTextColor(90);

                    commentLines.forEach(line => {

                        doc.text(
                            line,
                            22,
                            textY
                        );

                        textY += 4;
                    });

                    doc.setTextColor(0);
                }

                doc.text(
                    capitalize(measure.priority),
                    120,
                    y
                );

                doc.text(
                    formatStatus(measure.status),
                    145,
                    y
                );

                doc.text(
                    measure.dueDate
                        ? formatDate(measure.dueDate)
                        : "-",
                    175,
                    y
                );

                y += rowHeight;

                doc.setDrawColor(220);

                doc.line(
                    10,
                    y - 3,
                    200,
                    y - 3
                );
            });
        }

        const totalPages =
            doc.getNumberOfPages();

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            doc.setPage(i);

            doc.setFontSize(8);
            doc.setTextColor(120);

            doc.text(
                `Seite ${i} von ${totalPages}`,
                pageWidth - 10,
                pageHeight - 5,
                { align: "right" }
            );
        }

        doc.save(
            `Massnahmenplan_${
                new Date()
                    .toISOString()
                    .split("T")[0]
            }.pdf`
        );

        showToast(
            "PDF erfolgreich exportiert",
            "success"
        );

    } catch (error) {

        console.error(
            "PDF Export Fehler:",
            error
        );

        alert(
            "PDF Export fehlgeschlagen."
        );
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
