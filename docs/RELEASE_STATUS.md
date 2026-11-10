# RUNEGRAVE — Verified Release Status

**Date:** 2026-11-09
**Starting verified main:** `5bd5fa488e0be66aef032472ea821ddf8c408df2` (v0.02 source + status).
**Active roadmap release:** **v0.03 — Twin-stick iPhone input**.

## Implemented and locally tested

- Dedicated left movement and right aim/continuous-fire rune discs, independent captured pointer IDs, multi-touch, radial dead zones, safe cancellation, left-handed swap, adjustable size/height within grips, keyboard fallback, pause/resume and background input clearing.
- Responsive training avatar moves and emits **cosmetic training bolts** inside the true central-only stage canvas. No real collision, enemies, combat damage, boss, health, or run loop is implemented; all combat content totals remain zero.
- On-screen paused-only controller preferences panel, validated local settings; waiting service worker update moved inside the paused panel to preserve zero-obscuration during live input. Utility actions not yet implemented stay disabled.
- PWA cache upgraded to `runegrave-shell-v0.03.0`, compiled `js/` and mirrored branch-root runtime updated.
- `npm run typecheck`: **PASS**. `npm test`: **13/13 PASS**. Headless local Chromium in-memory tests: **4 landscape profiles + portrait PASS** with simulated simultaneous touch pointers, cancellation, keyboard and paused-state checks, left-hand swapping, zero HUD/control overlap and no page errors.

## Deployment evidence

- **v0.02 public site verified reachable** before beginning: fetched `https://hdog960.github.io/Runegrave/`, `manifest.webmanifest`, and `js/main.js` successfully; fetched root displayed `v0.02` and appropriate title/manifest. Prior Pages blocker resolved.
- **v0.03 GitHub source status:** commit evidence to be added after push. Repository update alone does not prove live Pages publication.
- **v0.03 public site:** PENDING POST-PUSH VERIFICATION, not yet claimed as deployed.
- **Real iPhone Safari, installed standalone PWA, offline update and physical two-thumb ergonomics:** NOT TESTED, remain open verification requirements.

## Content and approvals

- **Playable content:** relics 0; playable variants 0; enemies 0; bosses 0; procedurally valid rooms 0; transformations 0; endings 0. Nine realm identifiers are planned metadata. Moving preview character and decorative training bolts are not a completed gameplay encounter.
- **Visual gate:** v0.09 Gate A remains locked; no player approval asserted. Future checkpoints v0.39, v0.79, v0.99 unchanged.
- **Next roadmap release:** v0.04 — polish authentic Norse shell art, camera framing, central scene and HUD. Do not skip simulation/combat releases v0.05–v0.09 or any approval gate.
