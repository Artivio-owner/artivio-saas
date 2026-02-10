/**
 * ============================================
 * ARTIVIO — SERVICE WORKER
 * ============================================
 */

const CACHE_NAME = 'artivio-cache-v1';
const URLS = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request),
    ),
  );
});