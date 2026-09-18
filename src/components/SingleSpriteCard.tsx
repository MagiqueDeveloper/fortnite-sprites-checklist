import type { CSSProperties, ReactNode } from 'react';
import { RARITY_COLOURS, type SpriteFamily, type TickMap } from '../data/sprites';
import { asset } from '../lib/asset';
import type { ToggleTick } from '../types';
import { Tick } from './Tick';

interface SingleSpriteCardProps {
  family: SpriteFamily;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/**
 * A released Sprite that ships without variants. The family header sits inside
 * the card, in place of a plain title, so it matches the family blocks above.
 */
export function SingleSpriteCard({ family, ticks, onToggle }: SingleSpriteCardProps): ReactNode {
  const id = `${family.id}__base`;
  const row = ticks[id] ?? {};

  return (
    <div
      className="card"
      title={`${family.name} · ${family.ability}`}
      style={{ '--rar': RARITY_COLOURS[family.rarity] } as CSSProperties}
    >
      <span className="icon">
        <img
          src={asset(family.imgs[0])}
          alt={family.name}
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <div className="meta">
        <div className="famhead">
          <h2>{family.name}</h2>
          <i className="rule" />
          <span className="rar">{family.rarity.toUpperCase()}</span>
        </div>
        <div className="checks">
          <Tick id={id} kind="f" label="Found" on={Boolean(row.f)} onToggle={onToggle} />
          <Tick id={id} kind="m" label="Mastered" on={Boolean(row.m)} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}
