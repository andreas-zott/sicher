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

// ===== Aufklappbares Export-Menü (Drucken / PDF teilen / Mail vorbereiten) =====
// Gemeinsame ID auf beiden Seiten (index.html + massnahmen.html), daher hier zentral.
function initExportMenu() {
    const toggle = document.getElementById('export-menu-toggle');
    const panel = document.getElementById('export-menu-panel');
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
        showToast('PDF konnte nicht erzeugt werden', 'error');
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

function checklistPdfFilename() {
    const firma = (state.companyInfo.firma || 'markt').replace(/[^a-z0-9äöüß]+/gi, '-');
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    return `Checkliste_${firma}_${datum}.pdf`;
}

function buildChecklistPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297, margin = 14;
    const contentWidth = pageWidth - margin * 2;
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

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(`${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return doc;
}

async function shareChecklistPdf() {
    const doc = buildChecklistPdf();
    const filename = checklistPdfFilename();
    await sharePdfDoc(doc, filename, buildShareEmailSubject());
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

    const btnPrint = document.getElementById('btn-print-checklist');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());

    const btnShareChecklist = document.getElementById('btn-share-checklist-pdf');
    if (btnShareChecklist) btnShareChecklist.addEventListener('click', shareChecklistPdf);

    // "Mail vorbereiten" gibt es auf beiden Seiten (index.html und massnahmen.html)
    const btnPrepMail = document.getElementById('btn-prep-mail');
    if (btnPrepMail) btnPrepMail.addEventListener('click', openPrefilledMail);

    // Aufklappbares Menü (Drucken / PDF teilen / Mail vorbereiten) - beide Seiten
    initExportMenu();
});
