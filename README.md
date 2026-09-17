# Fortnite Sprites Checklist (Chapter 7 Season 4 · Override)

A printable A4 checklist for every Sprite variant in Fortnite Chapter 7 Season 4, built with Vite, React and TypeScript.

**Live:** https://magiquedeveloper.github.io/fortnite-sprites-checklist/

## Features

- **61 collectible Sprites** across 16 families (base, Cheat Master, Gold and Loot Hacker variants) ordered by rarity left to right
- **Found / Mastered tick boxes** per variant, saved in `localStorage` and printed exactly as shown on screen
- **Print A4 button** that prints the sheet as a single A4 page, with the toolbar hidden
- **Unreleased section** for the v42.20 crossover Sprites and the Design-A-Sprite Contest winners, badged purple and green
- **Fully offline:** all 65 sprite images ship in `public/sprites/`, so the page makes no external requests

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

## Project structure

```
index.html                 Vite entry (mounts the React app)
src/
  main.tsx                 React root
  App.tsx                  Sheet, family blocks, tick boxes, print and scale-to-fit logic
  styles.css               Screen styles plus the @page / @media print rules
  data/sprites.ts          Typed roster: families, variants, rarities, abilities, image paths
public/sprites/            65 sprite images, sorted by family
  overshield/base.png      released variants: base, cheat-master, gold, loot-hacker
  x-ray/base.png
  unreleased/blinky.png    v42.20 crossover Sprites
.github/workflows/deploy.yml   Type-checks, builds and publishes dist/ to GitHub Pages
```

## Sprite image layout

Images are grouped one folder per family, named after the family `id` in `src/data/sprites.ts`:

```
public/sprites/
├── 8bit/             base.png  cheat-master.png  gold.png  loot-hacker.png
├── adventure/        base.png  cheat-master.png  gold.png  loot-hacker.png
├── bush/             ...
├── crown/
├── jackrabbit/
├── jonesy/
├── killswitch/
├── klombo/
├── mega_man/         base.png (Mega Man has no variants)
├── onigiri/
├── overshield/
├── shadow/
├── sonic/
├── storm_scout/
├── tails/
├── x-ray/
└── unreleased/       blinky.png  crash-bandicoot.png  birthday.png  morgana.png
```

To add or replace art, drop a PNG in the matching folder (transparent background works best) and point the `imgs` entry in `src/data/sprites.ts` at it.

## Hosting

`.github/workflows/deploy.yml` runs on every push to `main`: it installs with `npm ci`, runs `npm run build` (which type-checks with `tsc --noEmit` before bundling), uploads `dist/` and deploys it to GitHub Pages. The build uses `base: './'` so it works from a project subpath.

## Notes

Sprite artwork is property of Epic Games. Rarity, variant names and abilities are as they appear in-game. Cards are tick boxes for your own collection tracking and are not affiliated with Epic Games.
