// ==========================================================================
// BEGEHUNGSLISTE — Gemeinsame App-Logik (State, Checkliste, Betriebsdaten)
// Wird auf index.html UND massnahmen.html geladen — alle DOM-Zugriffe sind
// deshalb per Null-Check abgesichert, damit keine Seite die andere stoert.
// ==========================================================================

const STORAGE_KEY = 'begehungState';

// Revisionsstand der App/Checkliste (in Fusszeile und PDF sichtbar,
// bei inhaltlichen Aenderungen an Fragenkatalog/Massnahmen hochzaehlen)
const APP_REVISION = '1.54';
const APP_REVISION_DATE = '2026-10-25';

// Heutiges Datum als JJJJ-MM-TT in LOKALER Zeit. toISOString() liefert UTC,
// dadurch stand zwischen 0 und 2 Uhr (deutsche Zeit) das Vortagsdatum drin.
function todayIsoLocal() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

// Maskiert Text fuer die Verwendung in innerHTML und in Attributwerten.
// Fuer ALLE Nutzereingaben und vom Server/aus Dateien geladenen Werte nutzen.
function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// --------------------------------------------------------------------------
// Ereignis-Verteilung ohne Inline-Handler (ab Rev. 1.54-5)
// --------------------------------------------------------------------------
// Frueher standen in den erzeugten HTML-Bausteinen Handler wie
//   onclick="setRating('<ID aus der Datei>', 'ok')"
// Werte aus importierten JSON-Dateien oder vom Server konnten dort aus der
// Zeichenkette ausbrechen und eigenen Programmcode ausfuehren. Ausserdem
// verhindern Inline-Handler eine wirksame Content-Security-Policy.
//
// Jetzt: aktionAttr('click', 'setRating', item.id, 'ok') erzeugt
//   data-click="setRating" data-click-args="[...JSON...]"
// Die Argumente sind reine Daten (JSON) und werden nie als Code ausgewertet.
// Platzhalter in den Argumenten:
//   '$el'      das Element selbst          '$value'   el.value
//   '$checked' el.checked                  '$files'   el.files
//   '$closest-filename'  data-filename des naechsten Elternelements
// data-stop-click auf einem Element entspricht event.stopPropagation() fuer
// Klicks innerhalb dieses Elements. data-reset-value leert nach dem Aufruf
// das Feld (Datei-Auswahl erneut moeglich).
//
// Aufgerufen werden NUR die in AKTION_ERLAUBT genannten Funktionen.
const AKTION_ERLAUBT = new Set([
    'toggleSubgroupByIndex', 'toggleSubgroupNotApplicable', 'toggleCategory',
    'toggleNotApplicable', 'setRating', 'updateComment', 'updateFreierText',
    'onKategorieBalkenKlick',
    'onPhotoCommentChange', 'onPhotoDelete',
    'onMeasurePhotoDelete', 'openMeasureCamera', 'onMeasurePhotosCaptured',
    'updateMeasureField', 'onMeasureStatusChange',
    'onArchiveExport', 'onArchiveRestore', 'onArchiveFollowUp', 'onArchiveDelete',
    'onTeamArchiveExport', 'onTeamArchiveRestore', 'onTeamArchiveFollowUp'
]);

function aktionAttr(ereignis, funktion, ...args) {
    return `data-${ereignis}="${escapeHtml(funktion)}" data-${ereignis}-args="${escapeHtml(JSON.stringify(args))}"`;
}

(function () {
    function argumentWert(arg, el) {
        if (arg === '$el') return el;
        if (arg === '$value') return el.value;
        if (arg === '$checked') return el.checked;
        if (arg === '$files') return el.files;
        if (arg === '$closest-filename') {
            const t = el.closest('[data-filename]');
            return t ? t.dataset.filename : '';
        }
        return arg;
    }

    function verteile(ereignis, ev) {
        const attr = 'data-' + ereignis;
        let el = ev.target;
        while (el && el.nodeType === 1) {
            if (el.hasAttribute(attr)) {
                const name = el.getAttribute(attr);
                const fn = window[name];
                if (!AKTION_ERLAUBT.has(name) || typeof fn !== 'function') {
                    console.warn('Unbekannte Aktion ignoriert:', name);
                    return;
                }
                let args = [];
                try {
                    const roh = JSON.parse(el.getAttribute(attr + '-args') || '[]');
                    if (Array.isArray(roh)) args = roh;
                } catch (e) { args = []; }
                const ergebnis = fn.apply(null, args.map(a => argumentWert(a, el)));
                if (el.hasAttribute('data-reset-value')) el.value = '';
                return ergebnis;
            }
            if (ereignis === 'click' && el.hasAttribute('data-stop-click')) return;
            el = el.parentElement;
        }
    }

    ['click', 'change', 'input'].forEach(ereignis => {
        document.addEventListener(ereignis, ev => verteile(ereignis, ev));
    });
})();

function renderFooterMeta() {
    const el = document.getElementById('footer-version');
    if (el) el.textContent = `Rev. ${APP_REVISION} · Stand ${formatDate(APP_REVISION_DATE)}`;

    const copyright = document.getElementById('footer-copyright');
    if (copyright) {
        // Gruendungsjahr fest, Anzeige laeuft automatisch als Zeitspanne mit,
        // sobald ein neues Jahr beginnt (z. B. "2026–2027" ab Januar 2027).
        // Bleibt so lange nur "2026", wie das aktuelle Jahr noch 2026 ist.
        const gruendungsjahr = 2026;
        const aktuellesJahr = new Date().getFullYear();
        const jahresangabe = aktuellesJahr > gruendungsjahr
            ? `${gruendungsjahr}–${aktuellesJahr}`
            : `${gruendungsjahr}`;
        copyright.innerHTML = `© ${jahresangabe} Andreas Zott – Alle Rechte vorbehalten<br>(Sifa) Arbeitssicherheit ${aktuellesJahr}`;
    }
}

function defaultState() {
    return {
        companyInfo: {
            marktnummer: '',
            plzOrt: '',
            strasse: '',
            datum: todayIsoLocal(),
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
        notApplicable: {},
        subgroupNotApplicable: {},
        freieTexte: {}
    };
}

let state = defaultState();
let openCategoryId = null;
const openSubgroups = new Set();

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
            notApplicable: data.notApplicable || {},
            subgroupNotApplicable: data.subgroupNotApplicable || {},
            freieTexte: data.freieTexte || {}
        };
    } catch (e) {
        console.error('ASiC Handel: Zustand konnte nicht geladen werden:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        planeSicherungsHinweis();
        return true;
    } catch (e) {
        console.error('ASiC Handel: Zustand konnte nicht gespeichert werden:', e);
        return false;
    }
}

// ===== Fehlerprotokoll (ab Ausgabestand 1.54-3) =====
// Merkt sich auf diesem Geraet die letzten 10 Fehlermeldungen (rote
// Hinweise und unerwartete Programmfehler) mit Zeit und Seite. Wird nur
// in der Diagnose unter "Einstellungen" angezeigt - fuer die Fehlersuche
// durch die EDV. Enthaelt keine Zugriffsschluessel.
const FEHLER_LOG_KEY = 'asicFehlerLog';

function merkeFehler(text) {
    try {
        const log = JSON.parse(localStorage.getItem(FEHLER_LOG_KEY) || '[]');
        log.push({
            zeit: new Date().toISOString(),
            seite: (location.pathname.split('/').pop() || 'index.html'),
            text: String(text || '').slice(0, 300)
        });
        while (log.length > 10) log.shift();
        localStorage.setItem(FEHLER_LOG_KEY, JSON.stringify(log));
    } catch (e) { /* ohne Speicher kein Protokoll */ }
}

function leseFehlerLog() {
    try { return JSON.parse(localStorage.getItem(FEHLER_LOG_KEY) || '[]'); } catch (e) { return []; }
}

window.addEventListener('error', (e) => {
    const ort = e && e.filename ? ' (' + e.filename.split('/').pop().split('?')[0] + ':' + e.lineno + ')' : '';
    merkeFehler('Programmfehler: ' + (e && e.message ? e.message : 'unbekannt') + ort);
});
window.addEventListener('unhandledrejection', (e) => {
    const r = e && e.reason;
    merkeFehler('Programmfehler: ' + (r && r.message ? r.message : String(r)));
});

// Ausgabestand dieser Seite (aus dem ?v=-Zusatz der eingebundenen app.js),
// z. B. '1.54-3'. Gleicher Wert wie BUILD in sw.js.
function appAusgabestand() {
    try {
        const el = document.querySelector('script[src*="js/app.js"]');
        const v = el ? new URL(el.src, location.href).searchParams.get('v') : '';
        return v || APP_REVISION;
    } catch (e) {
        return APP_REVISION;
    }
}

// Server-Funktionen (save.php/list.php/load.php) erreichbar? Auf GitHub
// Pages nur, wenn unter "Einstellungen" eine Server-Adresse hinterlegt ist.
function serverFunktionenVerfuegbar() {
    return !(window.location.hostname.endsWith('.github.io') && !getNasBaseUrl());
}

// ===== Sicherungsstand der aktuellen Begehung (ab Ausgabestand 1.54-3) =====
// Nach jedem erfolgreichen "Auf Server speichern" (und nach dem Laden einer
// Begehung vom Server) wird ein Fingerabdruck des Bearbeitungsstands
// gemerkt. Weicht der aktuelle Stand davon ab, ist die Begehung (noch oder
// wieder) nur auf diesem Geraet vorhanden - dann zeigt der Pruefkatalog
// einen Hinweis.
const SERVER_STAND_KEY = 'asicServerStand';
const SERVER_STAND_AUSSTEHEND_KEY = 'asicServerStandAusstehend';

// JSON mit sortierten Schluesseln - damit die Reihenfolge der Felder den
// Fingerabdruck nicht veraendert.
function stabilesJson(wert) {
    if (Array.isArray(wert)) return '[' + wert.map(stabilesJson).join(',') + ']';
    if (wert && typeof wert === 'object') {
        return '{' + Object.keys(wert).sort().map(k => JSON.stringify(k) + ':' + stabilesJson(wert[k])).join(',') + '}';
    }
    return JSON.stringify(wert === undefined ? null : wert);
}

function stateFingerabdruck() {
    const text = stabilesJson(state);
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16) + '-' + text.length;
}

function leseServerStand() {
    try { return JSON.parse(localStorage.getItem(SERVER_STAND_KEY) || 'null'); } catch (e) { return null; }
}

// serverZeit: savedAt der Datei auf dem Server (ab 1.54-9) - Grundlage, um
// beim naechsten Speichern zu erkennen, ob inzwischen jemand anderes
// dieselbe Begehung gespeichert hat.
function markiereServerGesichert(dateiname, serverZeit) {
    try {
        localStorage.setItem(SERVER_STAND_KEY, JSON.stringify({
            zeit: new Date().toISOString(),
            datei: dateiname || '',
            serverZeit: serverZeit || '',
            kennung: begehungsKennung(),
            fp: stateFingerabdruck()
        }));
        localStorage.removeItem(SERVER_STAND_AUSSTEHEND_KEY);
    } catch (e) { /* ohne Speicher kein Hinweis */ }
    aktualisiereSicherungsHinweis();
}

// Markt + Datum: unterscheidet "dieselbe Begehung, geaendert" von "eine
// ganz andere Begehung" (z. B. neue Begehung oder Wiederholungsbegehung).
function begehungsKennung() {
    const c = state.companyInfo || {};
    return String(c.marktnummer || '').trim() + '|' + String(c.datum || '');
}

function begehungHatInhalt() {
    return Object.keys(state.ratings || {}).length > 0
        || (state.measures || []).length > 0
        || !!(state.companyInfo && String(state.companyInfo.marktnummer || '').trim());
}

// 'leer' | 'gesichert' | 'geaendert' (schon mal gesichert, danach geaendert) | 'ungesichert'
function sicherungsZustand() {
    if (!begehungHatInhalt()) return 'leer';
    const stand = leseServerStand();
    if (!stand || stand.kennung !== begehungsKennung()) return 'ungesichert';
    return stand.fp === stateFingerabdruck() ? 'gesichert' : 'geaendert';
}

function formatZeitpunkt(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('de-DE') + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
}

// Hinweis auf der Maßnahmenseite unterhalb der Unterschriften und des
// Foto-Hinweises (Platzhalter #sicherungs-hinweis-platz in massnahmen.html,
// ab Ausgabestand 1.54-4 - vorher oben im Pruefkatalog). Nur wenn
// Server-Funktionen verfuegbar sind. "Spaeter" blendet ihn fuer diese
// Sitzung aus.
function aktualisiereSicherungsHinweis() {
    const anker = document.getElementById('sicherungs-hinweis-platz');
    if (!anker) return;
    let box = document.getElementById('sicherungs-hinweis');
    const zustand = sicherungsZustand();
    let spaeter = false;
    try { spaeter = sessionStorage.getItem('asicHinweisSpaeter') === '1'; } catch (e) {}

    if (!serverFunktionenVerfuegbar() || spaeter || zustand === 'leer' || zustand === 'gesichert') {
        if (box) box.remove();
        return;
    }
    if (!box) {
        box = document.createElement('div');
        box.id = 'sicherungs-hinweis';
        box.className = 'lade-status is-warnung sicherungs-hinweis';
        box.setAttribute('role', 'status');
        box.innerHTML =
            '<span class="lade-status-icon" aria-hidden="true"></span>' +
            '<div class="lade-status-text">' +
                '<div class="lade-status-titel">Noch nicht im Team-Archiv gesichert</div>' +
                '<div class="lade-status-detail" data-hinweis-detail></div>' +
            '</div>' +
            '<div class="sicherungs-hinweis-knoepfe">' +
                '<button type="button" class="btn btn-primary btn-small" data-hinweis-sichern>☁️ Jetzt sichern</button>' +
                '<button type="button" class="btn btn-secondary btn-small" data-hinweis-spaeter>Später</button>' +
            '</div>';
        anker.appendChild(box);
        box.querySelector('[data-hinweis-sichern]').addEventListener('click', async (ev) => {
            ev.currentTarget.disabled = true;
            await saveStateToServer();
            const b = box.querySelector('[data-hinweis-sichern]');
            if (b) b.disabled = false;
        });
        box.querySelector('[data-hinweis-spaeter]').addEventListener('click', () => {
            try { sessionStorage.setItem('asicHinweisSpaeter', '1'); } catch (e) {}
            box.remove();
        });
    }
    const stand = leseServerStand();
    box.querySelector('[data-hinweis-detail]').textContent = zustand === 'geaendert' && stand
        ? 'Seit der letzten Sicherung (' + formatZeitpunkt(stand.zeit) + ') geändert – die Änderungen liegen bisher nur auf diesem Gerät.'
        : 'Diese Begehung liegt bisher nur auf diesem Gerät. Geht das Gerät verloren oder wird es zurückgesetzt, ist sie weg.';
}

let sicherungsHinweisTimer = null;
function planeSicherungsHinweis() {
    if (!document.getElementById('sicherungs-hinweis-platz')) return;
    clearTimeout(sicherungsHinweisTimer);
    sicherungsHinweisTimer = setTimeout(aktualisiereSicherungsHinweis, 800);
}

// Nach dem vollstaendigen Seitenaufbau: eine aus dem Team-Archiv geoeffnete
// Begehung (verlauf.html) gilt als gesichert. Erst hier, weil der
// Pruefkatalog beim ersten Aufbau noch Kommentare nachtraegt.
window.addEventListener('load', () => {
    let ausstehend = null;
    try { ausstehend = localStorage.getItem(SERVER_STAND_AUSSTEHEND_KEY); } catch (e) {}
    // Uebernahme im Pruefkatalog (dorthin fuehrt "In App anzeigen"), notfalls
    // auf der Maßnahmenseite
    if (ausstehend !== null && (document.getElementById('btn-save-nas') || document.getElementById('sicherungs-hinweis-platz'))) {
        // ab 1.54-9 als JSON { datei, serverZeit }, vorher nur der Dateiname
        let a = { datei: ausstehend, serverZeit: '' };
        try { if (ausstehend.charAt(0) === '{') a = Object.assign(a, JSON.parse(ausstehend)); } catch (e) { /* Dateiname */ }
        markiereServerGesichert(a.datei, a.serverZeit);
    } else {
        aktualisiereSicherungsHinweis();
    }
});

// ===== Hilfsfunktionen =====
// quelle: Begehung, aus der der Text freier Pruefpunkte stammt (Vorgabe:
// laufende Begehung). Freie Pruefpunkte ("Sonstiges") liefern eine Kopie
// mit dem eingetragenen Text.
function findItemById(itemId, quelle) {
    for (const category of AUDIT_CATEGORIES) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
            if (!item.frei) return { item, category };
            const text = freierText(item.id, quelle);
            return { item: Object.assign({}, item, { text: text || 'Sonstiges (ohne Text)' }), category };
        }
    }
    return null;
}

// ===== Freie Pruefpunkte (Kategorie "Sonstiges") =====
function freierText(itemId, quelle) {
    const q = quelle || state;
    return String(((q && q.freieTexte) || {})[itemId] || '').trim();
}

// Zaehlt der Pruefpunkt mit? Freie Pruefpunkte nur, wenn Text eingetragen
// oder bewertet ist - ein leeres Feld gilt nicht als "offen".
function punktZaehlt(item, quelle) {
    if (!item.frei) return true;
    const q = quelle || state;
    return !!freierText(item.id, q) || !!((q && q.ratings) || {})[item.id];
}

function punktText(item, quelle) {
    return item.frei ? (freierText(item.id, quelle) || 'Sonstiges (ohne Text)') : item.text;
}

function updateFreierText(itemId, value) {
    if (FREIE_PUNKT_IDS.indexOf(itemId) === -1) return;
    if (!state.freieTexte) state.freieTexte = {};
    const text = String(value || '').slice(0, 300);
    if (text.trim()) state.freieTexte[itemId] = text; else delete state.freieTexte[itemId];
    saveState();
    // Bewertungsknoepfe freigeben/sperren, ohne die Eingabe neu zu zeichnen
    const el = document.querySelector('.item[data-item-id="' + itemId + '"]');
    if (el) {
        const gesperrt = !text.trim() && !state.ratings[itemId];
        el.querySelectorAll('.rating-btn').forEach(b => {
            if (!b.hasAttribute('data-gesperrt-kategorie')) b.disabled = gesperrt;
        });
    }
    aktualisiereKategorieZaehler('sonstiges');
    updateStats();
}

function aktualisiereKategorieZaehler(categoryId) {
    const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);
    const el = document.querySelector('#cat-' + categoryId + ' > .category-header .category-count');
    if (!category || !el) return;
    const relevant = category.items.filter(i => punktZaehlt(i));
    const answered = relevant.filter(i => state.ratings[i.id]).length;
    el.textContent = answered + ' / ' + relevant.length;
    el.classList.toggle('complete', answered === relevant.length);
}

// getMeasureText(itemId, style) und setMeasureStyle(style) werden von js/text.js bereitgestellt.

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('de-DE');
}

function totalItemCount() {
    return AUDIT_CATEGORIES.reduce((sum, c) => sum + c.items.filter(i => punktZaehlt(i)).length, 0);
}

function showToast(message, type = 'success') {
    if (type === 'error') merkeFehler(message);
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), type === 'error' ? 6000 : 2600);
}

// ===== Vorgefertigter Mail-Text beim PDF-Versand =====
// Traegt automatisch Markt (Marktnummer, Strasse, PLZ/Ort) und den Namen
// des Pruefers ein. Wird von allen PDF-Varianten genutzt, mit leicht
// angepasstem Wortlaut je nachdem, was tatsaechlich mitgeschickt wird
// (mode: 'checkliste' | 'massnahmen' | 'fotos' | 'alle').
function buildShareEmailSubject(mode) {
    const markt = state.companyInfo.marktnummer || '-';
    const zusatz = mode === 'massnahmen' ? 'Maßnahmenplan – '
        : mode === 'fotos' ? 'Fotodokumentation – '
        : '';
    return `${zusatz}Arbeitssicherheitsbegehung Markt ${markt}`;
}

