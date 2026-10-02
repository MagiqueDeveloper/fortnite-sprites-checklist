import type { ReactNode } from 'react';
import { TIERS, variantName, type SpriteFamily, type TickMap, type VariantKey } from '../data/sprites';
import { asset } from '../lib/asset';
import { variantImage } from '../lib/layout';
import type { ToggleTick } from '../types';
import { Tick } from './Tick';

interface VariantCellProps {
  family: SpriteFamily;
  variant: VariantKey;
  ticks: TickMap;
  onToggle: ToggleTick;
}

/** One collectible: its art and its Found / Mastered boxes. */
export function VariantCell({ family, variant, ticks, onToggle }: VariantCellProps): ReactNode {
  const name = variantName(variant, family.name);
  const id = `${family.id}__${variant}`;
  const row = ticks[id] ?? {};

  return (
    <div className="tcell">
      <span className="icon">
        <img
          src={asset(variantImage(family, variant))}
          alt={name}
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <span className="tiername">{TIERS.find((tier) => tier.key === variant)?.label}</span>
      <span className="checks">
        <Tick id={id} kind="f" label="Found" sprite={name} on={Boolean(row.f)} onToggle={onToggle} />
        <Tick id={id} kind="m" label="Mastered" sprite={name} on={Boolean(row.m)} onToggle={onToggle} />
      </span>
    </div>
  );
}
