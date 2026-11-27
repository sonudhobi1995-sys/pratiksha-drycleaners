const cacheName = 'pratiksha-niti-v2';
const staticAssets = [
  './',
  './index.html',
  './services.html',
  './about.html',
  './process.html',
  './contact.html',
  './tracking.html',
  './Member_Exclusive.html',
  './login.html',
  './privacy.html',
  './terms.html',
  './style.css',
  './manifest.json',
  './logo.png'
];

// ऐप की फाइलों को फोन की मेमोरी में सुरक्षित सेव करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(staticAssets))
      .then(() => self.skipWaiting())
  );
});

// पुराने कैश संस्करणों को हटाकर नया संस्करण सक्रिय करना
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== cacheName)
          .map(oldKey => caches.delete(oldKey))
      )
    ).then(() => self.clients.claim())
  );
});

// लाइव डेटा के लिए Network-First और स्थिर फाइलों के लिए Stale-While-Revalidate
self.addEventListener('fetch', event => {
  const req = event.request;

  // केवल GET अनुरोधों को संभालें
  if (req.method !== 'GET') return;

  // Google Apps Script API कॉल को हमेशा लाइव नेटवर्क से लाएं
  if (req.url.includes('script.google.com') || req.url.includes('script.googleusercontent.com')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(cachedRes => {
      const fetchPromise = fetch(req)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const resClone = networkRes.clone();
            caches.open(cacheName).then(cache => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
