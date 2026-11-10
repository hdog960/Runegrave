# RUNEGRAVE — Verified Release Status

## Current verified state — v0.06 (2026-11-09 US Central)

- **Latest verified roadmap version:** **v0.06 — First Soulbolt combat foundation**, implemented, local/browser tested and publicly deployed.
- **Implementation commit:** [`7a8bb92c7acd8547672f252850cc91085298c3f2`](https://github.com/hdog960/Runegrave/commit/7a8bb92c7acd8547672f252850cc91085298c3f2); verified at the tip of `main`. GitHub comparison to v0.05 reports **zero deleted files**. All seven authoritative documents are retained unchanged.
- **Implemented:** real cooldown-based Soulbolt projectiles with damage, range, speed, collision against world walls/roots, deterministic substeps, reusable fixed 48-slot pool, modular hooks `shot`/`impact`/`break`/`expire`, physical knockback, and three non-hostile breakable training targets with distinct visuals, finite health, safe placement and delayed respawn. Status is presented in a separate external HUD. Original Rootvault art, 120Hz physics, saved `runegrave:input:v1` settings, split Norse rune grips, and Home Screen PWA architecture are preserved. Save schema remains 1.
- **Local tests:** `npm run typecheck` PASS; `npm test` **32/32 PASS**, including six new combat tests. Static publication root mirror matched all compiled modules; 14 JavaScript modules and their 15 relative import links were checked.
- **Local browser tests:** four landscape screen profiles (667×375, 760×360, 844×390, 932×430) plus portrait (390×844) PASS, with simulated dual pointers, cancellation, pause/resume, handedness and settings persistence, camera resize, and **zero control/HUD-to-canvas intersections**. An independent 844×390 in-memory Chromium real combat test fired nine Soulbolts, recorded three hits and shattered one practice target, without JavaScript exceptions.
- **GitHub Actions:** public workflow listing reports successful **Build and publish Runegrave to GitHub Pages #12** and **Runegrave foundation checks #12** for implementation commit `7a8bb92` (runs dated Nov 10 UTC).
- **Public Pages:** **VERIFIED v0.06 static publication** by fresh requests for `https://hdog960.github.io/Runegrave/index.html`, `js/core/version.js` (`v0.06`/`0.06.0`), `js/combat/soulbolts.js`, `js/combat/combatArt.js`, and `sw.js` (cache `runegrave-shell-v0.06.0`). This confirms public assets only, not physical Safari input or offline service-worker lifecycle.
- **Content accounting:** **0** actual enemies, bosses, playable-character variants (beyond demonstration avatar), functional relics, procedural rooms, talismans, transformations, challenges, and endings. Training props do not inflate these quotas.
- **Still unverified:** real iPhone Safari / installed Home Screen offline updates, physical thumb ergonomics, device FPS/battery, actual player visual approval. The mandatory **v0.09 Gate A**, then v0.39/v0.79/v0.99, remain unchanged; no approval inferred.
- **Next locked milestone:** **v0.07 — Mortal Hearts, incoming damage, invulnerability, healing and death/restart**. No v0.08 enemy AI or v0.09 prototype content is credited early.

---

## Historical release-status records


## v0.05 — Rootvault Physics and Collision (2026-11-09)

**Milestone:** v0.05 implemented and locally tested; GitHub deployment status is recorded below. **No enemy damage, true Soulbolt combat, health/death or valid roguelike run is claimed.**

- **Baseline:** `003780679dc2af165aaae9caae72287b29ea689c` on `main` (latest v0.04 release ledger). Original v0.04 artwork and the entire v0.03 dual-rail control system are preserved.
- **Implementation:** New pure `src/physics/world.ts` describes room boundaries, sarcophagi, pillars, and tree roots as typed boxes/circles/capsules; collision-free spawn selection and root-aware movement are deterministic and resolution-aware. New `src/physics/fixedStep.ts` advances the simulation at **120 ticks/second** independent of rendering, with bounded catch-up, resume clearing and safe pause handling. Stage renderer still draws only into the measured central canvas.
- **Regression:** Saved control settings continue under the unchanged `runegrave:input:v1` key. Save schema remains 1 (run-save persistence not implemented until v0.18). PWA asset cache `runegrave-shell-v0.05.0` includes both new runtime physics modules. No gameplay controls/HUD over the live playfield.
- **Local checks:** `npm run typecheck` **PASS**; `npm test` **26/26 PASS**, including fixed-step determinism at 30/60/120/144 Hz, wall/tomb/root collisions, safe spawns, no high-speed tunneling, invalid input rejection, and replay reproducibility.
- **Browser checks:** Local in-memory Chromium **PASS** at 667×375, 760×360, 844×390, 932×430 landscape + 390×844 portrait; tested simultaneous movement/aim, touch cancel, keyboard, pause, left-handed preference storage, viewport resize, wall contact, root collision safety, camera match and zero HUD/controls intersection. These are NOT physical iPhone tests.
- **Content ledger:** 0 implemented relics, 0 playable characters, 0 actual enemies, 0 bosses, 0 valid procedural rooms. The scenic training avatar and decorative training bolts are not counted as playable combat.
- **Approval gates:** v0.09, v0.39, v0.79, v0.99 remain unchanged. Gate A not yet reached.
- **Next:** v0.06 real Soulbolt attack pipeline, damage and projectile collision, pooling, destructible practice objects, and combat hooks, within the existing central camera.

**GitHub commit:** see latest v0.05 implementation commit on `main` after publication. **GitHub Pages status:** to be verified by public asset fetch after commit; do not equate a local build or workflow config with successful deployment. **Physical iPhone Safari/Home Screen and offline PWA lifecycle:** not yet verified.

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

## v0.04 post-commit publication verification — 2026-11-09 (historical evidence preserved)

- **Implementation commit:** [`0f3e0cf3ab9381cd25008c3900425eddf400895a`](https://github.com/hdog960/Runegrave/commit/0f3e0cf3ab9381cd25008c3900425eddf400895a) confirmed on GitHub `main`.
- **Public GitHub Pages static deployment VERIFIED:** successful fresh external public HTTP retrieval from `https://hdog960.github.io/Runegrave/`, `js/core/version.js` explicitly identifying `v0.04 / 0.04.0`, `js/scene/sanctuaryArt.js` containing original Rootvault artwork, and `sw.js` declaring `runegrave-shell-v0.04.0`.
- GitHub combined commit status showed no CI records; publication does not establish a GitHub Actions test run.
- v0.04 source locally typechecked; 16 Node tests and four landscape + one portrait browser viewport simulations passed.
- Real iPhone Safari, installed Home Screen, offline SW lifecycle and user visual approval were NOT verified.
- Historical release state: v0.04 implemented, locally tested, and publicly served; visual Gate A remains v0.09.
## v0.05 post-commit publication verification — 2026-11-09

- **v0.05 physics implementation:** [`0f903f78c320b4dc489e26748743f36d94f0078e`](https://github.com/hdog960/Runegrave/commit/0f903f78c320b4dc489e26748743f36d94f0078e); verified compiled `js/physics/world.js`, `js/physics/fixedStep.js`, source TS, and version metadata on GitHub `main`.
- **Release ledger restoration:** `2d36290843e6d9ab03fe43eff58f6d0c8169d100`; the full comparison from v0.04 to the v0.05 HTML fix has **no removed files** and preserves all seven canonical documents.
- **v0.05 public GitHub Pages static deployment VERIFIED:** successful fresh external retrieval from `https://hdog960.github.io/Runegrave/index.html` (physics-training text confirmed after `e673b7b13b329a694f19ff2b6d9e6722d2f6cbfc`), `js/main.js` (v0.05 physics trial code), `js/core/version.js` (v0.05 / 0.05.0), `js/physics/world.js`, `js/physics/fixedStep.js`, and `sw.js` (cache `runegrave-shell-v0.05.0` with both new physics modules). Public retrieval is proof of static publication, not a physical iPhone runtime test.
- **Local verification:** strict TypeScript check PASSED; `npm test` 26/26 PASSED; in-memory Chromium passed four landscape and one portrait viewport, real dual-pointer simulation, pause, handedness, resizing, world-wall collision and zero layout overlap.
- **GitHub Actions logs and real iPhone Safari/standalone Home Screen/offline update lifecycle:** NOT separately verified. Control and art player approval is still reserved for v0.09 Gate A.
- **Release state:** v0.05 IMPLEMENTED, LOCALLY TESTED, and PUBLIC STATIC ASSETS DEPLOYED. No enemies, true damaging Soulbolt system, health, complete room loop or procedural content have been credited before their roadmap versions. Next is **v0.06**.
