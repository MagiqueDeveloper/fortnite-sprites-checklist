/**
 * Registers the offline service worker. The worker precaches the whole site when
 * it installs (see public/sw.js), so one online visit is enough.
 *
 * Production only: the Vite dev server serves unbundled modules that should not
 * be cached.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const register = (): void => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.warn('Offline worker unavailable:', error);
    });
  };

  // register after load so the worker never competes with the first paint
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
