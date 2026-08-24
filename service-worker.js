// ─────────────────────────────────────────────────────────────
// Arbeitssicherheit – Service Worker
// Versionsnummer: bei jeder inhaltlichen Änderung an einer der
// gecachten Dateien bitte APP_VERSION hochzählen. Dadurch wird
// automatisch ein neuer Cache angelegt und der alte verworfen,
// sodass Nutzer zuverlässig die neue Version erhalten.
// ─────────────────────────────────────────────────────────────
const APP_VERSION = '1.0.2';
const CACHE_NAME = `checkliste-cache-v${APP_VERSION}`;

const FILES_TO_CACHE = [
  '/sicher/',
  '/sicher/index.html',
  '/sicher/welcome.html',
  '/sicher/liste.html',
  '/sicher/foto.html',
  '/sicher/massnahmen-sifa.html',
  '/sicher/faq.html',
  '/sicher/technische-beschreibung.html',
  '/sicher/impressum.html',
  '/sicher/datenschutz.html',
  '/sicher/manifest.json',
  '/sicher/icon.png',
  '/sicher/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Installations-Ereignis: Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll bricht komplett ab, wenn eine einzelne Datei fehlt
      // (z. B. weil index.html oder welcome.html so nicht existiert).
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
