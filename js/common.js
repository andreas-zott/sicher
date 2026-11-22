// ==========================================================================
// Arbeitssicherheit Portal — gemeinsame Logik
// ==========================================================================
// Dark Mode, Fusszeile (Jahr/Version) und Service-Worker-Registrierung waren
// zuvor auf jeder Seite einzeln kopiert - u.a. mit ZWEI unterschiedlichen
// Service-Workern (sw.js / service-worker.js), die sich gegenseitig
// ueberschrieben haben. Jetzt: eine Quelle, ein Service Worker.

const APP_VERSION = '1.4.6';   // gleich wie in service-worker.js und manifest.json

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
        // Relativer Pfad: funktioniert im Unterordner von GitHub Pages (/sicher/).
        navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' })
            .then(reg => reg.update())
            .catch(err => console.warn('Service Worker konnte nicht registriert werden:', err));
    });
}

// Ab 1.4.2: Anmeldung im Portal - in der Fusszeile anzeigen, wer angemeldet
// ist, mit Link zum Abmelden. Ohne Server (offline) bleibt die Zeile weg.
function initAnmeldestatus() {
    const fuss = document.querySelector('.app-footer');
    if (!fuss || !window.fetch) return;
    fetch('portal-anmeldung.php?aktion=status', { cache: 'no-store', credentials: 'same-origin' })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
            if (!d || !d.angemeldet) return;
            // Einmal je Sitzung alle Portalseiten offline bereitlegen lassen
            try {
                if (sessionStorage.getItem('portal_nachgeladen') !== d.ende && 'serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then(reg => {
                        if (reg.active) reg.active.postMessage({ typ: 'nachladen' });
                        sessionStorage.setItem('portal_nachgeladen', d.ende);
                    });
                }
            } catch (e) { /* ohne sessionStorage: nicht schlimm */ }
            const p = document.createElement('p');
            p.className = 'app-footer-anmeldung';
            p.style.marginTop = '8px';
            p.append('Angemeldet: ' + d.name + ' (' + d.app + ') · ');
            const a = document.createElement('a');
            a.href = 'portal-anmeldung.php?aktion=abmelden';
            a.textContent = 'Abmelden';
            a.style.color = 'inherit';
            p.appendChild(a);
            fuss.appendChild(p);
        })
        .catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFooter();
    initServiceWorker();
});
