import type { ReactNode } from 'react';
import { Sheet } from './components/Sheet';
import { Toolbar } from './components/Toolbar';
import { useTicks } from './hooks/useTicks';

/** Printable Fortnite Sprites checklist: a progress bar with the controls, then the A4 pages. */
export default function App(): ReactNode {
  const { ticks, toggle, reset } = useTicks();

  return (
    <>
      <Toolbar
        ticks={ticks}
        onPrint={() => window.print()}
        onReset={() => {
          if (window.confirm('Clear all ticks?')) reset();
        }}
      />
      <Sheet ticks={ticks} onToggle={toggle} />
    </>
  );
}