function buildShareEmailText(mode) {
    const markt = state.companyInfo.marktnummer || '-';
    const pruefer = state.companyInfo.pruefername ? state.companyInfo.pruefername + '\n' : '';

    const adresseTeile = [state.companyInfo.strasse, state.companyInfo.plzOrt].filter(Boolean);
    const adresse = adresseTeile.length > 0 ? ` (${adresseTeile.join(', ')})` : '';

    const inhalt = mode === 'massnahmen'
        ? 'den Maßnahmenplan'
        : mode === 'fotos'
            ? 'die Fotodokumentation'
            : mode === 'alle'
                ? 'das vollständige Begehungsprotokoll inklusive Maßnahmenplan und Fotodokumentation'
                : 'das Begehungsprotokoll';

    return `Sehr geehrte Damen und Herren,\n\nim Rahmen der turnusmäßigen Arbeitssicherheitsbegehung übersende ich Ihnen anbei ${inhalt} des Marktes ${markt}${adresse} zur sachlichen Prüfung.\n\nIch bitte Sie, die im Protokoll dokumentierten Feststellungen zu prüfen und die erforderlichen Maßnahmen zur Behebung der festgestellten Mängel zu veranlassen.\n\nVielen Dank für Ihre Unterstützung.\n\nMit freundlichen Grüßen\n${pruefer}Fachkraft für Arbeitssicherheit (SiFa)`;
}

// ===== Desktop-App (Tauri, Windows/WebView2) (ab Ausgabestand 1.54-14, Ablage ab 1.54-15) =====
// Laeuft die App in einer Tauri-Huelle, gibt es dort weder neue Fenster
// (window.open wird geblockt) noch das Teilen-Menue (navigator.share) noch
// gespeicherte Downloads; Mail-Links (mailto:) koennen grundsaetzlich keinen
// Anhang mitgeben. Deshalb unter Tauri: Drucken ueber einen unsichtbaren
// Rahmen auf derselben Seite, "PDF teilen" ausgeblendet, Downloads ueber den
// Desktop-Befehl datei_ablegen (Downloads\ASiC Handel), "Mail mit PDF
// vorbereiten" oeffnet die Mail und zeigt das gespeicherte PDF im Explorer.
// Browser und iPad verhalten sich unveraendert.
function laeuftInTauri() {
    try {
        return !!(window.__TAURI_INTERNALS__ || window.__TAURI__ || window.__TAURI_IPC__)
            || /(^|\.)tauri\.localhost$/i.test(location.hostname) || location.protocol === 'tauri:';
    } catch (e) { return false; }
}

// PDF in einem unsichtbaren Rahmen laden und dessen Druckdialog oeffnen.
// Liefert false, wenn das nicht moeglich ist (dann laedt der Aufrufer herunter).
function druckePdfImRahmen(blob) {
    return new Promise(resolve => {
        const alt = document.getElementById('druck-rahmen');
        if (alt) alt.remove();
        const url = URL.createObjectURL(blob);
        const rahmen = document.createElement('iframe');
        rahmen.id = 'druck-rahmen';
        rahmen.setAttribute('aria-hidden', 'true');
        rahmen.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
        let fertig = false;
        const ende = ok => { if (fertig) return; fertig = true; resolve(ok); };
        rahmen.addEventListener('load', () => {
            // dem PDF-Betrachter kurz Zeit zum Aufbauen geben
            setTimeout(() => {
                try {
                    rahmen.contentWindow.focus();
                    rahmen.contentWindow.print();
                    ende(true);
                } catch (e) {
                    console.error('Drucken im Rahmen nicht möglich:', e);
                    ende(false);
                }
                // Rahmen und Adresse spaeter aufraeumen (Druckdialog braucht sie noch)
                setTimeout(() => { rahmen.remove(); URL.revokeObjectURL(url); }, 120000);
            }, 700);
        });
        setTimeout(() => ende(false), 15000);
        rahmen.src = url;
        document.body.appendChild(rahmen);
    });
}

// Datei ueber den Desktop-Befehl `datei_ablegen` (src-tauri/src/main.rs)
// unter Downloads\ASiC Handel speichern; liefert den vollstaendigen Pfad.
// zeigen = true: Datei anschliessend im Explorer markiert anzeigen.
async function tauriDateiAblegen(blob, dateiname, zeigen) {
    const core = window.__TAURI__ && window.__TAURI__.core;
    if (!core || typeof core.invoke !== 'function') {
        throw new Error('Speichern ist in dieser Version der Desktop-App nicht vorgesehen');
    }
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return core.invoke('datei_ablegen', bytes, {
        headers: { 'asic-dateiname': encodeURIComponent(dateiname || 'ASiC-Handel-Datei'), 'asic-zeigen': zeigen ? '1' : '0' }
    });
}

function dateinameAusPfad(pfad) {
    return String(pfad || '').split(/[\\/]/).pop();
}

// Downloads in der Desktop-App: Die Webansicht speichert keine Downloads.
// Links mit download-Attribut (auch die von jsPDF doc.save()) werden deshalb
// abgefangen und ueber tauriDateiAblegen() gespeichert.
// Inhalt zu blob:-Adressen (fetch() darauf verbietet die Content-Security-
// Policy, und manche Exporte geben die Adresse sofort wieder frei)
const tauriBlobInhalte = new Map();

function blobAusAdresse(href) {
    if (/^blob:/i.test(href)) {
        const blob = tauriBlobInhalte.get(href);
        return blob ? Promise.resolve(blob) : Promise.reject(new Error('Dateiinhalt nicht mehr verfügbar'));
    }
    // data:[<typ>][;base64],<daten>
    const m = /^data:([^,]*?)(;base64)?,(.*)$/is.exec(href);
    if (!m) return Promise.reject(new Error('Unbekanntes Adressformat'));
    const roh = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
    const bytes = new Uint8Array(roh.length);
    for (let i = 0; i < roh.length; i++) bytes[i] = roh.charCodeAt(i) & 0xff;
    return Promise.resolve(new Blob([bytes], { type: m[1] || 'application/octet-stream' }));
}

function tauriDownloadAbfangen(a) {
    const href = (a && a.getAttribute('href')) || '';
    if (!a || !a.hasAttribute('download') || !/^(blob:|data:)/i.test(href)) return false;
    const name = a.getAttribute('download') || 'ASiC-Handel-Datei';
    blobAusAdresse(href)
        .then(blob => tauriDateiAblegen(blob, name, true))
        .then(pfad => showToast('Gespeichert unter Downloads\\ASiC Handel: ' + dateinameAusPfad(pfad)))
        .catch(err => showToast('Speichern fehlgeschlagen: ' + (err && err.message ? err.message : err), 'error'));
    return true;
}

if (laeuftInTauri()) {
    const erzeugenOriginal = URL.createObjectURL.bind(URL);
    URL.createObjectURL = function (obj) {
        const url = erzeugenOriginal(obj);
        if (obj instanceof Blob) {
            tauriBlobInhalte.set(url, obj);
            // nach 5 Minuten vergessen (Speicher)
            setTimeout(() => tauriBlobInhalte.delete(url), 300000);
        }
        return url;
    };
    const klickOriginal = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
        if (tauriDownloadAbfangen(this)) return;
        return klickOriginal.call(this);
    };
    const ereignisOriginal = HTMLAnchorElement.prototype.dispatchEvent;
    HTMLAnchorElement.prototype.dispatchEvent = function (ev) {
        if (ev && ev.type === 'click' && tauriDownloadAbfangen(this)) return false;
        return ereignisOriginal.call(this, ev);
    };
    document.addEventListener('click', e => {
        const a = e.target && e.target.closest ? e.target.closest('a[download]') : null;
        if (a && tauriDownloadAbfangen(a)) e.preventDefault();
    }, true);
}

function dateiHerunterladen(blob, dateiname) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dateiname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function oeffneMailLink(url) {
    window.location.href = url;
}

// Desktop-App: Das (neue) Outlook laesst sich von aussen keine Mail mit
// Anhang vorbereiten. Deshalb: PDF unter Downloads\ASiC Handel speichern und
// im Explorer markiert zeigen, danach die Mail mit Betreff und Text oeffnen -
// das PDF wird in die Mail gezogen.
async function mailMitPdfDesktop(betreff, text, pdfBlob, pdfName) {
    let pfad = null;
    let fehler = null;
    try {
        pfad = await tauriDateiAblegen(pdfBlob, pdfName, true);
    } catch (err) {
        fehler = err;
        console.error('PDF konnte nicht gespeichert werden:', err);
    }
    const url = 'mailto:?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text);
    // kurz warten, damit die Mail ueber dem Explorer-Fenster erscheint
    setTimeout(() => oeffneMailLink(url), pfad ? 800 : 0);
    if (pfad) {
        showToast('PDF im Explorer markiert (Downloads\\ASiC Handel) – in die Mail ziehen');
    } else {
        showToast('Mail geöffnet, PDF nicht gespeichert: ' + (fehler && fehler.message ? fehler.message : fehler), 'error');
    }
}

