# Verified Change Log

## v0.02 — Rune-Forged Screen (source implementation, 2026-11-09)

- Built the required original Norse handcrafted console silhouette with split dark-ash-wood and wrought-metal left/right rune grips, an isolated middle game screen, and external resource HUD. No decorative or interactive UI intersects the canvas in local geometry tests.
- Added an atmospheric authored Midgard burial-hall **scenic preview** rendered with a responsive, actual center-only 2D canvas; combat is NOT yet implemented (locked for later roadmap releases).
- Created installable static PWA metadata, original iPhone Home Screen artwork/icons, offline shell caching, and a player-initiated safe update path.
- Added a branch-root static export fallback for Pages `main/(root)` alongside the existing GitHub Actions `dist/` publisher. Public deployment/Pages configuration and real iPhone install remain unverified.
- Passed 9 local Node tests, strict TypeScript typecheck, and browser in-memory geometry tests at 4 iPhone landscape CSS sizes plus portrait.

**Next:** v0.03 independent physical side-rail input controls and true gameplay input state, after checking Pages publishing where possible.


## v0.01 — First Forging (initial development cycle, 2026-11-09)

- Audited existing documentation-only main branch; preserved all seven canonical project documents.
- Added modular strict TypeScript foundation, stable content ID validation, named seeded RNG streams, and nine explicitly **planned-only** realm IDs.
- Added Norse-themed static foundation preview, an original World Tree vector emblem, and portrait rotate-device messaging; **not playable gameplay**.
- Added zero-runtime-dependency static Pages build and six Node tests; all six passed in local test run.
- Added automated CI and Pages publication workflow configuration. Actual GitHub deployment and physical iPhone checks remain separate verification states.
- Created accurate feature ledgers and technical registers without inflating playable content.

**Next:** v0.02 — actual external HUD, side controller grips, central separate playfield and PWA.
