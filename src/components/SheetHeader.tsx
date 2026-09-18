import type { ReactNode } from 'react';
import { FAMILIES, SINGLES } from '../data/sprites';

/** Masthead: OVERRIDE wordmark plus the collectible counters. */
export function SheetHeader(): ReactNode {
  const total = [...FAMILIES, ...SINGLES].reduce((sum, family) => sum + family.variants.length, 0);

  return (
    <header className="head">
      <div className="brand">
        <div className="logo" data-text="OVERRIDE">
          OVERRIDE
        </div>
      </div>
      <div className="stats">
        <div className="bigcount">
          <span>{total}</span> <em>Collectible Sprites</em>
        </div>
        <div className="sub">
          {FAMILIES.length + SINGLES.length} sprite families · {total} available variants
        </div>
      </div>
    </header>
  );
}
