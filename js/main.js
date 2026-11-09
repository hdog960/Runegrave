import { ROADMAP_VERSION, APP_VERSION } from './core/version.js';
import { mountStage } from './scene/stage.js';
import { preparePwa } from './platform/pwa.js';
import { PLANNED_REALMS } from './content/realmCatalog.js';
// v0.02: real segmented display/camera + installable offline shell; gameplay begins later.
const version = document.querySelector('[data-release]');
if (version)
    version.textContent = `${ROADMAP_VERSION} · SHELL`;
const canvas = document.querySelector('#gameplay-canvas');
if (!canvas)
    throw new Error('Missing central combat canvas');
const stage = mountStage(canvas);
document.documentElement.dataset.version = APP_VERSION;
document.documentElement.dataset.plannedRealms = String(PLANNED_REALMS.length);
window.addEventListener('pageshow', () => stage.resize());
void preparePwa();
