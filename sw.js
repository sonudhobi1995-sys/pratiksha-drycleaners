const cacheName = 'pratiksha-v1';
const staticAssets = [
  './',
  './index.html',
  './services.html',
  './about.html',
  './process.html',
  './contact.html',
  './logo.png'
];

// ऐप की फाइलों को फोन की मेमोरी में सेव करना
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// फाइलों को तेज़ी से लोड करना (Cache-First Strategy)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
