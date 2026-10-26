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
    'toggleNotApplicable', 'setRating', 'updateComment',
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
        subgroupNotApplicable: {}
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
            subgroupNotApplicable: data.subgroupNotApplicable || {}
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

function markiereServerGesichert(dateiname) {
    try {
        localStorage.setItem(SERVER_STAND_KEY, JSON.stringify({
            zeit: new Date().toISOString(),
            datei: dateiname || '',
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
        markiereServerGesichert(ausstehend);
    } else {
        aktualisiereSicherungsHinweis();
    }
});

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

// Liest den optional in den Einstellungen hinterlegten Zugriffsschluessel.
// Wird als Kopfzeile mitgeschickt, falls gesetzt - hat serverseitig nur
// Wirkung, wenn dort ueberhaupt ein Schluessel erwartet wird (siehe
// save.php/list.php/load.php). Ohne Konfiguration: keine Kopfzeile,
// unveraendertes bisheriges Verhalten.
function getNasApiKey() {
    try {
        return localStorage.getItem('nasApiKey') || '';
    } catch (e) {
        return '';
    }
}

// Fuegt bestehenden Fetch-Optionen die Zugriffsschluessel-Kopfzeile hinzu,
// sofern ein Schluessel hinterlegt ist. Ohne Schluessel unveraendert.
function withNasAuthHeaders(options) {
    const key = getNasApiKey();
    if (!key) return options;
    return {
        ...options,
        headers: { ...(options && options.headers), 'X-Api-Key': key }
    };
}

async function saveStateToServer() {
    try {
        const res = await fetch(nasUrl('save.php'), withNasAuthHeaders({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify(state)
        }));
        const result = await parseJsonResponse(res);
        if (!res.ok || !result.ok) {
            throw new Error(result.message || `Fehler beim Speichern (HTTP ${res.status}).`);
        }
        markiereServerGesichert(result.fileName);
        showToast('Auf Server gespeichert: ' + result.fileName);
    } catch (err) {
        console.error('Server-Speichern fehlgeschlagen:', err);
        showToast('Speichern auf dem Server fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function getServerFiles() {
    const res = await fetch(nasUrl('list.php'), withNasAuthHeaders({ cache: 'no-store' }));
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
    const res = await fetch(nasUrl('load.php') + '?filename=' + encodeURIComponent(filename), withNasAuthHeaders({ cache: 'no-store' }));
    const result = await parseJsonResponse(res);
    if (!res.ok) {
        throw new Error((result && result.message) || `Fehler beim Laden (HTTP ${res.status}).`);
    }
    return result;
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
    markiereServerGesichert(filename);
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
            dateien = await getServerFiles();
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
                <span class="srv-markt">${f.marktnummer ? 'Markt ' + escapeHtml(f.marktnummer) : 'ohne Marktnummer'}</span>
                <span class="srv-datum">${escapeHtml(f.datum || '–')}</span>
                <span class="srv-ort">${escapeHtml(ort)}${zusatz ? ' · ' + escapeHtml(zusatz) : ''}</span>
                <span class="srv-meta">${escapeHtml(formatGespeichert(f.savedAt))}${f.fileName === offen ? '<span class="srv-badge">auf diesem Gerät geöffnet</span>' : ''}</span>
            </button>`;
        }).join('');
        liste.querySelectorAll('.srv-eintrag').forEach(b => b.addEventListener('click', () => {
            const f = dateien.find(x => x.fileName === b.dataset.datei);
            if (f) waehle(f);
        }));
    }

    function waehle(f) {
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

    const btnShare = panel.querySelector('[data-action="share"]');
    if (btnShare) btnShare.addEventListener('click', () => shareReportPdf(exportMode));

    const btnMail = panel.querySelector('[data-action="mail"]');
    if (btnMail) btnMail.addEventListener('click', () => openPrefilledMail(exportMode));
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

    // Quellenverzeichnis als Anhang - nur sinnvoll, wenn ueberhaupt
    // Massnahmen vorhanden sind UND der gewaehlte Sprachstil tatsaechlich
    // Regelwerke/Gesetze zitiert (nicht bei "einfach").
    if (
        state.measures.length > 0 &&
        MEASURE_STYLE !== 'einfach' &&
        typeof MEASURE_SOURCES !== 'undefined'
    ) {
        renderSourcesAppendix(doc, margin, contentWidth, pageHeight);
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
        'Keine Flüssiggasflaschen im Markt vorhanden'
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

        const answered =
            category.items.filter(
                i => state.ratings[i.id]
            ).length;

        const complete =
            answered === category.items.length;

        return `
        <section class="category card ${isOpen ? 'open' : ''}" id="cat-${escapeHtml(category.id)}">
            <div class="category-header" ${aktionAttr('click', 'toggleCategory', category.id)}>
                <div class="category-header-left">
                    <svg class="category-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span class="category-name">${escapeHtml(category.name)}</span>
                </div>
                <span class="category-count ${complete ? 'complete' : ''}">${answered} / ${category.items.length}</span>
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

    return `
    <div class="item ${isMangel ? 'is-mangel' : ''}" data-item-id="${escapeHtml(item.id)}">
        <div class="item-row">
            <div class="item-text"><span class="item-id">${item.id}</span>${item.text}</div>
            <div class="item-actions">
                <button class="rating-btn ok ${rating === 'ok' ? 'selected' : ''}" ${locked ? 'disabled' : ''} ${aktionAttr('click', 'setRating', item.id, 'ok')} aria-label="In Ordnung">OK</button>
                <button class="rating-btn mangel ${rating === 'mangel' ? 'selected' : ''}" ${locked ? 'disabled' : ''} ${aktionAttr('click', 'setRating', item.id, 'mangel')} aria-label="Mangel">!</button>
                <button class="rating-btn na ${rating === 'na' ? 'selected' : ''}" ${locked ? 'disabled' : ''} ${aktionAttr('click', 'setRating', item.id, 'na')} aria-label="Nicht vorhanden">N.V.</button>
            </div>
        </div>
        ${isMangel ? `
        <div class="item-detail">
            ${vorMassnahme ? `<div class="vorbegehung-hinweis">↻ ${escapeHtml(vorbegehungHinweis(vorMassnahme))} – bitte prüfen; ist der Mangel behoben, auf „OK“ setzen.</div>` : ''}
            <label for="comment-${escapeHtml(item.id)}">Beschreibung des Mangels</label>
            <textarea id="comment-${escapeHtml(item.id)}" placeholder="Was wurde festgestellt? (optional)" ${aktionAttr('input', 'updateComment', item.id, '$value')}>${escapeHtml(comment)}</textarea>
            <div class="measure-preview">
                <span class="label">Empfohlene Maßnahme</span>
                ${getMeasureText(item.id)}
            </div>
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

function importJson(file) {
    const reader =
        new FileReader();

    reader.onload = (e) => {

        try {

            const data =
                JSON.parse(
                    e.target.result
                );

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
                    data.notApplicable || {}
            };

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
    const ci = (record && record.companyInfo) || {};
    const offen = ((record && record.measures) || []).filter(m => m && m.status !== 'erledigt').length;
    const text = 'Wiederholungsbegehung für Markt ' + (ci.marktnummer || '–') +
        ' anlegen?\n\nBetriebsdaten werden übernommen, das Datum wird auf heute gesetzt. ' +
        (offen ? offen + ' nicht erledigte Maßnahme(n) der Begehung vom ' + (ci.datum ? formatDate(ci.datum) : '–') + ' werden als Mangel vorbelegt.' : 'Die Vorbegehung hat keine offenen Maßnahmen.') +
        '\n\nDer aktuell laufende, noch nicht archivierte Bearbeitungsstand auf diesem Gerät wird dabei ersetzt. ' + (quelle === 'team' ? '' : 'Archivierte Begehungen bleiben unverändert.');
    if (!confirm(text)) return false;
    const ergebnis = buildFollowUpState(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ergebnis.state));
    if (typeof deleteAllPhotos === 'function') {
        try { await deleteAllPhotos(); } catch (e) { console.error('Fotos konnten nicht geleert werden:', e); }
    }
    return ergebnis;
}

async function archiveCurrentAudit() {
    if (!confirm('Aktuelle Begehung jetzt archivieren? Die laufende Begehung bleibt zusätzlich unverändert bestehen, bis Sie „Zurücksetzen“ nutzen.')) return;
    await archiviereAktuelleBegehung();
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
            record.notApplicable || {}
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
            record.notApplicable || {}
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

function resetAll() {
    if (!confirm('Wirklich alle Eingaben zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) return;

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
            btnShareJson.addEventListener('click', shareJson);
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