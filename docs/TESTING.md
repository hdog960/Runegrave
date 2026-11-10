## v0.09.12 — Visual readability / mobile regression (2026-11-10)

- Local strict TypeScript **PASS**, Node **121/121 PASS** (116 original + 5 tests for family ambient silhouettes, 25 authored variants, 2 hostile projectile weights, 8-direction mantle art, and offline module/cache completeness). Existing deterministic physics, all room/relic/health tests preserved.
- In-memory Chromium four landscape (667×375, 760×360, 844×390, 932×430) and portrait (390×844) browser controls/canvas tests PASS; guided-start four-size test PASS; simultaneous dual-grip and five-family comparison PASS; three-size auto-pause and four-size external threat readout PASS, with zero browser JS errors. Full connected mini-run PASS through eight relic dialogs, Warden, victory and restart using **test-injected enemy hits and actor jumps**, not unaided human play.
- Visual-only modules are strictly bounded and use no RNG, timers, hitboxes, or player-control layers; colors/shapes differ for friendly versus hostile bolts. 7 authoritative docs remain immutable and Gate A **NOT APPROVED**.
- Physical iPhone Safari touch comfort, PWA offline lifecycle, sustained FPS/heat and unassisted victory **NOT VERIFIED**. Public Pages availability requires separate post-commit confirmation.

## v0.09.11 Gate A architecture and actor-art regression (2026-11-10)

**Strict TypeScript PASS; Node test suite 116/116 PASS; Pages root export PASS.** Six additional tests cover distinct BASE floor/wall palettes, five setpiece motifs, all 25 room/family mappings, original hero ornament states and seven enemy armor/weapon accents, and PWA module precaching. Bounded painter draw-operation checks and balanced canvas save/restore guards pass at 420×220 and 420×235 simulated camera dimensions. Existing deterministic physics, health, eight relic effects, hostile AI, doorway reachability and control geometry tests remain passing.

**Actual in-memory Chromium PASS**, not physical iPhone Safari: `scripts/v009_browser_audit.py` four landscape 667×375/760×360/844×390/932×430 and portrait 390×844; `scripts/guide_browser_audit.py` four landscape guide/pause profiles; `scripts/v0095_visual_audit.py` five original family theme screenshots with test-only canonical ID changes; `scripts/v009_full_run_audit.py` practice → all eight relic chambers → boss defeat/exit → victory/restart with TEST-ONLY scripted enemy damage and character repositioning; `scripts/v0099_mobile_browser_audit.py` three blur/Resume tests; `scripts/v0100_threat_browser_audit.py` four live-warning/readout checks; `scripts/v0094_polish_audit.py` three DOM-mutation and genuine practice exit checks. Tests produce local screenshots but do not establish human combat comfort, sustained on-device FPS, Safari offline lifecycle or a natural unassisted win. **Player Gate A remains unapproved.**

## v0.09.10 — Independent Gate A regression (2026-11-10)

**Local PASS:** `tsc -p tsconfig.json --noEmit`; `npm test` **110/110**; `npm run export:pages` checked compiled root files and new SW imports. All 25 room-specific reliefs remain inside the established mobile painter draw-operation cap (the new mural layer replaces older decorative floor work, it is not an added overlap). New tests cover `roomReliefs` 25 IDs, 5 family motifs, bounded drawing/save-restore; `threatReadout` urgent real windup, Warden HP/phase and clear states; left grip placement and SW precache.

**Headless Chromium PASS:** `scripts/v009_browser_audit.py` (four landscape + portrait), `scripts/guide_browser_audit.py` (four landscape), `scripts/v0099_mobile_browser_audit.py` (three interrupted foreground/background profile checks), `scripts/v0100_threat_browser_audit.py` (four landscape real-live warning updates and no thumb-grip/canvas intersection). `scripts/v009_full_run_audit.py` PASS for connected practice → eight chambers → eight reward dialogs → Warden → completion/restart; **this deliberately accelerates combat with test-only damage and legal position injection** and does not count as unaided victory.