// "Mail mit PDF vorbereiten" in der Desktop-App
async function mailEntwurfMitPdf(mode) {
    try {
        showToast('PDF wird erstellt …');
        const doc = await buildReportPdf(mode);
        await mailMitPdfDesktop(buildShareEmailSubject(mode), buildShareEmailText(mode), doc.output('blob'), reportFilename(mode));
    } catch (err) {
        console.error('Mail mit PDF fehlgeschlagen:', err);
        showToast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Zuverlaessige Alternative zu navigator.share() fuer Betreff/Text:
// iOS uebernimmt title/text beim Teilen an die Mail-App oft nicht zuverlaessig.
// mailto: oeffnet eine neue Mail mit korrekt befuelltem Betreff/Text - kann aber
// aus einer Web-App heraus keinen Anhang setzen.
function openPrefilledMail(mode) {
    const subject = encodeURIComponent(buildShareEmailSubject(mode));
    const body = encodeURIComponent(buildShareEmailText(mode));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ===== Aufklappbares Menü (generisch, fuer Export- UND Datei-Menü nutzbar) =====
function initDropdownMenu(toggleId, panelId) {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return;

    // Unterebenen (Datei-Menue ab 1.54-9): "menu-weiter" oeffnet die Ebene
    // aus data-ziel, "menu-zurueck" fuehrt zur Hauptebene zurueck.
    function zeigeEbene(name) {
        const ebenen = panel.querySelectorAll('.menu-ebene');
        if (!ebenen.length) return;
        ebenen.forEach(e => { e.hidden = e.dataset.ebene !== name; });
        const erstes = panel.querySelector(`.menu-ebene[data-ebene="${name}"] button`);
        if (erstes && name !== 'haupt' && window.matchMedia && window.matchMedia('(pointer: fine)').matches) erstes.focus();
    }
    panel.querySelectorAll('.menu-weiter, .menu-zurueck').forEach(b => {
        b.addEventListener('click', e => { e.stopPropagation(); zeigeEbene(b.dataset.ziel); });
    });

    function closeMenu() {
        panel.classList.remove('open');
        document.removeEventListener('click', onOutsideClick);
        zeigeEbene('haupt');
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
    panel.querySelectorAll('.menu-item:not(.menu-weiter)').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

// ===== Export-Menü: Modus-Auswahl (Checkliste / Maßnahmen / Fotos / Alles) + Aktionen =====
// Auf allen Seiten gleich: Vorauswahl ist "Alles" (vollstaendiger Bericht).
let exportMode = 'alle';

// ===== Server-Speicherung (save.php / list.php / load.php) =====
// Setzt voraus, dass die App direkt ueber den Server aufgerufen
// wird - die drei PHP-Skripte muessen im
// selben Verzeichnis wie diese Seite liegen. Ueber eine andere Adresse
// (z. B. GitHub Pages) sind diese Endpunkte nicht erreichbar, da dort
// keine serverseitigen Skripte laufen koennen.

async function parseJsonResponse(res) {
    try {
        return await res.json();
    } catch (parseErr) {
        throw new Error('Ungültige Antwort vom Server (kein gültiges JSON).');
    }
}

// Liest eine optional in den Einstellungen hinterlegte Server-Basis-Adresse
// aus localStorage. Leer/nicht gesetzt = bisheriges Verhalten (relative
// Pfade, Endpunkte muessen im selben Verzeichnis wie diese Seite liegen).
function getNasBaseUrl() {
    try {
        const raw = localStorage.getItem('nasBaseUrl');
        return raw ? raw.trim() : '';
    } catch (e) {
        return '';
    }
}

// Baut die tatsaechlich zu verwendende Endpunkt-Adresse: mit konfigurierter
// Basis-Adresse wird diese vorangestellt, ansonsten bleibt es beim
// bisherigen relativen Pfad ("./save.php" etc.) - unveraendertes Verhalten
// fuer alle, die nichts konfiguriert haben.
function nasUrl(path) {
    const base = getNasBaseUrl();
    if (!base) return './' + path;
    return base.replace(/\/+$/, '') + '/' + path;
}

// ===== Zugriffsschluessel (ab Ausgabestand 1.54-16) =====
// Der Schluessel wird NICHT mehr als Text gespeichert. Beim Eintragen legt
// die App ihn ueber Web Crypto als nicht exportierbaren HMAC-Schluessel in
// IndexedDB ab ("gesperrt"): Der Browser kann damit unterschreiben, gibt
// den Schluessel selbst aber nicht heraus - auch nicht ueber die
// Entwicklerwerkzeuge. Jede Server-Anfrage wird unterschrieben (siehe
// schutz.php, asicSignaturGrund); der Schluessel geht nie ueber das Netz.
// In localStorage steht nur 'nasApiKeyInfo' (Laenge, letzte 4 Zeichen).
// Schluessel und Server-Adresse nur ueber HTTPS: Ohne HTTPS gibt es kein
// Web Crypto - dann wird kein Schluessel gespeichert oder verschickt.
// Ein noch als Text gespeicherter Schluessel ('nasApiKey', aeltere
// Ausgabestaende) wird beim ersten Aufruf automatisch umgestellt.
// Ohne HTTPS bleibt ein alter Text-Schluessel liegen, wird aber nicht
// verwendet, bis die App ueber HTTPS geoeffnet wird.
const NAS_KEY_TEXT = 'nasApiKey';
const NAS_KEY_INFO = 'nasApiKeyInfo';
let nasKeyCache;            // undefined = noch nicht geladen, null = keiner
let nasZeitVersatz = 0;     // Sekunden: Serverzeit minus Geraetezeit

// Server-Adresse sicher? https:// oder lokale Testadresse; leer = wie die App
function adresseSicher(adresse) {
    if (!adresse) return true;
    try {
        const u = new URL(adresse, location.href);
        if (u.protocol === 'https:') return true;
        return u.protocol === 'http:' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname);
    } catch (e) {
        return false;
    }
}

function kryptoSchluesselMoeglich() {
    try {
        return !!(window.isSecureContext !== false && window.crypto && window.crypto.subtle && window.indexedDB);
    } catch (e) {
        return false;
    }
}

function schluesselDb(aktion, wert) {
    return new Promise((resolve, reject) => {
        let anfrage;
        try { anfrage = indexedDB.open('asic-sicherheit', 1); } catch (e) { reject(e); return; }
        anfrage.onupgradeneeded = () => anfrage.result.createObjectStore('schluessel');
        anfrage.onerror = () => reject(anfrage.error);
        anfrage.onsuccess = () => {
            const db = anfrage.result;
            try {
                const tx = db.transaction('schluessel', aktion === 'lesen' ? 'readonly' : 'readwrite');
                const st = tx.objectStore('schluessel');
                const r = aktion === 'lesen' ? st.get('nas') : aktion === 'schreiben' ? st.put(wert, 'nas') : st.delete('nas');
                tx.oncomplete = () => { db.close(); resolve(aktion === 'lesen' ? r.result : true); };
                tx.onerror = tx.onabort = () => { db.close(); reject(tx.error); };
            } catch (e) { db.close(); reject(e); }
        };
    });
}

// Nur Angaben zur Anzeige: { laenge, ende, art: 'gesperrt' | 'klartext' } oder null
function nasSchluesselInfo() {
    try {
        const text = localStorage.getItem(NAS_KEY_TEXT);
        if (text) return { laenge: text.length, ende: text.slice(-4), art: 'klartext' };
        const info = JSON.parse(localStorage.getItem(NAS_KEY_INFO) || 'null');
        return info && info.laenge ? info : null;
    } catch (e) {
        return null;
    }
}

function nasSchluesselImportieren(text) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(text),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

// Speichert einen neu eingetragenen Schluessel. Ergebnis: 'gesperrt' oder
// 'klartext' (Geraet/Browser ohne Web Crypto bzw. ohne HTTPS).
async function nasSchluesselSpeichern(text) {
    if (!text) { await nasSchluesselLoeschen(); return null; }
    if (!kryptoSchluesselMoeglich()) {
        throw new Error('Der Zugriffsschlüssel lässt sich nur verwenden, wenn die App über HTTPS geöffnet ist.');
    }
    let key;
    try {
        key = await nasSchluesselImportieren(text);
        await schluesselDb('schreiben', key);
    } catch (e) {
        console.warn('Schlüssel konnte nicht geschützt abgelegt werden:', e);
        throw new Error('Der Schlüssel konnte auf diesem Gerät nicht geschützt gespeichert werden (Browser-Speicher nicht verfügbar).');
    }
    localStorage.setItem(NAS_KEY_INFO, JSON.stringify({ laenge: text.length, ende: text.slice(-4), art: 'gesperrt' }));
    localStorage.removeItem(NAS_KEY_TEXT);
    nasKeyCache = { art: 'gesperrt', key };
    return 'gesperrt';
}

async function nasSchluesselLoeschen() {
    try { localStorage.removeItem(NAS_KEY_TEXT); localStorage.removeItem(NAS_KEY_INFO); } catch (e) {}
    nasKeyCache = null;
    if (kryptoSchluesselMoeglich()) {
        try { await schluesselDb('loeschen'); } catch (e) {}
    }
}

// Schluessel fuer Anfragen: { art: 'gesperrt', key } | null
async function nasSchluesselHolen() {
    if (nasKeyCache !== undefined) return nasKeyCache;
    let text = '';
    try { text = localStorage.getItem(NAS_KEY_TEXT) || ''; } catch (e) {}
    if (text) {
        if (kryptoSchluesselMoeglich()) {
            try {
                await nasSchluesselSpeichern(text);   // einmalige Umstellung
                return nasKeyCache;
            } catch (e) {
                return null;
            }
        }
        return null;   // ohne HTTPS: Klartext nie verschicken
    }
    const info = nasSchluesselInfo();
    if (!info || !kryptoSchluesselMoeglich()) { nasKeyCache = null; return null; }
    try {
        const key = await schluesselDb('lesen');
        if (key) { nasKeyCache = { art: 'gesperrt', key }; return nasKeyCache; }
    } catch (e) {
        return null;   // voruebergehend nicht lesbar: nicht zwischenspeichern
    }
    // Browser-Speicher wurde geleert: Anzeige bereinigen
    try { localStorage.removeItem(NAS_KEY_INFO); } catch (e) {}
    nasKeyCache = null;
    return null;
}

function hexAus(puffer) {
    return Array.from(new Uint8Array(puffer), b => b.toString(16).padStart(2, '0')).join('');
}

// Wert der Kopfzeile X-Api-Key: unterschrieben ("asic1:…") oder Klartext
async function nasAuthKopf(methode, endpunkt, abfrage, inhalt, schluessel) {
    if (!schluessel || schluessel.art !== 'gesperrt') return null;
    const enc = new TextEncoder();
    const zeit = String(Math.floor(Date.now() / 1000) + nasZeitVersatz);
    const nonce = hexAus(crypto.getRandomValues(new Uint8Array(16)));
    const inhaltHash = hexAus(await crypto.subtle.digest('SHA-256', enc.encode(inhalt || '')));
    const nachricht = ['asic1', methode, endpunkt, abfrage || '', zeit, nonce, inhaltHash].join('\n');
    const sig = hexAus(await crypto.subtle.sign('HMAC', schluessel.key, enc.encode(nachricht)));
    return 'asic1:' + zeit + ':' + nonce + ':' + sig;
}

// Anfrage an einen Server-Endpunkt (save.php, list.php, load.php, offen.php).
//   abfrage    Teil nach dem "?" (bereits kodiert), z. B. 'filename=…'
//   schluessel undefined = gespeicherter Schluessel, null = ohne,
//              sonst ein Objekt wie von nasSchluesselHolen()
//   base       undefined = eingestellte Server-Adresse
// Weicht die Geraeteuhr ab, gleicht die App sie einmal an und wiederholt.
async function nasFetch(endpunkt, abfrage, options, schluessel, base, wiederholt) {
    const opts = Object.assign({}, options || {});
    if (schluessel === undefined) schluessel = await nasSchluesselHolen();
    const basis = base === undefined ? getNasBaseUrl() : base;
    if (!adresseSicher(basis)) {
        throw new Error('Die Server-Adresse muss mit https:// beginnen (Einstellungen).');
    }
    const url = (base === undefined ? nasUrl(endpunkt) : (base ? base.replace(/\/+$/, '') + '/' : './') + endpunkt)
        + (abfrage ? '?' + abfrage : '');
    const methode = String(opts.method || 'GET').toUpperCase();
    const kopf = await nasAuthKopf(methode, endpunkt, abfrage, typeof opts.body === 'string' ? opts.body : '', schluessel);
    if (kopf) opts.headers = Object.assign({}, opts.headers, { 'X-Api-Key': kopf });
    const res = await fetch(url, opts);
    if (res.status === 401 && kopf && kopf.indexOf('asic1:') === 0 && !wiederholt) {
        let j = null;
        try { j = await res.clone().json(); } catch (e) {}
        if (j && j.grund === 'zeit' && Number.isFinite(j.serverZeit)) {
            nasZeitVersatz = j.serverZeit - Math.floor(Date.now() / 1000);
            return nasFetch(endpunkt, abfrage, options, schluessel, base, true);
        }
    }
    return res;
}

// Noch als Text gespeicherten Schluessel gleich beim Start umstellen
try {
    const i = nasSchluesselInfo();
    if (i && i.art === 'klartext' && kryptoSchluesselMoeglich()) nasSchluesselHolen();
} catch (e) {}

// Angaben fuer save.php, um gleichzeitiges Bearbeiten zu erkennen (ab
// 1.54-9): welche Datei mit welchem Stand dieses Geraet zuletzt vom Server
// hatte. Gehoert der Merker zu einer anderen Begehung (Markt + Datum), gilt
// die Begehung als neu - liegt fuer Markt und Datum schon eine Datei vor,
// fragt die App nach.
function speicherSteuerung(modus) {
    const stand = leseServerStand();
    const passt = stand && stand.kennung === begehungsKennung() && stand.datei;
    return {
        modus: modus || 'normal',
        basisDatei: passt ? stand.datei : null,
        basisStand: passt && stand.serverZeit ? stand.serverZeit : null,
        basisUnbekannt: !!(passt && !stand.serverZeit)
    };
}

async function saveStateToServer(modus) {
    if (typeof modus !== 'string') modus = 'normal';
    try {
        const res = await nasFetch('save.php', '', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify(Object.assign({}, serverNutzdaten(), { _speichern: speicherSteuerung(modus) }))
        });
        const result = await parseJsonResponse(res);
        if (res.status === 409 && result && result.konflikt) {
            const wahl = await frageBeiKonflikt(result);
            if (wahl) return saveStateToServer(wahl);
            showToast('Nicht gespeichert – der Stand im Team-Archiv bleibt unverändert.');
            return;
        }
        if (!res.ok || !result.ok) {
            throw new Error(result.message || `Fehler beim Speichern (HTTP ${res.status}).`);
        }
        markiereServerGesichert(result.fileName, result.savedAt);
        meldeGeschlossen();
        showToast(result.fassung
            ? 'Als eigene Fassung gespeichert (Fassung ' + result.fassung + ')'
            : 'Auf Server gespeichert: ' + result.fileName);
    } catch (err) {
        console.error('Server-Speichern fehlgeschlagen:', err);
        showToast('Speichern auf dem Server fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function getServerFiles() {
    const res = await nasFetch('list.php', '', { cache: 'no-store' });
    const result = await parseJsonResponse(res);
    if (!res.ok || !result.ok) {
        throw new Error(result.message || `Fehler beim Abrufen der Dateiliste (HTTP ${res.status}).`);
    }
    return result.files || [];
}

// Wie loadStateFromServer(), aendert aber NICHT den globalen state - gibt
// den geladenen Datensatz einfach zurueck. Wird fuer das Team-Archiv
// (verlauf.html) genutzt, um eine fremde, auf dem Server gespeicherte Begehung
// anzusehen/zu exportieren, ohne die gerade laufende eigene Begehung zu
// ueberschreiben.
async function fetchServerRecord(filename) {
    const res = await nasFetch('load.php', 'filename=' + encodeURIComponent(filename), { cache: 'no-store' });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
        throw new Error((result && result.message) || `Fehler beim Laden (HTTP ${res.status}).`);
    }
    return begehungAusDatensatz(result);
}

// ===== Markt-Datensaetze der Version 2 (gemeinsamer Datenordner) =====
// Version 2 speichert Begehung und Gefaehrdungsbeurteilung (GBO) gemeinsam
// als "ASiC-Marktcontainer" (Begehung unter "audit"). Die 1.54 liest daraus
// die Begehung. Wird so ein Datensatz hier geoeffnet und wieder gespeichert,
// bleiben GBO-Teil und Verknuepfungen erhalten (merkeMarktContainer /
// saveStateToServer) - sonst wuerde die Datei ohne GBO ueberschrieben.
const MARKT_CONTAINER_KEY = 'asicMarktContainerV2';

function istMarktDatensatz(x) {
    return !!x && x.format === 'ASiC-Marktcontainer' && Number(x.formatVersion) >= 2 && !!x.audit;
}

function begehungAusDatensatz(x) {
    if (!istMarktDatensatz(x)) return x;
    const b = Object.assign({}, x.audit);
    if (!b.companyInfo) b.companyInfo = x.companyInfo || {};
    if (x._nas) b._nas = x._nas;
    Object.defineProperty(b, '__markt', { value: x, enumerable: false });
    return b;
}

// Merkt sich beim Oeffnen eines Markt-Datensatzes dessen uebrige Teile
// (ohne Begehung). Bei einer normalen Begehung wird der Merker geloescht.
function merkeMarktContainer(record) {
    try {
        const m = record && record.__markt;
        if (!m) { localStorage.removeItem(MARKT_CONTAINER_KEY); return; }
        const rest = Object.assign({}, m);
        delete rest.audit;
        delete rest._nas;
        const c = record.companyInfo || {};
        localStorage.setItem(MARKT_CONTAINER_KEY, JSON.stringify({
            kennung: String(c.marktnummer || '').trim() + '|' + String(c.datum || ''),
            rest
        }));
    } catch (e) { /* ohne Speicher: wird als normale Begehung gespeichert */ }
}

// Nutzdaten fuer save.php: bei einem geoeffneten Markt-Datensatz derselben
// Begehung (Markt + Datum) wieder als Markt-Datensatz, sonst die Begehung.
function serverNutzdaten() {
    try {
        const g = JSON.parse(localStorage.getItem(MARKT_CONTAINER_KEY) || 'null');
        if (g && g.rest && g.kennung === begehungsKennung()) {
            const c = state.companyInfo || {};
            return Object.assign({}, g.rest, {
                savedAt: new Date().toISOString(),
                market: Object.assign({}, g.rest.market || {}, { marktnummer: c.marktnummer || '', plzOrt: c.plzOrt || '', strasse: c.strasse || '' }),
                companyInfo: c,
                audit: state
            });
        }
    } catch (e) { /* normale Begehung */ }
    return state;
}

// Uebernimmt einen vom Server geladenen Datensatz als laufende Begehung.
// Wie "In App anzeigen" im Team-Archiv: auch die Unterbereich-Schalter
// werden uebernommen und der lokale Fotobestand geleert (Server-Datensaetze
// enthalten keine Fotos) - sonst blieben Schalter und Fotos der vorherigen
// Begehung stehen (ab Ausgabestand 1.54-8).
async function applyServerRecord(result, filename) {
    const leer = defaultState();
    state.companyInfo = Object.assign({}, leer.companyInfo, result.companyInfo || {});
    state.ratings = result.ratings || {};
    state.comments = result.comments || {};
    state.measures = result.measures || [];
    state.signatures = Object.assign({}, leer.signatures, result.signatures || {});
    state.notApplicable = result.notApplicable || {};
    state.subgroupNotApplicable = result.subgroupNotApplicable || {};
    state.freieTexte = result.freieTexte || {};
    merkeMarktContainer(result);

    if (typeof deleteAllPhotos === 'function') {
        try { await deleteAllPhotos(); } catch (e) { console.error('Fotos konnten nicht geleert werden:', e); }
    }

    saveState();
    if (typeof renderChecklist === 'function') renderChecklist();
    // WICHTIG: erneutes saveState() NACH renderChecklist(), da dort die
    // Kommentar-Nachruestung fuer die Maßnahmen passiert - sonst wuerde der
    // nachgetragene Kommentar beim naechsten Laden (z. B. auf der
    // Maßnahmenseite) wieder fehlen.
    saveState();
    markiereServerGesichert(filename, (result && result._nas && result._nas.savedAt) || '');
    meldeGeoeffnet(filename);
    if (typeof initCompanyForm === 'function') initCompanyForm();
    if (typeof renderCompanyInfoStrip === 'function') renderCompanyInfoStrip();
    if (typeof renderMeasures === 'function') await renderMeasures();
    if (typeof restoreSignatures === 'function') restoreSignatures();
}

async function loadStateFromServer(filename) {
    const result = await fetchServerRecord(filename);
    await applyServerRecord(result, filename);
    showToast('Begehung vom Server geladen: ' + filename);
}

// ===== Dialog "Vom Server laden" (ab Ausgabestand 1.54-8) =====
// Liste mit Suche, Rueckfrage vor dem Ersetzen einer offenen Begehung
// (wahlweise vorher im Verlauf archivieren), Lade- und Fehlerzustaende.
async function openServerLoadDialog() {
    if (document.getElementById('srv-dialog')) return;
    const overlay = document.createElement('div');
    overlay.className = 'srv-overlay';
    overlay.id = 'srv-dialog';
    overlay.innerHTML = `
        <div class="srv-box" role="dialog" aria-modal="true" aria-labelledby="srv-titel">
            <div class="srv-kopf">
                <div>
                    <h2 class="srv-titel" id="srv-titel">Vom Server laden</h2>
                    <p class="srv-sub">Begehungen aus dem Team-Archiv</p>
                </div>
                <button type="button" class="srv-x" aria-label="Schließen">×</button>
            </div>
            <div class="srv-inhalt"></div>
        </div>`;
    document.body.appendChild(overlay);
    document.documentElement.classList.add('srv-offen');

    const inhalt = overlay.querySelector('.srv-inhalt');
    let dateien = [];
    let offenListe = [];
    let suchtext = '';

    function schliessen() {
        overlay.remove();
        document.documentElement.classList.remove('srv-offen');
        document.removeEventListener('keydown', taste);
    }
    function taste(e) { if (e.key === 'Escape') schliessen(); }
    document.addEventListener('keydown', taste);
    overlay.addEventListener('click', e => { if (e.target === overlay) schliessen(); });
    overlay.querySelector('.srv-x').addEventListener('click', schliessen);

    const fehlerText = err => escapeHtml(err && err.message ? err.message : 'unbekannter Fehler');
    const formatGespeichert = iso => {
        const d = iso ? new Date(iso) : null;
        if (!d || isNaN(d)) return '';
        return 'gespeichert ' + d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    };

    function zeigeFehler(titel, err, nochmal) {
        inhalt.innerHTML = `
            <div class="srv-meldung srv-meldung-fehler">
                <strong>${escapeHtml(titel)}</strong>
                <p>${fehlerText(err)}</p>
                <p class="srv-klein">Kein Netz? Sonst bitte Server-Adresse und Zugriffsschlüssel unter <a href="einstellungen.html">Einstellungen</a> prüfen.</p>
            </div>
            <div class="srv-aktionen"><button type="button" class="btn btn-primary btn-small" data-srv="nochmal">Erneut versuchen</button></div>`;
        inhalt.querySelector('[data-srv="nochmal"]').addEventListener('click', nochmal);
    }

    async function ladeListe() {
        inhalt.innerHTML = '<div class="srv-meldung"><span class="srv-spinner" aria-hidden="true"></span> Dateiliste wird geladen …</div>';
        try {
            [dateien, offenListe] = await Promise.all([getServerFiles(), ladeOffenListe()]);
        } catch (err) {
            console.error('Dateiliste konnte nicht geladen werden:', err);
            zeigeFehler('Dateiliste konnte nicht geladen werden', err, ladeListe);
            return;
        }
        zeigeListe();
    }

    function passt(f, q) {
        if (!q) return true;
        const text = [f.marktnummer, f.plzOrt, f.firma, f.datum, f.datumISO, f.fileName].join(' ').toLowerCase();
        return q.split(/\s+/).every(w => text.includes(w));
    }

    function zeigeListe() {
        if (!dateien.length) {
            inhalt.innerHTML = '<div class="srv-meldung"><strong>Noch keine Begehung auf dem Server.</strong><p>Eine Begehung gelangt über „Auf Server speichern“ ins Team-Archiv.</p></div>';
            return;
        }
        inhalt.innerHTML = `
            <div class="srv-suche">
                <input type="search" class="srv-suchfeld" placeholder="Marktnummer, Ort oder Datum suchen" aria-label="Begehungen durchsuchen" value="${escapeHtml(suchtext)}" autocomplete="off">
            </div>
            <p class="srv-anzahl" aria-live="polite"></p>
            <div class="srv-liste"></div>`;
        const feld = inhalt.querySelector('.srv-suchfeld');
        feld.addEventListener('input', () => { suchtext = feld.value; fuelleListe(); });
        if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) feld.focus();
        fuelleListe();
    }

    function fuelleListe() {
        const q = suchtext.trim().toLowerCase();
        const treffer = dateien.filter(f => passt(f, q));
        const stand = leseServerStand();
        const offen = stand && sicherungsZustand() !== 'leer' ? stand.datei : '';
        inhalt.querySelector('.srv-anzahl').textContent = q
            ? `${treffer.length} von ${dateien.length} Begehungen`
            : `${dateien.length} ${dateien.length === 1 ? 'Begehung' : 'Begehungen'}, neueste zuerst`;
        const liste = inhalt.querySelector('.srv-liste');
        if (!treffer.length) {
            liste.innerHTML = '<p class="srv-leer">Keine Begehung passt zur Suche.</p>';
            return;
        }
        liste.innerHTML = treffer.map(f => {
            const ort = f.plzOrt || f.firma || 'ohne Ortsangabe';
            const zusatz = f.plzOrt && f.firma ? f.firma : '';
            return `
            <button type="button" class="srv-eintrag" data-datei="${escapeHtml(f.fileName)}">
                <span class="srv-markt">${f.marktnummer ? 'Markt ' + escapeHtml(f.marktnummer) : 'ohne Marktnummer'}${fassungVon(f.fileName) ? ' <span class="srv-fassung">Fassung ' + fassungVon(f.fileName) + '</span>' : ''}</span>
                <span class="srv-datum">${escapeHtml(f.datum || '–')}</span>
                <span class="srv-ort">${escapeHtml(ort)}${zusatz ? ' · ' + escapeHtml(zusatz) : ''}</span>
                <span class="srv-meta">${escapeHtml(formatGespeichert(f.savedAt))}${vorWieLange(f.savedAt) ? ' · ' + escapeHtml(vorWieLange(f.savedAt)) : ''}${offenAnderswo(offenListe, f.fileName) ? '<span class="srv-badge srv-badge-offen">' + escapeHtml(offenKurztext(offenAnderswo(offenListe, f.fileName))) + '</span>' : (kuerzlichGespeichert(f.savedAt) && f.fileName !== offen ? '<span class="srv-badge srv-badge-frisch">kürzlich gespeichert</span>' : '')}${f.fileName === offen ? '<span class="srv-badge">auf diesem Gerät geöffnet</span>' : ''}</span>
            </button>`;
        }).join('');
        liste.querySelectorAll('.srv-eintrag').forEach(b => b.addEventListener('click', () => {
            const f = dateien.find(x => x.fileName === b.dataset.datei);
            if (f) waehle(f);
        }));
    }

    function waehle(f, offenBestaetigt) {
        const anderswo = offenAnderswo(offenListe, f.fileName);
        if (anderswo && !offenBestaetigt) {
            inhalt.innerHTML = `
                <div class="wb-karte">
                    <div class="ta-kopf"><span class="srv-markt">${escapeHtml(f.marktnummer ? 'Markt ' + f.marktnummer : 'ohne Marktnummer')}</span><span class="srv-datum">${escapeHtml(f.datum || '–')}</span></div>
                    ${(f.plzOrt || f.firma) ? `<div class="srv-ort">${escapeHtml([f.plzOrt, f.firma].filter(Boolean).join(' · '))}</div>` : ''}
                </div>
                <div class="srv-meldung srv-meldung-offen" style="margin-top:0.75rem">
                    <strong>Wird gerade bearbeitet?</strong>
                    <p>${escapeHtml(offenSatz(anderswo))}</p>
                </div>
                <div class="srv-aktionen srv-aktionen-spalte">
                    <button type="button" class="btn btn-primary" data-srv="trotzdem">Trotzdem öffnen</button>
                    <button type="button" class="btn btn-secondary" data-srv="zurueck">Zurück zur Liste</button>
                </div>`;
            inhalt.querySelector('[data-srv="trotzdem"]').addEventListener('click', () => waehle(f, true));
            inhalt.querySelector('[data-srv="zurueck"]').addEventListener('click', zeigeListe);
            return;
        }
        if (!begehungHatInhalt()) { lade(f, false); return; }
        const c = state.companyInfo || {};
        const zustand = sicherungsZustand();
        const aktuell = (c.marktnummer ? 'Markt ' + c.marktnummer : 'ohne Marktnummer') + (c.datum ? ' vom ' + formatDatumDe(c.datum) : '');
        const sicherung = zustand === 'gesichert'
            ? 'Sie ist auf dem Server gesichert – Fotos gibt es aber nur auf diesem Gerät.'
            : (zustand === 'geaendert' ? 'Sie wurde nach dem letzten Speichern auf dem Server geändert.' : 'Sie ist noch nicht auf dem Server gesichert.');
        inhalt.innerHTML = `
            <div class="srv-meldung srv-meldung-warnung">
                <strong>Offene Begehung wird ersetzt</strong>
                <p>Auf diesem Gerät ist die Begehung <b>${escapeHtml(aktuell)}</b> geöffnet. ${escapeHtml(sicherung)}</p>
                <p>Geladen wird <b>${escapeHtml(f.marktnummer ? 'Markt ' + f.marktnummer : 'ohne Marktnummer')}${f.datum ? ' vom ' + escapeHtml(f.datum) : ''}</b>. Daten vom Server enthalten keine Fotos; die Fotos auf diesem Gerät werden entfernt.</p>
            </div>
            <div class="srv-aktionen srv-aktionen-spalte">
                <button type="button" class="btn btn-primary" data-srv="archiv">Erst im Verlauf archivieren, dann laden</button>
                <button type="button" class="btn btn-secondary srv-btn-warn" data-srv="ersetzen">Ohne Archivieren ersetzen</button>
                <button type="button" class="btn btn-secondary" data-srv="zurueck">Zurück zur Liste</button>
            </div>`;
        inhalt.querySelector('[data-srv="archiv"]').addEventListener('click', () => lade(f, true));
        inhalt.querySelector('[data-srv="ersetzen"]').addEventListener('click', () => lade(f, false));
        inhalt.querySelector('[data-srv="zurueck"]').addEventListener('click', zeigeListe);
    }

    async function lade(f, vorherArchivieren) {
        inhalt.innerHTML = `<div class="srv-meldung"><span class="srv-spinner" aria-hidden="true"></span> ${vorherArchivieren ? 'Aktuelle Begehung wird archiviert, dann ' : ''}Begehung wird geladen …</div>`;
        let datensatz;
        try {
            datensatz = await fetchServerRecord(f.fileName);
        } catch (err) {
            console.error('Server-Laden fehlgeschlagen:', err);
            zeigeFehler('Begehung konnte nicht geladen werden', err, () => lade(f, vorherArchivieren));
            return;
        }
        if (vorherArchivieren) {
            const ok = await archiviereAktuelleBegehung();
            if (!ok) {
                zeigeFehler('Archivieren fehlgeschlagen – es wurde nichts ersetzt', new Error('Die aktuelle Begehung ist unverändert geöffnet.'), () => waehle(f));
                return;
            }
        }
        try {
            await applyServerRecord(datensatz, f.fileName);
        } catch (err) {
            console.error('Übernehmen fehlgeschlagen:', err);
            zeigeFehler('Begehung konnte nicht übernommen werden', err, () => lade(f, false));
            return;
        }
        schliessen();
        showToast((vorherArchivieren ? 'Archiviert und geladen: ' : 'Vom Server geladen: ') +
            (f.marktnummer ? 'Markt ' + f.marktnummer : f.fileName) + (f.datum ? ' vom ' + f.datum : ''));
    }

    ladeListe();
}

// Rueckfrage vor dem Ersetzen der offenen Begehung (Team-Archiv "In App
// anzeigen"). Liefert 'archiv', 'ersetzen' oder null (abgebrochen). Ist
// keine Begehung mit Eingaben offen, gilt sofort 'ersetzen'.
// Dialog "In App anzeigen" (Team-Archiv und Mein Verlauf), im Stil der
// Wiederholungsbegehung: zeigt immer, welche Begehung geoeffnet wird. Ist auf
// dem Geraet eine Begehung mit Eingaben offen, zusaetzlich der Hinweis und die
// Wahl "erst archivieren". Liefert 'archiv', 'ersetzen' oder null (abgebrochen).
// ziel: { marktnummer, datum (TT.MM.JJJJ), plzOrt, firma }
// opt:  { sub, punkte: [Text, ...] }
function frageVorErsetzen(ziel, opt) {
    opt = opt || {};
    ziel = ziel || {};
    return new Promise(resolve => {
        const markt = ziel.marktnummer ? 'Markt ' + ziel.marktnummer : 'ohne Marktnummer';
        const ort = [ziel.plzOrt, ziel.firma].filter(Boolean).join(' · ');
        const punkte = opt.punkte || [
            'Die Begehung wird auf diesem Gerät geöffnet und kann weiterbearbeitet werden.',
            'Daten aus dem Team-Archiv enthalten keine Fotos.'
        ];
        const ersetzt = begehungHatInhalt();
        let warnung = '';
        if (ersetzt) {
            const c = state.companyInfo || {};
            const zustand = sicherungsZustand();
            const aktuell = (c.marktnummer ? 'Markt ' + c.marktnummer : 'ohne Marktnummer') + (c.datum ? ' vom ' + formatDatumDe(c.datum) : '');
            const sicherung = zustand === 'gesichert'
                ? 'Sie ist auf dem Server gesichert – Fotos gibt es aber nur auf diesem Gerät.'
                : (zustand === 'geaendert' ? 'Sie wurde nach dem letzten Speichern auf dem Server geändert.' : 'Sie ist noch nicht auf dem Server gesichert.');
            warnung = `
                <div class="srv-meldung srv-meldung-warnung" style="margin-top:0.75rem">
                    <strong>Offene Begehung wird ersetzt</strong>
                    <p>Auf diesem Gerät ist die Begehung <b>${escapeHtml(aktuell)}</b> geöffnet. ${escapeHtml(sicherung)} Ihre Fotos werden vom Gerät entfernt.</p>
                </div>`;
        }
        const knoepfe = ersetzt
            ? `<button type="button" class="btn btn-primary" data-w="archiv">Erst im Verlauf archivieren, dann öffnen</button>
               <button type="button" class="btn btn-secondary srv-btn-warn" data-w="ersetzen">Ohne Archivieren ersetzen</button>
               <button type="button" class="btn btn-secondary" data-w="">Abbrechen</button>`
            : `<button type="button" class="btn btn-primary" data-w="ersetzen">In App anzeigen</button>
               <button type="button" class="btn btn-secondary" data-w="">Abbrechen</button>`;
        const overlay = document.createElement('div');
        overlay.className = 'srv-overlay';
        overlay.innerHTML = `
            <div class="srv-box" role="dialog" aria-modal="true" aria-labelledby="srv-r-titel">
                <div class="srv-kopf"><div><h2 class="srv-titel" id="srv-r-titel">In App anzeigen</h2><p class="srv-sub">${escapeHtml(opt.sub || 'Begehung aus dem Team-Archiv öffnen')}</p></div>
                <button type="button" class="srv-x" aria-label="Schließen">×</button></div>
                <div class="srv-inhalt">
                    <div class="wb-karte">
                        <div class="ta-kopf"><span class="srv-markt">${escapeHtml(markt)}</span><span class="srv-datum">${escapeHtml(ziel.datum || '–')}</span></div>
                        ${ort ? `<div class="srv-ort">${escapeHtml(ort)}</div>` : ''}
                    </div>
                    ${opt.hinweis ? `<div class="srv-meldung srv-meldung-offen" style="margin-top:0.75rem"><strong>${escapeHtml(opt.hinweis.titel)}</strong><p>${escapeHtml(opt.hinweis.text)}</p></div>` : ''}
                    <ul class="wb-liste">${punkte.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                    ${warnung}
                    <div class="srv-aktionen srv-aktionen-spalte">${knoepfe}</div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.documentElement.classList.add('srv-offen');
        const ende = w => { overlay.remove(); document.documentElement.classList.remove('srv-offen'); document.removeEventListener('keydown', taste); resolve(w || null); };
        function taste(e) { if (e.key === 'Escape') ende(null); }
        document.addEventListener('keydown', taste);
        overlay.addEventListener('click', e => { if (e.target === overlay) ende(null); });
        overlay.querySelector('.srv-x').addEventListener('click', () => ende(null));
        overlay.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => ende(b.dataset.w)));
    });
}

// ===== Hinweis "gerade geoeffnet" (ab 1.54-11) =====
// Reiner Hinweis, keine Sperre: Wer eine Begehung aus dem Team-Archiv
// oeffnet, meldet das an offen.php. Andere Geraete sehen dann "geoeffnet auf
// <Geraetename>". Abmeldung beim Speichern auf dem Server, Archivieren,
// Zuruecksetzen, JSON laden, Oeffnen aus "Mein Verlauf" und beim Anlegen
// einer Wiederholungsbegehung; ohne Abmeldung laeuft der Hinweis auf dem
// Server nach 4 Stunden ab. Fehlt offen.php (aelterer Server) oder ist man
// offline, passiert einfach nichts.
const GERAET_ID_KEY = 'asicGeraetId';
const GERAET_NAME_KEY = 'asicGeraetName';
const OFFEN_GEMELDET_KEY = 'asicOffenGemeldet';
const OFFEN_LETZTE_KEY = 'asicOffenLetzteMeldung';   // fuer die Diagnose

function merkeOffenMeldung(aktion, ergebnis) {
    try { localStorage.setItem(OFFEN_LETZTE_KEY, JSON.stringify({ zeit: new Date().toISOString(), aktion, ergebnis })); } catch (e) {}
}

function geraetName() {
    try { return localStorage.getItem(GERAET_NAME_KEY) || ''; } catch (e) { return ''; }
}

function geraetId() {
    try {
        let id = localStorage.getItem(GERAET_ID_KEY);
        if (!id || !/^[a-z0-9]{8,40}$/.test(id)) {
            const zufall = (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint8Array(16)) : Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
            id = Array.from(zufall, b => (b % 36).toString(36)).join('');
            localStorage.setItem(GERAET_ID_KEY, id);
        }
        return id;
    } catch (e) { return ''; }
}

function serverFunktionenAktiv() {
    return !(window.location.hostname.endsWith('.github.io') && !getNasBaseUrl());
}

async function meldeOffen(aktion, fileName) {
    if (!serverFunktionenAktiv()) return;
    const id = geraetId();
    if (!id) return;
    try {
        const res = await nasFetch('offen.php', '', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({ aktion, fileName: fileName || '', geraetId: id, geraet: geraetName() })
        });
        // kein "keepalive": Safari verwirft solche Anfragen an eine andere
        // Server-Adresse (Vorabanfrage wegen des Zugriffsschluessels)
        if (res.ok) {
            if (aktion === 'oeffnen') localStorage.setItem(OFFEN_GEMELDET_KEY, fileName);
            else localStorage.removeItem(OFFEN_GEMELDET_KEY);
            merkeOffenMeldung(aktion, 'ok');
        } else {
            merkeOffenMeldung(aktion, 'HTTP ' + res.status + (res.status === 404 ? ' – offen.php fehlt auf dem Server' : ''));
        }
    } catch (e) {
        // offline oder Server nicht erreichbar: nur ein Hinweis
        merkeOffenMeldung(aktion, 'nicht gesendet (' + (e && e.message ? e.message : 'keine Verbindung') + ')');
    }
}

function meldeGeoeffnet(fileName) {
    return meldeOffen('oeffnen', fileName);
}

// Nur wenn dieses Geraet etwas als geoeffnet gemeldet hat
function meldeGeschlossen() {
    let gemeldet = null;
    try { gemeldet = localStorage.getItem(OFFEN_GEMELDET_KEY); } catch (e) {}
    if (!gemeldet) return Promise.resolve();
    return meldeOffen('schliessen', '');
}

// Liste der auf ANDEREN Geraeten geoeffneten Begehungen ([] bei Fehler)
async function ladeOffenListe() {
    if (!serverFunktionenAktiv()) return [];
    try {
        const res = await nasFetch('offen.php', '', { cache: 'no-store' });
        if (!res.ok) return [];
        const j = await res.json();
        const id = geraetId();
        return (j && Array.isArray(j.offen) ? j.offen : []).filter(e => e && e.geraetId !== id);
    } catch (e) { return []; }
}

function offenAnderswo(liste, fileName) {
    return (liste || []).filter(e => e.fileName === fileName)
        .sort((a, b) => String(b.seit).localeCompare(String(a.seit)))[0] || null;
}

function offenKurztext(e) {
    const wie = vorWieLange(e.seit);
    return 'geöffnet auf ' + (e.geraet || 'einem anderen Gerät') + (wie ? ' · ' + wie : '');
}

function offenSatz(e) {
    const d = new Date(e.seit);
    const uhr = isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    return 'Gerade geöffnet auf ' + (e.geraet || 'einem anderen Gerät') + (uhr ? ' (seit ' + uhr + ' Uhr)' : '') +
        ' – dort wird sie möglicherweise bearbeitet. Öffnen ist trotzdem möglich; beim Speichern meldet die App, falls inzwischen ein neuerer Stand im Team-Archiv liegt.';
}

// ===== Einheitliche Hinweisfenster (ab 1.54-9) =====
// Gleicher Aufbau wie "In App anzeigen" / Wiederholungsbegehung.
// opt: { titel, sub, karte: {markt, datum, ort}, punkte: [Text], warnung:
//        {titel, text}, knoepfe: [{w, text, art: 'primaer'|'warn'|''}] }
// Liefert den Wert w des gewaehlten Knopfs oder null (abgebrochen).
function zeigeHinweisFenster(opt) {
    return new Promise(resolve => {
        const k = opt.karte;
        const karte = k ? `
            <div class="wb-karte">
                <div class="ta-kopf"><span class="srv-markt">${escapeHtml(k.markt || 'ohne Marktnummer')}</span><span class="srv-datum">${escapeHtml(k.datum || '–')}</span></div>
                ${k.ort ? `<div class="srv-ort">${escapeHtml(k.ort)}</div>` : ''}
            </div>` : '';
        const punkte = (opt.punkte || []).length ? `<ul class="wb-liste">${opt.punkte.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>` : '';
        const warnung = opt.warnung ? `
            <div class="srv-meldung srv-meldung-warnung" style="margin-top:0.75rem">
                <strong>${escapeHtml(opt.warnung.titel)}</strong>
                <p>${escapeHtml(opt.warnung.text)}</p>
            </div>` : '';
        const knoepfe = (opt.knoepfe || []).map(b =>
            `<button type="button" class="btn ${b.art === 'primaer' ? 'btn-primary' : 'btn-secondary'}${b.art === 'warn' ? ' srv-btn-warn' : ''}" data-w="${escapeHtml(b.w || '')}">${escapeHtml(b.text)}</button>`).join('');
        const overlay = document.createElement('div');
        overlay.className = 'srv-overlay';
        overlay.innerHTML = `
            <div class="srv-box" role="dialog" aria-modal="true" aria-labelledby="srv-h-titel">
                <div class="srv-kopf"><div><h2 class="srv-titel" id="srv-h-titel">${escapeHtml(opt.titel)}</h2>${opt.sub ? `<p class="srv-sub">${escapeHtml(opt.sub)}</p>` : ''}</div>
                <button type="button" class="srv-x" aria-label="Schließen">×</button></div>
                <div class="srv-inhalt">${karte}${punkte}${warnung}
                    <div class="srv-aktionen srv-aktionen-spalte">${knoepfe}</div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.documentElement.classList.add('srv-offen');
        const ende = w => { overlay.remove(); document.documentElement.classList.remove('srv-offen'); document.removeEventListener('keydown', taste); resolve(w || null); };
        function taste(e) { if (e.key === 'Escape') ende(null); }
        document.addEventListener('keydown', taste);
        overlay.addEventListener('click', e => { if (e.target === overlay) ende(null); });
        overlay.querySelector('.srv-x').addEventListener('click', () => ende(null));
        overlay.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => ende(b.dataset.w)));
    });
}

// Karte der gerade geoeffneten Begehung
function karteAktuelleBegehung() {
    const c = state.companyInfo || {};
    return {
        markt: c.marktnummer ? 'Markt ' + c.marktnummer : 'ohne Marktnummer',
        datum: c.datum ? formatDatumDe(c.datum) : '–',
        ort: [c.plzOrt, c.firma].filter(Boolean).join(' · ')
    };
}

async function anzahlFotosAufGeraet() {
    try { return typeof getAllPhotos === 'function' ? (await getAllPhotos()).length : 0; } catch (e) { return 0; }
}

function fotosText(n) {
    return n === 0 ? 'keine Fotos' : (n === 1 ? '1 Foto' : n + ' Fotos');
}

function sicherungsSatz() {
    const zustand = sicherungsZustand();
    return zustand === 'gesichert' ? 'Sie ist auf dem Server gesichert (ohne Fotos).'
        : (zustand === 'geaendert' ? 'Sie wurde nach dem letzten Speichern auf dem Server geändert.'
            : 'Sie ist nicht auf dem Server gesichert.');
}

// Eigene Fassungen (ab 1.54-9): Begehung_<Datum>_Markt<Nr>_Fassung-<n>.json
function fassungVon(dateiname) {
    const m = /_Fassung-(\d+)\.json$/.exec(String(dateiname || ''));
    return m ? Number(m[1]) : 0;
}

// Je Begehung (Datei ohne "_Fassung-n") nur die zuletzt gespeicherte Fassung
function nurNeuesteFassung(liste) {
    const beste = new Map();
    (liste || []).forEach(f => {
        const schluessel = String(f.fileName || '').replace(/_Fassung-\d+\.json$/, '.json');
        const bisher = beste.get(schluessel);
        if (!bisher || String(f.savedAt || '') > String(bisher.savedAt || '')) beste.set(schluessel, f);
    });
    return (liste || []).filter(f => beste.get(String(f.fileName || '').replace(/_Fassung-\d+\.json$/, '.json')) === f);
}

// "vor 5 Minuten" / "vor 3 Stunden" (bis 24 Stunden), sonst ''
function vorWieLange(iso) {
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    const min = Math.round((Date.now() - d.getTime()) / 60000);
    if (min < 0 || min >= 24 * 60) return '';
    if (min < 1) return 'gerade eben';
    if (min < 60) return 'vor ' + min + (min === 1 ? ' Minute' : ' Minuten');
    const h = Math.floor(min / 60);
    return 'vor ' + h + (h === 1 ? ' Stunde' : ' Stunden');
}

// Kuerzlich gespeichert = in den letzten 2 Stunden (Hinweis im Team-Archiv)
function kuerzlichGespeichert(iso) {
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return false;
    const ms = Date.now() - d.getTime();
    return ms >= 0 && ms < 2 * 60 * 60 * 1000;
}

// "27.10.2026 um 14:10 Uhr" (Rueckfrage beim Speichern)
function formatZeitpunktLang(iso) {
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' um ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
}

// Rueckfrage, wenn save.php einen neueren Stand im Team-Archiv meldet (409).
// Liefert 'neueFassung', 'ueberschreiben' oder null (abgebrochen).
function frageBeiKonflikt(info) {
    info = info || {};
    return new Promise(resolve => {
        const c = state.companyInfo || {};
        const markt = c.marktnummer ? 'Markt ' + c.marktnummer : 'ohne Marktnummer';
        const ort = [c.plzOrt, c.firma].filter(Boolean).join(' · ');
        const wann = formatZeitpunktLang(info.savedAt);
        const wieLange = vorWieLange(info.savedAt);
        const text = info.fremd
            ? `Für diesen Markt und dieses Datum liegt im Team-Archiv bereits eine Begehung${wann ? ', gespeichert am ' + wann : ''}${wieLange ? ' (' + wieLange + ')' : ''}. Sie wurde nicht auf diesem Gerät geöffnet.`
            : `Diese Begehung wurde im Team-Archiv erneut gespeichert, nachdem sie auf diesem Gerät geöffnet wurde${wann ? ' – am ' + wann : ''}${wieLange ? ' (' + wieLange + ')' : ''}. Vermutlich hat jemand sie gleichzeitig auf einem anderen Gerät bearbeitet.`;
        const overlay = document.createElement('div');
        overlay.className = 'srv-overlay';
        overlay.innerHTML = `
            <div class="srv-box" role="dialog" aria-modal="true" aria-labelledby="srv-k-titel">
                <div class="srv-kopf"><div><h2 class="srv-titel" id="srv-k-titel">Auf Server speichern</h2><p class="srv-sub">Neuerer Stand im Team-Archiv</p></div>
                <button type="button" class="srv-x" aria-label="Schließen">×</button></div>
                <div class="srv-inhalt">
                    <div class="wb-karte">
                        <div class="ta-kopf"><span class="srv-markt">${escapeHtml(markt)}</span><span class="srv-datum">${escapeHtml(c.datum ? formatDatumDe(c.datum) : '–')}</span></div>
                        ${ort ? `<div class="srv-ort">${escapeHtml(ort)}</div>` : ''}
                    </div>
                    <div class="srv-meldung srv-meldung-warnung" style="margin-top:0.75rem">
                        <strong>Achtung: Stand im Team-Archiv ist neuer</strong>
                        <p>${escapeHtml(text)}</p>
                    </div>
                    <ul class="wb-liste">
                        <li><b>Als eigene Fassung speichern:</b> Ihr Stand kommt zusätzlich ins Team-Archiv, der andere bleibt unverändert. Beide sind danach im Team-Archiv zu sehen.</li>
                        <li><b>Trotzdem überschreiben:</b> Ihr Stand ersetzt den anderen. Der bisherige Stand wird auf dem Server gesichert, ist in der App aber nicht mehr zu sehen.</li>
                    </ul>
                    <div class="srv-aktionen srv-aktionen-spalte">
                        <button type="button" class="btn btn-primary" data-w="neueFassung">Als eigene Fassung speichern</button>
                        <button type="button" class="btn btn-secondary srv-btn-warn" data-w="ueberschreiben">Trotzdem überschreiben</button>
                        <button type="button" class="btn btn-secondary" data-w="">Abbrechen</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.documentElement.classList.add('srv-offen');
        const ende = w => { overlay.remove(); document.documentElement.classList.remove('srv-offen'); document.removeEventListener('keydown', taste); resolve(w || null); };
        function taste(e) { if (e.key === 'Escape') ende(null); }
        document.addEventListener('keydown', taste);
        overlay.addEventListener('click', e => { if (e.target === overlay) ende(null); });
        overlay.querySelector('.srv-x').addEventListener('click', () => ende(null));
        overlay.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => ende(b.dataset.w)));
    });
}

// Rueckfrage "Wiederholungsbegehung anlegen" im Stil des Dialogs "Vom Server
// laden". Liefert 'archiv', 'anlegen' oder null (abgebrochen).
function frageWiederholung(record, quelle) {
    return new Promise(resolve => {
        const ci = (record && record.companyInfo) || {};
        const offen = ((record && record.measures) || []).filter(m => m && m.status !== 'erledigt').length;
        const markt = ci.marktnummer ? 'Markt ' + ci.marktnummer : 'ohne Marktnummer';
        const vorDatum = ci.datum ? formatDate(ci.datum) : '–';
        const ort = [ci.plzOrt, ci.firma].filter(Boolean).join(' · ');
        const ersetzt = begehungHatInhalt();
        let warnung = '';
        if (ersetzt) {
            const c = state.companyInfo || {};
            const zustand = sicherungsZustand();
            const aktuell = (c.marktnummer ? 'Markt ' + c.marktnummer : 'ohne Marktnummer') + (c.datum ? ' vom ' + formatDatumDe(c.datum) : '');
            const sicherung = zustand === 'gesichert'
                ? 'Sie ist auf dem Server gesichert – Fotos gibt es aber nur auf diesem Gerät.'
                : (zustand === 'geaendert' ? 'Sie wurde nach dem letzten Speichern auf dem Server geändert.' : 'Sie ist noch nicht auf dem Server gesichert.');
            warnung = `
                <div class="srv-meldung srv-meldung-warnung" style="margin-top:0.75rem">
                    <strong>Offene Begehung wird ersetzt</strong>
                    <p>Auf diesem Gerät ist die Begehung <b>${escapeHtml(aktuell)}</b> geöffnet. ${escapeHtml(sicherung)} Ihre Fotos werden vom Gerät entfernt.</p>
                </div>`;
        }
        const knoepfe = ersetzt
            ? `<button type="button" class="btn btn-primary" data-w="archiv">Erst im Verlauf archivieren, dann anlegen</button>
               <button type="button" class="btn btn-secondary srv-btn-warn" data-w="anlegen">Ohne Archivieren anlegen</button>
               <button type="button" class="btn btn-secondary" data-w="">Abbrechen</button>`
            : `<button type="button" class="btn btn-primary" data-w="anlegen">Wiederholungsbegehung anlegen</button>
               <button type="button" class="btn btn-secondary" data-w="">Abbrechen</button>`;
        const overlay = document.createElement('div');
        overlay.className = 'srv-overlay';
        overlay.innerHTML = `
            <div class="srv-box" role="dialog" aria-modal="true" aria-labelledby="wb-titel">
                <div class="srv-kopf"><div><h2 class="srv-titel" id="wb-titel">Wiederholungsbegehung</h2><p class="srv-sub">Neue Begehung auf Grundlage der Vorbegehung${quelle === 'team' ? ' aus dem Team-Archiv' : ' aus dem Verlauf'}</p></div>
                <button type="button" class="srv-x" aria-label="Schließen">×</button></div>
                <div class="srv-inhalt">
                    <div class="wb-karte">
                        <div class="ta-kopf"><span class="srv-markt">${escapeHtml(markt)}</span><span class="srv-datum">Vorbegehung ${escapeHtml(vorDatum)}</span></div>
                        ${ort ? `<div class="srv-ort">${escapeHtml(ort)}</div>` : ''}
                    </div>
                    <ul class="wb-liste">
                        <li>Betriebsdaten werden übernommen, das Datum wird auf <b>heute</b> gesetzt.</li>
                        <li>${offen ? `<b>${offen}</b> nicht erledigte Maßnahme${offen === 1 ? '' : 'n'} werden als Mangel vorbelegt.` : 'Die Vorbegehung hat keine offenen Maßnahmen.'}</li>
                        ${quelle === 'team' ? '' : '<li>Archivierte Begehungen bleiben unverändert.</li>'}
                    </ul>
                    ${warnung}
                    <div class="srv-aktionen srv-aktionen-spalte">${knoepfe}</div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.documentElement.classList.add('srv-offen');
        const ende = w => { overlay.remove(); document.documentElement.classList.remove('srv-offen'); document.removeEventListener('keydown', taste); resolve(w || null); };
        function taste(e) { if (e.key === 'Escape') ende(null); }
        document.addEventListener('keydown', taste);
        overlay.addEventListener('click', e => { if (e.target === overlay) ende(null); });
        overlay.querySelector('.srv-x').addEventListener('click', () => ende(null));
        overlay.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => ende(b.dataset.w)));
    });
}

