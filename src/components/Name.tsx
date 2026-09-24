import { useLayoutEffect, useRef, type ReactNode } from 'react';

const NAME_BASE_PX = 8.2; // size used when the name already fits on one line
const NAME_MIN_PX = 5.2; // floor, so very long names stay readable

/**
 * Sprite name that always occupies a single line. It starts at the base size and
 * shrinks until it fits, so long variants such as "Loot Hacker Crash Bandicoot"
 * never wrap onto a second line and make the card taller.
 */
export function Name({ text, variantClass }: { text: string; variantClass?: string }): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = (): void => {
      el.style.fontSize = `${NAME_BASE_PX}px`;
      const available = el.clientWidth;
      const needed = el.scrollWidth;
      if (available > 0 && needed > available) {
        const scaled = Math.max(NAME_MIN_PX, (NAME_BASE_PX * available) / needed);
        el.style.fontSize = `${Math.floor(scaled * 100) / 100}px`;
      }
    };

    fit();
    window.addEventListener('resize', fit);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  });

  return (
    <div ref={ref} className={variantClass ? `name ${variantClass}` : 'name'} title={text}>
      {text}
    </div>
  );
}
