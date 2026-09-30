import type { SpriteFamily } from '../data/sprites';

/**
 * How the released families are spread over A4 pages. A row of four families is about
 * 42mm tall, so a page holds 5 rows at natural size, or 6 rows scaled to about 88%
 * (the tail sections take the space of a row). A 7th row would need about 77%, which
 * is too small to tick comfortably, so the sheet spills onto a second page instead.
 * If a roster change ever prints badly, these two numbers are the ones to tune.
 */
export const SINGLE_PAGE_MAX = 24; // up to this many families share one page with the tail
export const PAGE_MAX = 24; // families per page once the sheet spills onto more pages

/** Splits the roster into pages of families, keeping rarity order left to right, top to bottom. */
export function paginate(families: readonly SpriteFamily[]): SpriteFamily[][] {
  if (families.length <= SINGLE_PAGE_MAX) return [[...families]];
  const pages: SpriteFamily[][] = [];
  for (let start = 0; start < families.length; start += PAGE_MAX) {
    pages.push(families.slice(start, start + PAGE_MAX));
  }
  return pages;
}
