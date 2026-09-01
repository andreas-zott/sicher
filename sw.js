self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('checkliste-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/sicher/index.html',
        '/sicher/manifest.json',
        '/sicher/icon.png',
        '/sicher/favicon.ico',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
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
