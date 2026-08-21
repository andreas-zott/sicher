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
    setTimeout(() => toast.remove(), 2600);
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
function renderChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;

    container.innerHTML = AUDIT_CATEGORIES.map(category => {
        const isOpen = openCategoryId === category.id;
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

function updateStats() {
    const total = totalItemCount();
    const values = Object.values(state.ratings);
    const ok = values.filter(v => v === 'ok').length;
    const mangel = values.filter(v => v === 'mangel').length;
    const na = values.filter(v => v === 'na').length;
    const answered = ok + mangel + na;
    const offen = total - answered;

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

function resetAll() {
    if (!confirm('Wirklich alle Eingaben zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) return;
    state = defaultState();
    saveState();
    initCompanyForm();
    openCategoryId = null;
    renderChecklist();
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
});
