import type { SpriteFamily } from '../data/sprites';

/** Larger three-form rows keep the current roster readable on A4.
 * Leave room for the header, single-form section, and footer on each page.
 */
export const SINGLE_PAGE_MAX = 14;
export const PAGE_MAX = 14;

/** Splits the roster into pages of rows, keeping rarity order. */
export function paginate(families: readonly SpriteFamily[]): SpriteFamily[][] {
  if (families.length <= SINGLE_PAGE_MAX) return [[...families]];
  const pages: SpriteFamily[][] = [];
  for (let start = 0; start < families.length; start += PAGE_MAX) {
    pages.push(families.slice(start, start + PAGE_MAX));
  }
  return pages;
}