function formatDatumDe(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso || '');
}

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

    const tauri = laeuftInTauri();
    const btnShare = panel.querySelector('[data-action="share"]');
    if (btnShare) {
        // Teilen-Menue gibt es in der Desktop-App (WebView2) nicht
        if (tauri) btnShare.style.display = 'none';
        else btnShare.addEventListener('click', () => shareReportPdf(exportMode));
    }

    const btnMail = panel.querySelector('[data-action="mail"]');
    if (btnMail) {
        if (tauri) {
            btnMail.textContent = '✉️ Mail mit PDF vorbereiten';
            btnMail.addEventListener('click', () => mailEntwurfMitPdf(exportMode));
        } else {
            btnMail.addEventListener('click', () => openPrefilledMail(exportMode));
        }
    }
}

// ===== PDF teilen (iPad-Teilen-Menü, inkl. AirPrint) mit Download-Fallback =====
// Gemeinsam genutzt von der Checkliste (app.js) und den Maßnahmen (massnahmen.js).
// Bewaehrter Trick (aus dem Schwesterprojekt): navigator.share() mit der PDF-Datei
// oeffnet z. B. Mail bereits mit Anhang; unmittelbar danach zusaetzlich per mailto:
// den vollstaendigen Betreff/Text nachreichen - Mail uebernimmt das in denselben,
// bereits offenen Entwurf und behaelt dabei den Anhang. Nur der Betreff wird von
// Mail auf iOS dabei meist nicht mehr uebernommen (bekannte Einschraenkung).
async function sharePdfDoc(doc, filename, shareTitle, mode) {
    try {
        const blob = doc.output('blob');

        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    // Echten Betreff/Text direkt an navigator.share() uebergeben,
                    // statt ihn wie zuvor per nachgereichtem mailto: zu versuchen -
                    // dieser Umweg hat sich auf dem echten iPad als unzuverlaessig
                    // erwiesen (Mail bleibt beim generischen Platzhaltertext).
                    await navigator.share({
                        files: [file],
                        title: shareTitle,
                        text: buildShareEmailText(mode)
                    });
                    showToast('PDF geteilt');
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
        // Freie Pruefpunkte ohne Text und ohne Bewertung entfallen
        const punkte = category.items.filter(i => punktZaehlt(i));
        if (!punkte.length) return;

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

        punkte.forEach(item => {
            const rating = state.ratings[item.id] || '';
            const comment = state.comments[item.id] || '';

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8.5);
            const lines = doc.splitTextToSize(`${item.id}  ${punktText(item)}`, textWidth);
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
        `Marktnummer: ${ci.marktnummer || '-'}    PLZ/Ort: ${ci.plzOrt || '-'}    Straße: ${ci.strasse || '-'}    Datum: ${ci.datum ? formatDate(ci.datum) : '-'}`,
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
    doc.text('Protokoll zur Marktbegehung', pageWidth / 2, 22, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('(Arbeitsschutz & Prävention)', pageWidth / 2, 30, { align: 'center' });

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
        ['Marktnummer', ci.marktnummer || '-'],
        ['Postleitzahl und Ort', ci.plzOrt || '-'],
        ['Straße und Hausnummer', ci.strasse || '-'],
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
    const erstellt = todayIsoLocal();
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

// ===== Verantwortungsblock für Maßnahmen-PDFs ==============================
// Wird ausschließlich im Maßnahmen-/Gesamtbericht verwendet.
// Dadurch erscheint der Hinweis automatisch auch bei archivierten Reports,
// weil diese ebenfalls über buildReportPdf() laufen.
function renderResponsibilityPdfSection(doc, yStart, margin, contentWidth, pageHeight) {
    let y = yStart;

    const title = 'VERANTWORTUNG';

    const text =
        'Die Gesamtverantwortung für die Durchführung der Prüfung sowie ' +
        'für die Beseitigung festgestellter Mängel liegt bei der Marktleitung. ' +
        'Einzelne Maßnahmen können an fachlich zuständige Personen zur ' +
        'Bearbeitung übertragen werden. Die Verantwortung für die ' +
        'ordnungsgemäße Umsetzung sowie die Aufsichts- und Kontrollpflicht ' +
        'verbleibt bei der Marktleitung.';

    const innerWidth = contentWidth - 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8.5);

    const lines =
        doc.splitTextToSize(
            text,
            innerWidth
        );

    const boxPaddingTop = 6;
    const boxPaddingBottom = 6;
    const boxHeight =
        boxPaddingTop +
        4.5 +
        2 +
        (lines.length * 4.2) +
        boxPaddingBottom;

    // Wenn die Box nicht mehr sinnvoll auf die Seite passt,
    // auf eine neue Seite wechseln.
    if (
        y + boxHeight >
        pageHeight - 24
    ) {
        doc.addPage();
        y = 18;
    }

    // Dezente Box
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(220, 225, 228);
    doc.setLineWidth(0.3);

    doc.roundedRect(
        margin,
        y,
        contentWidth,
        boxHeight,
        2,
        2,
        'FD'
    );

    // Überschrift
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(150, 95, 20);

    doc.text(
        title,
        margin + 5,
        y + boxPaddingTop
    );

    // Text
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    doc.text(
        lines,
        margin + 5,
        y + boxPaddingTop + 7
    );

    return y + boxHeight + 8;
}

// Zeichnet bis zu 4 Fotos pro DIN-A4-Seite (2x2-Raster) inkl. Kommentarzeile in
// ein bereits geoeffnetes jsPDF-Dokument, beginnend bei der uebergebenen
// Y-Position. Foto-Blobs kommen aus IndexedDB, daher async. Legt bei Bedarf
// automatisch neue Seiten an (max. 4 Fotos je Seite).
async function renderFotosSection(doc, yStart, margin, contentWidth, pageHeight, photos, captionFn) {
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

        // captionFn ermoeglicht abweichende Beschriftung (z. B. Massnahmen-Bezug
        // statt reinem Freitext-Kommentar) - ohne captionFn unveraendertes
        // Verhalten der allgemeinen Fotodokumentation.
        const commentText = captionFn
            ? captionFn(photo, i)
            : (photo.comment && photo.comment.trim() ? photo.comment : '');
        const commentLines = doc.splitTextToSize(commentText, cellWidth - 6).slice(0, 3);
        doc.text(commentLines, cellX + 3, cellY + imageHeight + 6);
    }

    // Y-Position ans Ende des zuletzt genutzten Rasters setzen (fuer evtl. nachfolgenden Inhalt)
    const lastRow = Math.floor(((photos.length - 1) % 4) / 2);
    return pageStartY + (lastRow + 1) * (cellHeight + gapY) + 4;
}

// Fotos, die direkt an einzelnen Massnahmen haengen, als eigener Anhang.
// Bewusst EINE durchgehende Fotoliste (nicht pro Massnahme gruppiert),
// damit tatsaechlich 4 Fotos pro Seite zusammenstehen, statt dass jede
// Massnahme ihr eigenes, evtl. nur halb gefuelltes Raster beginnt. Als
// Beschriftung dient die laufende Massnahmen-Nummer (1., 2., 3. ...) -
// dieselbe Nummer, die auch auf der Massnahmen-Karte selbst steht, damit
// sich Anhang und Karte leicht einander zuordnen lassen. Wird unabhaengig
// vom "includeFotos"-Schalter aufgerufen, sobald ueberhaupt Massnahmen-
// Fotos vorhanden sind - das ist eine bewusst eigene Sache gegenueber der
// allgemeinen Fotodokumentation.
async function renderMeasurePhotosAppendix(doc, margin, contentWidth, pageHeight, measures) {
    const allPhotos = [];
    for (let i = 0; i < measures.length; i++) {
        const measure = measures[i];
        let photos;
        try {
            photos = await getPhotosForMeasure(measure.id);
        } catch (e) {
            photos = [];
        }
        photos.forEach((photo, idx) => {
            allPhotos.push({ photo, nummer: i + 1, idxInMeasure: idx, totalInMeasure: photos.length });
        });
    }
    if (allPhotos.length === 0) return false;

    doc.addPage();
    let y = 18;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(28, 34, 38);
    doc.text('Fotos zu den Maßnahmen', margin, y);
    y += 9;

    const captionFn = (photo, i) => {
        const meta = allPhotos[i];
        const zaehler = meta.totalInMeasure > 1 ? ` — Foto ${meta.idxInMeasure + 1}/${meta.totalInMeasure}` : '';
        return `Maßnahme ${meta.nummer}${zaehler}`;
    };

    await renderFotosSection(doc, y, margin, contentWidth, pageHeight, allPhotos.map(e => e.photo), captionFn);

    return true;
}


// Eigenstaendiger Foto-PDF-Export (Modus "fotos"): Deckblatt mit Bezug zur
// Begehungsliste + alle Fotos im 2x2-Raster. Async, da Fotos aus IndexedDB
// geladen werden.
async function buildFotosPdf() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    drawCoverPage(
        doc,
        pageWidth,
        pageHeight,
        margin,
        'Fotodokumentation',
        'Begehungsprotokoll – Bildanhang'
    );

    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text(
        'Fotodokumentation',
        pageWidth / 2,
        y,
        { align: 'center' }
    );

    y += 9;


    doc.setDrawColor(220);
    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 8;

    const photos = await getUnlinkedPhotos();

    await renderFotosSection(
        doc,
        y,
        margin,
        contentWidth,
        pageHeight,
        photos
    );

    const totalPages = doc.getNumberOfPages();

    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(
            `${i}/${totalPages}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: 'right' }
        );
    }

    return doc;
}

function fotosPdfFilename() {
    const marktnummer = (state.companyInfo.marktnummer || 'markt')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        todayIsoLocal();

    return `Fotodokumentation_${marktnummer}_${datum}.pdf`;
}

function checklistPdfFilename() {
    const marktnummer = (state.companyInfo.marktnummer || 'markt')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        todayIsoLocal();

    return `Checkliste_${marktnummer}_${datum}.pdf`;
}

function buildChecklistPdf() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    drawCoverPage(
        doc,
        pageWidth,
        pageHeight,
        margin,
           '„Sicher geprüft. Sicher gehandelt.“'
    );

    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);
    doc.text(
        '(Arbeitsschutz & Prävention) – Checkliste',
        pageWidth / 2,
        y,
        { align: 'center' }
    );

    y += 9;


    doc.setDrawColor(220);
    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 8;

    y = renderChecklistPdfSection(
        doc,
        y,
        margin,
        contentWidth,
        pageHeight
    );

    // Seitenzahl auf allen Seiten AUSSER dem Deckblatt (Seite 1)
    const totalPages = doc.getNumberOfPages();

    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(140);
        doc.text(
            `${i}/${totalPages}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: 'right' }
        );
    }

    return doc;
}

