import { useLayoutEffect, type RefObject } from 'react';

const MM = 96 / 25.4;
/** Content height a page may use, in CSS px. The print sheet is 268mm tall; the last 4mm are spare. */
const AVAILABLE_PX = 264 * MM;
const MIN_FIT = 0.5; // sanity floor only; src/lib/pages.ts splits the sheet long before this

/** Fired after every pass, so text fitted to the old scale (Name.tsx) can fit again. */
export const SHEET_FIT_EVENT = 'sheetfit';

/**
 * Height the sheet's content needs at its current scale: the children plus their explicit
 * margins. The grid's `margin-bottom:auto` is left out on purpose; it only holds the
 * spare space.
 */
function naturalHeight(sheet: HTMLElement): number {
  let total = 0;
  for (const child of Array.from(sheet.children)) {
    const style = getComputedStyle(child);
    total += child.getBoundingClientRect().height + parseFloat(style.marginTop);
    if (!child.classList.contains('grid')) total += parseFloat(style.marginBottom);
  }
  return total;
}

/** The scale (1 = natural size) each sheet needs, measured in `doc` at the current --fit. */
function fitSheets(doc: Document): number[] {
  return Array.from(doc.querySelectorAll<HTMLElement>('.sheet')).map((sheet) => {
    // Not every length scales linearly (borders snap to whole device pixels), so
    // measure again at the new scale and correct until the content really fits.
    let scale = 1;
    for (let pass = 0; pass < 4; pass += 1) {
      const natural = naturalHeight(sheet);
      if (natural <= AVAILABLE_PX) break;
      scale = Math.max(MIN_FIT, Math.floor(scale * (AVAILABLE_PX / natural) * 1000) / 1000);
      sheet.style.setProperty('--fit', String(scale));
    }
    return scale;
  });
}

/**
 * Measures the pages in a hidden desktop-width frame, so the answer never depends on the
 * window that is open (a phone, a narrow window, the print preview) and is fixed before
 * printing starts.
 */
function measure(root: HTMLElement): number[] | null {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  Object.assign(frame.style, {
    position: 'fixed', left: '-10000px', top: '0', width: '1200px', height: '1600px',
    border: '0', visibility: 'hidden',
  });
  document.body.appendChild(frame);
  try {
    const doc = frame.contentDocument;
    if (!doc) return null;
    doc.open();
    doc.write('<!doctype html><html><head></head><body></body></html>');
    doc.close();
    const style = doc.createElement('style');
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) style.append(rule.cssText, '\n');
    }
    doc.head.append(style);
    const copy = doc.importNode(root, true);
    copy.querySelectorAll<HTMLElement>('.sheet').forEach((sheet) => sheet.style.removeProperty('--fit'));
    doc.body.append(copy);
    return fitSheets(doc);
  } catch {
    return null; // cross-origin styles or a blocked frame: keep natural size
  } finally {
    frame.remove();
  }
}

/**
 * Shrinks a page's content just enough to fit one A4 sheet. Each `.sheet` gets a `--fit`
 * scale that the stylesheet builds every length from (see sheet.css). Phones use their
 * own single-column layout and ignore it (mobile.css).
 */
export function useSheetFit(root: RefObject<HTMLElement | null>, pageCount: number): void {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const apply = (): void => {
      const scales = measure(el);
      el.querySelectorAll<HTMLElement>('.sheet').forEach((sheet, index) => {
        const scale = scales?.[index] ?? 1;
        if (scale < 1) sheet.style.setProperty('--fit', String(scale));
        else sheet.style.removeProperty('--fit');
      });
      window.dispatchEvent(new Event(SHEET_FIT_EVENT));
    };

    apply();
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(apply);
  }, [root, pageCount]);
}
