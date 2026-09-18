/**
 * Registers the offline service worker and fills its cache.
 *
 * A worker only sees requests made while it is in control, but the sheet asks
 * for its images as it first paints, before the worker has activated. So once
 * it takes control we replay every URL the page uses through it, which copies
 * the bundle, the manifest, the icons and all 75 sprite PNGs into Cache
 * Storage. After that the checklist opens with no connection at all.
 *
 * Production only: the Vite dev server serves unbundled modules that should not
 * be cached.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(async () => {
        if (navigator.serviceWorker.controller) {
          await warmOfflineCache();
          return;
        }
        // first visit: the fresh worker claims this page shortly after activating
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => void warmOfflineCache(),
          { once: true },
        );
      })
      .catch((error: unknown) => {
        console.warn('Offline cache unavailable:', error);
      });
  });
}

/** Re-request every same-origin asset the sheet needs, so the worker stores it. */
async function warmOfflineCache(): Promise<void> {
  const urls = new Set<string>([
    window.location.href,
    new URL('manifest.webmanifest', document.baseURI).href,
  ]);

  for (const el of document.querySelectorAll<HTMLImageElement>('img[src]')) urls.add(el.src);
  for (const el of document.querySelectorAll<HTMLLinkElement>('link[href]')) urls.add(el.href);
  for (const el of document.querySelectorAll<HTMLScriptElement>('script[src]')) urls.add(el.src);

  await Promise.allSettled(
    [...urls].map((url) => fetch(url, { cache: 'force-cache' }).catch(() => undefined)),
  );
}
