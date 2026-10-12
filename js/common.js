// ==========================================================================
// Arbeitssicherheit Portal — gemeinsame Logik
// ==========================================================================
// Dark Mode, Fusszeile (Jahr/Version) und Service-Worker-Registrierung waren
// zuvor auf jeder Seite einzeln kopiert - u.a. mit ZWEI unterschiedlichen
// Service-Workern (sw.js / service-worker.js), die sich gegenseitig
// ueberschrieben haben. Jetzt: eine Quelle, ein Service Worker.

const APP_VERSION = '1.3.1';

// Dunklen Modus sofort setzen (common.js steht am Ende von <body>), damit die
// Seite nicht kurz hell aufblitzt. Standard: dunkel ("Leitstand").
(function sofortTheme() {
    let theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) {}
    if (theme !== 'light' && document.body) document.body.classList.add('dark');
})();

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const body = document.body;

    // Standard ist der dunkle "Leitstand"-Modus; hell nur, wenn ausdruecklich gewaehlt.
    let theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) {}
    if (theme !== 'light') {
        body.classList.add('dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        toggle.textContent = isDark ? '☀️' : '🌙';
        try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
}

function initFooter() {
    document.querySelectorAll('.app-footer-jahr').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    document.querySelectorAll('.app-footer-version').forEach(el => {
        el.textContent = 'Version ' + APP_VERSION;
    });
}

function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    // Hat ein NEUER Service Worker die Kontrolle uebernommen (Update), die
    // Seite einmal automatisch neu laden, damit sofort der neue Stand zu
    // sehen ist. Beim allerersten Besuch (noch kein Controller) nicht.
    const hatteController = !!navigator.serviceWorker.controller;
    let neuGeladen = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hatteController || neuGeladen) return;
        neuGeladen = true;
        window.location.reload();
    });

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sicher/service-worker.js', { updateViaCache: 'none' })
            .then(reg => reg.update())
            .catch(err => console.warn('Service Worker konnte nicht registriert werden:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFooter();
    initServiceWorker();
});
