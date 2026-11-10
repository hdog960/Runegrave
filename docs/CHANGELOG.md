## v0.09.8 — Actual impact feedback and deeper floor-family identity (2026-11-10)

- All Soulbolt impacts against real hostiles/training targets now emit bounded world-space numeric damage marks derived from actual combat events (including eight-relic damage modifiers); smashed practice props show SHATTERED.
- Genuine player heart loss emits a brief half-heart unit readout; silver/healing/relic pickups mark the amount or reward as applied, not merely on approach. 18-mark pool; fixed-step lifetime; immediate reset on room switch/restart; canvas-edge clamping and no touch controls/HUD over gameplay.
- A short world-space direction arrow beside the Wayfarer appears only when actually firing, including keyboard aim; this is not a full-screen trajectory indicator or a collision prediction.
- Five new authored low-contrast floor relief styles distinguish ASH molten drains, IRON gear plates, ROOT living boughs, SPIRIT ghostglass panels and FATE woven looms. These replace older repetitive floor trim rather than stacking costs and preserve the existing mobile draw-operation test budget; no collision, enemy, room reward or room selection changes.
- Open doorway adds visibly separated heavy gate leaves; barred lock state remains. Existing route waystones still lead only to real, connected open exits.
- Roadmap remains **v0.09 Gate A**; app **0.09.8**, shell **runegrave-shell-v0.09.8**. Full room graph (v0.10) and player approval remain locked. No real iPhone Safari/standalone PWA, human victory or user art approval claims.

## v0.09.7 — Distinct combat silhouettes, floor identity, and tactile grip polish (2026-11-10)

- Added a purely visual eight-direction Wayfarer pose model (`src/scene/wayfarerMotion.ts`) with different helmet-facing and eye configurations, alternating boots, responsive split-cloak fabric and directional Soulbolt arm recoil. It never modifies player physics, hitbox radius or projectile damage. Reduced-motion static rendering remains supported.
- Added unique gesture art for all six actual hostile archetypes plus the Rootbound Warden (`src/enemies/gestureArt.ts`): an iron claw, orbiting will-lights, drawn bow, sparking horns, rotating rune teeth, spectral cloth and phase-sensitive root crown. Gestures reflect *existing* windup states; attack timelines remain unchanged.
- Further distinguished the five established chamber families with floor-edge material inlays (`src/scene/familyTrim.ts`), avoiding the colors/shapes of usable items and attack targets. These are non-colliding marks on world masonry.
- Added compass-accurate engraved stone arrows into the existing north/south/east/west doors, entirely in world space. Doors remain physically placed, reachable and locked until the actual clear+relic conditions are met; no new route graph was introduced.
- Added a physical pressed/depressed ring effect inside the existing touch-sensitive controller grip. No controls/HUD were placed over gameplay; no saved-input key changes.
- Version is **roadmap v0.09, app v0.09.7**, service-worker shell `runegrave-shell-v0.09.7` with all three new compiled art modules precached. **v0.10 remains locked for explicit player Gate A approval.**
- Content totals unchanged: 25 authored room configurations; eight real relics; six hostile behavior types; one Warden boss; one curated 8-chamber mini-run. The future seeded branching floor graph and finished game art are not claimed.

## v0.09.6 — Relic Sigils and Three-Beats-to-Strike (Gate A polish; 2026-11-10)

- Added eight original, independently distinguishable world-space collectible emblems: fang, drum, feather, lens, anchor, root shield, thread, raven hoard, with labelled pedestal silhouettes. Effects remain the exact existing eight working modifiers; no new inventory content is counted.
- Added deterministic 0–3 visible warning beats to hostile attack windups, with label positions clamped in both world axes at narrow camera heights. Windup times, AI patterns and damage unchanged. Non-color urgency indicators improve recognizability on iPhone.
- Enlarged coarse-touch rune discs modestly within separated controller grips, with keyboard focus-visible rings. World canvas remains untouched and no HUD overlays introduced.
- Maintained v0.09 Gate A approval lock, 25 authored room configurations, resource/relic rewards, boss, save schema and input settings. Bumped app/PWA patch to 0.09.6 and cached both new runtime art modules.

## v0.09.5 — Five Ward Relics of the Wall (Gate A polish; 2026-11-10)

