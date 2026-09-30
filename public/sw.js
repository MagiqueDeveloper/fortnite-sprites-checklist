/* Offline support for the Sprites checklist.
 *
 * `vite build` replaces the two placeholders below (see stampServiceWorker in
 * vite.config.ts): a hash of the built files, and the list of files to precache.
 * Each deploy therefore gets its own cache, and the old ones are deleted on
 * activate. In dev the placeholders stay as they are and the worker is not
 * registered (see src/lib/registerServiceWorker.ts).
 *
 * - install:     precache the whole site, so one online visit is enough.
 * - navigations: network-first, so a redeploy shows up online; cached page offline.
 * - other GETs:  stale-while-revalidate. Sprites live in public/ without content
 *                hashes, so a replaced image is refreshed on the next visit.
 */
const BUILD_ID = '__BUILD_ID__';
const PRECACHE = '__PRECACHE__';
const CACHE_NAME = `ch7s4-sprites-${BUILD_ID}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const urls = Array.isArray(PRECACHE) ? PRECACHE : [];
      // one unreachable URL must not abandon the whole install
      await Promise.allSettled(urls.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return; // fully self-hosted

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) void cache.put('./', response.clone());
          return response;
        } catch {
          return (
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
      const refresh = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') void cache.put(request, response.clone());
          return response;
        })
        .catch(() => undefined);

      if (cached) {
        event.waitUntil(refresh);
        return cached;
      }
      return (await refresh) ?? Response.error();
    })(),
  );
});
