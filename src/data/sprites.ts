// Sprite roster for Fortnite Chapter 7 Season 4 (Override).
//
// `imgs` and `img` are paths inside public/, relative to the deployed base URL,
// so every sprite is served from this project and the sheet works fully offline.
// Artwork is property of Epic Games, collected from the IGN wiki and the
// Fortnite Wiki for the v42.20 crossover Sprites and the Bounty Hunter tier.

export type Rarity = 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type VariantKey = 'base' | 'cm' | 'gold' | 'lh' | 'bh' | 'tt';
export type TickKey = 'f' | 'm';

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
  badge: 'new' | 'das';
  /** Badge text: the creator credit for Design-A-Sprite, or the status for crossovers. */
  label: string;
  by: string;
  tip: string;
}

export type TickMap = Record<string, Partial<Record<TickKey, boolean>>>;

export const RARITY_COLOURS: Record<Rarity, string> = {
  Rare: '#2f7fe4',
  Epic: '#9b4dff',
  Legendary: '#ff9d2e',
  Mythic: '#ff4d6d',
};

/** The tier columns, in sheet order. */
export const TIERS: { key: VariantKey; label: string }[] = [
  { key: 'base', label: 'Base' },
  { key: 'cm', label: 'Cheat Master' },
  { key: 'gold', label: 'Gold' },
  { key: 'lh', label: 'Loot Hacker' },
  { key: 'bh', label: 'Bounty Hunter' },
  { key: 'tt', label: 'Trick or Treat' },
];

/** Full name of one variant, as it appears in game: "Cheat Master Onigiri". */
export function variantName(variant: VariantKey, family: string): string {
  const tier = TIERS.find((t) => t.key === variant)?.label;
  return variant === 'base' || !tier ? family : `${tier} ${family}`;
}

export const STORAGE_KEY = 'ch7s4-sprites-v4';

