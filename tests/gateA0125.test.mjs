import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ritualWarningGeometry,paintRitualWarning} from '../dist/js/enemies/ritualWarningInk.js';
import {sentinelShotVector,HostileEncounter} from '../dist/js/enemies/encounters.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {makeRootvaultWorld,safeSpawn} from '../dist/js/physics/world.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
import {FIXED_DT} from '../dist/js/physics/fixedStep.js';
const sample=(kind,windup=.12,attackCount=0,state='warning')=>({kind,state,x:155,y:105,radius:kind==='sentinel'?11:8,windup,attackCount});
const hero={x:265,y:143};
function mock(){
 const calls=[],g={};
 for(const k of ['save','restore','fillRect','beginPath','moveTo','lineTo','stroke'])g[k]=(...a)=>calls.push([k,...a]);
 Object.defineProperty(g,'fillStyle',{set:v=>calls.push(['fillStyle',v])});
 Object.defineProperty(g,'strokeStyle',{set:v=>calls.push(['strokeStyle',v])});
 Object.defineProperty(g,'lineWidth',{set:v=>calls.push(['lineWidth',v])});
 return {g,calls};
}
test('sentinel original six world-space directions share the LIVE AI success-counter formula, without changing its six-shot attack',()=>{
 for(const count of [0,1,9,67]){
  for(let a=0;a<6;a++){
   const shot=sentinelShotVector(a,count);
   const angle=(a+count*.10)*Math.PI/3;
   assert.ok(Math.abs(shot.x-Math.cos(angle))<1e-12&&Math.abs(shot.y-Math.sin(angle))<1e-12);
   assert.ok(Math.abs(Math.hypot(shot.x,shot.y)-1)<1e-12);
  }
  const geometry=ritualWarningGeometry(sample('sentinel',.3,count),hero,420,235);
  assert.equal(geometry.rays.length,6);
  geometry.rays.forEach((ray,i)=>{
   // All-success preview uses precisely the game's mutable shot counter;
   // the underlying attack still counts only spawned projectiles.
   const expected=sentinelShotVector(i,count+i);
   assert.ok(Math.abs(ray.dx-expected.x)<1e-12);
   assert.ok(Math.abs(ray.dy-expected.y)<1e-12);
  });
 }
 assert.throws(()=>sentinelShotVector(6,0),RangeError);
 assert.throws(()=>sentinelShotVector(0,-1),RangeError);
 const source=readFileSync(new URL('../src/enemies/encounters.ts',import.meta.url),'utf8');
 assert.match(source,/this\.shoot\(e,sentinelShotVector\(a,e\.attackCount\),90\)/);
});
test('wisp single glass-lance follows the CURRENT living hero, not initial warning heading, and has a valid shoot origin',()=>{
 const w=sample('wisp',.31),a=ritualWarningGeometry(w,{x:225,y:105},420,235);
 const b=ritualWarningGeometry(w,{x:155,y:220},420,235);
 assert.equal(a.rays.length,1);assert.equal(b.rays.length,1);
 assert.ok(a.rays[0].dx>.99&&Math.abs(a.rays[0].dy)<.01);
 assert.ok(b.rays[0].dy>.99&&Math.abs(b.rays[0].dx)<.01);
 assert.ok(Math.abs(Math.hypot(a.rays[0].start.x-w.x,a.rays[0].start.y-w.y)-(w.radius+5))<1e-7);
 assert.notDeepEqual(a.rays,b.rays);
 assert.equal(ritualWarningGeometry(w,undefined,420,235),null,'never invent the current hero position');
 assert.equal(ritualWarningGeometry({...w,state:'idle'},hero,420,235),null);
 assert.equal(ritualWarningGeometry({...w,state:'hidden'},hero,420,235),null);
});
test('shade shroud folds inward in THREE true remaining-windup phases, without drawing any teleport destination or fake projectile',()=>{
 const shapes=[.60,.32,.12].map(windup=>ritualWarningGeometry(sample('shade',windup),hero,420,235));
 assert.deepEqual(shapes.map(x=>x.fold),[0,1,2]);
 assert.ok(shapes.every(x=>x.rays.length===0));
 const stamps=[.60,.32,.12].map(windup=>{const a=mock();assert.equal(paintRitualWarning(a.g,sample('shade',windup),hero,420,235),true);return JSON.stringify(a.calls);});
 assert.equal(new Set(stamps).size,3,'three authored increasingly tight silhouette forms');
 const hidden=sample('shade',.4,0,'hidden');
 assert.equal(paintRitualWarning(mock().g,hidden,hero,420,235),false);
 assert.equal(ritualWarningGeometry(hidden,hero,420,235),null);
});
test('three separate Norse ritual signal families render bounded, motion-independent ink, not duplicate circles or false attacks',()=>{
 const stamps=[];
 for(const kind of ['wisp','sentinel','shade']){
  const a=mock(),b=mock();
  assert.equal(paintRitualWarning(a.g,sample(kind),hero,420,235),true);
  assert.equal(paintRitualWarning(b.g,sample(kind),hero,420,235),true);
  assert.deepEqual(a.calls,b.calls,'rendering must not have an arbitrary wall-time clock');
  assert.ok(a.calls.length>15&&a.calls.length<280,kind+' art should be visually substantial but bounded');
  stamps.push(JSON.stringify(a.calls));
 }
 assert.equal(new Set(stamps).size,3);
 assert.throws(()=>ritualWarningGeometry(sample('sentinel',NaN),hero,420,235),RangeError);
 assert.throws(()=>ritualWarningGeometry({...sample('sentinel'),attackCount:-1},hero,420,235),RangeError);
});
test('unchanged real sentinel encounter spawns projectiles after warning; no fabricated new damage, saved state or unlocks',()=>{
 const world=makeRootvaultWorld(420,235),h=safeSpawn(world,{x:110,y:105});
 const plan={id:'v00935-sentinel',strength:1,waves:[['sentinel']]};
 const e=new HostileEncounter(world,'crypt',h,plan),health=new MortalHearts(),s=e.enemies[0];
 assert.equal(s.kind,'sentinel');assert.equal(s.state,'idle');
 s.cooldown=0;e.step(FIXED_DT,h,health);
 assert.equal(s.state,'warning');assert.equal(e.snapshot.shots,0);
 for(let i=0;i<Math.ceil(1.1/FIXED_DT);i++)e.step(FIXED_DT,h,health);
 assert.ok(e.snapshot.shots>0,'the original enemy must fire actual visible projectiles');
 assert.ok(e.projectiles.every(b=>b.damage===1&&b.radius===3.4&&b.speed===90));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
test('actual production stage supplies live hero position and retains untouched PWA/controls/saves/Gate A',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const enemy=read('../dist/js/enemies/enemyArt.js'),stage=read('../dist/js/scene/stage.js');
 assert.match(stage,/drawEncounter\(g, encounter, time, .*reduced\.matches, actor\)/);
 assert.match(enemy,/paintRitualWarning\(g, e, hero, worldWidth, worldHeight\)/);
 assert.match(enemy,/runeWarning\(g, e, t, hero\)/);
 assert.match(enemy,/paintThreatLane\(g, e, worldWidth, worldHeight\)/,'all v0.09.34 threat lanes survive');
 const v=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(v,/APP_VERSION = '0\.09\.38'/);
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.38/);
 assert.ok(sw.includes('./js/enemies/ritualWarningInk.js'));
 assert.ok(read('../sw.js').includes('./js/enemies/ritualWarningInk.js'));
 assert.ok(read('../js/enemies/ritualWarningInk.js').includes('export function paintRitualWarning'));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
