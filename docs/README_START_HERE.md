# RUNEGRAVE — START HERE

This GitHub `docs/` directory contains the **complete planning and handoff documents** for **RUNEGRAVE: THE NINEFOLD DESCENT**, a Norse-mythology, Isaac-scale action roguelike intended for iPhone and GitHub Pages.

## Contents and reading order

1. **`DESIGN_BIBLE.md`** — the definitive game premise, mechanics, 34 character variants, item ecosystem, nine realms, seven routes, target counts, no-cost/mobile requirements, and quality standards.
2. **`UI_CONTROLS_AND_ART_DIRECTION.md`** — **new locked requirement**: no virtual control, HUD, or decoration may overlap the live combat viewport; integrated handheld-style left/right controller grips, thematic Norse UI, camera layout, and mandatory tests.
3. **`HANDHELD_CONTROLLER_LAYOUT.md`** — concise controller layout sketch, grip/button placements, original Norse styling, and must-pass UI checks.
4. **`ROADMAP.md`** — 100 detailed release checkpoints, **v0.01 to v1.0**, targets, testing, player art approvals, and implementation instructions.
5. **`NEW_CHAT_HANDOFF_PROMPT.txt`** — ready-to-copy instructions for another AI chat.
6. **`RELEASE_STATUS_TEMPLATE.md`** — honest starting-status template for the repository's development ledger.

Read all four main documents before coding; the UI spec overrides any generic assumption that twin-stick virtual controls may sit on top of the game.

## Non-negotiable project settings

- **Primary device:** iPhone; landscape mode; Safari and Home Screen PWA.
- **Distribution:** GitHub Pages at the existing project URL.
- **Code hosting:** Existing GitHub repository; do not create a new repository unless the user asks.
- **Money:** Required infrastructure/tool budget is **$0**.
- **Explicitly excluded:** Codex, ChatGPT Work, Vercel, paid hosting or API, or any mandatory paid service.
- **Controls:** A Nintendo Switch-inspired **screen-between-two-controller-grips layout**, redesigned entirely with original Norse rune-forged visual language. Two-thumb joystick/aim pads and persistent HUD are physically *outside* the central gameplay canvas; never translucent overlays over enemies or projectiles.
- **Art:** Cohesive, premium-feeling integrated handheld-controller shell and Norse carved-runestone/wood/metal UI, readable values and icons, expressive original 32-bit-inspired pixel art.
- **Progress:** v0.01 is the planned starting point **unless the actual repository proves that more work has already been implemented and verified**.
- **Approvals:** Stop and request player review at v0.09, v0.39, v0.79, and v0.99, when the applicable gate is reached.

## What is NOT claimed

These documents specify planned work, **not a game build**. The existing repository is `https://github.com/hdog960/Runegrave`; verify its code before claiming any implementation. The planned 750 relics, 34 variants, and 100 bosses are **future targets**, not implemented content.

## How to start in another AI chat

Provide `https://github.com/hdog960/Runegrave` to the next AI chat and direct it to `docs/README_START_HERE.md`. Read all linked documents, inspect the current repository, and work from the **verified** release version. Never claim implementation, commits, or deployments without evidence.

## Documentation location

These documents reside in `docs/` in this repository. The root README links to this folder. Future AI chats can open the Design Bible, Roadmap, UI specification and controller layout directly from GitHub.

**Planning documents have been placed in this GitHub repository; development itself has not begun.**