# RUNEGRAVE: THE NINEFOLD DESCENT
## Locked Development Roadmap — v0.01 to v1.0

**Status:** PLANNED / NOT YET IMPLEMENTED — never interpret target versions as actual progress.  
**Companion authorities:** `DESIGN_BIBLE.md`, `UI_CONTROLS_AND_ART_DIRECTION.md`, and `HANDHELD_CONTROLLER_LAYOUT.md`.  
**Platform:** iPhone landscape, Safari + Home Screen PWA.  
**Hosting:** Existing GitHub repository and GitHub Pages, with no mandatory paid services.  
**Forbidden workflow requirements:** No Codex, no ChatGPT Work, no Vercel, no required paid APIs/services.

> **Locked handheld-controller aesthetic throughout all 100 versions:** landscape iPhone presentation is an original Norse-themed handheld console with integrated left and right controller grips and a completely unobstructed center display. Use the Nintendo Switch only as an ergonomic/layout reference, not for copied art, branding, or distinctive industrial design. The grips must appear structural, stylish, and cohesive with the game, not as floating onscreen buttons.

> **Critical mobile requirement throughout all 100 versions:** touch controls and the persistent HUD live outside the combat playfield. A separate center-only canvas is used for gameplay. No transparent or opaque controls, HUD panels, pause buttons, maps, item tooltips, or decorative UI may overlap active gameplay. This is a hard testable criterion, not a visual preference. All menus and controls must have a consistent, stylish runic-Norse art direction. Detailed tests and designs are locked in `UI_CONTROLS_AND_ART_DIRECTION.md`.

## I. How to operate this roadmap

Every version is a *real, verified development release*, not one AI session or a promised timeline. A version is completed only after source/assets are implemented, tests pass, real gameplay can be exercised, saves remain compatible, Git changes are committed, deployment is verified where access permits, and the release ledger reflects actual progress. Do not skip versions to report higher progress; do not count placeholder content. Prioritize gameplay and quality over hitting numbers fast.

Maintain at least `DESIGN_BIBLE.md`, `ROADMAP.md`, `UI_CONTROLS_AND_ART_DIRECTION.md`, `CONTENT_LEDGER.md`, `SYSTEMS.md`, `CHARACTERS.md`, `RELICS.md`, `WORLD.md`, `ART_DIRECTION.md`, `TESTING.md`, `CHANGELOG.md`, `RELEASE_STATUS.md`. A repository may organize these inside a `docs/` folder, but all relative links must remain functional.

Version statuses: `NOT STARTED` → `IN DEVELOPMENT` → `IMPLEMENTED` → `TESTED` → `DEPLOYED` → `VERIFIED`; alternative states are `BLOCKED` and `AWAITING PLAYER APPROVAL`. An automated test is not proof of a real iPhone playtest. An unverified deployment is not deployed.

### Four player approval gates

- **Gate A after v0.09:** Camera, gameplay size, runic UI, separate thumb-control rails, early pixel art, input comfort, and core combat.
- **Gate B after v0.39:** Distinct realm art, characters, bosses, and coherent themed menus, all with zero gameplay overlap.
- **Gate C after v0.79:** Mature full roster, complex builds, late-game visual effects, complex HUD states, and polished multi-realm presentation.
- **Gate D after v0.99:** Final art, controls, performance, saves, and release readiness.

If a gate is not approved, improve its specific failure areas before advancing through major downstream content production. No silent automatic approvals.

---

# ERA ONE — THE FIRST SOUL
## v0.01–v0.09 | Technical foundation and first combat

**Exit target:** A real playable prototype on GitHub Pages that respects the unobstructed central combat viewport.

### v0.01 — Project audit and foundations
Inspect the existing repository, branch, project files, and Pages setup. Do not overwrite already working files. Establish modular TypeScript architecture, content IDs, asset folders, build/tests, version metadata, design bible, and roadmap. Verify local build and deployment workflow configuration without claiming success until checked. **Done when:** clean build and a documented verified repository baseline exist.

### v0.02 — Pages, PWA, and segmented screen shell
Deploy the smallest working app through the existing Pages URL. Implement manifest, icons, asset base paths, safe-area handling, offline-capable architecture, and installation/standalone detection. **Build the real three-region handheld-controller landscape screen now**: visually integrated Norse rune-carved left grip, separate central gameplay column/canvas, matching right grip, with HUD in non-canvas regions. No controls float atop the stage. **Done when:** app loads from Pages and uses genuinely separate UI/canvas rectangles.

