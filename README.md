# Runegrave: The Ninefold Descent

An original Norse-mythology, iPhone-first action roguelike, planned for GitHub Pages.

## Documentation — Start Here

**[Read the complete RUNEGRAVE project handoff](docs/README_START_HERE.md)**

- [Official Game Design Bible](docs/DESIGN_BIBLE.md)
- [Full v0.01–v1.0 development roadmap](docs/ROADMAP.md)
- [Mandatory Norse-themed mobile UI and controls specification](docs/UI_CONTROLS_AND_ART_DIRECTION.md)
- [Handheld controller layout — unobstructed gameplay](docs/HANDHELD_CONTROLLER_LAYOUT.md)
- [Instructions for a new development chat](docs/NEW_CHAT_HANDOFF_PROMPT.txt)
- [Release status and verification template](docs/RELEASE_STATUS_TEMPLATE.md)

**The gameplay viewport must be completely unobstructed.** The iPhone in landscape has Norse-styled controller grips to the left and right of the centered game view, never translucent virtual sticks laid on top of the action.

**Project constraints:** GitHub + GitHub Pages; iPhone Safari/Home Screen; no required paid hosting or services; no Codex, ChatGPT Work, or Vercel.

**Important:** These documents define the proposed game and roadmap. The version numbers and content targets are *plans*, not verified implementation. Development and deployment status must always be checked against the repository.

## Development baseline

- **Current development milestone:** v0.06 — Soulbolt projectile damage, combat hooks, and training destructibles locally tested; public deployment is verified separately in the release ledger.
- [Verified release status](docs/RELEASE_STATUS.md) · [Change log](docs/CHANGELOG.md) · [Content ledger](docs/CONTENT_LEDGER.md)
- Local build: `npm ci && npm test`; static site output: `dist/`.
- **Next:** v0.07 — Mortal Hearts, player damage, healing and death/restart; v0.09 remains Gate A visual approval.

Implementation and deployment claims must match evidence in the release ledger; the full original roadmap remains locked.
