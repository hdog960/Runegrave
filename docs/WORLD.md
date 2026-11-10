# World and Routes — Development Register

`src/content/realmCatalog.ts` records **nine planned names and stable IDs only**: Midgard, Niflheim, Svartalfheim, Alfheim, Vanaheim, Jötunheim, Muspelheim, Helheim, Asgard. **0 floors, 0 rooms, 0 bosses and 0 endings are implemented at v0.01.** The seven planned routes, chapter pacing, floor families, branching, and secrets remain authoritative in [DESIGN_BIBLE.md](DESIGN_BIBLE.md) §§12–13 and [ROADMAP.md](ROADMAP.md).

## v0.09 connected curated First Soul prototype

`src/run/firstSoul.ts` defines **25 authored valid combat-room encounter configurations**, each with an original title, rune, five-family palette identity, specific hostile lineup, optional two-wave structure, and deterministic difficulty strength. A seeded curated selector chooses **eight unique rooms** for a single connected run, then the Rootbound Warden boss. All 25 are accessible across alternative run seeds; this is **not** a full 25-node navigable graph or v0.10 randomized floor graph, which is deferred per roadmap. Each candidate has valid enemy spawning, room geometry, a physically connected eastern exit and collectible placement eligibility tested across camera heights. Only Midgard's Rootvault interior is implemented; no other realms or story endings are credited.
