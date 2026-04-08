const CACHE_NAME = 'pratiksha-admin-v10.6'; // आज का मास्टर वर्जन
const urlsToCache = [
  './admin-update.html',
  './billing.html',
  './Dashboard.html',
  './manifest-admin.json',
  './logo.png',
  './style.css' // आपकी मुख्य डिजाइन फाइल
];

// 1. इंस्टॉल: फाइलों को कोस्मिक मेमोरी में सुरक्षित करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardian Engine: Files Cached Successfully! ✅');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) 
  );
});

// 2. एक्टिवेट: पुरानी ऊर्जा (Old Cache) को शुद्ध करना
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing Old Cosmic Cache... 🧹');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // सभी टैब्स पर तुरंत नियंत्रण
  );
});

// 3. फेच: इंटरनेट की बाधा के बिना सेवा जारी रखना
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // अगर कैश में है तो वहां से लें, वरना नेटवर्क से खींचें
      return response || fetch(event.request).catch(() => {
        // अगर इंटरनेट भी नहीं है और कैश में भी नहीं, तो कम से कम मुख्य पेज दिखाएं
        if (event.request.mode === 'navigate') {
          return caches.match('./admin-update.html');
        }
      });
    })
  );
});
