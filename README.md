# Fortnite Sprites Checklist (Chapter 7 Season 4 · Override)

A printable A4 checklist for every Sprite variant in Fortnite Chapter 7 Season 4, built with Vite, React and TypeScript.

**Live:** https://magiquedeveloper.github.io/fortnite-sprites-checklist/

## Features

- **73 collectible Sprites** across 19 families, ordered by rarity left to right (Rare, Epic, Legendary, Mythic)
- **Four variants per family** where they exist: base, Cheat Master, Gold and Loot Hacker
- **Found / Mastered tick boxes** per variant, saved in `localStorage` and printed exactly as shown on screen
- **Print A4 button** that prints the previewed sheet container and nothing else, always as a single A4 page
- **Misc section** under the black rule for released Sprites that ship without variants
- **Unreleased section** for announced Sprites, badged with their status
- **Fully offline:** all 75 sprite images ship in `public/sprites/`, so the page makes no external requests
- **Self-fitting names:** long variants such as "Loot Hacker Crash Bandicoot" shrink to stay on one line

Keyboard accessible: each tick box is a focusable `role="checkbox"` that responds to Space and Enter.

## Quick start

```bash
npm install
npm run dev        # dev server
npm run build      # type-check, then build into dist/
npm run typecheck  # tsc --noEmit only
npm run preview    # serve the built output
```

## Offline use

Every sprite image is committed under `public/sprites/`, and nothing in the app points at a remote host. Build once and the result runs with no internet connection:

```bash
npm run build
npm run preview          # or: npx serve dist
```

Browsers refuse to load ES modules from `file://` URLs, so serve `dist/` with any static server rather than double-clicking `index.html`. The deployed GitHub Pages build is self-contained for the same reason: once the page and its assets have loaded, it needs no network access.

## Printing

`Print A4` clones the `.sheet` element into a temporary off-screen document, waits for every sprite image, and prints that document on its own. The on-screen scale-to-fit zoom is dropped for the clone, so the output is a true 210mm page whatever the window width. Print styling isolates the sheet and hides the toolbar, and the sheet keeps a full page height so the grid stretches and the tail sections sit at the bottom of the page.

## Project structure

```
index.html                     Vite entry (mounts the React app)
src/
  main.tsx                     React root, imports the stylesheet entry
  App.tsx                      Thin shell: toolbar plus the sheet
  types.ts                     Shared types (ToggleTick)
  data/sprites.ts              Typed roster: families, variants, rarities, abilities, image paths
  components/
    Sheet.tsx                  The A4 page: header, grid, Misc, Unreleased, footer
    SheetHeader.tsx            OVERRIDE wordmark and the collectible counters
    SheetFooter.tsx            Artwork credit and season marker
    Toolbar.tsx                Print A4 / Reset controls
    FamilyGrid.tsx             Four-column rarity-ordered grid
    FamilyBlock.tsx            One family: rarity header plus its variant cards
    SpriteCard.tsx             One variant: art, name, Found / Mastered
    SingleSpriteCard.tsx       A released Sprite with no variants
    MiscSection.tsx            Single-variant Sprites, under the black rule
    UnreleasedSection.tsx      Announced Sprites and their status badges
    Tick.tsx                   One Found / Mastered checkbox
    Name.tsx                   Auto-shrinking single-line sprite name
  hooks/
    useTicks.ts                Tick state, localStorage persistence, Mastered implies Found
    useFitSheet.ts             A4 scale-to-fit for narrow viewports
  lib/
    printSheet.ts              Clone the sheet into an off-screen document and print it
    asset.ts                   Resolve data paths against the deploy base URL
  styles/
    index.css                  Ordered entry point for the stylesheets below
    base.css                   Design tokens and page defaults
    toolbar.css                Floating controls
    sheet.css                  The A4 page, masthead and footer
    grid.css                   Families, cards, names and tick boxes
    sections.css               Misc and Unreleased sections, badges
    print.css                  @page and @media print rules
public/sprites/                75 sprite images, sorted by family
.github/workflows/deploy.yml   Type-checks, builds and publishes dist/ to GitHub Pages
```

## Sprite image layout

Images are grouped one folder per family, named after the family `id` in `src/data/sprites.ts`:

```
public/sprites/
├── 8bit/             base.png  cheat-master.png  gold.png  loot-hacker.png
├── adventure/        base.png  cheat-master.png  gold.png  loot-hacker.png
├── blinky/           ...
├── bush/
├── crash_bandicoot/
├── crown/
├── jackrabbit/
├── jonesy/
├── killswitch/
├── klombo/
├── mega_man/         base.png (no variants in game)
├── onigiri/
├── overshield/
├── pond/
├── shadow/
├── sonic/
├── storm_scout/
├── tails/
├── x-ray/
└── unreleased/       birthday.png  morgana.png
```

To add or replace art, drop a PNG in the matching folder (transparent background works best) and point the `imgs` entry in `src/data/sprites.ts` at it.

## Rarity sources

Rarities come from the Fortnite Wiki infoboxes, cross-checked against IGN's checklist, and abilities are taken from Epic's own patch notes. Only Sprites with a published rarity and available art are listed as released; anything unconfirmed stays in the Unreleased section rather than being guessed at.

## Hosting

`.github/workflows/deploy.yml` runs on every push to `main`: it installs with `npm ci`, runs `npm run build` (which type-checks with `tsc --noEmit` before bundling), uploads `dist/` and deploys it to GitHub Pages. The build uses `base: './'` so it works from a project subpath.

## Notes

Sprite artwork is property of Epic Games. Rarity, variant names and abilities are as they appear in-game. Cards are tick boxes for your own collection tracking and are not affiliated with Epic Games.
