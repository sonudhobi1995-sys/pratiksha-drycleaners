const CACHE_NAME = 'pratiksha-billing-v1';
const urlsToCache = [
  'billing.html',
  'manifest-billing.json',
  'logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
