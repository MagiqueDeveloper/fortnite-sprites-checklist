import type { ReactNode } from 'react';
import { VARIANTS, type SpriteFamily, type TickMap, type VariantKey } from '../data/sprites';
import { asset } from '../lib/asset';
import type { ToggleTick } from '../types';
import { Name } from './Name';
import { Tick } from './Tick';

interface SpriteCardProps {
  family: SpriteFamily;
  variant: VariantKey;
  index: number;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** One variant row: art, auto-fitting name and the Found / Mastered ticks. */
export function SpriteCard({ family, variant, index, ticks, onToggle }: SpriteCardProps): ReactNode {
  const meta = VARIANTS[variant];
  const id = `${family.id}__${variant}`;
  const name = meta.label(family.name);
  const row = ticks[id] ?? {};

  return (
    <div className="card" title={`${name} · ${family.ability}`}>
      <span className="icon">
        <img
          src={asset(family.imgs[index])}
          alt={name}
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <div className="meta">
        <Name text={name} variantClass={meta.cls || undefined} />
        <div className="checks">
          <Tick id={id} kind="f" label="Found" on={Boolean(row.f)} onToggle={onToggle} />
          <Tick id={id} kind="m" label="Mastered" on={Boolean(row.m)} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}
