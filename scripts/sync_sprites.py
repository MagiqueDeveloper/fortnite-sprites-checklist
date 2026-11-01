#!/usr/bin/env python3
"""Sync Treasure Hunters from Sprite Catch, validating all art before changing data."""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from io import BytesIO
import json
from pathlib import Path
import re
import tempfile
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = 'https://spritecatch.com/news/treasure-hunters-new-sprites/'
VARIANTS = {'Base': 'base', 'Fortune': 'fortune', 'Cursed': 'cursed', 'Gold': 'gold'}
RARITIES = ['Rare', 'Epic', 'Legendary', 'Mythic']

class RosterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell, self.slug = [], None, None, None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'tr':
            self.row, self.slug = [], None
        elif tag in ('th', 'td') and self.row is not None:
            self.cell = []
        elif tag == 'a' and self.cell is not None:
            match = re.fullmatch(r'/sprites/([a-z0-9-]+)/', attrs.get('href', ''))
            if match:
                self.slug = match[1]

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ('th', 'td') and self.cell is not None:
            self.row.append(' '.join(''.join(self.cell).split()))
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            if self.slug and len(self.row) == 4:
                self.rows.append((self.slug, self.row))
            self.row = None

def parse_roster(html):
    parser = RosterParser()
    parser.feed(html)
    families, seen = [], set()
    for slug, (name, rarity, ability, variants_text) in parser.rows:
        if slug in seen or rarity not in RARITIES:
            raise ValueError('Duplicate family or unknown rarity')
        names = [v.strip() for v in variants_text.split(',')]
        if len(names) != len(set(names)) or any(v not in VARIANTS for v in names) or 'Base' not in names:
            raise ValueError(f'Unsupported variant set for {name}: {names}')
        seen.add(slug)
        variants = [value for label, value in VARIANTS.items() if label in names]
        families.append(dict(id=slug, name=name, rarity=rarity, ability=ability,
                             variants=variants, imgs=[f'sprites/{slug}/{v}.png' for v in variants]))
    if not 11 <= len(families) <= 100:
        raise ValueError(f'Unexpected roster size: {len(families)}')
    return sorted(families, key=lambda f: (RARITIES.index(f['rarity']), f['name']))

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; SpriteChecklist/2.0)'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()

def image_urls(html, family):
    pattern = rf'https://img\.spritecatch\.com/sprites/{re.escape(family["id"])}/(base|fortune|cursed|gold)-[a-f0-9]+\.png'
    urls = {match[1]: match[0] for match in re.finditer(pattern, html)}
    missing = set(family['variants']) - urls.keys()
    if missing:
        raise ValueError(f'Missing art for {family["id"]}: {sorted(missing)}')
    return urls

def sync(dry_run=False, refresh=False):
    families = parse_roster(fetch(SOURCE_URL).decode())
    target = ROOT / 'src/data/treasure-hunters.json'
    # Stage everything first: a failed download must never publish broken data.
    with tempfile.TemporaryDirectory() as directory:
        staged = Path(directory)
        def stage(family):
            urls = image_urls(fetch(f'https://spritecatch.com/sprites/{family["id"]}/').decode(), family)
            for variant, path in zip(family['variants'], family['imgs']):
                dest = ROOT / 'public' / path
                if dest.exists() and not refresh:
                    continue
                image = Image.open(BytesIO(fetch(urls[variant]))).convert('RGBA')
                image.thumbnail((150, 150), Image.Resampling.LANCZOS)
                canvas = Image.new('RGBA', (150, 150))
                canvas.alpha_composite(image, ((150-image.width)//2, (150-image.height)//2))
                output = staged / path
                output.parent.mkdir(parents=True, exist_ok=True)
                canvas.save(output, optimize=True)
        with ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(stage, families))
        data = json.dumps(families, ensure_ascii=False, indent=2) + '\n'
        changes = [(file, ROOT / 'public' / file.relative_to(staged)) for file in staged.rglob('*.png')]
        changes = [(src, dst) for src, dst in changes if not dst.exists() or src.read_bytes() != dst.read_bytes()]
        changed = bool(changes) or not target.exists() or target.read_text() != data
        if not dry_run:
            for src, dst in changes:
                dst.parent.mkdir(parents=True, exist_ok=True)
                dst.write_bytes(src.read_bytes())
            target.write_text(data)
    print(f'Roster: {len(families)} families, {sum(len(f["variants"]) for f in families)} variants')
    print(f'CHANGED={int(changed)}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--refresh-images', action='store_true')
    args = parser.parse_args()
    sync(args.dry_run, args.refresh_images)