**Not tested:** physical iPhone Safari or real multi-finger ergonomics, installed/offline Home Screen lifecycle, real prolonged mobile thermals/FPS, independent playthrough by a person, player artistic approval. `v0.10` is explicitly locked pending player Gate A approval.

## v0.09.9 — Local Gate A QA (2026-11-10)

**Automated:** `npm run typecheck` PASS; `npm test` **105/105 PASS** (99 previous + six new tests). New tests verify real-event-only limited enemy defeats, fixed-step footprint aging and capacity, reduced-motion draws no extra visuals, 25 nonrepeating canonical room heraldry plates, mobile draw-operation budget, and the new PWA/cache/controls integrity.

**Chromium in-memory browser checks** (not Safari/physical iPhone): `scripts/v009_browser_audit.py` PASS on 667×375, 760×360, 844×390, 932×430 landscape + portrait; `scripts/guide_browser_audit.py` PASS on four landscape sizes; `scripts/v0094_polish_audit.py` PASS on 667×375, 844×390, 932×430 with zero heart/footer mutations during 650ms idle and no JavaScript exceptions; `scripts/v0095_visual_audit.py` PASS with **test-only canonical room-ID and family swaps** to capture five architecture comparisons; `scripts/v0099_mobile_browser_audit.py` PASS on 667×375, 844×390 and 932×430 for blur auto-pause, held pointer cancellation, frozen ticks, deliberate Resume and a 34px Pause target wholly within the right grip. `scripts/v009_full_run_audit.py` PASS all eight required relics, locked/unlocked cardinal exits, Warden kill, victory and restart **using test-only enemy damage and legal actor teleports**. Screenshots were produced from actual compiled in-memory Chromium gameplay, not ImageGen, Safari or remote browser automation.

**Deployment evidence:** see `docs/RELEASE_STATUS.md` for actual GitHub implementation SHA, GitHub Actions status, and fresh public Pages asset retrieval. An uploaded or committed patch alone does NOT constitute a verified public deployment.

**NOT verified:** physical iPhone Safari two-thumb ergonomics, physical offline Home Screen update, natural unaided full run, accessibility audits on real device, or player Gate A art/control approval. The visual-approval gate remains pending; do not advance to v0.10.

## v0.09.8 — Gate A runtime + regression evidence (2026-11-10)

- Local strict TypeScript `npm run typecheck` **PASS**. `npm test` **99/99 PASS**: prior 93 regression tests plus six focused 0.09.8 cases for actual damage/heart/pickup values, bounded fixed-step marks and pause-stable lifetimes, central-canvas-only aim cue, five unique floor-relief silhouettes under the pre-existing draw-call limit, visibly distinct open/barred portals, and stable relic counts/offline module cache. All historic tests retained, including deterministic physics, 25 room configs, eight relic effects, save preferences and no control-to-canvas overlap.
- `npm run export:pages` **PASS**, compiles both new modules and mirrors build files to repository root.
- In-memory Chromium `scripts/v009_browser_audit.py` **PASS** four landscape iPhone-like reference viewports and portrait, including independently held move and aim grips, zero gameplay/HUD overlap and no browser exceptions. `scripts/guide_browser_audit.py` **PASS** four landscape viewports: guide safely pauses, resumes and reopens.
- `scripts/v009_full_run_audit.py` **PASS** practice → eight authored encounter rooms → eight mandatory real relic pickup/confirmation panels → Rootbound Warden → victory → restart, with test-injected hostile damage and actor movement; **not** a natural unaided playthrough. `scripts/v0095_visual_audit.py` **PASS**, five actual browser family variants and simultaneous two-grip pointer handling, including cancellation. `scripts/v0094_polish_audit.py` **PASS** three-size idle HUD mutation check (zero heart/footer text changes) and valid entry into crypt through real exit.
- **Not verified on hardware:** iPhone Safari or standalone PWA, offline cache lifecycle, physical two-thumb feel, long-duration battery/fps, unaided victory, player's aesthetic Gate A review. No user approval implied.

