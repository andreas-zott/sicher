// ===== App State =====


let auditState = {
    companyInfo: {
        firma: '',
        standort: '',
        pruefer: '',
        datum: new Date().toISOString().split('T')[0]
    },
    ratings: {},
    comments: {},
    measures: [],
    photos: [],
    signatures: {
        pruefer: null,
        verantwortlicher: null
    }
};

let signatureCanvases = {};
let currentFilter = 'all';

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set today's date
    document.getElementById('datum').value = auditState.companyInfo.datum;
    
    // Render checklist
    renderChecklist();
    
    // Initialize signature canvases
    initSignatureCanvases();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved data
    loadAuditData();
    
    // Update stats
    updateStatistics();
}

// ===== Checklist Rendering =====
function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    AUDIT_CATEGORIES.forEach(category => {
        // Auf den Filter angewandte Liste der Prüfpunkte
        const filteredItems = filterItems(category.items);

        // Bei aktivem Filter Kategorien ohne Treffer ausblenden
        if (filteredItems.length === 0 && currentFilter !== 'all') return;
        
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category-section';
        categoryEl.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <span class="category-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    ${category.name}
                </span>
                <span class="category-badge">${filteredItems.length} / ${category.items.length} Pruefpunkte</span>
            </div>
            <div class="category-content" id="category-${category.id}">
                ${renderCategoryItems(filteredItems)}
            </div>
        `;
        container.appendChild(categoryEl);
    });
}

function renderCategoryItems(items) {
    return items.map(item => {
        const rating = auditState.ratings[item.id] || '';
        const comment = auditState.comments[item.id] || '';
        const isMangel = rating === 'mangel';
        const measureText = isMangel ? getMeasureText(item.id) : '';
        
        return `
            <div class="checklist-item ${isMangel ? 'mangel' : ''}" data-item-id="${item.id}">
                <div class="item-content">
                    <span class="item-number">${item.id}</span>
                    <span class="item-text item-title">${item.text}</span>
                    ${isMangel ? `
                        <textarea 
                            class="comment-input" 
                            placeholder="Beschreibung des Mangels..."
                            onchange="updateComment('${item.id}', this.value)"
                        >${comment}</textarea>
                        <div class="measure-suggestion">
                            <span class="measure-label">Empfohlene Maßnahme</span>
                            <p class="measure-text">${measureText}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="item-actions">
                    <button class="rating-btn ${rating === 'ok' ? 'selected ok' : ''}" onclick="setRating('${item.id}', 'ok')">
                        OK
                    </button>
                    <button class="rating-btn ${rating === 'mangel' ? 'selected mangel' : ''}" onclick="setRating('${item.id}', 'mangel')">
                        Mangel
                    </button>
                    <button class="rating-btn ${rating === 'na' ? 'selected na' : ''}" onclick="setRating('${item.id}', 'na')">
                        N/A
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterItems(items) {
    switch (currentFilter) {
        case 'all':
            return items;
        case 'offen':
            return items.filter(item => !auditState.ratings[item.id]);
        case 'ok':
        case 'mangel':
        case 'na':
            return items.filter(item => auditState.ratings[item.id] === currentFilter);
        default:
            return items;
    }
}

// ===== Rating Functions =====
function setRating(itemId, rating) {
    auditState.ratings[itemId] = rating;
    
    // If rating changed from mangel, clear comment and remove auto-measure
    if (rating !== 'mangel') {
        delete auditState.comments[itemId];
        auditState.measures = auditState.measures.filter(m => m.itemId !== itemId);
    }
    
    // Auto-create measure for mangel
    if (rating === 'mangel') {
        const existingMeasure = auditState.measures.find(m => m.itemId === itemId);
        if (!existingMeasure) {
            const item = findItemById(itemId);
            if (item) {
                auditState.measures.push({
                    id: Date.now().toString(),
                    itemId: itemId,
                    description: getMeasureText(itemId),
                    priority: 'mittel',
                    responsible: '',
                    dueDate: '',
                    status: 'offen'
                });
            }
        }
    }
    
    renderChecklist();
    updateStatistics();
    autoSave();
}

function updateComment(itemId, comment) {
    auditState.comments[itemId] = comment;
    
    // Update measure description if exists
    const measure = auditState.measures.find(m => m.itemId === itemId);
    if (measure && comment) {
        measure.comment = comment;
    }
    
    autoSave();
}

function findItemById(itemId) {
    for (const category of AUDIT_CATEGORIES) {
        const item = category.items.find(i => i.id === itemId);
        if (item) return item;
    }
    return null;
}

// ===== Category Toggle =====
function toggleCategory(categoryId) {
    const content = document.getElementById(`category-${categoryId}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('svg');
    
    content.classList.toggle('collapsed');
    icon.style.transform = content.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(90deg)';
}

// ===== Filter Functions =====
function setFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderChecklist();
}

// ===== Statistics =====
function updateStatistics() {
    let ok = 0, mangel = 0, na = 0, total = 0;
    
    Object.values(auditState.ratings).forEach(rating => {
        total++;
        if (rating === 'ok') ok++;
        else if (rating === 'mangel') mangel++;
        else if (rating === 'na') na++;
    });
    
    document.getElementById('stat-ok').textContent = ok;
    document.getElementById('stat-mangel').textContent = mangel;
    document.getElementById('stat-na').textContent = na;
    document.getElementById('stat-total').textContent = total;
}

// ===== Signature Canvas =====
function initSignatureCanvases() {
    ['pruefer', 'verantwortlicher'].forEach(type => {
        const canvas = document.getElementById(`signature-${type}`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        signatureCanvases[type] = { canvas, ctx, drawing: false };
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => startDrawing(e, type));
        canvas.addEventListener('mousemove', (e) => draw(e, type));
        canvas.addEventListener('mouseup', () => stopDrawing(type));
        canvas.addEventListener('mouseout', () => stopDrawing(type));
        
        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e.touches[0], type);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e.touches[0], type);
        });
        canvas.addEventListener('touchend', () => stopDrawing(type));
    });
}

