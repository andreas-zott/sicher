// ==========================================================================
// ASiC Handel — Service Worker
// ==========================================================================
// Offline-Unterstützung für die ASiC-Handel-App.
//
// SERVICE-WORKER-VERSION: 1.28
//
// Bei einer neuen technischen Version:
//   1. Alle precachten App-Dateien werden neu vom Server geladen.
//   2. Alte ASiC-Handel-Caches werden gelöscht.
//   3. Der neue Service Worker wird sofort aktiviert.
//   4. Offene Tabs werden sofort übernommen.
//
// WICHTIG:
// Dieser Service Worker löscht KEINE:
//   - localStorage-Daten
//   - IndexedDB-Daten
//   - archivierten Begehungen
//   - Fotos
// ==========================================================================

const CACHE_NAME = 'asic-handel-v1.39';


// ==========================================================================
// DATEIEN FÜR OFFLINE-BETRIEB
// ==========================================================================

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

    './icon-192.png',
    './icon-512.png',

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
];


// ==========================================================================
// INSTALL
// ==========================================================================
//
// Die Dateien werden mit "cache: reload" direkt vom Server angefordert.
// Dadurch wird beim Wechsel auf eine neue Service-Worker-Version der
// normale HTTP-Cache für diese Dateien umgangen.
// ==========================================================================

self.addEventListener('install', event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(async cache => {

                console.log(
                    '[SW] Installiere neuen Cache:',
                    CACHE_NAME
                );

                for (const url of PRECACHE_URLS) {

                    try {

                        const request = new Request(url, {
                            cache: 'reload'
                        });

                        const response =
                            await fetch(request);

                        if (!response.ok) {

                            throw new Error(
                                `HTTP ${response.status}`
                            );
                        }

                        await cache.put(
                            request,
                            response
                        );

                        console.log(
                            '[SW] Neu geladen:',
                            url
                        );

                    } catch (error) {

                        console.error(
                            '[SW] Fehler beim Laden:',
                            url,
                            error
                        );

                        // Installation abbrechen, wenn eine wichtige
                        // Datei nicht geladen werden konnte.
                        throw error;
                    }
                }
            })

            // Neue Version sofort installieren
            .then(() => {
                return self.skipWaiting();
            })
    );
});


// ==========================================================================
// ACTIVATE
// ==========================================================================
//
// Alle älteren ASiC-Handel-Caches werden gelöscht.
// Andere Caches fremder Anwendungen bleiben unangetastet.
// ==========================================================================

self.addEventListener('activate', event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (
                            key.startsWith('asic-handel-') &&
                            key !== CACHE_NAME
                        ) {

                            console.log(
                                '[SW] Lösche alten Cache:',
                                key
                            );

                            return caches.delete(key);
                        }

                        return Promise.resolve();
                    })
                );
            })

            // Neue Version sofort für alle offenen Tabs übernehmen
            .then(() => {
                return self.clients.claim();
            })
    );
});


// ==========================================================================
// FETCH
// ==========================================================================
//
// ONLINE:
//   Netzwerk wird bevorzugt.
//
// OFFLINE:
//   Cache wird als Fallback verwendet.
//
// Erfolgreiche Netzwerkantworten werden zusätzlich im aktuellen Cache
// gespeichert. Dadurch bleiben neu geladene Dateien auch offline verfügbar.
// ==========================================================================

self.addEventListener('fetch', event => {

    // Nur GET-Anfragen behandeln
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then(response => {

                // Nur gültige Antworten cachen
                if (
                    response &&
                    response.status === 200 &&
                    response.type !== 'opaque'
                ) {

                    const copy =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                copy
                            );

                        })
                        .catch(error => {

                            console.warn(
                                '[SW] Cache konnte nicht aktualisiert werden:',
                                error
                            );

                        });
                }

                return response;
            })

            // ==================================================================
            // KEIN NETZWERK
            // ==================================================================

            .catch(() => {

                return caches.match(
                    event.request
                )

                .then(cachedResponse => {

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Bei Navigation auf die Startseite zurückfallen
                    if (
                        event.request.mode ===
                        'navigate'
                    ) {

                        return caches.match(
                            './index.html'
                        );
                    }

                    return undefined;
                });
            })
    );
});