## v0.09.7 — Local Gate A physics-and-art regression (2026-11-10)

- **Build:** TypeScript strict typecheck PASS; `npm test` **93/93 PASS** (previous 88 + five new Gate A 0.09.7 tests). Tests inspect eight-direction Wayfarer poses, all seven distinct enemy gestures, five different bounded trim draw signatures, four compass-accurate floor arrows, and new offline precache entries. The original 25-room connectivity/relic/combat tests remain intact.
- **In-memory Chromium browser:** `scripts/v009_browser_audit.py` PASS at 667×375, 760×360, 844×390, 932×430 landscape and 390×844 portrait; no JS exceptions and zero canvas/HUD/control intersections. `scripts/guide_browser_audit.py` PASS for four landscape sizes and pause/guide/replay. `scripts/v0094_polish_audit.py` PASS three sizes with zero redundant static HUD mutation and about 77–80 canvas attribute updates in a 650 ms idle interval. New artwork is presentation only.
- **Full mini-run:** `scripts/v009_full_run_audit.py` PASS eight selected room configurations, all mandatory relic dialogs, boss defeat, victory and restart. **This uses test-only hostile damage and actor teleport acceleration**, not natural unaided player victory.
- **Five family screenshots and independent simultaneous two-thumb input:** `scripts/v0095_visual_audit.py` PASS; no JS errors. Enemy attack frame and chamber screenshots captured for art review.
- **Physical iPhone Safari/installed Home Screen offline/service-worker lifecycle, true two-thumb comfort, natural unaided victory and player visual judgement:** **NOT TESTED**. Gate A **UNAPPROVED**. Local admin blocks real HTTP browser navigation; in-memory rendering and public file retrieval are not device verification.

## v0.09.6 — Relic-recognition and warning urgency verification (2026-11-10)

- Strict TypeScript typecheck, full existing Node test suite and new crest/urgency cases: **PASS: TypeScript and 88/88 Node tests (85 earlier cases + 3 v0.09.6 tests)**. Verify eight distinct crest shapes, bounds-safe visible warning beats for combat camera heights, and new modules in PWA cache; ensure existing 25 room configurations and relic effects remain intact.
- In-memory Chromium verified four landscape + portrait layouts, independent two-thumb controls and zero canvas overlap; four guided-start profiles; three-size idle-HUD mutation check; seven enemy type help panel; eight-relic QA screenshot montage; full eight-chamber, boss, victory and restart mini-run with test-only enemy damage and legal actor teleports. This is NOT an unaided victory.
- Physical iPhone Safari ergonomics, installed PWA/offline lifecycle, mobile FPS/thermals and explicit Gate A approval: **NOT VERIFIED**.

## v0.09.5 — Original wall art, enemy-frame and controller-direction validation (2026-11-10)

