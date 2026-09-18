/* Offline cache for the Sprites checklist.
 *
 * Install precaches the app shell. Everything else the page needs (the hashed
 * JS and CSS, the 75 sprite images, the web app manifest) is stored as it is
 * fetched, so the first visit leaves a complete copy on disk.
 *
 * Navigations are network-first, so a redeploy is picked up when online, and
 * fall back to the cached shell when there is no connection. Static assets are
 * cache-first, and their filenames are content-hashed, so a new build simply
 * arrives as new URLs. Bump CACHE_VERSION to retire old caches.
 */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `ch7s4-sprites-${CACHE_VERSION}`;
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // the sheet is fully self-hosted

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          void cache.put('./index.html', response.clone());
          return response;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match('./index.html')) ??
            (await cache.match('./')) ??
            new Response('Offline and no cached copy yet.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            })
          );
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        void cache.put(request, response.clone());
      }
      return response;
    })(),
  );
});
