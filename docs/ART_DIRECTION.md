## v0.09.13 — Eight-direction Wayfarer and state-linked enemy frames

The hero now has an additional four-frame two-leg cadence in all eight aim-facing states, paired with different front/back chest/cloak ornaments, a quarter-turn shoulder profile and a short attack recoil glint. This is modular hand-drawn Canvas pixel geometry, **not** a claim of an imported professionally authored spritesheet or finished avatar art. All six hostile species and the Rootbound Warden receive threat-state-driven silhouettes: extended claws, drawn bow, braced horns, wheel-cast rune prongs, spectral veils, and root mauls. Five family-specific outer-arch motif sets add grounded depth, kept away from the central dodge ring. Reduced-motion prefs freeze the new decorative frame cycles; no art changes are applied to hitboxes or enemy state.

The overall aesthetic is still in active Gate A refinement; do not treat browser art screenshots as the user's approval.

## v0.09.12 — Clear silhouettes in a restrained combat arena

The camera retains a high-contrast, unobstructed central dodge ring. The five real masonry foundations now feature a subtle edge-only atmospheric signature (embers, sparks, spores, ghostglass, woven threads); 10 bounded motifs per active room, no additional interaction or collision. Hostile spectral darts and heavy Warden embers have separate motion-facing silhouettes and tails; they remain color-independent shapes against Soulbolts. The Wayfarer receives eight-direction mantle stitches, helmet crest and firing-ring highlights but retains the same collision radius and authored facing pose. All new art stays INSIDE the canvas; thumb grips remain untouched.

## v0.09.11 — Distinct foundations, not five color filters

The shared Rootvault backdrop made different encounter families resemble repeated rooms. The game now uses five source-authored wall-brick and floor-tile color/material palettes directly in `src/scene/sanctuaryArt.ts`. The actual side silhouettes change by family: ASH furnaces, IRON astrolabes, SPIRIT ghostglass mirrors, FATE looms, while ROOT retains roots and sarcophagi. Setpieces are low-profile decorative objects placed behind actors, not portals, pickups or colliders. `wayfarerEmblems.ts` gives the player a crest, shoulder plates and embroidery; `armorAccents.ts` adds seven foe-specific material/weapon shapes. The central stage remains clear of HTML controls and permanent HUD, and the PWA caches the modules. These are iterative source-controlled art improvements, **not yet player-approved final art**.

## v0.09.10 — Authored room reliefs / outside-canvas threat status

The five first-soul families now have additional hand-drawn family-specific incised emblems, with the chisel-notch count + recess offset creating 25 distinct canonical silhouettes across 25 room IDs. Unlike hostile warnings, they are dull engraved stone and sit toward the room's side; they do not imply pickups or collisions. This replaces an older, higher-cost decorative floor-relief layer to preserve headless Chromium and unit painter budgets. Existing upper-landmark silhouettes and original Runegrave handheld stay unchanged.

Combat danger receives a secondary text-readable clue above the movement thumb socket but **only within the left forged side grip**. It reports enemy wave, imminent named attack, or Warden phase/HP based on actual simulation state. The readout is noninteractive and never covers a stage pixel or thumb touch area. It is intended as supplemental text; the real in-world attack telegraphs remain authoritative. No Gate A artistic approval is inferred.

## v0.09.9 — Historical heraldry and responsive world animation

Carved upper-wall heraldry now gives each of 25 authored room configurations a distinct five-family crest with numbered cuts; each is shaped and muted like stone, not an item, door, or telegraph. The Wayfarer leaves small family-colored footprints while moving and real hostile deaths dissolve with short-lived stone/soul-ash rings; the existing Warden has a larger boss-specific pulse. These are lightweight world-space marks, never extra HUD, hitboxes, or virtual controls. Reduced-motion preferences suppress the transient effects entirely. A 34px right-grip Pause target and explicit return-from-background Pause reinforce iPhone comfort without ever obscuring the playable viewport. Art still requires the player's explicit Gate A approval.

## v0.09.8 Gate A art refinements

Combat legibility: impacts briefly display real numeric damage beside the actual enemy contact; wounds show real lost half-hearts at the Wayfarer's feet; pickups display actual earned silver/healing or a BOUND cue. All float inside the game's measured center canvas and fade from fixed ticks, without mounting touch regions. A restrained 32-pixel heading glyph appears while firing. Colors retain neutral gold for damage, coral for wounds, pale green for healing and silver; none are enemy telegraph colors.

