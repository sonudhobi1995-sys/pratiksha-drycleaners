const CACHE_NAME = 'pratiksha-niti-admin-v11';
const urlsToCache = [
  './admin-update.html',
  './billing.html',
  './Dashboard.html',
  './manifest-admin.json',
  './logo.png',
  './style.css'
];

// 1. इंस्टॉल: आवश्यक फाइलों को कैश में सुरक्षित करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 2. एक्टिवेट: पुराने कैश को हटाकर नया संस्करण सक्रिय करना
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cache => cache !== CACHE_NAME)
          .map(oldCache => caches.delete(oldCache))
      )
    ).then(() => self.clients.claim())
  );
});

// 3. फेच: लाइव API के लिए नेटवर्क और स्थिर फाइलों के लिए कैश + ऑफ़लाइन सहारा
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  // Google Apps Script अनुरोधों को हमेशा लाइव सर्वर से लाएं
  if (req.url.includes('script.google.com') || req.url.includes('script.googleusercontent.com')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(response => {
      if (response) {
        return response;
      }

      return fetch(req)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.match('./admin-update.html');
          }
        });
    })
  );
});
