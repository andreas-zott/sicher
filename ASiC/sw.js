// ==========================================================================
// ASiC Handel — Service Worker
// ==========================================================================
// Offline-Unterstützung und schneller Seitenaufbau für die ASiC-Handel-App.
//
// SERVICE-WORKER-VERSION: 1.54
// Bei JEDEM Update gemeinsam hochzaehlen:
//   - APP_VERSION / CACHE_NAME hier
//   - APP_REVISION in js/app.js
//   - das ?v=1.54 hinter allen js/css-Einbindungen in den HTML-Seiten
//
// Ladestrategie (ab Rev. 1.54):
//   - Programmdateien mit Versionszusatz (js/…?v=1.54, css/…?v=1.54) und
//     Schriften: SOFORT aus dem Cache auf dem Geraet, ohne Rueckfrage beim
//     Server. Das ist sicher, weil sich bei jedem Update der Zusatz ?v=
//     aendert - dann ist es fuer den Browser eine neue Adresse und wird
//     frisch geladen. (Rev. 1.53 hat jede Datei bei jedem Aufruf beim Server
//     nachgefragt - ueber die Funnel-Adresse spuerbar langsam.)
//   - HTML-Seiten, zugang-config.js, manifest, Icons: zuerst vom Server
//     (cache: 'no-cache', damit nicht der HTTP-Cache des Browsers eine alte
//     Fassung liefert), bei fehlender Verbindung aus dem Cache.
//   - .php und fremde Adressen (z. B. NAS ueber Funnel): nie angefasst.
//
// Bei einer neuen Version:
//   1. Alle App-Dateien werden neu vom Server geladen (an ihren ?v-Adressen).
//   2. Alte ASiC-Handel-Caches werden gelöscht.
//   3. Der neue Service Worker wird sofort aktiviert und übernimmt offene Tabs.
//
// WICHTIG: Dieser Service Worker löscht KEINE localStorage-/IndexedDB-Daten,
// archivierten Begehungen oder Fotos.
// ==========================================================================

const APP_VERSION = '1.54';
const CACHE_NAME = 'asic-handel-v' + APP_VERSION;


// ==========================================================================
// DATEIEN FÜR OFFLINE-BETRIEB
// ==========================================================================

// Ohne Versionszusatz (werden immer zuerst beim Server nachgefragt)
const PRECACHE_URLS = [
    './',
    './index.html',
    './massnahmen.html',
    './fotos.html',
    './verlauf.html',
    './einstellungen.html',
    './dokumentation.html',
    './hilfe.html',
    './auswertung.html',
    './auswertung-team.html',
    './impressum.html',
    './datenschutz.html',

    './manifest.json',
    './zugang-config.js',

    './icon-192.png',
    './icon-512.png',

    './fonts/space-grotesk-latin-500-normal.woff2',
    './fonts/space-grotesk-latin-600-normal.woff2',
    './fonts/space-grotesk-latin-700-normal.woff2'
];

// Mit Versionszusatz - genau so, wie die HTML-Seiten sie einbinden
const PRECACHE_VERSIONIERT = [
    './css/styles.css',

    './js/app.js',
    './js/access-gate.js',
    './js/audit-data.js',
    './js/text.js',
    './js/massnahmen.js',
    './js/photos-store.js',
    './js/archive-store.js',
    './js/fotos.js',
    './js/verlauf.js',
    './js/einstellungen.js',
    './js/auswertung-logik.js',
    './js/auswertung.js',
    './js/auswertung-team.js',
    './js/jspdf.umd.min.js'
].map(url => url + '?v=' + APP_VERSION);


// ==========================================================================
// INSTALL
// ==========================================================================
// Mit "cache: reload" direkt vom Server, am HTTP-Cache des Browsers vorbei.

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('[SW] Installiere neuen Cache:', CACHE_NAME);
                for (const url of PRECACHE_URLS.concat(PRECACHE_VERSIONIERT)) {
                    const request = new Request(url, { cache: 'reload' });
                    const response = await fetch(request);
                    if (!response.ok) {
                        console.error('[SW] Fehler beim Laden:', url, response.status);
                        throw new Error(`HTTP ${response.status} bei ${url}`);
                    }
                    await cache.put(request, response);
                }
            })
            .then(() => self.skipWaiting())
    );
});


// ==========================================================================
// ACTIVATE – alte Caches entfernen
// ==========================================================================

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.map(key => {
                    if (key.startsWith('asic-handel-v1.') && key !== CACHE_NAME) {
                        console.log('[SW] Lösche alten Cache:', key);
                        return caches.delete(key);
                    }
                    return Promise.resolve();
                })
            ))
            .then(() => self.clients.claim())
    );
});


// ==========================================================================
// FETCH
// ==========================================================================

function istSofortAusCache(url) {
    // Versionierte Programmdateien und Schriften (aendern sich nie unter
    // derselben Adresse)
    return url.searchParams.has('v') || url.pathname.includes('/fonts/');
}

function inCacheLegen(request, response) {
    if (response && response.status === 200 && response.type !== 'opaque') {
        const copy = response.clone();
        caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy))
            .catch(error => console.warn('[SW] Cache konnte nicht aktualisiert werden:', error));
    }
    return response;
}

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // PHP (Server-Speicherung) und fremde Adressen nie über den Cache
    if (url.origin !== self.location.origin || /\.php$/i.test(url.pathname)) return;

    // 1) Versionierte Dateien: Cache zuerst, nur bei Fehlen vom Server
    if (istSofortAusCache(url)) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request)
                    .then(response => inCacheLegen(event.request, response))
                    .catch(() => caches.match(event.request, { ignoreSearch: true }));
            })
        );
        return;
    }

    // 2) Alles andere: Server zuerst, Cache als Rückfall (offline).
    //    Seitenaufrufe (mode 'navigate') dürfen nicht umgebaut werden.
    const netzRequest = event.request.mode === 'navigate'
        ? event.request
        : new Request(event.request, { cache: 'no-cache' });

    event.respondWith(
        fetch(netzRequest)
            .then(response => inCacheLegen(event.request, response))
            .catch(() =>
                caches.match(event.request, { ignoreSearch: true }).then(cached => {
                    if (cached) return cached;
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return undefined;
                })
            )
    );
});
