import type { ReactNode } from 'react';
import { Sheet } from './components/Sheet';
import { Toolbar } from './components/Toolbar';
import { useFitSheet } from './hooks/useFitSheet';
import { useTicks } from './hooks/useTicks';
import { printSheet } from './lib/printSheet';

/** Printable Fortnite Sprites checklist: floating controls plus a single A4 sheet. */
export default function App(): ReactNode {
  const { ticks, toggle, reset } = useTicks();
  const sheetRef = useFitSheet<HTMLElement>();

  return (
    <>
      <Toolbar
        onPrint={() => {
          const sheet = sheetRef.current;
          if (sheet) void printSheet(sheet);
        }}
        onReset={() => {
          if (window.confirm('Clear all ticks?')) reset();
        }}
      />
      <Sheet sheetRef={sheetRef} ticks={ticks} onToggle={toggle} />
    </>
  );
}