- Local `npm run typecheck` **PASS**, `npm test` **85/85 PASS** (79 retained cases + six new art/geometry/animation/offline-module tests). All prior health, collision, combat, room, relic, pathfinding and safe-PWA checks continue passing. New tests ensure five materially distinct room monuments; each is bounded and restores context state; seven enemy kinds produce deterministic motion poses; telegraph labels/vectors remain camera-contained; door approaches point into the room for each cardinal direction; eight compass directions and release-on-cancel work; PWA includes both new compiled modules. The older family-art canvas mock was extended with newly used standard canvas operations, not skipped.
- Headless local Chromium in-memory `scripts/v009_browser_audit.py`: 667×375, 760×360, 844×390, 932×430 landscape + 390×844 portrait **PASS** for original two independent touch controls, separate center viewport, pauses, handedness, zero HUD overlaps and no JS errors.
- `scripts/guide_browser_audit.py`: 4 landscape sizes **PASS**, tutorial pause and replay preserved. `scripts/v0094_polish_audit.py`: 3 landscape sizes **PASS**, pause-only enemy guide, real practice-to-crypt transition and no idle heart/objective DOM mutations (observed 79–80 changed canvas attributes in 650ms, beneath the established 190 maximum).
- `scripts/v009_full_run_audit.py`: **PASS** for eight real room state transitions, mandatory relic popups, boss route, victory and restart. **Test-only enemy damage and legal actor jumps** accelerate combat; this is *not an unaided human victory*.
- `scripts/v0095_visual_audit.py`: **PASS** for independently active touch/aim contacts, eight-way held-direction feedback, pointer cancellation recenter, and five family scene screenshots; visual proof is in `gate-a-v0095-five-room-families.png`. Only the internal browser test changes the first chamber's family to take matched reference images; actual game route logic was not changed.
- New art and sprite calls are bounded at the renderer level, but **actual iPhone FPS/thermals have not been measured**. Browser tests are an in-memory Chromium harness because local HTTPS HTTP navigation is blocked; actual Safari/Homescreen/offline-worker state and visual approval still await the player. Public publication must be verified after GitHub commit.

## v0.09.4 — Theme, telegraph and DOM regression (2026-11-10)

- Baseline version 0.09.3, roadmap milestone v0.09. Strict TypeScript check PASS and `npm test` **79/79** PASS, including two new theme tests ensuring 25 rooms map to five distinct material treatments and all art saves/restores world canvas state.
- `scripts/v009_browser_audit.py`: PASS at 667×375, 760×360, 844×390, 932×430 and portrait 390×844; no JS exceptions, two-thumb simulation and zero HUD/control intersection with center canvas.
- `scripts/guide_browser_audit.py`: PASS at four landscape sizes. Guide/replay controls stop the simulation without overlaying active combat.
- `scripts/v009_full_run_audit.py`: PASS entire eight-room, eight-relic, boss completion, victory and restart state machine. Enemy damage and legal repositioning are **test injected**; this is not evidence of natural human completion.
- `scripts/v0094_polish_audit.py`: three real Chromium DOM/layout profiles PASS. In a 650ms idle interval, heart-icon child mutations = **0**, objective-footer mutations = **0**, canvas debug attribute writes = **78–79** per profile (physics tick still updates). Pause-only threat guide has all seven descriptions, resume works, practice eastern gate transitions to crypt, no JS errors. Screenshot art warnings have a **test-injected attacker windup state**; they demonstrate rendering, not ordinary combat timing.
- Local `npm run export:pages` copied compiled JS and service worker into the repository-root mirror. The public Pages/CI result, if any, must be confirmed independently after committing.
- **Unverified:** physical iPhone Safari, standalone PWA offline lifecycle, sustained mobile FPS, two-thumb comfort, unaided Warden victory, and player Gate A approval.

# Test Matrix — Evidence, Not Assumptions

Run `npm ci && npm test` (Node.js 22) for build + foundation checks. Local initial authoring also ran `npm test` using locally available TypeScript 5.8.3; six tests passed. CI workflows are provided but GitHub Actions and Pages status require independent confirmation.

| Check | v0.01 local evidence | Real iPhone evidence |
|---|---|---|
| TypeScript build / relative site output | pass | not tested |
| Stable unique content IDs | pass | n/a |
| Reproducible seeded streams | pass | n/a |
| Nine planned realm metadata entries | pass | n/a |
| Gate constants and accurate v0.01 label | pass | n/a |
| Three-region controls with zero overlap | not implemented until v0.02–0.03 | not tested |
| Live combat and pause / restart | not implemented until v0.05–0.09 | not tested |
| Installed PWA / offline / Home Screen updates | not implemented until v0.02+ | not tested |
| GitHub Pages public deployment | configured workflow, verification pending | not tested |

