## Current release: v0.09.11 — Five distinct Norse foundations (Gate A awaiting approval)

The first playable Gate A build now paints ASH/IRON/ROOT/SPIRIT/FATE with different underlying wall and floor masonry and family-specific side installations, plus original Wayfarer and enemy accessory art. The 25 authored configurations, eight real relics, eight-chamber Warden mini-run, split handheld thumb grips, saved controller settings and PWA are preserved. The full 116-test local suite passes. See `docs/RELEASE_STATUS.md` for separate verified deployment information. Gate A is not yet approved; **v0.10 is locked**.

## Gate A v0.09.10 — distinct carved chambers and a live combat threat grip

This playable first-soul prototype has 25 authored configurations and eight real relics in a connected mini-run, six hostile archetypes and one Rootbound Warden boss. The new `.threat-strip` sits **outside** the center canvas, above the left movement disc, and shows only real encounter-state/urgent-warning/boss-HP information; it cannot intercept touches. The world masonry has new room-specific incised reliefs, replacing previous higher-cost trim. All preexisting combat, health, entrances, saved input preferences and safe-update PWA continue to function. `npm test`: 110/110 PASS. Detailed test qualifications and unapproved visual gate: `docs/TESTING.md`, `docs/GATE_A_REVIEW.md`, `docs/RELEASE_STATUS.md`.

# Runegrave: The Ninefold Descent

An original Norse-mythology, iPhone-first action roguelike, planned for GitHub Pages.

## Documentation — Start Here

**[Read the complete RUNEGRAVE project handoff](docs/README_START_HERE.md)**

- [Official Game Design Bible](docs/DESIGN_BIBLE.md)
- [Full v0.01–v1.0 development roadmap](docs/ROADMAP.md)
- [Mandatory Norse-themed mobile UI and controls specification](docs/UI_CONTROLS_AND_ART_DIRECTION.md)
- [Handheld controller layout — unobstructed gameplay](docs/HANDHELD_CONTROLLER_LAYOUT.md)
- [Instructions for a new development chat](docs/NEW_CHAT_HANDOFF_PROMPT.txt)
- [Release status and verification template](docs/RELEASE_STATUS_TEMPLATE.md)

**The gameplay viewport must be completely unobstructed.** The iPhone in landscape has Norse-styled controller grips to the left and right of the centered game view, never translucent virtual sticks laid on top of the action.

**Project constraints:** GitHub + GitHub Pages; iPhone Safari/Home Screen; no required paid hosting or services; no Codex, ChatGPT Work, or Vercel.

**Important:** These documents define the proposed game and roadmap. The version numbers and content targets are *plans*, not verified implementation. Development and deployment status must always be checked against the repository.

## Development baseline

- **Current development milestone:** v0.09 — first connected mini-run, 25 authored valid encounter configurations, eight genuinely functional relics, silver/healing pickups, existing six hostile types and Rootbound Warden boss. Implementation tested locally; deployment and approval status are recorded separately in the release ledger.
- [Verified release status](docs/RELEASE_STATUS.md) · [Change log](docs/CHANGELOG.md) · [Content ledger](docs/CONTENT_LEDGER.md)
- Local build: `npm ci && npm test`; static site output: `dist/`.
- **STOP:** v0.09 **Gate A awaits explicit player visual and control approval**. Do not start v0.10 before approval. [Gate A review instructions](docs/GATE_A_REVIEW.md).

Implementation and deployment claims must match evidence in the release ledger; the full original roadmap remains locked.

## Gate A clarity patch — v0.09.1

After the first Gate A review, the player reported they could not tell what was happening. v0.09.1 introduces a first-launch **How to Play** tutorial, a Pause → How to Play replay action, and readable step-by-step footer objectives with no overlay during active play. **Gate A remains awaiting explicit player approval; do not advance to v0.10.** See [Gate A review](docs/GATE_A_REVIEW.md).

### Gate A usability refinement — v0.09.2

After player feedback, exit doors now show signed red LOCKED / green EXIT states and vary north/west/south/east across the curated mini-run. Each collected relic pauses to explain its exact active bonus; a permanent right-rail effect label and item pickup feedback remain visible outside the world. **Still v0.09; Gate A awaits explicit player approval; v0.10 remains locked.**

### Gate A readability/art polish — v0.09.5

v0.09.5 adds five unique Norse upper-wall landmarks, individual enemy sprite poses and camera-clamped attack warnings, physically stepped door approaches, and grip-only eight-direction thumb feedback. This remains Gate A visual/control work only: no v0.10 branching-floor development or claimed approval.

The marked red/green Norse stone doors are now framed and inset so side-edge labels remain fully visible. After both room-clear and mandatory relic collection, green carved floor waystones trace a verified collision-connected path toward the exit. Enemies visibly announce their distinct attack while winding up (with red imminent warnings). Relic cards now show actual applied **before → after** stats and the thumb-discs light up when held. No persistent overlay moves into the combat viewport. **Gate A remains unapproved; v0.10 is not started.**

### Gate A collectible and attack readability — v0.09.6

Eight hand-drawn relic emblems now make different upgrade pickups distinguishable *before* collection, with a short ``RELIC · TYPE`` world-space label. Enemy windups display three visible warning beats instead of only changing outline color; the labels remain confined to the center camera, including at compact iPhone dimensions. Coarse-touch screens receive slightly larger thumb-discs **only inside the separate Norse side grips**. All are presentation refinements within locked v0.09; no enemy damage/timing, relic effects, inventory, 25-room catalog or v0.10 procedural progression changed.

### Gate A polish — v0.09.8 (hit/reward clarity and five original floor reliefs; awaiting player review)

Real damage/wound/pickup readouts now respond only to actual fixed-step combat events, plus a short held-fire facing arrow. Five unique family reliefs replace earlier repetitive floor trim while retaining the existing mobile draw-cost budget. Open Norse doors have pulled-apart stone leaves. All mechanics/25 room configurations/eight relics/independent side grips/setting key/PWA remain preserved. **Gate A is unapproved, and v0.10 remains locked.**

### Gate A polish — v0.09.7 (art and clarity; awaiting player review)

Latest local work improves 8-direction Wayfarer silhouettes, all seven enemy gesture signatures, five authentic chamber-floor trims, engraved physical doorway arrows and pressed rune-disc feedback. No mechanics or progression changes. The 25 authored encounter configurations, eight functional relics and entire eight-chamber Warden mini-run remain. The 7 canonical documents are unchanged; Gate A is still unapproved. See `docs/TESTING.md` and `docs/GATE_A_REVIEW.md`.

### Gate A v0.09.9 — 25 chamber coats-of-arms, real-event motion, mobile interruption safety

All 25 authored first-soul chamber configurations now have a distinct family-appropriate carved crest. Moving Wayfarers leave restrained footsteps and actually defeated enemies briefly dissolve; these world-space effects are capped, fixed-step aged and suppressed by reduced-motion settings. Backgrounding the app intentionally pauses the game and clears live sticks, requiring a Resume tap on return; coarse-touch Pause has a larger in-grip target. `runegrave:input:v1` preferences, core gameplay, 25 rooms, eight working relics, all canonical docs and PWA remain preserved. **This is still v0.09 Gate A, not v0.10, and the player has NOT approved the art or controls.**
