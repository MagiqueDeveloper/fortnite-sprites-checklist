import type { CSSProperties, ReactNode } from 'react';
import { RARITY_COLOURS, type SpriteFamily, type TickMap } from '../data/sprites';
import { COLUMNS } from '../lib/layout';
import type { ToggleTick } from '../types';
import { Name } from './Name';
import { VariantCell } from './VariantCell';

interface FamilyRowProps {
  family: SpriteFamily;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/**
 * One family: its name, then a cell per tier column with the art and the Found / Mastered
 * boxes. Tiers a family doesn't have show a dash. On phones the same markup is restyled
 * as a card (see mobile.css).
 */
export function FamilyRow({ family, ticks, onToggle }: FamilyRowProps): ReactNode {
  const done = family.variants.filter((variant) => ticks[`${family.id}__${variant}`]?.m).length;

  return (
    <div
      className="mrow"
      role="group"
      aria-label={family.name}
      title={family.ability}
      style={{ '--rar': RARITY_COLOURS[family.rarity] } as CSSProperties}
    >
      <div className="who">
        <Name text={family.name} />
        <span className="rar">{family.rarity}</span>
        <span className={`tally${done === family.variants.length ? ' full' : ''}`}>
          {done}/{family.variants.length}
        </span>
      </div>
      {COLUMNS.map((tier) =>
        family.variants.includes(tier.key) ? (
          <VariantCell key={tier.key} family={family} variant={tier.key} ticks={ticks} onToggle={onToggle} />
        ) : (
          <div className="tcell empty" key={tier.key} aria-hidden="true" />
        ),
      )}
    </div>
  );
}