export const FAMILIES: SpriteFamily[] = [
  {"id": "onigiri", "name": "Onigiri", "rarity": "Rare", "ability": "Grants Overdrive after using a Consumable item, lasting longer per level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/onigiri/base.png", "sprites/onigiri/cheat-master.png", "sprites/onigiri/gold.png", "sprites/onigiri/loot-hacker.png", "sprites/onigiri/bounty-hunter.png"]},
  {"id": "storm_scout", "name": "Storm Scout", "rarity": "Rare", "ability": "Grants Overdrive after taking a certain amount of storm damage; at max level it reveals future Storm Circles", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/storm_scout/base.png", "sprites/storm_scout/cheat-master.png", "sprites/storm_scout/gold.png", "sprites/storm_scout/loot-hacker.png", "sprites/storm_scout/bounty-hunter.png"]},
  {"id": "8bit", "name": "8-Bit", "rarity": "Rare", "ability": "Gives you an 8-Bit Shotgun in your first chest and grants a score multiplier", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/8bit/base.png", "sprites/8bit/cheat-master.png", "sprites/8bit/gold.png", "sprites/8bit/loot-hacker.png", "sprites/8bit/bounty-hunter.png"]},
  {"id": "bush", "name": "Bush", "rarity": "Rare", "ability": "Puts a Bush on you after a duration; at level 5 you gain a Bush after eliminations", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/bush/base.png", "sprites/bush/cheat-master.png", "sprites/bush/gold.png", "sprites/bush/loot-hacker.png", "sprites/bush/bounty-hunter.png"]},
  {"id": "adventure", "name": "Adventure", "rarity": "Rare", "ability": "Upgrades a random item in your inventory each time you level it up", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/adventure/base.png", "sprites/adventure/cheat-master.png", "sprites/adventure/gold.png", "sprites/adventure/loot-hacker.png", "sprites/adventure/bounty-hunter.png"]},
  {"id": "jonesy", "name": "Jonesy", "rarity": "Rare", "ability": "Slowly recovers some Health and Shield for a short duration after taking damage", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/jonesy/base.png", "sprites/jonesy/cheat-master.png", "sprites/jonesy/gold.png", "sprites/jonesy/loot-hacker.png", "sprites/jonesy/bounty-hunter.png"]},
  {"id": "birthday", "name": "Birthday", "rarity": "Rare", "ability": "Opening Chests has a chance to drop a Birthday Cake Slice (10 Health and 10 Shield); at max level, eliminations can drop one too", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/birthday/base.png", "sprites/birthday/cheat-master.png", "sprites/birthday/gold.png", "sprites/birthday/loot-hacker.png", "sprites/birthday/bounty-hunter.png"]},
  {"id": "overshield", "name": "Overshield", "rarity": "Epic", "ability": "Grants Overshield, with more per level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/overshield/base.png", "sprites/overshield/cheat-master.png", "sprites/overshield/gold.png", "sprites/overshield/loot-hacker.png", "sprites/overshield/bounty-hunter.png"]},
  {"id": "sonic", "name": "Sonic", "rarity": "Epic", "ability": "Increases Sprint speed", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/sonic/base.png", "sprites/sonic/cheat-master.png", "sprites/sonic/gold.png", "sprites/sonic/loot-hacker.png", "sprites/sonic/bounty-hunter.png"]},
  {"id": "tails", "name": "Tails", "rarity": "Epic", "ability": "Allows you to hover for a short duration", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/tails/base.png", "sprites/tails/cheat-master.png", "sprites/tails/gold.png", "sprites/tails/loot-hacker.png", "sprites/tails/bounty-hunter.png"]},
  {"id": "shadow", "name": "Shadow", "rarity": "Epic", "ability": "Automatically reloads your weapons over time, even when unequipped", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/shadow/base.png", "sprites/shadow/cheat-master.png", "sprites/shadow/gold.png", "sprites/shadow/loot-hacker.png", "sprites/shadow/bounty-hunter.png"]},
  {"id": "pond", "name": "Pond", "rarity": "Epic", "ability": "Jump shortly after landing to launch a Super Jump, higher and more often with each Sprite Level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/pond/base.png", "sprites/pond/cheat-master.png", "sprites/pond/gold.png", "sprites/pond/loot-hacker.png", "sprites/pond/bounty-hunter.png"]},
  {"id": "morgana", "name": "Morgana", "rarity": "Epic", "ability": "Increases the effectiveness of healing items, scaling with each level up. Persona 5 crossover", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/morgana/base.png", "sprites/morgana/cheat-master.png", "sprites/morgana/gold.png", "sprites/morgana/loot-hacker.png", "sprites/morgana/bounty-hunter.png"]},
  {"id": "dumpster_dive", "name": "Dumpster Dive", "rarity": "Epic", "ability": "Food provides bonus healing; find food when jumping out of hiding props, with a small chance from containers. Finds better food with each level", "variants": ["base", "gold", "lh", "bh"], "imgs": ["sprites/dumpster_dive/base.png", "sprites/dumpster_dive/gold.png", "sprites/dumpster_dive/loot-hacker.png", "sprites/dumpster_dive/bounty-hunter.png"]},
  {"id": "killswitch", "name": "Killswitch", "rarity": "Legendary", "ability": "Grants Hangtime with improved accuracy: midair slow-mo aim, no weapon bloom", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/killswitch/base.png", "sprites/killswitch/cheat-master.png", "sprites/killswitch/gold.png", "sprites/killswitch/loot-hacker.png", "sprites/killswitch/bounty-hunter.png"]},
  {"id": "jackrabbit", "name": "Jackrabbit", "rarity": "Legendary", "ability": "Allows you to double-jump", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/jackrabbit/base.png", "sprites/jackrabbit/cheat-master.png", "sprites/jackrabbit/gold.png", "sprites/jackrabbit/loot-hacker.png", "sprites/jackrabbit/bounty-hunter.png"]},
  {"id": "x-ray", "name": "X-Ray", "rarity": "Legendary", "ability": "Periodically marks nearby enemies; frequency and radius increase with each level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/x-ray/base.png", "sprites/x-ray/cheat-master.png", "sprites/x-ray/gold.png", "sprites/x-ray/loot-hacker.png", "sprites/x-ray/bounty-hunter.png"]},
  {"id": "blinky", "name": "Blinky", "rarity": "Legendary", "ability": "Grants you Cloak when you take damage, which increases with each level. Pac-Man crossover", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/blinky/base.png", "sprites/blinky/cheat-master.png", "sprites/blinky/gold.png", "sprites/blinky/loot-hacker.png", "sprites/blinky/bounty-hunter.png"]},
  {"id": "crash_bandicoot", "name": "Crash Bandicoot", "rarity": "Legendary", "ability": "Jump to trigger a whirlwind attack, which damages and knocks back enemies. Damage increases with each level.", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/crash_bandicoot/base.png", "sprites/crash_bandicoot/cheat-master.png", "sprites/crash_bandicoot/gold.png", "sprites/crash_bandicoot/loot-hacker.png", "sprites/crash_bandicoot/bounty-hunter.png"]},
  {"id": "vampire", "name": "Vampire", "rarity": "Legendary", "ability": "Recover health when damaging an enemy; the share recovered grows with each level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/vampire/base.png", "sprites/vampire/cheat-master.png", "sprites/vampire/gold.png", "sprites/vampire/loot-hacker.png", "sprites/vampire/bounty-hunter.png"]},
  {"id": "the_deer", "name": "The Deer", "rarity": "Legendary", "ability": "Melee attacks deal more damage, increasing with each level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/the_deer/base.png", "sprites/the_deer/cheat-master.png", "sprites/the_deer/gold.png", "sprites/the_deer/loot-hacker.png", "sprites/the_deer/bounty-hunter.png"]},
  {"id": "klombo", "name": "Klombo", "rarity": "Mythic", "ability": "Drops random items at each level; levels up only with consumables that grant Health or Shield", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/klombo/base.png", "sprites/klombo/cheat-master.png", "sprites/klombo/gold.png", "sprites/klombo/loot-hacker.png", "sprites/klombo/bounty-hunter.png"]},
  {"id": "crown", "name": "Crown", "rarity": "Mythic", "ability": "Grants extra Crown Wins after a Victory Royale; levels up by winning matches", "variants": ["base", "cm", "gold", "lh", "bh", "tt"], "imgs": ["sprites/crown/base.png", "sprites/crown/cheat-master.png", "sprites/crown/gold.png", "sprites/crown/loot-hacker.png", "sprites/crown/bounty-hunter.png", "sprites/crown/trick-or-treat.png"]},
  {"id": "spooky_dash", "name": "Spooky Dash", "rarity": "Mythic", "ability": "Rechargeable dash that lets you phase through some objects; the charge cooldown shortens with each level", "variants": ["base", "cm", "gold", "lh", "bh"], "imgs": ["sprites/spooky_dash/base.png", "sprites/spooky_dash/cheat-master.png", "sprites/spooky_dash/gold.png", "sprites/spooky_dash/loot-hacker.png", "sprites/spooky_dash/bounty-hunter.png"]},
] as SpriteFamily[];

// Released Sprites that ship without variants (single cards in the Misc section).
export const SINGLES: SpriteFamily[] = [
  {"id": "mega_man", "name": "Mega Man", "rarity": "Rare", "ability": "Slide around like Mega Man, with slide length increased per level", "variants": ["base"], "imgs": ["sprites/mega_man/base.png"]},
] as SpriteFamily[];

export const UNRELEASED: UnreleasedSprite[] = [
  {"name": "Trick or Treat Variants", "img": "sprites/crown/trick-or-treat.png", "badge": "new", "label": "Due Oct 8", "by": "", "tip": "The other 23 Trick or Treat variants arrive October 8 from Fortnitemares Cheat Codes. Only the Crown is out so far"},
  {"name": "Obsession", "img": null, "badge": "new", "label": "Due Oct 15", "by": "", "tip": "Announced for October 15 alongside Honey"},
  {"name": "Honey", "img": null, "badge": "das", "label": "By Conejito_sam", "by": "By Conejito_sam", "tip": "Design-A-Sprite Contest winner. Bees swarm attackers"},
] as UnreleasedSprite[];