- New original `scene/landmarkArt.ts` paints five **silhouette-distinct Norse architectural landmarks**: Ash furnace/chain bellows, Iron riveted gear vault, Root living-wood relief, Spirit ghostglass lamp, and Fate Norn loom. Two lightweight, wall-recessed miniatures per chamber make the scene recognizable by shape as well as color. Original 25 encounter definitions and 8-room curated route are unchanged.
- `enemies/visualMotion.ts` supplies bounded deterministic walk/bob/direction/strike poses. All six hostile enemy art renderers and the original two-phase Warden gained individual animated details: draugr armored gait/bone axe, wisp spirit motes, archer drawn bow, charger charging horns, sentinel orbiting runes, shade ghost veil, and Warden root crown. **No change to AI, enemy HP, contact damage, damage windows or hitbox sizes.**
- Warning labels clamp to the real center-camera width; aimed/charge telegraph endpoints stop at the visible camera edge instead of extending visually under controller rails. Red imminent signals remain distinct from individual warning colors and attack silhouettes.
- Forged-door rendering now features a deeper carved lintel, unmistakable barred X while locked, bright interior passage when open, and three approach steps aligned with each cardinal exit. Real collision and door requirements are preserved.
- Twin rune discs show an eight-direction compass glyph only in the external controller grips. Held, cancelled and paused pointers still reset correctly; adjustable thumb size/placement and saved handedness/dead-zone preferences are unchanged.
- PWA preloads both new compiled scene/animation modules and increments its safe-update cache to `runegrave-shell-v0.09.5` (app patch 0.09.5, **roadmap still v0.09**). All canonical documents, 25 authored rooms, 8 functional relics, Soulbolt/health/boss loops remain intact.
- **Gate A remains NOT APPROVED**. Do not begin v0.10. Separate automated, browser, public Pages and physical iPhone evidence are recorded in `TESTING.md` and the GitHub release ledger.

## v0.09.4 — The Five Faces of the Rootvault (Gate A polish; 2026-11-10)

- Added original world-space decorative themes to all five first-soul room families: ash-scorched threshold, iron-and-rivet vault, living-root masonry, spectral ghostglass, and golden fate-knot. The 25 authored configurations, physics geometry, damage, and seed selection are unchanged.
- Clarified the six enemies and first boss through differentiated in-world danger signs: archer/warden aiming reticles, charger corridor plus arrowhead, spirit/radial volley rings, imminent warning color and stronger enemy labels. Added a seven-entry pause-only threat glossary, never overlaying active combat.
- Recalculated the reachable green exit waystones approximately every 0.7 fixed-step seconds from the player position, rather than leaving a route anchored where it first appeared. Locked room doors remain closed until the fight and mandatory relic are complete.
- Reduced iPhone DOM pressure: fixed-step state still advances at 120 Hz, but 43 debug data attributes, heart icons, and persistent objective/status strings are written only when changed. This is a renderer/UI optimization, not a faster-CPU or physical-iPhone benchmark claim.
- Retained the original iron/ash-wood grips and independent simultaneous two-thumb input, previously saved preferences, v0.09 room/relic progression, health/death/boss flow, PWA, and the seven authoritative project documents byte-for-byte.
- Local: TypeScript strict check PASS; Node 79/79 PASS; four landscape and one portrait Chromium UI profile PASS; guided-start profiles PASS; full test-injected eight-room/boss/restart route PASS. Additional browser audit passed on three landscape profiles: 0 heart and 0 footer DOM mutations while idle for 650 ms, 78–79 canvas data mutations, readable pause threat guide and real practice→crypt passage. None are physical iPhone or unaided human run evidence.
- **Gate A is still awaiting the player’s explicit visual/control approval. Do not begin v0.10.**

## v0.09.3 — Gate A readability, guidance and feedback (2026-11-10)

- Reworked original, signed Norse doors with clearer stone jambs, iron bars, carved lintels and lit locked/open state; green waystones trace a *reachable* floor route to the unlocked gate.
- Added unique windup labels and heightened imminent warnings for six enemy kinds and Warden.
- Relic popups now show real before/after combat or heart stats, with clear permanent per-run benefits and no live-play overlay.
- Polished pressed-state of separate left/right grips; no changes to saved input or service-worker update semantics.
- Preserved all 25 authored encounter layouts, eight relics, room route, and v0.09 Gate A approval lock.

## v0.09.1 — Gate A clarity and guided-start pass (2026-11-09)