async function shareChecklistPdf() {
    try {
        const doc = buildChecklistPdf();
        const filename = checklistPdfFilename();

        await sharePdfDoc(
            doc,
            filename,
            buildShareEmailSubject('checkliste'),
            'checkliste'
        );

    } catch (err) {
        console.error(
            'Checkliste-PDF konnte nicht erzeugt werden:',
            err
        );

        showToast(
            'PDF-Fehler: ' +
            (err && err.message
                ? err.message
                : 'unbekannter Fehler'),
            'error'
        );
    }
}

// ===== Maßnahmen-PDF (mit optionaler Checkliste voran) =====
// Uebernommen aus massnahmen.js, damit auch die Checkliste-Seite Maßnahmen exportieren kann.
function pdfFilename() {
    const marktnummer = (state.companyInfo.marktnummer || 'begehung')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        todayIsoLocal();

    return `Massnahmenplan_${marktnummer}_${datum}.pdf`;
}

// ===== Quellen je Massnahme (Sprachstil "Einfach", ab Ausgabestand 1.54-13) =====
// Die einfachen Massnahmentexte nennen keine Regelwerke. Fuer den PDF-Anhang
// werden die Fundstellen deshalb aus dem BGHW- und dem Rechtlich-Text
// derselben Massnahme (js/text.js) ausgelesen.
const QUELLEN_GESETZE = ['ArbSchG', 'ArbStättV', 'BetrSichV', 'GefStoffV', 'ArbMedVV', 'ArbZG', 'JArbSchG',
    'MuSchG', 'BioStoffV', 'ASiG', 'BetrVG', 'LMHV', 'LasthandhabV', 'SGB VII', 'SGB IX', 'BGB', 'ProdSG'];
const QUELLEN_NAMEN = {
    'PSA-Benutzungsverordnung': 'PSA-Benutzungsverordnung',
    'Lastenhandhabungsverordnung': 'LasthandhabV',
    'Lebensmittelhygiene-Verordnung': 'LMHV',
    'Arbeitsschutzgesetz': 'ArbSchG',
    'REACH-Verordnung': 'REACH-Verordnung',
    'CLP-Verordnung': 'CLP-Verordnung',
    'Aufzugsrichtlinie': 'Aufzugsrichtlinie 2014/33/EU',
    'Maschinenrichtlinie': 'Maschinenrichtlinie'
};

function quellenAusText(text) {
    const t = String(text || '').replace(/ /g, ' ');
    const gefunden = [];
    const add = q => { q = q.replace(/\s+/g, ' ').trim(); if (q && !gefunden.includes(q)) gefunden.push(q); };
    const gesetzMuster = QUELLEN_GESETZE.map(g => g.replace(/ /g, '\\s')).join('|');
    let m;
    // Paragraphen mit Gesetz: "§ 16 BetrSichV", "§ 3 Abs. 1 Satz 2 ArbSchG", "§§ 3, 4 ArbStättV"
    const reParagraph = new RegExp('§§?\\s?\\d+[a-z]?(?:\\s?(?:Abs\\.|Absatz)\\s?\\d+)?(?:\\s?Satz\\s?\\d+)?(?:\\s?Nr\\.\\s?\\d+)?(?:\\s?(?:,|und|bis|ff\\.)\\s?\\d*[a-z]?)*\\s(?:' + gesetzMuster + ')\\b', 'g');
    while ((m = reParagraph.exec(t))) add(m[0].replace(/\s?ff\.\s?$/, ' ff.'));
    // Gesetz vor Paragraph: "BetrSichV §§ 6, 10 und 14" -> "§§ 6, 10 und 14 BetrSichV"
    const reGesetzVorn = new RegExp('(' + gesetzMuster + ')\\s(§§?\\s?\\d+[a-z]?(?:\\s?(?:Abs\\.|Absatz)\\s?\\d+)?(?:\\s?(?:,|und|bis)\\s?\\d+[a-z]?)*)', 'g');
    while ((m = reGesetzVorn.exec(t))) add(m[2] + ' ' + m[1]);
    // Anhang: "BetrSichV Anhang 1 Nr. 4.1"
    const reAnhang = new RegExp('(?:' + gesetzMuster + '|DGUV Vorschrift \\d+)\\sAnhang\\s\\d+(?:\\sAbschnitt\\s\\d+)?(?:\\sNr\\.\\s?[\\d.]*\\d)?', 'g');
    while ((m = reAnhang.exec(t))) add(m[0]);
    // DGUV, ASR, TRGS/TRBS/TRBA, DIN/VDE
    const reRegeln = /DGUV (?:Vorschrift|Regel|Information|Grundsatz) \d+(?:-\d+)?(?: Kapitel [\d.]*\d)?|ASR A\d\.\d+|TR(?:GS|BS|BA) \d+|DIN(?: EN| ISO| V| VDE| V)* \d+(?:-\d+)*(?: \/ DIN(?: EN)? \d+(?:-\d+)*)?|VDE \d+(?:-\d+)*/g;
    while ((m = reRegeln.exec(t))) add(m[0]);
    // ausgeschriebene Namen und bloße Abkuerzungen
    Object.keys(QUELLEN_NAMEN).forEach(n => { if (t.includes(n)) add(QUELLEN_NAMEN[n]); });
    QUELLEN_GESETZE.forEach(g => { if (new RegExp('(^|[^A-Za-zÄÖÜäöü])' + g.replace(/ /g, '\\s') + '(?![A-Za-zÄÖÜäöü])').test(t)) add(g); });
    // Paragraphen je Gesetz zusammenfassen: "§ 5 ArbSchG", "§§ 3, 5 ArbSchG"
    const jeGesetz = {};
    const rest = [];
    gefunden.forEach(q => {
        const g = q.match(new RegExp('^§§?\\s?(.+?)\\s(' + gesetzMuster + ')$'));
        if (!g) { rest.push(q); return; }
        const nummern = jeGesetz[g[2]] = jeGesetz[g[2]] || [];
        g[1].replace(/(?:Abs\.|Absatz|Satz|Nr\.)\s?\d+/g, '').split(/,|und|bis/).forEach(teil => {
            const n = (teil.match(/\d+[a-z]?(?:\s?ff\.)?/) || [])[0];
            if (n && !nummern.includes(n.replace(/\s?ff\./, ' ff.'))) nummern.push(n.replace(/\s?ff\./, ' ff.'));
        });
    });
    Object.keys(jeGesetz).forEach(gesetz => {
        const n = jeGesetz[gesetz].sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b));
        if (n.length) rest.unshift((n.length > 1 || /ff\./.test(n[0]) ? '§§ ' : '§ ') + n.join(', ') + ' ' + gesetz);
    });
    gefunden.length = 0;
    rest.forEach(q => gefunden.push(q));
    // Bloßes Gesetz weglassen, wenn es schon mit Paragraph/Anhang genannt ist
    return gefunden.filter(q => !(QUELLEN_GESETZE.includes(q) || Object.values(QUELLEN_NAMEN).includes(q))
        || !gefunden.some(a => a !== q && a.endsWith(' ' + q) || a.startsWith(q + ' Anhang')))
        .filter(q => !(q === 'DGUV Vorschrift 3' && gefunden.some(a => a.startsWith('DGUV Vorschrift 3 Anhang'))));
}

