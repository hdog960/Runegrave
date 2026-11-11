import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {FACE_DIRECTIONS,SAGA_VISORS,HOSTILE_FACEPLATES,paintWayfarerSagaVisor,paintHostileSagaFace} from '../dist/js/scene/sagaExpression.js';
import {DOOR_DIRECTIONS,DOOR_CARVINGS,doorArtState,paintSagaGate} from '../dist/js/scene/sagaGateArt.js';
import {SAGA_WEAR_MARKS,paintChronicleFloor} from '../dist/js/scene/chronicleFloor.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','fillRect','translate','scale'])
  g[op]=(...args)=>calls.push([op,...args]);
 return {g,calls};
}
const foes=['draugr','wisp','archer','charger','sentinel','shade','warden'];
test('Wayfarer has eight truly hand-authored and physically distinct compass-facing armour crests',()=>{
 assert.deepEqual([...FACE_DIRECTIONS],['N','NE','E','SE','S','SW','W','NW']);
 assert.deepEqual(Object.keys(SAGA_VISORS),[...FACE_DIRECTIONS]);
 assert.equal(new Set(Object.values(SAGA_VISORS).map(x=>x.join('|'))).size,8);
 const shapes=new Set();
 for(const facing of FACE_DIRECTIONS){
  const rows=SAGA_VISORS[facing];assert.equal(rows.length,11);
  for(const row of rows){
   assert.equal(row.length,15);assert.match(row,/^[.#aos+]+$/);
  }
  const p={...wayfarerPose(.31,1,0,0,1,false),facing,side:facing.endsWith('W')?-1:1,moving:true,recoil:0};
  const a=mock(),b=mock();
  paintWayfarerSagaVisor(a.g,p,.1,true);paintWayfarerSagaVisor(b.g,p,90,true);
  assert.deepEqual(a.calls,b.calls,'reduced-motion armor is stable');
  assert.equal(a.calls.filter(x=>x[0]==='save').length,1);
  assert.equal(a.calls.filter(x=>x[0]==='restore').length,1);
  assert.ok(a.calls.length>21&&a.calls.length<190);
  for(const v of a.calls.filter(x=>x[0]==='fillRect')){
    assert.ok(v[1]>=-18&&v[1]+v[3]<=18&&v[2]>=-28&&v[2]+v[4]<=4);
  }
  shapes.add(JSON.stringify(a.calls));
 }
 assert.equal(shapes.size,8,'all eight actual rendered crest shapes remain unique');
 const p={...wayfarerPose(.1,0,0,1,0,true),facing:'E',recoil:.6};
 const a=mock(),b=mock();
 paintWayfarerSagaVisor(a.g,p,.1,true);
 paintWayfarerSagaVisor(b.g,{...p,recoil:0},.1,true);
 assert.notDeepEqual(a.calls,b.calls,'real recoil bends actual weapon-side plated arm');
});
test('seven original enemy faceplates react to actual warning and damage, including safe negative recovery',()=>{
 assert.deepEqual(Object.keys(HOSTILE_FACEPLATES),foes);
 assert.equal(new Set(Object.values(HOSTILE_FACEPLATES).map(x=>x.join('|'))).size,7);
 const faces=new Set();
 for(const kind of foes){
  const rows=HOSTILE_FACEPLATES[kind];
  assert.equal(rows.length,5);
  for(const row of rows){assert.equal(row.length,9);assert.match(row,/^[.#oa+]+$/);}
  const e={kind,state:'idle',windup:-.008,flash:0,phase:1},base=mock(),still=mock(),warn=mock(),hit=mock();
  paintHostileSagaFace(base.g,e,12,true);paintHostileSagaFace(still.g,e,72,true);
  assert.deepEqual(base.calls,still.calls);
  paintHostileSagaFace(warn.g,{...e,state:'warning',windup:.12},12,true);
  paintHostileSagaFace(hit.g,{...e,flash:.3},12,true);
  assert.notDeepEqual(base.calls,warn.calls,kind+' actual warning narrows eyes');
  assert.notDeepEqual(base.calls,hit.calls,kind+' actual damage fractures visor');
  assert.ok(base.calls.length>10&&base.calls.length<135);
  assert.equal(base.calls.filter(x=>x[0]==='save').length,1);
  assert.equal(base.calls.filter(x=>x[0]==='restore').length,1);
  faces.add(JSON.stringify(base.calls));
 }
 assert.equal(faces.size,7);
 const a=mock(),b=mock();
 const boss={kind:'warden',state:'warning',windup:.1,phase:1,flash:0};
 paintHostileSagaFace(a.g,boss,0,true);
 paintHostileSagaFace(b.g,{...boss,phase:2},0,true);
 assert.notDeepEqual(a.calls,b.calls,'Warden phase two gets a new distinct crown');
 assert.throws(()=>paintHostileSagaFace(mock().g,{...boss,windup:NaN},0),RangeError);
});
test('four real-world gate directions have carved profiles and truly different barred versus open structure',()=>{
 assert.deepEqual([...DOOR_DIRECTIONS],['north','east','south','west']);
 assert.equal(doorArtState(true),'open');assert.equal(doorArtState(false),'barred');
 assert.throws(()=>doorArtState('open'),TypeError);
 assert.equal(new Set(Object.values(DOOR_CARVINGS).map(x=>x.join('|'))).size,4);
 const atlas=new Set(),dirState=[];
 for(const direction of DOOR_DIRECTIONS){
  const designs=[];
  for(const open of [false,true]){
   const a=mock(),b=mock();paintSagaGate(a.g,direction,open,1,true);paintSagaGate(b.g,direction,open,93,true);
   assert.deepEqual(a.calls,b.calls,'reduced motion has fixed real gate silhouette');
   assert.equal(a.calls.filter(x=>x[0]==='save').length,1);
   assert.equal(a.calls.filter(x=>x[0]==='restore').length,1);
   assert.ok(a.calls.length>80&&a.calls.length<250,'bounded four-compass door draw');
   for(const c of a.calls.filter(x=>x[0]==='fillRect')){
    assert.ok(c[1]>=-46&&c[1]+c[3]<=47&&c[2]>=-43&&c[2]+c[4]<=16,'gate stays within door face');
   }
   designs.push(a.calls.filter(x=>x[0]==='fillRect').map(x=>x.slice(1,5)).join('|'));
   atlas.add(JSON.stringify(a.calls));
  }
  assert.notEqual(designs[0],designs[1],'closed door bars must NOT match open corridor geometry');
  dirState.push(designs[0]);
 }
 assert.equal(atlas.size,8,'four directions times two states are geometrically distinct');
 assert.equal(new Set(dirState).size,4);
 assert.throws(()=>paintSagaGate(mock().g,'north',true,NaN),RangeError);
});
test('all 25 existing chapter carvings have individually authored in-bounds wear signatures',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const sig=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const marks=SAGA_WEAR_MARKS[room.family][i%5],a=mock();
  assert.ok(marks.length>=3&&marks.length<=5);
  for(const [x,y,w,h] of marks){
   assert.ok(x>=-26&&x+w<=27&&y>=-24&&y+h<=24);
  }
  sig.add(JSON.stringify(marks));
  paintChronicleFloor(a.g,420,235,room.family,i,true);
  assert.equal(a.calls.filter(x=>x[0]==='save').length,1);
  assert.equal(a.calls.filter(x=>x[0]==='restore').length,1);
  assert.ok(a.calls.length>72&&a.calls.length<325);
 }
 assert.equal(sig.size,25,'twenty-five bespoke chisel fracture profiles');
});
test('live compiled renderer preserves stateful door, hero/enemy ink and versioned PWA',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const door=read('../dist/js/scene/doorArt.js'),hero=read('../dist/js/scene/pixelSpriteAtlas.js');
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 const enemy=read('../dist/js/enemies/enemyArt.js'),stage=read('../dist/js/scene/stage.js');
 assert.match(door,/paintSagaGate\(g,\s*direction,\s*open,\s*time\)/,'only actual open flag selects artwork');
 assert.match(hero,/paintWayfarerSagaVisor\(/);
 assert.match(hero,/paintHostileSagaFace\(/);
 assert.match(enemy,/runeWarning\(g, e, t\)/,'genuine threat geometry remains used');
 assert.match(stage,/paintChronicleFloor\(/);
 assert.match(version,/APP_VERSION = '0\.09\.25'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(sw,/runegrave-shell-v0\.09\.25/);
 assert.ok(sw.includes('scene/sagaGateArt.js'));
 assert.ok(sw.includes('scene/sagaExpression.js'));
 assert.equal(FIRST_SOUL_RELICS.length,8);
});
