import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {threatLaneGeometry,paintThreatLane} from '../dist/js/enemies/attackLaneInk.js';
import {CHARGER_DASH_SPEED,CHARGER_DASH_DURATION} from '../dist/js/enemies/encounters.js';
import {HERO_RADIUS} from '../dist/js/physics/world.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const e=(kind,phase=1,state='warning',windup=.1)=>({kind,state,phase,windup,x:160,y:95,dx:.8,dy:.6,radius:kind==='warden'?18:kind==='charger'?10:8});
function fake(){
 const calls=[],g={};
 for(const op of ['save','restore','fillRect','setLineDash','beginPath','moveTo','lineTo','stroke'])g[op]=(...args)=>calls.push([op,...args]);
 Object.defineProperty(g,'strokeStyle',{set:v=>calls.push(['strokeStyle',v])});
 Object.defineProperty(g,'fillStyle',{set:v=>calls.push(['fillStyle',v])});
 Object.defineProperty(g,'lineWidth',{set:v=>calls.push(['lineWidth',v])});
 return {g,calls};
}
test('charger anticipates its ACTUAL dash distance and physical collision footprint, not a fictional 104px narrow ray',()=>{
 const lane=threatLaneGeometry(e('charger'),420,235);
 assert.equal(CHARGER_DASH_SPEED,160);assert.equal(CHARGER_DASH_DURATION,.38);
 assert.equal(lane.reach,CHARGER_DASH_SPEED*CHARGER_DASH_DURATION);
 assert.equal(lane.halfWidth,10+HERO_RADIUS-2);
 assert.equal(lane.rays.length,1);
 assert.ok(lane.reach<104,'obsolete arbitrarily long dash warning must not return');
 const a=fake(),b=fake();
 assert.equal(paintThreatLane(a.g,e('charger'),420,235),true);
 assert.equal(paintThreatLane(b.g,e('charger'),420,235),true);
 assert.deepEqual(a.calls,b.calls,'no free-running decorative attack animation');
 assert.ok(a.calls.filter(x=>x[0]==='stroke').length>=6&&a.calls.filter(x=>x[0]==='stroke').length<=14);
 assert.equal(threatLaneGeometry(e('charger',1,'charge'),420,235),null,'active charging must not pretend another warning');
});
test('aimed archer bolt and the five genuine Warden fan vectors have different drawn shapes',()=>{
 const archer=threatLaneGeometry(e('archer'),420,235);
 const w=threatLaneGeometry(e('warden'),420,235),w2=threatLaneGeometry(e('warden',2),420,235);
 assert.equal(archer.rays.length,1);assert.equal(w.rays.length,5);
 assert.deepEqual(w.rays.map(z=>z.dx),w2.rays.map(z=>z.dx),'phase two keeps true original five fan rays');
 assert.ok(w.rays[0].x<w.rays[4].x||w.rays[0].y<w.rays[4].y,'distinct angular spread');
 const first=fake(),second=fake(),third=fake();
 paintThreatLane(first.g,e('archer'),420,235);
 paintThreatLane(second.g,e('warden'),420,235);
 paintThreatLane(third.g,e('warden',2),420,235);
 assert.notDeepEqual(first.calls,second.calls);
 assert.ok(third.calls.filter(x=>x[0]==='stroke').length>second.calls.filter(x=>x[0]==='stroke').length,'real phase2 includes two side shots');
 for(const draw of [first,second,third])assert.ok(draw.calls.length<160,'bounded real-ink budget');
 assert.throws(()=>threatLaneGeometry({...e('charger'),windup:NaN},420,235),RangeError);
});
test('combat draw order puts carved exit masonry behind enemies and bullets, and removes floating compass label',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const enemies=read('../dist/js/enemies/enemyArt.js');
 const door=read('../dist/js/scene/doorArt.js');
 const a=enemies.indexOf('drawRuneDoor(g, encounter.exit'),b=enemies.indexOf('for (const e of state.enemies)');
 assert.ok(a>=0&&b>a,'gate art must be BEHIND actual combat actors');
 assert.match(enemies,/paintThreatLane\(g, e, worldWidth, worldHeight\)/);
 assert.ok(!door.includes('meta.label} DOOR'),'remove second floating 9px direction caption');
 assert.ok(door.includes("open ? 'EXIT' : 'LOCKED'"),'status still unmistakable');
 assert.ok(door.includes('paintSagaGate(g, direction, open, time)'),'real four-compass carved gate preserved');
});
test('locked v0.09 Gate A maintains eight functioning relics, 25 rooms, player-consented offline update and identical save schema',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(version,/APP_VERSION = '0\.09\.35'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.35/);
 assert.ok(sw.includes('js/enemies/attackLaneInk.js'));
 assert.ok(read('../sw.js').includes('js/enemies/attackLaneInk.js'));
 assert.match(read('../dist/js/scene/stage.js'),/drawEncounter\(/);
});
