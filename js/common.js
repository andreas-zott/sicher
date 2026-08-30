// ==========================================================================
// Arbeitssicherheit Portal — gemeinsame Logik
// ==========================================================================
// Dark Mode, Fusszeile (Jahr/Version) und Service-Worker-Registrierung waren
// zuvor auf jeder Seite einzeln kopiert - u.a. mit ZWEI unterschiedlichen
// Service-Workern (sw.js / service-worker.js), die sich gegenseitig
// ueberschrieben haben. Jetzt: eine Quelle, ein Service Worker.

const APP_VERSION = '2.1.0';

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        toggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sicher/service-worker.js')
            .catch(err => console.warn('Service Worker konnte nicht registriert werden:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFooter();
    initServiceWorker();
});
