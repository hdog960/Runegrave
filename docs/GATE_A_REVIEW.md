# v0.09 — Gate A: Player Visual and Control Review

**Status:** AWAITING EXPLICIT PLAYER APPROVAL. This review does not approve itself. **v0.10 must not begin until the player explicitly accepts the visual and controller standard.**

## v0.09.1 — Player reported that the objective was unclear (Gate A NOT APPROVED)

The player explicitly could not tell what was happening in v0.09. This is an unresolved onboarding/clarity issue for **Gate A**, not art/control acceptance. A corrective subrelease adds a mandatory first-visit (and replayable from Pause) **How to Play** screen with three visible steps (MOVE, SHOOT, ADVANCE), a large Start button, safe paused simulation, and dynamic plain-English objectives outside the gameplay canvas. Do not advance to v0.10 unless the player actually tries the new build, understands room goals and controls, and explicitly approves the v0.09 art/control experience. The added browser checks do not substitute for actual iPhone feedback.

## v0.09.3 — Gate A additional legibility refinement (approval still pending)

- Distinct labeled enemy wind-up warning describes the upcoming attack while the enemy is preparing, with brighter red signals close to execution; check readability during actual play.
- Gold/green carved floor stones trace the physically traversable route to the exit **only when it unlocks**; the player can follow them without a permanently overlaid world arrow.
- Heavy original stone/ash doorway art has an explicit direction + LOCKED/EXIT sign and is inset at the world edge to avoid clipped labels.
- Relic acquisition compares the exact applied values before and after the upgrade (e.g. damage 2 → 3), and the side grip reflects the latest relic.
- Rune grips illuminate only while held, with no touch buttons on the central viewport.

Player evaluation still needed: Do attacks and doors read instantly at iPhone landscape size, are floor-waystones useful, do the real stat comparisons make relic impact clear, and are two-thumb controls comfortable? No approval is inferred from automated checks.

## v0.09.2 — Player feedback: doors, one-way pathing, and relic meaning (Gate A NOT APPROVED)

The player reported three concrete observations after v0.09.1: **doors did not read as doors**, **every step seemed to go right**, and **collecting items gave no visible explanation of their effect**. These are specific pending Gate A experience issues, not an approval.

Implemented and tested within v0.09:

- Each active exit is now painted as a **large original stone-and-brass doorway with an EXIT / LOCKED sign**, compass arrow and readable direction label; red when locked, green only when combat and the mandatory relic requirement are both complete. The status strip and right-hand rail name the current door direction.
- The **eight-chamber curated route now alternates north, west, south and east exit directions** (with an initially eastward practice doorway and a northward boss exit), all reachability-validated against the physical room floor; this removes the eight-times-right experience without claiming the full **v0.10 branching procedural floor graph**. This first playable is still a curated linear mini-run; branching begins after Gate A in v0.10.
- Collecting a relic **stops gameplay and shows an explicit RELIC ACQUIRED card** with the rune/name and exact active gameplay bonus. Tap GOT IT · CONTINUE. The right-hand grip persistently lists the latest relic and its effect; silver/healing pickups explain their outcome in that grip. Silver is unspendable this early and says so clearly.
- All explanatory panels appear only while the simulation is paused; no controller or HUD element covers active combat. Input settings/PWA/save schema unchanged.

Inspect on your real iPhone: Does a green EXIT doorway look like a passage and does red LOCKED accurately signal that a fight or relic remains? Do north/west/south exits appear obvious and reachable? Does collecting the first relic show its effect clearly, and is the continued reminder legible without moving your thumbs? **Gate A stays unapproved** until the player explicitly confirms art/control satisfaction.

## What to inspect on the actual iPhone

1. Open the [GitHub Pages game](https://hdog960.github.io/Runegrave/) in Safari; rotate to landscape. For Home Screen, use Safari Share → Add to Home Screen and launch the resulting icon. If an older offline copy appears, pause and use **UPDATE** when offered; do not refresh an active run without choosing to do so.
2. First read **HOW TO PLAY**, tap **I UNDERSTAND · START DESCENT**, then try the game. You can replay the explanation from **PAUSE → HOW TO PLAY**. Verify the lower status bar gives a clear next action: **ENTER THE EAST DOOR**, **DEFEAT ENEMIES**, **PICK UP GOLD RELIC**, or **ENTER NORTH/WEST/SOUTH/EAST DOOR**. If any instruction is still confusing, this Gate A issue is not solved.
3. Check the three *physically separate* regions: left engraved movement grip; center unobstructed combat canvas; right engraved aim/fire grip. Touch controls and persistent HUD must not obscure the center, and room warnings should be entirely inside camera view. Check safe areas, pauses, action button reach and legibility.
4. Move with the **left rune disc**, aim/fire continuously with the **right rune disc**. Compare walking, aiming, dodging and firing simultaneously, portrait rotation, pause/resume, handedness, controller-size and dead-zone preferences.
5. In the antechamber, test breakable Soulbolt targets, ember hazards and the healing shrine. Enter the glowing east entrance. Each of **eight connected chambers** is chosen deterministically from **25 distinct authored enemy configurations**. Clear enemies, walk over the golden relic sigil to bind it and open the next exit; silver and heart pickups are optional.
6. Open the **relic ledger while paused** to inspect your acquired bonuses. Complete all eight rooms to face the two-phase Rootbound Warden, then take the final eastern exit. Death restarts an entirely new run and loses all run relics/currency, but **saved input preferences survive**.
7. Specifically judge **visual identity** (premium original Norse handheld), combat visibility and sprite clarity, legibility at native iPhone landscape resolution, no overlapping controls or HUD, and **real two-thumb ergonomic comfort**. Report clipping, lag or accidental input with screenshots.

## Scope honesty

- 25 = authored, tested encounter configurations, **not** 25 separate rooms on every run and **not** the future v0.10 seeded floor-graph algorithm. Eight are selected in each mini-run, with a ninth boss chamber. Every catalog configuration is accessible across different seeded runs.
- Eight functioning relics are earned as pickups in successive rooms. The initial silver currency is collected but cannot yet be spent; stores/keys/bombs and sophisticated inventory are scheduled later. This milestone has only Mortal Hearts.
- Tests use desktop/headless Chromium and a controlled room-clear harness; this **does not** count as physical iPhone Safari testing, standalone offline functionality, a human unaided win, or artistic approval.
- v1.0 targets in the Design Bible (750 relics, 150 talismans, 34 character variants, 250 enemies, 100 bosses, 5,000 meaningful rooms and all other required systems) are unchanged.

**Gate A decision:** Pending. Advance to v0.10 only on explicit player approval. If rejected, refine v0.09 in further development passes and re-present it for inspection.
