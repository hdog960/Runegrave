import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GROUND_STRIDES,enemyTravelFrame,inkedTravelBody} from '../dist/js/scene/sagaFootfalls.js';
import {HOSTILE_ATLAS,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {HostileEncounter} from '../dist/js/enemies/encounters.js';
import {makeRootvaultWorld,safeSpawn} from '../dist/js/physics/world.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
import {FIXED_DT} from '../dist/js/physics/fixedStep.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const kinds=['draugr','wisp','archer','charger','warden'];
const sample=(kind,stride,stepping=true,state='idle')=>({kind,stride,stepping,state,windup:0,phase:1,flash:0});
function fake(){const c=[],g={};for(const op of ['save','restore','translate','rotate','scale','fillRect'])g[op]=(...args)=>c.push([op,...args]);Object.defineProperty(g,'fillStyle',{set:v=>c.push(['color',v])});return {g,c};}
test('20 genuine single-body enemy travel poses span only five creatures with real locomotion',()=>{
 assert.deepEqual(Object.keys(GROUND_STRIDES),kinds);
 let count=0;
 for(const kind of kinds){
  const original=HOSTILE_ATLAS[kind],art=[];
  assert.equal(GROUND_STRIDES[kind].length,4);
  for(let f=0;f<4;f++){
   const actor=sample(kind,f*2.5);
   assert.equal(enemyTravelFrame(actor),f);
   const ink=inkedTravelBody(original,actor);
   assert.equal(ink.length,original.length);
   assert.ok(ink.every(row=>/^[. oabcegrs]+$/.test(row)),'no invalid palette inks');
   assert.deepEqual(ink.slice(0,-8),original.slice(0,-8),'upper silhouette/weapon stays anchored');
   const edited=ink.filter((s,i)=>s!==original[i]).length;
   assert.ok(edited>=3&&edited<=8,kind+' physical gait must be conspicuous but bounded');
   art.push(ink.join('|'));count++;
  }
  assert.equal(new Set(art).size,4,kind+' original 4-phase feet/tail contour');
  assert.strictEqual(inkedTravelBody(original,sample(kind,8,false)),original,'no gait when stopped');
  assert.strictEqual(inkedTravelBody(original,sample(kind,8,true,'recover')),original,'real recovery overrides travel');
  assert.strictEqual(inkedTravelBody(original,sample(kind,8),true),original,'reduced-motion freezes travel');
 }
 assert.equal(count,20);
 for(const kind of ['sentinel','shade']){
  const actor=sample(kind,20);
  assert.equal(enemyTravelFrame(actor),-1,'no invented walking state for turret/blinking shade');
  assert.strictEqual(inkedTravelBody(HOSTILE_ATLAS[kind],actor),HOSTILE_ATLAS[kind]);
 }
 assert.throws(()=>enemyTravelFrame(sample('draugr',NaN)),RangeError);
 assert.throws(()=>enemyTravelFrame(sample('draugr',-1)),RangeError);
});
test('fixed-step encounter records collision-resolved distance without changing real AI or damage',()=>{
 const world=makeRootvaultWorld(420,235),hero=safeSpawn(world,{x:110,y:105});
 const e=new HostileEncounter(world,'crypt',hero),health=new MortalHearts();
 const draugr=e.enemies.find(z=>z.kind==='draugr'),wisp=e.enemies.find(z=>z.kind==='wisp');
 assert.ok(draugr&&wisp);
 assert.equal(draugr.stride,0);assert.equal(wisp.stepping,false);
 let moved=0;
 for(let i=0;i<40;i++){
  const prev=e.enemies.map(z=>({z,x:z.x,y:z.y,stride:z.stride}));
  e.step(FIXED_DT,hero,health);
  for(const {z,x,y,stride} of prev){
   const d=Math.hypot(z.x-x,z.y-y);
   if(d>.001){moved++;assert.equal(z.stepping,true);assert.ok(z.stride>stride);}
   else assert.equal(z.stepping,false,'blocked/idle cannot fake running');
  }
 }
 assert.ok(moved>10,'live AI really walks/flies in collision-resolved world');
 assert.ok(draugr.stride>4&&wisp.stride>4);
 const boss=new HostileEncounter(world,'warden',hero),warden=boss.enemies[0];
 assert.equal(warden.kind,'warden');
 for(let i=0;i<35;i++)boss.step(FIXED_DT,hero,new MortalHearts());
 assert.ok(warden.stride>0,'real boss approach uses the same travel clock');
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
test('production atlas paints real four-frame silhouettes; no free-running gait at idle or reduced motion',()=>{
 for(const kind of kinds){
  const hashes=[];
  for(let step=0;step<4;step++){
   const {g,c}=fake();paintHostileAtlas(g,sample(kind,step*2.5),0,false);
   const paints=c.filter(z=>z[0]==='fillRect').length;
   assert.ok(paints>25&&paints<480,'bounded single-enemy pixel budget');
   hashes.push(JSON.stringify(c));
  }
  assert.equal(new Set(hashes).size,4,kind);
  const a=fake(),b=fake();
  paintHostileAtlas(a.g,sample(kind,100),0,true);
  paintHostileAtlas(b.g,sample(kind,0,false),0,true);
  assert.deepEqual(a.c,b.c,'reduced-motion must ignore physical gait');
 }
});
test('v0.09.33 stays inside original Gate A contract, keeps proper root/offline mirrors and 8 actual relics',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=read('../dist/js/scene/stage.js'),enemies=read('../dist/js/enemies/encounters.js');
 const atlas=read('../dist/js/scene/pixelSpriteAtlas.js'),v=read('../dist/js/core/version.js');
 const sw=read('../dist/sw.js'),root=read('../js/scene/sagaFootfalls.js');
 assert.match(atlas,/inkedTravelBody\(recoveringBody,\s*e,\s*reducedMotion\)/);
 assert.match(enemies,/e\.stepping = false/);
 assert.match(stage,/drawEncounter\(/);
 assert.equal(root,read('../dist/js/scene/sagaFootfalls.js'),'root Pages gait module mirrors the generated actual app');
 assert.match(v,/APP_VERSION = '0\.09\.33'/);
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.33/);
 assert.ok(sw.includes('./js/scene/sagaFootfalls.js'));
 assert.ok(read('../sw.js').includes('./js/scene/sagaFootfalls.js'));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
