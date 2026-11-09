# RUNEGRAVE: THE NINEFOLD DESCENT
## Official Game Design Bible — Full Scope

**Status:** Authoritative design specification; planned product, not an implementation claim.  
**Companion documents:** `ROADMAP.md`, `UI_CONTROLS_AND_ART_DIRECTION.md`, `HANDHELD_CONTROLLER_LAYOUT.md`, `README_START_HERE.md`  
**Primary platform:** iPhone landscape, Safari + installable Home Screen PWA  
**Repository / distribution:** Existing GitHub repository and GitHub Pages; preserve existing project identity.  
**Cost:** No required payment, subscriptions, commercial API, or paid hosting.  
**Excluded tools/workflows:** Codex, ChatGPT Work, Vercel, and mandatory paid services.

> **Mandatory handheld aesthetic:** In landscape, the phone should resemble an original Norse-mythology handheld console: integrated left and right rune-carved control grips with a large uninterrupted combat display between them. Inspired by the ergonomic screen-between-controllers form factor of a Nintendo Switch, but without copying Nintendo branding or protected visual designs. Full details and approval tests in `UI_CONTROLS_AND_ART_DIRECTION.md`.

> **Mandatory UX rule:** Virtual controls, persistent HUD, and UI decorations never cover active gameplay. Use separate themed side rails and a dedicated central combat viewport. See `UI_CONTROLS_AND_ART_DIRECTION.md` for exact design and acceptance tests. This rule has priority over convenient overlays.

## 1. Vision and Reference

Create an original Norse-mythology, room-based action roguelike with the **mechanical breadth, interwoven systems, replayability, build variety, branching progression, and hidden content** that make *The Binding of Isaac: Repentance* such a deep roguelike. The game is not a shallow lookalike: it needs the full ecosystem of seeded room layouts, currencies, shops, secret rooms, multi-type health, consumables, extensive item pools, passive and active relics, familiars, synergies, transformations, distinctly playable characters and their alternate forms, challenges, curses, layered unlocks, alternate routes, multiple endings, a separate wave-economy mode, and high-level bosses.

All names, music, art, dialogue, characters, story, encounters, room arrangements, and specific creative expression must be **original**. Treat Repentance as a systems reference, not as source material to copy. Do not reuse copyrighted sprites, sound effects, songs, room designs, or narrative scenes.

**Full-release minimums:** 750 functional relics, 150 talismans, 34 playable variants (17 standard + 17 Fractured), 250 distinct enemies, 100 distinct boss encounters, 5,000 meaningful room configurations, 20 transformations, 40 curated challenges, seven major ending routes, and at least 250 deliberately authored special synergy behaviors atop thousands of emergent interactions. Counts never include inert placeholders, recolor-only variants, duplicated scripts without meaningful variation, or nonfunctional registry IDs.

### Design pillars

1. Responsive, skill-based twin-stick action combat.
2. Deep combinatorial relic interactions, including spectacular rare builds.
3. Character identities that materially alter play strategy.
4. Seeded procedural exploration with learnable secrets and meaningful risk/reward.
5. Branching chapters, secrets, and completion marks tied to permanent content unlocks.
6. Beautiful, legible, authentic-feeling dark Norse pixel art and mythological atmosphere.
7. Player agency: persistent progression broadens the possible run rather than trivially increasing base damage with each death.
8. True mobile-first usability: visible playfield entirely separate from thumb controls.
9. Reliability, honest milestone reporting, and real deployed gameplay.

## 2. World and Premise

Yggdrasil, the World Tree connecting the Nine Realms, rots from its roots upward. The Norns have lost control over the threads of fate. Odin has vanished; thunder echoes without its wielder; the dead spill outward from Helheim; forgotten Jötnar awaken. Every lost soul is pulled into the hollow tree. The protagonist, a fallen soul, must attempt again and again to escape the failing cycle.

Each randomized descent reveals fragments of a deeper mystery. Odin may have engineered the fracture; Loki may be trying to avert a worse outcome; the Norns may have rewritten history again and again; perhaps Ragnarök has already passed and the gods are merely echoes. Reveal the truth through hidden routes, endings, environmental storytelling, relic lore, challenges, and character-specific progression.

