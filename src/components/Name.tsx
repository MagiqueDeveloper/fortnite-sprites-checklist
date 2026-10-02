import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { SHEET_FIT_EVENT } from '../hooks/useSheetFit';

const MIN_SCALE = 0.6; // floor, as a share of the CSS size, so very long names stay readable

/**
 * Sprite name that always occupies a single line. It starts at the size set in CSS
 * and shrinks until it fits, so long family names such as "Crash Bandicoot" never
 * wrap onto a second line and make the row taller.
 */
export function Name({ text }: { text: string }): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = (): void => {
      el.style.fontSize = ''; // back to the size the stylesheet asks for at this width
      const base = parseFloat(getComputedStyle(el).fontSize);
      const available = el.clientWidth;
      const needed = el.scrollWidth;
      if (available > 0 && needed > available) {
        const scaled = Math.max(base * MIN_SCALE, (base * available * 0.97) / needed); // 3% slack for subpixel rounding
        el.style.fontSize = `${Math.floor(scaled * 100) / 100}px`;
      }
    };

    fit();
    window.addEventListener('resize', fit);
    window.addEventListener(SHEET_FIT_EVENT, fit); // the sheet's scale changed the base size
    // refit for the print layout, which can differ from the screen one (phones, narrow windows)
    const printQuery = window.matchMedia('print');
    printQuery.addEventListener('change', fit);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener(SHEET_FIT_EVENT, fit);
      printQuery.removeEventListener('change', fit);
    };
  }, [text]);

  return (
    <div ref={ref} className="name" title={text}>
      {text}
    </div>
  );
}
