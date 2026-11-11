import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {ENEMY_WEAPON_ANTICIPATION,WEAPON_SAGA_KINDS,paintEnemySagaWeapon} from '../dist/js/scene/sagaWeaponAtlas.js';
import {WAYFARER_OATH_STANCES,paintWayfarerOathStance} from '../dist/js/scene/pixelSpriteAtlas.js';
import {PIER_FAMILIES,PIER_CROWN_ARCH,PIER_CHAPTER_HINGES,paintSagaPillars} from '../dist/js/scene/sagaPillarRelief.js';
const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
const facings=['N','NE','E','SE','S','SW','W','NW'];
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','scale','translate','fillRect'])g[op]=(...a)=>calls.push([op,...a]);
 return {g,calls};
}
const hero=(f='S',moving=false,recoil=0)=>({facing:f,back:f.includes('N'),side:f.includes('W')?-1:f.includes('E')?1:0,moving,recoil,aimX:0,aimY:1});
test('21 real species-authored weapon extensions are pixel-defined and all 28 attack states are unique',()=>{
 assert.deepEqual([...WEAPON_SAGA_KINDS],kinds);
 assert.deepEqual(Object.keys(ENEMY_WEAPON_ANTICIPATION),kinds);
 const authored=new Set(),rendered=new Set();
 for(const kind of kinds){
  const poses=ENEMY_WEAPON_ANTICIPATION[kind];
  assert.equal(poses.length,3,kind+' must have three new authored phases after original rest sheet');
  for(const shape of poses){
   assert.equal(shape.length,7,kind+' 7-row combat contour');
   for(const row of shape){
    assert.equal(row.length,14,kind+' fixed-width 2px sprite sheet');
    assert.match(row,/^[.o#+]+$/);
   }
   authored.add(shape.join('|'));
  }
  for(const windup of [.96,.55,.31,.05]){
   const e={kind,state:'warning',windup,phase:1,flash:0};
   const first=mock(),same=mock();
   paintEnemySagaWeapon(first.g,e,0,true);paintEnemySagaWeapon(same.g,e,99,true);
   assert.deepEqual(first.calls,same.calls,'true windup alone, no fake time-loop');
   assert.equal(first.calls.filter(x=>x[0]==='save').length,1);
   assert.equal(first.calls.filter(x=>x[0]==='restore').length,1);
   for(const [op,x,y,w,h] of first.calls.filter(x=>x[0]==='fillRect')){
    assert.ok(x>=-16&&x+w<=55,'enemy weapon remains in true actor space');
    assert.ok(y>=-50&&y+h<=17,'weapon remains within original sprite art footprint');
    assert.ok(w>0&&h>0);
   }
   rendered.add(kind+'|'+JSON.stringify(first.calls));
  }
  const empty=mock();
  for(const state of ['idle','recover','hidden']){
   paintEnemySagaWeapon(empty.g,{kind,state,windup:-1/120,flash:0,phase:1},100);
  }
  assert.equal(empty.calls.length,0,'no inactive phantom strikes');
 }
 assert.equal(authored.size,21,'none of the new battle forms may be duplicated');
 assert.equal(rendered.size,28,'28 complete body-weapon countdown forms must be unique');
 const baseline={kind:'warden',state:'charge',windup:-.01,phase:1,flash:0};
 const before=mock(),after=mock();
 paintEnemySagaWeapon(before.g,baseline,0,true);
 paintEnemySagaWeapon(after.g,{...baseline,phase:2},0,true);
 assert.notDeepEqual(before.calls,after.calls,'Rootbound Warden phase two has extra antlers');
});
test('eight bespoke Wayfarer upper-body masks react to actual facing, gait and fired shots',()=>{
 assert.deepEqual(Object.keys(WAYFARER_OATH_STANCES),facings);
 assert.equal(new Set(Object.values(WAYFARER_OATH_STANCES).map(x=>x.join('|'))).size,8);
 for(const [f,rows] of Object.entries(WAYFARER_OATH_STANCES)){
  assert.equal(rows.length,8);
  for(const row of rows){assert.equal(row.length,13);assert.match(row,/^[.ohHgGBw]+$/);}
  const a=mock(),b=mock(),shoot=mock(),moving=mock();
  paintWayfarerOathStance(a.g,hero(f),0);
  paintWayfarerOathStance(b.g,hero(f),150,true);
  assert.deepEqual(a.calls,b.calls,'reduced-motion idle stable across clocks');
  paintWayfarerOathStance(shoot.g,hero(f,false,.75),0);
  paintWayfarerOathStance(moving.g,hero(f,true,0),.12);
  assert.notDeepEqual(a.calls,shoot.calls,'real shooting recoil raises bracer');
  assert.notDeepEqual(a.calls,moving.calls,'actual movement cadence shifts shoulder');
  for(const [,x,y,w,h] of a.calls.filter(x=>x[0]==='fillRect')){
   assert.ok(x>=-19&&x+w<=29&&y>=-35&&y+h<=23);
  }
 }
});
test('five sculpted material pediments and five separate story keystones remain bounded and legible in the actual 25 rooms',()=>{
 assert.deepEqual(PIER_FAMILIES,['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.equal(new Set(Object.values(PIER_CROWN_ARCH).map(x=>x.join('|'))).size,5);
 assert.equal(new Set(PIER_CHAPTER_HINGES.map(x=>x.join('|'))).size,5);
 for(const rows of Object.values(PIER_CROWN_ARCH)){assert.equal(rows.length,6);for(const row of rows){assert.equal(row.length,9);assert.match(row,/^[.#+]+$/);}}
 for(const rows of PIER_CHAPTER_HINGES){assert.equal(rows.length,4);for(const row of rows){assert.equal(row.length,9);assert.match(row,/^[.#+]+$/);}}
 const fingerprints=new Set();
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 for(const [serial,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintSagaPillars(a.g,420,235,room.family,serial);
  paintSagaPillars(b.g,420,235,room.family,serial);
  assert.deepEqual(a.calls,b.calls,'no independent decorative clock');
  const points=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(points.length>100&&points.length<800);
  for(const [,x,y,w,h] of points){
   assert.ok((x>=11&&x+w<=56)||(x>=364&&x+w<=409),room.id+' keep fighting center open');
   assert.ok(y>=51&&y+h<=110,room.id+' keep stonework inside upper side wall');
   assert.ok(w>0&&h>0);
  }
  fingerprints.add(JSON.stringify(a.calls));
 }
 assert.equal(fingerprints.size,25);
});
test('the original combat warning, all eight functional relics, save/PWA and v0.09 art gate remain locked',()=>{
 const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=file('../dist/js/scene/stage.js');
 const atlas=file('../dist/js/scene/pixelSpriteAtlas.js');
 const enemies=file('../dist/js/enemies/enemyArt.js');
 const sw=file('../dist/sw.js');
 const version=file('../dist/js/core/version.js');
 assert.match(stage,/paintSagaPillars\(/);
 assert.match(atlas,/paintWayfarerOathStance\(/);
 assert.match(atlas,/paintEnemySagaWeapon\(/);
 assert.match(enemies,/runeWarning\(g, e, t\)/);
 assert.match(version,/APP_VERSION = '0\.09\.32'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.32/);
 for(const art of ['sagaWeaponAtlas.js','sagaPillarRelief.js','pixelSpriteAtlas.js'])
  assert.ok(sw.includes(art),'PWA needs original artwork '+art);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
});
