// ==========================================================================
// ASiC Handel — Team-Auswertung (auswertung-team.html)
// ==========================================================================
//
// Wertet alle im Team-Archiv (NAS) gefundenen Begehungen gemeinsam aus,
// unabhaengig davon, wer sie gespeichert hat. Nutzt dieselbe gemeinsame
// Berechnungslogik wie die normale Auswertungsseite (js/auswertung-logik.js),
// laedt die Daten aber vom NAS statt aus dem lokalen Archiv.
//
// list.php liefert nur Metadaten (PLZ/Ort, Datum, Marktnummer) - fuer eine
// echte Auswertung werden die vollstaendigen Bewertungen benoetigt, daher
// wird hier fuer JEDE gefundene Datei fetchSynologyRecord() aufgerufen.
// Einzelne fehlgeschlagene Dateien werden uebersprungen (Promise.allSettled),
// statt die gesamte Auswertung an einer einzelnen defekten Datei scheitern
// zu lassen.

let teamAuswertungAlleDaten = [];
let teamZeitraumMonate = null;

async function ladeTeamAuswertungDaten() {
    const containerIds = ['team-kategorien-content', 'team-maerkte-content', 'team-verlauf-content'];
    const zeigeInAllen = (html) => containerIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });

    zeigeInAllen('<p class="auswertung-empty">Lade Team-Daten vom NAS …</p>');
    const infoEl = document.getElementById('team-anzahl-info');
    if (infoEl) infoEl.textContent = 'Lade Team-Archiv …';

    if (window.location.hostname.endsWith('.github.io') && !getNasBaseUrl()) {
        zeigeInAllen('<p class="auswertung-empty">Team-Auswertung ist hier nicht verfügbar. Bitte über die Synology-Adresse aufrufen (siehe „Einstellungen").</p>');
        if (infoEl) infoEl.textContent = 'Nicht verfügbar';
        return;
    }

    let fileList;
    try {
        fileList = await getSynologyFiles();
    } catch (err) {
        console.error('Team-Archiv-Liste konnte nicht geladen werden:', err);
        zeigeInAllen('<p style="color:var(--mangel);">Team-Archiv konnte nicht geladen werden: ' + (err && err.message ? err.message : 'unbekannter Fehler') + '</p>');
        if (infoEl) infoEl.textContent = 'Fehler beim Laden';
        return;
    }

    if (fileList.length === 0) {
        zeigeInAllen('<p class="auswertung-empty">Noch keine Begehung im Team-Archiv.</p>');
        if (infoEl) infoEl.textContent = '0 Begehungen im Team-Archiv';
        return;
    }

    const ergebnisse = await Promise.allSettled(fileList.map(f => fetchSynologyRecord(f.fileName)));
    teamAuswertungAlleDaten = ergebnisse.filter(r => r.status === 'fulfilled').map(r => r.value);
    const fehlgeschlagen = ergebnisse.length - teamAuswertungAlleDaten.length;

    if (infoEl) {
        infoEl.textContent = teamAuswertungAlleDaten.length + ' Begehung' + (teamAuswertungAlleDaten.length === 1 ? '' : 'en') + ' im Team-Archiv';
    }

    if (fehlgeschlagen > 0) {
        showToast(fehlgeschlagen + ' von ' + ergebnisse.length + ' Team-Dateien konnten nicht geladen werden', 'error');
    }

    renderTeamAuswertungAlle();
}

function teamGefilterteDaten() {
    return filterNachZeitraum(teamAuswertungAlleDaten, teamZeitraumMonate);
}

function renderTeamAuswertungAlle() {
    const daten = teamGefilterteDaten();
    document.getElementById('team-gesamtverteilung-content').innerHTML = renderGesamtverteilungHtml(daten);
    document.getElementById('team-kategorien-content').innerHTML = renderKategorienSchwachstellenHtml(daten);
    document.getElementById('team-maerkte-content').innerHTML = renderAuffaelligeMaerkteHtml(daten);
    document.getElementById('team-verlauf-content').innerHTML = renderVerlaufProMarktHtml(daten);
}

document.addEventListener('DOMContentLoaded', () => {
    ladeTeamAuswertungDaten();

    const zeitraumSelect = document.getElementById('team-zeitraum-filter');
    if (zeitraumSelect) {
        zeitraumSelect.addEventListener('change', () => {
            const val = zeitraumSelect.value;
            teamZeitraumMonate = val === 'alle' ? null : parseInt(val, 10);
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
// nur mit den bereits vom NAS geladenen Team-Daten statt dem lokalen
// Archiv - so existiert die eigentliche CSV-/PDF-Erzeugung weiterhin nur
// EINMAL im Code.

async function exportTeamAuswertungCsv() {
    const rows = await ladeAuswertungCsvZeilen('Exportieren', teamGefilterteDaten());
    if (!rows) return;

    const blob = csvRowsToBlob(rows);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ASiC_Handel_Team-Auswertung_' + new Date().toISOString().split('T')[0] + '.csv';
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
    const filename = 'ASiC_Handel_Team-Auswertung_' + new Date().toISOString().split('T')[0] + '.csv';
    const text = 'Anbei der aktuelle Rohdaten-Export (CSV) aller Begehungen aus dem Team-Archiv von ASiC Handel.';

    try {
        if (navigator.canShare && typeof File !== 'undefined') {
            const file = new File([blob], filename, { type: 'text/csv' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'ASiC Handel – Team-Rohdaten-Export', text });
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
    return 'ASiC_Handel_Team-Gesamtauswertung_' + new Date().toISOString().split('T')[0] + '.pdf';
}

async function exportTeamAuswertungPdf() {
    try {
        showToast('PDF wird erzeugt…');
        const doc = await buildAuswertungPdf(teamGefilterteDaten(), 'Team-Gesamtauswertung', teamZeitraumMonate);
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
        doc = await buildAuswertungPdf(teamGefilterteDaten(), 'Team-Gesamtauswertung', teamZeitraumMonate);
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
                await navigator.share({ files: [file], title: 'ASiC Handel – Team-Gesamtauswertung', text });
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
