import type { CSSProperties, ReactNode } from 'react';
import { RARITY_COLOURS, type SpriteFamily, type TickMap } from '../data/sprites';
import { asset } from '../lib/asset';
import type { ToggleTick } from '../types';
import { Name } from './Name';
import { Tick } from './Tick';

interface SingleSpriteCardProps {
  family: SpriteFamily;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** A released Sprite that ships without variants: one card with its name and rarity beside the ticks. */
export function SingleSpriteCard({ family, ticks, onToggle }: SingleSpriteCardProps): ReactNode {
  const name = family.name;
  const id = `${family.id}__base`;
  const row = ticks[id] ?? {};

  return (
    <div
      className="scard"
      title={`${name} · ${family.ability}`}
      style={{ '--rar': RARITY_COLOURS[family.rarity] } as CSSProperties}
    >
      <span className="icon">
        <img
          src={asset(family.imgs[0])}
          alt={name}
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <div className="smeta">
        <Name text={name} />
        <div className="rarline">
          <i className="rule" />
          <span className="rar">{family.rarity.toUpperCase()}</span>
        </div>
      </div>
      <span className="checks">
        <Tick id={id} kind="f" label="Found" sprite={name} on={Boolean(row.f)} onToggle={onToggle} />
        <Tick id={id} kind="m" label="Mastered" sprite={name} on={Boolean(row.m)} onToggle={onToggle} />
      </span>
    </div>
  );
}
