import { ROADMAP_VERSION, APP_VERSION } from './core/version.js';
import { mountStage } from './scene/stage.js';
import { TwinStickControls } from './input/twinStick.js';
import { preparePwa } from './platform/pwa.js';
import { installFirstRunGuide } from './platform/firstRunGuide.js';
import { installRelicDiscovery } from './platform/relicDiscovery.js';
import { PLANNED_REALMS } from './content/realmCatalog.js';

// v0.09: 25 verified room configurations, eight functioning relic pickups and a connected first-soul mini-run.
const version=document.querySelector<HTMLElement>('[data-release]');
if(version)version.textContent=`${ROADMAP_VERSION} · GATE A PROTOTYPE`;
const canvas=document.querySelector<HTMLCanvasElement>('#gameplay-canvas');
if(!canvas)throw new Error('Missing center-only game canvas');
let stage:ReturnType<typeof mountStage>|undefined;
const controls=new TwinStickControls(paused=>stage?.setPaused(paused));
stage=mountStage(canvas,()=>controls.snapshot,()=>controls.setDead(true));
installFirstRunGuide(controls);
installRelicDiscovery(controls);
document.querySelector<HTMLButtonElement>('#trial-new-run-btn')?.addEventListener('click',()=>{if(stage?.restart())controls.setDead(false);});
document.querySelector<HTMLButtonElement>('#restart-btn')?.addEventListener('click',()=>{
  if(stage?.restart())controls.setDead(false);
});
window.addEventListener('keydown',event=>{
  if(event.key.toLowerCase()==='r'&&(stage?.getHealth().dead||stage?.isComplete())&&!(event.target as HTMLElement)?.matches('button,input')){
    event.preventDefault();if(stage.restart())controls.setDead(false);
  }
});
document.documentElement.dataset.version=APP_VERSION;
document.documentElement.dataset.plannedRealms=String(PLANNED_REALMS.length);
window.addEventListener('pageshow',()=>{stage?.resize();controls.refreshStatus();});
void preparePwa();
