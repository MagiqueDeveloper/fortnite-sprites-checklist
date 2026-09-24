/**
 * Print exactly the previewed A4 sheet.
 *
 * The sheet element is cloned into a temporary off-screen iframe together with
 * the page's stylesheets, so the browser prints that container alone: no fixed
 * toolbar, no page background, no surrounding document. Cloning also lets us
 * drop the on-screen scale-to-fit zoom, which means the printed geometry is
 * always a true A4 page no matter how wide the window happens to be.
 */
const PRINT_STYLES = `
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0 !important; padding: 0 !important; background: #fff !important;
    width: var(--page-width); height: var(--page-height); overflow: hidden;
  }
  .sheet { zoom: 1 !important; margin: 0 !important; box-shadow: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

const FRAME_STYLE =
  'position:fixed; left:-10000px; top:0; width:210mm; height:297mm; border:0; margin:0;';

export function printSheet(sheet: HTMLElement): Promise<void> {
  const clone = sheet.cloneNode(true) as HTMLElement;
  clone.style.zoom = '1'; // drop the screen scale-to-fit

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('\n');

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('title', 'Printable checklist');
  frame.style.cssText = FRAME_STYLE;
  document.body.appendChild(frame);

  const win = frame.contentWindow;
  const doc = frame.contentDocument;
  if (!win || !doc) {
    frame.remove();
    window.print(); // fall back to printing the page, whose print rules isolate the sheet
    return Promise.resolve();
  }

  doc.open();
  doc.write(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
      `<base href="${document.baseURI}">` +
      `<title>Fortnite CH7S4 Sprites Checklist</title>` +
      styles +
      `<style>${PRINT_STYLES}</style>` +
      `</head><body>${clone.outerHTML}</body></html>`,
  );
  doc.close();

  return new Promise<void>((resolve) => {
    let finished = false;
    const finish = (): void => {
      if (finished) return;
      finished = true;
      frame.remove();
      resolve();
    };

    win.addEventListener('afterprint', finish, { once: true });
    window.setTimeout(finish, 60_000); // safety net if afterprint never fires

    const pending = Array.from(doc.images).map(
      (img) =>
        new Promise<void>((done) => {
          if (img.complete) return done();
          img.addEventListener('load', () => done(), { once: true });
          img.addEventListener('error', () => done(), { once: true });
        }),
    );

    void Promise.all(pending).then(() => {
      win.focus();
      win.print();
    });
  });
}