### v0.03 — Twin-stick iPhone input
Implement low-latency, simultaneous left movement and right aiming/firing within **dedicated side rails only**. Add pointer capture, multi-touch IDs, cancellation behavior, control dead zones, adjustable placement *within the rails*, left-hand mode, and keyboard fallback. Screen-safe pause/action positions are outside the canvas. **Done when:** movement + aim + attack work together with two comfortable thumbs on opposite controller grips, touches never hit the playfield overlay, and zero-overlap geometry tests pass.

### v0.04 — Art prototype, viewport, and thematic HUD
Define pixel scale, camera aspect, environmental lighting, animation states, and initial art. Replace generic controls with an integrated premium Norse handheld-console frame: forged-metal/ash-wood left and right grips, inset thumb discs, carved rune action buttons, believable seams and pressed states, and legible health/resource framing. Do not copy Nintendo button artwork or branding. Build a camera that renders only into the true center canvas, with no enemies/telegraphs hidden by rails. **Done when:** center-stage combat is readable and the whole screen feels like an original, polished Norse handheld console, not a generic web game with overlay buttons.

### v0.05 — Physics, simulation, and collision
Implement deterministic fixed-step movement, world collision, hitbox shapes, object layers, wall collision, safe spawn coordinates, and stable input-to-simulation integration. Separate simulation from rendering. **Done when:** repeated movement/impact tests behave consistently independent of frame rate.

### v0.06 — Soulbolt attacks and combat pipeline
Create attacks with attack rate, projectile speed, range, damage, collision, knockback, destructible objects, and basic hit feedback. Implement projectile pooling and modular effect hooks. **Done when:** aiming, firing, and kills are responsive on the actual gameplay canvas without hidden attack zones.

### v0.07 — Health, damage, healing, and death
Add Mortal Hearts, invulnerability windows, damage ordering, health containers, basic healing, death state, and a readable health display in the **HUD rail/status area, never above the stage**. **Done when:** health calculations are correct and death/restart do not leave stuck input.

### v0.08 — Basic encounters and room locks
Create six distinct enemy AI patterns, spawn logic, enemy death events, lockable doors, clear conditions, and a first actual boss. Give attacks suitable telegraphs for the reduced-but-unobstructed central stage. **Done when:** enter → fight → clear → exit works consistently.

### v0.09 — First playable prototype / Gate A
Assemble a connected set of approximately 25 valid room configurations, a basic boss route, eight working relics, initial resource pickups, and an original death/restart loop. Test in landscape Safari and installed mode where available. Present screenshots/video or verifiable build for review of camera, readable central stage, non-overlapping left/right handheld controller grips, cohesive Norse industrial art, input comfort, and combat feel. **Do not move past Gate A without explicit player art/control approval.**

**Cumulative target:** 8 relics; 1 character; 6 enemies; 1 boss; 25 rooms.  
**Validation:** original handheld-inspired side-grip styling with explicit player approval; no obstructed gameplay pixels; initial art approval; one end-to-end mini-run; basic mobile performance.

---

# ERA TWO — THE FIRST DESCENT
## v0.10–v0.19 | Dungeon loop, items, persistence

**Exit target:** A small but complete procedural roguelike with multi-floor victory and reliable saving.

### v0.10 — Seeded floor graphs
Build reproducible procedural floor graphs with start, boss, optional treasure, valid door connections, and separate random streams. Write connectivity tests and debug seed reporting. **Done when:** thousands of test seeds generate reachable layouts.

### v0.11 — Room geometry and encounter variety
Implement long/wide/double rooms, hazards, scenery collision, difficulty budgets, and weighted room-selection rules. Add authored room variants with distinct geometry. **Done when:** camera framing remains fair across stage shapes and room entry points.

### v0.12 — Pickups and inventory resources
Add silver, keys, bombs, chests, health pickups, special variants, pickup collection rules, and UI counters in external status regions. **Done when:** collection/spending, persistence, and resource-driven doors work.

### v0.13 — Multiple health types
Add Spirit Hearts, Cursed Hearts, Bone Hearts, protection ordering, special healing and health conversion. Update the thematic rail-HUD to show all states without crowding the playable area. **Done when:** tests cover mixed hearts, partial damage, death, and healing caps.

### v0.14 — Data-driven relic registry
Implement typed definitions for relic ID, name, original sprite, rarity/quality, pool eligibility, passive modifier, visual state, and event hooks. Reject missing/duplicate IDs. **Done when:** a relic can be added through content definitions without editing every combat subsystem.

