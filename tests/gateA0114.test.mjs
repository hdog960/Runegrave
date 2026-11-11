import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {FRIEZE_FAMILIES,FRIEZE_STONE,FRIEZE_EPISODES,paintSagaFloorFrieze} from '../dist/js/scene/sagaFloorFrieze.js';
import {WEAPON_SAGA_KINDS,ENEMY_WEAPON_SHEETS,enemyWeaponStage,paintEnemySagaWeapon} from '../dist/js/scene/sagaWeaponAtlas.js';
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','fillRect','translate','scale'])
  g[op]=(...params)=>calls.push([op,...params]);
 return {g,calls};
}
const foes=['draugr','wisp','archer','charger','sentinel','shade','warden'];
test('25 genuinely different low-wall saga narratives, all within existing world-floor footprint',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.deepEqual([...FRIEZE_FAMILIES],['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.equal(FRIEZE_EPISODES.length,5);
 assert.equal(new Set(FRIEZE_EPISODES.map(rows=>rows.join('|'))).size,5);
 assert.equal(new Set(Object.values(FRIEZE_STONE).map(rows=>rows.join('|'))).size,5);
 for(const rows of Object.values(FRIEZE_STONE)){
  assert.equal(rows.length,10);
  for(const row of rows){assert.equal(row.length,12);assert.match(row,/^[.#+]+$/);}
 }
 for(const rows of FRIEZE_EPISODES){
  assert.equal(rows.length,9);
  for(const row of rows){assert.equal(row.length,9);assert.match(row,/^[.#+]+$/);}
 }
 const scenes=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  assert.equal(Number(room.id.slice(-2))-1,i,'canonical identity, never visit order');
  const a=mock(),b=mock();
  paintSagaFloorFrieze(a.g,420,235,room.family,i);
  paintSagaFloorFrieze(b.g,420,235,room.family,i);
  assert.deepEqual(a.calls,b.calls,'no time-randomized scenery');
  assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
  assert.ok(a.calls.length>95&&a.calls.length<900,room.id+' bounded pixel batch');
  for(const [op,x,y,w,h] of a.calls.filter(c=>c[0]==='fillRect')){
   assert.ok(x>=420/2-108&&x+w<=420/2+108,room.id+' leaves side fighting lanes clear');
   assert.ok(y>=235-40&&y+h<=235-4,room.id+' stays in lower wall and away from actors');
   assert.ok(w>0&&h>0,'every carved pixel must have physical dimension');
  }
  assert.equal(a.g.globalAlpha,.73,'masonry stays subordinate to enemy danger visuals');
  scenes.add(JSON.stringify(a.calls));
 }
 assert.equal(scenes.size,25,'no two canonical rooms draw the same composition');
 assert.throws(()=>paintSagaFloorFrieze(mock().g,420,235,'ROOT',1),RangeError);
 assert.throws(()=>paintSagaFloorFrieze(mock().g,420,235,'ASH',25),RangeError);
});
test('seven species have unique authored contiguous-pixel weapon sheets',()=>{
 assert.deepEqual([...WEAPON_SAGA_KINDS],foes);
 assert.deepEqual(Object.keys(ENEMY_WEAPON_SHEETS),foes);
 assert.equal(new Set(Object.values(ENEMY_WEAPON_SHEETS).map(x=>x.join('|'))).size,7);
 for(const [kind,rows] of Object.entries(ENEMY_WEAPON_SHEETS)){
  assert.equal(rows.length,10,kind);
  for(const row of rows){assert.equal(row.length,14,kind+' consistently sized 14px original weapon art');assert.match(row,/^[.o#+]+$/);}
 }
});
test('all seven weapons have four physically distinct real warning phases, safe negative idle and strong boss phase two',()=>{
 const last=[];
 for(const kind of foes){
  const phases=[];
  const e={kind,state:'warning',windup:.9,phase:1,flash:0};
  for(const windup of [.9,.54,.30,.09]){
   const a=mock(),b=mock();
   const q={...e,windup};
   paintEnemySagaWeapon(a.g,q,2,true);paintEnemySagaWeapon(b.g,q,99,true);
   assert.deepEqual(a.calls,b.calls,'reduced-motion frame is clock-independent');
   assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
   assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
   assert.ok(a.calls.length>18&&a.calls.length<160,kind+' one detailed weapon, not stacked overlays');
   for(const [op,x,y,w,h] of a.calls.filter(c=>c[0]==='fillRect')){
     assert.ok(x>=-16&&x+w<=55&&y>=-50&&y+h<=17,kind+' stays near body');
   }
   phases.push(JSON.stringify(a.calls));
  }
  assert.equal(new Set(phases).size,4,kind+' four geometrically unique attack poses');
  last.push(phases.at(-1));
  for(const state of ['idle','recover','hidden']){
   const idle=mock();
   paintEnemySagaWeapon(idle.g,{...e,state,windup:-1/120},50);
   assert.equal(idle.calls.length,0,'inactive opponent never fakes a strike');
  }
  const early=mock(),late=mock();
  paintEnemySagaWeapon(early.g,{...e,flash:0},2,true);
  paintEnemySagaWeapon(late.g,{...e,flash:.12},2,true);
  assert.notDeepEqual(early.calls,late.calls,'actual hit event breaks weapon ink');
  assert.equal(enemyWeaponStage({...e,windup:-.01}),3,'real warning overshoot stays urgent');
 }
 assert.equal(new Set(last).size,7,'seven physically distinct imminent silhouettes');
 assert.deepEqual([.92,.55,.27,.06].map(windup=>enemyWeaponStage({kind:'draugr',state:'warning',windup,flash:0,phase:1})),[0,1,2,3]);
 const a=mock(),b=mock();
 const w={kind:'warden',state:'charge',windup:-.02,phase:1,flash:0};
 paintEnemySagaWeapon(a.g,w,0,true);paintEnemySagaWeapon(b.g,{...w,phase:2},0,true);
 assert.notDeepEqual(a.calls,b.calls,'boss second phase grows genuinely different weapon forks');
 assert.throws(()=>enemyWeaponStage({...w,windup:NaN}),RangeError);
});
test('real runtime uses exactly one authored near-body weapon and retains authoritative world warnings',()=>{
 const get=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=get('../dist/js/scene/stage.js'),enemy=get('../dist/js/enemies/enemyArt.js');
 const atlas=get('../dist/js/scene/pixelSpriteAtlas.js'),sw=get('../dist/sw.js');
 const version=get('../dist/js/core/version.js');
 assert.match(stage,/paintSagaFloorFrieze\(/);
 assert.match(stage,/Number\(currentRoom\.id\.slice\(-2\)\)\s*-\s*1/);
 assert.match(atlas,/paintEnemySagaWeapon\(/);
 assert.doesNotMatch(atlas,/paintHostileKineticInk\(/,'old body-weapon overlay no longer muddies clear sprite');
 assert.doesNotMatch(enemy,/paintOathEnemyStrike\(/,'old extra weapon outline removed');
 assert.match(enemy,/runeWarning\(g, e, t\)/,'real dash, arrowhead, label, circular warning are all preserved');
 assert.match(enemy,/paintHostileAtlas\(/);
 assert.match(version,/APP_VERSION = '0\.09\.27'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(sw,/runegrave-shell-v0\.09\.27/);
 assert.ok(sw.includes('scene/sagaWeaponAtlas.js')&&sw.includes('scene/sagaFloorFrieze.js'));
 assert.equal(FIRST_SOUL_RELICS.length,8);assert.equal(FIRST_SOUL_ROOMS.length,25);
});
