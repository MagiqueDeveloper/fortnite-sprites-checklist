import { FAMILIES, SINGLES, TIERS, type Rarity, type SpriteFamily, type VariantKey } from '../data/sprites';

/** The tier columns on the sheet, in order: every tier, even one only a single family has. */
export const COLUMNS = TIERS;

/** Every tickable variant id, for the progress counters. */
export const ALL_IDS: string[] = [...FAMILIES, ...SINGLES].flatMap((family) =>
  family.variants.map((variant) => `${family.id}__${variant}`),
);

/** Art for one variant of a family. */
export function variantImage(family: SpriteFamily, variant: VariantKey): string {
  return family.imgs[family.variants.indexOf(variant)];
}

/** Splits rows into runs of the same rarity, keeping their order. */
export function groupByRarity(families: readonly SpriteFamily[]): { rarity: Rarity; families: SpriteFamily[] }[] {
  const groups: { rarity: Rarity; families: SpriteFamily[] }[] = [];
  for (const family of families) {
    const last = groups[groups.length - 1];
    if (last && last.rarity === family.rarity) last.families.push(family);
    else groups.push({ rarity: family.rarity, families: [family] });
  }
  return groups;
}
