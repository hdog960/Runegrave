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