Do not report GitHub Pages deployment or visual device acceptance from a local build. Later phases add browser DOM geometry checks and physical iPhone testing.


## v0.02 regression and geometry audit — 2026-11-09

- `npm test`: 9/9 PASS (compiled TypeScript output, seed determinism, content IDs, version/gates, correct manifest/PNG sizes, cache precache, stage camera aspect).
- `npm run typecheck`: PASS (strict TypeScript).
- Headless Chromium **in-memory** render audit via `python scripts/browser_audit.py`: no script exceptions; zero intersections of the canvas bounding rectangle with either control grip, controller-disc, button, header, footer, or other persistent HUD region; measured viewport and canvas match. Tested 667×375, 760×360, 844×390, 932×430 landscape and 390×844 portrait (rotate display replaces gameplay).
- This in-memory test is not a network HTTP load and cannot validate service worker registration, cached offline loading, or GitHub Pages publication. Browser navigation to local and public URLs returned `ERR_BLOCKED_BY_ADMINISTRATOR`; physical Safari and Home Screen tests remain pending.
- Original screenshot artifacts from browser audit were inspected manually for clipping, text legibility, and genuine three-region separation; **not** player art approval.

## v0.03 input and overlap audit — 2026-11-09

- `npm ci` (locked TypeScript 5.8.3), `npm run typecheck`, `npm test`: strict compile and **13/13** Node tests pass. These include source content IDs, PRNG seeds, original PWA manifest/icon dimensions, relative cache paths, canvas dimensions, dead-zone normalization, diagonal keyboard vectors, configuration bounds, and paused-only update UI.
- `python scripts/input_browser_audit.py`: local **in-memory** headless Chromium session at CSS dimensions **667×375, 760×360, 844×390, 932×430**, and portrait **390×844**. All PASS: two independent pointer IDs in opposite grips, avatar movement and visible training bolts, movement release leaving firing active, pointer cancel stopping firing, keyboard movement, blur reset, pausing freezing stage state, left-hand swap and settings persistence, exact canvas/frame rectangle equality, and zero grip/HUD/pause-button intersections with active canvas. No uncaught page errors.
- Browser screenshots captured and inspected; no claim of real iPhone device validation, manual two-thumb ergonomics, physical Safari `setPointerCapture` testing, or offline install verification.
- **Live v0.02 Pages verification:** fetched `https://hdog960.github.io/Runegrave/`, `manifest.webmanifest`, and `js/main.js` successfully with correct v0.02 content and no HTTP retrieval errors using an external page-fetch tool. This proves those resources were available publicly before v0.03, but **not** current v0.03 deployment, installed Home Screen behavior, or GitHub Actions status.

## v0.04 art/camera browser audit — 2026-11-09

- Compiled with `npm run build`, verified `npm run typecheck`; `npm test`: **16/16 PASS**, including three art/camera/PWA tests.
- In-memory headless Chromium via `python scripts/input_browser_audit.py`: **667×375, 760×360, 844×390, 932×430** landscape and **390×844** portrait PASS. The audit tests input dual-pointer capture/release, keyboard fallback and blur clearing, pausing, left-handed swapping, saved input preferences, zero canvas/HUD intersections, exact canvas/frame rectangle equality, measured camera aspect ratio and in-session viewport resize. Screenshots captured for manual art review.
- The new scenic renderer completed without JavaScript exceptions at all browser dimensions. The UI footer engraving was corrected after the first visual review to avoid crowding at narrow screen sizes.
- Browser navigation to localhost is blocked by the test container (ERR_BLOCKED_BY_ADMINISTRATOR), so real HTTP/service-worker offline lifecycle testing was **not possible locally**. `npm ci --offline` likewise could not install the uncached TypeScript tarball; the installed TypeScript compiler compiled and type-checked successfully. These environment limitations must not be described as passing.
- **Physical iPhone Safari/Home Screen, two-thumb ergonomics and user visual approval NOT YET VERIFIED.** v0.04 screenshot shown as a prototype for feedback, not Gate A approval.

