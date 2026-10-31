// ASiC Handel – aktuelles Jahr in Fußzeilen eintragen (eigene Datei wegen
// der Content-Security-Policy: keine eingebetteten Skripte).
document.querySelectorAll('.js-current-year, #gbo-current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
