/**
 * Offline cache shared by the page and the service worker.
 *
 * The page writes into it directly rather than relying on the worker to
 * intercept the first load: a freshly installed worker activates before it
 * controls the page, so the requests made while the sheet first paints would
 * otherwise be missed and nothing would be stored. The worker then serves
 * from this cache on later visits, including offline ones.
 */
export const OFFLINE_CACHE_NAME = 'ch7s4-sprites-v1';

/** Every same-origin URL the sheet needs to work offline. */
function offlineUrls(): string[] {
  const urls = new Set<string>([
    window.location.href.split('?')[0],
    new URL('index.html', document.baseURI).href,
    new URL('manifest.webmanifest', document.baseURI).href,
  ]);

  for (const el of document.querySelectorAll<HTMLImageElement>('img[src]')) urls.add(el.src);
  for (const el of document.querySelectorAll<HTMLLinkElement>('link[href]')) urls.add(el.href);
  for (const el of document.querySelectorAll<HTMLScriptElement>('script[src]')) urls.add(el.src);

  return [...urls];
}

/**
 * Download and store anything the sheet is missing, so one visit leaves a
 * complete offline copy. Returns how many URLs are now cached.
 */
export async function cachePageAssets(): Promise<number> {
  const cache = await caches.open(OFFLINE_CACHE_NAME);
  const urls = offlineUrls();

  await Promise.allSettled(
    urls.map(async (url) => {
      if (await cache.match(url)) return;
      const response = await fetch(url, { cache: 'force-cache' });
      if (response.ok) await cache.put(url, response.clone());
    }),
  );

  return (await cache.keys()).length;
}
