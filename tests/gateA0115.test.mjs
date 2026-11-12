import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {PIER_FAMILIES,PIER_STONE,PIER_SAGAS,paintSagaPillars} from '../dist/js/scene/sagaPillarRelief.js';
import {WAYFARER_MANTLE_STEPS,HOSTILE_GUARD_STITCHES,paintHeroSagaMantle,paintHostileSagaGuard,paintHeroAtlas,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
const face=['N','NE','E','SE','S','SW','W','NW'];
function mock(){
 const calls=[],g={};
 for(const f of ['save','restore','translate','scale','fillRect'])g[f]=(...a)=>calls.push([f,...a]);
 return {g,calls};
}
const pose=(f='S',moving=true,recoil=0)=>({facing:f,side:f.includes('W')?-1:f.includes('E')?1:0,back:f.includes('N'),moving,recoil,aimX:1,aimY:0});
test('25 original canonical room side-pier compositions stay in the world architecture and out of the fighting center',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.deepEqual(PIER_FAMILIES,['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.equal(new Set(Object.values(PIER_STONE).map(x=>x.join('|'))).size,5);
 assert.equal(new Set(PIER_SAGAS.map(x=>x.join('|'))).size,5);
 for(const pattern of Object.values(PIER_STONE)){
  assert.equal(pattern.length,10);
  for(const r of pattern){assert.equal(r.length,12);assert.match(r,/^[.#+]+$/);}
 }
 for(const rows of PIER_SAGAS){
  assert.equal(rows.length,7);
  for(const r of rows){assert.equal(r.length,7);assert.match(r,/^[.#+]+$/);}
 }
 const fingerprint=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintSagaPillars(a.g,420,235,room.family,i);paintSagaPillars(b.g,420,235,room.family,i);
  assert.deepEqual(a.calls,b.calls,'static authored masonry must not flicker');
  assert.equal(a.g.globalAlpha,.66);
  assert.equal(a.calls.filter(x=>x[0]==='save').length,1);
  assert.equal(a.calls.filter(x=>x[0]==='restore').length,1);
  const rects=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(rects.length>90&&rects.length<700,'efficient bounded hand-inked panels');
  for(const [,x,y,w,h] of rects){
   assert.ok(x>=11&&x+w<=409,room.id+' masonry inside world');
   assert.ok((x+w<=56)||(x>=364),room.id+' center must remain untouched');
   assert.ok(y>=51&&y+h<=110,room.id+' non-combat upper-wall band');
   assert.ok(w>0&&h>0);
  }
  fingerprint.add(JSON.stringify(a.calls));
 }
 assert.equal(fingerprint.size,25);
 assert.throws(()=>paintSagaPillars(mock().g,420,235,'ROOT',1),RangeError);
 assert.throws(()=>paintSagaPillars(mock().g,420,235,'ASH',25),RangeError);
});
test('Wayfarer wears four physical moving mantle panels, real facing/recoil state and reduced-motion stillness',()=>{
 assert.equal(WAYFARER_MANTLE_STEPS.length,4);
 assert.equal(new Set(WAYFARER_MANTLE_STEPS.map(x=>x.join('|'))).size,4);
 for(const rows of WAYFARER_MANTLE_STEPS){
  assert.equal(rows.length,9);
  for(const r of rows){assert.equal(r.length,11);assert.match(r,/^[obg.]+$/);}
 }
 for(const f of face){
  const steps=new Set();
  for(const t of [0,.12,.24,.36]){
   const a=mock();paintHeroSagaMantle(a.g,pose(f),t);
   assert.ok(a.calls.filter(x=>x[0]==='fillRect').length>14);
   steps.add(JSON.stringify(a.calls));
  }
  assert.equal(steps.size,4,f+' must have four genuinely different cloth shapes');
  const stillA=mock(),stillB=mock();
  paintHeroSagaMantle(stillA.g,pose(f),0,true);
  paintHeroSagaMantle(stillB.g,pose(f),120,true);
  assert.deepEqual(stillA.calls,stillB.calls);
  const idle=mock(),recoil=mock();
  paintHeroSagaMantle(idle.g,pose(f,false,0),0);
  paintHeroSagaMantle(recoil.g,pose(f,false,.8),0);
  assert.notDeepEqual(idle.calls,recoil.calls,'fired shot changes physical shoulder material');
 }
});
test('seven materially different body sigils, no fake strike in idle, true four-stage threat rivets',()=>{
 assert.deepEqual(Object.keys(HOSTILE_GUARD_STITCHES),kinds);
 assert.equal(new Set(Object.values(HOSTILE_GUARD_STITCHES).map(x=>x.join('|'))).size,7);
 for(const rows of Object.values(HOSTILE_GUARD_STITCHES)){
  assert.equal(rows.length,7);for(const r of rows){assert.equal(r.length,7);assert.match(r,/^[ogr.]+$/);}
 }
 for(const kind of kinds){
  const frames=new Set();
  for(const windup of [.95,.55,.30,.05]){
   const a=mock();paintHostileSagaGuard(a.g,{kind,state:'warning',windup,phase:1,flash:0});
   frames.add(JSON.stringify(a.calls));
  }
  assert.equal(frames.size,4,kind+' body armour must show four real danger states');
  const idle=mock(),recover=mock();
  paintHostileSagaGuard(idle.g,{kind,state:'idle',windup:0,phase:1,flash:0});
  paintHostileSagaGuard(recover.g,{kind,state:'recover',windup:-1/120,phase:1,flash:0});
  assert.deepEqual(idle.calls,recover.calls,'inactive states do not imply attack');
  assert.throws(()=>paintHostileSagaGuard(mock().g,{kind,state:'idle',windup:NaN,phase:1,flash:0}),RangeError);
 }
 const boss={kind:'warden',state:'charge',windup:-.01,phase:1,flash:0};
 const p1=mock(),p2=mock();paintHostileSagaGuard(p1.g,boss);
 paintHostileSagaGuard(p2.g,{...boss,phase:2});
 assert.notDeepEqual(p1.calls,p2.calls,'genuine phase-two boss crown and guard');
});
test('art is wired into actual game, all 25 chambers, eight functional relics and save schema remain',()=>{
 const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=file('../dist/js/scene/stage.js'),atlas=file('../dist/js/scene/pixelSpriteAtlas.js');
 const sw=file('../dist/sw.js'),version=file('../dist/js/core/version.js');
 assert.match(stage,/paintSagaPillars\(/);
 assert.match(stage,/Number\(currentRoom\.id\.slice\(-2\)\)\s*-\s*1/);
 assert.match(atlas,/paintHeroSagaMantle\(/);
 assert.match(atlas,/paintHostileSagaGuard\(/);
 assert.match(version,/APP_VERSION = '0\.09\.39'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.39/);
 assert.ok(sw.includes('scene/sagaPillarRelief.js'));
 assert.equal(FIRST_SOUL_RELICS.length,8);assert.equal(FIRST_SOUL_ROOMS.length,25);
 const src=file('../dist/js/enemies/enemyArt.js');
 assert.match(src,/runeWarning\(g, e, t, hero\)/,'original world-space attack warnings retained');
 assert.match(src,/paintHostileAtlas\(/);
});
