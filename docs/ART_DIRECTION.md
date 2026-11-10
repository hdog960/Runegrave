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
