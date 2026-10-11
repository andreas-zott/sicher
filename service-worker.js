// ─────────────────────────────────────────────────────────────
// Arbeitssicherheit – Service Worker (Portal /sicher/)
//
// Alle Portal-Seiten registrieren ausschliesslich DIESE Datei (ueber
// js/common.js bzw. direkt). Die alte sw.js ist nur noch ein Verweis
// auf diese Datei, damit frueher installierte Registrierungen sauber
// auf den neuen Stand wechseln.
//
// Versionsnummer: bei jeder inhaltlichen Aenderung an einer der
// gecachten Dateien APP_VERSION hochzaehlen (identisch zu js/common.js).
//
// WICHTIG: Beim Aktivieren werden nur EIGENE alte Caches geloescht
// (Praefix "sicherheit-cache-" und der Altbestand "checkliste-cache-v1").
// Frueher wurden ALLE Caches der Domain geloescht - also auch die
// Offline-Daten von ASiC Handel, GBO und Audit-2026.
// ─────────────────────────────────────────────────────────────
const APP_VERSION = '1.1.0';
const CACHE_PREFIX = 'sicherheit-cache-';
const CACHE_NAME = `${CACHE_PREFIX}v${APP_VERSION}`;
const ALTE_EIGENE_CACHES = ['checkliste-cache-v1'];

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
  '/sicher/audit.html',
  '/sicher/Massnahmenplan.html',
  '/sicher/massnahmen-sifa.html',
  '/sicher/theke.html',
  '/sicher/aushang.html',
  '/sicher/aufzug.html',
  '/sicher/faq.html',
  '/sicher/technische-beschreibung.html',
  '/sicher/impressum.html',
  '/sicher/datenschutz.html',
  '/sicher/manifest.json',
  '/sicher/icon-192.png',
  '/sicher/icon-512.png',
  '/sicher/apple-touch-icon.png',
  '/sicher/favicon.ico',
  '/sicher/css/styles.css',
  '/sicher/css/checkliste.css',
  '/sicher/js/common.js',
  '/sicher/js/checkliste-daten.js',
  '/sicher/js/checkliste-engine.js',
  '/sicher/js/theke-daten.js',
  '/sicher/js/aushang-daten.js',
  '/sicher/lib/css/fontawesome.min.css',
  '/sicher/lib/webfonts/fa-solid-900.woff2',
  '/sicher/lib/webfonts/fa-regular-400.woff2',
  '/sicher/lib/webfonts/fa-brands-400.woff2',
  '/sicher/lib/jspdf.umd.min.js'
];

// Installations-Ereignis: Dateien einzeln cachen (eine fehlende Datei
// bricht so nicht die ganze Installation ab)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        FILES_TO_CACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn('[Service Worker] Konnte nicht gecacht werden:', url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// Aktivierungs-Ereignis: nur eigene, veraltete Caches loeschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList
          .filter(key => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) || ALTE_EIGENE_CACHES.includes(key))
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch-Ereignis: aus dem eigenen Cache bedienen, sonst aus dem Netz laden.
// Nur GET-Anfragen der eigenen Domain; Unterprojekte (ASiC, GBO, Audit-2026,
// GBU, Unfallanzeige) haben eigene Service Worker bzw. laufen direkt ueber das Netz.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/sicher\/(ASiC|gbo|audit-2026|gbu|unfallanzeige)\//.test(url.pathname)) return;
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cache.match(req))
      .then(response => response || fetch(req))
  );
});
