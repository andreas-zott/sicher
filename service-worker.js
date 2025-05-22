// service-worker.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('checkliste-v1').then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js'
        // + alle weiteren Assets
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
