// ─────────────────────────────────────────────────────────────
// Arbeitssicherheit – Service Worker
//
// ACHTUNG: Zuvor registrierten manche Seiten sw.js, andere
// service-worker.js - zwei unterschiedliche Service Worker im
// selben Geltungsbereich. Das ist jetzt vereinheitlicht: ALLE
// Seiten registrieren ausschliesslich DIESE Datei (ueber
// js/common.js). sw.js sollte aus dem Repository entfernt werden.
//
// Versionsnummer: bei jeder inhaltlichen Aenderung an einer der
// gecachten Dateien bitte APP_VERSION hochzaehlen. Dadurch wird
// automatisch ein neuer Cache angelegt und der alte verworfen,
// sodass Nutzer zuverlaessig die neue Version erhalten.
// ─────────────────────────────────────────────────────────────
const APP_VERSION = '1.0.1';
const CACHE_NAME = `sicherheit-cache-v${APP_VERSION}`;

const FILES_TO_CACHE = [
  '/sicher/',
  '/sicher/index.html',
  '/sicher/welcome.html',
  '/sicher/l1.html',
  '/sicher/help.html',
  '/sicher/foto.html',
  '/sicher/liste-neu.html',
  '/sicher/mobile-neu.html',
  '/sicher/liste.html',
  '/sicher/mobile.html',
  '/sicher/massnahmen-sifa.html',
  '/sicher/faq.html',
  '/sicher/technische-beschreibung.html',
  '/sicher/impressum.html',
  '/sicher/datenschutz.html',
  '/sicher/manifest.json',
  '/sicher/icon.png',
  '/sicher/favicon.ico',
  '/sicher/css/styles.css',
  '/sicher/css/checkliste.css',
  '/sicher/js/common.js',
  '/sicher/js/checkliste-daten.js',
  '/sicher/js/checkliste-engine.js',
  '/sicher/lib/css/fontawesome.min.css',
  '/sicher/lib/webfonts/fa-solid-900.woff2',
  '/sicher/lib/webfonts/fa-regular-400.woff2',
  '/sicher/lib/webfonts/fa-brands-400.woff2',
  '/sicher/lib/jspdf.umd.min.js',
  '/sicher/lib/exif.js'
];

// Installations-Ereignis: Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll bricht komplett ab, wenn eine einzelne Datei fehlt.
      // Deshalb jede Datei einzeln versuchen, statt alles abzubrechen.
      return Promise.all(
        FILES_TO_CACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn('[Service Worker] Konnte nicht gecacht werden:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Aktivierungs-Ereignis: Alte Caches (alte Versionen) löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch-Ereignis: Aus Cache bedienen, sonst aus dem Netz laden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
