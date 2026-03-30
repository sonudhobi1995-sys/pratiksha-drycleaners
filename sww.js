const CACHE_NAME = 'pratiksha-admin-v10.5'; // वर्जन बदला ताकि फोन नया अपडेट पकड़ ले
const urlsToCache = [
  './admin-update.html',  // एडमिन की मुख्य फाइल
  './billing.html',       // बिलिंग फाइल
  './manifest-billing.json',
  './logo.png',           // आपका आइकॉन
  './4.jpg'               // अगर कोई बैकग्राउंड फोटो है
];

// 1. इंस्टॉल: फाइलों को फोन की मेमोरी में सुरक्षित करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Admin Astra: Files Cached! ✅');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // तुरंत एक्टिवेट करें
  );
});

// 2. एक्टिवेट: पुरानी फाइलों को हटाना (ताकि ऐप अटके नहीं)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing Old Admin Cache... 🧹');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. फेच: इंटरनेट न होने पर भी ऐप को 'Standalone' मोड में खोलना
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
