import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEY, type TickMap } from '../data/sprites';
import type { ToggleTick } from '../types';

function readStoredTicks(): TickMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TickMap) : {};
  } catch {
    return {};
  }
}

/**
 * Found / Mastered ticks, persisted to localStorage.
 * Mastered implies Found; clearing Found clears Mastered.
 */
export function useTicks() {
  const [ticks, setTicks] = useState<TickMap>(readStoredTicks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticks));
    } catch {
      /* storage unavailable (private mode, restricted origins) */
    }
  }, [ticks]);

  const toggle = useCallback<ToggleTick>((id, kind) => {
    setTicks((prev) => {
      const row = { ...(prev[id] ?? {}) };
      row[kind] = !row[kind];
      if (kind === 'm' && row.m) row.f = true;
      if (kind === 'f' && !row.f) row.m = false;
      return { ...prev, [id]: row };
    });
  }, []);

  const reset = useCallback(() => setTicks({}), []);

  return { ticks, toggle, reset };
}