The **Saga Codex** permanently records discovered lore. Ordinary runs prioritize action, discovery, and atmosphere, not long unskippable cutscenes. Each ending changes what players understand about the world and opens possibilities for later runs.

## 3. Art and Audio

High-quality, expressive, cohesive **32-bit-inspired overhead pixel art**. Dark Norse fantasy means ash wood, runestones, iron, old silver, glacier-blue frost, embers, haunted roots, molten forge light, necromantic purple, gilded Asgard architecture, and mythological creature silhouettes. Rooms differ in geometry and function, not just palette.

All playable characters require full directional idle/movement/attack/damage/death states, distinct silhouettes, and visible equipment/transformation overlays. Enemies need clear hitboxes, anticipation frames, dangerous state cues, and readable projectile telegraphs. Large bosses need bespoke animations and multi-phase visual presentation.

Each realm needs original atmospheric music, impact/attack sounds, collectible feedback, boss themes, transition cues, and a pause-menu audio model. Favor original, legally usable assets; never borrow protected music or sprites from other games. Provide effects and screen-shake intensity settings and color-independent danger indicators.

### Thematic UI

The HUD, touch rails, menus, Codex, and character-selection screen must look carved from rune-etched wood, stone, old metal, and mythic artifacts. Avoid generic flat mobile UI. Use ornamental type sparingly; numerical status text must remain immediately readable. During active combat, **neither UI nor virtual touch controls may overlay the game canvas**, even translucently. See the separate UI specification for mandatory implementation details.

## 4. Delivery and Runtime

The game is a free, static-hosted browser application, usable in Safari and installable from Safari to the iPhone Home Screen. Use the **already established** GitHub repository and GitHub Pages publication URL. Do not create a new repository or alter a working Pages setup without reason. Favor TypeScript, Phaser 3 (or an equally capable open-source 2D renderer), Vite, IndexedDB, a web manifest, service worker with safe cache update logic, and free automated tests.

- Landscape, twin-stick touch input, plus keyboard/controller support.
- A central gameplay canvas **not shared** with joystick, attack control, HUD, or UI chrome.
- Dedicated touch and HUD regions outside the playfield; adapt the camera to the center canvas.
- Seeded deterministic generation and testable simulation.
- Smooth performance targeting 60 FPS on reference iPhone hardware.
- Versioned saves with export/import, backup recovery, and migrations.
- Offline-capable PWA if assets have been cached, with correct update behavior.
- Content/asset streaming where possible to avoid huge initial downloads.
- No necessary internet connection during gameplay and no required accounts.
- No paid or external game service for essential features.
- Meaningful local multiplayer where supported, without falsely claiming network play.

Caution: Browser storage can be purged, and Safari vs standalone Home Screen storage may differ. Include manual export/import. Never claim indefinite local save persistence.

## 5. Core Game Loop

Select one of 34 character variants; begin a seeded run with unique starting statistics and equipment; explore interconnected combat and utility rooms; evade enemies and fire directional **Soulbolts**; gain loot and relics; use resources to access hidden rewards and bargains; defeat room bosses; enter progressively more dangerous realms; choose alternate routes; discover secret objectives; earn permanent unlocks; die and restart or complete an ending.

Room exits generally lock during combat and reopen on clear. Cleared rooms remain cleared, allowing backtracking. Exploration rewards curiosity, while major branching choices have genuine costs. Runs are consequential: death ends the current run absent specific revival mechanics. Permanent progression reveals additional choices, not blanket permanent stat inflation.

### Combat baseline

Independent movement and directional attacks, continuous fire, adjustable attack rate, attack range, projectile velocity, collision, knockback, invulnerability frames, status effects, active abilities, enemy telegraphs, and intentionally readable bullet patterns. No universal dodge roll: movement, positioning, and build knowledge must remain meaningful. Movement abilities come from specific relics/characters.

Support projectile piercing, bouncing, homing, charging, beams, lasers, explosions, melee conversion, returning attacks, splitting, duplication, orbiting projectiles, multi-shot, familiars, terrain effects, elemental chaining, damage-over-time, flight, shields, time manipulation, and controlled transformation.

## 6. Player Statistics and Health

