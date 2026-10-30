// ==========================================================================
// ASiC Handel — Team-Auswertung (auswertung-team.html)
// ==========================================================================
//
// Wertet alle im Team-Archiv (Server) gefundenen Begehungen gemeinsam aus,
// unabhaengig davon, wer sie gespeichert hat. Nutzt dieselbe gemeinsame
// Berechnungslogik wie die normale Auswertungsseite (js/auswertung-logik.js),
// laedt die Daten aber vom Server statt aus dem lokalen Archiv.
//
// list.php liefert nur Metadaten (PLZ/Ort, Datum, Marktnummer) - fuer eine
// echte Auswertung werden die vollstaendigen Bewertungen benoetigt, daher
// wird hier fuer JEDE gefundene Datei fetchServerRecord() aufgerufen.
// Einzelne fehlgeschlagene Dateien werden uebersprungen (Promise.allSettled),
// statt die gesamte Auswertung an einer einzelnen defekten Datei scheitern
// zu lassen.

let teamAuswertungAlleDaten = [];
let teamZeitraumMonate = null;
let teamMarktFilter = 'alle';
let teamAuffaelligModus = 'durchschnitt';

// ===== Ladestatus-Anzeige (ab Rev. 1.53) =====
// Zeigt oberhalb der Filter, ob das Team-Archiv gerade geladen wird
// (Spinner + "x von y Begehungen" + Balken), fertig ist, nur teilweise
// geladen werden konnte oder ein Fehler aufgetreten ist. Waehrend des
// Ladens sind Filter und Export-Knoepfe gesperrt, damit nicht mit halb
// geladenen Daten ausgewertet oder exportiert wird.

const TEAM_STEUER_IDS = [
    'team-zeitraum-filter', 'team-markt-filter', 'team-auffaellig-modus-filter',
    'team-btn-export-csv', 'team-btn-share-csv',
    'team-btn-export-auswertung-pdf', 'team-btn-share-auswertung-pdf'
];
let teamLaedtGerade = false;

function setzeTeamSteuerungGesperrt(gesperrt) {
    TEAM_STEUER_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = gesperrt;
    });
}

// zustand: 'laden' | 'fertig' | 'warnung' | 'fehler'
// fortschritt: Zahl 0..1 fuer den Balken (nur beim Laden sichtbar)
function setzeTeamLadeStatus(zustand, titel, detail, fortschritt) {
    const box = document.getElementById('team-lade-status');
    if (!box) return;
    box.classList.remove('is-laden', 'is-fertig', 'is-warnung', 'is-fehler');
    box.classList.add('is-' + zustand);
    const titelEl = document.getElementById('team-lade-titel');
    const detailEl = document.getElementById('team-lade-detail');
    const balkenEl = document.getElementById('team-lade-balken');
    if (titelEl) titelEl.textContent = titel;
    if (detailEl) detailEl.textContent = detail || '';
    if (balkenEl) balkenEl.style.width = Math.round(Math.max(0, Math.min(1, fortschritt || 0)) * 100) + '%';

    const btn = document.getElementById('team-btn-neu-laden');
    if (btn) {
        btn.hidden = zustand === 'laden';
        btn.textContent = zustand === 'fehler' ? '↻ Erneut versuchen' : '↻ Neu laden';
    }
}

