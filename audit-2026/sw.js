// SERVICE-WORKER-VERSION: 1.1 (bei Änderungen an Dateien Versionsnummer in CACHE_NAME erhöhen)
const CACHE_NAME = 'audit-2026-v1.1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './massnahmenplan.html',
  './fotos.html',
  './impressum.html',
  './datenschutz.html',
  './audit-2026.json',
  './css/styles.css',
  './js/app.js',
  './js/audit-data.js',
  './js/text.js',
  './js/massnahmenplan.js',
  './js/fotos.js',
  './js/jspdf.umd.min.js',
  './icon.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico',
  './logo.png',
  './images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        // Einzeln laden, damit eine fehlende Datei nicht die ganze Installation verhindert
        PRECACHE_URLS.map(url => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('audit-2026-') && k !== CACHE_NAME).map(k => caches.delete(k)))) // nur eigene Caches (frueher: ALLE Caches der Domain)
      .then(() => self.clients.claim())
  );
});

// Netzwerk zuerst (immer aktueller Stand), bei fehlendem Netz aus dem Cache
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
