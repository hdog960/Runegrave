import { ZERO, normalizeStick, combineDirections, clampVector, stickDirectionGlyph, type Vector2 } from './vector.js';

export type StickRole='move'|'aim';
export type InputSnapshot=Readonly<{move:Vector2; aim:Vector2; firing:boolean; paused:boolean}>;
export type ControlPreferences={leftHanded:boolean;padScale:number;padOffset:number;deadZone:number};
export const SETTINGS_KEY='runegrave:input:v1';
const DEFAULTS:ControlPreferences={leftHanded:false,padScale:100,padOffset:0,deadZone:0.15};
export function sanitizeSettings(value:unknown):ControlPreferences {
  if(typeof value!=='object'||!value)return {...DEFAULTS};
  const o=value as Partial<ControlPreferences>;
  const clamp=(v:unknown,min:number,max:number,fallback:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
  return {leftHanded:o.leftHanded===true,padScale:clamp(o.padScale,85,110,100),padOffset:clamp(o.padOffset,-9,9,0),deadZone:clamp(o.deadZone,.08,.30,.15)};
}
function loadSettings():ControlPreferences {try {return sanitizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null'));}catch{return {...DEFAULTS};}}
function saveSettings(p:ControlPreferences):void {try {localStorage.setItem(SETTINGS_KEY,JSON.stringify(p));}catch{/* browser storage may be disabled */}}

export class TwinStickControls {
  private prefs=loadSettings();
  private held=new Set<string>();
  private pointers=new Map<number,{side:'left'|'right';role:StickRole}>();
  private vectors:{move:Vector2;aim:Vector2}={move:ZERO,aim:ZERO};
  private paused=false;
  private dead=false;
  private startAt=performance.now();
  private controls:Record<'left'|'right',HTMLElement>;
  private pads:Record<'left'|'right',HTMLElement>;
  private playStatus:HTMLElement;
  private pauseButton:HTMLButtonElement;
  private overlay:HTMLElement;
  private deadZone:number;
  private destroyed=false;
  private stopListeners:Array<()=>void>=[];
  constructor(private onPauseChange:(paused:boolean)=>void=()=>{}) {
    const get=<T extends HTMLElement>(selector:string):T=>{
      const el=document.querySelector<T>(selector); if(!el)throw new Error(`Missing input control ${selector}`);return el;
    };
    this.controls={left:get('.grip-left'),right:get('.grip-right')};
    this.pads={left:get('#move-rune-disc'),right:get('#aim-rune-disc')};
    this.playStatus=get('[data-run-status]');
    this.pauseButton=get('#pause-btn');
    this.overlay=get('#pause-overlay');
    this.deadZone=this.prefs.deadZone;
    for(const side of ['left','right'] as const){
      const pad=this.pads[side];
      this.listen(pad,'pointerdown',event=>this.down(side,event as PointerEvent));
      this.listen(pad,'pointermove',event=>this.move(side,event as PointerEvent));
      this.listen(pad,'pointerup',event=>this.end(event as PointerEvent));
      this.listen(pad,'pointercancel',event=>this.end(event as PointerEvent));
      this.listen(pad,'lostpointercapture',event=>this.end(event as PointerEvent));
      this.listen(pad,'contextmenu',event=>event.preventDefault());
    }
    this.listen(window,'keydown',event=>this.keydown(event as KeyboardEvent));
    this.listen(window,'keyup',event=>this.keyup(event as KeyboardEvent));
    this.listen(window,'blur',()=>this.clearTransient());
    this.listen(window,'pagehide',()=>this.clearTransient());
    this.listen(document,'visibilitychange',()=>{if(document.hidden)this.clearTransient();});
    this.listen(this.pauseButton,'click',()=>this.setPaused(!this.paused));
    this.listen(get('#resume-btn'),'click',()=>this.setPaused(false));
    const mirror=get<HTMLInputElement>('#handed-toggle');
    const scale=get<HTMLInputElement>('#pad-scale');
    const offset=get<HTMLInputElement>('#pad-offset');
    const deadZone=get<HTMLInputElement>('#dead-zone');
    mirror.checked=this.prefs.leftHanded;
    scale.value=String(this.prefs.padScale);offset.value=String(this.prefs.padOffset);deadZone.value=String(Math.round(this.prefs.deadZone*100));
    this.listen(mirror,'change',()=>this.setPreferences({leftHanded:mirror.checked}));
    this.listen(scale,'input',()=>this.setPreferences({padScale:Number(scale.value)}));
    this.listen(offset,'input',()=>this.setPreferences({padOffset:Number(offset.value)}));
    this.listen(deadZone,'input',()=>this.setPreferences({deadZone:Number(deadZone.value)/100}));
    this.applyPreferences(); this.refreshStatus();
  }
  private listen(el:EventTarget,name:string,handler:EventListener) {el.addEventListener(name,handler);this.stopListeners.push(()=>el.removeEventListener(name,handler));}
  private roleFor(side:'left'|'right'):StickRole {
    return (side==='left')!==this.prefs.leftHanded?'move':'aim';
  }
  private down(side:'left'|'right',event:PointerEvent) {
    if(this.destroyed||this.paused||this.dead||!event.isPrimary&&event.pointerType==='mouse')return;
    const role=this.roleFor(side);
    if([...this.pointers.values()].some(p=>p.role===role)||this.pointers.has(event.pointerId))return;
    event.preventDefault();
    const pad=this.pads[side];
    try{pad.setPointerCapture(event.pointerId);}catch{/* synthetic browser tests need not own real hardware capture */}
    this.pointers.set(event.pointerId,{side,role});
    this.updateVector(side,role,event);
    pad.dataset.held='true';this.refreshStatus();
  }
  private move(side:'left'|'right',event:PointerEvent){
    const owner=this.pointers.get(event.pointerId);
    if(!owner||owner.side!==side)return;
    event.preventDefault();this.updateVector(side,owner.role,event);this.refreshStatus();
  }
  private updateVector(side:'left'|'right',role:StickRole,event:PointerEvent){
    const b=this.pads[side].getBoundingClientRect();
    const radius=Math.min(b.width,b.height)*.42;
    const v=normalizeStick(event.clientX-b.left-b.width/2,event.clientY-b.top-b.height/2,radius,this.deadZone);
    this.vectors[role]=v;
    this.pads[side].style.setProperty('--stick-x',`${v.x*22}%`);
    this.pads[side].style.setProperty('--stick-y',`${v.y*22}%`);
    this.pads[side].dataset.directionGlyph=stickDirectionGlyph(v);
    this.pads[side].style.setProperty('--stick-strength',String(Math.round(Math.hypot(v.x,v.y)*100)));
  }
  private end(event:PointerEvent){
    const owner=this.pointers.get(event.pointerId);if(!owner)return;
    this.pointers.delete(event.pointerId);
    this.vectors[owner.role]=ZERO;
    const pad=this.pads[owner.side];pad.dataset.held='false';
    pad.style.setProperty('--stick-x','0%');pad.style.setProperty('--stick-y','0%');
    pad.dataset.directionGlyph='·';pad.style.setProperty('--stick-strength','0');this.refreshStatus();
  }
  private keydown(event:KeyboardEvent){
    const key=event.key.toLowerCase();
    if(this.dead)return;
    if(key==='escape'||key==='p'){if(event.repeat)return;event.preventDefault();this.setPaused(!this.paused);return;}
    const el=event.target as HTMLElement | null;
    if(el?.matches('input,select,textarea,button'))return;
    if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d','i','j','k','l'].includes(key)){
      event.preventDefault();this.held.add(key);this.refreshStatus();
    }
  }
  private keyup(event:KeyboardEvent){const key=event.key.toLowerCase();if(this.held.delete(key))this.refreshStatus();}
  private clearTransient(){
    this.held.clear();this.pointers.clear();this.vectors={move:ZERO,aim:ZERO};
    for(const pad of Object.values(this.pads)){
      pad.dataset.held='false';pad.style.setProperty('--stick-x','0%');pad.style.setProperty('--stick-y','0%');
      pad.dataset.directionGlyph='·';pad.style.setProperty('--stick-strength','0');
    }
    this.refreshStatus();
  }
  get snapshot():InputSnapshot {
    if(this.paused||this.dead)return {move:ZERO,aim:ZERO,firing:false,paused:true};
    const keyMove=combineDirections(this.held,['w','arrowup'],['s','arrowdown'],['a','arrowleft'],['d','arrowright']);
    const keyAim=combineDirections(this.held,['i'],['k'],['j'],['l']);
    const move=clampVector(this.vectors.move.x+keyMove.x,this.vectors.move.y+keyMove.y);
    const aim=clampVector(this.vectors.aim.x+keyAim.x,this.vectors.aim.y+keyAim.y);
    const firing=Math.hypot(aim.x,aim.y)>.04||this.held.has(' ');
    return {move,aim,firing,paused:false};
  }
  setPaused(value:boolean){
    if(this.destroyed||this.dead)return;
    const changed=this.paused!==value;
    this.paused=value;
    this.clearTransient();
    this.overlay.hidden=!value;
    this.pauseButton.setAttribute('aria-pressed',String(value));
    this.pauseButton.textContent=value?'ᛏ RESUME':'ᛏ PAUSE';
    document.documentElement.dataset.paused=String(value);
    if(changed)this.onPauseChange(value);
  }
  setDead(value:boolean){
    if(this.destroyed)return;
    this.dead=value;this.paused=false;this.overlay.hidden=true;
    this.clearTransient();this.pauseButton.disabled=value;
    this.pauseButton.textContent=value?(document.documentElement.dataset.roomName==='COMPLETE'?'ᛉ CLEARED':'ᛉ FALLEN'):'ᛏ PAUSE';
    this.pauseButton.setAttribute('aria-pressed','false');
    document.documentElement.dataset.dead=String(value);
    document.documentElement.dataset.paused='false';
    this.refreshStatus();
  }
  setPreferences(input:Partial<ControlPreferences>){
    this.prefs=sanitizeSettings({...this.prefs,...input});
    this.deadZone=this.prefs.deadZone;
    this.clearTransient();this.applyPreferences();saveSettings(this.prefs);
  }
  private applyPreferences(){
    for(const side of ['left','right'] as const){
      const role=this.roleFor(side),pad=this.pads[side];
      const label=pad.querySelector<HTMLElement>('.disc-label');
      if(label)label.textContent=role==='move'?'MOVE':'AIM / FIRE';
      pad.setAttribute('aria-label',role==='move'?'Movement rune thumb disc':'Aim and continuous-fire rune thumb disc');
      pad.dataset.role=role;pad.dataset.directionGlyph='·';pad.style.setProperty('--stick-strength','0');
      pad.style.setProperty('--pad-scale',String(this.prefs.padScale/100));
      pad.style.setProperty('--pad-offset',`${this.prefs.padOffset}px`);
    }
    document.documentElement.dataset.handed=this.prefs.leftHanded?'left':'standard';
  }
  refreshStatus(){
    const s=this.snapshot;
    const room=document.documentElement.dataset.roomName||'PRACTICE';
    const label=this.dead?(room==='COMPLETE'?'TRIAL COMPLETE':'THREAD SEVERED · RESTART'):s.paused?'PAUSED · INPUT RELEASED':document.documentElement.dataset.roomPhase||'ANTEROOM · EAST GATE OPEN';
    if(this.playStatus.textContent!==label)this.playStatus.textContent=label;
  }
  destroy(){this.destroyed=true;this.clearTransient();for(const stop of this.stopListeners)stop();this.stopListeners=[];}
}
