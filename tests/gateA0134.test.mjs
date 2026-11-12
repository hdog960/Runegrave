import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {OATHSTAFF_FACINGS,OATHSTAFF_CARVINGS,OATHSTAFF_MATERIALS,OATHSTAFF_CELL,oathstaffGrip,paintWayfarerOathstaff} from '../dist/js/scene/sagaWayfarerOathstaff.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const VECTORS=[['N',0,-1],['NE',.70710678,-.70710678],['E',1,0],['SE',.70710678,.70710678],
 ['S',0,1],['SW',-.70710678,.70710678],['W',-1,0],['NW',-.70710678,-.70710678]];
function mock(){
 const calls=[],g={
 save(){calls.push(['save']);},restore(){calls.push(['restore']);},
 beginPath(){calls.push(['begin']);},moveTo(...v){calls.push(['move',...v]);},
 lineTo(...v){calls.push(['line',...v]);},stroke(){calls.push(['stroke']);},
 fillRect(...v){calls.push(['rect',...v]);},
 translate(...v){calls.push(['translate',...v]);}
 };
 for(const prop of ['lineWidth','strokeStyle','fillStyle'])Object.defineProperty(g,prop,{set(v){calls.push([prop,v]);}});
 return {g,calls};
}
const source=p=>readFileSync(new URL(p,import.meta.url),'utf8');
function painted(facing,held=false,time=0,moveX=0,moveY=0){
 const vector=VECTORS.find(a=>a[0]===facing);
 const pose=wayfarerPose(time,moveX,moveY,vector[1],vector[2],held);
 const {g,calls}=mock();paintWayfarerOathstaff(g,pose,held);
 return {pose,calls};
}
test('eight independently authored non-color-only 11×11 Norse oathstaff heads belong to the eight actual aim facings',()=>{
 assert.deepEqual(OATHSTAFF_FACINGS,['N','NE','E','SE','S','SW','W','NW']);
 assert.deepEqual(Object.keys(OATHSTAFF_CARVINGS),OATHSTAFF_FACINGS);
 assert.equal(OATHSTAFF_CELL,1.25);
 const seen=new Set();
 for(const facing of OATHSTAFF_FACINGS){
  const rows=OATHSTAFF_CARVINGS[facing];
  assert.equal(rows.length,11);
  assert.ok(rows.every(s=>s.length===11&&/^[.oigaws]+$/.test(s)),facing+' corrupted hand-carved rows');
  assert.ok(rows.join('').replace(/\./g,'').length>=25,facing+' must remain visible on a real iPhone');
  seen.add(rows.join('|'));
 }
 assert.equal(seen.size,8,'cannot claim 8 distinct artworks if silhouettes duplicate');
 for(const [key,value] of Object.entries(OATHSTAFF_MATERIALS))
  assert.match(value,/^#[a-f0-9]{6}$/i,'missing actual engraved material '+key);
});
test('eight authored weapons reflect exactly eight real aim facings; no user input, AI or new aim calculation',()=>{
 for(const [f,dx,dy] of VECTORS){
  const pose=wayfarerPose(0,0,0,dx,dy,false);
  assert.equal(pose.facing,f);
  const a=oathstaffGrip(pose);
  assert.equal(a.facing,f);
  assert.ok(Math.abs(a.x-dx*18)<1e-6);
  assert.ok(Math.abs(a.y-(dy*15-3))<1e-6);
  assert.equal(a.startX,pose.side<0?-5:5);
  assert.equal(a.startY,-3);
 }
});
test('one actual muzzle moves continuously with true analogue aim and unchanged genuine visual recoil',()=>{
 const p=wayfarerPose(0,0,0,.25,-.90,false);
 const a=oathstaffGrip(p);
 assert.equal(a.x,.25*18);
 assert.equal(a.y,-.90*15-3);
 // Aim angle is NOT forcibly snapped to 8 compass vectors in muzzle geometry.
 const q=wayfarerPose(0,0,0,.33,-.85,false);
 assert.notDeepEqual([a.x,a.y],[oathstaffGrip(q).x,oathstaffGrip(q).y]);
 const p2={...p,recoil:.5};
 const b=oathstaffGrip(p2);
 assert.ok(Math.abs(b.x-(.25*(18-1.5)))<1e-6);
 assert.ok(Math.abs(b.y-(-.90*(15-1.5)-3))<1e-6);
});
test('all 8 genuine actor-local production painters are deterministic and stay within compact weapon pixels',()=>{
 const distinct=new Set();
 for(const facing of OATHSTAFF_FACINGS){
  for(const fire of [false,true]){
   const one=painted(facing,fire),two=painted(facing,fire);
   assert.deepEqual(one.calls,two.calls,'no invented independent wall-clock animation');
   assert.deepEqual(one.calls[0],['save']);
   assert.deepEqual(one.calls.at(-1),['restore']);
   assert.equal(one.calls.filter(x=>x[0]==='stroke').length,3,'three original inlaid real-equipment shaft cuts');
   const rects=one.calls.filter(x=>x[0]==='rect');
   assert.ok(rects.length>=14&&rects.length<100,'no dense particle spam or unpaintably tiny stamp');
   assert.ok(rects.every(x=>x.slice(1).every(Number.isFinite)),'all actual pixels must be finite');
   assert.equal(one.calls.filter(x=>x[0]==='translate').length,1,'single attached world-space hero muzzle');
   const pos=one.calls.find(x=>x[0]==='translate');
   assert.ok(Math.hypot(pos[1],pos[2])<26);
   distinct.add(JSON.stringify(one.calls));
  }
 }
 assert.equal(distinct.size,16,'8 independent facings x actual held fire vs idle must look distinct');
});
test('actual firing only changes the attached staff-head core, never invents a projectile or aim cone',()=>{
 const idle=painted('N',false),fire=painted('N',true);
 const idleRect=idle.calls.filter(x=>x[0]==='rect'),heldRect=fire.calls.filter(x=>x[0]==='rect');
 assert.equal(heldRect.length-idleRect.length,2,'held attack gets only two small physical core pixels');
 assert.equal(fire.calls.filter(x=>x[0]==='translate').length,1);
 const text=source('../dist/js/scene/sagaWayfarerOathstaff.js');
 assert.ok(!/setTimeout|requestAnimationFrame|document\.|localStorage|drawImage|fillText/.test(text));
 assert.ok(!text.includes('Math.random'));
});
test('invalid physical aim and damage-grace-free art are rejected rather than drawing fake disconnected weapon heads',()=>{
 const base=wayfarerPose(0,0,0,0,-1,false);
 for(const bad of [{aimX:NaN},{aimY:Infinity},{aimX:3},{recoil:-1},{recoil:2},{facing:'INVALID'}])
  assert.throws(()=>oathstaffGrip({...base,...bad}),RangeError);
 const a=painted('E',false,1.5),b=painted('E',false,99);
 assert.deepEqual(a.calls,b.calls,'no animation while not holding fire');
});
test('shipping hero renderer calls new eight-way art rather than retaining generic 2-circle line tip',()=>{
 const scene=source('../dist/js/scene/sanctuaryArt.js');
 const origin=scene.search(/paintHeroAtlas\s*\(\s*g\s*,\s*pose\b/);
 const call=/paintWayfarerOathstaff\s*\(\s*g\s*,\s*pose\s*,\s*firing\s*\)/g;
 const all=[...scene.matchAll(call)];
 assert.ok(origin>0&&all.length===1&&all[0].index>origin,'actual compiled hero must paint the original sprite before exactly one new staff');
 assert.ok(!scene.includes("ellipse(g,hx-fx*recoil"),'no generic circular tip layered on the new premium head');
 assert.match(source('../js/scene/sanctuaryArt.js'),/paintWayfarerOathstaff\s*\(\s*g\s*,\s*pose\s*,\s*firing\s*\)/);
 assert.ok(source('../js/scene/sagaWayfarerOathstaff.js').includes('OATHSTAFF_CARVINGS'));
});
test('full Gate A game and locked controller/PWA acceptance remains unchanged',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=source('../dist/js/core/version.js');
 assert.match(version,/APP_VERSION = '0\.09\.46'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 const sw=source('../dist/sw.js');
 assert.equal(sw,source('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.46/);
 assert.ok(sw.includes('./js/scene/sagaWayfarerOathstaff.js'));
 assert.ok(sw.includes('ACTIVATE_UPDATE'),'PWA consent must remain');
 assert.ok(source('../dist/index.html').includes('grip grip-left')&&source('../dist/index.html').includes('grip grip-right'));
});
