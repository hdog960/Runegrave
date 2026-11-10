# RUNEGRAVE — Verified Release Status

## Latest verified release — v0.08 Sixfold Crypt (2026-11-09 US Central)

**Status:** IMPLEMENTED, LOCALLY TESTED, GITHUB CI PASSED, PUBLIC STATIC PAGES DEPLOYED. **No physical iPhone verification or visual approval yet.**

- **Baseline:** v0.07 release evidence commit `e3349687c59de0deb6d87727b9905f8c5a659ef2`. **Implementation commit:** [`47306b1fb9309fdcd859c299208ce7462b37d9b9`](https://github.com/hdog960/Runegrave/commit/47306b1fb9309fdcd859c299208ce7462b37d9b9), confirmed on `main`. GitHub compare showed **31 changed/added files, zero removed files**. All seven canonical design documents retain original exact blob SHAs; original PWA icons preserved.
- **Actual features:** six hostile AI kinds (draugr pursuit, wisp strafing/projectiles, archer telegraphed aimed shot, charging attacker with windup/dash/recovery, radial-burst root sentinel, teleporting shade); independent sprites and damage, bounded hostile projectiles, Soulsbolts hitting true hostile hitpoints and knockback. First 28-HP two-phase **Rootbound Warden** boss with aimed telegraphed fans, escalating attacks and defeat gating.
- **Room flow:** preserved practice room with v0.06 breakables and v0.07 healing/shrine hazards → locked Sixfold Crypt wave 1 (three types) → wave 2 (other three types) → accessible east exit when all six die → locked Warden chamber → boss kill unlocks east exit → stopped-simulation trial-completed panel → voluntary restart. No ending, completion-mark, full-route unlock or procedural rooms are invented.
- **Geometry safety:** route-connected exit placements avoid unreachable positions caused by root/capsule obstacles; legal enemy spawning and camera resize/reframe preserve enemy HP and boss phase while removing possible offscreen projectiles. Combat controls/health/HUD remain outside the gameplay rectangle. Save schema 1 and `runegrave:input:v1` preferences unchanged; versioned PWA cache `runegrave-shell-v0.08.0`.
- **Automated test evidence:** strict TypeScript compile **PASS**, `npm test` **54/54 PASS** (44 preceding tests + ten v0.08 cases). Independent in-memory Chromium checks: four landscape reference viewport sizes (667×375, 760×360, 844×390, 932×430) and portrait (390×844), real two-pointer input emulation, keyboard, pause, handedness, zero controls/HUD intersection, no runtime JS exceptions **PASS**.
- **Runtime test qualification:** A browser run actually moved from practice to the crypt through the open doorway. A separate complete state-transition test used explicitly **test-only actor-position and hostile-damage injection**, not real player skill, to confirm waves, locked→open exits, boss phase changes, completion panel and restart. Real pooled Soulbolt→enemy hits and Mortal Heart damage were separately exercised in deterministic tests. Do **not** describe the state-transition test as a natural manual victory.
- **Public deployment VERIFIED independently:** fresh requests to `https://hdog960.github.io/Runegrave/index.html`, `js/core/version.js` (`v0.08 / 0.08.0`), `js/enemies/encounters.js`, `js/enemies/enemyArt.js` and `sw.js` (`runegrave-shell-v0.08.0`) succeeded. GitHub Actions `Runegrave foundation checks #16`, `Build and publish Runegrave to GitHub Pages #16` and Pages build/deployment job all report **completed successfully** on v0.08 commit.
- **Current verifiable game content:** **six** true hostile enemy behavior kinds and **one** original boss; two authored encounter sequences. **Zero procedural 25-room configurations**, zero playable/approved distinct roster variants, relics 0, talismans 0, transformations 0, challenges 0, authored synergies 0, major ending routes 0. Training props, shrine, combat-avatar prototype and planned realm IDs are not counted as mature full-release content.
- **Pending/nonverified:** physical iPhone Safari, Home Screen PWA installed/offline-update testing, true two-thumb comfort, thorough human-run victory and combat balancing, player art judgment. **v0.09 Gate A remains locked** and must request explicit art/control approval before advancing to v0.10; later Gates B/C/D still v0.39/v0.79/v0.99. Full v1.0 targets unchanged.
- **Next milestone:** v0.09, including approximately 25 mechanically valid room configurations, eight functioning relics, boss path, initial pickups, a death/restart loop, careful performance/UI/art tests, and stopping for **player Gate A approval**.


## Latest verified release — v0.07 Mortal Thread (2026-11-09 US Central)

**State:** v0.07 IMPLEMENTED, LOCALLY TESTED and PUBLICLY DEPLOYED. This is a training milestone, not the first completed roguelike run or v0.09 art approval.

- **Verified code commit:** [`f99148a9f87f0be106ac36e345fb8343aefa5fa5`](https://github.com/hdog960/Runegrave/commit/f99148a9f87f0be106ac36e345fb8343aefa5fa5) on `main`; comparison against v0.06 `8159f83d0749513036f2b056696a2128b1fc3757` showed no deleted files; all seven authoritative documents retain their original Git blob SHA.
- **Implemented:** `src/health/mortalHearts.ts` tracks three Mortal Heart containers in six half-heart units, fixed-step invulnerability, damage source, capped healing, lethal death, and restart reset. `src/health/emberTrial.ts` places two telegraphed pulsing environmental ember runes and a healing shrine with a ten-second recharge. `src/health/healthArt.ts` displays the hazards in world space while full/half/empty heart icons and numerical HP are drawn only in the left grip. Death pauses simulation, clears inputs, disables controls, and presents a stopped-world death/restart panel.
- **Regressions preserved:** v0.06 pooled Soulbolts/target knockback/damage, v0.05 fixed-step collision and safe spawning, v0.04 original art, v0.03 independent grips and existing saved `runegrave:input:v1` preferences, relative PWA paths and cache update safety. Save schema remains 1; run-save/export is still scheduled for v0.18.
- **Local tests:** `npm run typecheck` PASS; `npm test` **44/44 PASS**. Four simulated landscape Chromium profiles (667×375, 760×360, 844×390, 932×430) and 390×844 portrait PASS for pointer independence, cancellation, keyboard, pause, handedness, resize and zero control/HUD intersection with gameplay. Separate in-memory Chromium death/restart test PASS with a clearly labeled **test-only fatal damage injection**; true ember collision and healing are independently covered by deterministic unit tests.
- **Public GitHub Pages static deployment VERIFIED:** fresh public retrieval succeeded for `https://hdog960.github.io/Runegrave/index.html` (v0.07 new pause/death descriptions), `js/core/version.js` (v0.07 / 0.07.0), `js/health/mortalHearts.js`, `js/health/emberTrial.js`, `js/health/healthArt.js` and `sw.js` (`runegrave-shell-v0.07.0`). GitHub Actions listing confirmed successful v0.07 push-triggered foundation CI and Pages publication runs.
- **Content ledger:** relics **0**, talismans **0**, playable variants **0**, hostile enemy types **0**, bosses **0**, procedurally valid rooms **0**, transformations **0**, challenges **0**, authored synergies **0**, major routes **0**. Ember pads, the shrine and non-hostile effigies are training mechanisms, not counted game content.
- **Unverified:** Physical iPhone Safari and standalone Home Screen behavior, real two-thumb ergonomics, true offline service-worker update testing, and user visual approval. Do not infer these from Chromium or public file fetches.
- **Next incomplete roadmap milestone:** **v0.08**, six distinct hostile AI patterns, lockable combat rooms, room clear/exit flow, and first actual boss. **Stop at v0.09 Gate A** for player visual approval; Gates B/C/D remain locked at v0.39/v0.79/v0.99.


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
