import type { ReactNode } from 'react';

/** Artwork credit and season marker. */
export function SheetFooter(): ReactNode {
  return (
    <footer className="foot">
      <div>Sprite artwork © Epic Games. Unofficial fan checklist. Rarities provisional.</div>
      <div className="r">Chapter 7 · Treasure Hunters</div>
    </footer>
  );
}
