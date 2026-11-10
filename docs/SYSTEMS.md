# Systems Architecture — v0.01

**Implemented foundation:** TypeScript compiled to native browser ES modules, zero runtime dependencies, stable typed content IDs (`src/core/ids.ts`), deterministic PRNG with independently named streams (`src/core/rng.ts`), release constants (`src/core/version.ts`), a build script and automated tests.

**Planned, not implemented:** central-canvas renderer; split Norse controller-grip input; deterministic fixed-step simulation; collisions; combat; health; room graphs; item modifiers/events; enemies/bosses; routes; unlocks; saves; audio; co-op. Follow [ROADMAP.md](ROADMAP.md) in exact order.

## Invariants

- Never mount touch controls, HUD, decorative UI, or hit targets over a running combat canvas.
- Keep simulation independent of rendering and provide reproducible run seeds and distinct PRNG channels for generation versus combat.
- Store stable content IDs and validate duplicate IDs before counting content.
- Preserve save schema migrations when persistence arrives; `SAVE_SCHEMA_VERSION` is a reserved version constant, not a current save system.
- Use relative asset URLs compatible with repository path `/Runegrave/` and installable PWA scope later.

**Next:** v0.02 — GitHub Pages/PWA and physical, measured three-region landscape composition.


## v0.02 canvas & offline shell

- DOM grid is always side grip + central display + side grip in landscape; header/footer outside the canvas. Scene renderer uses the exact canvas client rectangle to derive camera height and buffer size. No input logic currently moves the preview character.
- `src/scene/stage.ts` implements decorative Midgard scene rendering only and is not counted as combat, an enemy, or a procedurally generated room.
- PWA `scope`/`start_url` are relative `./` and static cache entries are resolved from worker registration scope, allowing GitHub Pages `/Runegrave/` deployment.
- Waiting service workers never activate over open runs without user consent; `ACTIVATE_UPDATE` is triggered from explicit external update banner. Future save handling must be added at v0.18.
- GitHub Pages supports Actions artifact output and optional root-branch mirrored runtime. The mirror is updated with `npm run export:pages` before commits; repository settings must select publishing source.

## v0.03 input architecture

- `src/input/vector.ts` provides bounded unit vectors, radial dead-zone scaling and keyboard diagonal normalization.
- `src/input/twinStick.ts` owns distinct pointer IDs independently on each rune-disc, pointer capture and per-role cancellation; the central world canvas has **no controls or click-target handlers**. Every `pointerup`/`pointercancel`/`lostpointercapture`, browser `blur`/`pagehide`/`visibilitychange`, pause, or configuration switch clears active input to prevent sticky firing.
- Input bindings: left grip MOVE, right AIM/FIRE (auto fires continuously while outside dead zone); optional left-hand mode exchanges these roles and labels. Keyboard WASD/arrow movement, IJKL aim, Space fire, Escape/P pause. The two physical discs never leave the appropriate rail; size 85–110% and vertical position ±9px remain within rail layout and undergo geometry tests.
- `TwinStickControls.snapshot` returns normalized movement, aim, firing and paused state. Its `onPauseChange` callback stops the stage update loop while a center overlay is shown; overlay is **only visible when paused**. Settings storage uses a validated, independent `runegrave:input:v1` key; this is not a run save or substitute for the v0.18 save system.
- `src/scene/stage.ts` demonstrates moving the Vargr preview with a bounded avatar position and visible short-lived directional training bolts. **No physics/collision pipeline or damage is implemented**, so these input tracers do not count as real Soulbolts or combat content. Real simulation and collision arrive v0.05 and v0.06.
- PWA update offers are now inside paused-only UI rather than a bottom-center fixed banner over active playfield. Service worker assets/cache include the new input modules in v0.03.

## v0.04 presentation boundary and camera

- `stageMetrics(cssWidth, cssHeight, dpr)` receives only the center `#world-frame` bounds and sizes canvas backing pixels; its virtual width is 420 and height `420 * cssHeight / cssWidth`. World paint never extends under grip elements.
- `scene/sanctuaryArt.ts` draws decoration in world space, before player/projections; no UI overlay is drawn within the active world canvas. Scene layout is preview art without wall collision or enemy hazards, which are planned for v0.05–v0.08.
- `input/twinStick.ts` retains independent pointer and keyboard input. Pause/menu overlays only replace the renderer when the simulation is paused. `runegrave:input:v1` is unchanged.