Core stats: Vitality (health capacity), Might (damage), Spirit Flow (fire rate), Reach (attack range), Soul Velocity (projectile speed), Agility (movement), and Fortune (luck). Additional stats: crit chance/damage, armor/resistances, knockback, projectile size/count, status strength/duration, familiar damage, charge speed, blast radius, enemy attention, pickup attraction, item selection, shop modifiers, spawn probabilities, hidden effect multipliers.

Implement a deterministic modifier pipeline with additive/multiplicative/override/capped/conditional stages. Item ordering and stacking must be documented and tested.

### Health types

- **Mortal Hearts:** Red refillable health in containers.
- **Spirit Hearts:** Blue temporary protection, depleted before standard health.
- **Cursed Hearts:** Dark protection that retaliates or triggers special effects when lost.
- **Bone Hearts:** Defensive containers that can hold mortal health.
- **Eternal Hearts:** Rare protection that may become permanent if preserved through a floor.
- **Golden Hearts:** Generate economic rewards when lost under appropriate rules.
- **Rot Hearts:** Fragile offensive/defensive anomalies.
- **Oath Hearts:** Health tied to covenants with consequences for damage or survival.

Support partial-heart damage, maximum-heart containers, healing restrictions, heart conversion, shield order, contact damage, invulnerability, revival, and character-specific health economies. Each heart type must behave distinctly.

## 7. Playable Character Roster

**17 standard characters** with unique starting health, statistics, abilities, equipment, visual identity, unlocks, and completion records:

1. **Vargr, the Fallen** — flexible balanced spirit, favors adaptability.
2. **Eira, the Hearthkeeper** — high vitality, healing, defense, slower offense.
3. **Skadi's Disciple** — mobility, precision, crits and timing.
4. **Brynja, the Shieldmaiden** — counterattacks, directional shields, defense.
5. **Hrafn, the Seer** — map insight, prophecy, calculated reward manipulation.
6. **Sigrun, the Valkyrie** — spectral attacks and flight, fragile divine power.
7. **Ulf, the Berserker** — escalating damage-related offensive frenzy.
8. **Nótt, the Shade** — extremely vulnerable with spectral advantages.
9. **Brokkr, the Runeforger** — converts resources to equipment improvements.
10. **Mimir's Echo** — altered targeting and knowledge-based powers.
11. **Lokk, the Changeling** — unstable shifting and probabilities.
12. **Asta, the Runesmith** — combines found runes into active powers.
13. **Fen, the Wolfbound** — familiar/pack-based combat.
14. **Ivar, the Oathbreaker** — powerful bargains and contractual consequences.
15. **Dagr and Dusk** — two bodies with shared constraints and resources.
16. **Runa, the Revenant** — resurrection and death-triggered transformations.
17. **Hroth, the Jötunn-Blooded** — slow, devastating, unusual physical presence.

**17 Fractured alternate variants**: full rule-changing counterparts, never merely recolors:

1. **Fractured Vargr:** Limited relic slots, fuses items into stronger forms.
2. **Fractured Eira:** Cannot heal conventionally, spends health containers for power.
3. **Fractured Skadi:** Charged attacks require timing windows.
4. **Fractured Brynja:** Manually positioned shield changes collision/aiming.
5. **Fractured Hrafn:** Sees possible futures but must sacrifice information.
6. **Fractured Sigrun:** Navigates via unusual spectral movement rather than normal walking.
7. **Fractured Ulf:** Frenzy escalates damage and risk of lost control.
8. **Fractured Nótt:** Controls a separate shadow form with different vulnerabilities.
9. **Fractured Brokkr:** Dismantles relics into crafting resources instead of equipping normally.
10. **Fractured Mimir:** Separates consciousness and physical body.
11. **Fractured Lokk:** Periodic unstable transformation forms.
12. **Fractured Asta:** Limited rotating spell/rune set.
13. **Fractured Fen:** Commands a pack while the main body is offensively restricted.
14. **Fractured Ivar:** Escalating covenant obligations must be fulfilled.
15. **Fractured Dagr and Dusk:** Active-body swapping and vulnerable secondary body.
16. **Fractured Runa:** Revival cycles change abilities and use a restricted life economy.
17. **Fractured Hroth:** Giant movable weapon dominates combat and positioning.

Each has unique completion records and unlock rewards. Build character rule isolation so one variant's special systems cannot contaminate other characters' state.

