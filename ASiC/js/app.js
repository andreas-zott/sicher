// ==========================================================================
// BEGEHUNGSLISTE — Gemeinsame App-Logik (State, Checkliste, Betriebsdaten)
// Wird auf index.html UND massnahmen.html geladen — alle DOM-Zugriffe sind
// deshalb per Null-Check abgesichert, damit keine Seite die andere stoert.
// ==========================================================================

const STORAGE_KEY = 'begehungState';

// Revisionsstand der App/Checkliste (in Fusszeile und PDF sichtbar,
// bei inhaltlichen Aenderungen an Fragenkatalog/Massnahmen hochzaehlen)
const APP_REVISION = '1.17';
const APP_REVISION_DATE = '2026-08-26';

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
    setTimeout(() => toast.remove(), type === 'error' ? 6000 : 2600);
}

// ===== Vorgefertigter Mail-Text beim PDF-Versand =====
// Traegt automatisch Markt (aus "Firma / Markt") und den Namen des Pruefers ein.
// Wird von allen PDF-Varianten genutzt, mit leicht angepasstem Wortlaut je
// nachdem, was tatsaechlich mitgeschickt wird (mode: 'checkliste' |
// 'massnahmen' | 'fotos' | 'alle').
function buildShareEmailSubject(mode) {
    const markt = state.companyInfo.firma || '-';
    const zusatz = mode === 'massnahmen' ? 'Maßnahmenplan – '
        : mode === 'fotos' ? 'Fotodokumentation – '
        : '';
    return `${zusatz}Arbeitssicherheitsbegehung Markt ${markt}`;
}

