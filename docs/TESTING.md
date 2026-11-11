## v0.09.21-r1 — Post-strike recovery bug QA (2026-11-10 US Central)

- **Historical failure is preserved:** after v0.09.21 source and docs merge, `main` GitHub Actions [run 42949260327](https://github.com/hdog960/Runegrave/actions/runs/42949260327) failed one Chromium browser job with `Invalid hostile atlas windup` in a real crypt enemy recovering after crossing attack countdown zero. Node still passed. This CI catch required actual code correction; passing earlier screenshots were insufficient.
- **Corrected PR:** [#6](https://github.com/hdog960/Runegrave/pull/6), merged code `ead630c1e7a1910c8889090262e5c63aa52d1183`. `enemyAtlasBand` and `paintOathEnemyStrike` accept finite negative post-strike windup without rendering false active attacks. Genuine warning overshoot clamps to urgent band three. NaN still errors. No mechanics/AI/save mutations.
- New Node test in `gateA0111.test.mjs`: all seven enemy kinds, inactive negative `idle`/`recover` and active zero-crossing warning, strict still sprites and visible urgent pose. The initially failing PWA expectation was updated to require the newly changed `r1` cache **exactly**; earlier test thresholds and gameplay assertions retained.
- Corrected candidate [Actions run 42949769079](https://github.com/hdog960/Runegrave/actions/runs/42949769079) and postmerge [Actions run 42949948296](https://github.com/hdog960/Runegrave/actions/runs/42949948296) both concluded **SUCCESS**, with TypeScript `npm test` **158/158 pass** and actual Chromium browser check. Browser script explicitly writes `windup=-1/120` onto a live recovering enemy and confirms no page errors, plus full scripted touch/controller/character-gallery regressions at four landscape widths and portrait.
- Both live Pages deployment jobs succeeded. Independent public HTTP fetch confirmed 0.09.21 runtime, `runegrave-shell-v0.09.21-r1` and corrected sprite + Oath warning code. Installed iPhone PWA refresh/offline not yet exercised.
- Seven canonical docs and protected source/gameplay integrity unchanged; all 8 functional relics, 25 rooms, health/save schema/side rail input maintained. Gate A still pending real-device and artistic acceptance, v0.10 locked.

## v0.09.21 — Verified art and gameplay QA evidence (2026-11-10 US Central)

- Art candidate `gate-a-v00921-authored-sprite-atlas`, [PR #5](https://github.com/hdog960/Runegrave/pull/5), merged source SHA `7bf011134bfc56ae34945808b2b20dd1dc1d8e70`. Candidate [CI `42948737951`](https://github.com/hdog960/Runegrave/actions/runs/42948737951) and post-merge [CI `42948975381`](https://github.com/hdog960/Runegrave/actions/runs/42948975381) both **SUCCESS**.
- `npm test` strict TypeScript compiled and **157/157 Node tests passed**. New `gateA0111.test.mjs` checks atlas cell size, four hand-authored hero bases/eight distinct directions and four actual leg frames, seven distinct full enemy silhouettes plus Warden phase-two thorns, warnings exactly keyed to genuine remaining windup, bounded batched Canvas paint calls, reduced-motion frame stability, compiled live painter integration and new SW offline asset. Superseded hero overlay test rewritten to assert real atlas wiring and absence of old stacked overdraw. Combat, 8 relic and 25 room regression coverage retained.
- **Chromium** on Ubuntu 24.04 passed baseline + v0.09.21 runner in 4 landscape sizes (667×375, 844×390, 932×430 and 1024×440) and portrait. Real app launch, stage entry, two external grip bounding-box isolation, simultaneous touch movement + aim/shots and zero uncaught JS exceptions verified. Actual module independently imported in Chromium to render 8 unique direction sprites and all 7 unique hostile bodies; contact-sheet screenshot and 2 gameplay screenshots saved in Actions artifact `gate-a-v00921-atlas`.
- Browser screenshot regression: first contact-sheet screenshot scrolled viewport so later screenshot captured the offscreen sheet rather than gameplay. Fixed the audit itself by removing the contact-sheet canvas and restoring `window.scrollTo(0,0)` with explicit assertion. Downloaded final CI artifact, independently visually inspected the final contact sheet, combat warning screenshot and the **corrected two-thumb gameplay image**. This is visual inspection of Chromium captures, *not* real iPhone evidence.
- GitHub Pages publish #65 and default Pages #74 succeeded; public HTTP source independently confirmed version `0.09.21`, service-worker cache `runegrave-shell-v0.09.21`, and the actual new module plus both live actor renderers using it. PWA on a physically installed iPhone remains untested.
- All seven authoritative document blobs, eight protected gameplay/controller/PWA source blobs and zero existing file removals verified by comparing `main` to v0.09.20 baseline.
- **Not certified**: physical Safari, sustained iOS performance, installed PWA/refresh/offline behavior, full unaided gameplay boss victory and user aesthetic signoff. Remain strictly within Gate A; v0.10 prohibited pending approval.

## v0.09.20 — Actual QA and release evidence (2026-11-10 US Central)

- Branch `gate-a-v00920-architectural-ink`, PR [#4](https://github.com/hdog960/Runegrave/pull/4), merged source SHA `81d598b6133e2fbd7677bfcaa8d6808e318904dc`. Candidate GitHub workflow `42943646322` and main workflow `42943879531` both **SUCCESS** with strict npm test + browser jobs.
- **153/153 automated Node tests PASS**, including four new real `tests/gateA0110.test.mjs` cases that verify five distinct masonry silhouettes, five narrative inlays, all 25 authentic canonical room designs, upper-world draw bounds y≤54 and call limits, reduced-motion stillness, eight-direction gear with real four-step recovery and firing recoil, seven distinctive enemy-kind warning shapes and all four real windup bands, real compiled imports, save schema 1 and PWA cache coverage.
- Initial PR build failed one new pose test (152/153 passed) because two recovery frames shared the same visual pose. Improved the actual art in source and JS mirror and adjusted only an incorrect test stimulus that sampled firing at zero recoil; **all 153 tests then passed** without removing existing assertions or weakening bounds.
- GitHub Actions headless Chromium `v009_browser_audit.py` plus `v00920_browser_audit.py`: four simulated iPhone landscape viewports and portrait, guided launch and real chamber entry, two physically separate grip hit regions outside the central playfield, simultaneous movement/aim/firing, no uncaught JS runtime errors. CI archived two browser screenshots. **This is not physical iPhone Safari or end-to-end manual full run.**
- Production Pages publish #63 and default Pages #72 completed successfully. Independent live HTTP fetched `js/core/version.js` with version `0.09.20`, `sw.js` with `runegrave-shell-v0.09.20`, `js/scene/eddicCornice.js` with three new artists and three compiled actual gameplay renderers importing/invoking them.
- Seven governing document Git blobs, eight crucial gameplay/control code blobs and all prior files retained. Save schema remains 1; two-thumb center exclusion remains intact in simulated layouts.
- **Still unverified:** physical iPhone Safari performance/comfort, PWA Home Screen refresh/offline on device, unaided boss victory/full-run progression and the player’s premium art standard. Continue Gate A; v0.10 remains locked.

## v0.09.19 — Verified release QA (2026-11-10 US Central)

- Source branch `gate-a-v00919-stone-sagas`, merged PR [#3](https://github.com/hdog960/Runegrave/pull/3) to commit `fe2f0096d85e1a1c16ef9b4c1e288ecb7eb0fc5a`. Candidate test run `42941255797` and post-merge main test run `42941422327` both completed **SUCCESS**.
- TypeScript strict build and **149/149 Node tests PASS**, including new `tests/gateA0109.test.mjs`: five original family stone bodies, five mythic inlay scene geometries (25 distinct combined pieces), 25 canonical family/serial invariant, fixed side-wall translation `x=38` and `x=W-38`, geometry footprint, painter call bounds, deterministic reduced motion, distinct OPEN/LOCKED threshold designs, real compiled renderer insertion, service-worker coverage and unchanged save schema 1.
- The first candidate failed exactly two genuine doorway art tests, including the long-standing OPEN > LOCKED silhouette detail hierarchy. Corrected open-arch six paired perspective ribs in source + compiled browser mirror, preserved prior assertions, reran all 149 tests successfully. Existing tests were **not** weakened.
- Browser CI uses actual headless Chromium on GitHub Actions Linux: baseline `v009_browser_audit.py` and v0.09.19 `v00919_browser_audit.py` passed landscape widths 667, 844, 932 and 1024, portrait rotate instruction, guided start, crypt room entry, two independent PointerEvents for move/aim with emitted Soulbolts, and zero page JS errors. Browser screenshots uploaded to CI artifacts. It does **not** substitute for real hardware.
- Two Pages deployment workflows completed successfully; independent direct HTTP reads of public compiled version, service worker, art painter, stage and door confirmed exact 0.09.19 source and active `runegrave-shell-v0.09.19`.
- Seven governing documents and key controls/combat/physics/health/run sources were independently confirmed identical Git blob SHAs; zero existing files removed.
- Outstanding before Gate A signoff: real iPhone Safari/PWA storage and refresh, sustained performance, full unaided route victory, user's premium Norse artwork assessment, and comfort without gameplay obstruction. No v0.10 authorization.

## v0.09.18 — Post-merge CI / browser evidence (2026-11-10 US Central)

- Pull request [#2](https://github.com/hdog960/Runegrave/pull/2) merged as `076914e`. Both pull-request and post-merge `Runegrave foundation checks` workflows succeeded.
- **Node + TypeScript:** `npm test` compiled strict TS and completed **146 of 146 passing tests**. New `tests/gateA0108.test.mjs` verifies all 25 family/hem mosaics, five different pixel shapes, both edge mounts, save/restore symmetry, reduced-motion stillness, painting-call footprint, all eight hero facings, four uniquely drawn walk poses and seven real windup-stage silhouettes. Version, PWA module caching, safe save schema and existing catalog are verified. First CI failure (only three distinct gait poses) was repaired in artwork, not papered over in tests.
- **Real Chromium automated runtime, not physical Safari:** Ubuntu 24.04 Playwright runner passed the established `scripts/v009_browser_audit.py` across small/regular/plus/compact landscape and portrait, then `scripts/v00918_browser_audit.py` across four landscape viewport sizes plus portrait. It verified center canvas separation from controls, guided launch, entering a real authored room, test-set warning pose, simultaneous left/right pointer input and fired Soulbolts, no uncaught browser JS errors. Screenshots were archived to GitHub Actions artifacts.
- **Public Pages/PWA:** GitHub build/publish workflow #59 and Pages deployment #68 were successful. Independently fetched public `/js/core/version.js`, `/sw.js` and `/js/scene/sagaArtwork.js`; confirmed application version 0.09.18, service-worker shell cache 0.09.18 and new compiled artwork export.
- **Immutable design basis:** Seven authoritative document blobs match previous `main`, save schema remains 1, no preexisting files deleted, no modifications to physical controls, enemy collision, damage or relic behavior.
- **Explicit limits:** Physical iPhone thumb reach, actual installed PWA offline/refresh, sustained iOS performance, unaided full route victory, and player Gate A visual approval remain **UNVERIFIED**. Do not start v0.10 or claim premium art complete.

## v0.09.17 — verified post-merge GitHub CI and browser tests (2026-11-10)

- GitHub PR #1 merged as `6df87b5`; final `npm test` via CI compiled strict TypeScript and ran **142/142 passing Node tests**, retaining the prior functional gameplay regressions.
- New `tests/gateA0107.test.mjs` covers 25 unique deterministic family/cut gallery render signatures, all eight helmet/armor facings, seven real warning-state gesture identities, stable reduced-motion frames, paint-call budgets and unmodified eight-relic catalog.
- `scripts/v009_browser_audit.py` ran successfully on small/regular/plus/compact simulated landscape and portrait Chromium, including first-run tutorial, center canvas boundaries, dual-pointer input, pause/resume and zero JavaScript page errors. `scripts/v00917_browser_audit.py` independently exercised compact/regular/plus/large landscape chamber entry, separate rails, thumb-fired shots, portrait rotate message and no JS exceptions. Images/screenshots and runs are not physical Safari testing.
- Fixed strict TypeScript stride narrowing, outdated version/PWA assertions, production `public/sw.js` cache version, FATE gallery render-call budget, and pinned supported browser runner to Ubuntu 24.04. GitHub CI #64 and Pages workflow #57 completed successfully.
- Independent Pages fetch confirms `APP_VERSION=0.09.17`, PWA cache name `runegrave-shell-v0.09.17`, and updated public rendering module. Seven canonical documentation Git blobs match v0.09.16 baseline.
- NOT tested on a real physical iPhone; installed offline refresh, real long-play thermal/performance, unaided full-run win and player aesthetic/controls sign-off remain pending. Gate A still unapproved and v0.10 remains locked.

## v0.09.16 additional verified local checks

New tests for four real compass thresholds, eight accurate relic inscriptions, bounded five-variant chamber art and the unchanged Gate A/save contract. Local reconstruction 134/134 tests, TypeScript, Chromium four landscape and portrait layouts, and test-controlled complete route; final GitHub CI and live Pages must be separately verified.

## v0.09.15 — Actor silhouette and enemy strike Gate A checks

- Local `npm run typecheck`, `npm run export:pages` and `npm test`: PASS, **135/135 tests**. Five new tests cover eight facings/four frames, bounded hero art, seven independent enemy poses, remaining-windup stages, reduced-motion freeze, 25 authored rooms/eight functional relics, PWA preload and locked Gate A.
- In-memory Chromium: four supported landscape layouts plus portrait, guided start, idle HUD performance, mobile interruption/auto-pause and in-grip threat/readout checks all PASS; no control or status HUD overlaps the center canvas.
- Full eight-relic/Warden route and restart PASS using **test-only direct hostile hits and legal hero-position changes**. This is not evidence of a natural manual victory.
- A test-only enemy warning pose and actual paired-thumb firing were captured in Chromium without JavaScript exceptions; these images are not proof of physical Safari or PWA offline behavior.
- Physical iPhone ergonomics, installed Home Screen/offline updates, sustained GPU performance, unaided win and player Gate A art/control approval remain UNVERIFIED. Do not advance to v0.10.

## v0.09.14 — Gate A relic-identity browser and regression evidence (2026-11-10)

- Local strict TypeScript PASS; `npm test` **130/130 PASS** (125 preexisting cases retained, five added in `tests/gateA0104.test.mjs`). New tests assert all eight actual owned relic identities, stacked projectile silhouette changes, max 20 decorated real active bolts, balanced canvas state, reduced-motion stability, and no Gate A/version/ASSET regressions.
- `npm run export:pages` PASS; compiled `js/run/relicBattleArt.js` mirrored at repo root and included in versioned `sw.js` offline asset list. Runtime sprite decorations never own damage, range, firing cadence, state transitions or hitboxes.
- In-memory Chromium `scripts/v009_browser_audit.py` PASS four landscape viewports and portrait; `scripts/guide_browser_audit.py` PASS four landscape sizes; `scripts/v009_full_run_audit.py` PASS eight rooms, mandatory relic pickups, Warden, victory and reset with **TEST-ONLY enemy damage / actor-position injection**; `scripts/v0099_mobile_browser_audit.py` PASS three landscape interruption layouts. These are browser emulations, not physical Safari or standalone offline PWA verification.
- `scripts/v0104_relic_combat_audit.py` PASS 844×390 Chromium with **TEST-ONLY relic acquisitions**, then real pressed right-grip firing and actual compiled stage rendering; 8/8 relics displayed, no JavaScript errors, grip/canvas overlap zero. The injected acquisition is only for a screenshot, not evidence of a natural playthrough.
- Physical iPhone two-thumb ergonomics, user Gate A visual approval, natural human victory, real installed PWA update/offline operation and sustained battery/FPS have NOT been verified. **Gate A unapproved; v0.10 blocked**.

## v0.09.13 — Gate A hero/environment/hostile-frame validation (2026-11-10)

- `npm run typecheck`: PASS. `npm test`: **125/125 PASS**, including four new art tests checking eight facing silhouettes, four walking frames and recoil, seven enemy kinds' distinct attack poses and reduced-motion stability, five chamber depth motifs, bounded edge geometry, and preserved 25 authored rooms, eight functional relics, saved schema 1 and Gate A lock.
- Chromium `scripts/v009_browser_audit.py`: PASS at 667x375, 760x360, 844x390, 932x430 landscape and 390x844 portrait; independent left/right pointer controls and no canvas overlap. `scripts/guide_browser_audit.py`: PASS all four landscape sizes; guide remains paused and replayable. The guide audit waits for module initialization rather than relying on a 180ms delay, fixing an intermittent *test harness* timing failure.
- `scripts/v0095_visual_audit.py`: PASS, five actual chamber-family screenshots in in-memory Chromium, independent two-thumb input and no JS exceptions. `scripts/v009_full_run_audit.py`: PASS full practice -> eight chamber rewards -> Warden victory -> restart using test-only enemy damage and actor repositioning. `scripts/v0099_mobile_browser_audit.py`: PASS three auto-pause/interruption/resume layouts. `scripts/v0100_threat_browser_audit.py`: PASS four landscape warning/no-overlap layouts.
- No physical iPhone Safari, Home Screen offline service-worker lifecycle, sustained mobile frame-time, unaided game clear or user visual approval has been verified. Do not declare Gate A approved or v0.10 started.

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
