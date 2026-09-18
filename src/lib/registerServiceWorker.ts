/**
 * Registers the offline service worker.
 *
 * The worker precaches the app shell and then caches every asset the page asks
 * for, so the first visit leaves a complete copy of the checklist on disk and
 * later visits work without a connection. Production only: the Vite dev server
 * serves unbundled modules that should not be cached.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((error: unknown) => {
        console.warn('Offline cache unavailable:', error);
      });
  });
}