function buildShareEmailText(mode) {
    const markt = state.companyInfo.firma || '-';
    const pruefer = state.companyInfo.pruefername ? state.companyInfo.pruefername + '\n' : '';

    const inhalt = mode === 'massnahmen'
        ? 'den Maßnahmenplan'
        : mode === 'fotos'
            ? 'die Fotodokumentation'
            : mode === 'alle'
                ? 'das vollständige Begehungsprotokoll inklusive Maßnahmenplan und Fotodokumentation'
                : 'das Begehungsprotokoll';

    return `Sehr geehrte Damen und Herren,\n\nim Rahmen der turnusmäßigen Arbeitssicherheitsbegehung übersende ich Ihnen anbei ${inhalt} des Marktes ${markt} zur sachlichen Prüfung.\n\nBitte prüfen Sie die dokumentierten Feststellungen und veranlassen Sie die Umsetzung der erforderlichen Maßnahmen.\n\nMit freundlichen Grüßen\n${pruefer}Fachkraft für Arbeitssicherheit (SiFa)`;
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

// ===== Synology-NAS-Speicherung (save.php / list.php / load.php) =====
// Setzt voraus, dass die App direkt ueber die Synology selbst (bzw. deren
// Tailscale-Adresse) aufgerufen wird - die drei PHP-Skripte muessen im
// selben Verzeichnis wie diese Seite liegen. Ueber eine andere Adresse
// (z. B. GitHub Pages) sind diese Endpunkte nicht erreichbar, da dort
// keine serverseitigen Skripte laufen koennen.

async function parseJsonResponse(res) {
    try {
        return await res.json();
    } catch (parseErr) {
        throw new Error('Ungültige Antwort vom NAS (kein gültiges JSON).');
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

async function saveStateToSynology() {
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
        showToast('Auf NAS gespeichert: ' + result.fileName);
    } catch (err) {
        console.error('NAS-Speichern fehlgeschlagen:', err);
        showToast('NAS-Speichern fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function getSynologyFiles() {
    const res = await fetch(nasUrl('list.php'), withNasAuthHeaders({ cache: 'no-store' }));
    const result = await parseJsonResponse(res);
    if (!res.ok || !result.ok) {
        throw new Error(result.message || `Fehler beim Abrufen der Dateiliste (HTTP ${res.status}).`);
    }
    return result.files || [];
}

// Wie loadStateFromSynology(), aendert aber NICHT den globalen state - gibt
// den geladenen Datensatz einfach zurueck. Wird fuer das Team-Archiv
// (verlauf.html) genutzt, um eine fremde, auf dem NAS gespeicherte Begehung
// anzusehen/zu exportieren, ohne die gerade laufende eigene Begehung zu
// ueberschreiben.
async function fetchSynologyRecord(filename) {
    const res = await fetch(nasUrl('load.php') + '?filename=' + encodeURIComponent(filename), withNasAuthHeaders({ cache: 'no-store' }));
    const result = await parseJsonResponse(res);
    if (!res.ok) {
        throw new Error((result && result.message) || `Fehler beim Laden (HTTP ${res.status}).`);
    }
    return result;
}

async function loadStateFromSynology(filename) {
    const res = await fetch(nasUrl('load.php') + '?filename=' + encodeURIComponent(filename), withNasAuthHeaders({ cache: 'no-store' }));
    const result = await parseJsonResponse(res);
    if (!res.ok) {
        throw new Error((result && result.message) || `Fehler beim Laden (HTTP ${res.status}).`);
    }

    // Defensiv mit defaultState() zusammenfuehren, aehnlich wie beim JSON-Import,
    // damit eine unvollstaendige/aeltere Datei die App nicht zum Absturz bringt.
    const leer = defaultState();
    state.companyInfo = Object.assign({}, leer.companyInfo, result.companyInfo || {});
    state.ratings = result.ratings || {};
    state.comments = result.comments || {};
    state.measures = result.measures || [];
    state.signatures = Object.assign({}, leer.signatures, result.signatures || {});
    state.notApplicable = result.notApplicable || {};

    saveState();
    if (typeof renderChecklist === 'function') renderChecklist();
    if (typeof initCompanyForm === 'function') initCompanyForm();
    if (typeof renderCompanyInfoStrip === 'function') renderCompanyInfoStrip();
    if (typeof renderMeasures === 'function') await renderMeasures();
    if (typeof restoreSignatures === 'function') restoreSignatures();

    showToast('Begehung vom NAS geladen: ' + filename);
}

// Einfacher Auswahl-Dialog: listet alle auf dem NAS gespeicherten Begehungen
// auf, per Klick wird die jeweilige geladen.
async function openSynologyLoadDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'access-gate-overlay';
    overlay.innerHTML = `
        <div class="access-gate-box" style="max-width:420px; text-align:left;">
            <div class="access-gate-brand" style="margin-bottom:0.75rem;">Vom NAS laden</div>
            <div id="nas-load-list">
                <p class="auswertung-empty">Lade Dateiliste …</p>
            </div>
            <button class="btn btn-secondary btn-small" id="nas-load-cancel" style="width:100%; margin-top:1rem;">Abbrechen</button>
        </div>`;
    document.body.appendChild(overlay);

    document.getElementById('nas-load-cancel').addEventListener('click', () => overlay.remove());

    const listEl = document.getElementById('nas-load-list');
    try {
        const files = await getSynologyFiles();
        if (files.length === 0) {
            listEl.innerHTML = '<p class="auswertung-empty">Noch keine Begehung auf dem NAS gespeichert.</p>';
            return;
        }
        listEl.innerHTML = files.map(f => `
            <button class="btn btn-secondary btn-small" style="width:100%; text-align:left; margin-bottom:0.5rem;" data-filename="${f.fileName}">
                ${f.datum || '?'} — ${f.firma || 'ohne Markt-Angabe'}${f.marktnummer ? ' (Nr. ' + f.marktnummer + ')' : ''}
            </button>`).join('');
        listEl.querySelectorAll('button[data-filename]').forEach(btn => {
            btn.addEventListener('click', async () => {
                overlay.remove();
                try {
                    await loadStateFromSynology(btn.dataset.filename);
                } catch (err) {
                    console.error('NAS-Laden fehlgeschlagen:', err);
                    showToast('NAS-Laden fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
                }
            });
        });
    } catch (err) {
        console.error('Dateiliste konnte nicht geladen werden:', err);
        listEl.innerHTML = `<p style="color:var(--mangel);">Dateiliste konnte nicht geladen werden: ${err && err.message ? err.message : 'unbekannter Fehler'}</p>`;
    }
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
        `Firma/Markt: ${ci.firma || '-'}    Standort: ${ci.standort || '-'}    Datum: ${ci.datum ? formatDate(ci.datum) : '-'}`,
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
        ['Firma / Markt', ci.firma || '-'],
        ['Marktnummer', ci.marktnummer || '-'],
        ['Standort', ci.standort || '-'],
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
    const erstellt = new Date().toISOString().split('T')[0];
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
    const firma = (state.companyInfo.firma || 'markt')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        new Date().toISOString().split('T')[0];

    return `Fotodokumentation_${firma}_${datum}.pdf`;
}

function checklistPdfFilename() {
    const firma = (state.companyInfo.firma || 'markt')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        new Date().toISOString().split('T')[0];

    return `Checkliste_${firma}_${datum}.pdf`;
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
    const firma = (state.companyInfo.firma || 'begehung')
        .replace(/[^a-z0-9äöüß]+/gi, '-');

    const datum =
        state.companyInfo.datum ||
        new Date().toISOString().split('T')[0];

    return `Massnahmenplan_${firma}_${datum}.pdf`;
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
                found
                    ? `${index + 1}. [${measure.itemId}] ${found.item.text}`
                    : `${index + 1}. Manuell erfasste Maßnahme`;

            let photos = [];

            try {
                photos =
                    await getPhotosForMeasure(
                        measure.id
                    );
            } catch (e) {
                photos = [];
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

        const photos =
            await getUnlinkedPhotos();

        await renderFotosSection(
            doc,
            y,
            margin,
            contentWidth,
            pageHeight,
            photos
        );
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
        'firma',
        'marktnummer',
        'standort',
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
        'info-firma':
            state.companyInfo.firma,

        'info-marktnummer':
            state.companyInfo.marktnummer,

        'info-standort':
            state.companyInfo.standort,

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
        'Keine CO2-Kühleinrichtungen im Markt vorhanden'
};

// ===== Checkliste rendern (index.html) =====
// buildChecklistHtml() erzeugt das HTML separat, damit es auch fuer den
// Druck-Container auf der Maßnahmen-Seite wiederverwendet werden kann.
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
    const container =
        document.getElementById(
            'checklist-container'
        );

    if (!container) return;

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

            responsible: '',
            dueDate: '',
            status: 'offen'
        });
    }

    renderChecklist();
    saveState();
}

function updateComment(itemId, value) {
    state.comments[itemId] =
        value;

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
    const datum = state.companyInfo.datum || new Date().toISOString().split('T')[0];
    const firma = (state.companyInfo.firma || 'begehung').replace(/[^a-z0-9äöüß]+/gi, '-');
    return `ASiC-Handel_${firma}_${datum}.json`;
}

function exportJson() {
    const blob = buildJsonBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = jsonExportFilename();
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON exportiert');
}

// Teilt die JSON-Datei ueber das native Teilen-Menue (z. B. direkt an
// die Mail-App) - fuer den Fall, dass kein Zugriff auf das NAS besteht und
// die Datei stattdessen manuell per Mail an eine Kollegin/einen Kollegen
// weitergegeben werden soll, die/der sie im NAS-Ordner ablegt (z. B. ueber
// "Vom NAS laden" ist das nicht moeglich, da das nur vorhandene NAS-Dateien
// abruft - das manuelle Ablegen selbst erfolgt ausserhalb der App, etwa
// per File Station).
async function shareJson() {
    const blob = buildJsonBlob();
    const filename = jsonExportFilename();
    const markt = state.companyInfo.firma || '-';
    const text = `Anbei die JSON-Datei der Begehung „${markt}" zur Weiterleitung/Ablage auf dem NAS, falls der direkte NAS-Zugriff gerade nicht möglich war.`;

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
        URL.revokeObjectURL(url);
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
                    data.measures || {},

                signatures: {
                    ...defaultState().signatures,
                    ...(data.signatures || {})
                },

                notApplicable:
                    data.notApplicable || {}
            };

            saveState();

            initCompanyForm();
            renderChecklist();
            renderCompanyInfoStrip();

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
async function archiveCurrentAudit() {
    if (!confirm('Aktuelle Begehung jetzt archivieren? Die laufende Begehung bleibt zusätzlich unverändert bestehen, bis Sie „Zurücksetzen“ nutzen.')) return;

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

            stats:
                computeStats(),

            photos:
                photos
        };

        await saveArchivedAudit(record);

        showToast(
            'Begehung archiviert'
        );

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
        // save.php/list.php/load.php gibt es nur auf der Synology selbst,
        // nicht auf GitHub Pages (dort laeuft kein PHP) - die beiden
        // NAS-Buttons dort erst gar nicht anzeigen, statt sie klickbar zu
        // lassen und erst danach eine Fehlermeldung zu zeigen. AUSNAHME:
        // Wenn unter "Einstellungen" eine externe Server-Basis-Adresse
        // hinterlegt wurde, kann das auch von GitHub Pages aus funktionieren
        // (sofern der Zielserver CORS fuer diese Adresse erlaubt).
        const laeuftAufGithubPages = window.location.hostname.endsWith('.github.io') && !getNasBaseUrl();

        if (btnSaveNas) {
            if (laeuftAufGithubPages) {
                btnSaveNas.style.display = 'none';
            } else {
                btnSaveNas.addEventListener('click', saveStateToSynology);
            }
        }
        if (btnLoadNas) {
            if (laeuftAufGithubPages) {
                btnLoadNas.style.display = 'none';
            } else {
                btnLoadNas.addEventListener('click', openSynologyLoadDialog);
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