// Quellen zu einer Massnahme (Pruefpunkt-ID): aus BGHW- und Rechtlich-Text
function quellenZuMassnahme(itemId) {
    if (FREIE_PUNKT_IDS.indexOf(itemId) !== -1) return [];   // freie Pruefpunkte ohne Quellen
    const e = (typeof MEASURES_BY_ID !== 'undefined' && MEASURES_BY_ID[itemId]) || (typeof MEASURES_TEXT !== 'undefined' ? MEASURES_TEXT.default : null);
    if (!e) return [];
    const liste = quellenAusText((e.bghw || '') + ' ' + (e.rechtlich || ''));
    // Reihenfolge: Gesetze/Verordnungen, ASR/TR, DGUV, DIN/VDE
    const rang = q => /^§|ArbSchG|ArbStättV|BetrSichV|GefStoffV|ArbMedVV|ArbZG|JArbSchG|SGB|BGB|BetrVG|LMHV|Lasthandhab|PSA|REACH|CLP|richtlinie/i.test(q) ? 0
        : /^ASR|^TR/.test(q) ? 1 : /^DGUV/.test(q) ? 2 : 3;
    return liste.sort((a, b) => rang(a) - rang(b));
}

// PDF-Anhang "Quellen zu den Maßnahmen" (Sprachstil "Einfach"): je Massnahme
// dieser Begehung Nummer, Pruefpunkt und die zugehoerigen Fundstellen - mit
// derselben laufenden Nummer wie im Massnahmenteil. Liefert false, wenn
// keine Massnahme hinterlegte Quellen hat (dann entfaellt die Seite).
function renderMassnahmenQuellenAnhang(doc, margin, contentWidth, pageHeight, measures) {
    const eintraege = [];
    (measures || []).forEach((measure, index) => {
        const found = findItemById(measure.itemId);
        if (!found) return;
        const quellen = quellenZuMassnahme(measure.itemId);
        if (quellen.length) eintraege.push({ nummer: index + 1, found, quellen });
    });
    if (!eintraege.length) return false;

    doc.addPage();
    let y = 18;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(28, 34, 38);
    doc.text('Quellen zu den Maßnahmen', margin, y);
    y += 9;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const intro = doc.splitTextToSize(
        'Die Maßnahmentexte sind in einfacher Sprache formuliert und nennen keine Regelwerke. Hier stehen zu jeder Maßnahme dieser Begehung die zugehörigen Gesetze, Verordnungen, Technischen Regeln, DGUV-Regelwerke und Normen. Die Nummern entsprechen dem Maßnahmenplan.',
        contentWidth
    );
    doc.text(intro, margin, y);
    y += intro.length * 4 + 6;

    eintraege.forEach(e => {
        doc.setFontSize(8.5);
        const titel = doc.splitTextToSize(`${e.nummer}. [${e.found.item.id}] ${e.found.item.text}`, contentWidth);
        const quellen = doc.splitTextToSize(e.quellen.join('  ·  '), contentWidth - 4);
        const hoehe = titel.length * 4 + quellen.length * 4 + 6;
        if (y + hoehe > pageHeight - 20) {
            doc.addPage();
            y = 18;
        }
        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(titel, margin, y);
        y += titel.length * 4 + 0.5;
        doc.setFont(undefined, 'normal');
        doc.setTextColor(163, 5, 23);
        doc.text(quellen, margin + 4, y);
        y += quellen.length * 4 + 4;
    });

    doc.setFont(undefined, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140);
    const hinweis = doc.splitTextToSize(
        'Die Fundstellen stammen aus den Maßnahmentexten der Sprachstile „BGHW“ und „Rechtlich“; dort stehen sie im Zusammenhang. DGUV-Regeln und DGUV-Informationen konkretisieren die praktische Umsetzung; sie sind rechtlich nicht mit staatlichen Rechtsvorschriften gleichzusetzen. Gesetzliche und technische Regelwerke können sich ändern.',
        contentWidth
    );
    if (y + hinweis.length * 3.6 > pageHeight - 15) {
        doc.addPage();
        y = 18;
    }
    doc.text(hinweis, margin, y + 2);
    return true;
}

// Quellenverzeichnis als PDF-Anhang: listet die in MEASURE_SOURCES
// hinterlegten BGHW-/DGUV-/DIN-Regelwerke sowie gesetzlichen Rechtsquellen
// auf, mit automatischem Zeilenumbruch bei laengeren Eintraegen und
// automatischem Seitenumbruch, falls die Liste nicht auf eine Seite passt.
function renderSourcesAppendix(doc, margin, contentWidth, pageHeight) {
    doc.addPage();
    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(28, 34, 38);
    doc.text('Quellenverzeichnis', margin, y);
    y += 9;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const introLines = doc.splitTextToSize(
        'Die Maßnahmentexte zitieren an den jeweiligen Prüfpunkten konkrete Regelwerke bzw. Paragraphen im Fließtext. Diese Liste fasst die insgesamt herangezogenen Quellen zusammen.',
        contentWidth
    );
    doc.text(introLines, margin, y);
    y += introLines.length * 4 + 6;

    function renderListe(titel, eintraege) {
        if (y > pageHeight - 30) {
            doc.addPage();
            y = 18;
        }
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(titel, margin, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        eintraege.forEach(eintrag => {
            const zeilen = doc.splitTextToSize('•  ' + eintrag, contentWidth - 2);
            const hoehe = zeilen.length * 4 + 2;
            if (y + hoehe > pageHeight - 20) {
                doc.addPage();
                y = 18;
            }
            doc.text(zeilen, margin, y);
            y += hoehe;
        });
        y += 5;
    }

    renderListe('BGHW-/DGUV-/DIN-Regelwerke', MEASURE_SOURCES.bghw);
    renderListe('Gesetzliche Rechtsquellen', MEASURE_SOURCES.rechtsquellen);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140);
    const hinweisLines = doc.splitTextToSize(
        'DGUV-Regeln und DGUV-Informationen konkretisieren die praktische Umsetzung; sie sind rechtlich nicht mit staatlichen Rechtsvorschriften gleichzusetzen. Gesetzliche und technische Regelwerke können sich ändern.',
        contentWidth
    );
    if (y + hinweisLines.length * 3.5 > pageHeight - 15) {
        doc.addPage();
        y = 18;
    }
    doc.text(hinweisLines, margin, y);
}

async function buildPdf(includeChecklist, includeFotos) {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        throw new Error('jsPDF-Bibliothek nicht geladen (window.jspdf fehlt). Bitte prüfen, ob "js/jspdf.umd.min.js" korrekt eingebunden ist, und die Seite neu laden.');
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    const coverTitle =
        includeChecklist
            ? '„Sicher geprüft. Sicher gehandelt.“'
            : '„Sicher geprüft. Sicher gehandelt.“';

    drawCoverPage(
        doc,
        pageWidth,
        pageHeight,
        margin,
        coverTitle
    );

    let y = 18;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(28, 34, 38);

    doc.text(
        includeChecklist ? 'Gesamtbericht' : 'Maßnahmen',
        margin,
        y
    );

    y += 9;

    doc.setDrawColor(220);
    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 8;

    if (includeChecklist) {
        y = renderChecklistPdfSection(
            doc,
            y,
            margin,
            contentWidth,
            pageHeight
        );

        doc.addPage();

        y = 18;

        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(28, 34, 38);
        doc.text(
            'Maßnahmen',
            margin,
            y
        );

        y += 9;
    }

    // ======================================================================
    // VERANTWORTUNG
    // ======================================================================
    //
    // Dieser Hinweis gehört fachlich zum Maßnahmenbereich und wird deshalb
    // sowohl beim reinen Maßnahmen-PDF als auch beim Gesamtbericht
    // ausgegeben. Da archivierte Berichte ebenfalls buildPdf() verwenden,
    // erscheint er auch dort automatisch.
    //
    y = renderResponsibilityPdfSection(
        doc,
        y,
        margin,
        contentWidth,
        pageHeight
    );


    // ======================================================================
    // MASSNAHMEN
    // ======================================================================

    if (state.measures.length === 0) {

        doc.setFontSize(11);
        doc.setTextColor(0);

        doc.text(
            'Keine Mängel erfasst.',
            margin,
            y
        );

        y += 10;

    } else {

        const padding = 6;
        const innerWidth = contentWidth - padding * 2;
        // 180px CSS-Vorschaubildgroesse (siehe .measure-photo-thumb in
        // styles.css) in mm umgerechnet (96 CSS-px = 1 Zoll = 25.4mm),
        // damit das gedruckte Vorschaubild optisch derselben Groesse
        // entspricht wie in der App selbst.
        const thumbSize = 180 * 25.4 / 96;
        const thumbGap = 3;

        const thumbsPerRow = Math.max(
            1,
            Math.floor(
                (innerWidth + thumbGap) /
                (thumbSize + thumbGap)
            )
        );

        for (
            let index = 0;
            index < state.measures.length;
            index++
        ) {

            const measure =
                state.measures[index];

            const found =
                findItemById(measure.itemId);

            const questionText =
                (found
                    ? `${index + 1}. [${measure.itemId}] ${found.item.text}`
                    : `${index + 1}. Manuell erfasste Maßnahme`) +
                (measure.vorbegehung ? ` (${vorbegehungHinweis(measure)})` : '');

            let photos = [];

            try {
                photos =
                    await getPhotosForMeasure(
                        measure.id
                    );
            } catch (e) {
                photos = [];
            }

            // Fallback: liegen lokal (IndexedDB) keine Fotos zu dieser
            // Maßnahme vor - z. B. weil die Begehung gerade erst importiert
            // oder vom Server geladen wurde, auf einem anderen Geraet
            // gespeichert - werden ersatzweise die im JSON mitgelieferten
            // kleinen Vorschaubilder gedruckt. Qualitativ schlechter als das
            // Original, aber besser als gar kein Foto im Ausdruck.
            if (
                photos.length === 0 &&
                measure.photoThumbnails &&
                measure.photoThumbnails.length > 0
            ) {
                photos = measure.photoThumbnails.map(t => ({ dataUrl: t.dataUrl }));
            }

            const photoRows =
                photos.length > 0
                    ? Math.ceil(
                        photos.length /
                        thumbsPerRow
                    )
                    : 0;

            const photoBlockH =
                photoRows > 0
                    ? photoRows *
                        (thumbSize + thumbGap) +
                        3
                    : 0;

            // Kleine Nummern-Beschriftung ueber dem Fotoblock (ersetzt die
            // bisherige "MASSNAHME"-Beschriftung unter dem Fotoblock) sowie
            // ein Abstand danach vor dem Massnahmentext - beides nur, wenn
            // ueberhaupt Fotos vorhanden sind.
            const numberLabelH = photos.length > 0 ? 4.3 : 0;
            const photoGapAfter = photos.length > 0 ? 4.5 : 0;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);

            const questionLines =
                doc.splitTextToSize(
                    questionText,
                    innerWidth
                );

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);

            const answerLines =
                doc.splitTextToSize(
                    measure.description || '-',
                    innerWidth
                );

            const questionH =
                questionLines.length * 5;

            const answerH =
                answerLines.length * 4.3;

            const kommentarText =
                (state.comments && state.comments[measure.itemId]) || '';
            const commentLinesFuerHoehe =
                kommentarText.trim()
                    ? doc.splitTextToSize('Beschreibung des Mangels: ' + kommentarText.trim(), innerWidth)
                    : [];
            const commentH =
                commentLinesFuerHoehe.length > 0
                    ? commentLinesFuerHoehe.length * 4 + 5
                    : 0;

            const statusH = 11;

            const cardHeight =
                padding +
                questionH +
                1 +
                4.5 +
                numberLabelH +
                photoBlockH +
                photoGapAfter +
                answerH +
                6 +
                commentH +
                statusH +
                padding;

            if (
                y + cardHeight >
                pageHeight - 24
            ) {
                doc.addPage();
                y = 18;
            }

            doc.setDrawColor(
                226,
                232,
                240
            );

            doc.setLineWidth(0.3);

            doc.roundedRect(
                margin,
                y,
                contentWidth,
                cardHeight,
                2,
                2,
                'S'
            );

            let cy =
                y +
                padding +
                3.5;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            doc.setTextColor(
                30,
                41,
                59
            );

            doc.text(
                questionLines,
                margin + padding,
                cy
            );

            cy += questionH + 1;

            doc.setDrawColor(
                241,
                245,
                249
            );

            doc.line(
                margin + padding,
                cy,
                margin + contentWidth - padding,
                cy
            );

            cy += 4.5;

            // Fotos zur Maßnahme direkt zwischen Frage und Maßnahmentext -
            // kompakte Vorschaubild-Reihe statt separatem Anhang, damit auf
            // einen Blick zusammensteht, was das Problem ist und wie es
            // belegt wurde. Am Bildschirm bleiben die Fotos trotz kleiner
            // Druckgröße beliebig zoombar, nur auf Papier wirken sie kleiner.
            if (photos.length > 0) {

                // Kleine Nummern-Beschriftung direkt ueber dem Fotoblock
                // (dieselbe laufende Nummer wie am Kartenanfang).
                doc.setFont(undefined, 'bold');
                doc.setFontSize(7.5);
                doc.setTextColor(
                    200,
                    130,
                    20
                );

                doc.text(
                    'Nr. ' + (index + 1),
                    margin + padding,
                    cy
                );

                cy += 4.3;

                for (
                    let p = 0;
                    p < photos.length;
                    p++
                ) {

                    const col =
                        p % thumbsPerRow;

                    const row =
                        Math.floor(
                            p / thumbsPerRow
                        );

                    const tx =
                        margin +
                        padding +
                        col *
                        (thumbSize + thumbGap);

                    const ty =
                        cy +
                        row *
                        (thumbSize + thumbGap);

                    doc.setDrawColor(
                        226,
                        232,
                        240
                    );

                    doc.roundedRect(
                        tx,
                        ty,
                        thumbSize,
                        thumbSize,
                        1.5,
                        1.5,
                        'S'
                    );

                    try {

                        const dataUrl =
                            photos[p].dataUrl ||
                            await blobToDataUrl(
                                photos[p].blob
                            );

                        const dims =
                            await getImageDimensions(
                                dataUrl
                            );

                        const fit =
                            fitImage(
                                dims.width,
                                dims.height,
                                thumbSize - 2,
                                thumbSize - 2
                            );

                        const imgX =
                            tx +
                            (thumbSize - fit.width) /
                            2;

                        const imgY =
                            ty +
                            (thumbSize - fit.height) /
                            2;

                        doc.addImage(
                            dataUrl,
                            'JPEG',
                            imgX,
                            imgY,
                            fit.width,
                            fit.height
                        );

                    } catch (e) {
                        // Bild konnte nicht geladen werden,
                        // Rahmen bleibt sichtbar
                    }
                }

                cy += photoBlockH;
                cy += 4.5;
            }

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.setTextColor(
                51,
                65,
                85
            );

            doc.text(
                answerLines,
                margin + padding,
                cy
            );

            cy += answerH + 6;

            if (kommentarText.trim()) {
                const commentLines = doc.splitTextToSize(
                    'Beschreibung des Mangels: ' + kommentarText.trim(),
                    innerWidth
                );
                doc.setFont(undefined, 'italic');
                doc.setFontSize(8.5);
                doc.setTextColor(100, 116, 139);
                doc.text(
                    commentLines,
                    margin + padding,
                    cy
                );
                cy += commentLines.length * 4 + 5;
                doc.setFont(undefined, 'normal');
            }

            doc.setFont(undefined, 'bold');
            doc.setFontSize(7);
            doc.setTextColor(
                100,
                116,
                139
            );

            doc.text(
                'STATUS',
                margin + padding,
                cy
            );

            cy += 4.3;

            const statusLabel =
                measure.status === 'offen'
                    ? 'Offen'
                    : measure.status === 'bearbeitung'
                        ? 'In Bearbeitung'
                        : 'Erledigt';

            const statusColor =
                measure.status === 'offen'
                    ? [214, 69, 63]
                    : measure.status === 'bearbeitung'
                        ? [201, 127, 26]
                        : [47, 158, 100];

            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...statusColor);

            doc.text(
                statusLabel,
                margin + padding,
                cy
            );

            doc.setTextColor(0);

            y += cardHeight + 5;
        }
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

    doc.text(
        'Unterschriften',
        margin,
        y
    );

    y += 8;

    const sigWidth =
        (contentWidth - 10) / 2;

    const sigHeight = 28;

    [
        {
            key: 'pruefer',
            label: 'Prüfer',
            name: state.companyInfo.pruefername
        },
        {
            key: 'marktleitung',
            label: 'Marktleitung',
            name: state.companyInfo.marktleitung
        }
    ].forEach((sig, i) => {

        const x =
            margin +
            i * (sigWidth + 10);

        doc.setDrawColor(220);

        doc.rect(
            x,
            y,
            sigWidth,
            sigHeight,
            'S'
        );

        if (state.signatures[sig.key]) {

            try {

                doc.addImage(
                    state.signatures[sig.key],
                    'PNG',
                    x + 2,
                    y + 2,
                    sigWidth - 4,
                    sigHeight - 4
                );

            } catch (e) {
                // ignore
            }
        }

        doc.setFont(undefined, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(
            90,
            100,
            108
        );

        doc.text(
            `${sig.label}: ${sig.name || '-'}`,
            x,
            y + sigHeight + 5
        );
    });

    if (includeFotos) {

        const photos =
            await getUnlinkedPhotos();

        // Abschnitt "Fotodokumentation" nur anlegen, wenn tatsaechlich
        // (allgemeine, nicht einer Massnahme zugeordnete) Fotos vorhanden
        // sind - sonst wuerde eine leere Seite mit nur der Ueberschrift
        // im Gesamt-PDF erscheinen.
        if (photos.length > 0) {

            doc.addPage();

            y = 18;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(14);
            doc.setTextColor(
                28,
                34,
                38
            );

            doc.text(
                'Fotodokumentation',
                margin,
                y
            );

            y += 9;

            await renderFotosSection(
                doc,
                y,
                margin,
                contentWidth,
                pageHeight,
                photos
            );
        }
    }

    // Fotos zu einzelnen Massnahmen als eigener Anhang - unabhaengig vom
    // "includeFotos"-Schalter, da das inhaltlich zum Massnahmenteil gehoert.
    await renderMeasurePhotosAppendix(
        doc,
        margin,
        contentWidth,
        pageHeight,
        state.measures
    );

    // Quellen als Anhang - nur wenn ueberhaupt Massnahmen vorhanden sind.
    // "BGHW"/"Rechtlich": Gesamtliste (die Texte zitieren die Fundstellen
    // selbst). "Einfach": nur die Quellen zu den Massnahmen dieser Begehung,
    // je Massnahme (ab Ausgabestand 1.54-13).
    if (state.measures.length > 0) {
        if (MEASURE_STYLE === 'einfach') {
            renderMassnahmenQuellenAnhang(doc, margin, contentWidth, pageHeight, state.measures);
        } else if (typeof MEASURE_SOURCES !== 'undefined') {
            renderSourcesAppendix(doc, margin, contentWidth, pageHeight);
        }
    }

    const totalPages =
        doc.getNumberOfPages();

    for (let i = 2; i <= totalPages; i++) {

        doc.setPage(i);

        doc.setFontSize(8);
        doc.setTextColor(140);

        doc.text(
            `${i}/${totalPages}`,
            pageWidth - margin,
            pageHeight - 8,
            { align: 'right' }
        );
    }

    return doc;
}

// ===== Vereinheitlichter Export: Modus 'checkliste' | 'massnahmen' | 'fotos' | 'alle' =====
function reportFilename(mode) {
    if (mode === 'checkliste') return checklistPdfFilename();
    if (mode === 'massnahmen') return pdfFilename();
    if (mode === 'fotos') return fotosPdfFilename();

    return checklistPdfFilename()
        .replace(
            'Checkliste_',
            'Gesamtbericht_'
        );
}

async function buildReportPdf(mode) {
    if (mode === 'checkliste') {
        return buildChecklistPdf();
    }

    if (mode === 'massnahmen') {
        return buildPdf(false, false);
    }

    if (mode === 'fotos') {
        return await buildFotosPdf();
    }

    return await buildPdf(true, true);
}

