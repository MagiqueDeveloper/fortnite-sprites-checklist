import type { ReactNode } from 'react';

/** Artwork credit and season marker. */
export function SheetFooter(): ReactNode {
  return (
    <footer className="foot">
      <div>Sprite artwork © Epic Games. Rarity and variant names as they appear in-game.</div>
      <div className="r">Chapter 7 Season 4 · Override</div>
    </footer>
  );
}