- Player reported they could not understand what was going on in v0.09; **Gate A remains NOT APPROVED**. This feedback is treated as a real design failure requiring correction, not a request for more unexplained features.
- Added a first-visit, paused-only Norse How to Play screen that explains the left movement disc, right continuous-fire disc, defeating enemies, claiming the gold relic, the eastern exit, hearts and the Warden goal. A visible Start button safely activates the simulation after the guide is dismissed.
- Added **PAUSE → HOW TO PLAY** to replay guidance at any time. The guide disables the exterior pause button while open, ignores accidental Escape/P unpausing, and never interrupts active combat as a floating tutorial HUD. Dismissing it restores normal controls without losing the existing saved control preferences.
- Replaced cryptic bottom-run state with clear action-directed guidance per phase: **GO RIGHT**, **DEFEAT N ENEMIES**, **PICK UP THE GOLD RELIC**, **NEXT ROOM**, **DODGE BOSS**, and **FINISH THE TRIAL**. All are in the status strip outside the gameplay viewport.
- Local strict TypeScript pass; all 69 Node tests, four landscape plus portrait in-memory Chromium controls/layout tests, four guided-start/replay acceptance runs, and the existing controlled eight-room/boss/victory/restart flow pass. Tests do not prove physical Safari ergonomics or unaided run success.
- v0.09 roadmap milestone remains unchanged. No v0.10 features or approval. PWA shell patch version 0.09.1 precaches the new guide JS module; saved input preference key and save schema remain unchanged.

## v0.09 — First Soul: the Fatebound Eight (local implementation, 2026-11-09)

- Added 25 original curated authored encounter configurations across Ash, Iron, Root, Spirit and Fate floor families. Every configuration has a unique tested enemy/wave lineup, sensible camera-safe spawning, a collision-connected eastern exit and world-space rune-floor identity.
- An eight-chamber seeded curated route (unique rooms per run) connects the preserved antechamber to the two-phase Rootbound Warden, with a mandatory relic pedestal after each cleared chamber, optional silver and healing pickups, death/restart, and a first-prototype completion panel. **This is not v0.10 procedural floor graph generation.**
- Eight genuine, uniquely named and functional collectible relics: Wyrd Fang (damage), Skald Drum (cadence), Storm Feather (projectile speed), Hugin Lens (range), Ash Anchor (knockback), Shieldroot Bark (+1 heart container), Eir’s Thread (healing), Raven Hoard (silver pickup bonus). The pooled Soulbolt engine uses a validated live combat modifier profile; Mortal Heart capacity resets on a new run.
- Added an in-grip silver counter and bound-relic status, and a pause-only relic ledger listing live effects. Added original in-world golden relic and resource pickup artwork with a gate that cannot advance until the mandatory relic is physically collected.
- Preserved existing v0.08 enemy AI/boss, v0.07 damage and death/restart, v0.06 Soulbolts, v0.05 fixed physics, v0.04 art, v0.03 separate thumb grips, saved `runegrave:input:v1` preferences, PWA, and schema version 1.
- Gate A status is **AWAITING PLAYER APPROVAL**. Do not begin v0.10 or make a final art-quality claim from desktop browser tests.

# Verified Change Log

## v0.09.2 — The Door and the Relic (Gate A feedback revision)

- Converted tiny ambiguous gate tiles into original readable stone-and-iron EXIT/LOCKED doors, which now show the actual open/closed state and direction. LOCKED stays red until both enemies and the required relic have been cleared.
- Varied the eight curated chamber exit directions north/west/south/east while preserving all room configurations, combat, rewards and boss path; did not implement or claim the future v0.10 procedural branching graph.
- Added a paused-only acquired-relic card explaining the precise active bonus on pickup, persistent right-hand-grip latest-effect text, silver/heal pickup feedback, and external compass door hints.
- Preserved input preferences, save schema and PWA refresh handling; upgraded cache to v0.09.2, with all new modules included. Gate A remains awaiting explicit player approval.


## v0.08 — The Sixfold Crypt and Rootbound Warden (2026-11-09)

