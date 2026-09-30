import type { ReactNode } from 'react';
import { FAMILIES, SINGLES } from '../data/sprites';

interface SheetHeaderProps {
  page: number;
  pages: number;
}

/** Masthead: OVERRIDE wordmark plus the collectible counters. Later pages get a slim strip. */
export function SheetHeader({ page, pages }: SheetHeaderProps): ReactNode {
  if (page > 1) {
    return (
      <header className="head cont">
        <div className="logo" data-text="OVERRIDE">
          OVERRIDE
        </div>
        <div className="sub">
          Sprites checklist · page {page} of {pages}
        </div>
      </header>
    );
  }
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
          {pages > 1 ? ` · page 1 of ${pages}` : ''}
        </div>
      </div>
    </header>
  );
}
