import type { TickKey, TickMap } from "../data/sprites";

/** Accept only current collectible ids and literal booleans from storage/imports. */
export function sanitizeTicks(value: unknown, ids: readonly string[]): TickMap {
  const clean: TickMap = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return clean;
  for (const id of ids) {
    const row: unknown = Object.hasOwn(value, id)
      ? (value as Record<string, unknown>)[id]
      : undefined;
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const flags = row as Record<string, unknown>;
    const m = flags.m === true;
    if (flags.f === true || m) clean[id] = { f: true, m };
  }
  return clean;
}
export function toggleTick(ticks: TickMap, id: string, kind: TickKey): TickMap {
  const row = { ...ticks[id], [kind]: !ticks[id]?.[kind] };
  if (kind === "m" && row.m) row.f = true;
  if (kind === "f" && !row.f) row.m = false;
  return { ...ticks, [id]: row };
}
