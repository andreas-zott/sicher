// ASiC Handel 2 — gemeinsame Sicherung des Markts in der Begehung
// Beschriftet "Auf Server speichern" als Markt-Speicherung (Begehung + GBO)
// und ergänzt im Datei-Menü unter "JSON-Datei ›" die Gesamtsicherung als
// Datei. Das eigentliche Speichern übernimmt saveStateToServer() in
// js/app.js (mit Sicherungsstand, Rückfrage bei neuerem Stand und
// Rückmeldung) – hier wird bewusst kein zweiter Klick-Handler gesetzt,
// sonst würde doppelt gespeichert.
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const saveBtn = document.getElementById('btn-save-nas');
        if (saveBtn) {
            const text = saveBtn.querySelector('.menu-item-text');
            const sub = saveBtn.querySelector('.menu-item-sub');
            if (text) text.textContent = 'Markt auf Server speichern'; else saveBtn.textContent = '☁️ Markt auf Server speichern';
            if (sub) sub.textContent = 'Begehung und GBO fürs Team sichern';
        }
        const ziel = document.querySelector('#file-menu-panel .menu-ebene[data-ebene="json"]');
        if (ziel && !document.getElementById('btn-market-export')) {
            const b = document.createElement('button');
            b.className = 'menu-item menu-item-zweizeilig';
            b.id = 'btn-market-export';
            b.type = 'button';
            b.innerHTML = '<span>💾</span><span><span class="menu-item-text">Gesamtsicherung Markt</span>' +
                '<span class="menu-item-sub">Begehung und GBO als Datei</span></span>';
            b.addEventListener('click', () => {
                if (typeof saveState === 'function') saveState();
                ASiCMarket.download();
            });
            const nachExport = document.getElementById('btn-json-export');
            if (nachExport && nachExport.parentElement === ziel) nachExport.insertAdjacentElement('afterend', b);
            else ziel.appendChild(b);
        }
    });
})();
