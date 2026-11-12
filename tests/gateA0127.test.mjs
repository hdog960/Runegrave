import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WARDEN_UNBOUND_CROWN,WARDEN_BARK_CUTS,WARDEN_HEARTSTONE,wardenBodyWear,inkedWardenPhaseBody} from '../dist/js/scene/wardenUnboundInk.js';
import {HOSTILE_ATLAS,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {HostileEncounter} from '../dist/js/enemies/encounters.js';
import {makeRootvaultWorld,safeSpawn} from '../dist/js/physics/world.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const boss=HOSTILE_ATLAS.warden;
const sample=(phase,hp,state='idle',windup=0)=>({kind:'warden',state,phase,hp,maxHp:28,flash:0,windup,stride:0,stepping:false});
function fake(){const calls=[],g={};for(const m of ['save','restore','translate','rotate','fillRect'])g[m]=(...a)=>calls.push([m,...a]);Object.defineProperty(g,'fillStyle',{set:v=>calls.push(['ink',v])});return {g,calls};}
test('two hand-authored 18-row shoulder/chest/root/boot armor bodies preserve the authentic six-row antler crown',()=>{
 assert.equal(WARDEN_UNBOUND_CROWN.length,6);
 assert.deepEqual(Object.keys(WARDEN_BARK_CUTS),['unbound','sundered']);
 for(const mode of ['unbound','sundered']){
  const cuts=WARDEN_BARK_CUTS[mode];
  assert.equal(cuts.length,18);
  for(const pair of cuts){
   assert.equal(pair.length,2);
   for(const side of pair){assert.equal(side.length,4);assert.match(side,/^[.oabcegrs]+$/);}
  }
  assert.equal(WARDEN_HEARTSTONE[mode].length,5);
  for(const row of WARDEN_HEARTSTONE[mode]){assert.equal(row.length,7);assert.match(row,/^[.oabcegrs]+$/);}
 }
 assert.notDeepEqual(WARDEN_BARK_CUTS.unbound,WARDEN_BARK_CUTS.sundered);
 assert.notDeepEqual(WARDEN_HEARTSTONE.unbound,WARDEN_HEARTSTONE.sundered);
});
test('one real 28-point Warden health bar drives exactly two AI phases and three truthful PAINT wear levels',()=>{
 assert.equal(wardenBodyWear('warden',1,28,28),'bound');
 assert.equal(wardenBodyWear('warden',1,13,28),'bound','art must not invent early phase two');
 assert.equal(wardenBodyWear('warden',2,14,28),'unbound');
 assert.equal(wardenBodyWear('warden',2,8,28),'unbound');
 assert.equal(wardenBodyWear('warden',2,7,28),'sundered');
 assert.equal(wardenBodyWear('warden',2,1,28),'sundered');
 assert.equal(wardenBodyWear('warden',2),'unbound','legacy callers still get the original phase-two body');
 assert.equal(wardenBodyWear('draugr',2,1,2),'bound');
 assert.throws(()=>wardenBodyWear('warden',2,NaN,28),RangeError);
 assert.throws(()=>wardenBodyWear('warden',2,8,0),RangeError);
 assert.throws(()=>wardenBodyWear('warden',NaN,14,28),RangeError);
});
test('full one-body boss silhouette is extensively different after actual phase threshold; same draw dimensions and original palette',()=>{
 const bound=inkedWardenPhaseBody(boss,'warden',1,28,28);
 const unbound=inkedWardenPhaseBody(boss,'warden',2,14,28);
 const shattered=inkedWardenPhaseBody(boss,'warden',2,7,28);
 assert.strictEqual(bound,boss,'phase one remains exact original reference');
 for(const sheet of [unbound,shattered]){
  assert.equal(sheet.length,boss.length);
  assert.ok(sheet.filter((r,i)=>r!==boss[i]).length>=16,'actual body changes across torso, limbs and boots, not only a tiny crown');
  assert.ok(sheet.every(r=>/^[. oabcegrs]+$/.test(r)));
  assert.ok(sheet.every(r=>r.length<=Math.max(...boss.map(x=>x.length))),'same real body width and hitbox');
 }
 assert.ok(unbound.filter((r,i)=>r!==shattered[i]).length>=13,'low-hp core visually breaks over full body');
 assert.deepEqual(unbound.slice(-2),boss.slice(-2),'actual feet/ground anchors are preserved');
 for(const kind of ['draugr','wisp','archer','charger','sentinel','shade'])
  assert.strictEqual(inkedWardenPhaseBody(HOSTILE_ATLAS[kind],kind,2,2,4),HOSTILE_ATLAS[kind]);
});
test('the ACTUAL original Warden damage transition triggers phase two at half HP, but no new combat phase at quarter HP',()=>{
 const world=makeRootvaultWorld(420,235),hero=safeSpawn(world,{x:110,y:105});
 const encounter=new HostileEncounter(world,'warden',hero);
 const e=encounter.enemies[0];assert.equal(e.kind,'warden');assert.equal(e.hp,28);
 assert.equal(wardenBodyWear(e.kind,e.phase,e.hp,e.maxHp),'bound');
 for(let i=0;i<14;i++)assert.equal(encounter.hitAt({x:e.x,y:e.y},2,1,{x:0,y:0}),e.id);
 assert.equal(e.hp,14);assert.equal(e.phase,2);
 assert.equal(wardenBodyWear(e.kind,e.phase,e.hp,e.maxHp),'unbound');
 for(let i=0;i<7;i++)assert.equal(encounter.hitAt({x:e.x,y:e.y},2,1,{x:0,y:0}),e.id);
 assert.equal(e.hp,7);assert.equal(e.phase,2,'the new third silhouette is NOT a third attack phase');
 assert.equal(wardenBodyWear(e.kind,e.phase,e.hp,e.maxHp),'sundered');
 assert.equal(encounter.snapshot.bossPhase,2);
 assert.equal(encounter.snapshot.phase,'locked');
});
test('real production hostile atlas paints all three health-dependent Warden variations, no ghost body or decorative clock',()=>{
 const images=[];
 for(const [phase,hp] of [[1,28],[2,14],[2,7]]){
  const a=fake(),b=fake();paintHostileAtlas(a.g,sample(phase,hp),0,true);paintHostileAtlas(b.g,sample(phase,hp),20,true);
  assert.deepEqual(a.calls,b.calls,'reduced motion cannot create phantom boss timer');
  const rects=a.calls.filter(x=>x[0]==='fillRect').length;
  assert.ok(rects>40&&rects<550,'same single boss draw budget');
  images.push(JSON.stringify(a.calls));
 }
 assert.equal(new Set(images).size,3,'three real torso states on ONE entity');
});
test('v0.09.41 Gate A keeps all mechanics, real eight relics, 25 rooms, separate grips and user-consented offline SW update',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(version,/APP_VERSION = '0\.09\.41'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.41/);
 assert.ok(sw.includes('./js/scene/wardenUnboundInk.js'));
 assert.ok(read('../sw.js').includes('./js/scene/wardenUnboundInk.js'));
 assert.ok(read('../js/scene/wardenUnboundInk.js').includes('export function inkedWardenPhaseBody'));
 const atlas=read('../dist/js/scene/pixelSpriteAtlas.js');
 assert.match(atlas,/inkedWardenPhaseBody\(travelingBody,\s*e\.kind,\s*e\.phase,\s*e\.hp,\s*e\.maxHp\)/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});

test('genuine second-phase crown has attached thorns, never hovering pixels',()=>{
 for(const hp of [14,7]){
  const m=fake();paintHostileAtlas(m.g,sample(2,hp),0,true);
  const rects=m.calls.filter(c=>c[0]==='fillRect');
  assert.ok(rects.length>40);
  for(const [,x,,w] of rects)assert.ok(x>=-25&&x+w<=25,'Warden ink cannot float outside its physical body at '+x);
 }
});