## 8. Relics — Primary Replayability System

At least **750 genuinely different collectible relics** with unique IDs, original icons, names, pool eligibility, quality/weight, mechanically implemented effects, relevant synergies, optional transformation tags, unlock rules, Codex records, and test coverage.

Types: passive, active/charged, familiars, divine, covenant, cursed, runic, economic, defensive, environmental/reality-altering, and transformation-linked. Suggested planning buckets (not rigid): 190 attack/combat; 100 utility/economy/exploration; 95 familiars; 105 actives; 85 health/defense; 65 elemental; 55 probability/reroll; 55 special hybrid/transformative. Many cross-tagged effects are encouraged, but every registered relic must be distinct and functional.

### Sample original relics and effects

- **Splinter of Gungnir:** Piercing Soulbolts redirect toward a second target.
- **Thor's Broken Hammer:** Periodic lightning; stronger lightning links through additional electrical relics.
- **Hrafn's Stolen Eye:** Mark enemies for escalating damage and selective through-wall tracking.
- **Fenrir's Milk Fang:** Stacking bleed; kills occasionally summon spectral wolves.
- **Loki's Silver Tongue:** Merchant price volatility with surprising purchase consequences.
- **Hel's Black Candle:** Converts some healing to cursed protection; lost protection releases spectral fire.
- **Jörmungandr's Scale:** Curving returning projectiles that may strike twice.
- **Mjölnir's Memory:** Charged active returning hammer with lightning synergy.
- **Draugr's Jaw:** Big damage and projectile size at the cost of rate of fire.
- **Sleipnir's Shadow:** Speed and occasional damaging spectral hoofprints.
- **Nidhogg's Tooth:** Poison spreads through connected corrupted targets.
- **Freyja's Amber Tear:** Critical hits can temporarily charm enemies.
- **The Dwarven Anvil:** Spend nearby pickups to reforge relic effects.
- **The Broken Bifröst:** Occasional split attacks carrying realm elements.
- **Skuld's Loose Thread:** Once per floor, replace an encountered reward with another possible fate.
- **The First Funeral Pyre:** Dead foes leave hazardous burning remains and chain reactions.
- **Tyr's Missing Hand:** Offensive benefit for a specific defensive sacrifice.
- **The Valkyrie's Last Feather:** One-time revival into temporary spectral form.
- **The Hoarder's Third Eye:** Reveals treasure but makes treasure rooms more dangerous.
- **The Rootbound Heart:** Converts excess healing into temporary root shields.

Do not implement large item lists as labels, minor numeric variations, or icons without meaningful effects. The mature game must contain strong build-defining effects as well as smaller conditional modifiers.

## 9. Combinatorial Synergy Engine

Build an extensible event-driven pipeline for projectile generation/motion/collision, charge/release, damage, crits, status application, enemy death, player damage, healing, pickup generation, item gain/loss, rooms, floors, spawning, transformation, resource spending, and revival.

Examples: lightning + chain attacks; poison + fire; returning + piercing; freezing + heavy impact; homing + multi-shot; familiars + crit; charged attacks + splitting; explosions + ice; spectral + ricochet; healing + revival conversion.

**Requirements:** deterministic stacking; reusable modifier components; consistent visuals; meaningful item synergy for all major attack families; cycle/recursion guards; defined damage caps where necessary; rare game-breaking positive combinations allowed if stable; robust stress testing of large simultaneous effects; preserve input responsiveness. Target **250+ authored special interactions** in addition to thousands of emergent combinations.

## 10. Talismans, Consumables, and Pickups

- **150 Talismans:** Minor carried items, normally one slot, with special exceptions/duplication/consumption. Affect drops, luck, secrets, shops, combat, economy, revival, etc.
- **Rune consumables:** Norse-inspired symbols (Ansuz, Fehu, Raidho, Kenaz, Algiz, Tiwaz, Berkano, Eihwaz, Sowilo, Hagalaz and more) providing room revelation, conversions, mobility, defenses, elemental events, and exceptional outcomes.
- **Saga Scrolls:** One-use effects for teleports, temporary forms, explosions, enemy manipulation, rerolls, economy, and hidden access.
- **Mysterious Brews:** Unidentified appearance/effect pairs per run; identification through experimentation; positive, negative, neutral and risky results.
- **Pickups:** Multiple varieties of silver, bombs, keys, health, charges, soul fragments, golden/cursed variants, unusual chests and rare keys, exploding containers, and dropped resource bundles.

