# Cursor Automation: Friday Sprite sync

Create this at [cursor.com/automations](https://cursor.com/automations/new) if you want a Cloud Agent to run the sync (in addition to, or instead of, the GitHub Action).

## Trigger

- Scheduled cron: `0 2 * * 5` (Friday 02:00 UTC)
- Repository: `MagiqueDeveloper/fortnite-sprites-checklist`

## Prompt

```
Weekly Fortnite Sprites sync for this printable checklist repo.

1. Run `pip install -r scripts/requirements.txt`
2. Run `python scripts/sync_sprites.py` (add `--update-abilities` only if ability text should be refreshed from upstream).
3. Sources:
   - Primary roster + art: https://spritechecklist.org/ (Season 4 Override tracker)
   - Cross-check names/variants/abilities: IGN Chapter 7 Season 4 Sprites checklist guide
4. If the script prints CHANGED=0, stop. Do not open a PR.
5. If CHANGED=1:
   - Run `npm ci && npm run typecheck`
   - Commit `src/data/sprites.ts`, `public/sprites/**`, and any README count updates
   - Open a draft PR titled like “Sync Sprites (YYYY-MM-DD)” summarizing new families, new variants, rarity fixes, and art updates
   - Mention both sources in the PR body
6. Do not invent Sprites that neither source lists as released. Keep UNRELEASED empty unless both sources clearly mark something announced-but-not-live.
7. Do not redesign the sheet or change tick/storage logic.
```
