import type { ReactNode } from 'react';
import { SINGLES, type TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';
import { SingleSpriteCard } from './SingleSpriteCard';

interface MiscSectionProps {
  ticks: TickMap;
  onToggle: ToggleTick;
}

/**
 * Released Sprites with no variants of their own. Sits under the black rule,
 * above the Unreleased section.
 */
export function MiscSection({ ticks, onToggle }: MiscSectionProps): ReactNode {
  return (
    <section className="misc">
      <div className="unhead">
        <i className="bar" />
        <h2>Misc Sprites</h2>
        <span className="rar">SINGLE VARIANT</span>
      </div>
      <div className="singlecards">
        {SINGLES.map((family) => (
          <SingleSpriteCard key={family.id} family={family} ticks={ticks} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}