## v0.05 physics contract

- `src/physics/fixedStep.ts`: fixed 1/120-second simulation ticks with accumulator and 12-step maximum catch-up. Frame rendering and real elapsed browser seconds do not change physics step length; pause and page background reset carried fractional time.
- `src/physics/world.ts`: deterministic, browser-free collision geometry, circle-vs-box/circle/capsule contact checks, small-step solid movement with axis sliding, validated spawn search, and geometry rebuilt on camera resize. Collision bodies match the visible Rootvault sarcophagi, columns and roots. Art-only decorative floor markings are intentionally walkable.
- `src/scene/stage.ts`: reads `TwinStickControls.snapshot`, applies movement at a stable speed without diagonal inflation, respects the physically bounded center canvas, and exports numeric canvas data attributes for browser verification. Attack tracers are still **cosmetic** pending v0.06 combat. The PWA assets are versioned to include the two physics modules.
- The runtime does not add run-save data or change the `runegrave:input:v1` preference schema. Other character, enemy, collision layers and real weapons are intentionally not counted until later roadmap milestones.

## v0.06 Soulbolt combat foundation (training, not enemies)

- `combat/soulbolts.ts` is independent of the DOM and browser clock. `SoulboltCombat.update()` advances only with fixed `1/120` steps from the v0.05 `FixedStepClock`; it produces a `CombatState` snapshot useful for release tests.
- Real Soulbolts have damage 2, fire cooldown 0.20 seconds, speed 258 world units/sec, range 274 units, radius 3, and 10-unit knockback. All values are initial **training tuning**, not final balance.
- Collision uses 2.5-unit movement slices through world boxes and root capsules; scenery/bounds stop Soulbolts before any destructible damage can propagate behind obstructions. Finite 48-slot pooling and stable iteration avoid unbounded projectile accumulation.
- Extensible hooks `shot`, `impact`, `break`, `expire` are registered by `SoulboltCombat.on()`, return unsubscribe functions, and forbid reentrant dispatch. Existing `stage.ts` uses events for original world-space sparks (no persistent popups on combat canvas).
- Three non-hostile breakable props are positioned through deterministic safe-area checks. Health, knockback, collision solids, break behavior and safe timed respawn are implemented; a broken prop is removed from actor collision. These do not count as enemies, bosses, relics, valid procedural rooms or player achievements.
- Directional movement, aim/fire, keyboard, pause and player settings are unchanged. Hit/shot/break telemetry is exposed as data attributes on the existing **center-only** canvas for tests, while a shatter count is shown in the separate footer HUD.
- Player health/death remains planned for v0.07, enemy AI/room locks/boss for v0.08, and full first prototype/relics/room graph for v0.09 Gate A.

## v0.07 — Mortal Heart damage ordering, training hazards, death and restart

- `src/health/mortalHearts.ts`: a pure fixed-step 3-container health model using six integer **half-heart units**, with separate damage gating, one-second invulnerability, cap-limited healing and lethal-state irreversibility until explicit restart. Mortal Hearts only; Spirit/Cursed/Bone/Eternal/etc hearts remain planned in their specified later milestones.
- `src/health/emberTrial.ts`: two deterministic pulsing ember hazards (`west-ember`,`east-ember`) and a timed healing shrine, positioned collision-safely from actual center-camera geometry. Hazards have warnings and obvious glyph states and apply half-heart contact damage through `MortalHearts.hurt`; the refill shrine restores up to a single Mortal Heart and has a ten-second refill cooldown.
- `src/health/healthArt.ts`: visible world-space hazard telegraphs and shrine marker, **not permanent UI**. Full/half/empty hearts and an explicit `x / 3 HEARTS` readout live only in `.grip-left [data-hud]`, outside the playfield.
- `src/scene/stage.ts`: fixed-step order processes movement/combat, invulnerability clock and environment contacts. On zero HP, the simulation stops, held pointers/keys are cleared, and a richly styled death panel replaces the stage. Restart resets player hearts, world position, active projectiles/training props, trials, and respawn counters while preserving controls/settings. Hazard/shrine cooldown survives a viewport resize, preventing free healing by rotating or resizing.
- `src/input/twinStick.ts`: explicit `dead` state blocks keyboard/touch/pause and safely restores input after restart, with unchanged `runegrave:input:v1` settings and v0.03 control ergonomics. No full run-save/export is falsely claimed (scheduled for v0.18).
- Environmental devices and temporary practice avatar are **not** counted as any of the six enemy types, a boss, generated room, new collectible, or completed character variant.