Every consumable family requires item identification, pool rarity, gameplay integration, and suitable user feedback without obscuring live combat.

## 11. Procedural Dungeon and Room Categories

Seeded graph-based generation must select appropriate room size, enemy budget, exit/entry configuration, obstacles, special-room eligibility, loot placement, floor difficulty, character progression, and unlocks. Guarantee reachability. Support standard, long, wide, double, oversized arenas, and special multi-chamber environments.

At least 30 special room categories: combat, treasure, boss, miniboss, merchant, secret, super/deep secret, cursed burial, sacrifice, rune library, forge, divine shrine, Jötunn covenant, challenge, boss challenge, rune reversal, gambling, beggars, vaults, teleports, character-specific, puzzles, crawlspaces, traps, route gateways, transformation, secret merchant, oath shrine, Wyrd probability chamber, and ultra-rare event rooms.

Hidden chambers have learnable placement rules. Bombing, unusual environmental cues, and map items should create real opportunities for player knowledge. Destructibles include ordinary/reinforced/marked stones, pits, spikes, fire, ice, webs, pressure plates, roots, explosive vessels, unstable architecture, and terrain-specific hazards.

End-state target: **5,000 meaningful, mechanically valid authored/composable room configurations**. Cosmetic recolors alone do not count. Revisit/explore previously cleared rooms without unexpected reset.

## 12. Nine Realms and Chapter Structure

- **Midgard:** Burial halls, forest ruins, corrupted humans and draugr.
- **Niflheim:** Glacial caves, fog, ice hazards, frost beings.
- **Svartalfheim:** Dwarven forges, mechanical traps, molten channels, constructs.
- **Alfheim:** Enchanted light, bright but dangerous forest magic, deceptive beauty.
- **Vanaheim:** Ancient groves, living roots, sacred nature spirits.
- **Jötunheim:** Mountains, giant architecture, immense monsters and arenas.
- **Muspelheim:** Lava, living fire, volcanic ruins, aggressive elemental encounters.
- **Helheim:** Necromancy, spectral flames, decay, afterlife bargains.
- **Asgard:** Shattered gold halls, celestial guardians, broken divinity.

Run structure is branching rather than a literal linear tour through nine worlds. Floor variants have different room pools, enemies, secrets, rewards, hazards, and bosses. Typical route progresses through burial realms, frozen or underground variants, deep roots, and either divine or underworld branches. Unlocks introduce progressively more difficult paths.

## 13. Seven Major Story Routes

1. **The Throne of Asgard:** Divine ascent, celestial guardians, Odin's absence and hidden history.
2. **Hel's Dominion:** Death/covenant route and dramatic Hel confrontation.
3. **The Serpent's Coil:** Hidden route inside the World Serpent's domain; poison, living geometry, Jörmungandr battle.
4. **The Burning of Ragnarök:** Timed/conditional escalating apocalypse route and major mythological bosses.
5. **The Unwritten Fate:** Multi-floor artifact puzzle requiring strange reflection, sacrifice, pursuit, and forge events; fate-machine culmination.
6. **The Crown of Yggdrasil:** Reverse ascent and altered revisits with character memories, culminating in high divine confrontation.
7. **The First Thread:** Ultimate hidden route and full story revelation, gated by major progression and secret artifacts.

Also implement smaller conditional endings, route-specific item pools, optional timed boss rush, hidden post-boss encounter(s), special entrance rules, ending-specific unlocks, and character-specific completion records. Endings must be mechanically distinct experiences, not recolored final rooms.

## 14. Enemy and Boss Ecosystem

At least **250 distinct enemies** and **100 distinct boss encounters** with genuine behaviors. Enemy families include draugr, skeletons, cursed warriors, specters, corrupted elves, wolves, roots, serpents, insects, trolls, Jötnar, dwarven machines, Valkyrie shades, and fire/frost beings. AI classes include pursuers, chargers, predictive projectile users, teleporters, burrowers, splitters, summoners, healers, obstacle manipulators, reflectors, status specialists, and multi-phase enemies.

