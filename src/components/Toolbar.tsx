import type { CSSProperties, ReactNode } from 'react';
import type { TickMap } from '../data/sprites';
import { ALL_IDS } from '../lib/layout';

interface ToolbarProps {
  ticks: TickMap;
  onPrint: () => void;
  onReset: () => void;
}

function Meter({ label, count }: { label: string; count: number }): ReactNode {
  const share = ALL_IDS.length ? count / ALL_IDS.length : 0;
  return (
    <div className="meter" style={{ '--share': share } as CSSProperties}>
      <div className="meter-text">
        <span>{label}</span>
        <b>
          {count}
          <small>/{ALL_IDS.length}</small>
        </b>
      </div>
      <div className="meter-bar" role="progressbar" aria-label={label} aria-valuenow={count} aria-valuemax={ALL_IDS.length}>
        <i />
      </div>
    </div>
  );
}

/** Top bar with live progress and the controls. The stylesheet hides it while printing. */
export function Toolbar({ ticks, onPrint, onReset }: ToolbarProps): ReactNode {
  const found = ALL_IDS.filter((id) => ticks[id]?.f).length;
  const mastered = ALL_IDS.filter((id) => ticks[id]?.m).length;

  return (
    <div className="toolbar no-print">
      <div className="tb-brand">
        <b>OVERRIDE</b>
        <span>Sprites</span>
      </div>
      <div className="meters">
        <Meter label="Found" count={found} />
        <Meter label="Mastered" count={mastered} />
      </div>
      <div className="tb-actions">
        <button type="button" className="ghost" onClick={onReset} disabled={found === 0}>
          Reset
        </button>
        <button type="button" onClick={onPrint}>
          Print A4
        </button>
      </div>
    </div>
  );
}
