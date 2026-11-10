import { ROADMAP_VERSION, APP_VERSION } from './core/version.js';
import { mountStage } from './scene/stage.js';
import { TwinStickControls } from './input/twinStick.js';
import { preparePwa } from './platform/pwa.js';
import { PLANNED_REALMS } from './content/realmCatalog.js';
// v0.07 Mortal Hearts and environmental damage training; hostile enemies arrive at v0.08.
const version = document.querySelector('[data-release]');
if (version)
    version.textContent = `${ROADMAP_VERSION} · MORTAL THREAD`;
const canvas = document.querySelector('#gameplay-canvas');
if (!canvas)
    throw new Error('Missing center-only game canvas');
let stage;
const controls = new TwinStickControls(paused => stage?.setPaused(paused));
stage = mountStage(canvas, () => controls.snapshot, () => controls.setDead(true));
document.querySelector('#restart-btn')?.addEventListener('click', () => {
    if (stage?.restart())
        controls.setDead(false);
});
window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r' && stage?.getHealth().dead && !event.target?.matches('button,input')) {
        event.preventDefault();
        if (stage.restart())
            controls.setDead(false);
    }
});
document.documentElement.dataset.version = APP_VERSION;
document.documentElement.dataset.plannedRealms = String(PLANNED_REALMS.length);
window.addEventListener('pageshow', () => { stage?.resize(); controls.refreshStatus(); });
void preparePwa();
