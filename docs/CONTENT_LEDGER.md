## v0.09.12 — Art-only Gate A progression, no fabricated new content

Existing cumulative tested content remains: 25 authored combat-room configurations (eight chosen in the curated mini-run), eight functional relics, six hostile enemy behaviors, one Rootbound Warden, silver/healing pickups, one provisional hero and one boss path. Five ambient art signatures and two projectile visual weights are **presentation**, not new rooms/enemies, and do not count toward planned full game content. Gate A **UNAPPROVED**. No v0.10 floor graph or late-game system started.

## v0.09.11 — No fabricated content additions (2026-11-10)

**Counts unchanged:** 25 authored first-soul encounter configurations (eight per curated run), six hostile kinds, one Warden boss, eight genuinely functioning relics, one provisional Wayfarer, silver/healing pickups. This release changes architectural art and enemy/player ornamentation ONLY; the four new side setpiece motifs are decorative replacements for the same non-colliding two props, not new interactive objects. Full procedural floor graph, seven endings, 750 relic target, shops, long-run persistence and future v0.10+ milestones remain LOCKED until explicit Gate A approval. Save schema and gameplay rules unchanged.

## v0.09.10 — Count remains unchanged

The 25 deterministic authored encounter configurations gain visually unique, family-validated floor reliefs; **these are not 25 additional rooms**. Six real hostile behavior kinds, one Warden boss, eight functioning relics, initial pickups, and one curated eight-chamber/boss route remain exactly as before. The new left-grip threat status and masonry art do not add weapons, enemies, bosses, game routes, shops, transformations, talismans, paid content, or final art approval. Future v0.10 seeded floor graphs remain locked pending explicit Gate A approval.

## v0.09.9 — Counts unchanged (art/UX-only release)

25 authored mechanically valid room configurations, five family materials and **25 new heraldry variants** (cosmetic decoration, NOT 25 extra playable rooms); eight functional relics; one provisional Wayfarer; six true hostile enemy kinds; one Warden boss; one curated eight-room-plus-boss mini-run; silver/heal pickups. Cosmetic footfalls and defeat blooms are NOT additional enemies, rooms, drops or collectibles. Zero full procedural branching graphs, talismans, complete alternate routes or player-approved final art. Gate A remains unapproved; v0.10 locked.

## v0.09.8 audit — no new content counted

25 authored mechanically valid room configs (eight per connected demo run), six hostile enemy kinds, one Rootbound Warden boss, eight genuinely functional relics and initial healing/silver pickups are unchanged. The five new reliefs are visual variants of existing five families, **not** five new rooms. World-space hit numbers and reward labels are UI presentation, **not** relic synergies or a new HUD inventory. Procedural floor graph, full shop economy, route endings, additional characters and final aesthetic approval remain future work. Gate A v0.09 is NOT APPROVED.

# Content Ledger — Implementation Evidence

The canonical targets in [ROADMAP.md](ROADMAP.md) and [DESIGN_BIBLE.md](DESIGN_BIBLE.md) are not reduced by this ledger.

| Category | v1.0 requirement | Verified playable units at v0.01 | Planned metadata at v0.01 |
|---|---:|---:|---:|
| Functional relics | 750 | 0 | 0 |
| Talismans | 150 | 0 | 0 |
| Playable variants | 34 | 0 | 0 |
| Distinct enemies | 250 | 0 | 0 |
| Distinct bosses | 100 | 0 | 0 |
| Meaningful rooms | 5,000 | 0 | 0 |
| Transformations | 20 | 0 | 0 |
| Curated challenges | 40 | 0 | 0 |
| Major story routes | 7 | 0 | 0 |
| Authored special synergies | 250+ | 0 | 0 |
| Realm floor implementations | 9 | 0 | 9 planned IDs only |

An ID, display name, sprite sketch, or registry stub counts as zero until gameplay, validity tests, and release verification prove the content is functional. Future updates must link concrete evidence.

## v0.05 verified count (2026-11-09)

Physics exists, but neither a walkable scenery trial nor a decorative moving training avatar counts as a procedural room or playable character. **All functional content totals remain zero; nine realm IDs remain planned metadata only.**

## v0.06 honest content accounting — 2026-11-09