function teamUhrzeitJetzt() {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function teamBegehungenText(n) {
    return n + ' Begehung' + (n === 1 ? '' : 'en');
}

async function ladeTeamAuswertungDaten() {
    if (teamLaedtGerade) return;
    teamLaedtGerade = true;
    setzeTeamSteuerungGesperrt(true);

    const containerIds = ['team-kategorien-content', 'team-maerkte-content', 'team-verlauf-content'];
    const zeigeInAllen = (html) => containerIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });
    const infoEl = document.getElementById('team-anzahl-info');
    const startZeit = Date.now();

    try {
        zeigeInAllen('<p class="auswertung-empty">Lade Team-Daten vom Server …</p>');
        if (infoEl) infoEl.textContent = 'Lade Team-Archiv …';
        setzeTeamLadeStatus('laden', 'Team-Archiv wird geladen …', 'Dateiliste wird vom Server abgerufen', 0);

        if (window.location.hostname.endsWith('.github.io') && !getNasBaseUrl()) {
            zeigeInAllen('<p class="auswertung-empty">Team-Auswertung ist hier nicht verfügbar. Bitte über die Server-Adresse aufrufen (siehe „Einstellungen").</p>');
            if (infoEl) infoEl.textContent = 'Nicht verfügbar';
            setzeTeamLadeStatus('fehler', 'Team-Archiv nicht verfügbar', 'Keine Server-Adresse eingetragen – bitte unter „Einstellungen“ hinterlegen oder die App über die Server-Adresse aufrufen.');
            return;
        }

        let fileList;
        try {
            fileList = await getServerFiles();
        } catch (err) {
            console.error('Team-Archiv-Liste konnte nicht geladen werden:', err);
            const grund = err && err.message ? err.message : 'unbekannter Fehler';
            zeigeInAllen('<p style="color:var(--mangel);">Team-Archiv konnte nicht geladen werden: ' + escapeHtml(grund) + '</p>');
            if (infoEl) infoEl.textContent = 'Fehler beim Laden';
            setzeTeamLadeStatus('fehler', 'Team-Archiv konnte nicht geladen werden',
                grund + ' – Server erreichbar? Zugriffsschlüssel unter „Einstellungen“ korrekt?');
            return;
        }

        // Eigene Fassungen (ab 1.54-9) derselben Begehung nur einmal zaehlen:
        // je Markt und Datum gilt die zuletzt gespeicherte Fassung.
        fileList = nurNeuesteFassung(fileList);

        if (fileList.length === 0) {
            teamAuswertungAlleDaten = [];
            zeigeInAllen('<p class="auswertung-empty">Noch keine Begehung im Team-Archiv.</p>');
            if (infoEl) infoEl.textContent = '0 Begehungen im Team-Archiv';
            setzeTeamLadeStatus('fertig', 'Team-Archiv geladen', 'Noch keine Begehung im Team-Archiv · Stand ' + teamUhrzeitJetzt() + ' Uhr');
            return;
        }

        // Alle Dateien weiterhin parallel laden (so schnell wie bisher),
        // aber jede fertige Datei zaehlt den Fortschritt hoch.
        const gesamt = fileList.length;
        let erledigt = 0;
        const zeigeFortschritt = () => {
            setzeTeamLadeStatus('laden', 'Team-Archiv wird geladen …',
                erledigt + ' von ' + teamBegehungenText(gesamt) + ' geladen', erledigt / gesamt);
            if (infoEl) infoEl.textContent = 'Lade Team-Archiv … ' + erledigt + '/' + gesamt;
        };
        zeigeFortschritt();

        const ergebnisse = await Promise.allSettled(fileList.map(f =>
            fetchServerRecord(f.fileName).finally(() => { erledigt++; zeigeFortschritt(); })
        ));
        teamAuswertungAlleDaten = ergebnisse.filter(r => r.status === 'fulfilled').map(r => r.value);
        const fehlgeschlagen = ergebnisse.length - teamAuswertungAlleDaten.length;
        const dauer = ((Date.now() - startZeit) / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 });

        if (infoEl) {
            infoEl.textContent = teamBegehungenText(teamAuswertungAlleDaten.length) + ' im Team-Archiv';
        }

        populateMarktFilter(teamAuswertungAlleDaten, 'team-markt-filter');
        // nach "Neu laden" kann ein zuvor gewaehlter Markt fehlen - Variable angleichen
        const marktSelect = document.getElementById('team-markt-filter');
        if (marktSelect) teamMarktFilter = marktSelect.value || 'alle';
        renderTeamAuswertungAlle();

        if (teamAuswertungAlleDaten.length === 0) {
            setzeTeamLadeStatus('fehler', 'Keine Begehung konnte geladen werden',
                'Alle ' + gesamt + ' Dateien sind fehlgeschlagen – bitte erneut versuchen.');
        } else if (fehlgeschlagen > 0) {
            showToast(fehlgeschlagen + ' von ' + ergebnisse.length + ' Team-Dateien konnten nicht geladen werden', 'error');
            setzeTeamLadeStatus('warnung', 'Team-Archiv teilweise geladen',
                teamAuswertungAlleDaten.length + ' von ' + teamBegehungenText(gesamt) + ' geladen, ' + fehlgeschlagen +
                ' übersprungen · Stand ' + teamUhrzeitJetzt() + ' Uhr');
        } else {
            setzeTeamLadeStatus('fertig', 'Team-Archiv vollständig geladen',
                teamBegehungenText(gesamt) + ' in ' + dauer + ' s · Stand ' + teamUhrzeitJetzt() + ' Uhr');
        }
    } catch (err) {
        // Unerwarteter Fehler (z. B. beim Auswerten) - Anzeige darf nie im
        // Zustand "wird geladen" haengen bleiben.
        console.error('Team-Auswertung fehlgeschlagen:', err);
        setzeTeamLadeStatus('fehler', 'Auswertung fehlgeschlagen', err && err.message ? err.message : 'unbekannter Fehler');
    } finally {
        teamLaedtGerade = false;
        setzeTeamSteuerungGesperrt(false);
    }
}

