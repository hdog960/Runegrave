## v0.07 — The Mortal Thread (implementation cycle, 2026-11-09)

- Added deterministic, test-covered `MortalHearts` state: 3 Mortal Heart containers, half-heart damage, grace/invulnerability, bounded healing, lethal death, no accidental healing-based revival, and explicit restart reset.
- Added timed original in-world ember rune hazards with visible telegraph and actual contact damage, plus a refill shrine with finite cooldown. These are environmental training elements, not AI enemies.
- Moved full/half/empty hearts and numerical Vitality status exclusively into the separate left Norse grip. All gameplay controls and persistent status remain outside the combat canvas.
- Added paused-simulation-only Norse death/restart panel, disabled controls during death, zero lingering input after restart, and a keyboard R fallback. Death resets the training run and its destructibles, not saved input preferences.
- Preserved all v0.06 Soulbolt collision, projectile pooling, art/physics, v0.03 handedness and control-settings persistence, and existing PWA identity. Extended offline asset precache to the three new health modules.
- New 12-case health/trial test suite expands total Node tests to 44, with separate in-memory Chromium death/restart UI regression and four landscape + portrait layout/input checks. Physical iPhone/PWA offline behavior and v0.09 Gate A approval remain unverified.

**Next:** v0.08 six genuinely different hostile enemy AI patterns, combat room locks, clear/exits and first boss. No version skipping or content-count inflation.

# Verified Change Log

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
