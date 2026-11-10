import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {wayfarerFacing,wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {ENEMY_GESTURES,gestureIntensity,drawEnemyGesture} from '../dist/js/enemies/gestureArt.js';
import {FLOOR_TRIMS,paintFamilyTrim} from '../dist/js/scene/familyTrim.js';
import {doorEntryArrow,drawRuneDoor} from '../dist/js/scene/doorArt.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {ENEMY_KINDS} from '../dist/js/enemies/encounters.js';
function mock(){
 const calls=[];const obj={canvas:{width:840,height:420},getTransform:()=>({a:2,d:2})};
 for(const name of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText'])obj[name]=(...a)=>calls.push([name,...a]);
 return {g:new Proxy(obj,{set(target,key,val){calls.push(['set',key,val]);target[key]=val;return true;}}),calls};
}
test('Wayfarer has eight real directional poses and stable reduced-motion frame',()=>{
 const v=['E','SE','S','SW','W','NW','N','NE'];
 for(let k=0;k<8;k++){
  const theta=k*Math.PI/4,x=Math.cos(theta),y=Math.sin(theta);
  assert.equal(wayfarerFacing(x,y),v[k]);
  const p=wayfarerPose(.33,0,0,x,y,false);
  assert.equal(p.facing,v[k]);assert.equal(p.moving,false);assert.equal(p.recoil,0);
 }
 assert.equal(wayfarerFacing(0,0),'S');
 const rest=wayfarerPose(0,0,0,0,0,false);
 assert.deepEqual(rest,wayfarerPose(0,0,0,0,0,false));
 assert.equal(rest.bootLeft,0);assert.equal(rest.cape,0);
 const moving=wayfarerPose(.2,0,1,1,0,false);
 assert.equal(moving.facing,'E');assert.equal(moving.moving,true);
 assert.notEqual(moving.bootLeft,moving.bootRight);
 assert.ok(wayfarerPose(.08,0,1,1,0,true).recoil>0);
 assert.throws(()=>wayfarerPose(NaN,1,0,1,0,true));
 assert.throws(()=>wayfarerFacing(Infinity,0));
});
test('all seven enemies have distinct gesture silhouettes and warning poses',()=>{
 const names=[...ENEMY_KINDS,'warden'];
 assert.equal(names.length,7);
 assert.deepEqual(new Set(names),new Set(Object.keys(ENEMY_GESTURES)));
 assert.equal(new Set(Object.values(ENEMY_GESTURES)).size,7);
 const signatures=[];
 for(const name of names){
   const {g,calls}=mock();drawEnemyGesture(g,name,'warning',2,.41);
   assert.ok(calls.length>=8,`${name} gesture needs real drawing commands`);
   assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
   signatures.push(calls.map(x=>JSON.stringify(x)).join('|'));
 }
 assert.equal(new Set(signatures).size,7);
 assert.equal(gestureIntensity('warning',1,0),1);
 assert.ok(gestureIntensity('idle',1,.5)<.4);
 assert.throws(()=>gestureIntensity('idle',0,Infinity));
 assert.throws(()=>drawEnemyGesture(mock().g,'wrong-kind','idle',1,0));
});
test('five original floor trim schemes render distinct patterns with bounded work per frame',()=>{
 assert.equal(Object.keys(FLOOR_TRIMS).length,5);
 const signatures=[];
 for(const family of Object.keys(FLOOR_TRIMS)){
   const room=FIRST_SOUL_ROOMS.find(x=>x.family===family);
   assert.ok(room,`${family} needs a real authored room`);
   const {g,calls}=mock();paintFamilyTrim(g,420,225,0,room);
   assert.ok(calls.length>20&&calls.length<500,`${family} trim cost ${calls.length}`);
   assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
   signatures.push(calls.map(x=>JSON.stringify(x)).join('|'));
 }
 assert.equal(new Set(signatures).size,5);
 assert.throws(()=>paintFamilyTrim(mock().g,420,225,0,{family:'WRONG',id:'test'}));
});
test('north/south/east/west entrance arrows point toward real collision gate',()=>{
 for(const [direction,x,y] of [['north',0,-8],['south',0,8],['east',8,0],['west',-8,0]]){
  const [tip,a,b]=doorEntryArrow(direction,34);
  assert.equal(tip.x-(a.x+b.x)/2,x*13/8);
  assert.equal(tip.y-(a.y+b.y)/2,y*13/8);
  const {g,calls}=mock();drawRuneDoor(g,{x:210,y:129},direction,true,0);
  assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
  assert.ok(calls.filter(x=>x[0]==='fill').length>=2,'real floor arrow triangles painted');
 }
 assert.throws(()=>doorEntryArrow('north',NaN));
});
test('v0.09.7 remains an unapproved Gate A polish patch, with all relics and PWA modules intact',()=>{
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const v=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);assert.match(v,/APP_VERSION = '0\.09\.11'/);
 assert.match(v,/\['v0\.09', 'v0\.39', 'v0\.79', 'v0\.99'\]/);
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(sw,/runegrave-shell-v0\.09\.11/);
 for(const mod of ['js/scene/wayfarerMotion.js','js/enemies/gestureArt.js','js/scene/familyTrim.js']){
  assert.ok(sw.includes(mod),`missing offline asset ${mod}`);
  assert.ok(existsSync(new URL(`../dist/${mod}`,import.meta.url)));
 }
 const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.rune-socket\[data-held="true"\] \.rune-disc/);
 assert.match(css,/pointer:coarse/);
});
