// ==========================================================================
// ASiC Handel — Zugangs-Hürde
// ==========================================================================
// WICHTIG: Dies ist KEIN echter Zugriffsschutz! Diese App läuft als reine
// statische Webseite ohne eigenen Server (GitHub Pages) - der Zugangscode
// steht für jeden, der sich den Quelltext ansieht, offen sichtbar im Code.
// Diese Abfrage soll ausschließlich zufälliges Entdecken/Herumstöbern durch
// Unbeteiligte verhindern, NICHT gezielten, unbefugten Zugriff abwehren.
//
// Zugangscode hier aendern:
const ACCESS_CODE = 'Sifa-Rewe-Dortmund';

const ACCESS_STORAGE_KEY = 'asicHandelAccessGranted';

(function () {
    if (localStorage.getItem(ACCESS_STORAGE_KEY) === 'true') return;
    document.documentElement.classList.add('access-locked');

    document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.createElement('div');
        overlay.className = 'access-gate-overlay';
        overlay.innerHTML =
            '<div class="access-gate-box">' +
                '<div class="access-gate-brand">ASiC Handel</div>' +
                '<p class="access-gate-text">Bitte Zugangscode eingeben</p>' +
                '<input type="password" id="access-gate-input" class="access-gate-input" autocomplete="off" placeholder="Zugangscode">' +
                '<button class="btn btn-primary access-gate-btn" id="access-gate-btn">Weiter</button>' +
                '<p class="access-gate-error" id="access-gate-error" style="display:none;">Falscher Code, bitte erneut versuchen.</p>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = document.getElementById('access-gate-input');
        const btn = document.getElementById('access-gate-btn');
        const errorMsg = document.getElementById('access-gate-error');

        function tryUnlock() {
            if (input.value === ACCESS_CODE) {
                localStorage.setItem(ACCESS_STORAGE_KEY, 'true');
                document.documentElement.classList.remove('access-locked');
                overlay.remove();
            } else {
                errorMsg.style.display = 'block';
                input.value = '';
                input.focus();
            }
        }

        btn.addEventListener('click', tryUnlock);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
        input.focus();
    });
})();
