import type { ReactNode } from 'react';

interface ToolbarProps {
  onPrint: () => void;
  onReset: () => void;
}

/** Floating controls. The stylesheet hides this while printing. */
export function Toolbar({ onPrint, onReset }: ToolbarProps): ReactNode {
  return (
    <div className="toolbar no-print">
      <button type="button" onClick={onPrint}>
        Print A4
      </button>
      <button type="button" className="ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