### v0.15 — Active relics, charges, and talisman slot
Add charge-based actives, contextual interaction, rechargeable abilities, one normal talisman slot, and held consumable. Place active buttons and charge feedback outside the canvas. **Done when:** acquired abilities activate/recharge and never interfere with aiming.

### v0.16 — Boss phase architecture
Introduce phase transitions, animation timelines, attack-pattern scheduling, boss reward logic, boss-room transitions, and additional distinct boss encounters. **Done when:** all current bosses have dodgeable, legible patterns.

### v0.17 — Destructibles and hidden chambers
Create secret-room placement rules, bombs and reinforced objects, breakable environmental props, hidden chests, and progression-aware discovery opportunities. **Done when:** secrets are reproducible, learnable, and correctly connected.

### v0.18 — Robust save and resume
Use IndexedDB with schemas, versioning, save-migration foundations, current-run snapshots, permanent unlock separation, export/import backup, invalid-data recovery, and service-worker update safety. **Done when:** reload and normal app updates do not reset progress, with explicit warnings about browser storage limitations.

### v0.19 — First complete miniature game
Connect multiple floors, a true victory outcome, permanent rewards, a second character, and roughly 40 functional relics/15 enemies/four bosses/100 valid rooms. Recheck live UI through transitions, pause, and resume. **Done when:** several complete runs can be played on mobile and gameplay stays unoccluded.

**Cumulative target:** 40 relics; 2 characters; 15 enemies; 4 bosses; 100 rooms.  
**Validation:** multi-floor completion, reliable death/restart, save export/import, Pages update, zero-overlap regression.

---

# ERA THREE — THE RELIC ENGINE
## v0.20–v0.29 | Synergies, economy, character identity

**Exit target:** A genuine build-driven roguelike, not a basic shooter with stat collectibles.

### v0.20 — Enemy behavior families
Expand AI with chargers, teleporters, splitters, projectile predictors, healers, summoners, and elite/champion modifiers. Define enemies through shared behavior modules and unique attack rules.

### v0.21 — Four playable character identities
Introduce Skadi's Disciple and Brynja alongside earlier characters, with distinct statistics, health conditions, signature mechanics, and art. All four must feel noticeably different.

### v0.22 — Weighted independent item pools
Implement treasure, boss, shop, secret, divine, covenant, and specialty pools with quality weights, eligibility, unlocks, exclusions, and pedestals. Prevent unrestricted random relic generation where pool rules apply.

### v0.23 — Merchant and gambling economy
Build shops, price variations, restocking behavior, donation features, beggars, exchanges, and wagering minigames. Every cost/payout must be represented and tested.

### v0.24 — Floor curses and blessings
Build configurable floor modifiers and initial curses affecting map, visibility, item identification, and room behavior. Show curse state in the external themed HUD.

### v0.25 — Elemental status framework
Introduce fire, poison, ice, bleed, lightning, charm, and spectral types with resistance, duration, stacking, and enemy feedback. Include combination interactions.

### v0.26 — Combinatorial combat event engine
Develop unified modifier pipelines for homing, piercing, bouncing, returning, charge, splitting, beams, multi-shot, and collision. Add deterministic stacking, recursion guards, and automated synergy tests.

### v0.27 — Transformation engine
Add transformation tags, requirement counting, visual form changes, and two complete multi-relic transformations with genuinely altered behavior.

### v0.28 — Challenge arena foundation
Create fight-wave challenges, risk modifiers, meaningful rewards, and at least five curated challenge runs that grant permanent unlocks.

### v0.29 — Build-diversity checkpoint
Reach 100 complete relics, 30 enemies, eight distinct bosses, 300 rooms, four characters, and two transformations. Run high-synergy simulations and verify two different winning builds. **Do not count passive stat changes as special synergies.**

**Cumulative target:** 100 relics; 4 characters; 30 enemies; 8 bosses; 300 rooms.  
**Validation:** tested synergies; distinct characters; true item pools; no broken recursive loops; HUD remains separate.

---

# ERA FOUR — ROOTS OF YGGDRASIL
## v0.30–v0.39 | Identity, realms, first ending

**Exit target:** Strong Norse identity, full initial story route, and approved realm-art quality.

### v0.30 — Midgard art overhaul
Complete burial halls, forest ruins, authentic material language, themed obstacles, original enemies, and polished combat-room variation.

### v0.31 — Niflheim
Introduce glacial textures, fog, ice traps, frost enemies, original bosses, floor modifiers, and readable cold-related visuals.

