import { useEffect, useRef } from 'react';

const A4_WIDTH_PX = 794; // 210mm at 96dpi
const GUTTER_PX = 24;

/**
 * The sheet is always a true A4 page: narrow viewports scale it down instead of
 * reflowing, so what you see on screen is what prints. The scale is published as
 * the --fit custom property; print.css resets it to 1.
 */
export function useFitSheet<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = document.documentElement;
    const fit = (): void => {
      const scale = Math.min(1, (root.clientWidth - GUTTER_PX) / A4_WIDTH_PX);
      root.style.setProperty('--fit', scale.toFixed(3));
    };

    fit();
    window.addEventListener('resize', fit);
    return () => {
      window.removeEventListener('resize', fit);
      root.style.removeProperty('--fit');
    };
  }, []);

  return ref;
}