function teamGefilterteDaten() {
    let daten = filterNachZeitraum(teamAuswertungAlleDaten, teamZeitraumMonate);
    if (teamMarktFilter !== 'alle') {
        daten = daten.filter(r => (r.companyInfo && r.companyInfo.marktnummer || '').trim() === teamMarktFilter);
    }
    return daten;
}

function renderTeamAuswertungAlle() {
    const daten = teamGefilterteDaten();
    document.getElementById('team-gesamtverteilung-content').innerHTML = renderGesamtverteilungHtml(daten);
    document.getElementById('team-gesamttrend-content').innerHTML = renderGesamtTrendHtml(daten);
    document.getElementById('team-kategorien-content').innerHTML = renderKategorienSchwachstellenHtml(daten);
    document.getElementById('team-maerkte-content').innerHTML = renderAuffaelligeMaerkteHtml(daten, teamAuffaelligModus);
    document.getElementById('team-verlauf-content').innerHTML = renderVerlaufProMarktHtml(daten);
}

document.addEventListener('DOMContentLoaded', () => {
    ladeTeamAuswertungDaten();

    const btnNeuLaden = document.getElementById('team-btn-neu-laden');
    if (btnNeuLaden) btnNeuLaden.addEventListener('click', ladeTeamAuswertungDaten);

    const zeitraumSelect = document.getElementById('team-zeitraum-filter');
    if (zeitraumSelect) {
        zeitraumSelect.addEventListener('change', () => {
            const val = zeitraumSelect.value;
            teamZeitraumMonate = val === 'alle' ? null : parseInt(val, 10);
            renderTeamAuswertungAlle();
        });
    }

    const marktSelect = document.getElementById('team-markt-filter');
    if (marktSelect) {
        marktSelect.addEventListener('change', () => {
            teamMarktFilter = marktSelect.value;
            renderTeamAuswertungAlle();
        });
    }

    const auffaelligSelect = document.getElementById('team-auffaellig-modus-filter');
    if (auffaelligSelect) {
        auffaelligSelect.addEventListener('change', () => {
            teamAuffaelligModus = auffaelligSelect.value;
            renderTeamAuswertungAlle();
        });
    }

    const btnCsv = document.getElementById('team-btn-export-csv');
    if (btnCsv) btnCsv.addEventListener('click', exportTeamAuswertungCsv);
    const btnShareCsv = document.getElementById('team-btn-share-csv');
    if (btnShareCsv) btnShareCsv.addEventListener('click', shareTeamAuswertungCsv);

    const btnPdf = document.getElementById('team-btn-export-auswertung-pdf');
    if (btnPdf) btnPdf.addEventListener('click', exportTeamAuswertungPdf);
    const btnSharePdf = document.getElementById('team-btn-share-auswertung-pdf');
    if (btnSharePdf) btnSharePdf.addEventListener('click', shareTeamAuswertungPdf);
});