Environment: five unique floor reliefs at the perimeter—cracked ash drains, riveted iron plinths, braided living roots, staggered ghostglass mirrors and fate-loom thread-stone—replace old repetitive floor trim. Distinct silhouettes and materials matter more than tiny decoration. No lighting/prop silhouettes should deceive the player into thinking a wall engraving is a collectible, attack, or door. Keep both controller rails entirely separate. **This is still not certified to the player's visual standard.**

## v0.09.4 — Five authored visual room materials and combat legibility

":[...]" is not used as a gameplay asset. The existing original Rootvault stone architecture stays recognizable, while `scene/familyArt.ts` distinguishes **ASH** (vitrified amber cracks), **IRON** (cold blue riveted plates), **ROOT** (living green-veined stones), **SPIRIT** (soft violet ghostglass), and **FATE** (golden interlocked knotwork). World-space frescoes and wall trim do not affect enemy collision. Do not create fake doors/pickups out of non-interactive decor. `enemies/enemyArt.ts` adds danger lanes, arrowheads and rings in world space with readable labels; the permanent HUD remains outside the canvas. Gate A art is still subject to player approval.

# Art and Controller Layout — Locked Direction

Canonical: [UI_CONTROLS_AND_ART_DIRECTION.md](UI_CONTROLS_AND_ART_DIRECTION.md) and [HANDHELD_CONTROLLER_LAYOUT.md](HANDHELD_CONTROLLER_LAYOUT.md). The preview uses original, hand-authored World Tree SVG art and carved-stone styling as an **early visual tone study only**, not final or player-approved art.

Starting v0.02, build an integrated Norse handheld in landscape with a left movement grip, center **unobstructed** canvas, and right aim/action grip. The center must not be underneath any UI or decoration. HUD only in separate DOM rails/bands. Measure browser safe areas and real canvas bounds. At v0.04 show screenshot; at v0.09 stop for explicit Gate A visual approval. No Nintendo marks, borrowed sprites, paid assets, or generic touch-stick overlays.

## v0.04 authored visual prototype — Rootvault Sanctuary

The new `src/scene/sanctuaryArt.ts` is a separate original, procedural, source-controlled art renderer. Materials: basalt and green-stone masonry, iron jaws/gate, aged brass inlays, broken runestones, creeping roots, funerary sarcophagi, twin ember braziers, and a floor-bound fate-knot around the player. The Wayfarer preview now conveys facing direction and walking stride, with a stronger cloak/helmet/weapon silhouette. Lighting and embers are bounded to the scene canvas. This **does not** create collidable geometry, enemies, health rules, or real combat.

The handheld shell now has deeper woodgrain/iron/aged-gold engraving, recesses, inset controls, tactile states, and refined external status strips; small-viewport duplicate end-cap lettering has been removed. Art remains a **prototype needing player review at Gate A (v0.09)**. No external art or Nintendo product assets were imported. Maintain zero paint and DOM intersection with the playfield by reserving the central world canvas's measured rectangle for the renderer alone.


## v0.06 world-space combat visuals

The first live Soulbolts are authored teal-white pixel-geometry projectile sprites with restrained trail illumination, hit motes and break sparks. Carved ash-and-iron practice effigies and an urn are **original non-hostile props** designed to teach impact and damage without suggesting enemies are ready early. The three-region dark ash/bronze handheld and left/right Norse rune grips remain in place; projectile VFX are world objects that never cause HUD or touch controls to overlay active combat. Future enemy telegraphs, health feedback and major UI art still require v0.07–v0.09 work and player approval at Gate A.

## v0.08 — Original hostile silhouettes and telegraphs

Six newly authored pixel-geometry enemies are distinguished by silhouette and movement, not color alone: shielded draugr, hovering wisp, archer, twin-horned charger, iron-root sentinel and fading shade. The Rootbound Warden has a bespoke broad-shouldered root-armored body and changes accent and pattern in phase two. Enemy windups use circular runic warnings and, where meaningful, dotted aim lines inside the world canvas. Health is context-anchored to each enemy; player hearts and stage information remain wholly outside the canvas. Original artwork is still a development prototype and needs explicit **v0.09 Gate A** visual/player approval; no approval is presumed.
