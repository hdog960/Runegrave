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

- **Current development milestone:** v0.09 — first connected mini-run, 25 authored valid encounter configurations, eight genuinely functional relics, silver/healing pickups, existing six hostile types and Rootbound Warden boss. Implementation tested locally; deployment and approval status are recorded separately in the release ledger.
- [Verified release status](docs/RELEASE_STATUS.md) · [Change log](docs/CHANGELOG.md) · [Content ledger](docs/CONTENT_LEDGER.md)
- Local build: `npm ci && npm test`; static site output: `dist/`.
- **STOP:** v0.09 **Gate A awaits explicit player visual and control approval**. Do not start v0.10 before approval. [Gate A review instructions](docs/GATE_A_REVIEW.md).

Implementation and deployment claims must match evidence in the release ledger; the full original roadmap remains locked.

## Gate A clarity patch — v0.09.1

After the first Gate A review, the player reported they could not tell what was happening. v0.09.1 introduces a first-launch **How to Play** tutorial, a Pause → How to Play replay action, and readable step-by-step footer objectives with no overlay during active play. **Gate A remains awaiting explicit player approval; do not advance to v0.10.** See [Gate A review](docs/GATE_A_REVIEW.md).

### Gate A usability refinement — v0.09.2

After player feedback, exit doors now show signed red LOCKED / green EXIT states and vary north/west/south/east across the curated mini-run. Each collected relic pauses to explain its exact active bonus; a permanent right-rail effect label and item pickup feedback remain visible outside the world. **Still v0.09; Gate A awaits explicit player approval; v0.10 remains locked.**

### Gate A readability/art polish — v0.09.4

The marked red/green Norse stone doors are now framed and inset so side-edge labels remain fully visible. After both room-clear and mandatory relic collection, green carved floor waystones trace a verified collision-connected path toward the exit. Enemies visibly announce their distinct attack while winding up (with red imminent warnings). Relic cards now show actual applied **before → after** stats and the thumb-discs light up when held. No persistent overlay moves into the combat viewport. **Gate A remains unapproved; v0.10 is not started.**
