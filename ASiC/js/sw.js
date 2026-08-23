// ==========================================================================
// ASiC Handel — Service Worker
// ==========================================================================
// Ermöglicht den Start der App auch ohne Netzwerkverbindung (z. B. schwaches
// WLAN im Markt). Cached alle statischen App-Dateien beim ersten Aufruf.
//
// WICHTIG BEI JEDEM UPDATE DER APP-DATEIEN:
// CACHE_NAME muss hochgezaehlt werden (z. B. an APP_REVISION aus app.js
// angleichen), sonst liefert der Service Worker weiterhin die ALTEN
// Dateien aus dem Cache aus, auch wenn neue hochgeladen wurden.
const CACHE_NAME = 'asic-handel-v2.2';

// Alle Dateien, die die App zum Start ohne Netzwerk braucht.
// Muss mit der tatsaechlichen Dateistruktur uebereinstimmen (siehe
// Technische_Dokumentation.md/.pdf, Abschnitt 7 "Dateiuebersicht").
const PRECACHE_URLS = [
    './',
    './index.html',
    './massnahmen.html',
    './fotos.html',
    './verlauf.html',
    './dokumentation.html',
    './hilfe.html',
    './impressum.html',
    './datenschutz.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './css/styles.css',
    './js/app.js',
    './js/audit-data.js',
    './js/text.js',
    './js/massnahmen.js',
    './js/photos-store.js',
    './js/archive-store.js',
    './js/fotos.js',
    './js/verlauf.js',
    './js/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Nur eigene GET-Anfragen behandeln; alles andere (z. B. mailto:-Links,
    // POST-Anfragen) unveraendert durchreichen.
    if (event.request.method !== 'GET') return;

    // Einheitlich fuer ALLE Dateien (HTML-Seiten wie auch JS/CSS/Icons):
    // immer zuerst das Netzwerk versuchen, damit Aenderungen sofort
    // ankommen sobald online, und den Cache nur als Absicherung fuer
    // fehlendes Netz nutzen. Bewusst NICHT "Cache zuerst" fuer statische
    // Dateien, obwohl das theoretisch schneller waere - waehrend die App
    // noch haeufig weiterentwickelt wird, hat sich gezeigt, dass ein
    // vergessenes Hochzaehlen von CACHE_NAME sonst dazu fuehrt, dass alte
    // und neue Dateien unbemerkt gemischt ausgeliefert werden (z. B. neues
    // HTML mit altem CSS) - das ist die zuverlaessigere Grundeinstellung.
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return response;
            })
            .catch(() =>
                caches.match(event.request).then(cached =>
                    cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
                )
            )
    );
});