- **Implemented training mechanisms:** one real Soulbolt damage/projectile engine; three breakable non-hostile practice targets (two effigies, one urn), each with hitpoints, knockback and safe respawn. These demonstrate combat systems but are **not** credited as distinct enemies, bosses, real relics, valid generated rooms or any major content quota.
- All full-release content targets in the Design Bible remain unchanged. Verified functional relics 0, playable variants 0, enemy types 0, bosses 0, valid procedural room configurations 0, talismans 0, transformations 0, challenges 0, endings 0, authored special synergies 0. Nine realm IDs remain design-only metadata.
- v0.07 player hearts/damage/death, v0.08 encounter AI/boss/room clear, and v0.09 first prototype/Gate A are not started.

## v0.07 — Mortal Thread accounting (2026-11-09)

**Verified functional systems:** Mortal Hearts with half-heart states, timed environmental damage with one-second invulnerability, simple healing shrine, death and restart. Two rune hazards and a refill shrine are environmental test instruments, not distinct enemies. The three previously implemented destructibles remain practice targets. **Full-release count remains unchanged:** relics 0, talismans 0, playable variants 0, hostile enemy types 0, bosses 0, procedurally valid rooms 0, transformations 0, challenges 0, endings/routes 0, authored synergies 0. v0.08 enemy/room/boss milestone and v0.09 Gate A await future verified implementation.

## v0.08 verified implemented gameplay accounting (pending publication verification)

| Gameplay category | Verified code-backed playable units | Evidence |
|---|---:|---|
| Distinct hostile enemy kinds | **6** | `src/enemies/encounters.ts`, `src/enemies/enemyArt.ts`, `tests/enemies.test.mjs`: distinct damage/behavior/attack families, deterministic two-wave room, HP/telegraphs |
| Distinct bosses | **1** | Two-phase **Rootbound Warden** with 28 HP, aimed fan volleys, phase transition, defeat and exit unlocking |
| Implemented authored encounter sequences | **2** | Two-wave Sixfold Crypt and Warden boss room; these are **not** counted as procedurally generated room configurations |
| Fully procedural valid rooms credited | **0** | 25-room first prototype is planned at v0.09; seeded graph and mature room library remain future tasks |
| Playable roster variants counted | **0** | Existing Wayfarer training avatar is not yet audited/approved as a complete character identity |
| Relics / talismans / transformations / endings / challenge completions | **0** | No fake registry entries or completion rewards |

The practice antechamber remains outside the enemy count. The **six enemy** and **one boss** counts are supported by real instantiated attack and damage rules, but their final mobile balance and artistic acceptance are still pending. This combat trial does **not** satisfy v0.09's 8 relics, 25 rooms, and player Gate A approval. Nothing in the 750-relic / 34-variant / 250-enemy / 100-boss / 5,000-room v1.0 target has been reduced.

## v0.09 Gate A provisional playable content (pending player visual/control approval)

| Content | Functional v0.09 count | Evidence and limitation |
|---|---:|---|
| 25 authored room *configurations* | **25** | `src/run/firstSoul.ts`, `tests/firstSoul.test.mjs`; unique enemy/wave plans, safe spawn and reachable exits at six camera heights; **not** 25 physical rooms in one run and **not** procedural floor graphs |
| Rooms on an individual first-soul mini-run | **8 + 1 boss** | Seeded choice without replacement, each room connected by a gate, culminating in Rootbound Warden; start antechamber is separate |
| Functional prototype relics | **8** | Damage, cadence, speed, range, knockback, heart capacity, on-clear healing, extra silver; tests verify actual state/attack changes; not merely names/icons |
| Collectible resources | **Silver, healing** | Tangible pickup + in-grip silver counter; no shop or spending yet |
| Distinct hostile enemy kinds | **6** | Preserved six mechanical enemy patterns from v0.08 |
| Bosses | **1** | Preserved two-phase Rootbound Warden |
| Playable Wayfarer | **1 provisional archetype** | Full movement, aim, combat, health and run restart; visual identity not yet approved |
| Mature procedural floor graphs, talismans, transformations, endings, authored special synergies | **0** | Remain assigned to subsequent canonical roadmap milestones |

**Gate A is AWAITING PLAYER APPROVAL.** Neither a simulated browser walkthrough nor a deployed Pages URL establishes real iPhone ergonomics or artistic acceptance. v1.0 targets of 750 functional relics, 150 talismans, 34 variants, 250 enemies, 100 bosses, 5,000 room configurations and all other bible requirements remain unchanged.
