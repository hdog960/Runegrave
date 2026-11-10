import { ROADMAP_VERSION, APP_VERSION } from './core/version.js';
import { mountStage } from './scene/stage.js';
import { TwinStickControls } from './input/twinStick.js';
import { preparePwa } from './platform/pwa.js';
import { PLANNED_REALMS } from './content/realmCatalog.js';
// v0.05 deterministic physical collision prototype; no enemy combat or damage yet.
const version = document.querySelector('[data-release]');
if (version)
    version.textContent = `${ROADMAP_VERSION} · PHYSICS TRIAL`;
const canvas = document.querySelector('#gameplay-canvas');
if (!canvas)
    throw new Error('Missing center-only game canvas');
let stage;
const controls = new TwinStickControls(paused => stage?.setPaused(paused));
stage = mountStage(canvas, () => controls.snapshot);
document.documentElement.dataset.version = APP_VERSION;
document.documentElement.dataset.plannedRealms = String(PLANNED_REALMS.length);
window.addEventListener('pageshow', () => { stage?.resize(); controls.refreshStatus(); });
void preparePwa();
