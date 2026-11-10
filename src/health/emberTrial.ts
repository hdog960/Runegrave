/** v0.07 — Environmental damage and healing test instruments, NOT enemy AI.
 * Flame rune pulses and a refill shrine let a player genuinely lose/heal hearts
 * without miscounting training scenery as a new enemy or room.
 */
import { HERO_RADIUS,isPositionFree,type CollisionWorld,type Vec2 } from '../physics/world.js';
import type { TrainingTarget } from '../combat/soulbolts.js';
import { MortalHearts, type HurtResult } from './mortalHearts.js';
export const PULSE_PERIOD=2.4;
export const PULSE_START=.70;
export const PULSE_END=1.55;
export type EmberPad={id:string;x:number;y:number;radius:number;phase:number;active:boolean;warning:boolean};
export type HealingShrine={x:number;y:number;radius:number;ready:boolean;cooldown:number};
export type TrialResult={damage:HurtResult|null;healed:number;source:string|null};

function findSpot(world:CollisionWorld,preferred:Vec2,radius:number,avoid:readonly (Vec2 & {radius:number})[]):Vec2 {
  const angles=24;
  for(let ring=0;ring<=28;ring++){
    for(let i=0;i<(ring===0?1:angles);i++){
      const theta=(i+.5)*Math.PI*2/angles;
      const p={x:preferred.x+Math.cos(theta)*ring*7,y:preferred.y+Math.sin(theta)*ring*7};
      if(!isPositionFree(world,p,radius+2))continue;
      if(avoid.some(a=>Math.hypot(p.x-a.x,p.y-a.y)<radius+a.radius+10))continue;
      return p;
    }
  }
  throw new Error('No fair room placement for Ember Trial health objects');
}
export class EmberTrial {
  readonly pads:EmberPad[];
  readonly shrine:HealingShrine;
  private seconds=0;
  private contacts=0;
  private healEvents=0;
  constructor(world:CollisionWorld,hero:Vec2,targets:readonly TrainingTarget[]){
    const avoid:(Vec2&{radius:number})[]=[{...hero,radius:HERO_RADIUS+5},...targets.filter(t=>t.alive).map(t=>({x:t.x,y:t.y,radius:t.radius}))];
    const centerY=world.minY+(world.maxY-world.minY)*.55;
    this.pads=[
      {id:'west-ember',x:0,y:0,radius:12,phase:0,active:false,warning:false},
      {id:'east-ember',x:0,y:0,radius:12,phase:1.18,active:false,warning:false}
    ];
    for(const [i,pad] of this.pads.entries()){
      const p=findSpot(world,{x:world.width*(i===0?.39:.62),y:centerY},pad.radius,avoid);
      pad.x=p.x;pad.y=p.y;
      avoid.push({...p,radius:pad.radius});
    }
    const shrineSpot=findSpot(world,{x:world.width*.5,y:world.maxY-12},9,avoid);
    this.shrine={...shrineSpot,radius:9,ready:true,cooldown:0};
    this.recompute();
  }
  private recompute(){
    for(const pad of this.pads){
      const phase=(this.seconds+pad.phase)%PULSE_PERIOD;
      pad.active=phase>=PULSE_START&&phase<PULSE_END;
      pad.warning=phase>=.35&&phase<PULSE_START;
    }
  }
  exportState(){return {seconds:this.seconds,contacts:this.contacts,healEvents:this.healEvents,ready:this.shrine.ready,cooldown:this.shrine.cooldown};}
  restoreState(v:ReturnType<EmberTrial['exportState']>){
    if(!Number.isFinite(v.seconds)||v.seconds<0)return;
    this.seconds=v.seconds;this.contacts=v.contacts;this.healEvents=v.healEvents;
    this.shrine.ready=v.ready;this.shrine.cooldown=v.cooldown;this.recompute();
  }
  get state(){return {seconds:this.seconds,contacts:this.contacts,healEvents:this.healEvents,shrineReady:this.shrine.ready};}
  step(dt:number,hero:Vec2,health:MortalHearts):TrialResult {
    if(!Number.isFinite(dt)||dt<=0||dt>1/30)throw new RangeError('Hazards require a bounded fixed tick');
    if(health.state.dead)return {damage:null,healed:0,source:null};
    this.seconds+=dt;
    this.recompute();
    if(!this.shrine.ready){
      this.shrine.cooldown=Math.max(0,this.shrine.cooldown-dt);
      if(this.shrine.cooldown===0)this.shrine.ready=true;
    }
    let damage:HurtResult|null=null,source:string|null=null;
    for(const pad of this.pads){
      if(pad.active&&Math.hypot(pad.x-hero.x,pad.y-hero.y)<pad.radius+HERO_RADIUS-2){
        damage=health.hurt(1,pad.id);source=pad.id;
        if(damage==='hurt'||damage==='dead')this.contacts++;
        if(damage==='dead')return {damage,healed:0,source};
      }
    }
    let healed=0;
    if(this.shrine.ready&&Math.hypot(this.shrine.x-hero.x,this.shrine.y-hero.y)<this.shrine.radius+HERO_RADIUS){
      healed=health.heal(2);
      if(healed>0){this.shrine.ready=false;this.shrine.cooldown=10;this.healEvents++;}
    }
    return {damage,healed,source};
  }
}
