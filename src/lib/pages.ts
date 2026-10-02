import type { SpriteFamily } from '../data/sprites';

/**
 * How the released families are spread over A4 pages. A row of four families is about
 * 42mm tall, so a page holds 5 rows (20 families) at natural size with the tail sections.
 * A sixth row only fits by shrinking the page to about 80%: the ticks drop under 8px, and
 * Chrome and WebKit lay a shrunken page out slightly differently when printing, so it
 * overflowed in WebKit. Past 20 families the sheet therefore continues on a second page.
 * If a roster change ever prints badly, these two numbers are the ones to tune.
 */
export const SINGLE_PAGE_MAX = 20; // up to this many families share one page with the tail
export const PAGE_MAX = 20; // families per page once the sheet spills onto more pages

/** Splits the roster into pages of families, keeping rarity order left to right, top to bottom. */
export function paginate(families: readonly SpriteFamily[]): SpriteFamily[][] {
  if (families.length <= SINGLE_PAGE_MAX) return [[...families]];
  const pages: SpriteFamily[][] = [];
  for (let start = 0; start < families.length; start += PAGE_MAX) {
    pages.push(families.slice(start, start + PAGE_MAX));
  }
  return pages;
}
