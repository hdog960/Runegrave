/** Gate A feedback: first-time guided entry and a short contextual objective, not a gameplay overlay.
 * The only guide overlay is visible while the fixed-step simulation is paused.
 */
import type { TwinStickControls } from '../input/twinStick.js';
import { EXIT_LABELS, type ExitDirection } from '../run/wayfinding.js';

export const GUIDE_SEEN_KEY = 'runegrave:guided-start:v1';
export type ObjectiveContext = Readonly<{
  mode:'practice'|'crypt'|'warden'|'complete';
  phase:string;alive:number;missingRelic:boolean;roomNumber:number;roomTotal:number;exitDirection?:ExitDirection;
}>;
export function objectiveText(s:ObjectiveContext):string {
  if(s.mode==='complete')return 'TRIAL CLEARED · RESTART TO PLAY AGAIN';
  if(s.mode==='practice')return 'ENTER THE GREEN EAST DOOR TO START';
  const door=EXIT_LABELS[s.exitDirection||'east'];
  if(s.phase==='gate') {
    if(s.missingRelic)return 'PICK UP THE GOLD RELIC TO OPEN THE EXIT';
    return s.mode==='warden'?`BOSS DEFEATED · ENTER ${door.label} EXIT`:`ENTER ${door.label} DOOR ${door.arrow} TO CONTINUE`;
  }
  if(s.mode==='warden')return 'BOSS: DODGE WARNINGS · FIRE BACK';
  return `ROOM ${s.roomNumber}/${s.roomTotal} · DEFEAT ${s.alive} ENEM${s.alive===1?'Y':'IES'}`;
}

export function installFirstRunGuide(controls:Pick<TwinStickControls,'setPaused'>):void {
  const guide=document.querySelector<HTMLElement>('#guide-overlay');
  const pause=document.querySelector<HTMLElement>('#pause-overlay');
  const start=document.querySelector<HTMLButtonElement>('#guide-start-btn');
  const replay=document.querySelector<HTMLButtonElement>('#guide-replay-btn');
  const pauseButton=document.querySelector<HTMLButtonElement>('#pause-btn');
  if(!guide||!pause||!start||!replay||!pauseButton)throw new Error('Missing Gate A guided-start UI');
  let open=false;
  const show=()=>{
    controls.setPaused(true); // clear all pointer/keyboard state before changing panels
    pause.hidden=true;guide.hidden=false;open=true;pauseButton.disabled=true;pauseButton.textContent='ᛟ GUIDE';
    document.documentElement.dataset.guide='open';
    start.focus({preventScroll:true});
  };
  const dismiss=()=>{
    if(!open)return;
    open=false;guide.hidden=true;pauseButton.disabled=false;document.documentElement.dataset.guide='closed';
    try{localStorage.setItem(GUIDE_SEEN_KEY,'seen');}catch{/* private browsing fallback: show next visit */}
    controls.setPaused(false);
  };
  replay.addEventListener('click',show);
  start.addEventListener('click',dismiss);
  // Escape/P cannot accidentally start live combat behind the tutorial.
  window.addEventListener('keydown',event=>{
    if(open&&(event.key==='Escape'||event.key.toLowerCase()==='p')){
      event.preventDefault();event.stopImmediatePropagation();
    }
  },true);
  let hasSeen=false;
  try{hasSeen=localStorage.getItem(GUIDE_SEEN_KEY)==='seen';}catch{/* show guidance */}
  if(!hasSeen)show();
}
