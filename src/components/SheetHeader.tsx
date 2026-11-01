import type { ReactNode } from 'react';
import { FAMILIES, SINGLES } from '../data/sprites';
import { ALL_IDS } from '../lib/layout';
import { SeasonLogo } from './SeasonLogo';

interface SheetHeaderProps {
  page: number;
  pages: number;
}

/** Masthead: TREASURE HUNTERS wordmark plus the collectible counters. Later pages get a slim strip. */
export function SheetHeader({ page, pages }: SheetHeaderProps): ReactNode {
  if (page > 1) {
    return (
      <header className="head cont">
        <h1 className="logo"><SeasonLogo /></h1>
        <div className="sub">
          Sprites checklist · page {page} of {pages}
        </div>
      </header>
    );
  }

  return (
    <header className="head">
      <div className="brand">
        <h1 className="logo"><SeasonLogo /></h1>
        <div className="kicker">
          Sprites Checklist <span>Chapter 7 · Mini Season</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <b>{ALL_IDS.length}</b>
          <span>Sprites</span>
        </div>
        <div className="stat">
          <b>{FAMILIES.length + SINGLES.length}</b>
          <span>Families</span>
        </div>
        {pages > 1 && (
          <div className="stat">
            <b>1/{pages}</b>
            <span>Page</span>
          </div>
        )}
      </div>
    </header>
  );
}
