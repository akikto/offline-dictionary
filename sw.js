// Service Worker for Shobdokosh Offline Dictionary
const BASE = '/offline-dictionary';
const CACHE_NAME = 'shobdokosh-v3';
const ASSETS_TO_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/icon.png`,
  `${BASE}/icon.svg`,
  `${BASE}/logo.png`,
  `${BASE}/favicon.png`,
  `${BASE}/favicon.ico`,
  `${BASE}/apple-touch-icon.png`,
  `${BASE}/pwa-192.png`,
  `${BASE}/pwa-512.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core offline shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response, and update cache in background if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
        }).catch(() => {
          // Ignore network errors when updating cache offline
        });
        return cachedResponse;
      }

      // If not in cache, try fetching from network and caching it
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch((err) => {
        console.log('[SW] Network request failed and not in cache:', event.request.url);
        // Fallback to index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE}/index.html`);
        }
        return new Response('Offline resource unavailable', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
