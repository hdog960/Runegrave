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
