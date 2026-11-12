import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAGA_MOSAICS,paintSagaStandards,paintSagaWayfarer,paintSagaEnemyStrike} from '../dist/js/scene/sagaArtwork.js';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function mock(){
 const ops=[];const g={};
 for(const method of ['save','restore','fillRect','beginPath','moveTo','lineTo','stroke','translate'])
  g[method]=(...a)=>ops.push([method,...a]);
 return {g,ops};
}
test('five original 12-row pixel mosaics and 25 room-specific stitch signatures',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(Object.keys(SAGA_MOSAICS).length,5);
 assert.equal(new Set(Object.values(SAGA_MOSAICS).map(rows=>rows.join(''))).size,5);
 const signatures=[];
 for(const [index,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintSagaStandards(a.g,420,235,0,room.family,index,true);
  paintSagaStandards(b.g,420,235,64,room.family,index,true);
  assert.deepEqual(a.ops,b.ops,'reduced motion must not pulse a hanging');
  assert.ok(a.ops.length>70&&a.ops.length<320,'world-space paint call budget');
  assert.equal(a.ops.filter(x=>x[0]==='save').length,a.ops.filter(x=>x[0]==='restore').length);
  assert.deepEqual(a.ops.filter(x=>x[0]==='translate').map(x=>x[1]),[82,338]);
  for(const p of a.ops.filter(x=>x[0]==='fillRect'))assert.ok(p[1]>=-24&&p[1]<=26,'standard must stay on perimeter');
  signatures.push(JSON.stringify(a.ops));
 }
 assert.equal(new Set(signatures).size,25);
 assert.throws(()=>paintSagaStandards(mock().g,420,235,1,'ASH',25,true),RangeError);
 assert.throws(()=>paintSagaStandards(mock().g,420,235,1,'VOID',0,true),RangeError);
});
test('all eight Wayfarer directional helmets are distinguishable and constrained',()=>{
 const directions=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
 const signatures=[];
 for(const [x,y] of directions){
  const pose=wayfarerPose(0,x,y,x,y,false);
  const a=mock(),b=mock();paintSagaWayfarer(a.g,pose,0,true);paintSagaWayfarer(b.g,pose,80,true);
  assert.deepEqual(a.ops,b.ops);
  assert.ok(a.ops.length<65);
  for(const p of a.ops.filter(c=>c[0]==='fillRect'))assert.ok(Math.abs(p[1])<=24&&Math.abs(p[2])<=40);
  signatures.push(JSON.stringify(a.ops));
 }
 assert.equal(new Set(signatures).size,8);
 const moving=wayfarerPose(0,1,0,1,0,false),s=[];
 for(const t of [0,.12,.24,.36]){const a=mock();paintSagaWayfarer(a.g,moving,t);s.push(JSON.stringify(a.ops));}
 assert.equal(new Set(s).size,4,'four grounded gait poses');
 const idle=wayfarerPose(0,0,0,0,1,false);
 const f1=mock(),f2=mock();paintSagaWayfarer(f1.g,idle,0);paintSagaWayfarer(f2.g,idle,1.0);
 assert.notDeepEqual(f1.ops,f2.ops,'subtle breathing pose');
});
test('seven attack gestures follow real remaining warning, not arbitrary clock time',()=>{
 const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'],signatures=[];
 for(const kind of kinds){
  const e={kind,state:'warning',windup:.3,phase:kind==='warden'?2:1};
  const a=mock(),b=mock(),idle=mock();
  paintSagaEnemyStrike(a.g,e,.2,true);paintSagaEnemyStrike(b.g,e,60,true);
  paintSagaEnemyStrike(idle.g,{...e,state:'idle'},.2,true);
  assert.deepEqual(a.ops,b.ops);assert.deepEqual(idle.ops,[]);
  assert.ok(a.ops.length>10&&a.ops.length<95);
  assert.equal(a.ops.filter(x=>x[0]==='save').length,1);
  assert.equal(a.ops.filter(x=>x[0]==='restore').length,1);
  signatures.push(JSON.stringify(a.ops));
 }
 assert.equal(new Set(signatures).size,7);
 for(const kind of kinds){
  const frames=[.9,.5,.3,.1].map(windup=>{const m=mock();paintSagaEnemyStrike(m.g,{kind,state:'warning',windup,phase:1},0);return JSON.stringify(m.ops);});
  assert.equal(new Set(frames).size,4,kind+' has four authentic warning frames');
 }
 const w1=mock(),w2=mock();
 paintSagaEnemyStrike(w1.g,{kind:'warden',state:'warning',windup:.1,phase:1},0,true);
 paintSagaEnemyStrike(w2.g,{kind:'warden',state:'warning',windup:.1,phase:2},0,true);
 assert.notDeepEqual(w1.ops,w2.ops);
});
test('new rendering module is cached; Gate A controls, saves and catalog remain locked',()=>{
 const version=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 const stage=readFileSync(new URL('../dist/js/scene/stage.js',import.meta.url),'utf8');
 const controls=readFileSync(new URL('../dist/js/input/twinStick.js',import.meta.url),'utf8');
 assert.match(version,/APP_VERSION = '0\.09\.42'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.42/);
 assert.ok(sw.includes('scene/sagaArtwork.js'));
 assert.ok(stage.includes('paintSagaStandards'));
 assert.ok(controls.includes('localStorage'));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
