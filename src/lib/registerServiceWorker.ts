import { cachePageAssets } from './offlineCache';

/**
 * Registers the offline service worker and fills its cache.
 *
 * The worker handles later visits; the page does the caching here, because a
 * worker only sees requests made while it is in control and the sheet asks for
 * its images as it first paints. Both run on load, so a first visit leaves a
 * complete copy behind.
 *
 * Production only: the Vite dev server serves unbundled modules that should not
 * be cached.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    void cachePageAssets().catch((error: unknown) => {
      console.warn('Offline cache could not be filled:', error);
    });

    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(async () => {
        await navigator.serviceWorker.ready;
        // the fresh worker may only control this page after it claims clients
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => void cachePageAssets(),
          { once: true },
        );
      })
      .catch((error: unknown) => {
        console.warn('Offline worker unavailable:', error);
      });
  });
}
