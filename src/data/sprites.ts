// Sprite roster for Fortnite Chapter 7 Season 4 (Override).
// Artwork: IGN CDN (oyster.ignimgs.com) for released variants,
// the Fortnite Wiki for the v42.20 crossover Sprites.

export type Rarity = 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Misc';
export type VariantKey = 'base' | 'cm' | 'gold' | 'lh';

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
  by: string;
  tip: string;
}

export type TickMap = Record<string, Partial<Record<TickKey, boolean>>>;
export type TickKey = 'f' | 'm';

export const RARITY_COLOURS: Record<Rarity, string> = {
  Rare: '#2f7fe4',
  Epic: '#9b4dff',
  Legendary: '#ff9d2e',
  Mythic: '#ff4d6d',
  Misc: '#5b6472',
};

export const VARIANTS: Record<VariantKey, { cls: string; label: (name: string) => string }> = {
  base: { cls: '', label: (n) => n },
  cm: { cls: 'cheat', label: (n) => `Cheat Master ${n}` },
  gold: { cls: 'gold', label: (n) => `Gold ${n}` },
  lh: { cls: 'lh', label: (n) => `Loot Hacker ${n}` },
};

export const STORAGE_KEY = 'ch7s4-sprites-v4';

export const FAMILIES: SpriteFamily[] = [
  {"id": "overshield", "name": "Overshield", "rarity": "Rare", "ability": "Grants Overshield, with more per level", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/10/Fortnite_overshield_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/b/bf/Fortnite_cheat_master_overshield_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/2/2c/Fortnite_gold_overshield_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/88/Fortnite_loot_hacker_overshield_sprite.png?width=300&format=png"]},
  {"id": "onigiri", "name": "Onigiri", "rarity": "Rare", "ability": "Grants Overdrive after using a Consumable item, lasting longer per level", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/62/Fortnite_onigiri_sprite_CORRECT.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/0/0d/Fortnite_cheat_master_onigiri_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/4/4a/Fortnite_gold_onigiri_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/b/b2/Fortnite_loot_hacker_onigiri_sprite.png?width=300&format=png"]},
  {"id": "storm_scout", "name": "Storm Scout", "rarity": "Rare", "ability": "Grants Overdrive after taking a certain amount of storm damage; at max level it reveals future Storm Circles", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/a3/Fortnite_storm_scout_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/3/31/Fortnite_cheat_master_storm_scout_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/64/Fortnite_gold_storm_scout_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/d/df/Fortnite_loot_hacker_storm_scout_sprite.png?width=300&format=png"]},
  {"id": "8bit", "name": "8-Bit", "rarity": "Rare", "ability": "Gives you an 8-Bit Shotgun in your first chest and grants a score multiplier", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/0/0b/Fortnite_8bit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/84/Fortnite_cheat_master_8bit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/9/9e/Fortnite_gold_8bit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/b/be/Fortnite_loot_hacker_8-bit_sprite.png?width=300&format=png"]},
  {"id": "bush", "name": "Bush", "rarity": "Rare", "ability": "Puts a Bush on you after a duration; at level 5 you gain a Bush after eliminations", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/2/28/Fortnite_bush_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/6d/Fortnite_cheat_master_bush_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/f/fa/Fortnite_gold_bush_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/0/00/Fortnite_loot_hacker_bush_sprite.png?width=300&format=png"]},
  {"id": "adventure", "name": "Adventure", "rarity": "Rare", "ability": "Upgrades a random item in your inventory each time you level it up", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/d/db/Fortnite_adventure_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/19/Fortnite_cheat_master_adventure_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/7/71/Fortnite_gold_adventure_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/5/55/Fortnite_loot_hacker_adventure_sprite.png?width=300&format=png"]},
  {"id": "jonesy", "name": "Jonesy", "rarity": "Rare", "ability": "Slowly recovers some Health and Shield for a short duration after taking damage", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/e/ed/Fortnite_jonesy_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/2/2a/Fortnite_cheat_master_jonesy_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/68/Fortnite_gold_jonesy_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/87/Fortnite_loot_hacker_jonesy_sprite.png?width=300&format=png"]},
  {"id": "sonic", "name": "Sonic", "rarity": "Epic", "ability": "Increases Sprint speed", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/ab/Fortnite_sonic_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/7/7b/Fortnite_cheat_master_sonic_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/5/55/Fortnite_gold_sonic_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/f/ff/Fortnite_loot_hacker_sonic_sprite.png?width=300&format=png"]},
  {"id": "tails", "name": "Tails", "rarity": "Epic", "ability": "Allows you to hover for a short duration", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/8a/Fortnite_tails_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/d/d8/Fortnite_cheat_master_tails_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/7/7c/Fortnite_gold_tails_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/a4/Fortnite_loot_hacker_tails_sprite.png?width=300&format=png"]},
  {"id": "shadow", "name": "Shadow", "rarity": "Epic", "ability": "Automatically reloads your weapons over time, even when unequipped", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/64/Fortnite_shadow_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/6d/Fortnite_cheat_master_shadow_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/3/3c/Fortnite_gold_shadow_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/c/c6/Fortnite_loot_hacker_shadow_sprite.png?width=300&format=png"]},
  {"id": "killswitch", "name": "Killswitch", "rarity": "Epic", "ability": "Grants Hangtime with improved accuracy: midair slow-mo aim, no weapon bloom", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/a0/Fortnite_killswitch_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/18/Fortnite_cheat_master_killswitch_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/7/76/Fortnite_gold_killswitch_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/17/Fortnite_loot_hacker_killswitch_sprite.png?width=300&format=png"]},
  {"id": "jackrabbit", "name": "Jackrabbit", "rarity": "Legendary", "ability": "Allows you to double-jump", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/18/Fortnite_jackrabbit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/1f/Fortnite_cheat_master_jackrabbit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/3/3e/Fortnite_gold_jackrabbit_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/e/e6/Fortnite_loot_hacker_jackrabbit_sprite.png?width=300&format=png"]},
  {"id": "x-ray", "name": "X-Ray", "rarity": "Legendary", "ability": "Periodically marks nearby enemies; frequency and radius increase with each level", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/0/09/Fortnite_x-ray_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/5/54/Fortnite_cheat_master_x-ray_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/6/6d/Fortnite_gold_x-ray_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/ae/Fortnite_loot_hacker_x-ray_sprite.png?width=300&format=png"]},
  {"id": "klombo", "name": "Klombo", "rarity": "Mythic", "ability": "Drops random items at each level; levels up only with consumables that grant Health or Shield", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/8e/Fortnite_klombo_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/1e/Fortnite_cheat_master_klombo_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/c/ce/Fortnite_gold_klombo_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/14/Fortnite_loot_hacker_klombo_sprite.png?width=300&format=png"]},
  {"id": "crown", "name": "Crown", "rarity": "Mythic", "ability": "Grants extra Crown Wins after a Victory Royale; levels up by winning matches", "variants": ["base", "cm", "gold", "lh"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/b/b2/Fortnite_crown_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/1/17/Fortnite_cheat_master_crown_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/5/59/Fortnite_gold_crown_sprite.png?width=300&format=png", "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/8/82/Fortnite_loot_hacker_crown_sprite.png?width=300&format=png"]},
  {"id": "mega_man", "name": "Mega Man", "rarity": "Misc", "ability": "Slide around like Mega Man, with slide length increased per level", "variants": ["base"], "imgs": ["https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/4/41/Fortnite_mega_man_sprite.png?width=300&format=png"]},
] as SpriteFamily[];

export const UNRELEASED: UnreleasedSprite[] = [
  {"name": "Crash Bandicoot", "img": "https://fortnite.weirdgloop.org/images/Crash_Bandicoot_Sprite_-_Item_-_Fortnite.png?3643a", "badge": "new", "by": "", "tip": "Jump in air to trigger a whirlwind attack that damages and knocks back nearby enemies"},
  {"name": "Morgana", "img": "https://fortnite.weirdgloop.org/images/Morgana_Sprite_-_Item_-_Fortnite.png?e1c26", "badge": "new", "by": "", "tip": "Increases the effectiveness of healing items, scaling with each level up. Persona 5 crossover"},
  {"name": "Blinky", "img": "https://fortnite.weirdgloop.org/images/Blinky_Sprite_-_Item_-_Fortnite.png?db2f4", "badge": "new", "by": "", "tip": "Found at night. Grants a temporary cloak when you take damage. Pac-Man crossover"},
  {"name": "Birthday", "img": "https://fortnite.weirdgloop.org/images/Birthday_Sprite_-_Item_-_Fortnite.png?b5970", "badge": "new", "by": "", "tip": "Opening chests has a chance to spawn a piece of cake; eliminations can spawn cake at max level"},
  {"name": "Pond", "img": null, "badge": "das", "by": "By Pine & Kiri", "tip": "Super Jump on landing. Design-A-Sprite Contest winner"},
  {"name": "Dumpster Dive", "img": null, "badge": "das", "by": "By StinkyPrincessGoose", "tip": "Design-A-Sprite Contest winner"},
  {"name": "Honey", "img": null, "badge": "das", "by": "By Conejito_sam", "tip": "Design-A-Sprite Contest winner. Bees swarm attackers"},
] as UnreleasedSprite[];
