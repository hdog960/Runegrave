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
- **v0.03 GitHub source:** implementation commit [`5ddedb42c9300916777fa9dfddbc8c6fb1d841c6`](https://github.com/hdog960/Runegrave/commit/5ddedb42c9300916777fa9dfddbc8c6fb1d841c6), confirmed on `main` with compiled twin-stick module present.
- **v0.03 public site:** **VERIFIED STATIC DEPLOYMENT** — on 2026-11-09 external fresh public requests succeeded for the Pages root, `js/main.js` with the v0.03 input-trial code, `js/input/twinStick.js`, and `sw.js` containing `runegrave-shell-v0.03.0`. This confirms public static asset publication only, not physical Safari input or service-worker offline lifecycle.
- **GitHub Actions run / CI logs:** not separately verified; static asset fetches establish publication, not Actions success.\n- **Real iPhone Safari, installed standalone PWA, offline update and physical two-thumb ergonomics:** NOT TESTED, remain open verification requirements.

## Content and approvals

- **Playable content:** relics 0; playable variants 0; enemies 0; bosses 0; procedurally valid rooms 0; transformations 0; endings 0. Nine realm identifiers are planned metadata. Moving preview character and decorative training bolts are not a completed gameplay encounter.
- **Visual gate:** v0.09 Gate A remains locked; no player approval asserted. Future checkpoints v0.39, v0.79, v0.99 unchanged.
- **Next roadmap release:** v0.04 — polish authentic Norse shell art, camera framing, central scene and HUD. Do not skip simulation/combat releases v0.05–v0.09 or any approval gate.

## v0.04 — Rootvault art, camera, thematic HUD (2026-11-09)

**Starting verified source:** `70b126ac8224b011b007597474008c01626b8c28` on main, v0.03 public Pages build confirmed before work.
**Implementation:** New original `src/scene/sanctuaryArt.ts` authored Midgard rootvault environment; separate original directional Wayfarer animation cues; refined ash/iron/gold runic grips and outside-canvas header/footer. Existing independent left/right controls, handedness, pause, persistent `runegrave:input:v1` settings, and PWA remain unchanged; save schema 1.
**Local evidence:** strict TypeScript typecheck **PASS**; `npm test` **16/16 PASS**; static Pages root mirror verified byte-for-byte for compiled art module and SW; local in-memory Chromium browser audit **4 landscape sizes + portrait PASS** with simulated multitouch, cancellation, keyboard, pause, handedness, no page errors, zero HUD/control-to-canvas intersections, camera frame/aspect and live viewport resize.
**Limitations:** Chromium HTTP navigation blocked by admin; `npm ci --offline` could not fetch uncached TypeScript tarball. Physical iPhone Safari/standalone PWA and true service-worker offline testing NOT PERFORMED.
**Content audit:** relics 0, playable characters 0, distinct combat enemies 0, bosses 0, valid procedural rooms 0, endings 0. The art room and moving/aiming avatar are **training visuals, not completed combat content**.
**Visual approval:** v0.09 Gate A AWAITING future player review; v0.39/v0.79/v0.99 gates unchanged. v0.04 screenshot available as prototype, not approved as final.
**GitHub status:** source tree prepared for v0.04 commit; verify actual commit + public Pages publication independently before marking deployed.
**Next:** v0.05 physics, fixed-step simulation and world collision (keep the original art and zero-overlap three-region viewport).