## v0.08 — Six enemy behaviors, boss and gate/room lifecycle

- `src/enemies/encounters.ts` owns deterministic fixed-step hostiles, their per-kind attack/telegraph states, two-wave combat chamber, Rootbound Warden two-phase boss, projectile sweeps, HP, knockback, live player contact damage, procedural *safe-placement checks*, and locked/unlocked east passages. Warnings have non-damaging time before their associated attack. The six kinds are separate mechanical AI implementations, not palette variants.
- An enemy's hits are resolved by the **existing** `SoulboltCombat` pool using a `setHostileHitHandler`; ordinary training props remain available in the pre-combat antechamber. On boss phase threshold, the attack cadence/fan danger changes. No enemy is artificially counted just for a sprite registry entry.
- `src/enemies/enemyArt.ts` provides authored discrete silhouettes, shape-coded attack warnings and boss phase cues strictly as *in-world sprites*. Player health and floor/completion state remain in external HUD strips and the Norse grips, never floating over combat.
- Sequence: practice antechamber (east exit open) → Sixfold Crypt wave 1 (draugr/wisp/archer) → wave 2 (charger/sentinel/shade) → gate opens → Rootbound Warden boss fight → boss defeat opens gate → stopped-world `ROOTVAULT TRIAL CLEARED` and restart. This limited trial is not an ending, challenge, seven-route unlock, or full seeded roguelike.
- `placeRoomExit` and `walkableRoute` check actual collision-free graph connectivity in the bounded camera geometry. Narrow layouts use an accessible more-inboard east exit rather than a physically disconnected corner. Varying/rotating camera sizes retain enemy HP, boss phases and room-wave progress while clearing shots that could otherwise become offscreen hazards.
- Enemy projectiles are independent of the hero's fixed-capacity pool. Their active count is bounded at 90, each steps at most 2.5 world units per collision sample, and they are removed on wall, player hit or lifetime expiry. Do not promise full multiplayer or procedural room generation at this milestone.

## v0.09 First Soul mini-run and Gate A boundary

- `run/firstSoul.ts`: an immutable library of 25 authored enemy/wave configurations and deterministic without-replacement selection of eight unique chambers per first-soul run. The selector is NOT the floor graph generator due at v0.10. Each clear triggers tangible world-space relic/silver/healing items and requires touching the relic sigil before the next eastern door can be used. The first phase remains the training antechamber; after eight chambers, the original two-phase Warden opens the completion exit.
- `run/lootArt.ts`: original world-space sigils and collectible sprites. Consumables and relic pickups are chosen only from the player's `reachableFloor` connected component, with clearance from each other, the actor, and the exit. No permanent UI is drawn on the canvas.
- `run/FirstSoulInventory`: eight functional passive relics, deterministic silver counter and health effect hooks. `SoulboltCombat` uses a validated mutable combat profile to apply damage/cooldown/speed/range/knockback on actual fired bullets. `MortalHearts.addContainer` provides a real heart capacity bonus and `reset` returns to three base containers; the Eir relic automatically heals on room clear.
- v0.09 controller rail HUD shows silver and last bound relic; a collapsible pause-only ledger enumerates real collected effects. Save schema stays 1 and controller preferences continue to use `runegrave:input:v1`. Relic/room progression is deliberately RUN-LOCAL; v0.18 full run saving and v0.12 resource economy remain future checkpoints.
- The new prototype has eight selected chambers plus the Warden room, not 25 simultaneous rooms or a finished procedural run. Art, iPhone ergonomics and Gate A approval are **not inferred** from local tests.

## v0.09.2 compass-doorway and reward feedback semantics

- `run/wayfinding.ts` holds an authored eight-chamber compass sequence including all north/west/south/east directions, **not** the future v0.10 room graph; `enemies/encounters.ts` uses flood-fill reachable floor to select an exit in that direction, rejecting placements too close to the actual player spawn. `scene/doorArt.ts` draws the exit as a recognisable original signed archway, and a relic-gated door stays red even when enemies are cleared.
- `platform/relicDiscovery.ts` displays a mandatory **paused** acquisition card from a real inventory event and clears input before showing it. It resumes only when the user presses Continue. The right grip shows the last acquired item's effective modifier and notes silver/healing pickups. No gameplay element overlays active center canvas; existing key bindings and saved controller preferences are unchanged.
