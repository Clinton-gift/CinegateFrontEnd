
/* eslint-disable no-undef */
const CACHE_NAME = 'Taxi Identification-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.webmanifest',
  '/assets/icons/chinda-192.png',
  '/assets/icons/chinda-512.png',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing… - service-worker.js:13');
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated - service-worker.js:22');
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)));
  })());
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })());
  }
});
