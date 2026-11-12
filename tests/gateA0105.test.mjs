import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {HERO_SILHOUETTE_VARIANTS,heroSilhouette,paintHeroActionSilhouette} from '../dist/js/scene/heroActionSilhouette.js';
import {ATTACK_STANCES,strikePose,paintStrikeSilhouette} from '../dist/js/enemies/strikeSilhouettes.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function mock(){const calls=[];const g={};for(const key of ['save','restore','fillRect','beginPath','moveTo','lineTo','closePath','fill','stroke'])g[key]=(...args)=>calls.push([key,...args]);return {g,calls};}
test('eight Wayfarer facings with four moving frames remain visual-only',()=>{
 const dirs=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
 assert.equal(Object.keys(HERO_SILHOUETTE_VARIANTS).length,8);
 const faces=new Set(dirs.map(([x,y])=>wayfarerPose(0,x,y,x,y,false).facing));
 assert.equal(faces.size,8);
 const p=wayfarerPose(0,1,0,1,0,false);
 assert.deepEqual([0,.13,.26,.39].map(t=>heroSilhouette(p,t).frame),[0,1,2,3]);
});
test('hero silhouettes stay bounded and freeze under reduced motion',()=>{
 const traces=[];
 for(const [x,y] of [[-1,0],[1,0],[0,-1],[0,1]]){
  const pose=wayfarerPose(0,x,y,x,y,false),{g,calls}=mock();paintHeroActionSilhouette(g,pose,.3);traces.push(JSON.stringify(calls));
  assert.ok(calls.length<55);assert.equal(calls.filter(c=>c[0]==='save').length,1);assert.equal(calls.filter(c=>c[0]==='restore').length,1);
  for(const c of calls.filter(c=>c[0]==='fillRect'))assert.ok(Math.abs(c[1])<28&&Math.abs(c[2])<28);
 }
 assert.ok(new Set(traces).size>=3);
 const p=wayfarerPose(0,1,0,1,0,true),a=mock(),b=mock();
 paintHeroActionSilhouette(a.g,p,0,true);paintHeroActionSilhouette(b.g,p,12,true);assert.deepEqual(a.calls,b.calls);
});
test('all seven old enemy types have distinct visible attack silhouettes',()=>{
 assert.equal(Object.keys(ATTACK_STANCES).length,7);
 const seen=[];
 for(const kind of Object.keys(ATTACK_STANCES)){
  const {g,calls}=mock();paintStrikeSilhouette(g,{kind,state:'warning',windup:.18},.4);seen.push(JSON.stringify(calls));
  assert.ok(calls.length>6&&calls.length<100);assert.equal(calls.filter(c=>c[0]==='save').length,1);
 }
 assert.equal(new Set(seen).size,7);
});
test('attack poses follow real remaining windup, not decorative time',()=>{
 const e={kind:'charger',state:'warning',windup:.75};
 assert.deepEqual([.75,.5,.25,.08].map(w=>strikePose({...e,windup:w},10).ready),[0,1,2,3]);
 assert.equal(strikePose({...e,state:'idle'},15).active,false);
 const idle=mock();paintStrikeSilhouette(idle.g,{...e,state:'idle'},5);assert.equal(idle.calls.length,0);
 const a=mock(),b=mock();paintStrikeSilhouette(a.g,{...e,windup:.12},0,true);paintStrikeSilhouette(b.g,{...e,windup:.12},50,true);assert.deepEqual(a.calls,b.calls);
 assert.throws(()=>strikePose({...e,windup:-1},1),RangeError);
});
test('v0.09.45 PWA caches animation modules; eight relics, 25 rooms and gates stay locked',()=>{
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 const ver=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(sw,/runegrave-shell-v0\.09\.45/);
 assert.ok(sw.includes('scene/heroActionSilhouette.js'));assert.ok(sw.includes('enemies/strikeSilhouettes.js'));
 assert.match(ver,/ROADMAP_VERSION = 'v0\.09'/);assert.match(ver,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(ver,/v0\.09.*v0\.39.*v0\.79.*v0\.99/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
