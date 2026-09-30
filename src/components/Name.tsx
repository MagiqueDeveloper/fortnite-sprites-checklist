import { useLayoutEffect, useRef, type ReactNode } from 'react';

const MIN_SCALE = 0.6; // floor, as a share of the CSS size, so very long names stay readable

/**
 * Sprite name that always occupies a single line. It starts at the size set in CSS
 * and shrinks until it fits, so long variants such as "Loot Hacker Crash Bandicoot"
 * never wrap onto a second line and make the card taller.
 */
export function Name({ text, variantClass }: { text: string; variantClass?: string }): ReactNode {
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
        const scaled = Math.max(base * MIN_SCALE, (base * available) / needed);
        el.style.fontSize = `${Math.floor(scaled * 100) / 100}px`;
      }
    };

    fit();
    window.addEventListener('resize', fit);
    // refit for the print layout, which can differ from the screen one (phones, narrow windows)
    const printQuery = window.matchMedia('print');
    printQuery.addEventListener('change', fit);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(fit);
    return () => {
      window.removeEventListener('resize', fit);
      printQuery.removeEventListener('change', fit);
    };
  }, [text]);

  return (
    <div ref={ref} className={variantClass ? `name ${variantClass}` : 'name'} title={text}>
      {text}
    </div>
  );
}
