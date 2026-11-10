# Art and Controller Layout — Locked Direction

Canonical: [UI_CONTROLS_AND_ART_DIRECTION.md](UI_CONTROLS_AND_ART_DIRECTION.md) and [HANDHELD_CONTROLLER_LAYOUT.md](HANDHELD_CONTROLLER_LAYOUT.md). The preview uses original, hand-authored World Tree SVG art and carved-stone styling as an **early visual tone study only**, not final or player-approved art.

Starting v0.02, build an integrated Norse handheld in landscape with a left movement grip, center **unobstructed** canvas, and right aim/action grip. The center must not be underneath any UI or decoration. HUD only in separate DOM rails/bands. Measure browser safe areas and real canvas bounds. At v0.04 show screenshot; at v0.09 stop for explicit Gate A visual approval. No Nintendo marks, borrowed sprites, paid assets, or generic touch-stick overlays.

## v0.04 authored visual prototype — Rootvault Sanctuary

The new `src/scene/sanctuaryArt.ts` is a separate original, procedural, source-controlled art renderer. Materials: basalt and green-stone masonry, iron jaws/gate, aged brass inlays, broken runestones, creeping roots, funerary sarcophagi, twin ember braziers, and a floor-bound fate-knot around the player. The Wayfarer preview now conveys facing direction and walking stride, with a stronger cloak/helmet/weapon silhouette. Lighting and embers are bounded to the scene canvas. This **does not** create collidable geometry, enemies, health rules, or real combat.

The handheld shell now has deeper woodgrain/iron/aged-gold engraving, recesses, inset controls, tactile states, and refined external status strips; small-viewport duplicate end-cap lettering has been removed. Art remains a **prototype needing player review at Gate A (v0.09)**. No external art or Nintendo product assets were imported. Maintain zero paint and DOM intersection with the playfield by reserving the central world canvas's measured rectangle for the renderer alone.


## v0.06 world-space combat visuals

The first live Soulbolts are authored teal-white pixel-geometry projectile sprites with restrained trail illumination, hit motes and break sparks. Carved ash-and-iron practice effigies and an urn are **original non-hostile props** designed to teach impact and damage without suggesting enemies are ready early. The three-region dark ash/bronze handheld and left/right Norse rune grips remain in place; projectile VFX are world objects that never cause HUD or touch controls to overlay active combat. Future enemy telegraphs, health feedback and major UI art still require v0.07–v0.09 work and player approval at Gate A.
