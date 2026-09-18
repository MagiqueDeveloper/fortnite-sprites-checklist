import type { ReactNode, RefObject } from 'react';
import type { TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';
import { FamilyGrid } from './FamilyGrid';
import { MiscSection } from './MiscSection';
import { SheetFooter } from './SheetFooter';
import { SheetHeader } from './SheetHeader';
import { UnreleasedSection } from './UnreleasedSection';

interface SheetProps {
  sheetRef: RefObject<HTMLElement | null>;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/**
 * The printable A4 page. Order matters: the released grid, then the Misc section
 * under the black rule, then Unreleased, then the artwork footer.
 */
export function Sheet({ sheetRef, ticks, onToggle }: SheetProps): ReactNode {
  return (
    <main className="sheet" ref={sheetRef}>
      <SheetHeader />
      <FamilyGrid ticks={ticks} onToggle={onToggle} />
      <MiscSection ticks={ticks} onToggle={onToggle} />
      <UnreleasedSection />
      <SheetFooter />
    </main>
  );
}
