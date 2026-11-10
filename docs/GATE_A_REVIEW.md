## v0.09.7 — Gate A visual comparison (NOT APPROVED)

Review the updated Wayfarer facing/recoil frames, all seven enemy attack gestures, five room-border materials, engraved physical doorway arrows and tactile grip response at real iPhone landscape sizes. These changes improve comprehension but do **not** count as player approval, natural unaided play, or validation of a finished premium-art standard. Continue refining within v0.09 until the player explicitly approves Gate A; **v0.10 is blocked**.

## v0.09.6 — Player Gate A visual and control review (NOT APPROVED)

Use the live Pages build in landscape. In an uncleared room, an enemy attack warning now has 0–3 discrete illuminated beats that fill as the strike becomes imminent, not just a color change. In a cleared room, collect the mandatory gold relic: each of the eight upgrade types has its own silhouette and a named RELIC inscription attached to its pedestal. The previous before/after stat card still opens when picked up.

On a touch phone, verify that the two grips are comfortable and separate from the center canvas; the touch pads are modestly enlarged only within the left/right rails. Check the red barred doorway and green open passage, north/west/south/east destinations, and glowing floor path. Art quality, warning readability, reward identity, user experience and real iPhone FPS must be personally assessed. Do **not** begin v0.10 until explicitly approved.

## v0.09.5 — Additional inspection request (GATE A STILL UNAPPROVED)

On the real iPhone in landscape, compare the upper wall and floor identity of at least **Ash, Iron, Root, Spirit and Fate** chambers. Look for distinct furnace, gear, root, ghostglass and loom shapes rather than just another recolored stone floor. During combat, look for the draugr's raised axe, the archer's drawn bow, the charger's hot horns and the Warden's crown and attack warning. Attack labels and arrows should be readable **before** the strike and never go under either controller grip.

Check the real LOCKED gate for crossbars and an inaccessible state; after clearing the fight *and* claiming the golden relic, the open gate should show bright depth and small stone steps aligned with the north/south/east/west approach. Drag both thumb discs at once; the small indicator above each grip should show your direction and return to the center dot when you release. These are actual in-game presentation changes in v0.09.5, not changes to enemy balance or the route.

**Still required from the player:** Is the original Norse visual bar genuinely acceptable? Can you recognize enemies, entrances and relic effects instantly? Is two-thumb iPhone movement/aim comfortable? None of the automated checks, screenshots or GitHub deployments counts as explicit Gate A approval. **Do not start v0.10.**

## v0.09.4 — Additional player-inspection criteria (approval still pending)

Inspect the actual iPhone landscape build. Compare at least two of the five family settings for distinct floor materials and motifs, check one archer/charger warning for its readable projected danger lane, and open **PAUSE → THREAT RUNES** if the enemy patterns are unclear. After clearing and claiming a relic, the green waystones should lead from your current position to the signed door; red LOCKED doors must never pretend to be usable. Try moving/aiming simultaneously while checking heart, objective and relic readouts in the outer grips only.

The software optimizations reduce repeated DOM updates in Chromium but **do not prove better FPS or mobile thermals**. **No Gate A approval has been given.** Keep v0.10 locked. Report confusion, clutter, legibility, actual thumb comfort, and art issues for further v0.09 changes.

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
6. Open the **relic ledger while paused** to inspect your acquired bonuses. Complete all eight rooms to face the two-phase Rootbound Warden, then take the final northward exit. Death restarts an entirely new run and loses all run relics/currency, but **saved input preferences survive**.
7. Specifically judge **visual identity** (premium original Norse handheld), combat visibility and sprite clarity, legibility at native iPhone landscape resolution, no overlapping controls or HUD, and **real two-thumb ergonomic comfort**. Report clipping, lag or accidental input with screenshots.

## Scope honesty

- 25 = authored, tested encounter configurations, **not** 25 separate rooms on every run and **not** the future v0.10 seeded floor-graph algorithm. Eight are selected in each mini-run, with a ninth boss chamber. Every catalog configuration is accessible across different seeded runs.
- Eight functioning relics are earned as pickups in successive rooms. The initial silver currency is collected but cannot yet be spent; stores/keys/bombs and sophisticated inventory are scheduled later. This milestone has only Mortal Hearts.
- Tests use desktop/headless Chromium and a controlled room-clear harness; this **does not** count as physical iPhone Safari testing, standalone offline functionality, a human unaided win, or artistic approval.
- v1.0 targets in the Design Bible (750 relics, 150 talismans, 34 character variants, 250 enemies, 100 bosses, 5,000 meaningful rooms and all other required systems) are unchanged.

**Gate A decision:** Pending. Advance to v0.10 only on explicit player approval. If rejected, refine v0.09 in further development passes and re-present it for inspection.
