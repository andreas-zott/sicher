self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('checkliste-cache-v1').then(cache => {
      return cache.addAll([
        '/sicher/',
        '/sicher/index.html',
        '/sicher/manifest.json',
        '/sicher/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
