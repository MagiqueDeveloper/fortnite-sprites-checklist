#!/usr/bin/env python3
"""Sync the printable checklist roster from spritechecklist.org and IGN.

Primary source for families, variants and art: https://spritechecklist.org/
Cross-check for names, variants and abilities: IGN's Chapter 7 Season 4
Sprites checklist guide.

Writes:
  - public/sprites/<family_id>/<variant>.png  (150x150 RGBA)
  - src/data/sprites.ts                       (FAMILIES + SINGLES)

UNRELEASED is left alone. Existing ability text is kept unless --update-abilities
is passed. Exit code 0 always on success; prints "CHANGED=1" or "CHANGED=0".
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPRITES_TS = ROOT / "src" / "data" / "sprites.ts"
SPRITES_DIR = ROOT / "public" / "sprites"

SC_ORIGIN = "https://spritechecklist.org"
IGN_URL = (
    "https://www.ign.com/wikis/fortnite/"
    "Sprites_Checklist_and_Guide_(Chapter_7_Season_4)_-_All_Variants_and_Mastery_Rewards_List"
)

USER_AGENT = "fortnite-sprites-checklist-sync/1.0 (+https://github.com/MagiqueDeveloper/fortnite-sprites-checklist)"

THEME_TO_VARIANT = {
    "Basic": "base",
    "CheatMaster": "cm",
    "Gold": "gold",
    "LootHacker": "lh",
    "BountyHunter": "bh",
    "TrickOrTreat": "tt",
    "Quack": "qk",
}
# Sheet column order from src/data/sprites.ts TIERS.
VARIANT_ORDER = ["base", "cm", "gold", "lh", "bh", "tt", "qk"]
VARIANT_TO_FILE = {
    "base": "base.png",
    "cm": "cheat-master.png",
    "gold": "gold.png",
    "lh": "loot-hacker.png",
    "bh": "bounty-hunter.png",
    "tt": "trick-or-treat.png",
    "qk": "quack.png",
}
THEME_FILE_SLUG = {
    "Basic": "basic",
    "Gold": "gold",
    "CheatMaster": "cheatmaster",
    "LootHacker": "loothacker",
    "BountyHunter": "bountyhunter",
    "TrickOrTreat": "trickortreat",
    "Quack": "quack",
}
RARITY_ORDER = {"Rare": 0, "Epic": 1, "Legendary": 2, "Mythic": 3}

# spritechecklist id → local family id (folder name in public/sprites/).
SC_ID_TO_LOCAL = {
    "8bit": "8bit",
    "stormscout": "storm_scout",
    "megaman": "mega_man",
    "crash": "crash_bandicoot",
    "deer": "the_deer",
    "dumpsterdive": "dumpster_dive",
    "onewishwillow": "one_wish_willow",
    "xray": "x-ray",
    "spookydash": "spooky_dash",
}


@dataclass
class RemoteFamily:
    sc_id: str
    name: str
    rarity: str
    ability: str
    themes: list[str] = field(default_factory=list)
    added_patch: str | None = None


@dataclass
class LocalFamily:
    id: str
    name: str
    rarity: str
    ability: str
    variants: list[str]
    imgs: list[str]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def fetch_text(url: str) -> str:
    return fetch(url).decode("utf-8", errors="replace")


def resolve_theme_sets(js: str) -> dict[str, list[str]]:
    """Expand the small theme-set aliases used in the Tracker bundle."""
    xa = ["Basic", "Gold", "CheatMaster", "LootHacker", "BountyHunter", "TrickOrTreat", "Quack"]
    ca = ["Basic", "Gold", "CheatMaster"]
    ka = [*ca, "LootHacker"]
    ja = [*ka, "BountyHunter"]
    z = [*ja, "TrickOrTreat"]
    ce = [*z, "Quack"]
    known = {"xa": xa, "Ca": ca, "Ka": ka, "Ja": ja, "z": z, "ce": ce, "Qa": xa}
    # Also accept literal arrays assigned in the bundle.
    for name, value in re.findall(r"\b([A-Za-z_$][\w$]*)=(\[(?:\"[^\"]+\"(?:,)?)+\])", js):
        try:
            known[name] = json.loads(value.replace("'", '"'))
        except json.JSONDecodeError:
            continue
    return known


def _object_field(obj: str, key: str) -> str | None:
    """Return the raw value text for a top-level field inside a `{...}` object literal."""
    match = re.search(
        rf'(?:^|,){re.escape(key)}:("(?:\\.|[^"\\])*"|!\d|true|false|\[[^\]]*\]|[A-Za-z_$][\w$]*)',
        obj,
    )
    return match.group(1) if match else None


def parse_sc_roster(js: str) -> list[RemoteFamily]:
    """Pull Season 4 families out of the spritechecklist Tracker bundle."""
    start = js.find('Za=[{id:"bush"')
    if start < 0:
        start = js.find('{id:"bush",name:"Bush"')
    if start < 0:
        raise RuntimeError("Could not find Season 4 roster (Za) in Tracker bundle")

    # Cut before Season 3 helper maps that follow the S4 array usage.
    end_markers = ['themeOrder:', 'sprites:Ya.map', 'updatedDate:"2026-08-07"']
    end = len(js)
    for marker in end_markers:
        idx = js.find(marker, start)
        if 0 <= idx < end:
            end = idx
    chunk = js[start:end]
    theme_sets = resolve_theme_sets(js)

    families: list[RemoteFamily] = []
    seen: set[str] = set()
    for match in re.finditer(r'\{id:"([a-z0-9]+)"[\s\S]*?\}', chunk):
        obj = match.group(0)
        sc_id = match.group(1)
        if sc_id in seen:
            continue

        released_raw = _object_field(obj, "released")
        if released_raw not in {"!0", "true"}:
            continue

        name_raw = _object_field(obj, "name")
        rarity_raw = _object_field(obj, "rarity")
        ability_raw = _object_field(obj, "ability")
        if not name_raw or not rarity_raw:
            continue
        name = json.loads(name_raw)
        rarity = json.loads(rarity_raw)
        if rarity not in RARITY_ORDER:
            continue

        themes_raw = _object_field(obj, "themes")
        rthemes = _object_field(obj, "releasedThemes")
        themes: list[str]
        if themes_raw and themes_raw.startswith("["):
            themes = json.loads(themes_raw.replace("'", '"'))
        elif rthemes and rthemes in theme_sets:
            themes = theme_sets[rthemes]
        elif themes_raw and themes_raw in theme_sets:
            themes = theme_sets[themes_raw]
        else:
            themes = theme_sets["z"]

        ability = ""
        if ability_raw and ability_raw.startswith('"'):
            ability = json.loads(ability_raw)

        patch_raw = _object_field(obj, "addedPatch")
        patch = json.loads(patch_raw) if patch_raw and patch_raw.startswith('"') else None

        seen.add(sc_id)
        families.append(
            RemoteFamily(
                sc_id=sc_id,
                name=name,
                rarity=rarity,
                ability=ability,
                themes=[t for t in themes if t in THEME_TO_VARIANT],
                added_patch=patch,
            )
        )

    if len(families) < 20:
        raise RuntimeError(f"Season 4 roster parse looked short ({len(families)} families)")
    return families


def find_tracker_bundle_url(home_html: str) -> str:
    # Home page loads a tiny stub that imports the real Tracker module.
    stubs = re.findall(r'/_astro/Tracker\.[^"/]+\.js', home_html)
    if not stubs:
        # Fall back to any Tracker module reference on the sprites index.
        sprites_html = fetch_text(f"{SC_ORIGIN}/sprites/")
        stubs = re.findall(r'/_astro/Tracker\.[^"/]+\.js', sprites_html)
    if not stubs:
        raise RuntimeError("Could not locate Tracker.*.js on spritechecklist.org")

    seen: list[str] = []
    for stub in stubs:
        url = SC_ORIGIN + stub
        if url in seen:
            continue
        seen.append(url)
        js = fetch_text(url)
        imports = re.findall(r'from"(\./Tracker\.[^"]+\.js)"', js)
        if imports:
            return SC_ORIGIN + "/_astro/" + imports[0].removeprefix("./")
        if 'Za=[{id:"bush"' in js or '{id:"bush",name:"Bush"' in js:
            return url
    raise RuntimeError("Tracker stub did not point at a roster bundle")


def parse_ign_checklist(html: str) -> dict[str, dict]:
    """Map family display name → {variants, ability, rarity} from the IGN guide."""
    # IGN inlines rows like "Cheat Master Overshield Sprite" and ability blurbs
    # next to the base card. Work from the visible text.
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "\n", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"\n+", "\n", text)

    tier_prefix = (
        "Cheat Master",
        "Gold",
        "Loot Hacker",
        "Bounty Hunter",
        "Trick or Treat",
        "Quack",
    )
    families: dict[str, dict] = {}
    current: str | None = None

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        section = re.match(r"^(?P<name>.+?) Sprites$", line)
        if section and "All " not in section.group("name") and "Misc" not in section.group("name"):
            current = section.group("name").strip()
            families.setdefault(current, {"variants": {"base"}, "ability": "", "rarity": ""})
            continue

        if line in {"Rare", "Epic", "Legendary", "Mythic"} and current:
            families[current]["rarity"] = line
            continue

        m = re.match(r"^(?P<full>(?:(?P<tier>Cheat Master|Gold|Loot Hacker|Bounty Hunter|Trick or Treat|Quack) )?(?P<base>.+?)) Sprite$", line)
        if not m:
            continue
        base = m.group("base").strip()
        tier = m.group("tier")
        families.setdefault(base, {"variants": set(), "ability": "", "rarity": ""})
        if tier is None:
            families[base]["variants"].add("base")
            current = base
        else:
            families[base]["variants"].add(THEME_TO_VARIANT[{"Cheat Master": "CheatMaster", "Gold": "Gold", "Loot Hacker": "LootHacker", "Bounty Hunter": "BountyHunter", "Trick or Treat": "TrickOrTreat", "Quack": "Quack"}[tier]])
            current = base

    # Abilities: "Grants Overshield..." style sentences that follow a rarity line
    # are brittle in plain text; pull from the earlier WebFetch-friendly pattern
    # "Name Sprite Rare <ability> Name Sprite Item details".
    for name, ability, rarity in re.findall(
        r"([A-Za-z0-9][A-Za-z0-9' \-]*?) Sprite\s+(Rare|Epic|Legendary|Mythic)\s+(.+?)\s+\1 Sprite Item details",
        text,
    ):
        name = name.strip()
        families.setdefault(name, {"variants": {"base"}, "ability": "", "rarity": ""})
        families[name]["rarity"] = rarity
        families[name]["ability"] = ability.strip()

    # Normalize variant sets to lists.
    for data in families.values():
        data["variants"] = sorted(data["variants"], key=lambda v: list(THEME_TO_VARIANT.values()).index(v))
    return families


def local_id_for(sc_id: str, slug: str | None = None) -> str:
    if sc_id in SC_ID_TO_LOCAL:
        return SC_ID_TO_LOCAL[sc_id]
    if slug:
        return slug.replace("-", "_") if slug != "x-ray" else "x-ray"
    return sc_id


def load_local_families() -> tuple[list[LocalFamily], list[LocalFamily], str]:
    source = SPRITES_TS.read_text(encoding="utf-8")

    def extract(name: str) -> list[LocalFamily]:
        m = re.search(
            rf"export const {name}: SpriteFamily\[\] = \[(?P<body>.*?)\] as SpriteFamily\[\]",
            source,
            flags=re.S,
        )
        if not m:
            raise RuntimeError(f"Could not find {name} in sprites.ts")
        body = m.group("body").strip()
        if not body:
            return []
        # Each entry is a single-line JSON object.
        items = []
        for line in body.splitlines():
            line = line.strip().rstrip(",")
            if not line:
                continue
            items.append(json.loads(line))
        return [
            LocalFamily(
                id=item["id"],
                name=item["name"],
                rarity=item["rarity"],
                ability=item["ability"],
                variants=list(item["variants"]),
                imgs=list(item["imgs"]),
            )
            for item in items
        ]

    return extract("FAMILIES"), extract("SINGLES"), source


def remote_image_url(sc_id: str, theme: str) -> str:
    return f"{SC_ORIGIN}/sprites/s4_{sc_id}_{THEME_FILE_SLUG[theme]}.webp"


def ensure_png(
    sc_id: str,
    theme: str,
    dest: Path,
    *,
    dry_run: bool,
    refresh: bool,
) -> bool:
    """Download and resize art. Returns True if the file was written/changed."""
    if dest.exists() and not refresh:
        return False

    url = remote_image_url(sc_id, theme)
    try:
        raw = fetch(url)
    except Exception as exc:  # noqa: BLE001 - surface per-image failures
        raise RuntimeError(f"Failed to download {url}: {exc}") from exc

    from io import BytesIO

    img = Image.open(BytesIO(raw)).convert("RGBA")
    if img.size != (150, 150):
        img = img.resize((150, 150), Image.Resampling.LANCZOS)

    buf = BytesIO()
    img.save(buf, format="PNG", optimize=True)
    new_bytes = buf.getvalue()

    if dest.exists():
        if dest.read_bytes() == new_bytes:
            return False
        try:
            old = Image.open(dest).convert("RGBA")
            if old.size == img.size and list(old.getdata()) == list(img.getdata()):
                return False
        except OSError:
            pass

    if dry_run:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(new_bytes)
    return True


def merge_roster(
    local_families: list[LocalFamily],
    local_singles: list[LocalFamily],
    remote: list[RemoteFamily],
    ign: dict[str, dict],
    update_abilities: bool,
) -> tuple[list[LocalFamily], list[LocalFamily], list[str]]:
    notes: list[str] = []
    by_name = {f.name.lower(): f for f in local_families + local_singles}
    by_id = {f.id: f for f in local_families + local_singles}

    merged: dict[str, LocalFamily] = {}

    for rem in remote:
        # Prefer slug-based ids when present in SC_ID_TO_LOCAL / known locals.
        lid = SC_ID_TO_LOCAL.get(rem.sc_id, rem.sc_id)
        # Resolve against existing local rows by name first (stable ids).
        existing = by_name.get(rem.name.lower())
        if existing:
            lid = existing.id
        elif lid not in by_id and rem.sc_id not in SC_ID_TO_LOCAL:
            # Derive from hyphenated names when brand new.
            lid = re.sub(r"[^a-z0-9]+", "_", rem.name.lower()).strip("_")
            if rem.name == "X-Ray":
                lid = "x-ray"
            if rem.name == "8-Bit":
                lid = "8bit"

        variant_set = {THEME_TO_VARIANT[t] for t in rem.themes if t in THEME_TO_VARIANT}
        variants = [v for v in VARIANT_ORDER if v in variant_set]
        # Prefer the intersection-confirmed set when IGN also lists the family.
        ign_row = ign.get(rem.name)
        if ign_row and ign_row.get("variants"):
            ign_variants = set(ign_row["variants"])
            # Keep remote themes; only note gaps on IGN. Never drop Quack/etc.
            # that spritechecklist marks released.
            missing_on_ign = [v for v in variants if v not in ign_variants]
            if missing_on_ign:
                notes.append(
                    f"IGN has not listed {rem.name} variants {missing_on_ign}; keeping spritechecklist.org set"
                )

        imgs = [f"sprites/{lid}/{VARIANT_TO_FILE[v]}" for v in variants]

        if existing:
            ability = rem.ability if update_abilities and rem.ability else existing.ability
            rarity = rem.rarity
            if ign_row and ign_row.get("rarity") and ign_row["rarity"] != rem.rarity:
                notes.append(
                    f"Rarity mismatch for {rem.name}: spritechecklist={rem.rarity}, IGN={ign_row['rarity']} (using spritechecklist)"
                )
            if existing.rarity != rarity:
                notes.append(f"Rarity {existing.name}: {existing.rarity} → {rarity}")
            added = [v for v in variants if v not in existing.variants]
            if added:
                notes.append(f"New variants for {existing.name}: {', '.join(added)}")
            merged[lid] = LocalFamily(
                id=lid,
                name=existing.name,
                rarity=rarity,
                ability=ability,
                variants=variants,
                imgs=imgs,
            )
        else:
            ability = rem.ability
            if ign_row and ign_row.get("ability"):
                ability = ign_row["ability"]
            notes.append(f"New family: {rem.name} ({rem.rarity}) variants={variants}")
            merged[lid] = LocalFamily(
                id=lid,
                name=rem.name,
                rarity=rem.rarity,
                ability=ability or f"{rem.name} Sprite",
                variants=variants,
                imgs=imgs,
            )

    # Preserve local order for families that remain, then append newcomers by rarity.
    ordered_ids = [f.id for f in local_families if f.id in merged]
    ordered_ids += [f.id for f in local_singles if f.id in merged and f.id not in ordered_ids]
    for fam in sorted(merged.values(), key=lambda f: (RARITY_ORDER[f.rarity], f.name.lower())):
        if fam.id not in ordered_ids:
            ordered_ids.append(fam.id)

    families_out: list[LocalFamily] = []
    singles_out: list[LocalFamily] = []
    for lid in ordered_ids:
        fam = merged[lid]
        if fam.variants == ["base"]:
            singles_out.append(fam)
        else:
            families_out.append(fam)

    # Drop locals the sources no longer list only when both agree they are gone.
    remote_names = {r.name.lower() for r in remote}
    for old in local_families + local_singles:
        if old.name.lower() not in remote_names and old.id not in merged:
            notes.append(f"Kept local-only family not seen upstream: {old.name}")
            if old.variants == ["base"]:
                singles_out.append(old)
            else:
                families_out.append(old)

    return families_out, singles_out, notes


def render_sprites_ts(source: str, families: list[LocalFamily], singles: list[LocalFamily]) -> str:
    def dump(rows: list[LocalFamily]) -> str:
        if not rows:
            return ""
        lines = []
        for row in rows:
            payload = {
                "id": row.id,
                "name": row.name,
                "rarity": row.rarity,
                "ability": row.ability,
                "variants": row.variants,
                "imgs": row.imgs,
            }
            lines.append("  " + json.dumps(payload, ensure_ascii=False) + ",")
        return "\n".join(lines) + "\n"

    out = source
    out = re.sub(
        r"export const FAMILIES: SpriteFamily\[\] = \[.*?\] as SpriteFamily\[\];*",
        "export const FAMILIES: SpriteFamily[] = [\n" + dump(families) + "] as SpriteFamily[];",
        out,
        count=1,
        flags=re.S,
    )
    out = re.sub(
        r"export const SINGLES: SpriteFamily\[\] = \[.*?\] as SpriteFamily\[\];*",
        "export const SINGLES: SpriteFamily[] = [\n" + dump(singles) + "] as SpriteFamily[];",
        out,
        count=1,
        flags=re.S,
    )
    return out


def update_readme_counts(families: list[LocalFamily], singles: list[LocalFamily]) -> bool:
    readme = ROOT / "README.md"
    if not readme.exists():
        return False
    text = readme.read_text(encoding="utf-8")
    total = sum(len(f.variants) for f in families + singles)
    fam_count = len(families) + len(singles)
    new = text
    new = re.sub(r"\*\*\d+ collectible Sprites\*\*", f"**{total} collectible Sprites**", new)
    new = re.sub(r"across \d+ families", f"across {fam_count} families", new)
    new = re.sub(r"out of \d+", f"out of {total}", new)
    new = re.sub(r"all \d+ sprite images", f"all {total} sprite images", new)
    new = re.sub(r"all \d+ sprites", f"all {total} sprites", new)
    if new == text:
        return False
    readme.write_text(new, encoding="utf-8")
    return True


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Report changes without writing")
    parser.add_argument(
        "--update-abilities",
        action="store_true",
        help="Overwrite local ability text from upstream sources",
    )
    parser.add_argument(
        "--skip-images",
        action="store_true",
        help="Only update sprites.ts (no downloads)",
    )
    parser.add_argument(
        "--refresh-images",
        action="store_true",
        help="Re-download art even when the local PNG already exists",
    )
    args = parser.parse_args(list(argv) if argv is not None else None)

    print("Fetching spritechecklist.org…")
    home = fetch_text(f"{SC_ORIGIN}/")
    tracker_url = find_tracker_bundle_url(home)
    print(f"Tracker bundle: {tracker_url}")
    tracker_js = fetch_text(tracker_url)
    remote = parse_sc_roster(tracker_js)
    print(f"spritechecklist.org: {len(remote)} released Season 4 families")

    print("Fetching IGN checklist…")
    ign: dict[str, dict] = {}
    try:
        ign_html = fetch_text(IGN_URL)
        ign = parse_ign_checklist(ign_html)
        print(f"IGN: {len(ign)} family sections parsed")
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: IGN fetch/parse failed ({exc}); continuing with spritechecklist.org only")

    local_families, local_singles, source = load_local_families()
    families, singles, notes = merge_roster(
        local_families, local_singles, remote, ign, update_abilities=args.update_abilities
    )

    changed = False
    image_changes = 0

    if not args.skip_images:
        sc_by_name = {r.name.lower(): r for r in remote}
        for fam in families + singles:
            rem = sc_by_name.get(fam.name.lower())
            if not rem:
                continue
            for theme in rem.themes:
                variant = THEME_TO_VARIANT[theme]
                if variant not in fam.variants:
                    continue
                dest = SPRITES_DIR / fam.id / VARIANT_TO_FILE[variant]
                try:
                    if ensure_png(
                        rem.sc_id,
                        theme,
                        dest,
                        dry_run=args.dry_run,
                        refresh=args.refresh_images,
                    ):
                        image_changes += 1
                        changed = True
                        action = "Would update" if args.dry_run else "Updated"
                        notes.append(f"{action} art {dest.relative_to(ROOT)}")
                except RuntimeError as exc:
                    # Missing remote art for a listed theme is a soft error.
                    notes.append(str(exc))

    new_source = render_sprites_ts(source, families, singles)
    if new_source != source:
        changed = True
        notes.append(f"{'Would update' if args.dry_run else 'Updated'} {SPRITES_TS.relative_to(ROOT)}")
        if not args.dry_run:
            SPRITES_TS.write_text(new_source, encoding="utf-8")

    if not args.dry_run:
        if update_readme_counts(families, singles):
            changed = True
            notes.append("Updated README.md counts")

    total = sum(len(f.variants) for f in families + singles)
    print(f"Roster: {len(families) + len(singles)} families, {total} variants; image writes: {image_changes}")
    for note in notes:
        print(f"- {note}")

    # Fingerprint for CI summaries.
    fingerprint = hashlib.sha256(new_source.encode()).hexdigest()[:12]
    print(f"CHANGED={'1' if changed else '0'} FINGERPRINT={fingerprint}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
