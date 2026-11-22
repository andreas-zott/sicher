// ─────────────────────────────────────────────────────────────
// Arbeitssicherheit – Service Worker (Sicherungsfassung auf GitHub Pages /sicher/)
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
const APP_VERSION = '1.4.6';
const CACHE_PREFIX = 'sicherheit-cache-';
const CACHE_NAME = `${CACHE_PREFIX}v${APP_VERSION}`;
const ALTE_EIGENE_CACHES = ['checkliste-cache-v1'];

const FILES_TO_CACHE = [
  './',
  './index.html',
  './help.html',
  './archiv.html',
  './entstehung.html',
  './liste.html',
  './audit.html',
  './Massnahmenplan.html',
  './massnahmen-sifa.html',
  './theke.html',
  './aushang.html',
  './aufzug.html',
  './faq.html',
  './technische-beschreibung.html',
  './quellen.html',
  './impressum.html',
  './datenschutz.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.ico',
  './css/styles.css',
  './css/checkliste.css',
  './js/common.js',
  './js/checkliste-daten.js',
  './js/checkliste-engine.js',
  './js/theke-daten.js',
  './js/aushang-daten.js',
  './lib/css/fontawesome.min.css',
  './lib/webfonts/fa-solid-900.woff2',
  './lib/webfonts/fa-regular-400.woff2',
  './lib/webfonts/fa-brands-400.woff2',
  './lib/jspdf.umd.min.js',
  './lib/fonts/space-grotesk-latin-500-normal.woff2',
  './lib/fonts/space-grotesk-latin-600-normal.woff2',
  './lib/fonts/space-grotesk-latin-700-normal.woff2'
];

// Installations-Ereignis: Dateien einzeln cachen (eine fehlende Datei
// bricht so nicht die ganze Installation ab). "cache: reload" umgeht den
// HTTP-Cache des Browsers - sonst landete u. U. eine veraltete Fassung
// aus dem Zwischenspeicher im neuen Cache.
function allesSpeichern() {
  return (
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        FILES_TO_CACHE.map(url =>
          // Ab 1.4.2: Ohne Anmeldung leitet der Server Seiten zur Anmeldung um -
          // diese Antworten nicht unter dem Namen der Seite speichern.
          fetch(new Request(url, { cache: 'reload', credentials: 'same-origin' })).then(antwort => {
            if (antwort.ok && !antwort.redirected) return cache.put(url, antwort);
            // Verworfene Antwort zu Ende lesen, sonst bleibt die Verbindung
            // belegt (Apache: Keep-Alive) und die Installation haengt.
            return antwort.arrayBuffer().then(() => {}, () => {});
          }).catch(err => {
            console.warn('[Service Worker] Konnte nicht gecacht werden:', url, err);
          })
        )
      )
    )
  );
}

self.addEventListener('install', event => {
  event.waitUntil(allesSpeichern());
  self.skipWaiting();
});

// Ab 1.4.2: Nach der Anmeldung meldet js/common.js "nachladen" - dann alle
// Portalseiten offline bereitlegen (vorher waren sie ohne Anmeldung gesperrt).
self.addEventListener('message', event => {
  if (event.data && event.data.typ === 'nachladen') {
    event.waitUntil(allesSpeichern());
  }
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
    // Umleitung (z. B. zur Anmeldung): nicht speichern; Seitenaufrufe als
    // echte Umleitung weitergeben, sonst verweigert der Browser die Antwort
    if (antwort && antwort.redirected) {
      return req.mode === 'navigate' ? Response.redirect(antwort.url, 303) : antwort;
    }
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
      if (req.mode === 'navigate') return ausCache(new Request('./index.html'));
      return Response.error();
    })
  );
}

function cacheZuerst(req) {
  return ausCache(req).then(treffer => treffer || fetch(req));
}

// Nur GET-Anfragen der eigenen Domain. Der Service Worker liegt im
// Hauptordner und ist damit fuer die ganze Domain zustaendig - die
// Unterprojekte (ASiC, Grosshandel, GBO, Audit-2026, GBU, Unfallanzeige)
// haben eigene Service Worker bzw. laufen direkt ueber das Netz und werden
// hier NICHT angefasst. Ebenso PHP-Skripte (z. B. save.php): die laufen
// immer direkt zum Server und werden nie gecacht.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/(ASiC|Grosshandel|gbo|audit-2026|gbu|unfall|unfallanzeige)(\/|$)/i.test(url.pathname)) return;
  if (/\.php$/i.test(url.pathname)) return;

  const istSeiteOderCode = req.mode === 'navigate'
    || url.pathname.endsWith('/')
    || /\.(html|css|js|json)$/i.test(url.pathname);
  const istStatisch = /\.(woff2?|png|ico|jpe?g|svg|webp)$/i.test(url.pathname);

  if (istSeiteOderCode) event.respondWith(netzZuerst(event));
  else if (istStatisch) event.respondWith(cacheZuerst(req));
  // alles andere: unveraendert ueber das Netz
});