function startDrawing(e, type) {
    const { canvas, ctx } = signatureCanvases[type];
    signatureCanvases[type].drawing = true;
    
    ctx.beginPath();
    ctx.moveTo(
        e.clientX - canvas.getBoundingClientRect().left,
        e.clientY - canvas.getBoundingClientRect().top
    );
}

function draw(e, type) {
    if (!signatureCanvases[type].drawing) return;
    
    const { canvas, ctx } = signatureCanvases[type];
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    
    ctx.lineTo(
        e.clientX - canvas.getBoundingClientRect().left,
        e.clientY - canvas.getBoundingClientRect().top
    );
    ctx.stroke();
}

function stopDrawing(type) {
    signatureCanvases[type].drawing = false;
    saveSignature(type);
}

function saveSignature(type) {
    const { canvas } = signatureCanvases[type];
    auditState.signatures[type] = canvas.toDataURL();
    autoSave();
}

function clearSignature(type) {
    const { canvas, ctx } = signatureCanvases[type];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    auditState.signatures[type] = null;
    autoSave();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Company info inputs
    ['firma', 'standort', 'pruefer', 'datum'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('change', (e) => {
                auditState.companyInfo[field] = e.target.value;
                autoSave();
            });
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

// ===== Save/Load =====
function autoSave() {
    localStorage.setItem('auditState', JSON.stringify(auditState));
}

function saveAudit() {
    autoSave();
    
    // Try Tauri save if available
    if (window.__TAURI__) {
        window.__TAURI__.invoke('save_audit_data', { data: JSON.stringify(auditState) })
            .then(path => showToast(`Gespeichert: ${path}`, 'success'))
            .catch(err => showToast(`Fehler: ${err}`, 'error'));
    } else {
        showToast('Audit lokal gespeichert', 'success');
    }
}

function loadAuditData() {
    // Try localStorage first
    const saved = localStorage.getItem('auditState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            auditState = { ...auditState, ...data };
            
            // Update form fields
            Object.keys(auditState.companyInfo).forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.value = auditState.companyInfo[field];
                }
            });
            
            // Restore signatures
            Object.keys(auditState.signatures).forEach(type => {
                if (auditState.signatures[type] && signatureCanvases[type]) {
                    const img = new Image();
                    img.onload = () => {
                        signatureCanvases[type].ctx.drawImage(img, 0, 0);
                    };
                    img.src = auditState.signatures[type];
                }
            });

            // Re-render with loaded ratings
            renderChecklist();
            updateStatistics();
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }
    
    // Try Tauri load if available
    if (window.__TAURI__) {
        window.__TAURI__.invoke('load_audit_data')
            .then(data => {
                if (data && data !== '{}') {
                    const tauriData = JSON.parse(data);
                    auditState = { ...auditState, ...tauriData };
                    renderChecklist();
                    updateStatistics();
                }
            })
            .catch(err => console.error('Tauri load error:', err));
    }
}

