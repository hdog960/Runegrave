import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {HOSTILE_ATLAS,paintHostileAtlas,paintHeroSagaMantle,WAYFARER_CLOAK_WEAVE} from '../dist/js/scene/pixelSpriteAtlas.js';
import {HOSTILE_BODY_GESTURES,inkedWindupBody} from '../dist/js/scene/sagaBodyLanguage.js';
import {VAULT_CANOPY_ARCHES,VAULT_CANOPY_MYTHS,VAULT_CANOPY_PALETTES,paintVaultCanopies} from '../dist/js/scene/sagaVaultCanopies.js';
const enemies=['draugr','wisp','archer','charger','sentinel','shade','warden'];
const facings=['N','NE','E','SE','S','SW','W','NW'];
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','translate','scale','fillRect'])
  g[op]=(...a)=>calls.push([op,...a]);
 return {g,calls};
}
test('21 independently inked in-place hostile BODY contours genuinely replace three torso rows and never invent a second actor',()=>{
 assert.deepEqual(Object.keys(HOSTILE_BODY_GESTURES),enemies);
 const encoded=new Set();
 for(const kind of enemies){
  const base=HOSTILE_ATLAS[kind],plan=HOSTILE_BODY_GESTURES[kind],all=[base.join('|')];
  assert.equal(plan.frames.length,3);
  for(let i=1;i<=3;i++){
   const body=inkedWindupBody(base,kind,i),unchanged=inkedWindupBody(base,kind,0);
   assert.strictEqual(unchanged,base,'idle keeps original sprite reference, no allocations');
   assert.notStrictEqual(body,base,'warning creates an actual body pose');
   assert.equal(body.length,base.length);
   const touched=body.map((r,j)=>r===base[j]?null:j).filter(x=>x!==null);
   assert.deepEqual(touched,[plan.at,plan.at+1,plan.at+2],kind+' three actual contiguous anatomy rows altered');
   const width=Math.max(...base.map(x=>x.length));
   for(const row of body){assert.ok(row.length<=width);assert.match(row,/^[. oabcegrs]+$/);}
   assert.equal(plan.frames[i-1].length,3);
   for(const stamp of plan.frames[i-1]){
    assert.match(stamp,/^[.oabcegrs]{4}\|[.oabcegrs]{4}$/);
   }
   encoded.add(kind+'|'+body.join('|'));all.push(body.join('|'));
  }
  assert.equal(new Set(all).size,4,'all three real windup body poses are physically distinct: '+kind);
  for(const state of ['idle','recover','hidden']){
   const actual=mock(),before=mock();
   paintHostileAtlas(actual.g,{kind,state,windup:-1/120,flash:0,phase:1},55,true);
   paintHostileAtlas(before.g,{kind,state,windup:0,flash:0,phase:1},0,true);
   assert.deepEqual(actual.calls,before.calls,'no false body-language warning during idle/recovery/hidden');
  }
  const realStages=new Set();
  for(const w of [.96,.54,.30,.06]){
   const g=mock();
   paintHostileAtlas(g.g,{kind,state:'warning',windup:w,flash:0,phase:1},2,true);
   assert.equal(g.calls.filter(x=>x[0]==='save').length,4,'the same original body/guard/weapon/face painter layers remain');
   assert.equal(g.calls.filter(x=>x[0]==='restore').length,4);
   realStages.add(JSON.stringify(g.calls));
  }
  assert.equal(realStages.size,4,'all seven foes have four truly distinct attack-body states');
 }
 assert.equal(encoded.size,21);
 assert.throws(()=>inkedWindupBody([], 'warden',3),RangeError);
 assert.throws(()=>inkedWindupBody(HOSTILE_ATLAS.warden,'warden',4),RangeError);
});
test('eight original woven Wayfarer mantle profiles visibly answer authentic four-beat gait',()=>{
 assert.deepEqual(Object.keys(WAYFARER_CLOAK_WEAVE),facings);
 const distinct=new Set();
 for(const f of facings){
  const design=WAYFARER_CLOAK_WEAVE[f];assert.equal(design.length,6);
  for(const r of design){assert.equal(r.length,9);assert.match(r,/^[.obg]+$/);}
  distinct.add(design.join('|'));
  const side=f.includes('W')?-1:f.includes('E')?1:0;
  const pose={facing:f,side,back:f.includes('N'),moving:true,recoil:0,aimX:side,aimY:f.includes('N')?-1:1};
  const actual=[0,.12,.24,.36].map(t=>{const a=mock();paintHeroSagaMantle(a.g,pose,t);return JSON.stringify(a.calls);});
  assert.equal(new Set(actual).size,4,f+' four authentic cloth positions');
  const reducedA=mock(),reducedB=mock();
  paintHeroSagaMantle(reducedA.g,pose,0,true);
  paintHeroSagaMantle(reducedB.g,pose,111,true);
  assert.deepEqual(reducedA.calls,reducedB.calls,'reduced-motion never drifts');
 }
 assert.equal(distinct.size,8,'eight directional hand-inked weaves');
});
test('25 canonical chamber canopies have 5 original masonry silhouettes x 5 authored saga glyphs, kept outside the middle fight',()=>{
 const families=['ASH','IRON','ROOT','SPIRIT','FATE'];
 assert.deepEqual(Object.keys(VAULT_CANOPY_ARCHES),families);
 assert.deepEqual(Object.keys(VAULT_CANOPY_PALETTES),families);
 assert.equal(VAULT_CANOPY_MYTHS.length,5);
 assert.equal(new Set(Object.values(VAULT_CANOPY_ARCHES).map(a=>a.join('|'))).size,5);
 assert.equal(new Set(VAULT_CANOPY_MYTHS.map(a=>a.join('|'))).size,5);
 for(const rows of Object.values(VAULT_CANOPY_ARCHES)){
  assert.ok(rows.length>=7);for(const r of rows){assert.equal(r.length,17);assert.match(r,/^[.#+]+$/);}
 }
 for(const rows of VAULT_CANOPY_MYTHS){assert.equal(rows.length,9);for(const r of rows){assert.equal(r.length,9);assert.match(r,/^[.#+]+$/);}}
 const scenes=new Set();
 for(const [serial,room] of FIRST_SOUL_ROOMS.entries()){
  assert.equal(Number(room.id.slice(-2))-1,serial);
  const a=mock(),b=mock();
  paintVaultCanopies(a.g,420,235,room.family,serial);
  paintVaultCanopies(b.g,420,235,room.family,serial);
  assert.deepEqual(a.calls,b.calls,'no flicker, in-world code does not depend on frame clock');
  assert.equal(a.g.globalAlpha,.56);
  assert.equal(a.calls.filter(x=>x[0]==='save').length,1);
  assert.equal(a.calls.filter(x=>x[0]==='restore').length,1);
  const shapes=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(shapes.length>50&&shapes.length<550,room.id+' draw-call budget');
  for(const [,x,y,w,h] of shapes){
   assert.ok((x>=58&&x+w<=100)||(x>=320&&x+w<=362),room.id+' outer wall only');
   assert.ok(y>=20&&y+h<=92,room.id+' keep upper masonry away from center combat');
   assert.ok(w>0&&h>0);
  }
  scenes.add(JSON.stringify(a.calls));
 }
 assert.equal(scenes.size,25);
 assert.throws(()=>paintVaultCanopies(mock().g,420,235,'ROOT',0),RangeError);
 assert.throws(()=>paintVaultCanopies(mock().g,420,235,'ASH',25),RangeError);
});
test('live renderers, 8 functional relics, 25 actual rooms, true world warnings, save and PWA stay intact at locked v0.09',()=>{
 const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=file('../dist/js/scene/stage.js');
 const atlas=file('../dist/js/scene/pixelSpriteAtlas.js');
 const enemiesSrc=file('../dist/js/enemies/enemyArt.js');
 const version=file('../dist/js/core/version.js');
 const sw=file('../dist/sw.js');
 assert.match(stage,/paintVaultCanopies\(/);
 assert.match(stage,/paintSagaPillars\(/);
 assert.match(atlas,/inkedWindupBody\(/);
 assert.match(atlas,/WAYFARER_CLOAK_WEAVE\[/);
 assert.match(enemiesSrc,/runeWarning\(g, e, t\)/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.29'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.29/);
 for(const fileName of ['sagaBodyLanguage.js','sagaVaultCanopies.js','sagaPillarRelief.js','sagaWeaponAtlas.js'])
  assert.ok(sw.includes(fileName),'offline requires actual authored module '+fileName);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
});