async function shareReportPdf(mode) {
    try {

        const doc =
            await buildReportPdf(mode);

        await sharePdfDoc(
            doc,
            reportFilename(mode),
            buildShareEmailSubject(mode),
            mode
        );

    } catch (err) {

        console.error(
            'Report-PDF konnte nicht erzeugt werden:',
            err
        );

        showToast(
            'PDF-Fehler: ' +
            (
                err && err.message
                    ? err.message
                    : 'unbekannter Fehler'
            ),
            'error'
        );
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

        const doc =
            await buildReportPdf(mode);

        const blob =
            doc.output('blob');

        // Desktop-App (Tauri): kein neues Fenster moeglich - im Rahmen drucken
        if (laeuftInTauri()) {
            if (await druckePdfImRahmen(blob)) {
                showToast('Druckdialog geöffnet');
            } else {
                doc.save(reportFilename(mode));
                showToast('Drucken nicht möglich – PDF heruntergeladen');
            }
            return;
        }

        const url =
            URL.createObjectURL(blob);

        const win =
            window.open(url, '_blank');

        if (win) {

            showToast(
                'PDF geöffnet – über das Teilen-Symbol drucken'
            );

        } else {

            // Pop-up blockiert: PDF stattdessen herunterladen, manuell drucken
            doc.save(
                reportFilename(mode)
            );

            showToast(
                'Pop-up blockiert – PDF heruntergeladen'
            );
        }

    } catch (err) {

        console.error(
            'Drucken fehlgeschlagen:',
            err
        );

        showToast(
            'PDF-Fehler: ' +
            (
                err && err.message
                    ? err.message
                    : 'unbekannter Fehler'
            ),
            'error'
        );
    }
}

// ===== Betriebsdaten: Formular (index.html) =====
function initCompanyForm() {
    const fields = [
        'marktnummer',
        'plzOrt',
        'strasse',
        'datum',
        'pruefername',
        'marktleitung',
        'teilnehmer'
    ];

    let anyField = false;

    fields.forEach(field => {

        const input =
            document.getElementById(field);

        if (!input) return;

        anyField = true;

        input.value =
            state.companyInfo[field] || '';

        input.addEventListener(
            'change',
            () => {
                state.companyInfo[field] =
                    input.value;

                saveState();
            }
        );
    });

    return anyField;
}

// ===== Betriebsdaten: Anzeige (massnahmen.html) =====
function renderCompanyInfoStrip() {
    const strip =
        document.getElementById(
            'company-info-strip'
        );

    if (!strip) return;

    const map = {
        'info-marktnummer':
            state.companyInfo.marktnummer,

        'info-plzOrt':
            state.companyInfo.plzOrt,

        'info-strasse':
            state.companyInfo.strasse,

        'info-datum':
            state.companyInfo.datum
                ? formatDate(state.companyInfo.datum)
                : '',

        'info-pruefer':
            state.companyInfo.pruefername,

        'info-marktleitung':
            state.companyInfo.marktleitung,

        'info-teilnehmer':
            state.companyInfo.teilnehmer
    };

    Object.keys(map).forEach(id => {

        const el =
            document.getElementById(id);

        if (el) {
            el.textContent =
                map[id] || '–';
        }
    });
}

// Kategorien mit "nicht in jedem Markt vorhanden"-Schalter: Ausstattung/Räumlichkeit,
// die bei Aktivierung komplett als N.V. markiert und gesperrt wird.
const OPTIONAL_CATEGORIES = {
    'kundenaufzug':
        'Kein Kundenaufzug im Markt vorhanden',

    'lastenaufzug':
        'Kein Lastenaufzug im Markt vorhanden',

    'barrierefreies-wc':
        'Kein barrierefreies WC im Markt vorhanden',

    'praktikanten':
        'Keine Praktikanten/Schüleraushilfen im Markt beschäftigt',

    'co2-kuehleinrichtungen':
        'Keine CO2-Kühleinrichtungen im Markt vorhanden',

    'fluessiggasflaschen':
        'Keine Flüssiggasflaschen im Markt vorhanden',

    'sonstiges':
        'Keine sonstigen Feststellungen'
};

// ===== Checkliste rendern (index.html) =====
// buildChecklistHtml() erzeugt das HTML separat, damit es auch fuer den
// Druck-Container auf der Maßnahmen-Seite wiederverwendet werden kann.
function toggleSubgroupNotApplicable(categoryId, groupIndex, checked) {
    const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const groupNames = [];
    category.items.forEach(item => {
        const name = item.group || 'Weitere Prüfpunkte';
        if (!groupNames.includes(name)) groupNames.push(name);
    });

    const groupName = groupNames[groupIndex];
    if (!groupName) return;

    const key = `${categoryId}::${groupName}`;
    state.subgroupNotApplicable[key] = checked;

    if (checked) {
        category.items
            .filter(item => (item.group || 'Weitere Prüfpunkte') === groupName)
            .forEach(item => {
                state.ratings[item.id] = 'na';
                delete state.comments[item.id];
                state.measures = state.measures.filter(m => m.itemId !== item.id);
            });
    }

    saveState();
    renderChecklist();
}

function renderCategoryItems(category, locked, forceOpenAll) {
    const hasGroups = category.items.some(item => item.group);
    if (!hasGroups) {
        return category.items.map(item => renderItem(item, locked)).join('');
    }

    const groups = [];
    category.items.forEach(item => {
        const name = item.group || 'Weitere Prüfpunkte';
        let group = groups.find(g => g.name === name);
        if (!group) {
            group = { name, items: [] };
            groups.push(group);
        }
        group.items.push(item);
    });

    return groups.map((group, index) => {
        const key = `${category.id}::${group.name}`;
        const groupOpen = forceOpenAll || openSubgroups.has(key);
        const showSubgroupToggle = category.id !== 'beleuchtung';
        const groupLocked = locked || (showSubgroupToggle && !!state.subgroupNotApplicable[key]);
        const answered = group.items.filter(item => state.ratings[item.id]).length;
        const complete = answered === group.items.length;

        return `
        <div class="audit-subgroup ${groupOpen ? 'open' : ''}">
            <button type="button" class="audit-subgroup-header"
                ${aktionAttr('click', 'toggleSubgroupByIndex', category.id, index)}>
                <span class="audit-subgroup-left">
                    <svg class="audit-subgroup-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span>${escapeHtml(group.name)}</span>
                </span>
                <span class="category-count ${complete ? 'complete' : ''}">${answered} / ${group.items.length}</span>
            </button>
            <div class="audit-subgroup-body">
                ${showSubgroupToggle ? `
                <div class="category-toggle-row subgroup-toggle-row" data-stop-click>
                    <label class="toggle-switch">
                        <input type="checkbox" ${state.subgroupNotApplicable[key] ? 'checked' : ''}
                            ${locked ? 'disabled' : ''}
                            ${aktionAttr('change', 'toggleSubgroupNotApplicable', category.id, index, '$checked')}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label">Unterbereich nicht vorhanden / nicht anwendbar – alle Fragen automatisch als „N.V." markieren</span>
                </div>` : ''}
                ${group.items.map(item => renderItem(item, groupLocked)).join('')}
            </div>
        </div>`;
    }).join('');
}

function toggleSubgroupByIndex(categoryId, groupIndex) {
    const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const groupNames = [];
    category.items.forEach(item => {
        const name = item.group || 'Weitere Prüfpunkte';
        if (!groupNames.includes(name)) groupNames.push(name);
    });

    const groupName = groupNames[groupIndex];
    if (!groupName) return;

    const key = `${categoryId}::${groupName}`;
    const categoryElement = document.getElementById(`cat-${categoryId}`);
    const subgroupElements = categoryElement
        ? categoryElement.querySelectorAll('.audit-subgroup')
        : [];
    const subgroupElement = subgroupElements[groupIndex];

    if (openSubgroups.has(key)) {
        openSubgroups.delete(key);
        if (subgroupElement) subgroupElement.classList.remove('open');
    } else {
        openSubgroups.add(key);
        if (subgroupElement) subgroupElement.classList.add('open');
    }
}

function buildChecklistHtml(forceOpenAll) {
    return AUDIT_CATEGORIES.map(category => {

        const isOpen =
            forceOpenAll ||
            openCategoryId === category.id;

        const toggleLabel =
            OPTIONAL_CATEGORIES[category.id];

        const locked =
            !!toggleLabel &&
            !!state.notApplicable[category.id];

        const relevant =
            category.items.filter(
                i => punktZaehlt(i)
            );

        const answered =
            relevant.filter(
                i => state.ratings[i.id]
            ).length;

        const complete =
            answered === relevant.length;

        return `
        <section class="category card ${isOpen ? 'open' : ''}" id="cat-${escapeHtml(category.id)}">
            <div class="category-header" ${aktionAttr('click', 'toggleCategory', category.id)}>
                <div class="category-header-left">
                    <svg class="category-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span class="category-name">${escapeHtml(category.name)}</span>
                </div>
                <span class="category-count ${complete ? 'complete' : ''}">${answered} / ${relevant.length}</span>
            </div>
            <div class="category-body">
                ${toggleLabel ? `
                <div class="category-toggle-row" data-stop-click>
                    <label class="toggle-switch">
                        <input type="checkbox" ${locked ? 'checked' : ''} ${aktionAttr('change', 'toggleNotApplicable', category.id, '$checked')}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label">${toggleLabel} – alle Fragen automatisch als „N.V." markieren</span>
                </div>` : ''}
                ${renderCategoryItems(category, locked, forceOpenAll)}
            </div>
        </section>`;

    }).join('');
}

function renderChecklist() {
    const container =
        document.getElementById(
            'checklist-container'
        );

    if (!container) return;

    // Nachruesten: Maßnahmen, die schon vor diesem Fix angelegt wurden
    // (oder deren Kommentar sich seitdem geaendert hat, ohne dass
    // updateComment() lief - z. B. nach dem Laden einer Begehung), bekommen
    // hier den aktuellen Kommentar aus state.comments synchronisiert. Guenstige
    // Pruefung, daher unproblematisch bei jedem renderChecklist()-Aufruf.
    state.measures.forEach(m => {
        const aktuellerKommentar = state.comments[m.itemId] || '';
        if (m.comment !== aktuellerKommentar) {
            m.comment = aktuellerKommentar;
        }
    });

    container.innerHTML =
        buildChecklistHtml(false);

    updateStats();
}

function renderItem(item, locked) {
    const rating =
        state.ratings[item.id] || '';

    const comment =
        state.comments[item.id] || '';

    const isMangel =
        rating === 'mangel';

    const vorMassnahme = isMangel
        ? state.measures.find(m => m.itemId === item.id && m.vorbegehung)
        : null;

    // Freier Pruefpunkt: Textfeld statt Fragetext; bewertbar erst mit Text
    const freiLeer = item.frei && !freierText(item.id) && !rating;
    const btnAttr = locked ? 'disabled data-gesperrt-kategorie' : (freiLeer ? 'disabled' : '');
    const textHtml = item.frei
        ? `<input type="text" class="frei-text" maxlength="300" placeholder="Eigenen Prüfpunkt eintragen …" aria-label="Freier Prüfpunkt ${escapeHtml(item.id)}" value="${escapeHtml((state.freieTexte || {})[item.id] || '')}" ${locked ? 'disabled' : ''} ${aktionAttr('input', 'updateFreierText', item.id, '$value')}>`
        : item.text;

    return `
    <div class="item ${isMangel ? 'is-mangel' : ''} ${item.frei ? 'is-frei' : ''}" data-item-id="${escapeHtml(item.id)}">
        <div class="item-row">
            <div class="item-text"><span class="item-id">${item.id}</span>${textHtml}</div>
            <div class="item-actions">
                <button class="rating-btn ok ${rating === 'ok' ? 'selected' : ''}" ${btnAttr} ${aktionAttr('click', 'setRating', item.id, 'ok')} aria-label="In Ordnung">OK</button>
                <button class="rating-btn mangel ${rating === 'mangel' ? 'selected' : ''}" ${btnAttr} ${aktionAttr('click', 'setRating', item.id, 'mangel')} aria-label="Mangel">!</button>
                <button class="rating-btn na ${rating === 'na' ? 'selected' : ''}" ${btnAttr} ${aktionAttr('click', 'setRating', item.id, 'na')} aria-label="Nicht vorhanden">N.V.</button>
            </div>
        </div>
        ${isMangel ? `
        <div class="item-detail">
            ${vorMassnahme ? `<div class="vorbegehung-hinweis">↻ ${escapeHtml(vorbegehungHinweis(vorMassnahme))} – bitte prüfen; ist der Mangel behoben, auf „OK“ setzen.</div>` : ''}
            <label for="comment-${escapeHtml(item.id)}">Beschreibung des Mangels</label>
            <textarea id="comment-${escapeHtml(item.id)}" placeholder="Was wurde festgestellt? (optional)" ${aktionAttr('input', 'updateComment', item.id, '$value')}>${escapeHtml(comment)}</textarea>
            ${item.frei ? `<div class="measure-preview">
                <span class="label">Maßnahme</span>
                Im Aktionsplan frei eintragen.
            </div>` : `<div class="measure-preview">
                <span class="label">Empfohlene Maßnahme</span>
                ${getMeasureText(item.id)}
            </div>`}
        </div>` : ''}
    </div>`;
}

function toggleCategory(categoryId) {
    const wasOpen = openCategoryId === categoryId;
    const previousScrollY = window.scrollY;

    openCategoryId = wasOpen ? null : categoryId;
    renderChecklist();

    // Beim Öffnen an den Anfang der Kategorie springen, damit die Bearbeitung
    // immer von oben nach unten beginnen kann. Beim Schließen bleibt die
    // bisherige Position erhalten.
    if (!wasOpen) {
        requestAnimationFrame(() => {
            const category = document.getElementById(`cat-${categoryId}`);
            if (!category) return;

            const header = category.querySelector('.category-header');
            const top = (header || category).getBoundingClientRect().top + window.scrollY - 16;
            window.scrollTo({ top, behavior: 'auto' });
        });
    } else {
        requestAnimationFrame(() => {
            window.scrollTo({ top: previousScrollY, behavior: 'auto' });
        });
    }
}

// ===== "Nicht vorhanden"-Schalter fuer optionale Kategorien =====
function toggleNotApplicable(categoryId, checked) {
    state.notApplicable[categoryId] =
        checked;

    const category =
        AUDIT_CATEGORIES.find(
            c => c.id === categoryId
        );

    if (checked && category) {

        category.items.forEach(item => {

            state.ratings[item.id] =
                'na';

            delete state.comments[item.id];

            state.measures =
                state.measures.filter(
                    m => m.itemId !== item.id
                );
        });
    }

    saveState();
    renderChecklist();
}

function setRating(itemId, rating) {
    // Freier Pruefpunkt ohne Text: erst Text eintragen
    if (FREIE_PUNKT_IDS.indexOf(itemId) !== -1 && !freierText(itemId) && !state.ratings[itemId]) return;


    // Schutz: waehrend eine Kategorie per Schalter als "nicht vorhanden" markiert ist,
    // bleiben ihre Fragen gesperrt auf N.V. (Buttons sind zusaetzlich disabled).
    for (
        const categoryId in OPTIONAL_CATEGORIES
    ) {

        if (
            !state.notApplicable[categoryId]
        ) {
            continue;
        }

        const category =
            AUDIT_CATEGORIES.find(
                c => c.id === categoryId
            );

        if (
            category &&
            category.items.some(
                i => i.id === itemId
            )
        ) {
            return;
        }
    }

    // Schutz auch fuer einzeln auf N.V. geschaltete Unterbereiche.
    for (const key in state.subgroupNotApplicable) {
        if (!state.subgroupNotApplicable[key]) continue;

        const separator = key.indexOf('::');
        if (separator === -1) continue;

        const categoryId = key.slice(0, separator);
        const groupName = key.slice(separator + 2);
        const category = AUDIT_CATEGORIES.find(c => c.id === categoryId);

        if (
            category &&
            category.items.some(
                item => item.id === itemId &&
                (item.group || 'Weitere Prüfpunkte') === groupName
            )
        ) {
            return;
        }
    }

    const current =
        state.ratings[itemId];

    state.ratings[itemId] =
        current === rating
            ? ''
            : rating;

    if (!state.ratings[itemId]) {
        delete state.ratings[itemId];
    }

    if (
        state.ratings[itemId] !==
        'mangel'
    ) {

        delete state.comments[itemId];

        state.measures =
            state.measures.filter(
                m => m.itemId !== itemId
            );

    } else if (
        !state.measures.find(
            m => m.itemId === itemId
        )
    ) {

        state.measures.push({
            id:
                Date.now().toString() +
                Math.random()
                    .toString(36)
                    .slice(2, 7),

            itemId: itemId,

            description:
                getMeasureText(itemId),

            comment:
                state.comments[itemId] || '',

            responsible: '',
            dueDate: '',
            status: 'offen',
            photoThumbnails: []
        });
    }

    renderChecklist();
    saveState();
}

function updateComment(itemId, value) {
    state.comments[itemId] =
        value;

    // Falls zu dieser Frage bereits eine Maßnahme angelegt wurde (Bewertung
    // "Mangel"), Kommentar dort synchron halten - unabhaengig davon, ob der
    // Kommentar vor oder nach dem Anlegen der Maßnahme geschrieben/geaendert
    // wurde. Die "description" (Maßnahmentext) bleibt davon unberuehrt, da
    // sie im Aktionsplan frei editierbar ist.
    const measure = state.measures.find(m => m.itemId === itemId);
    if (measure) {
        measure.comment = value;
    }

    saveState();
}

// Reine Berechnung, getrennt von der DOM-Aktualisierung - so kann sie auch
// vom PDF-Deckblatt (drawCoverPage) genutzt werden.
function computeStats() {
    const total =
        totalItemCount();

    const values =
        Object.values(
            state.ratings
        );

    const ok =
        values.filter(
            v => v === 'ok'
        ).length;

    const mangel =
        values.filter(
            v => v === 'mangel'
        ).length;

    const na =
        values.filter(
            v => v === 'na'
        ).length;

    const answered =
        ok + mangel + na;

    const offen =
        total - answered;

    return {
        total,
        ok,
        mangel,
        na,
        offen,
        answered
    };
}

function updateStats() {
    const {
        total,
        ok,
        mangel,
        na,
        offen,
        answered
    } = computeStats();

    const setText =
        (id, val) => {

            const el =
                document.getElementById(id);

            if (el) {
                el.textContent = val;
            }
        };

    setText('stat-ok', ok);
    setText('stat-mangel', mangel);
    setText('stat-na', na);
    setText('stat-offen', offen);

    setText(
        'progress-label',
        `${answered} / ${total} geprüft`
    );

    const fill =
        document.getElementById(
            'progress-fill'
        );

    if (fill) {
        fill.style.width =
            total
                ? `${Math.round(
                    (answered / total) * 100
                )}%`
                : '0%';
    }
}

// ===== JSON Export / Import =====

// Baut den JSON-Blob und Dateinamen aus dem aktuellen state - gemeinsam
// genutzt von "JSON exportieren" (Download) und "JSON per Mail teilen".
function buildJsonBlob() {
    const dataStr = JSON.stringify(state, null, 2);
    return new Blob([dataStr], { type: 'application/json' });
}

