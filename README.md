# Fortnite Sprites Checklist (Chapter 7 Season 4 · Override)

A printable A4 checklist for every Sprite variant in Fortnite Chapter 7 Season 4, built with Vite, React and TypeScript.

**Live:** https://magiquedeveloper.github.io/fortnite-sprites-checklist/

## Features

- **101 collectible Sprites** across 21 families, ordered by rarity left to right (Rare, Epic, Legendary, Mythic)
- **Five variants per family** where they exist: base, Cheat Master, Gold, Loot Hacker and Bounty Hunter. Mega Man ships base only
- **Found / Mastered tick boxes** per variant, saved in `localStorage` and printed exactly as shown on screen
- **Print A4 button** that runs the browser's normal print on the same page you see, always as a single A4 page (Ctrl+P gives the identical result)
- **Misc section** under the black rule for released Sprites that ship without variants
- **Unreleased section** for announced Sprites, badged with their status
- **Fully offline:** all 101 sprite images ship in `public/sprites/`, so the page makes no external requests
- **Offline ready after the first visit:** a service worker precaches the whole site, so later visits work with no connection at all
- **Installable:** a web app manifest with icons, so it can be added to a phone home screen or desktop as its own window
- **Phone-friendly:** below 820px wide the page switches from the A4 sheet to a single column (two on tablets) of large cards with big tap targets; printing always gives the A4 sheet
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

### Offline caching and install

`public/sw.js` registers a service worker (production builds only, via `src/lib/registerServiceWorker.ts`). `vite build` stamps it (see `stampServiceWorker` in `vite.config.ts`) with a hash of the built files and the list of files to precache:

- **Install** precaches the whole site (shell, hashed JS and CSS, all 101 sprites, icons) into a cache named after that hash.
- **Navigations** are network-first, so a redeploy is picked up while online, and fall back to the cached page when there is no connection.
- **Everything else** is stale-while-revalidate: served from the cache instantly and refreshed in the background, so replaced sprite art shows up on the next visit even though sprite filenames are not content-hashed.
- **Activate** deletes the caches of older builds, so there is nothing to bump by hand.

The result: visit once online, then the checklist opens and prints with the network switched off. Clearing site data (or unregistering the worker in DevTools → Application) removes the cached copy.

`public/manifest.webmanifest` plus `public/icon-192.png`, `icon-512.png` and `icon-maskable-512.png` make it installable: use the browser's Install or Add to Home Screen action for a standalone window that launches from the cache.

## Printing

`Print A4` calls `window.print()`, so it is exactly what Ctrl+P does. `print.css` sets `@page` to A4 with an 8mm margin, hides the toolbar, and drops the on-screen scale-to-fit zoom, so the output is a true 210mm page whatever the window width. The sheet's 8mm screen padding matches that margin, so the preview and the paper share the same content box. The sheet is a flex column, so the Misc section, the Unreleased section and the credit line are always pinned to the foot of the page: any spare height becomes a gap under the family grid (`margin-bottom:auto` on `.grid`). In print the sheet is a fixed 268mm tall, 13mm short of the 281mm printable area. That slack matters: WebKit (Safari, Orion) lays the page out a little taller than Chrome, and a sheet sized to the full page pushed the footer onto a second page there. If you add content, check that it still prints on one page in Chrome and Safari.

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
  lib/
    asset.ts                   Resolve data paths against the deploy base URL
    registerServiceWorker.ts   Register the offline worker in production builds
  styles/
    index.css                  Ordered entry point for the stylesheets below
    base.css                   Design tokens and page defaults
    toolbar.css                Floating controls
    sheet.css                  The A4 page, masthead and footer
    grid.css                   Families, cards, names and tick boxes
    sections.css               Misc and Unreleased sections, badges
    mobile.css                 Single-column phone and tablet layout (screen only)
    print.css                  @page and @media print rules
public/sprites/                101 sprite images, sorted by family
public/sw.js                   Offline service worker (stamped with a build hash and precache list at build time)
public/manifest.webmanifest    Installable app manifest
public/icon-192.png            App icons (192, 512 and a maskable 512)
.github/workflows/deploy.yml   Type-checks, builds and publishes dist/ to GitHub Pages
```

## Sprite image layout

Images are grouped one folder per family, named after the family `id` in `src/data/sprites.ts`:

```
public/sprites/
├── 8bit/             base.png  cheat-master.png  gold.png  loot-hacker.png  bounty-hunter.png
├── adventure/        base.png  cheat-master.png  gold.png  loot-hacker.png  bounty-hunter.png
├── blinky/           ...
├── birthday/
├── bush/
├── crash_bandicoot/
├── crown/
├── jackrabbit/
├── jonesy/
├── killswitch/
├── klombo/
├── mega_man/         base.png (no variants in game)
├── morgana/
├── onigiri/
├── overshield/
├── pond/
├── shadow/
├── sonic/
├── storm_scout/
├── tails/
└── x-ray/
```

To add or replace art, drop a PNG in the matching folder (transparent background works best) and point the `imgs` entry in `src/data/sprites.ts` at it.

## Rarity sources

Rarities come from the Fortnite Wiki infoboxes, cross-checked against IGN's checklist, and abilities are taken from Epic's own patch notes. Only Sprites with a published rarity and available art are listed as released; anything unconfirmed stays in the Unreleased section rather than being guessed at.

Bounty Hunter art and names come from IGN's checklist, and the tier is tracked for every released family. Birthday (Rare, live 26 Sep) and Morgana (Epic, live 24 Sep) joined the released roster with all five tiers, their art taken from the spritechecklist.org tracker. Only the Design-A-Sprite winners Dumpster Dive and Honey are still unreleased.

## Hosting

`.github/workflows/deploy.yml` runs on every push to `main`: it installs with `npm ci`, runs `npm run build` (which type-checks with `tsc --noEmit` before bundling), uploads `dist/` and deploys it to GitHub Pages. The build uses `base: './'` so it works from a project subpath.

## Notes

Sprite artwork is property of Epic Games. Rarity, variant names and abilities are as they appear in-game. Cards are tick boxes for your own collection tracking and are not affiliated with Epic Games.