### v0.32 — Svartalfheim
Implement machine hazards, dwarven mine/forge tiles, metallic architecture, molten channels, constructs, and area-specific reward logic.

### v0.33 — Alfheim and Vanaheim foundations
Create two genuinely different magical forest families: enchanted light and mystical overgrowth. Add roots, flora hazards, spirits, and unique floor events.

### v0.34 — Chests, runes, brews, and scrolls
Implement several chest types, runic consumables, unidentified Mysterious Brews, one-use Saga Scrolls, identification/rarity systems, and secret treasure combinations.

### v0.35 — First full story ending
Connect standard chapters into a complete route with an original final biome, boss sequence, narrative reveal, victory record, and permanent reward. Verify all route exits.

### v0.36 — Saga Codex and completion records
Add persistent discovered-vs-undiscovered item entries, enemies, bosses, challenges, endings, run history, and character completion marks. Build stylish readable runic menus that do not overrun the iPhone safe area.

### v0.37 — Bosses and special rooms
Introduce minibosses, elite bosses, additional special-room types, high-risk chamber variants, and more procedural layouts.

### v0.38 — Relics and character expansion
Grow to roughly 180 functioning relics; introduce characters up to seven standard total, plus additional transformations, familiars, and meaningful interactions.

### v0.39 — World/visual milestone / Gate B
Reach 180 relics, seven characters, 60 enemies, 20 bosses, 900 rooms, five transformations, ten challenges, and one ending. Present actual gameplay of multiple realms and menus for **player visual acceptance**: unique architecture, coherent Norse runic UI, no touch/HUD overlap, legible bosses, and no generic-looking screens. **Gate B blocks mass content expansion until approved.**

**Cumulative target:** 180 relics; 7 characters; 60 enemies; 20 bosses; 900 rooms.  
**Validation:** complete first story route; realm differences; approved art standard; readable UI and combat.

---

# ERA FIVE — FRACTURED PATHS
## v0.40–v0.49 | Alternate stories, bargains, secrets

**Exit target:** A network of real alternative routes and high-stakes choices.

### v0.40 — Route-graph architecture
Create multi-branch chapter and boss progression data, alternate-entry conditions, route unlock state, player prerequisites, and proof of reachability across many seeded worlds.

### v0.41 — Asgard path
Complete divine halls, guardian enemies, unique treasure/shrine pools, major boss sequence, and ending progression for Asgard.

### v0.42 — Helheim path
Create haunted underworld geography, spectral enemies, novel damage/health mechanics, cursed rewards, its boss sequence, and distinct narrative payoff.

### v0.43 — Divine favor and Jötunn covenants
Implement competing eligibility, chances, sacrifice costs, health trades, promises, and disjoint item pools that materially influence runs.

### v0.44 — Sacrifice altars and oath rules
Build escalating sacrifice events, delayed consequences, rare summons, optional portals, and oath rewards. Validate health math on every character.

### v0.45 — Multi-floor artifact secrets
Add secrets spread across multiple chapters, unique pickups, special objective flags, puzzle conditions, and corresponding route openings.

### v0.46 — Einherjar Gauntlet
Introduce timed boss-rush access, consecutive fights, unique arena/loot rules, difficulty scaling, reward unlocks, and separate completion records.

### v0.47 — Deep rare-room system
Add Wyrd chambers, rune reversal events, crawlspaces, hidden merchant encounters, rare environmental puzzles, and reproducible special room criteria.

### v0.48 — Route, roster, and relic expansion
Complete three major endings overall, expand to ten standard characters, and raise the relic total to 300 with broad pool coverage and substantive special interactions.

### v0.49 — Alternate route checkpoint
Reach 300 relics, ten characters, 100 enemies, 35 bosses, 1,800 rooms, eight transformations, 15 challenges, and three endings. Validate route gates, rewards, completion marks, save/reload consistency, and optional sacrifice decisions.

**Cumulative target:** 300 relics; 10 characters; 100 enemies; 35 bosses; 1,800 rooms.  
**Validation:** multiple true ending paths; intentional secrets and costs; all deployed paths completable.

---

# ERA SIX — THE NINE REALMS
## v0.50–v0.59 | Full standard roster and world

**Exit target:** All 17 normal playable characters, mature Norse biomes, and four major endings.

### v0.50 — Muspelheim
Develop lava, heat and fire-based gameplay, burning creatures, volcanic architecture, unique hazards, and fully animated bosses.

### v0.51 — Jötunheim
Develop massive Jötunn ruins, giant-scale environmental puzzles, mountain hazards, oversized creatures, and boss arenas suited to the central screen aspect.

