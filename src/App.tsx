import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  FAMILIES,
  RARITY_COLOURS,
  STORAGE_KEY,
  UNRELEASED,
  VARIANTS,
  type SpriteFamily,
  type TickKey,
  type TickMap,
  type UnreleasedSprite,
  type VariantKey,
} from './data/sprites';

const A4_WIDTH_PX = 794; // 210mm at 96dpi

type ToggleTick = (id: string, kind: TickKey) => void;

function readTicks(): TickMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TickMap) : {};
  } catch {
    return {};
  }
}

interface TickProps {
  id: string;
  kind: TickKey;
  label: string;
  on: boolean;
  onToggle: ToggleTick;
}

function Tick({ id, kind, label, on, onToggle }: TickProps): ReactNode {
  return (
    <span
      className={`chk${on ? ' on' : ''}`}
      role="checkbox"
      aria-checked={on}
      tabIndex={0}
      data-id={id}
      data-k={kind}
      data-sprite="1"
      onClick={() => onToggle(id, kind)}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          onToggle(id, kind);
        }
      }}
    >
      <i />
      {label}
    </span>
  );
}

interface SpriteCardProps {
  family: SpriteFamily;
  variant: VariantKey;
  index: number;
  ticks: TickMap;
  onToggle: ToggleTick;
}

function SpriteCard({ family, variant, index, ticks, onToggle }: SpriteCardProps): ReactNode {
  const meta = VARIANTS[variant];
  const id = `${family.id}__${variant}`;
  const name = meta.label(family.name);
  const row = ticks[id] ?? {};

  return (
    <div className="card" title={`${name} · ${family.ability}`}>
      <span className="icon">
        <img
          src={family.imgs[index]}
          alt={name}
          loading="eager"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <div className="meta">
        <div className={`name${meta.cls ? ' ' + meta.cls : ''}`}>{name}</div>
        <div className="checks">
          <Tick id={id} kind="f" label="Found" on={Boolean(row.f)} onToggle={onToggle} />
          <Tick id={id} kind="m" label="Mastered" on={Boolean(row.m)} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}

interface FamilyProps {
  family: SpriteFamily;
  ticks: TickMap;
  onToggle: ToggleTick;
}

function Family({ family, ticks, onToggle }: FamilyProps): ReactNode {
  return (
    <div className="fam" style={{ '--rar': RARITY_COLOURS[family.rarity] } as CSSProperties}>
      <div className="famhead">
        <i className="pip" />
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

function UnreleasedCard({ sprite }: { sprite: UnreleasedSprite }): ReactNode {
  return (
    <div className="ucard" title={sprite.tip}>
      {sprite.img ? <img src={sprite.img} alt={sprite.name} /> : <span className="q">?</span>}
      <div className="ucardtxt">
        <div className="n">{sprite.name}</div>
        <div className="ubadge">
          <span className={`badge ${sprite.badge}`}>
            {sprite.badge === 'new' ? 'New in v42.20' : sprite.by}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function App(): ReactNode {
  const [ticks, setTicks] = useState<TickMap>(readTicks);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticks));
    } catch {
      /* storage unavailable (private mode, restricted origins) */
    }
  }, [ticks]);

  // The sheet is always a true A4 page: narrow viewports scale it instead of reflowing,
  // so what you see on screen is exactly what prints.
  useEffect(() => {
    const fit = (): void => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const available = document.documentElement.clientWidth - 24;
      sheet.style.zoom = Math.min(1, available / A4_WIDTH_PX).toFixed(3);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const toggle: ToggleTick = (id, kind) => {
    setTicks((prev) => {
      const row = { ...(prev[id] ?? {}) };
      row[kind] = !row[kind];
      if (kind === 'm' && row.m) row.f = true;
      if (kind === 'f' && !row.f) row.m = false;
      return { ...prev, [id]: row };
    });
  };

  const total = FAMILIES.reduce((sum, family) => sum + family.variants.length, 0);

  return (
    <>
      <div className="toolbar no-print">
        <button type="button" onClick={() => window.print()}>
          Print A4
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (window.confirm('Clear all ticks?')) setTicks({});
          }}
        >
          Reset
        </button>
        <span className="hint">Ticks save in this browser and print exactly as shown</span>
      </div>

      <main className="sheet" ref={sheetRef}>
        <header className="head">
          <div className="brand">
            <div className="logo" data-text="OVERRIDE">
              OVERRIDE
            </div>
          </div>
          <div className="stats">
            <div className="bigcount">
              <span>{total}</span> <em>Collectible Sprites</em>
            </div>
            <div className="sub">
              {FAMILIES.length} sprite families · {total} available variants
            </div>
          </div>
        </header>

        <section className="grid">
          {FAMILIES.map((family) => (
            <Family key={family.id} family={family} ticks={ticks} onToggle={toggle} />
          ))}
        </section>

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
          <div className="unfoot">
            Not yet obtainable. Purple: new in v42.20 · Green: Design-A-Sprite Contest winner.
          </div>
        </section>

        <footer className="foot">
          <div>Sprite artwork © Epic Games. Rarity and variant names as they appear in-game.</div>
          <div className="r">Chapter 7 Season 4 · Override</div>
        </footer>
      </main>
    </>
  );
}