- Added six independently implemented hostile AI families: advancing **draugr**, strafing **wisp**, distance-managing **archer**, telegraphed **charger**, radial-volley **root sentinel**, and vanishing/reappearing **shade**. Each has actual health, damage behavior, unique original authored pixel silhouette and appropriate warning cues. Names and behaviors are project-original.
- Added first real boss **Rootbound Warden**: 28 HP, two mechanical phases, telegraphed aimed fan volleys, more dangerous phase two, bespoke silhouette and defeat-recorded exit unlocking.
- Added connected encounter flow: preserved **Rootvault practice antechamber** (existing v0.06 destructibles and v0.07 ember/shrine), then a locked **Sixfold Crypt** with two three-enemy waves, followed by the boss chamber and a stopped-world **trial-cleared** screen. Exits open only after required hostiles are defeated. This is not a final story ending.
- Added graph-free, camera-aware **walkable route validation** so an apparently clear doorway in an isolated pocket is rejected. Path tests exercise compact and large reference rooms. Camera/world resizing preserves encounter HP, kills, waves and boss phase, and safely removes off-camera hostile projectiles.
- Integrated actual enemy hitpoints and knockback into the existing pooled Soulbolt collision pipeline via an optional hostile-hit adapter; non-hostile practice targets and associated training hooks are retained separately. Hostile projectile sweeps check solid scenery and room bounds, damage the player via Mortal Hearts and respect invulnerability frames. Warnings precede shots/dashes.
- Preserved original v0.04 Norse interface and artwork, v0.03 independently captured two-thumb grips, v0.05 fixed 120 Hz physics, v0.06 Soulbolt pooling, v0.07 death/restart, the PWA and saved handedness/input settings. All live HUD remains outside the dedicated gameplay canvas; menus may replace the stage only when stopped.
- Local evidence: strict TypeScript typecheck PASS; **54/54 Node tests PASS**, plus four landscape and one portrait Chromium input/zero-overlap checks. One integration audit traversed practice by actual movement, while a separate test-only damage injection verified two-wave clear, boss phase changes, exit gating, completion/restart through the real stage UI. These are not real iPhone hardware tests and are not claims of a human-played complete run.
- All seven canonical documents, v1.0 content targets and Gate A/B/C/D are unchanged. The **first visual approval remains locked at v0.09**, not v0.08.
- **Deployment and GitHub checks must be verified after publication**; initial local test evidence alone is not a live-deploy claim.

Thread (implementation cycle, 2026-11-09)

- Added deterministic, test-covered `MortalHearts` state: 3 Mortal Heart containers, half-heart damage, grace/invulnerability, bounded healing, lethal death, no accidental healing-based revival, and explicit restart reset.
- Added timed original in-world ember rune hazards with visible telegraph and actual contact damage, plus a refill shrine with finite cooldown. These are environmental training elements, not AI enemies.
- Moved full/half/empty hearts and numerical Vitality status exclusively into the separate left Norse grip. All gameplay controls and persistent status remain outside the combat canvas.
- Added paused-simulation-only Norse death/restart panel, disabled controls during death, zero lingering input after restart, and a keyboard R fallback. Death resets the training run and its destructibles, not saved input preferences.
- Preserved all v0.06 Soulbolt collision, projectile pooling, art/physics, v0.03 handedness and control-settings persistence, and existing PWA identity. Extended offline asset precache to the three new health modules.
- New 12-case health/trial test suite expands total Node tests to 44, with separate in-memory Chromium death/restart UI regression and four landscape + portrait layout/input checks. Physical iPhone/PWA offline behavior and v0.09 Gate A approval remain unverified.

**Next:** v0.08 six genuinely different hostile enemy AI patterns, combat room locks, clear/exits and first boss. No version skipping or content-count inflation.

# Verified Change Log

## v0.09.2 — The Door and the Relic (Gate A feedback revision)

- Converted tiny ambiguous gate tiles into original readable stone-and-iron EXIT/LOCKED doors, which now show the actual open/closed state and direction. LOCKED stays red until both enemies and the required relic have been cleared.
- Varied the eight curated chamber exit directions north/west/south/east while preserving all room configurations, combat, rewards and boss path; did not implement or claim the future v0.10 procedural branching graph.
- Added a paused-only acquired-relic card explaining the precise active bonus on pickup, persistent right-hand-grip latest-effect text, silver/heal pickup feedback, and external compass door hints.
- Preserved input preferences, save schema and PWA refresh handling; upgraded cache to v0.09.2, with all new modules included. Gate A remains awaiting explicit player approval.


## v0.06 — The First Soulbolt (2026-11-09)

