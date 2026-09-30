import type { ReactNode } from 'react';
import { Sheet } from './components/Sheet';
import { Toolbar } from './components/Toolbar';
import { useTicks } from './hooks/useTicks';

/** Printable Fortnite Sprites checklist: floating controls plus a single A4 sheet. */
export default function App(): ReactNode {
  const { ticks, toggle, reset } = useTicks();

  return (
    <>
      <Toolbar
        onPrint={() => window.print()}
        onReset={() => {
          if (window.confirm('Clear all ticks?')) reset();
        }}
      />
      <Sheet ticks={ticks} onToggle={toggle} />
    </>
  );
}
