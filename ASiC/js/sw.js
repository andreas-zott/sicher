// ==========================================================================
// ASiC Handel — Service Worker
// ==========================================================================
// Offline-Unterstützung für die ASiC-Handel-App.
//
// WICHTIG:
// Bei Änderungen an App-Dateien CACHE_NAME erhöhen.
// ==========================================================================

const CACHE_NAME = 'asic-handel-v3.01';


// ==========================================================================
// DATEIEN FÜR OFFLINE-BETRIEB
// ==========================================================================

const PRECACHE_URLS = [
    './',
    './index.html',
    './massnahmen.html',
    './fotos.html',
    './verlauf.html',
    './dokumentation.html',
    './hilfe.html',
    './einstellungen.html',
    './auswertung.html',
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
    './js/webdav-store.js',
    './js/fotos.js',
    './js/verlauf.js',
    './js/einstellungen.js',
    './js/auswertung.js',

    './js/jspdf.umd.min.js'
];


// ==========================================================================
// INSTALL
// ==========================================================================

self.addEventListener('install', event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                console.log(
                    '[SW] Installiere Cache:',
                    CACHE_NAME
                );

                return cache.addAll(PRECACHE_URLS);
            })

            // Neue Version sofort installieren
            .then(() => self.skipWaiting())
    );
});


// ==========================================================================
// ACTIVATE
// ==========================================================================

self.addEventListener('activate', event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)

                        .map(key => {

                            console.log(
                                '[SW] Lösche alten Cache:',
                                key
                            );

                            return caches.delete(key);
                        })
                );
            })

            // Neue Version sofort für alle offenen Tabs übernehmen
            .then(() => self.clients.claim())
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
// Dadurch werden Änderungen an HTML, CSS und JS online sofort geladen,
// während die App bei fehlendem Internet weiterhin funktioniert.
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
                        .catch(err => {

                            console.warn(
                                '[SW] Cache konnte nicht aktualisiert werden:',
                                err
                            );

                        });
                }


                return response;
            })


            // --------------------------------------------------------------
            // KEIN NETZWERK
            // --------------------------------------------------------------

            .catch(() => {

                return caches.match(
                    event.request
                )

                .then(cachedResponse => {

                    if (cachedResponse) {
                        return cachedResponse;
                    }


                    // Bei Navigation auf Startseite zurückfallen
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