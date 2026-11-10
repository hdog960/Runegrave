# Relics and Talismans — Development Register

**At v0.01: 0 functional relics, 0 talismans, 0 authored special interactions.** The Design Bible requires at least 750 functional relics, 150 distinct talismans, and 250 authored special interactions at v1.0. Relic IDs and actual effects must be individually tested before ledger credit. The earliest functioning relic cohort arrives at v0.09; typed registry architecture is v0.14. Do not manufacture filler to reach numerical targets.

## v0.09 — Eight functioning prototype relics (not the full v0.14 item framework)

| ID | Relic | Actual tested passive |
|---|---|---|
| `wyrd-fang` | Wyrd Fang | Soulbolt damage 2 → 3 |
| `skald-drum` | Skald Drum | Fire cooldown ×0.80 |
| `storm-feather` | Storm Feather | Projectile speed ×1.25 |
| `hugin-lens` | Hugin Lens | Range ×1.30 |
| `ash-anchor` | Ash Anchor | Knockback ×1.70 |
| `shieldroot` | Shieldroot Bark | Adds one genuine full Mortal Heart container, lost on new run |
| `eir-thread` | Eir’s Thread | Heals one half-heart when acquired and once after each subsequent room clear |
| `raven-hoard` | Raven Hoard | Adds 3 silver to every collected silver pickup |

Runtime definitions, validation, and collections: `src/run/firstSoul.ts`. Soulbolt modifiers are applied by `SoulboltCombat.setProfile`, and are not just decorative stats. See `tests/firstSoul.test.mjs`; all eight are obtained by walking to distinct world-space reward sigils. Full relic slot/active architecture and relic/talisman catalogs remain scheduled for v0.14–v0.15 and later.