### v0.52 — Helheim expansion
Finish floor variants, secret chambers, challenging spectral enemy groups, unusual underworld room effects, and advanced resurrection interactions.

### v0.53 — Asgard expansion
Finish major celestial room families, divine constructs, sanctuary events, new guardian bosses, and unique quest rewards.

### v0.54 — Fourth ending
Build one more mechanically distinct and complete final route with its own boss and lore unlocks. Validate access through at least two characters.

### v0.55 — All 17 standard characters
Complete Vargr, Eira, Skadi's Disciple, Brynja, Hrafn, Sigrun, Ulf, Nótt, Brokkr, Mimir's Echo, Lokk, Asta, Fen, Ivar, Dagr/Dusk, Runa, and Hroth. Each has functioning unique starts, mechanics, visuals, unlock conditions, and completion records.

### v0.56 — Character trial expansion
Add distinct starting-loadout challenges and nuanced character-specific permanent rewards. Reach at least 20 genuine challenges.

### v0.57 — Advanced health/resurrection
Complete advanced health types, revival triggers, sacrifice economies, and loss-of-health reactions. Update outer HUD glyphs and status displays to handle all 17 characters without overlap.

### v0.58 — Advanced rerolls and reality mechanics
Introduce inventory rerolls, floor rewrites, reward changes, probability modifiers, duplicates, and rich interactions with item pools. Stress-test save consistency.

### v0.59 — Standard roster checkpoint
Reach 400 relics, 17 standard characters, 140 enemies, 50 bosses, 2,700 rooms, 11 transformations, 20 challenges, and four major endings. Test a complete run with each character and confirm nine-realm identity.

**Cumulative target:** 400 relics; 17 characters; 140 enemies; 50 bosses; 2,700 rooms.  
**Validation:** every character playable and able to finish; unusual HUD and health states legible; all major realm content distinctive.

---

# ERA SEVEN — BROKEN FATES
## v0.60–v0.69 | Fractured characters, Hoard Trials

**Exit target:** Ten Fractured variants and the complete wave-economy mode.

### v0.60 — Fractured character systems
Create robust character-specific overrides for item capacity, weapon control, unusual movement, health economy, twin bodies, revive behavior, and special event timing. Ensure isolated rule boundaries.

### v0.61 — Fractured Vargr and Eira
Implement fusion-centric inventory restrictions and health-container sacrifice. Test item fusion persistence and special healing exceptions.

### v0.62 — Fractured Skadi and Brynja
Add precision-charge timing windows, hand-positioned defense with bidirectional projectile interactions, and specific animation support.

### v0.63 — Fractured Hrafn and Sigrun
Build knowledge-based reward/future manipulation and spectral locomotion. Ensure control layout can support special actions without covering combat.

### v0.64 — Fractured Ulf and Nótt
Implement escalating berserker instability and an independently controllable shadow body. Validate AI targeting and camera fairness.

### v0.65 — Fractured Brokkr and Mimir
Add inventory dismantling/crafting instead of normal pickups and separated consciousness/body systems. Test all compatibility with ordinary relic effects.

### v0.66 — Difficult enemy and boss expansion
Expand elite enemies, phase-based bosses, chase mechanics, and challenging alternate encounters that stress special character rules.

### v0.67 — Hoard Trials mode
Build a distinct wave-arena structure, timed triggers, purchase breaks, escalating wave sets, optional difficult waves, shops, bosses, and unique Fáfnir finale. All wave timers/status live outside gameplay canvas.

### v0.68 — Forsaken Hoard and Wyrd Well
Add challenging wave-mode variant, tougher economy, character completion records, and permanent donation milestones. Validate no cross-mode save corruption.

### v0.69 — Fractured/mode checkpoint
Reach 500 relics, 27 variants (17 + 10), 180 enemies, 70 bosses, 3,500 rooms, 14 transformations, 25 challenges, and five endings. Verify normal/hard wave-mode completions, donation unlocks, and UI safe areas.

**Cumulative target:** 500 relics; 27 variants; 180 enemies; 70 bosses; 3,500 rooms.  
**Validation:** Fractured mechanics genuinely change the game; Hoard Trials complete and replayable; no gameplay HUD overlaps.

---

# ERA EIGHT — THE UNWRITTEN THREAD
## v0.70–v0.79 | Full variants, endgame, local co-op

**Exit target:** All 34 variants, six endings, and mature late-run structure.

### v0.70 — Fractured Lokk and Asta
Build stochastic form changes and a constrained rotating rune-spell economy; document how temporary powers interact with relics.

