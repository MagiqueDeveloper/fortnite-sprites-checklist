import type { SpriteFamily } from '../data/sprites';

/**
 * How the rows (one per family) are spread over A4 pages. A row is about 8.6mm tall, so
 * a page holds around 24 rows at full size together with the Misc and Unreleased sections; a few
 * more shrink the page slightly (see useSheetFit.ts). Past that, the table continues on
 * a second page. If a roster change ever prints badly, these two numbers are the ones to tune.
 */
export const SINGLE_PAGE_MAX = 26; // up to this many rows share one page with the tail
export const PAGE_MAX = 26; // rows per page once the sheet spills onto more pages

/** Splits the roster into pages of rows, keeping rarity order. */
export function paginate(families: readonly SpriteFamily[]): SpriteFamily[][] {
  if (families.length <= SINGLE_PAGE_MAX) return [[...families]];
  const pages: SpriteFamily[][] = [];
  for (let start = 0; start < families.length; start += PAGE_MAX) {
    pages.push(families.slice(start, start + PAGE_MAX));
  }
  return pages;
}
