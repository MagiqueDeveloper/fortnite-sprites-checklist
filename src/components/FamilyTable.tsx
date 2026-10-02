import type { CSSProperties, ReactNode } from 'react';
import { RARITY_COLOURS, type SpriteFamily, type TickMap } from '../data/sprites';
import { COLUMNS, groupByRarity } from '../lib/layout';
import type { ToggleTick } from '../types';
import { FamilyRow } from './FamilyRow';

interface FamilyTableProps {
  families: readonly SpriteFamily[];
  ticks: TickMap;
  onToggle: ToggleTick;
}

/**
 * The released Sprites: a row per family, a column per tier. Rows are banded by rarity,
 * each band marked by a coloured rail with the rarity running down it.
 */
export function FamilyTable({ families, ticks, onToggle }: FamilyTableProps): ReactNode {
  return (
    <section className="matrix" style={{ '--cols': COLUMNS.length } as CSSProperties}>
      <div className="mhead" aria-hidden="true">
        <div className="mhead-key">
          <span><b>F</b> Found</span>
          <span><b>M</b> Mastered</span>
        </div>
        {COLUMNS.map((tier) => (
          <div key={tier.key} className={`tier-${tier.key}`}>
            {tier.label}
          </div>
        ))}
      </div>
      {groupByRarity(families).map((group, index) => (
        <div
          className="band"
          key={`${group.rarity}-${index}`}
          style={{ '--rar': RARITY_COLOURS[group.rarity] } as CSSProperties}
        >
          <div className="rail" aria-hidden="true">
            <span>{group.rarity}</span>
          </div>
          <div className="rows" role="rowgroup" aria-label={`${group.rarity} Sprites`}>
            {group.families.map((family) => (
              <FamilyRow key={family.id} family={family} ticks={ticks} onToggle={onToggle} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
