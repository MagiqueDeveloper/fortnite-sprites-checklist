import type { ReactNode } from 'react';
import type { TickKey } from '../data/sprites';
import type { ToggleTick } from '../types';

interface TickProps {
  id: string;
  kind: TickKey;
  label: string;
  /** The Sprite this box belongs to, for screen readers. */
  sprite: string;
  on: boolean;
  onToggle: ToggleTick;
}

/** One tick box. A focusable role="checkbox" that also answers Space and Enter. */
export function Tick({ id, kind, label, sprite, on, onToggle }: TickProps): ReactNode {
  return (
    <span
      className={`chk${on ? ' on' : ''}`}
      role="checkbox"
      aria-checked={on}
      aria-label={`${label}: ${sprite}`}
      title={`${label}: ${sprite}`}
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
      <i data-l={kind.toUpperCase()} />
      <span className="lbl">{label}</span>
    </span>
  );
}
