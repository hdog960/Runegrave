# RUNEGRAVE — Verified Release Status

**Date:** 2026-11-09

**Verified repository baseline before this release:** `61d6098296718ed9fe61c46a43f24af4835b730e` on `main` (v0.01, documentation and technical foundation).

**Active roadmap milestone:** **v0.02 — Pages/PWA and segmented screen shell**.

## Implemented and locally checked

- Real three-region landscape layout: original dark ash-and-iron **left and right Norse rune grips**, a physically separate central renderer, and HUD entirely in non-canvas strips/insets.
- Responsive measured canvas renderer and original **decorative, noninteractive** Midgard burial-hall scene; preview only, *no enemies, combat, movement, or runs*.
- A user-friendly portrait rotate screen, safe-area responsive sizing, scroll/selection suppression, and explicit compact-device warning.
- Real static PWA manifest with relative project paths, Apple Home Screen metadata, original 180/192/512 PNG icons, and a versioned service worker. Service worker precaches runtime modules, serves cached assets offline and does **not** force an in-progress game to update; a waiting update needs an explicit press.
- Both GitHub Actions Pages artifact deployment workflow and compiled static asset files mirrored to repository root (for repositories configured to publish from `main/(root)`). A Pages source setting is still necessary and cannot be inferred from source files.
- Local `npm test`: **9/9 tests PASS**; `npm run typecheck`: **PASS**. Local in-memory Chromium DOM/canvas test: 4 landscape viewports (667×375, 760×360, 844×390, 932×430) and portrait (390×844); **no script errors, zero DOM-control/HUD intersections, and stage equals center frame**. Browser network navigation is blocked in the tool environment, so service-worker live offline test was **NOT performed**.

## Not verified; do not promote this milestone to fully approved or deployed

- **Public Pages endpoint:** `https://hdog960.github.io/Runegrave/` — inaccessible to the current verification tools. **NOT VERIFIED**; repository Pages settings and Actions publication result cannot be inspected from these tools.
- **iPhone Safari / installed Home Screen:** NOT TESTED on a physical iPhone; App Store installation is not applicable.
- **Playability:** NOT YET PLAYABLE; no playable content registered (relics 0, characters 0, enemies 0, bosses 0, rooms 0). Nine realm IDs are planning metadata, not playable locations.
- **Player art approval:** NOT REQUESTED until the locked v0.09 Gate A; no approval gates altered.

**Release status:** v0.02 code IMPLEMENTED; automated TESTED and local browser geometry TESTED. GitHub `main` commit must be verified after push; **DEPLOYMENT/PWA DEVICE APPROVAL OPEN**.

**Next:** Confirm Pages publishing source and endpoint if possible, then v0.03 dedicated-rail simultaneous touch/aim and cancellation controls. Do not compromise zero-overlap rule or mark controls usable prematurely.

## Post-commit GitHub verification

- **v0.02 implementation commit:** [`983e005a2572727f1a5ec6be2e2b4e6b18cd442d`](https://github.com/hdog960/Runegrave/commit/983e005a2572727f1a5ec6be2e2b4e6b18cd442d), confirmed as the head of `main` on 2026-11-09.
- GitHub repository reads confirmed compiled `js/main.js`, source renderer, service worker, manifest, and `.nojekyll` on `main`.
- GitHub's commit status endpoint reported no status entries; the available workflow-runs method reports only PR-triggered runs, so it cannot determine the Pages deployment result.
- Publication still requires the repository's Pages source to be configured (GitHub Actions workflow, or `main/(root)` for the mirrored static output). Actual live deployment and iPhone install remain **UNVERIFIED**.
