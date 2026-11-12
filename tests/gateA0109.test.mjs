import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {CHAMBER_FATES,CHAMBER_FAMILY_SILHOUETTES,paintChamberSagaStones,paintRuneGateMechanism} from '../dist/js/scene/ageStoneArt.js';
function mock(){
 const ops=[],g={};
 for(const n of ['save','restore','fillRect','translate'])g[n]=(...args)=>ops.push([n,...args]);
 return {g,ops};
}
test('all 25 authored Norse monument scenes are distinct, monochrome-readable and positioned in side walls',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(CHAMBER_FATES.length,5);assert.equal(CHAMBER_FAMILY_SILHOUETTES.length,5);
 assert.equal(new Set(CHAMBER_FATES.map(a=>a.join(''))).size,5);
 const distinct=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock(),n=mock();
  paintChamberSagaStones(a.g,420,235,.2,room.family,i,true);
  paintChamberSagaStones(b.g,420,235,90,room.family,i,true);
  paintChamberSagaStones(n.g,420,235,.2,room.family,i,false);
  assert.deepEqual(a.ops,b.ops,'reduced motion freezes all chiseled fire/glass');
  assert.ok(a.ops.length>90&&a.ops.length<650,'bounded mobile painter budget');
  assert.deepEqual(a.ops.filter(x=>x[0]==='translate').map(x=>x[1]),[38,382]);
  assert.equal(a.ops.filter(x=>x[0]==='save').length,a.ops.filter(x=>x[0]==='restore').length);
  for(const x of a.ops.filter(x=>x[0]==='fillRect')){
   assert.ok(x[1]>=-20&&x[1]<=20,room.id+' footprint X');
   assert.ok(x[2]>=-36&&x[2]<=12,room.id+' footprint Y');
  }
  distinct.add(JSON.stringify(a.ops));
 }
 assert.equal(distinct.size,25,'the whole original family + saga inlay + pedestal must be visibly unique');
 assert.throws(()=>paintChamberSagaStones(mock().g,420,235,0,'ROOT',0,true),RangeError,'disallow wrong chapter number');
 assert.throws(()=>paintChamberSagaStones(mock().g,420,235,0,'ASH',25,true),RangeError,'unknown chapter');
});
test('physical locked door presents iron portcullis, open door actual clear throat',()=>{
 const shut=mock(),open=mock();
 paintRuneGateMechanism(shut.g,false);paintRuneGateMechanism(open.g,true);
 assert.notDeepEqual(shut.ops,open.ops);
 for(const run of [shut.ops,open.ops]){
  assert.ok(run.length>25&&run.length<110);
  assert.equal(run.filter(o=>o[0]==='save').length,1);
  assert.equal(run.filter(o=>o[0]==='restore').length,1);
  for(const p of run.filter(o=>o[0]==='fillRect')){
   assert.ok(p[1]>=-27&&p[1]<=27,'door only inside 56px physical portal');
   assert.ok(p[2]>=-28&&p[2]<=14,'door stays below label');
  }
 }
 assert.throws(()=>paintRuneGateMechanism(mock().g,1),TypeError);
});
test('compiled stage uses canonical fs-XX room serial rather than current run position',()=>{
 const stage=readFileSync(new URL('../dist/js/scene/stage.js',import.meta.url),'utf8');
 const door=readFileSync(new URL('../dist/js/scene/doorArt.js',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 const core=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(stage,/paintChamberSagaStones/);
 assert.match(stage,/Number\(currentRoom\.id\.slice\(-2\)\) - 1/);
 assert.ok(stage.includes('paintSagaStandards'));
 assert.match(door,/paintRuneGateMechanism\(g, open\)/);
 assert.ok(sw.includes('scene/ageStoneArt.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.46/);
 assert.match(core,/APP_VERSION = '0\.09\.46'/);
 assert.match(core,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(core,/ROADMAP_VERSION = 'v0\.09'/);
});