// ===== Reset =====
function resetAudit() {
    if (!confirm('Möchten Sie wirklich alle Eingaben zurücksetzen?')) return;
    
    auditState = {
        companyInfo: {
            firma: '',
            standort: '',
            pruefer: '',
            datum: new Date().toISOString().split('T')[0]
        },
        ratings: {},
        comments: {},
        measures: [],
        photos: [],
        signatures: {
            pruefer: null,
            verantwortlicher: null
        }
    };
    
    // Clear form fields
    ['firma', 'standort', 'pruefer'].forEach(field => {
        const input = document.getElementById(field);
        if (input) input.value = '';
    });
    document.getElementById('datum').value = auditState.companyInfo.datum;
    
    // Clear signatures
    ['pruefer', 'verantwortlicher'].forEach(type => {
        clearSignature(type);
    });
    
    localStorage.removeItem('auditState');
    renderChecklist();
    updateStatistics();
    showToast('Audit zurueckgesetzt', 'success');
}

// ===== PDF Export =====
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let y = 20;
    const lineHeight = 7;
    const pageHeight = 280;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(179, 0, 0);
    doc.text('Arbeitssicherheits-Audit', 105, y, { align: 'center' });
    y += 15;
    
    // Company info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Firma: ${auditState.companyInfo.firma || '-'}`, 20, y);
    y += lineHeight;
    doc.text(`Standort: ${auditState.companyInfo.standort || '-'}`, 20, y);
    y += lineHeight;
    doc.text(`Pruefer: ${auditState.companyInfo.pruefer || '-'}`, 20, y);
    y += lineHeight;
    doc.text(`Datum: ${auditState.companyInfo.datum || '-'}`, 20, y);
    y += 15;
    
    // Statistics
    const stats = getStatistics();
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Zusammenfassung', 20, y);
    y += lineHeight;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`In Ordnung: ${stats.ok} | Maengel: ${stats.mangel} | N/A: ${stats.na} | Gesamt: ${stats.total}`, 20, y);
    y += 15;
    
    // Checklist
    AUDIT_CATEGORIES.forEach(category => {
        if (y > pageHeight) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(179, 0, 0);
        doc.text(category.name, 20, y);
        y += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        
        category.items.forEach(item => {
            if (y > pageHeight) {
                doc.addPage();
                y = 20;
            }
            
            const rating = auditState.ratings[item.id] || '-';
            const ratingText = rating === 'ok' ? 'OK' : rating === 'mangel' ? 'MANGEL' : rating === 'na' ? 'N/A' : '-';
            
            // Wrap long text
            const maxWidth = 140;
            const lines = doc.splitTextToSize(`${item.id}: ${item.text}`, maxWidth);
            
            lines.forEach((line, i) => {
                doc.text(line, 20, y);
                if (i === 0) {
                    doc.text(`[${ratingText}]`, 170, y);
                }
                y += lineHeight - 2;
            });
            
            // Add comment if mangel
            if (rating === 'mangel' && auditState.comments[item.id]) {
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                const commentLines = doc.splitTextToSize(`Anmerkung: ${auditState.comments[item.id]}`, maxWidth - 10);
                commentLines.forEach(line => {
                    doc.text(line, 25, y);
                    y += lineHeight - 3;
                });
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
            }

            // Add recommended measure if mangel
            if (rating === 'mangel') {
                doc.setFontSize(8);
                doc.setTextColor(179, 0, 0);
                const measureLines = doc.splitTextToSize(`Maßnahme: ${getMeasureText(item.id)}`, maxWidth - 10);
                measureLines.forEach(line => {
                    if (y > pageHeight) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, 25, y);
                    y += lineHeight - 3;
                });
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
            }
            
            y += 2;
        });
        
        y += 5;
    });
    
    // Save PDF
    const filename = `Audit_${auditState.companyInfo.firma || 'Export'}_${auditState.companyInfo.datum || new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    showToast('PDF exportiert', 'success');
}

function getStatistics() {
    let ok = 0, mangel = 0, na = 0, total = 0;
    
    Object.values(auditState.ratings).forEach(rating => {
        total++;
        if (rating === 'ok') ok++;
        else if (rating === 'mangel') mangel++;
        else if (rating === 'na') na++;
    });
    
    return { ok, mangel, na, total };
}

// ===== Toast Notifications =====
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