## v0.05 deterministic collision and stage-integration audit — 2026-11-09

- `npm run typecheck` PASS; `npm test` **26/26 PASS** on Node 22 and TypeScript 5.8.3. Added 10 deterministic physics tests for 30/60/120/144 FPS equivalence, bounded frame catch-up, circle/AABB/capsule collision, safe spawn, high-speed obstacle crossing, sliding, wall containment, invalid inputs and replay stability.
- A first edge-case regression caught a capsule-root versus upper-wall pinch that could leave the player inside collidable scenery; the solver was corrected to accept **only collision-free candidate positions** and the test retained.
- `python scripts/input_browser_audit.py`: four simulated landscape iPhone viewport profiles (667×375, 760×360, 844×390, 932×430) plus portrait (390×844) all PASS with no uncaught page errors. Tested input and pause regression, left-handed swap and persisted settings, resized camera rectangle, a sustained physical wall movement, collision-safe actor telemetry, and no control/HUD/canvas intersection.
- Chromium testing is local/in-memory and **not** a Safari physical device check, service worker network lifecycle test, or proof of player-art approval. The full game, enemies, actual damage and seeded rooms are future milestones.

## v0.06 combat foundation checks — 2026-11-09

- `npm run typecheck`: **PASS**. `npm test`: **32/32 PASS** (26 retained + six actual combat tests). The new tests cover safe destructible placements over 170–310 world camera heights, pool reuse, world-blocking collision before hits, real damage and physical knockback, break and timed respawn, reproducibility at 30/60/120/144 render rates, invalid inputs and event registration.
- `python scripts/input_browser_audit.py`: local in-memory Chromium PASS at 667×375, 760×360, 844×390 and 932×430 landscape plus 390×844 portrait. Existing twin-pointer independence/cancellation, keyboard, pause, handedness, save preferences, world camera resize, physical wall limit, and zero DOM/control/HUD intersection still pass without console errors.
- `python scripts/combat_browser_audit.py`: distinct 844×390 in-memory Chromium test held the right rune-disc with touch input; observed **nine real Soulbolts fired, three hits, one shattered target and two active targets remaining**, with no JavaScript exceptions. Screenshot stored as `v006-combat-target.png` for visual review; this is browser-simulated, not physical Safari.
- Preserved first-hit training damage only: none of the three target props count as enemy AI, player HP or completed content. The v0.09 Gate A visual/player review remains required; no approval claimed.
- Pending for this release until independently checked: GitHub commit, public Pages URL/new runtime modules, real iPhone Safari/Home Screen, actual installed PWA service worker/offline lifecycle, genuine ergonomic two-thumb device playtest.

## v0.07 — deterministic health and stopped-simulation death (2026-11-09)

- `npm run typecheck` **PASS**; `npm test` **44/44 PASS** (32 previous tests + 12 health/environment/visual-integration checks). Verified half-heart arithmetic, iframes, damage-source validation, capped healing, irrevocable death until restart, safe hazard/shrine placement across 170–350 world heights, active/warning hazard differences, fixed-step reproduction at 30/60/120/144 renderer rates, shrine recharge and viewport-resize cooldown continuity.
- `python scripts/input_browser_audit.py` **PASS** at landscape 667×375, 760×360, 844×390 and 932×430 plus portrait 390×844; verified geometry has zero HUD/control/canvas overlaps, multi-touch pointer separation, cancellation, keyboard, pause, handedness, saved settings and camera resize.
- `python scripts/health_browser_audit.py` **PASS** at 844×390. A **test-only injected lethal environmental event** entered the real stage and input lifecycle: hearts emptied, death panel replaced the stopped simulation, pause/input were disabled, physics tick ceased, restart recovered all hearts and input with no JavaScript page errors. The test-injected fatal event is not a claim of real enemy AI; unit tests separately validate genuine ember contact and healing.
- Browser verification is in-memory Chromium due container restrictions on HTTP navigation. GitHub/public Pages publication is separately verified by external HTTP only after pushing. Safari Home Screen install, touch ergonomics on real hardware, background update lifecycle and final visual approval remain unverified.

