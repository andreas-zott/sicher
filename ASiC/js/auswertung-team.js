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
});
