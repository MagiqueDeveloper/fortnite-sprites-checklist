import type { ReactNode } from 'react';
import { UNRELEASED, type UnreleasedSprite } from '../data/sprites';
import { asset } from '../lib/asset';

function UnreleasedCard({ sprite }: { sprite: UnreleasedSprite }): ReactNode {
  return (
    <div className="ucard" title={sprite.tip}>
      {sprite.img ? <img src={asset(sprite.img)} alt={sprite.name} /> : <span className="q">?</span>}
      <div className="ucardtxt">
        <div className="n">{sprite.name}</div>
        <div className="ubadge">
          <span className={`badge ${sprite.badge}`}>{sprite.label}</span>
        </div>
      </div>
    </div>
  );
}

/** Sprites that are announced but not in the game yet. No ticks, no muted copy. */
export function UnreleasedSection(): ReactNode {
  return (
    <section className="unreleased">
      <div className="unhead">
        <i className="bar" />
        <h2>Unreleased Sprites</h2>
        <span className="rar">NOT IN GAME</span>
      </div>
      <div className="wincards">
        {UNRELEASED.map((sprite) => (
          <UnreleasedCard key={sprite.name} sprite={sprite} />
        ))}
      </div>
    </section>
  );
}