## v0.08 — Hostile AI, boss and reachable-room audits (2026-11-09)

- Strict `npm run typecheck` **PASS**. `npm test` **54/54 PASS**: 44 retained v0.01–0.07 tests + 10 new v0.08 cases. The new suite covers six real AI families with distinct windups, health/invulnerability integration, room transitions/wave locking, boss phase-2 attacks, pooled player Soulbolt impacts on actual hostiles, deterministic fixed-step replay across 30/60/120/144 rendering rates, legal enemy spawns and **reachability-validated** east door positions at 148–350 world heights, safe resize preservation, and component/PWA cache presence.
- `scripts/v008_browser_audit.py` uses real independent ES modules in Chromium with no HTTP server: **4 landscape viewport profiles** (667×375, 760×360, 844×390, 932×430) plus **portrait** (390×844). Actual runtime checked independent pointer movement+firing, external HUD geometry (`getBoundingClientRect` zero overlap), paused-only menus, left-handed swap, portrait gate and no page errors. This is an in-memory Chromium simulation, not physical Safari.
- Real-browser keyboard traversal verified practice antechamber → locked crypt without any test teleport. The separate `scripts/v008_full_run_audit.py` uses **test-only** boss/enemy hit injections and a **test-only** actor position harness to exercise the complete UI sequence: three enemies → second three enemies → crypt exit unlock → Warden phase 1/2 and defeat → exit → complete panel → restart. The fake damage/positioning are explicit and the script is a state-transition test, **not** proof that a player can manually win at normal difficulty. Pure combat tests separately verify actual pooled Soulbolt collisions.
- Unverified: real iPhone two-thumb comfort, native Safari/standalone Home Screen runtime, genuine offline lifecycle, session persistence beyond controller preferences, complete manual victory run, and player art approval. Do not claim v0.09 until all its own relic/room/approval requirements are met.
- GitHub Pages publication, commits and Actions workflow must be verified independently after writing the implementation.

## v0.09 First Soul / mandatory Gate A (2026-11-09)

- Local `npm run typecheck` **PASS**; `npm test` **63/63 PASS** including nine additional authored-room, relic and PWA checks. Validated 25 unique enemy wave compositions, legal enemy spawning and connected eastern doors at camera heights 148/160/190/218/260/310, pickup-floor availability, deterministic eight-room selection and coverage of all 25 across alternate seeds, actual Soulbolt combat profile differences, heart-capacity reset, healing-on-clear, silver bonus and no premature Gate A approval.
- Headless Chromium in-memory browser audit `python scripts/v009_browser_audit.py`: **667×375, 760×360, 844×390, 932×430 landscape + 390×844 portrait PASS**, no JS errors, zero HUD/control intersections, genuine multi-pointer controls and preferences test passed.
- Browser full-chain `python scripts/v009_full_run_audit.py` **PASS**: real practice → room 1 → 8 sequential room gate transitions, mandatory relic pickups enforced before door entry, all eight relics acquired, silver collected, Rootbound Warden defeat / boss gate, clear overlay, and reset of run relics/currency/heart capacity while preserving input settings. **This harness uses explicit TEST-ONLY direct enemy HP reduction and direct legal actor positioning for expedience; it is not a human normal-play win.** Separate deterministic combat tests cover Soulbolt damage on real enemies.
- Screenshots: `v009-first-chamber.png`, `v009-relic-pedestal.png`, `v009-eight-relics.png`, `v009-warden.png`, `v009-victory.png`, and four landscape/portrait images. Actual iPhone Safari, Home Screen PWA/offline lifecycle, thumb comfort and player approval remain **NOT TESTED / PENDING**.
- No content proceeds past v0.09 before player Gate A acceptance. See `docs/GATE_A_REVIEW.md`.