### v0.71 — Fractured Fen and Ivar
Complete direct pack-command gameplay and dangerous, escalating covenant obligations. Make all additional commands reachable within side rails or controller bindings.

### v0.72 — Fractured Dagr/Dusk and Runa
Add body switching with vulnerable off-body, controlled death/revival cycles, and independent visual feedback. Verify mixed health interactions.

### v0.73 — Fractured Hroth and full roster
Complete giant-weapon positional combat and full 34-variant roster. Audit all character starts, controls, saves, unlocks, visual identities, and compatibility.

### v0.74 — Local co-op foundation
Develop independent controllers and character ownership within a shared room, shared-resource policy, separate health/inventory states, encounter scaling, and transitions. **Do not fit multiple touch-stick pairs on one mobile screen by overlaying gameplay.**

### v0.75 — Supported local four-player co-op
Expand to four players on tested desktop/controller configurations and any genuinely verified mobile hardware support. Handle disconnects, death states, revive rules, boss scaling, item sharing, and multiplayer camera visibility. Be explicit about supported devices; remote networking is not required.

### v0.76 — Crown of Yggdrasil route
Build reverse traversal, transformed prior environments, character memories, major narrative revelation, route-specific enemies, and the final divine showdown.

### v0.77 — First Thread secret route framework
Implement prerequisites, hidden artifacts, unusual chapter combinations, entry flow, special bosses, and ultimate lore progression, with the ending reserved until its full content pass.

### v0.78 — Completion marks and endgame difficulty
Expand achievements, secret unlock conditions, final boss records, hard-mode marks, boss variants, and content toward late-stage targets. Complete six major endings.

### v0.79 — Mature scope and player Gate C
Reach 625 relics, all 34 variants, 220 enemies, 85 bosses, 4,300 rooms, 17 transformations, 32 challenges, and six endings. Player reviews complex combat VFX, realm art, all character types, themed interface, co-op HUD, and zero-obscuration playfield. **Do not start final mass content pass until Gate C receives approval.**

**Cumulative target:** 625 relics; 34 variants; 220 enemies; 85 bosses; 4,300 rooms.  
**Validation:** all characters work; six endings reachable; mature art approval; supported local multiplayer verified.

---

# ERA NINE — THE COMPLETE SAGA
## v0.80–v0.89 | All content targets fulfilled

**Exit target:** Real content completion, verified by registry audits, not placeholders.

### v0.80 — All 150 talismans
Finish 150 mechanically different talismans with appropriate eligibility, carry capacity, visual presentation, acquisition routes, interaction tests, and Codex entries.

### v0.81 — Advanced relic expansion
Build major remaining attack families, familiars, actives, environmental powers, conditional buffs, and unusual economy effects. Prioritize mechanically distinctive additions and deep combinations.

### v0.82 — Final relic collection
Reach 750 functional collectible relics. Complete event registrations, visual changes, item pools, drop eligibility, descriptions, special synergy interactions, and automated item registry checks. Every counted relic must do something real.

### v0.83 — Complete enemy ecosystem
Reach 250 distinct enemies with suitable AI, audio/visual identity, hitboxes, drops, environmental eligibility, balance, and appropriate champion behavior.

### v0.84 — Complete boss encounters
Reach 100 distinct boss encounters with their own combinations of mechanics and meaningful phase/pattern changes; no untested giant reskins. Validate rewards, entrances, and completion marks.

### v0.85 — Complete room configuration library
Reach 5,000 mechanically meaningful, connected, validated room configurations, including special room types, hazards, rare variants, and boss arenas. Reject duplicates and impossible navigation.

### v0.86 — All 40 curated challenges
Finish 40 genuine alternative challenge scenarios with unique starting rules, constraints, goals, proper unlocks, and reliable completion records.

### v0.87 — 20 transformations and consumable completion
Finish 20 powerful transformation states, rune/scroll/brew families, identification and rune effects, and specialized health/character interactions. Validate simultaneous transformation edge cases.

### v0.88 — Ultimate ending and last secrets
Finish the First Thread story conclusion, seventh major route, final bosses, hidden artifacts, story outcomes, rare rooms, and ultimate completion reward structures.

### v0.89 — Feature/content complete audit
Verify by gameplay and source inventory: 750 relics, 150 talismans, 34 variants, 250 enemies, 100 bosses, 5,000 rooms, 20 transformations, 40 challenges, seven endings, major health systems, shops/hidden chambers/item pools/curses/rerolls, Hoard Trials + Forsaken Hoard, all completion marks, Saga Codex, Daily Saga, and local co-op on verified hardware. **Every registered content unit must be a tested working unit.**