function jsonExportFilename() {
    const datum = state.companyInfo.datum || todayIsoLocal();
    const marktnummer = (state.companyInfo.marktnummer || 'begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    return `ASiC-Handel_${marktnummer}_${datum}.json`;
}

function exportJson() {
    const blob = buildJsonBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = jsonExportFilename();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('JSON exportiert');
}

// Teilt die JSON-Datei ueber das native Teilen-Menue (z. B. direkt an
// die Mail-App) - fuer den Fall, dass kein Zugriff auf den Server besteht und
// die Datei stattdessen manuell per Mail an eine Kollegin/einen Kollegen
// weitergegeben werden soll, die/der sie im Server-Ordner ablegt (z. B. ueber
// "Vom Server laden" ist das nicht moeglich, da das nur vorhandene Server-Dateien
// abruft - das manuelle Ablegen selbst erfolgt ausserhalb der App, etwa
// per Dateifreigabe).
async function shareJson() {
    const blob = buildJsonBlob();
    const filename = jsonExportFilename();
    const markt = state.companyInfo.marktnummer || '-';
    const text = `Anbei die JSON-Datei der Begehung „${markt}" zur Weiterleitung/Ablage auf dem Server, falls der direkte Server-Zugriff gerade nicht möglich war.`;

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'application/json' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'ASiC Handel – Begehungsdaten (JSON)', text });
                    showToast('JSON geteilt');
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
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('JSON heruntergeladen (Teilen auf diesem Gerät nicht verfügbar)');
    } catch (err) {
        console.error('JSON-Teilen fehlgeschlagen:', err);
        showToast('JSON-Teilen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

// Rueckfrage vor dem Laden einer JSON-Datei (ab 1.54-9). Fotos bleiben nur,
// wenn die Datei dieselbe Begehung (Markt + Datum) enthaelt.
async function frageVorJsonLaden(data, dateiname) {
    const ci = data.companyInfo || {};
    const gleich = (String(ci.marktnummer || '').trim() + '|' + String(ci.datum || '')) === begehungsKennung();
    const fotos = await anzahlFotosAufGeraet();
    const punkte = [
        'Die Begehung aus der Datei „' + dateiname + '“ wird auf diesem Gerät geöffnet und kann weiterbearbeitet werden.',
        gleich
            ? 'Es ist dieselbe Begehung wie die geöffnete – die Fotos auf diesem Gerät bleiben erhalten.'
            : 'JSON-Dateien enthalten keine Fotos.' + (fotos ? ' Die ' + fotosText(fotos) + ' auf diesem Gerät werden entfernt.' : '')
    ];
    const ersetzt = begehungHatInhalt();
    let warnung = null;
    if (ersetzt) {
        const a = karteAktuelleBegehung();
        warnung = {
            titel: 'Offene Begehung wird ersetzt',
            text: 'Auf diesem Gerät ist die Begehung ' + a.markt + (a.datum !== '–' ? ' vom ' + a.datum : '') + ' geöffnet. ' + sicherungsSatz()
        };
    }
    const w = await zeigeHinweisFenster({
        titel: 'JSON laden',
        sub: 'Begehung aus einer Datei öffnen',
        karte: {
            markt: ci.marktnummer ? 'Markt ' + ci.marktnummer : 'ohne Marktnummer',
            datum: ci.datum ? formatDatumDe(ci.datum) : '–',
            ort: [ci.plzOrt, ci.firma].filter(Boolean).join(' · ')
        },
        punkte,
        warnung,
        knoepfe: ersetzt ? [
            { w: 'archiv', text: 'Erst im Verlauf archivieren, dann öffnen', art: 'primaer' },
            { w: 'ersetzen', text: 'Ohne Archivieren ersetzen', art: 'warn' },
            { w: '', text: 'Abbrechen' }
        ] : [
            { w: 'ersetzen', text: 'Öffnen', art: 'primaer' },
            { w: '', text: 'Abbrechen' }
        ]
    });
    return w ? { wahl: w, fotosBehalten: gleich } : null;
}

function importJson(file) {
    const reader =
        new FileReader();
    reader.onload = async (e) => {
        let data;
        try {
            // Markt-Datensatz der Version 2: Begehungsteil verwenden
            data = begehungAusDatensatz(JSON.parse(e.target.result));
            if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('kein Begehungs-Datensatz');
        } catch (err) {
            console.error(err);
            showToast('Datei konnte nicht gelesen werden', 'error');
            return;
        }
        const antwort = await frageVorJsonLaden(data, file.name || 'Datei');
        if (!antwort) return;
        if (antwort.wahl === 'archiv' && !(await archiviereAktuelleBegehung())) return;
        meldeGeschlossen();
        try {
            if (!antwort.fotosBehalten && typeof deleteAllPhotos === 'function') {
                try { await deleteAllPhotos(); } catch (err) { console.error('Fotos konnten nicht geleert werden:', err); }
            }
            state = {

                companyInfo: {
                    ...defaultState().companyInfo,
                    ...(data.companyInfo || {})
                },

                ratings:
                    data.ratings || {},

                comments:
                    data.comments || {},

                measures:
                    data.measures || [],

                signatures: {
                    ...defaultState().signatures,
                    ...(data.signatures || {})
                },

                notApplicable:
                    data.notApplicable || {},

                subgroupNotApplicable:
                    data.subgroupNotApplicable || {},

                freieTexte:
                    data.freieTexte || {}
            };

            merkeMarktContainer(data);
            initCompanyForm();
            renderChecklist();
            renderCompanyInfoStrip();

            // WICHTIG: saveState() erst NACH renderChecklist(), da dort die
            // Kommentar-Nachruestung fuer die Maßnahmen passiert (siehe
            // renderChecklist()). Vorher gespeichert, wuerde der
            // nachgetragene Kommentar beim naechsten Laden (z. B. auf der
            // Maßnahmenseite, die den Zustand frisch aus dem Speicher
            // liest) wieder fehlen.
            saveState();

            if (
                typeof renderMeasures ===
                'function'
            ) {
                renderMeasures();
            }

            if (
                typeof restoreSignatures ===
                'function'
            ) {
                restoreSignatures();
            }

            showToast(
                'JSON geladen'
            );

        } catch (err) {

            console.error(err);

            showToast(
                'Datei konnte nicht gelesen werden',
                'error'
            );
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
// ===== Wiederholungsbegehung (ab Rev. 1.52) =====
// Kennzeichnung einer Massnahme, die aus der Vorbegehung uebernommen wurde.
function vorbegehungHinweis(measure) {
    const v = measure && measure.vorbegehung;
    if (!v) return '';
    return 'Offen aus Vorbegehung' + (v.datum ? ' vom ' + formatDate(v.datum) : '') +
        (v.status === 'bearbeitung' ? ' (dort in Bearbeitung)' : '');
}

// Baut aus einer frueheren Begehung (lokales Archiv oder Team-Archiv) den
// Startstand einer Wiederholungsbegehung: Betriebsdaten und N.V.-Schalter
// werden uebernommen, das Datum auf heute gesetzt. Nicht erledigte
// Massnahmen werden als Mangel vorbelegt und mit Hinweis auf die
// Vorbegehung versehen - ist der Mangel inzwischen behoben, setzt der
// Pruefer einfach "OK", dann entfaellt die Massnahme wie gewohnt.
// Unterschriften und Fotos werden bewusst nicht uebernommen.
function buildFollowUpState(record) {
    const neu = defaultState();
    const ci = (record && record.companyInfo) || {};
    const vorDatum = ci.datum || '';
    neu.companyInfo = { ...neu.companyInfo, ...ci, datum: todayIsoLocal() };
    neu.notApplicable = { ...((record && record.notApplicable) || {}) };
    neu.subgroupNotApplicable = { ...((record && record.subgroupNotApplicable) || {}) };
    // Freie Pruefpunkte: Text immer uebernehmen (auch wenn zuletzt OK)
    neu.freieTexte = { ...((record && record.freieTexte) || {}) };
    const alteKommentare = (record && record.comments) || {};
    let n = 0;
    ((record && record.measures) || []).forEach(m => {
        if (!m || m.status === 'erledigt') return;
        const found = m.itemId ? findItemById(m.itemId) : null;
        if (m.itemId && !found) return;
        const kommentar = (m.comment || alteKommentare[m.itemId] || '').trim();
        if (found) {
            neu.ratings[m.itemId] = 'mangel';
            if (kommentar) neu.comments[m.itemId] = kommentar;
        }
        neu.measures.push({
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7) + n,
            itemId: m.itemId,
            description: (found && typeof getMeasureText === 'function' ? getMeasureText(m.itemId) : '') || m.description || '',
            comment: kommentar,
            responsible: m.responsible || '',
            dueDate: m.dueDate || '',
            status: m.status === 'bearbeitung' ? 'bearbeitung' : 'offen',
            photoThumbnails: [],
            vorbegehung: { datum: vorDatum, status: m.status || 'offen' }
        });
        n++;
    });
    return { state: neu, uebernommen: n, vorDatum: vorDatum };
}

async function startFollowUpAudit(record, quelle) {
    const wahl = await frageWiederholung(record, quelle);
    if (!wahl) return false;
    if (wahl === 'archiv' && !(await archiviereAktuelleBegehung())) return false;
    const ergebnis = buildFollowUpState(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ergebnis.state));
    if (typeof deleteAllPhotos === 'function') {
        try { await deleteAllPhotos(); } catch (e) { console.error('Fotos konnten nicht geleert werden:', e); }
    }
    await meldeGeschlossen();
    return ergebnis;
}

async function archiveCurrentAudit() {
    const fotos = await anzahlFotosAufGeraet();
    const wahl = await zeigeHinweisFenster({
        titel: 'Begehung archivieren',
        sub: 'Schnappschuss in „Mein Verlauf“ ablegen',
        karte: karteAktuelleBegehung(),
        punkte: [
            'Ein vollständiger Schnappschuss mit Bewertungen, Maßnahmen, Unterschriften' + (fotos ? ' und ' + fotosText(fotos) : '') + ' wird unter „Verlauf → Mein Verlauf“ abgelegt.',
            'Die Begehung bleibt geöffnet und kann weiterbearbeitet werden.',
            'Das Archiv liegt nur auf diesem Gerät. Fürs Team bitte zusätzlich „Auf Server speichern“.'
        ],
        knoepfe: [
            { w: 'ja', text: 'Archivieren', art: 'primaer' },
            { w: '', text: 'Abbrechen' }
        ]
    });
    if (wahl !== 'ja') return;
    if (await archiviereAktuelleBegehung()) meldeGeschlossen();
}

// Archiviert die laufende Begehung ohne Rueckfrage (auch fuer den Dialog
// "Vom Server laden"). Liefert true bei Erfolg.
async function archiviereAktuelleBegehung() {
    try {

        const photos =
            await getAllPhotos();

        const record = {

            id:
                'audit_' +
                Date.now() +
                '_' +
                Math.random()
                    .toString(36)
                    .slice(2, 8),

            createdAt:
                Date.now(),

            companyInfo:
                JSON.parse(
                    JSON.stringify(
                        state.companyInfo
                    )
                ),

            ratings:
                JSON.parse(
                    JSON.stringify(
                        state.ratings
                    )
                ),

            comments:
                JSON.parse(
                    JSON.stringify(
                        state.comments
                    )
                ),

            measures:
                JSON.parse(
                    JSON.stringify(
                        state.measures
                    )
                ),

            signatures:
                JSON.parse(
                    JSON.stringify(
                        state.signatures
                    )
                ),

            notApplicable:
                JSON.parse(
                    JSON.stringify(
                        state.notApplicable || {}
                    )
                ),

            subgroupNotApplicable:
                JSON.parse(
                    JSON.stringify(
                        state.subgroupNotApplicable || {}
                    )
                ),

            freieTexte:
                JSON.parse(
                    JSON.stringify(
                        state.freieTexte || {}
                    )
                ),

            stats:
                computeStats(),

            photos:
                photos
        };

        await saveArchivedAudit(record);

        showToast(
            'Begehung archiviert'
        );
        return true;

    } catch (err) {

        console.error(
            'Archivieren fehlgeschlagen:',
            err
        );

        showToast(
            'Archivieren fehlgeschlagen: ' +
            (
                err &&
                err.message
                    ? err.message
                    : 'unbekannter Fehler'
            ),
            'error'
        );

        return false;
    }
}

// Erzeugt eine PDF fuer einen ARCHIVIERTEN Datensatz, indem die bestehenden,
// bereits ausfuehrlich getesteten PDF-Funktionen (die auf dem globalen "state"
// und getAllPhotos() arbeiten) kurzzeitig auf den archivierten Schnappschuss
// umgeleitet und danach wieder zurueckgesetzt werden. Bewusster Kompromiss:
// spart eine komplette Parallel-Implementierung der PDF-Erzeugung, die exakt
// dasselbe noch einmal tun muesste.
async function buildArchivedReportPdf(record, mode) {
    const originalState =
        state;

    const originalGetAllPhotos =
        getAllPhotos;

    state = {

        companyInfo:
            record.companyInfo,

        ratings:
            record.ratings,

        comments:
            record.comments,

        measures:
            record.measures,

        signatures:
            record.signatures,

        notApplicable:
            record.notApplicable || {},

        freieTexte:
            record.freieTexte || {}
    };

    getAllPhotos =
        async () =>
            record.photos || [];

    try {

        return await buildReportPdf(
            mode
        );

    } finally {

        state =
            originalState;

        getAllPhotos =
            originalGetAllPhotos;
    }
}

// Wie buildArchivedReportPdf(), haelt die Umleitung aber zusaetzlich waehrend
// des Teilens aktiv - sharePdfDoc() ruft bei Erfolg intern openPrefilledMail()
// auf, das wiederum Betreff/Text aus state.companyInfo baut. Ohne die
// Umleitung wuerde die Mail faelschlich Markt/Datum der AKTUELL laufenden
// Begehung zeigen statt der archivierten.
async function shareArchivedReportPdf(record, mode) {
    const originalState =
        state;

    const originalGetAllPhotos =
        getAllPhotos;

    state = {

        companyInfo:
            record.companyInfo,

        ratings:
            record.ratings,

        comments:
            record.comments,

        measures:
            record.measures,

        signatures:
            record.signatures,

        notApplicable:
            record.notApplicable || {},

        freieTexte:
            record.freieTexte || {}
    };

    getAllPhotos =
        async () =>
            record.photos || [];

    try {

        const doc =
            await buildReportPdf(
                mode
            );

        await sharePdfDoc(
            doc,
            reportFilename(mode)
                .replace(
                    /^(Checkliste|Massnahmenplan|Gesamtbericht)_/,
                    'Archiv_'
                ),
            buildShareEmailSubject(mode),
            mode
        );

    } finally {

        state =
            originalState;

        getAllPhotos =
            originalGetAllPhotos;
    }
}

async function resetAll() {
    const fotos = await anzahlFotosAufGeraet();
    const leer = !begehungHatInhalt() && fotos === 0;
    const wahl = await zeigeHinweisFenster({
        titel: 'Zurücksetzen',
        sub: 'Neue, leere Begehung beginnen',
        karte: leer ? null : karteAktuelleBegehung(),
        punkte: leer ? ['Auf diesem Gerät ist keine Begehung mit Eingaben geöffnet.'] : [],
        warnung: leer ? null : {
            titel: 'Eingaben werden gelöscht',
            text: (fotos ? 'Betriebsdaten, Bewertungen, Maßnahmen, Unterschriften und ' + fotosText(fotos) : 'Betriebsdaten, Bewertungen, Maßnahmen und Unterschriften') + ' werden von diesem Gerät gelöscht. ' + sicherungsSatz() + ' Das lässt sich nicht rückgängig machen.'
        },
        knoepfe: leer ? [
            { w: 'ersetzen', text: 'Zurücksetzen', art: 'primaer' },
            { w: '', text: 'Abbrechen' }
        ] : [
            { w: 'archiv', text: 'Erst im Verlauf archivieren, dann zurücksetzen', art: 'primaer' },
            { w: 'ersetzen', text: 'Ohne Archivieren zurücksetzen', art: 'warn' },
            { w: '', text: 'Abbrechen' }
        ]
    });
    if (!wahl) return;
    if (wahl === 'archiv' && !(await archiviereAktuelleBegehung())) return;
    meldeGeschlossen();

    state =
        defaultState();

    saveState();

    initCompanyForm();

    openCategoryId =
        null;

    renderChecklist();

    // Fotos gehoeren zur selben Begehung und sollten bei einem Reset ebenfalls
    // verschwinden - sie liegen aber separat in IndexedDB, nicht im state.
    if (
        typeof deleteAllPhotos ===
        'function'
    ) {

        deleteAllPhotos()
            .then(() => {

                if (
                    typeof loadAndRenderPhotos ===
                    'function'
                ) {
                    loadAndRenderPhotos();
                }

            })
            .catch(
                err =>
                    console.error(
                        'Fotos konnten beim Zurücksetzen nicht gelöscht werden:',
                        err
                    )
            );
    }

    showToast(
        'Zurückgesetzt'
    );
}

// ===== Sprachstil-Umschalter (Einfach / BGHW-konform / Rechtlich) =====
function initStyleSwitch() {
    const switchEl =
        document.getElementById(
            'style-switch'
        );

    if (!switchEl) return;

    function updateActiveButton() {

        switchEl
            .querySelectorAll(
                '.style-btn'
            )
            .forEach(btn => {

                btn.classList.toggle(
                    'active',
                    btn.dataset.style ===
                    MEASURE_STYLE
                );
            });
    }

    switchEl
        .querySelectorAll(
            '.style-btn'
        )
        .forEach(btn => {

            btn.addEventListener(
                'click',
                () => {

                    setMeasureStyle(
                        btn.dataset.style
                    );

                    updateActiveButton();

                    renderChecklist();
                }
            );
        });

    updateActiveButton();
}

// ===== Initialisierung =====
document.addEventListener(
    'DOMContentLoaded',
    () => {

        loadState();

        initCompanyForm();

        initStyleSwitch();

        renderChecklist();

        renderCompanyInfoStrip();

        renderFooterMeta();

        const btnSave =
            document.getElementById(
                'btn-save'
            );

        if (btnSave) {
            btnSave.addEventListener(
                'click',
                () => {
                    saveState();
                    showToast(
                        'Gespeichert'
                    );
                }
            );
        }

        const btnSaveNas = document.getElementById('btn-save-nas');
        const btnLoadNas = document.getElementById('btn-load-nas');
        // save.php/list.php/load.php gibt es nur auf dem Server selbst,
        // nicht auf GitHub Pages (dort laeuft kein PHP) - die beiden
        // Server-Buttons dort erst gar nicht anzeigen, statt sie klickbar zu
        // lassen und erst danach eine Fehlermeldung zu zeigen. AUSNAHME:
        // Wenn unter "Einstellungen" eine externe Server-Basis-Adresse
        // hinterlegt wurde, kann das auch von GitHub Pages aus funktionieren
        // (sofern der Zielserver CORS fuer diese Adresse erlaubt).
        const laeuftAufGithubPages = window.location.hostname.endsWith('.github.io') && !getNasBaseUrl();

        const btnMenuTeam = document.getElementById('btn-menu-team');
        if (btnMenuTeam && laeuftAufGithubPages) btnMenuTeam.style.display = 'none';

        if (btnSaveNas) {
            if (laeuftAufGithubPages) {
                btnSaveNas.style.display = 'none';
            } else {
                btnSaveNas.addEventListener('click', saveStateToServer);
            }
        }
        if (btnLoadNas) {
            if (laeuftAufGithubPages) {
                btnLoadNas.style.display = 'none';
            } else {
                btnLoadNas.addEventListener('click', openServerLoadDialog);
            }
        }

        const btnExport =
            document.getElementById(
                'btn-json-export'
            );

        if (btnExport) {
            btnExport.addEventListener(
                'click',
                exportJson
            );
        }

        const btnShareJson = document.getElementById('btn-json-share');
        if (btnShareJson) {
            // nutzt das Teilen-Menue - in der Desktop-App (Tauri) nicht vorhanden
            if (laeuftInTauri()) btnShareJson.style.display = 'none';
            else btnShareJson.addEventListener('click', shareJson);
        }

        const importInput =
            document.getElementById(
                'json-import-input'
            );

        if (importInput) {

            importInput.addEventListener(
                'change',
                (e) => {

                    if (
                        e.target.files[0]
                    ) {
                        importJson(
                            e.target.files[0]
                        );
                    }

                    e.target.value = '';
                }
            );
        }

        const btnReset =
            document.getElementById(
                'btn-reset'
            );

        if (btnReset) {
            btnReset.addEventListener(
                'click',
                resetAll
            );
        }

        const btnArchive =
            document.getElementById(
                'btn-archive'
            );

        if (btnArchive) {
            btnArchive.addEventListener(
                'click',
                archiveCurrentAudit
            );
        }

        // Aufklappbares Export-Menü
        // (Checkliste/Maßnahmen/Fotos/Alles,
        // Drucken, PDF teilen, Mail) - alle Seiten
        initExportMenu();

        // Aufklappbares Datei-Menü
        // (Speichern, JSON exportieren/laden,
        // Zurücksetzen) - alle Seiten
        initDropdownMenu(
            'file-menu-toggle',
            'file-menu-panel'
        );
    }
);

// ===== Service Worker registrieren (fuer Offline-Start ohne Netzwerk) =====
if ('serviceWorker' in navigator) {

    window.addEventListener(
        'load',
        () => {

            navigator.serviceWorker
                // updateViaCache: 'none' - erzwingt, dass der Browser
                // sw.js selbst NIE aus seinem eigenen HTTP-Cache nimmt,
                // sondern bei jeder Registrierung frisch vom Server prueft.
                // Ohne das kann es vorkommen, dass eine neue Version
                // (neuer CACHE_NAME) gar nicht erst erkannt wird, weil der
                // Browser noch die alte sw.js-Datei aus seinem Cache liest.
                .register('./sw.js', { updateViaCache: 'none' })

                .then(
                    registration => {

                        console.log(
                            '[SW] Registriert:',
                            registration.scope
                        );

                        // Zusaetzlich sofort aktiv nach einer neueren
                        // Version fragen, statt nur auf den naechsten
                        // browserinternen periodischen Check zu warten.
                        registration.update().catch(() => {});
                    }
                )

                .catch(
                    err => {

                        // Fehlschlag ist unkritisch - App funktioniert auch ohne SW,
                        // dann eben nur nicht komplett offline startfaehig.
                        console.warn(
                            'Service Worker konnte nicht registriert werden:',
                            err
                        );
                    }
                );
        }
    );
}