# v0.09 — Gate A: Player Visual and Control Review

**Status:** AWAITING EXPLICIT PLAYER APPROVAL. This review does not approve itself. **v0.10 must not begin until the player explicitly accepts the visual and controller standard.**

## What to inspect on the actual iPhone

1. Open the [GitHub Pages game](https://hdog960.github.io/Runegrave/) in Safari; rotate to landscape. For Home Screen, use Safari Share → Add to Home Screen and launch the resulting icon. If an older offline copy appears, pause and use **UPDATE** when offered; do not refresh an active run without choosing to do so.
2. Check the three *physically separate* regions: left engraved movement grip; center unobstructed combat canvas; right engraved aim/fire grip. Touch controls and persistent HUD must not obscure the center, and room warnings should be entirely inside camera view. Check safe areas, pauses, action button reach and legibility.
3. Move with the **left rune disc**, aim/fire continuously with the **right rune disc**. Compare walking, aiming, dodging and firing simultaneously, portrait rotation, pause/resume, handedness, controller-size and dead-zone preferences.
4. In the antechamber, test breakable Soulbolt targets, ember hazards and the healing shrine. Enter the glowing eastern gate. Each of **eight connected chambers** is chosen deterministically from **25 distinct authored enemy configurations**. Clear enemies, walk over the golden relic sigil to bind it and open the next exit; silver and heart pickups are optional.
5. Open the **relic ledger while paused** to inspect your acquired bonuses. Complete all eight rooms to face the two-phase Rootbound Warden, then take the final eastern exit. Death restarts an entirely new run and loses all run relics/currency, but **saved input preferences survive**.
6. Specifically judge **visual identity** (premium original Norse handheld), combat visibility and sprite clarity, legibility at native iPhone landscape resolution, no overlapping controls or HUD, and **real two-thumb ergonomic comfort**. Report clipping, lag or accidental input with screenshots.

## Scope honesty

- 25 = authored, tested encounter configurations, **not** 25 separate rooms on every run and **not** the future v0.10 seeded floor-graph algorithm. Eight are selected in each mini-run, with a ninth boss chamber. Every catalog configuration is accessible across different seeded runs.
- Eight functioning relics are earned as pickups in successive rooms. The initial silver currency is collected but cannot yet be spent; stores/keys/bombs and sophisticated inventory are scheduled later. This milestone has only Mortal Hearts.
- Tests use desktop/headless Chromium and a controlled room-clear harness; this **does not** count as physical iPhone Safari testing, standalone offline functionality, a human unaided win, or artistic approval.
- v1.0 targets in the Design Bible (750 relics, 150 talismans, 34 character variants, 250 enemies, 100 bosses, 5,000 meaningful rooms and all other required systems) are unchanged.

**Gate A decision:** Pending. Advance to v0.10 only on explicit player approval. If rejected, refine v0.09 in further development passes and re-present it for inspection.
