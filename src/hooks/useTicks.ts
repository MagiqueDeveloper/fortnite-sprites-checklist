import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY, type TickMap } from "../data/sprites";
import { ALL_IDS } from "../lib/layout";
import { sanitizeTicks, toggleTick } from "../lib/progress";
import type { ToggleTick } from "../types";

function readStoredTicks(): TickMap {
  try {
    return sanitizeTicks(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"),
      ALL_IDS,
    );
  } catch {
    return {};
  }
}
export function useTicks() {
  const [ticks, setTicks] = useState<TickMap>(readStoredTicks);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticks));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [ticks]);
  const toggle = useCallback<ToggleTick>((id, kind) => {
    if (ALL_IDS.includes(id)) setTicks((prev) => toggleTick(prev, id, kind));
  }, []);
  const reset = useCallback(() => setTicks({}), []);
  const restore = useCallback(
    (value: unknown) => setTicks(sanitizeTicks(value, ALL_IDS)),
    [],
  );
  return { ticks, toggle, reset, restore, saved };
}
