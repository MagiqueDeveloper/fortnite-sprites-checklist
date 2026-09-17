# Fortnite Sprites Checklist (Chapter 7 Season 4 · Override)

A printable A4 checklist for every Sprites variant in Fortnite Chapter 7 Season 4, built as a single page with **Found** and **Mastered** tick boxes per variant.

## Features

- 61 collectible Sprites across 16 families, ordered by rarity left to right
- Found / Mastered ticks per variant, saved in `localStorage` and printed exactly as shown
- Unreleased Sprites section (v42.20 crossover Sprites plus the Design-A-Sprite Contest winners)
- **Print A4** button that prints the sheet as a single A4 page

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build into dist/
npm run preview    # serve the built output
```

## Hosting

`.github/workflows/deploy.yml` builds the project and publishes `dist/` to GitHub Pages on every push to `main`. Enable it once under **Settings → Pages → Source: GitHub Actions** (the workflow also attempts to configure this automatically on first run).

## Notes

Sprite artwork is property of Epic Games. Rarity and variant names as they appear in-game.
