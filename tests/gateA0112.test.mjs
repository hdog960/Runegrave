import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {CHRONICLE_FAMILIES,CHRONICLE_FAMILY_STONES,CHRONICLE_EPISODES,paintChronicleFloor} from '../dist/js/scene/chronicleFloor.js';
import {WAYFARER_CLOAK_HEMS,kineticStrikeBand,paintWayfarerMovingHem,paintHostileKineticInk} from '../dist/js/scene/kineticInk.js';
function mock(){
 const ops=[],g={};
 for(const method of ['save','restore','fillRect','scale','translate'])g[method]=(...params)=>ops.push([method,...params]);
 return {g,ops};
}
const enemies=['draugr','wisp','archer','charger','sentinel','shade','warden'];
test('25 canonical chapter engravings combine five original family contours with five genuinely different pictograms',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.deepEqual([...CHRONICLE_FAMILIES],['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.equal(Object.keys(CHRONICLE_FAMILY_STONES).length,5);
 assert.equal(CHRONICLE_EPISODES.length,5);
 assert.equal(new Set(Object.values(CHRONICLE_FAMILY_STONES).map(x=>x.join('|'))).size,5);
 assert.equal(new Set(CHRONICLE_EPISODES.map(x=>x.join('|'))).size,5);
 const different=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintChronicleFloor(a.g,420,235,room.family,i,true);
  paintChronicleFloor(b.g,420,235,room.family,i,false);
  assert.deepEqual(a.ops,b.ops,room.id+' floor art stays static despite motion preference');
  assert.ok(a.ops.length>70&&a.ops.length<295,'mobile draw budget '+room.id);
  assert.equal(a.ops.filter(x=>x[0]==='save').length,1);
  assert.equal(a.ops.filter(x=>x[0]==='restore').length,1);
  for(const [method,x,y,w,h] of a.ops.filter(x=>x[0]==='fillRect')){
   assert.ok(x>=420/2-28&&x+w<=420/2+28,room.id+' confined to floor centerpiece X');
   const cy=Math.round(235*.69);
   assert.ok(y>=cy-24&&y+h<=cy+25,room.id+' confined to floor centerpiece Y');
  }
  assert.equal(a.g.globalAlpha,.57,'no fake neon attack rings');
  different.add(JSON.stringify(a.ops));
 }
 assert.equal(different.size,25,'all 25 produced different concrete engraving geometries');
 assert.throws(()=>paintChronicleFloor(mock().g,420,235,'ASH',5),RangeError);
 assert.throws(()=>paintChronicleFloor(mock().g,420,235,'IRON',25),RangeError);
});
test('walking armor has four genuinely distinct woven cloak positions and freezes in reduce motion',()=>{
 assert.equal(WAYFARER_CLOAK_HEMS.length,4);
 assert.equal(new Set(WAYFARER_CLOAK_HEMS.map(x=>JSON.stringify(x))).size,4);
 const pose={facing:'S',moving:true};
 const signatures=[];
 for(const t of [0,.12,.24,.37]){
  const {g,ops}=mock();paintWayfarerMovingHem(g,pose,t,false);
  assert.equal(ops.filter(x=>x[0]==='save').length,1);
  assert.equal(ops.filter(x=>x[0]==='restore').length,1);
  for(const c of ops.filter(x=>x[0]==='fillRect'))assert.ok(c[1]>=-16&&c[1]<=15&&c[2]>=9&&c[2]+c[4]<=26);
  signatures.push(JSON.stringify(ops));
 }
 assert.equal(new Set(signatures).size,4);
 const a=mock(),b=mock();
 paintWayfarerMovingHem(a.g,pose,0,true);
 paintWayfarerMovingHem(b.g,pose,99.8,true);
 assert.deepEqual(a.ops,b.ops,'reduced-motion hem is truly stationary');
});
test('seven species have unique four-phase body articulation synced ONLY to real warning/charge',()=>{
 const all=[];
 for(const kind of enemies){
  const phases=[];
  for(const windup of [.9,.5,.3,.04]){
   const e={kind,state:'warning',windup,phase:1};
   const a=mock(),b=mock();
   paintHostileKineticInk(a.g,e,0,true);
   paintHostileKineticInk(b.g,e,80,true);
   assert.deepEqual(a.ops,b.ops,'no cosmetic clock-based fake attack');
   assert.ok(a.ops.length>5&&a.ops.length<70);
   assert.equal(a.ops.filter(x=>x[0]==='save').length,1);
   assert.equal(a.ops.filter(x=>x[0]==='restore').length,1);
   phases.push(JSON.stringify(a.ops));
  }
  assert.equal(new Set(phases).size,4,kind+' physical pose must change with urgency');
  all.push(phases[3]);
  for(const state of ['idle','recover','hidden']){
   const inactive=mock();
   paintHostileKineticInk(inactive.g,{kind,state,windup:-1/120,phase:1},30,true);
   assert.equal(inactive.ops.length,0,kind+' idle/recover does not display a false tell');
  }
  assert.equal(kineticStrikeBand({kind,state:'warning',windup:-.001,phase:1}),3,'near-zero warning stays imminent');
 }
 assert.equal(new Set(all).size,7,'seven different strike mechanisms');
 const a=mock(),b=mock();
 paintHostileKineticInk(a.g,{kind:'warden',state:'warning',windup:.15,phase:1},0,true);
 paintHostileKineticInk(b.g,{kind:'warden',state:'warning',windup:.15,phase:2},0,true);
 assert.notDeepEqual(a.ops,b.ops,'boss phase two has an extra physical thorn');
 assert.throws(()=>kineticStrikeBand({kind:'wisp',state:'warning',windup:NaN,phase:1}),RangeError);
});
test('real compiled stage, hero, enemies, PWA all use new art without touching locked progression',()=>{
 const get=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=get('../dist/js/scene/stage.js'),atlas=get('../dist/js/scene/pixelSpriteAtlas.js');
 const sw=get('../dist/sw.js'),version=get('../dist/js/core/version.js');
 assert.match(stage,/paintChronicleFloor\(/);
 assert.match(stage,/Number\(currentRoom\.id\.slice\(-2\)\)\s*-\s*1/);
 assert.match(atlas,/paintWayfarerMovingHem\(/);
 assert.doesNotMatch(atlas,/paintHostileKineticInk\\(/,'retired duplicate body-weapon art must not reappear');
 assert.match(atlas,/paintEnemySagaWeapon\\(/);
 assert.match(sw,/runegrave-shell-v0\.09\.24/);
 assert.ok(sw.includes('scene/chronicleFloor.js'));
 assert.ok(sw.includes('scene/kineticInk.js'));
 assert.match(version,/APP_VERSION = '0\.09\.24'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
});