// ===== CSV- und PDF-Export ueber das Team-Archiv =====
// Nutzt dieselben Bau-Funktionen wie die lokale Auswertungsseite
// (js/auswertung.js, dort um einen optionalen Daten-Parameter erweitert),
// nur mit den bereits vom Server geladenen Team-Daten statt dem lokalen
// Archiv - so existiert die eigentliche CSV-/PDF-Erzeugung weiterhin nur
// EINMAL im Code.

async function exportTeamAuswertungCsv() {
    const rows = await ladeAuswertungCsvZeilen('Exportieren', teamGefilterteDaten());
    if (!rows) return;

    const blob = csvRowsToBlob(rows);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ASiC_Handel_Team-Auswertung_' + todayIsoLocal() + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSV-Datei wird heruntergeladen');
}

async function shareTeamAuswertungCsv() {
    const rows = await ladeAuswertungCsvZeilen('Teilen', teamGefilterteDaten());
    if (!rows) return;

    const blob = csvRowsToBlob(rows);
    const filename = 'ASiC_Handel_Team-Auswertung_' + todayIsoLocal() + '.csv';
    const text = 'Anbei der aktuelle Rohdaten-Export (CSV) aller Begehungen aus dem Team-Archiv von ASiC Handel.';

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'text/csv' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'ASiC Handel – Team-Rohdaten-Export', text: teilenText('ASiC Handel – Team-Rohdaten-Export', text) });
                    showToast('CSV geteilt');
                    return;
                } catch (err) {
                    if (err && err.name === 'AbortError') return;
                    console.error('Teilen fehlgeschlagen, falle auf Download zurück:', err);
                }
            }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('CSV-Datei wird heruntergeladen');
    } catch (err) {
        console.error('CSV-Teilen fehlgeschlagen:', err);
        showToast('CSV-Teilen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function teamAuswertungPdfFilename() {
    return 'ASiC_Handel_Team-Gesamtauswertung_' + todayIsoLocal() + '.pdf';
}

async function exportTeamAuswertungPdf() {
    try {
        showToast('PDF wird erzeugt…');
        const doc = await buildAuswertungPdf(teamGefilterteDaten(), 'Team-Gesamtauswertung', teamZeitraumMonate, teamAuffaelligModus);
        doc.save(teamAuswertungPdfFilename());
        showToast('PDF heruntergeladen');
    } catch (err) {
        console.error('PDF-Export fehlgeschlagen:', err);
        showToast('PDF-Export fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

async function shareTeamAuswertungPdf() {
    let doc;
    try {
        doc = await buildAuswertungPdf(teamGefilterteDaten(), 'Team-Gesamtauswertung', teamZeitraumMonate, teamAuffaelligModus);
    } catch (err) {
        console.error('PDF-Erzeugung fehlgeschlagen:', err);
        showToast('PDF-Erzeugung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
        return;
    }

    const filename = teamAuswertungPdfFilename();
    const blob = doc.output('blob');
    const zeitraumText = teamZeitraumMonate === null ? 'den gesamten bisherigen Zeitraum' : `die letzten ${teamZeitraumMonate} Monate`;
    const text = `Anbei die Team-Gesamtauswertung (Gesamtverteilung, Kategorien-Schwachstellen, auffällige Märkte, Marktverlauf) für ${zeitraumText}.`;

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'ASiC Handel – Team-Gesamtauswertung', text: teilenText('ASiC Handel – Team-Gesamtauswertung', text) });
                showToast('PDF geteilt');
                return;
            }
        }
        doc.save(filename);
    } catch (err) {
        if (err && err.name === 'AbortError') return;
        console.error('PDF-Teilen fehlgeschlagen, falle auf Download zurück:', err);
        doc.save(filename);
    }
}
