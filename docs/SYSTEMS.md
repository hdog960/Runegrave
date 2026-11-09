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
