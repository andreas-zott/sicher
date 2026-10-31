// ASiC Handel – Selbstpruefung der Team-Auswertung.
// Ab Rev. 1.54-5 aus auswertung-team.html ausgelagert (Content-Security-Policy).
// Selbstpruefung (ab Rev. 1.53): Fehlt die Ladestatus-Funktion, laeuft noch
// eine veraltete js/auswertung-team.js aus dem Zwischenspeicher - dann
// klar darauf hinweisen statt "wird geladen" stehen zu lassen.
if (typeof setzeTeamLadeStatus !== 'function') {
    (function () {
        var box = document.getElementById('team-lade-status');
        if (!box) return;
        box.className = 'lade-status is-warnung';
        document.getElementById('team-lade-titel').textContent = 'Veraltete Programmdatei im Zwischenspeicher';
        document.getElementById('team-lade-detail').textContent = 'Die Daten werden trotzdem geladen. Für die neue Ladeanzeige die Seite bitte einmal neu laden.';
    })();
}
