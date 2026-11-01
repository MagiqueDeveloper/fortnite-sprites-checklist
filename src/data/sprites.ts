import roster from "./treasure-hunters.json";

export type Rarity = "Rare" | "Epic" | "Legendary" | "Mythic";
export type VariantKey = "base" | "fortune" | "cursed" | "gold";
export type TickKey = "f" | "m";
export interface SpriteFamily {
  id: string;
  name: string;
  rarity: Rarity;
  ability: string;
  variants: VariantKey[];
  imgs: string[];
}
export interface UnreleasedSprite {
  name: string;
  img: string | null;
  badge: "new" | "das";
  label: string;
  by: string;
  tip: string;
}
export type TickMap = Record<string, Partial<Record<TickKey, boolean>>>;
export const RARITY_COLOURS: Record<Rarity, string> = {
  Rare: "#397fc1",
  Epic: "#9164b7",
  Legendary: "#b47721",
  Mythic: "#be5963",
};
export const TIERS: { key: VariantKey; label: string }[] = [
  { key: "base", label: "Base" },
  { key: "fortune", label: "Fortune" },
  { key: "cursed", label: "Cursed" },
  ...(roster.some((f) => f.variants.includes("gold"))
    ? [{ key: "gold" as const, label: "Gold" }]
    : []),
];
export function variantName(variant: VariantKey, family: string): string {
  return variant === "base"
    ? family
    : `${TIERS.find((t) => t.key === variant)?.label ?? variant} ${family}`;
}
// Separate season key. The existing Override key is deliberately preserved.
export const STORAGE_KEY = "treasure-hunters-sprites-v1";
const typedRoster = roster as SpriteFamily[];
export const FAMILIES = typedRoster.filter((f) => f.variants.length > 1);
export const SINGLES = typedRoster.filter((f) => f.variants.length === 1);
export const UNRELEASED: UnreleasedSprite[] = [];
