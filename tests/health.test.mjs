import test from 'node:test';
import assert from 'node:assert/strict';
import { MortalHearts,heartSlots,DAMAGE_GRACE_SECONDS } from '../dist/js/health/mortalHearts.js';
import { EmberTrial,PULSE_START,PULSE_END,PULSE_PERIOD } from '../dist/js/health/emberTrial.js';
import { makeRootvaultWorld,safeSpawn,isPositionFree,HERO_RADIUS } from '../dist/js/physics/world.js';
import { FIXED_DT,FixedStepClock } from '../dist/js/physics/fixedStep.js';
import { SoulboltCombat } from '../dist/js/combat/soulbolts.js';
import { readFileSync,existsSync } from 'node:fs';

const make=(height=260)=>{
 const world=makeRootvaultWorld(420,height),hero=safeSpawn(world),combat=new SoulboltCombat(world,hero),
 trial=new EmberTrial(world,hero,combat.targets),health=new MortalHearts();
 return {world,hero,combat,trial,health};
};
const frame=(trial,health,hero,steps)=>{let last;for(let i=0;i<steps;i++){health.step(FIXED_DT);last=trial.step(FIXED_DT,hero,health);}return last;};

test('Mortal Hearts begin with three genuinely full, distinct containers',()=>{
 const h=new MortalHearts(),s=h.state;
 assert.equal(s.units,6);assert.equal(s.maxUnits,6);assert.equal(s.containers,3);
 assert.deepEqual(heartSlots(s.units,s.maxUnits),['full','full','full']);
 assert.equal(s.dead,false);assert.equal(s.hits,0);
});
test('half-heart damage, grace blocking and time-limited vulnerability are deterministic',()=>{
 const h=new MortalHearts();assert.equal(h.hurt(1,'ember-west'),'hurt');
 assert.equal(h.state.units,5);assert.equal(h.state.grace,DAMAGE_GRACE_SECONDS);
 assert.deepEqual(heartSlots(5,6),['full','full','half']);
 assert.equal(h.hurt(2,'ember-east'),'blocked');assert.equal(h.state.units,5);
 for(let i=0;i<120;i++)h.step(FIXED_DT);
 assert.equal(h.state.grace,0);
 assert.equal(h.hurt(2,'ember-east'),'hurt');assert.equal(h.state.units,3);
 assert.deepEqual(heartSlots(3,6),['full','half','empty']);
});
test('healing respects available capacity and does not bypass invulnerability',()=>{
 const h=new MortalHearts();assert.equal(h.heal(2),0);
 h.hurt(3,'test-hit');assert.equal(h.heal(2),2);assert.equal(h.state.units,5);
 assert.ok(h.state.grace>0);assert.equal(h.heal(50),1);assert.equal(h.state.healed,3);
 assert.equal(h.state.units,6);assert.equal(h.hurt(1,'blocked'),'blocked');
});
test('lethal damage prevents revival by ordinary pickups; restart resets all transients',()=>{
 const h=new MortalHearts();assert.equal(h.hurt(6,'flame'),'dead');
 assert.equal(h.state.dead,true);assert.equal(h.state.units,0);
 assert.equal(h.hurt(1,'flame'),'ignored');assert.equal(h.heal(2),0);
 for(let i=0;i<120;i++)h.step(FIXED_DT);
 assert.equal(h.state.dead,true);
 h.reset();assert.equal(h.state.units,6);assert.equal(h.state.grace,0);
 assert.equal(h.state.hits,0);assert.equal(h.state.dead,false);
});
test('invalid heart values and simulation deltas are rejected without state corruption',()=>{
 assert.throws(()=>new MortalHearts(0));assert.throws(()=>new MortalHearts(12.5));
 const h=new MortalHearts();const before=h.state;
 for(const amount of [0,-1,NaN,1.5,Infinity,101])assert.throws(()=>h.hurt(amount,'test'));
 assert.throws(()=>h.hurt(1,''));assert.throws(()=>h.hurt(1,'a'.repeat(65)));
 assert.throws(()=>h.heal(0));assert.throws(()=>h.step(-.01));assert.throws(()=>h.step(.5));
 assert.throws(()=>heartSlots(-1,6));assert.throws(()=>heartSlots(2,5));
 assert.deepEqual(h.state,before);
});
test('Mortal Heart outcomes are frame-rate independent with a bounded 120 Hz simulation',()=>{
 const results=[];
 for(const fps of [30,60,120,144]){
  const h=new MortalHearts(),clock=new FixedStepClock();
  for(let t=0;t<fps*6;t++)clock.advance(1/fps,(dt,tick)=>{
   h.step(dt);
   if(tick===1||tick===120||tick===240||tick===360||tick===480)h.hurt(1,'training-flame');
  });
  results.push({state:h.state,ticks:clock.ticks});
 }
 for(const row of results){assert.equal(row.ticks,720);assert.deepEqual(row,results[0]);}
});
test('environmental hazards and refill shrine spawn safely across realistic camera heights',()=>{
 for(const height of [170,184,218,260,310,350]){
  const {world,hero,combat,trial}=make(height);
  assert.equal(trial.pads.length,2);assert.notEqual(trial.pads[0].id,trial.pads[1].id);
  for(const p of [...trial.pads,trial.shrine]){
   assert.ok(isPositionFree(world,p,p.radius+2),`unsafe ${height} ${JSON.stringify(p)}`);
   assert.ok(Math.hypot(p.x-hero.x,p.y-hero.y)>p.radius+HERO_RADIUS+5,`overlap hero ${height}`);
   assert.ok(combat.targets.every(t=>Math.hypot(p.x-t.x,p.y-t.y)>p.radius+t.radius+5));
  }
 }
});
test('active ember sigils cause actual half-heart damage and continuous contact respects i-frames',()=>{
 const {trial,health}=make();const p=trial.pads[0];
 // Run to the active pulse before entering the hazard footprint.
 frame(trial,health,{x:5,y:5},Math.ceil((PULSE_START+.10)/FIXED_DT));
 assert.equal(trial.pads[0].active,true);
 let result=frame(trial,health,p,1);
 assert.equal(result.damage,'hurt');assert.equal(health.state.units,5);
 const prev=health.state.hits;
 frame(trial,health,p,30);
 assert.equal(health.state.hits,prev);assert.ok(health.state.blocked>=1);
 assert.ok(trial.state.contacts>=1);
});
test('warnings and nonactive rune phases do not secretly damage',()=>{
 const {trial,health}=make();const pad=trial.pads[0];
 for(let i=0;i<49;i++)frame(trial,health,pad,1);
 assert.equal(health.state.units,6);
 assert.equal(trial.pads[0].active,false);
 assert.ok(trial.pads[0].warning);
});
test('healing shrine is consumed only when damaged and respawns after a fixed cooldown',()=>{
 const {trial,health}=make();const shrine=trial.shrine;
 frame(trial,health,shrine,2);assert.equal(shrine.ready,true);
 health.hurt(2,'hazard');
 const result=frame(trial,health,shrine,2);
 assert.equal(result.healed,0); // consumed during first step above; confirm actual healed state
 assert.equal(health.state.units,6);assert.equal(trial.state.healEvents,1);
 assert.equal(shrine.ready,false);
 frame(trial,health,{x:0,y:0},1190);
 assert.equal(shrine.ready,false);
 frame(trial,health,{x:0,y:0},20);
 assert.equal(shrine.ready,true);
});
test('resizing the room preserves environmental trial timers and shrine depletion',()=>{
 const a=make();const p=a.trial.shrine;
 a.health.hurt(1,'hazard');frame(a.trial,a.health,p,1);
 const state=a.trial.exportState();assert.equal(state.ready,false);
 const b=make(310);b.trial.restoreState(state);
 assert.equal(b.trial.state.seconds,state.seconds);
 assert.equal(b.trial.shrine.ready,false);
 assert.equal(b.trial.shrine.cooldown,state.cooldown);
});
test('Mortal Hearts UI is outside live canvas and death menu is a stopped-world replacement',()=>{
 const file=new URL('../dist/index.html',import.meta.url);
 const html=readFileSync(file,'utf8');
 assert.match(html,/data-heart-icons/);assert.match(html,/data-heart-readout/);
 assert.match(html,/id="death-overlay"/);assert.match(html,/id="restart-btn"/);
 assert.match(html,/class="grip grip-left"[\s\S]*data-heart-icons[\s\S]*class="central-screen"/);
 assert.ok(existsSync(new URL('../dist/js/health/emberTrial.js',import.meta.url)));
 assert.ok(existsSync(new URL('../dist/js/health/mortalHearts.js',import.meta.url)));
 assert.ok(existsSync(new URL('../dist/js/health/healthArt.js',import.meta.url)));
});
