# Test Matrix — Evidence, Not Assumptions

Run `npm ci && npm test` (Node.js 22) for build + foundation checks. Local initial authoring also ran `npm test` using locally available TypeScript 5.8.3; six tests passed. CI workflows are provided but GitHub Actions and Pages status require independent confirmation.

| Check | v0.01 local evidence | Real iPhone evidence |
|---|---|---|
| TypeScript build / relative site output | pass | not tested |
| Stable unique content IDs | pass | n/a |
| Reproducible seeded streams | pass | n/a |
| Nine planned realm metadata entries | pass | n/a |
| Gate constants and accurate v0.01 label | pass | n/a |
| Three-region controls with zero overlap | not implemented until v0.02–0.03 | not tested |
| Live combat and pause / restart | not implemented until v0.05–0.09 | not tested |
| Installed PWA / offline / Home Screen updates | not implemented until v0.02+ | not tested |
| GitHub Pages public deployment | configured workflow, verification pending | not tested |

Do not report GitHub Pages deployment or visual device acceptance from a local build. Later phases add browser DOM geometry checks and physical iPhone testing.


## v0.02 regression and geometry audit — 2026-11-09

- `npm test`: 9/9 PASS (compiled TypeScript output, seed determinism, content IDs, version/gates, correct manifest/PNG sizes, cache precache, stage camera aspect).
- `npm run typecheck`: PASS (strict TypeScript).
- Headless Chromium **in-memory** render audit via `python scripts/browser_audit.py`: no script exceptions; zero intersections of the canvas bounding rectangle with either control grip, controller-disc, button, header, footer, or other persistent HUD region; measured viewport and canvas match. Tested 667×375, 760×360, 844×390, 932×430 landscape and 390×844 portrait (rotate display replaces gameplay).
- This in-memory test is not a network HTTP load and cannot validate service worker registration, cached offline loading, or GitHub Pages publication. Browser navigation to local and public URLs returned `ERR_BLOCKED_BY_ADMINISTRATOR`; physical Safari and Home Screen tests remain pending.
- Original screenshot artifacts from browser audit were inspected manually for clipping, text legibility, and genuine three-region separation; **not** player art approval.

## v0.03 input and overlap audit — 2026-11-09

- `npm ci` (locked TypeScript 5.8.3), `npm run typecheck`, `npm test`: strict compile and **13/13** Node tests pass. These include source content IDs, PRNG seeds, original PWA manifest/icon dimensions, relative cache paths, canvas dimensions, dead-zone normalization, diagonal keyboard vectors, configuration bounds, and paused-only update UI.
- `python scripts/input_browser_audit.py`: local **in-memory** headless Chromium session at CSS dimensions **667×375, 760×360, 844×390, 932×430**, and portrait **390×844**. All PASS: two independent pointer IDs in opposite grips, avatar movement and visible training bolts, movement release leaving firing active, pointer cancel stopping firing, keyboard movement, blur reset, pausing freezing stage state, left-hand swap and settings persistence, exact canvas/frame rectangle equality, and zero grip/HUD/pause-button intersections with active canvas. No uncaught page errors.
- Browser screenshots captured and inspected; no claim of real iPhone device validation, manual two-thumb ergonomics, physical Safari `setPointerCapture` testing, or offline install verification.
- **Live v0.02 Pages verification:** fetched `https://hdog960.github.io/Runegrave/`, `manifest.webmanifest`, and `js/main.js` successfully with correct v0.02 content and no HTTP retrieval errors using an external page-fetch tool. This proves those resources were available publicly before v0.03, but **not** current v0.03 deployment, installed Home Screen behavior, or GitHub Actions status.

## v0.04 art/camera browser audit — 2026-11-09

- Compiled with `npm run build`, verified `npm run typecheck`; `npm test`: **16/16 PASS**, including three art/camera/PWA tests.
- In-memory headless Chromium via `python scripts/input_browser_audit.py`: **667×375, 760×360, 844×390, 932×430** landscape and **390×844** portrait PASS. The audit tests input dual-pointer capture/release, keyboard fallback and blur clearing, pausing, left-handed swapping, saved input preferences, zero canvas/HUD intersections, exact canvas/frame rectangle equality, measured camera aspect ratio and in-session viewport resize. Screenshots captured for manual art review.
- The new scenic renderer completed without JavaScript exceptions at all browser dimensions. The UI footer engraving was corrected after the first visual review to avoid crowding at narrow screen sizes.
- Browser navigation to localhost is blocked by the test container (ERR_BLOCKED_BY_ADMINISTRATOR), so real HTTP/service-worker offline lifecycle testing was **not possible locally**. `npm ci --offline` likewise could not install the uncached TypeScript tarball; the installed TypeScript compiler compiled and type-checked successfully. These environment limitations must not be described as passing.
- **Physical iPhone Safari/Home Screen, two-thumb ergonomics and user visual approval NOT YET VERIFIED.** v0.04 screenshot shown as a prototype for feedback, not Gate A approval.
