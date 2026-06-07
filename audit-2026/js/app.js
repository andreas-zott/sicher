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

// ✅ NEU: merkt sich offene Kategorien
let openCategories = {};

let signatureCanvases = {};
let currentFilter = 'all';

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    document.getElementById('datum').value = auditState.companyInfo.datum;
    
    renderChecklist();
    initSignatureCanvases();
    setupEventListeners();
    loadAuditData();
    updateStatistics();
}

// ===== Checklist Rendering =====
function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    AUDIT_CATEGORIES.forEach(category => {
        const filteredItems = filterItems(category.items);

        if (filteredItems.length === 0 && currentFilter !== 'all') return;
        
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category-section';

        categoryEl.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <span class="category-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                    ${category.name}
                </span>
                <span class="category-badge">
                    ${filteredItems.length} / ${category.items.length} Prüfpunkte
                </span>
            </div>

            <!-- ✅ FIX: Zustand bleibt erhalten -->
            <div class="category-content ${openCategories[category.id] ? '' : 'collapsed'}"
                 id="category-${category.id}">
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
                        <textarea class="comment-input"
                            placeholder="Beschreibung des Mangels..."
                            onchange="updateComment('${item.id}', this.value)">${comment}</textarea>

                        <div class="measure-suggestion">
                            <span class="measure-label">Empfohlene Maßnahme</span>
                            <p class="measure-text">${measureText}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="item-actions">
                    <button class="rating-btn ${rating === 'ok' ? 'selected ok' : ''}"
                            onclick="setRating('${item.id}', 'ok')">OK</button>

                    <button class="rating-btn ${rating === 'mangel' ? 'selected mangel' : ''}"
                            onclick="setRating('${item.id}', 'mangel')">Mangel</button>

                    <button class="rating-btn ${rating === 'na' ? 'selected na' : ''}"
                            onclick="setRating('${item.id}', 'na')">N/A</button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Filter =====
function filterItems(items) {
    switch (currentFilter) {
        case 'all': return items;
        case 'offen': return items.filter(i => !auditState.ratings[i.id]);
        case 'ok':
        case 'mangel':
        case 'na':
            return items.filter(i => auditState.ratings[i.id] === currentFilter);
        default:
            return items;
    }
}

// ===== Rating =====
function setRating(itemId, rating) {
    auditState.ratings[itemId] = rating;

    if (rating !== 'mangel') {
        delete auditState.comments[itemId];
        auditState.measures = auditState.measures.filter(m => m.itemId !== itemId);
    }

    if (rating === 'mangel') {
        const exists = auditState.measures.find(m => m.itemId === itemId);
        if (!exists) {
            const item = findItemById(itemId);
            if (item) {
                auditState.measures.push({
                    id: Date.now().toString(),
                    itemId,
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

// ===== Category Toggle (FIX) =====
function toggleCategory(categoryId) {
    const content = document.getElementById(`category-${categoryId}`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('svg');

    content.classList.toggle('collapsed');

    const isOpen = !content.classList.contains('collapsed');
    openCategories[categoryId] = isOpen;

    icon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
}

// ===== Stats =====
function updateStatistics() {
    let ok = 0, mangel = 0, na = 0, total = 0;

    Object.values(auditState.ratings).forEach(r => {
        total++;
        if (r === 'ok') ok++;
        else if (r === 'mangel') mangel++;
        else if (r === 'na') na++;
    });

    document.getElementById('stat-ok').textContent = ok;
    document.getElementById('stat-mangel').textContent = mangel;
    document.getElementById('stat-na').textContent = na;
    document.getElementById('stat-total').textContent = total;
}

// ===== INIT =====
function initSignatureCanvases() { /* unverändert */ }
function setupEventListeners() { /* unverändert */ }
function loadAuditData() { /* unverändert */ }
function autoSave() { localStorage.setItem('auditState', JSON.stringify(auditState)); }
function showToast(msg, type) { /* unverändert */ }
function findItemById(id) { /* unverändert */ }
function getMeasureText(id) { /* unverändert */ }