**Cumulative target:** 750 relics; 34 variants; 250 enemies; 100 bosses; 5,000 rooms.  
**Validation:** complete ledger with file/code references; all systems actually playable; no content-count padding.

---

# ERA TEN — THE FINAL FORGING
## v0.90–v0.99 | Quality, reliability, and launch qualification

**Exit target:** Final candidate with player-approved aesthetics and high mobile reliability.

### v0.90 — Complete Norse UI refinement
Polish every rune-carved interface: title, character selection, shops, Codex, inventory, map, challenge screens, endings, settings, death report, gameplay HUD, and the integrated left/right controller grips. The central combat viewport must remain totally free of persistent buttons, tooltips, and overlays.

### v0.91 — Input and accessibility
Finalize adjustable side-rail pads, left-handed swap, reach/size customization confined to rails, external controllers, safe-area behavior, readable typography, contrast options, reduced screen shake, and alternative effect visibility. Test both landscape orientations, Safari and standalone where possible.

### v0.92 — Original sound and animation polish
Finish biome/boss music, sound effects, environmental motion, animation transitions, relic and transformation feedback, UI sounds, and combat telegraph readability without visual clutter.

### v0.93 — Intensive performance and memory tuning
Profile ordinary and extreme builds on real devices. Optimize pooling, textures, sprite atlases, collisions, effects, asset loading, battery/thermal behavior, and background/resume recovery. Keep controls responsive during screen-filling combat.

### v0.94 — Balance and replayability tests
Use seeded simulations and genuine playtesting to examine character win rates, item pools, floor reward odds, boss difficulty, rare overpowered combinations, resource economy, and alternate-route challenge. Preserve fun rather than nerfing every spectacular combo.

### v0.95 — Save and PWA update hardening
Finalize robust schema migration, backup restore, local data corruption recovery, service-worker cache versioning, stale-asset prevention, offline launch, and same-icon update behavior. Explicitly test Safari-to-Home-Screen save import/export.

### v0.96 — Co-op, daily, and challenge regression
Verify local multiplayer on documented supported devices, independent inventories, timers/score rules, seeded daily runs, challenge exclusions, completion marks, and simultaneous special abilities. Never imply an online leaderboard exists.

### v0.97 — Complete content regression sweep
Test each character, major boss, seven endings, all gameplay modes, room/biome groups, and all item behavior categories. Run bulk randomized relic-combination tests and long-run stability simulations. Close all release-blocking defects.

### v0.98 — Release candidate and device matrix
Freeze major features; prepare a stable Git tag candidate. Verify GitHub Pages deployment, iPhone Safari/Home Screen startup, notches and safe areas, both landscape orientations, multi-touch, camera fairness, offline assets, saves, performance, full-run victory, and menu flow. Inspect real screenshots for UI spillover.

### v0.99 — Final acceptance / Gate D
Present a complete, verifiably playable candidate for player review. Repair art/UI/control/performance issues; ensure no stage overlap and no broken content. Get explicit final approval of the look, feel, features, and stability before v1.0.

**Validation:** no release-blocking issues, no gameplay-covered touch controls/HUD, polished Norse visuals, verified Pages build and stable saves.

---

# v1.0 — FULL RELEASE

Publish and tag the fully verified build to the **existing** GitHub Pages site. Preserve the Home Screen app identity, stable public link, and all save data where possible. Publish accurate release notes and supported device list. Maintain the Design Bible as the requirements authority, the Roadmap as the completion history, and the content ledger as proof of actual counts.

**Release requirements:** 750+ functional relics, 150 talismans, 34 playable variants, 250+ enemies, 100+ boss encounters, 5,000+ valid room configurations, 20 transformations, 40 challenges, seven major routes, polished mobile touch UI fully outside combat, functional story/progression, original Norse art/audio, save protection, and local co-op only on verified supported devices. A feature is not present merely because it appears in a list.

---

## II. Content target ledger (cumulative, planned)

