const CACHE_NAME = 'aakar-videotake-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './festival.html',
  './gallery.html',
  './workshops.html',
  './events.html',
  './newsletter.html',
  './css/style.css',
  './js/main.js',
  './js/pwa.js',
  './images/logo_trans.png',
  './images/background.jpeg'
];

// Install Event: cache static shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Caching individual assets with fallback recovery to prevent installation failure
        return Promise.allSettled(
          ASSETS.map(asset => {
            return cache.add(asset).catch(err => {
              console.warn(`Failed to cache asset: ${asset}`, err);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: network first, fallback to cache for HTML, cache first for static files
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or external resources
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Check if requesting an HTML document
  if (request.headers.get('accept').includes('text/html') || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If successful network call, cache the latest page content
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(request);
        })
    );
  } else {
    // For images, CSS, JS, etc.: Cache first, fallback to network
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then(response => {
            // Cache static assets dynamically if not cached already
            if (response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return response;
          });
        })
    );
  }
});
