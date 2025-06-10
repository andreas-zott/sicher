const CACHE_NAME = 'checkliste-cache-v1';
const FILES_TO_CACHE = [
  '/sicher/',
  '/sicher/index.html',
  '/sicher/manifest.json',
  '/sicher/icon.png',
  '/sicher/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Installations-Ereignis: Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Aktivierungs-Ereignis: Alte Caches löschen (optional, empfohlen)
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
});

// Fetch-Ereignis: Aus Cache bedienen oder aus dem Netz laden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
