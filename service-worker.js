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
// Seiten/CSS/JS kommen ohnehin zuerst frisch aus dem Netz (siehe unten);
// die Versionsnummer sorgt dafuer, dass auch Schriften/Bilder erneuert werden.
//
// WICHTIG: Beim Aktivieren werden nur EIGENE alte Caches geloescht
// (Praefix "sicherheit-cache-" und der Altbestand "checkliste-cache-v1").
// Frueher wurden ALLE Caches der Domain geloescht - also auch die
// Offline-Daten von ASiC Handel, GBO und Audit-2026.
// ─────────────────────────────────────────────────────────────
const APP_VERSION = '1.3.1';
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
  '/sicher/quellen.html',
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
  '/sicher/lib/jspdf.umd.min.js',
  '/sicher/lib/fonts/space-grotesk-latin-500-normal.woff2',
  '/sicher/lib/fonts/space-grotesk-latin-600-normal.woff2',
  '/sicher/lib/fonts/space-grotesk-latin-700-normal.woff2'
];

// Installations-Ereignis: Dateien einzeln cachen (eine fehlende Datei
// bricht so nicht die ganze Installation ab). "cache: reload" umgeht den
// HTTP-Cache des Browsers - sonst landete u. U. eine bis zu 10 Minuten alte
// Fassung von GitHub Pages im neuen Cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        FILES_TO_CACHE.map(url =>
          cache.add(new Request(url, { cache: 'reload' })).catch(err => {
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
    ).then(() => self.clients.claim())
  );
});

// ─────────────────────────────────────────────────────────────
// Abrufstrategie
//  - Seiten, Stylesheets, Skripte, JSON: NETZ ZUERST. Ist das Geraet
//    online, kommt immer der aktuelle Stand vom Server (damit ist ein
//    Update sofort sichtbar). Die Antwort wird im Cache aufgefrischt.
//    Offline oder bei sehr langsamer Verbindung (> 4 s) wird die
//    gespeicherte Fassung geliefert.
//  - Schriften, Bilder, Bibliotheken: CACHE ZUERST (aendern sich nicht).
// Frueher galt "Cache zuerst" fuer alles - deshalb blieb nach einem
// Update die alte Seite sichtbar.
// ─────────────────────────────────────────────────────────────
const NETZ_TIMEOUT_MS = 4000;

function ausCache(req) {
  return caches.open(CACHE_NAME).then(cache => cache.match(req, { ignoreSearch: true }));
}

function netzZuerst(event) {
  const req = event.request;
  // Navigationsanfragen duerfen nicht mit Optionen kopiert werden -> neu anlegen
  const frisch = req.mode === 'navigate'
    ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })
    : new Request(req, { cache: 'no-cache' });

  const netz = fetch(frisch).then(antwort => {
    if (antwort && antwort.ok && antwort.type === 'basic') {
      const kopie = antwort.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(req, kopie)));
    }
    return antwort;
  });

  const zeitlimit = new Promise(resolve => {
    setTimeout(() => ausCache(req).then(treffer => { if (treffer) resolve(treffer); }), NETZ_TIMEOUT_MS);
  });

  return Promise.race([netz, zeitlimit]).catch(() =>
    ausCache(req).then(treffer => {
      if (treffer) return treffer;
      if (req.mode === 'navigate') return ausCache(new Request('/sicher/welcome.html'));
      return Response.error();
    })
  );
}

function cacheZuerst(req) {
  return ausCache(req).then(treffer => treffer || fetch(req));
}

// Nur GET-Anfragen der eigenen Domain; Unterprojekte (ASiC, GBO, Audit-2026,
// GBU, Unfallanzeige) haben eigene Service Worker bzw. laufen direkt ueber das Netz.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/sicher\/(ASiC|gbo|audit-2026|gbu|unfallanzeige)\//.test(url.pathname)) return;

  const istSeiteOderCode = req.mode === 'navigate'
    || url.pathname.endsWith('/')
    || /\.(html|css|js|json)$/i.test(url.pathname);

  event.respondWith(istSeiteOderCode ? netzZuerst(event) : cacheZuerst(req));
});
