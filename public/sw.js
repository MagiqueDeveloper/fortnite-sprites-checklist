/* Offline cache for the Sprites checklist.
 *
 * Install precaches the app shell and skips waiting. The page also writes into
 * this same cache (see src/lib/offlineCache.ts, which owns the cache name), so
 * a first visit stores the bundle, the manifest, the icons and all 75 sprite
 * PNGs even before the worker controls anything.
 *
 * Navigations are network-first, so a redeploy is picked up when online, and
 * fall back to the cached shell when there is no connection. Everything else is
 * cache-first; the bundles and sprite filenames are content-hashed, so a new
 * build simply arrives as new URLs. Bump CACHE_VERSION (in both this file and
 * offlineCache.ts) to retire old caches.
 */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `ch7s4-sprites-${CACHE_VERSION}`;
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // one unreachable URL must not abandon the whole install
      await Promise.allSettled(SHELL.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
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
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) void cache.put('./index.html', response.clone());
          return response;
        } catch {
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
      if (response.ok && response.type === 'basic') {
        void cache.put(request, response.clone());
      }
      return response;
    })(),
  );
});
