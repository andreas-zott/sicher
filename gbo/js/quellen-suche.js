// ASiC Handel – Suche in der Quellenübersicht (eigene Datei wegen der
// Content-Security-Policy: keine eingebetteten Skripte).
(function () {
    const feld = document.getElementById('quellenSuche');
    const anzeige = document.getElementById('quellenTreffer');
    const zeilen = Array.from(document.querySelectorAll('.q-table tbody tr'));
    const gruppen = Array.from(document.querySelectorAll('.q-gruppe'));
    function filtern() {
        const q = feld.value.trim().toLowerCase();
        let n = 0;
        zeilen.forEach(tr => {
            const treffer = !q || tr.textContent.toLowerCase().includes(q);
            tr.hidden = !treffer;
            if (treffer) n++;
        });
        gruppen.forEach(g => { g.hidden = !g.querySelector('tbody tr:not([hidden])'); });
        anzeige.textContent = q ? n + ' Treffer' : '';
    }
    feld.addEventListener('input', filtern);
})();
