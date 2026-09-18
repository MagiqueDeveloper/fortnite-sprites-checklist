import type { CSSProperties, ReactNode } from 'react';
import { RARITY_COLOURS, type SpriteFamily, type TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';
import { SpriteCard } from './SpriteCard';

interface FamilyBlockProps {
  family: SpriteFamily;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** A rarity-tinted family header above its variant cards. */
export function FamilyBlock({ family, ticks, onToggle }: FamilyBlockProps): ReactNode {
  return (
    <div className="fam" style={{ '--rar': RARITY_COLOURS[family.rarity] } as CSSProperties}>
      <div className="famhead">
        <h2>{family.name}</h2>
        <i className="rule" />
        <span className="rar">{family.rarity.toUpperCase()}</span>
      </div>
      <div className="cards">
        {family.variants.map((variant, index) => (
          <SpriteCard
            key={variant}
            family={family}
            variant={variant}
            index={index}
            ticks={ticks}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
