import type { TickKey } from './data/sprites';

/** Toggle the Found ('f') or Mastered ('m') tick of one variant. */
export type ToggleTick = (id: string, kind: TickKey) => void;