| Checkpoint | Relics | Playable variants | Enemies | Bosses | Valid rooms | Additional milestone |
|---|---:|---:|---:|---:|---:|---|
| v0.09 | 8 | 1 | 6 | 1 | 25 | First prototype / Gate A |
| v0.19 | 40 | 2 | 15 | 4 | 100 | First complete mini-roguelike |
| v0.29 | 100 | 4 | 30 | 8 | 300 | Working major synergy engine |
| v0.39 | 180 | 7 | 60 | 20 | 900 | First ending / Gate B |
| v0.49 | 300 | 10 | 100 | 35 | 1,800 | Three endings |
| v0.59 | 400 | 17 | 140 | 50 | 2,700 | Full standard character roster |
| v0.69 | 500 | 27 | 180 | 70 | 3,500 | Ten Fractured + Hoard Trials |
| v0.79 | 625 | 34 | 220 | 85 | 4,300 | Full character roster / Gate C |
| v0.89 | 750 | 34 | 250 | 100 | 5,000 | Full content and seven routes |
| v1.0 | 750+ | 34 | 250+ | 100+ | 5,000+ | Polished public release |

Other v1.0 minimums: 150 talismans, 20 transformations, 40 curated challenges, seven major endings, at least 250 specifically authored special synergy behaviors plus emergent interactions, story secrets, full completion records, and functional main and secondary modes.

## III. Mechanical parity and requirement tracking

Track every major systems family: seeded rooms; combat and enemy collision; multiple heart/health types; active/passive relics; familiars; talismans; unidentified potions; rune and scroll consumables; rare chest and pickup types; secret rooms; shops/gambling/beggars; sacrifice and covenant rewards; weighted item pools; rerolls and reality effects; elemental chaining; transformations; curses; timed challenges; hard mode; special boss rush; branching alternate routes; 34 character identities and completion marks; wave-economy mode and hard variant; daily seeds; challenges; Codex and unlocks; local co-op on verified configurations; save recovery; iPhone Home Screen stability; Norse themed HUD; **unobstructed playfield at all times**.

Maintain requirements statuses independently of version labels: `planned`, `implemented`, `tested`, `device-verified`, `deployed`, `player-approved` where relevant. Never infer one from another.

## IV. Release test policy

For **every** release: build; load initial screen; launch a run; verify movement/aim/shoot; verify pause/restart; check existing save load and current changes; inspect registry/content validity; check console or runtime errors; commit/deploy if tools permit; verify exact Pages URL; update change log and status. If a step cannot be checked, say which and why.

For **every major checkpoint**: complete a run; inspect actual mobile aspect ratio and safe areas; check the central gameplay canvas and every HUD/control element for zero intersection; simulate dense enemy/projectile situations; verify no hidden offscreen attacks behind UI rails; test long-run save/reload; verify achievement unlocks; inspect original art quality. External-controller layouts and cooperative modes require their own matrix.

### Mandatory zero-overlap test

Every persistent interactive UI rectangle and major HUD/decorative visual boundary must remain entirely outside the live central canvas. A transparent joystick covering 2 pixels of combat is a defect. A shadow or button decorative spur obscuring hazards is also a defect. Pause menus may cover the stage only while simulation is actually paused. This rule cannot be waived by opacity controls. Follow the acceptance tests in `UI_CONTROLS_AND_ART_DIRECTION.md`.

### Honest reporting

Each development cycle reports actual version, goals, changed files/features, tested results (distinguish automated from real-device), commit SHA if available, actual Pages status, verified content totals, remaining tasks, approval blockers, and next version/slice. Never invent tests or successful deployment.

## V. Repository continuity and no-cost policy

Preserve the existing repo and Pages URL. Do not use Vercel, Codex, Work, or paid infrastructure. GitHub Pages serves static assets; it cannot host a persistent online game backend. Do not claim online multiplayer, cloud saving, global anti-cheat leaderboards, or external server features without an explicitly approved separate solution. Size and bandwidth limits of Pages must be monitored, and the asset pipeline should keep startup fast and uploads within practical limits. Deploy versioned static assets and handle PWA cache invalidation.

## VI. Next development command for a new chat

> Read `README_START_HERE.md`, then **all** of `DESIGN_BIBLE.md`, `UI_CONTROLS_AND_ART_DIRECTION.md`, and `ROADMAP.md`. Confirm the current GitHub repository and Pages URL before touching code. Continue the first incomplete roadmap release, not a guessed version. **Controls and the live HUD must never cover the gameplay canvas; use separate Norse-styled side rails with a central, unobstructed playfield.** Use only the existing GitHub repo and GitHub Pages; no Codex, Work, Vercel, or required paid services. Implement actual features, test, commit, deploy if tools allow, and report only verified results. Stop at the locked visual approval gates for player feedback.

**Final objective:** An original Norse mythological roguelike of exceptional depth, real mechanical variety, artistic quality, and iPhone usability through the free GitHub Pages deployment.