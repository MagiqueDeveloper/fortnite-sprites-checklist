import type { ReactNode } from 'react';
import type { SpriteFamily, TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';
import { FamilyBlock } from './FamilyBlock';

interface FamilyGridProps {
  families: readonly SpriteFamily[];
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** The four-column rarity-ordered grid of released families. */
export function FamilyGrid({ families, ticks, onToggle }: FamilyGridProps): ReactNode {
  return (
    <section className="grid">
      {families.map((family) => (
        <FamilyBlock key={family.id} family={family} ticks={ticks} onToggle={onToggle} />
      ))}
    </section>
  );
}
