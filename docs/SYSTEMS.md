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
