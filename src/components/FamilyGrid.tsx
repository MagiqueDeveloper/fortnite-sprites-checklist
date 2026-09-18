import type { ReactNode } from 'react';
import { FAMILIES, type TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';
import { FamilyBlock } from './FamilyBlock';

interface FamilyGridProps {
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** The four-column rarity-ordered grid of released families. */
export function FamilyGrid({ ticks, onToggle }: FamilyGridProps): ReactNode {
  return (
    <section className="grid">
      {FAMILIES.map((family) => (
        <FamilyBlock key={family.id} family={family} ticks={ticks} onToggle={onToggle} />
      ))}
    </section>
  );
}
