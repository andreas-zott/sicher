// ASiC Handel 2 — gemeinsame Sicherung des Markts in der Begehung
// Beschriftet "Auf Server speichern" als Markt-Speicherung (Begehung + GBO)
// und ergänzt im Datei-Menü die Gesamtsicherung als Datei. Das eigentliche
// Speichern übernimmt saveStateToServer() in js/app.js (mit Sicherungsstand
// und Rückmeldung) – hier wird bewusst kein zweiter Klick-Handler gesetzt,
// sonst würde doppelt gespeichert.
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const saveBtn = document.getElementById('btn-save-nas');
        if (saveBtn) saveBtn.textContent = '☁️ Markt auf Server speichern';
        const menu = saveBtn ? saveBtn.parentElement : null;
        if (menu && !document.getElementById('btn-market-export')) {
            const b = document.createElement('button');
            b.className = 'menu-item';
            b.id = 'btn-market-export';
            b.type = 'button';
            b.textContent = '💾 Gesamtsicherung Markt';
            b.addEventListener('click', () => {
                if (typeof saveState === 'function') saveState();
                ASiCMarket.download();
            });
            saveBtn.insertAdjacentElement('afterend', b);
        }
    });
})();