- Replaced noninteractive training tracers with fixed-step **real Soulbolt** projectile attacks: finite damage, cooldown, speed, reach, small hitboxes, collision with stone/root scenery and room boundaries, and no tunneling through thin geometry.
- Added a fixed-capacity reusable 48-slot projectile pool (no per-shot projectile object allocation), event hooks for shot/impact/break/expiry and an explicitly non-hostile trio of respawning training destructibles (two rune effigies and an oath urn).
- Training objects take real damage, flash on impact, move under bounded knockback and break into authored original pixel-style sparks. They become non-solid when destroyed and respawn when safe after a delay. **They are not enemies**, awards, health systems or room progression; these arrive in later locked versions.
- Preserved 120 Hz v0.05 physics, mobile thumb pads and pointer ownership, saved input preferences (`runegrave:input:v1`), original Norse Rootvault materials and center-canvas/external HUD separation. Save schema stays at 1.
- External, non-canvas footer displays the training shatter count; art/aiming controls remain entirely outside the actual combat renderer.
- Build and physics/combat/viewport tests added, plus an in-memory Chromium two-thumb shooting/destruction trial. Public GitHub Pages deployment and physical iPhone tests must be verified separately.


## v0.05 — Rootvault Physics: The Stone Remembers (2026-11-09)

- Established a reproducible 120 Hz fixed-step simulation fully separated from the v0.04 renderer and the v0.03 pointer/keyboard input layer, with bounded resume/catch-up.
- Added camera-aware room geometry and collision shapes: stone wall limits, upper/lower columns, sarcophagi and capsule-shaped tree roots. Fixed-step movement slides around obstacles without clipping behind controls; deterministic tests cover replay seeds and multiple rendering frame rates.
- Added safe, collision-free spawn selection and viewport resize relocation, including regression tests for narrow layouts and dangerous obstacle edges.
- Retained handcrafted original Rootvault scene, Wayfarer art, two-thumb rail-only controls, saved handedness/preferences, portrait UI, external Norse HUD and paused-only update activation.
- Updated v0.05 static Pages output, cache version and new offline modules; no enemy damage or true combat is counted early.
- Local: 26/26 Node tests, TypeScript strict check and four landscape + one portrait headless browser input/geometry profiles pass. Device/Pages verification must be recorded separately.

## v0.03 — The Two Runes Answer (local implementation, 2026-11-09)

- Independently controlled, pointer-captured left/right rune-disc input with two-pointer ownership, cancellation, 15% radial dead zone, directional scaling and simultaneous movement/continuous-fire aim. The right disc fires while held; left-handed mode swaps movement and aim between physical grips.
- Real training-avatar movement and original visible Soulbolt **training tracers** in the isolated central world canvas; these are input demonstrations only, not damage, collisions, enemies, boss encounters, or a playable run.
- Keyboard fallback (WASD/arrows, IJKL, Space and Escape/P), reliable reset on background/blur/pagehide, and a pause state which halts the renderer update. Button actions not yet implemented are visibly disabled, not fake.
- Paused-only Norse settings panel (handedness, size, vertical alignment, dead zone) stored locally with validation. Waiting PWA-update action moved into paused UI, never overlays active gameplay.
- Offline/PWA runtime cache upgraded to v0.03 including new modules; static branch-root mirrored outputs updated.
- `npm test`: 13/13 PASS; `npm run typecheck`: PASS. Local headless Chromium input tests pass at four landscape sizes, plus the portrait rotate gate, with zero HUD/control intersections and no page errors. Real Safari hardware verification remains open.
- Before this work, v0.02 Pages URL, manifest and compiled JS were successfully fetched live via an external website fetch; this does not assert v0.03 publication.

**Next:** v0.04 game camera/art/HUD refinement; retain the locked v0.09 visual approval gate.


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

## v0.04 — Rootvault Art, Camera and HUD Prototype (2026-11-09)

- Replaced the v0.03 repeated floor/background composition with modular original Midgard Rootvault artwork: layered burial masonry, ceremonial gate, bronze/stone columns, sarcophagi, tree roots, engraved fate-knot, emissive braziers, and restrained torch motes.
- Rebuilt the Wayfarer preview silhouette and directional idle/walking/aim/fire art cues without changing combat rules.
- Enhanced the Norse iron/ash-wood handheld with engraved disc rings, textured grip materials, refined gold seams and external HUD readability. Removed crowding decorative lettering in the compact layout.
- Preserved the central-only world canvas and all v0.03 dual-pointer, keyboard, left-handed, pause and input preference systems, including `runegrave:input:v1` data. Save schema unchanged.
- Advanced static shell and service worker asset list to 0.04.0, including the new renderer; retained paused-only service-worker update activation. Mirrored build output to root for GitHub Pages branch-source fallback.
- Browser tests, screenshots and locally verified status live in `TESTING.md`. This release is an **art and camera trial only**, not an enemy combat milestone and not an approved Gate A.