Champions vary speed, health, attacks, element, death effects, rewards, or behavior. Bosses need recognizable anticipation, dodgeable patterns, phase transitions, original art and music, and clear reward flow.

Illustrative original encounters: Barrow King, Frostbound Jötunn, Forge Warden, Valkyrie of Broken Oaths, Nidhogg, Fenrir, Jörmungandr, Surtr, Hel, Odin's Echo, and the First Norn. Extreme optional bosses must remain readable and fair even with complex relic effects.

## 15. Risk, Reward, Merchants, and Special Rooms

- **Divine favor:** Eligibility and item chances influenced by meaningful run conditions; distinctive defensive and celestial powers.
- **Jötunn covenants:** Sacrifice health, future freedoms, resources, or other advantages for powerful immediate rewards.
- **Sacrifice altars:** Escalating damage/reward ladder with rare portals and encounters.
- **Gambling chambers:** Several chance-based minigames with meaningful costs and payouts.
- **Beggars/wanderers:** Request resources and can provide rewards, services, danger, or information.
- **Rune reversal/Wyrd rooms:** Reroll items, rewards, rooms, pickups, probabilities, or entire floor configurations under clearly defined rules.
- **Shops:** Merchants, donation progression, variable price, restocking, and special wares.

This set of choices must meaningfully alter the player's build trajectory and available paths.

## 16. Item Pools, Rerolls, and Reality Effects

Separate weighted pools for standard treasure, boss, shops, divine and covenant offers, secret/super-secret, libraries, cursed rooms, chests, challenges, route-specific rewards, special characters, transformations, and wave mode. Implement eligibility, unlocks, quality weighting, exclusions, pool depletion when appropriate, and determinism.

Effects may reroll unclaimed pedestals, individual held items, all items, room rewards, pickups, rooms, floor generation, and future probabilities; may duplicate choices or change reward pools. Reroll outcomes must respect actual pool rules and preserve the save state consistently.

## 17. Transformations

At least **20 original mechanical transformations** triggered by thematic relic sets or rare events. Examples: Fenrir's Kin (wolves), Valkyrie's Ascension (flight), Child of Muspelheim (fire), Draugr Sovereign (death powers), Jötunn Awakened (terrain breaking), Ravenborn (information/familiars), World Serpent's Blood (poison chains), All-Seeing (prophecy), Runic Construct (automated defense), and Unbound Soul (spectral movement). Include conflicts/merges, temporary transformations, and one-time evolutions where appropriate. All have visible form changes and rules-based effects.

## 18. Floor Curses, Blessings, and Special Conditions

Implement Curse of the Veil (hidden map), Forgotten Names (item identification), Endless Night (visibility), Wandering Paths (uncertain connections), Hollow Heart (health uncertainty), Twin Roots (expanded chapter), Forsaken (riskier rewards), and additional curses. Positive blessings and uncommon realm modifiers also exist. Curse lifetimes, eligibility, and compatibility must be rigorously tested.

## 19. Challenges, Speed Events, and Secrets

Include **Einherjar Gauntlet** timed boss rush, **Drowned Vault** hidden time-sensitive branch, **Hunt of the Wild** hunter chase, rare Fate Distortions, and at least **40 special challenge configurations** with unusual starting builds or rules. Rewards permanently expand available content.

Hundreds of secrets should include bombable patterns, hidden inscriptions, item combinations, sacrifice ladders, rare events, alternate bosses/variants, route gates, environmental puzzles, character conditions, and unexpected item-pool interactions. Secrets are intentional, reproducible, discoverable, and not mere exploits.

## 20. Hoard Trials — Secondary Wave/Economy Mode

A separate **Hoard Trials** mode with timed waves, dedicated arena flow, combat triggers, merchants between waves, evolving difficulty, resource management, optional hard waves, unique bosses, and a showdown with **Fáfnir, the Hoard-Cursed Dragon**. The advanced **Forsaken Hoard** mode adds tougher waves, tighter decisions, and boss escalation. A persistent **Wyrd Well** donation system unlocks items, characters, and other permanent content. Track character-specific completion marks independently of regular mode.

## 21. Progression, Records, and Codex