## v0.09.1 user-understanding repair — 2026-11-09

- Player feedback: **could not tell what was going on** during the v0.09 review. Gate A remains awaiting the player's explicit art/control acceptance.
- `npm run typecheck` PASS; `npm test` **69/69 PASS**: six new guide/objective tests cover safe navigation instructions, correct singular/plural enemy counts, mandatory relic collection, boss/clear messaging, a paused-only first-start screen and the new PWA cache module.
- `python scripts/v009_browser_audit.py`: all four portrait/landscape test profiles PASS in local in-memory Chromium, verified guide is visible on fresh launch, simulation paused, Start unpauses, two-pointer movement/fire, settings and zero HUD/control overlap remain valid.
- `python scripts/guide_browser_audit.py`: 667×375, 760×360, 844×390 and 932×430 landscape PASS. Verified Start remains visible, no physics ticks while guide open, exterior PAUSE disabled during guide, guide closes and unpauses, Pause → How to Play reopens, Escape/P cannot unpause behind the guide, and saved guide-seen preference can be written in a localStorage stub. Captured genuine guide screenshots. This is **Chromium, not a physical iPhone test**.
- `python scripts/v009_full_run_audit.py`: PASS after completing the new introductory guide, retaining the previously verified 8-chamber/boss/victory/restart flow with explicitly test-injected enemy damage and actor teleportation. Not a human unaided win.
- Deployment and source SHA must be verified on GitHub/Pages separately after commit; these local tests are insufficient to claim live publication.

## v0.09.2 Gate A player-feedback validation — 2026-11-09

- User observations: ambiguous doors, eight nearly identical rightward transitions, and no feedback on collected item effects. Gate A NOT APPROVED and no v0.10 work performed.
- Strict TypeScript typecheck PASS; `npm test` **72/72 PASS**. Three new validations cover all four compass signs and eight planned directions, pathfinding of every cardinal doorway from the legal entry point across six room heights, and updated relic/door UI and PWA modules. All old combat, health, controller and authored-room cases remain passing.
- `scripts/v009_browser_audit.py` four landscape reference viewport profiles plus portrait PASS; `scripts/guide_browser_audit.py` four landscape PASS with paused guide. Zero persistent HUD/controller intersections with the active canvas.
- `scripts/v009_full_run_audit.py` full practice → eight chambers → relic pickup explanation and continue → compass exits → Warden → victory → restart PASS; verified all four cardinal directions occur in one run and pickup cards expose a concrete benefit before controls resume. **Test-only actor teleportation and hostile HP reduction used; this is not an unaided normal human win or physical iPhone ergonomics test.**
- New `doorArt`, `wayfinding` and `relicDiscovery` PWA assets mirror to the repository-root static site. Public deployment verification is separate and only recorded upon successful remote asset requests and Actions status. Physical iPhone testing remains pending.


## v0.09.3 Gate A visual clarity refinement (local evidence)

- Dedicated original ash/iron door art revised for stronger jambs, direction plaque, lit locks and readable sealed/open states.
- A safe-connected route of animated **carved floor waystones** appears only after the fight and mandatory relic reward have unlocked the exit. These world-space stones are not touch controls or HUD overlays.
- Each of the six hostile kinds and the Warden now communicates its specific windup attack through distinct in-world text, color and a stronger imminent-danger warning.
- Relic acquisition panels report live before→after combat stats, heart capacity or silver benefit. Finger-pressed rune discs brighten within their dedicated controller grips.
- **Automated/local browser evidence** is reported in the release ledger only after tests complete. No physical iPhone, offline installed PWA, unaided clear or player approval is inferred.
