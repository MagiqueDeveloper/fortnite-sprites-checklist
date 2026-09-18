import { useEffect, useRef } from 'react';

const A4_WIDTH_PX = 794; // 210mm at 96dpi

/**
 * The sheet is always a true A4 page: narrow viewports scale it down with zoom
 * instead of reflowing, so what you see on screen is exactly what prints.
 */
export function useFitSheet<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const fit = (): void => {
      const sheet = ref.current;
      if (!sheet) return;
      const available = document.documentElement.clientWidth - 24;
      sheet.style.zoom = Math.min(1, available / A4_WIDTH_PX).toFixed(3);
    };

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return ref;
}