Permanent unlocks: 34 character variants, relics, talismans, runes, brews/scrolls, room pools, boss variants, routes, challenges, abilities, modes, special endings, and cosmetics. Each character tracks completion of major bosses/routes, plus normal vs hard distinctions where appropriate. Broad completion achievements require substantial exploration, mastery, and use of multiple characters.

Saga Codex tracks discovered and obtained items, enemies seen/defeated, bosses, endings, challenges, run stats, deaths, wins, streaks, time played, secrets, transformations, and lore. Conceal undiscovered secrets until earned. Never replace genuine unlock systems with empty progress bars.

## 22. Game Modes

1. **Standard** — core experience.
2. **Forsaken** — demanding hard difficulty with altered enemies/resources.
3. **Hoard Trials** — timed waves and item-shop economy.
4. **Forsaken Hoard** — advanced wave mode.
5. **Daily Saga** — deterministic daily seed and locally verifiable scoring.
6. **Custom Seed** — reproduce runs, generally without normal progression rewards.
7. **Challenge Trials** — curated special scenarios.
8. **Local Cooperative Play** — up to four independent characters on verified supported inputs; no claim of network co-op.

No remote multiplayer server or cloud leaderboard is required for v1.0 on GitHub Pages. Any optional future network capability must be honestly scoped, free if retained under project constraints, and separately approved.

## 23. Cooperative Rules

Players have independent movement, attacks, health, active items, and builds; selected currencies/keys/bombs may be shared according to explicit rules. Implement synchronized room movement, multiplayer enemy scaling, boss difficulty, death/ghost/revival behavior, loot allocation, character-specific interactions, and correct UI/input routing. Mobile touch alone should prioritize the primary single-player player; multiplayer on supported devices may rely on controllers. Do not crowd four simultaneous virtual twin-stick control schemes onto one iPhone.

## 24. UI and Presentation Requirements

Main menu: Continue, New Run, Character Selection, Modes, Challenges, Saga Codex, Completion Records, Settings. Gameplay: health varieties, resources, active charge, talisman, held consumable, map, floor identification, time, and status effects; detailed information belongs in pause/inventory. Character selection: unique visuals and clear mechanics. Death: seed, floor, cause, relics, progression, run statistics, restart.

**All persistent HUD and virtual controls belong outside the active gameplay canvas. No translucent joystick over an enemy, no hovering bomb button in the arena, no minimap obscuring projectiles, no pause/settings button placed over a room.** The locked UI specification defines precise regions, tests, and art acceptance.

Menus should look like Norse artifacts and remain legible; never allow the visual motif to produce clutter or inaccessible controls.

## 25. Architecture and Testing

Separate rendering, fixed-timestep simulation, input, character movement, projectile and collision, damage and health, items and modifiers, event/synergy dispatch, familiars, AI, bosses, floor graphs, room generation, obstacles, pools, pickups, merchants, transformations, routes, unlocks, saves, UI, animation, audio, challenges, daily runs, cooperative play, and performance instrumentation.

Provide tools/tests for item spawning, boss/room spawning, seeded replay, encounter clearing, high-item-count stress testing, content registry validation, room connectivity, save migration, completion unlocks, and rare character rules. Development-only tools cannot grant authentic completion records. Document actual tests and distinguish simulated, automated, and real-device verification.

### Quality gates

- Responsive twin-stick control, with no controls or HUD inside the gameplay rectangle.
- No unfair hidden attacks created by camera/UI crop.
- Valid room connectivity and boss reachability.
- Every relic and character has a real, verified effect.
- Save state survives normal updates and supports export/import.
- Complex synergies do not crash or silently deactivate.
- All ending gates, challenges, and completion marks function.
- Distinct realm artwork and combat-readable boss telegraphs.
- Real mobile device checks at approval milestones.

## 26. Release Philosophy

The complete staged implementation is specified in `ROADMAP.md` for **v0.01 through v1.0**. A version label is a checkpoint, not proof of work. No phase advances until it meets its acceptance requirements and designated player approval gates. Maintain `CHANGELOG.md`, verified counts in `CONTENT_LEDGER.md`, and release status in `RELEASE_STATUS.md` as the repository evolves.

**Final standard:** a polished, remarkably deep, replayable, Norse-themed original action roguelike, mechanically expansive in the spirit of Repentance, with no obscured mobile gameplay and free GitHub Pages delivery.