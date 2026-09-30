import { useRef, type ReactNode } from 'react';
import { FAMILIES, type TickMap } from '../data/sprites';
import { useSheetFit } from '../hooks/useSheetFit';
import { paginate } from '../lib/pages';
import type { ToggleTick } from '../types';
import { FamilyGrid } from './FamilyGrid';
import { MiscSection } from './MiscSection';
import { SheetFooter } from './SheetFooter';
import { SheetHeader } from './SheetHeader';
import { UnreleasedSection } from './UnreleasedSection';

interface SheetProps {
  ticks: TickMap;
  onToggle: ToggleTick;
}

const PAGES = paginate(FAMILIES);

/**
 * The printable A4 pages. Order matters: the released grid, then the Misc section
 * under the black rule, then Unreleased, then the artwork footer. Normally that is
 * one page; if the roster outgrows it, the families continue onto further pages and
 * the tail sections close the last one.
 */
export function Sheet({ ticks, onToggle }: SheetProps): ReactNode {
  const root = useRef<HTMLDivElement>(null);
  useSheetFit(root, PAGES.length);

  return (
    <div className={PAGES.length === 1 ? 'sheets single' : 'sheets'} ref={root}>
      {PAGES.map((families, index) => {
        const last = index === PAGES.length - 1;
        return (
          <main className="sheet" key={index}>
            <SheetHeader page={index + 1} pages={PAGES.length} />
            <FamilyGrid families={families} ticks={ticks} onToggle={onToggle} />
            {last && (
              <>
                <MiscSection ticks={ticks} onToggle={onToggle} />
                <UnreleasedSection />
                <SheetFooter />
              </>
            )}
          </main>
        );
      })}
    </div>
  );
}
