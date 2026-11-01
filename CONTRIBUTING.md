# Contributing

Bug reports, accessibility improvements, and verified roster corrections are
welcome. Read CODE_OF_CONDUCT.md, SECURITY.md, and AI_DISCLOSURE.md first.

## Local setup

Use Node.js 24+ and Python 3.12+. From a fork or feature branch:

```sh
npm ci
python3 -m venv .venv
. .venv/bin/activate
pip install -r scripts/requirements.txt
npm run dev
```

Before submitting, run `npm test` and `npm run build`. For interface changes,
check a narrow phone viewport, keyboard navigation, and A4 printing. Confirm
that both found and mastered progress persist after reload. Do not commit
node_modules, dist, virtual environments, credentials, or personal backups.

## Data and artwork changes

Run `npm run sync-sprites:dry` to inspect upstream changes, then
`npm run sync-sprites` to apply them. Include a source URL and explain any count,
rarity, or availability change. Do not invent variants, silently replace a Sprite
with another family, or mark future releases collectible. Preserve stable IDs and
season storage keys. Art must remain local for offline use; verify its provenance.

## Pull requests

Keep changes focused. Describe the problem, resulting behavior, and validation.
Add regression coverage for logic fixes. Disclose substantial AI assistance and
review the generated code yourself. Do not add AI tools as authors or co-authors.
Maintainers decide whether a pull request is ready to merge. By contributing
original code you agree it will be distributed under this project's MIT license;
third-party artwork remains subject to its owner's rights.
