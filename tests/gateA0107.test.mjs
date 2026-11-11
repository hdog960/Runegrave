import test from 'node:test';
import assert from 'node:assert/strict';
import {paintVaultDepth} from '../dist/js/scene/vaultDepthArt.js';
import {paintWayfarerFrames} from '../dist/js/scene/wayfarerFrameArt.js';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {paintEnemyActionFrame,ENEMY_ACTION_FRAMES} from '../dist/js/enemies/attackPoseFrames.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function mock(){
 const calls=[];const o={};
 for(const name of ['save','restore','fillRect','beginPath','moveTo','lineTo','arc','ellipse','fill','stroke','translate','rotate','scale'])
  o[name]=(...args)=>calls.push([name,...args]);
 return {g:o,calls};
}
test('25 canonical family/cut galleries are visually unique, bounded and deterministic',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const seen=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();paintVaultDepth(a.g,420,235,2,room.family,i,true);paintVaultDepth(b.g,420,235,40,room.family,i,true);
  assert.deepEqual(a.calls,b.calls,'reduced-motion gallery must be still');
  assert.ok(a.calls.length<400,'gallery draw budget');
  assert.equal(a.calls.filter(x=>x[0]==='save').length,a.calls.filter(x=>x[0]==='restore').length);
  seen.add(JSON.stringify(a.calls));
 }
 assert.equal(seen.size,25,'five per-family carved contours must not collapse into recolors');
});
test('eight facing hero layers animate only from walking cadence and freeze on reduced motion',()=>{
 const dirs=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], seen=new Set();
 for(const [x,y] of dirs){const pose=wayfarerPose(.2,x,y,x,y,false),a=mock(),b=mock();
  paintWayfarerFrames(a.g,pose,.2,true);paintWayfarerFrames(b.g,pose,15,true);
  assert.deepEqual(a.calls,b.calls);assert.ok(a.calls.length<115);seen.add(JSON.stringify(a.calls));
 }
 assert.equal(seen.size,8);
 const moving=wayfarerPose(0,1,0,1,0,false),a=mock(),b=mock();
 paintWayfarerFrames(a.g,moving,.0);paintWayfarerFrames(b.g,moving,.24);
 assert.notDeepEqual(a.calls,b.calls);
});
test('seven attack silhouettes have real windup-only gesture frames, still reduced-motion',()=>{
 const seen=new Set();
 for(const kind of Object.keys(ENEMY_ACTION_FRAMES)){
  const enemy={kind,state:'warning',windup:.2,dx:1,dy:0,phase:1};
  const a=mock(),b=mock(),idle=mock();
  paintEnemyActionFrame(a.g,enemy,.2,true);paintEnemyActionFrame(b.g,enemy,12,true);
  paintEnemyActionFrame(idle.g,{...enemy,state:'idle'},.2,true);
  assert.deepEqual(a.calls,b.calls);
  assert.notDeepEqual(a.calls,idle.calls);assert.ok(a.calls.length<115);
  seen.add(JSON.stringify(a.calls));
 }
 assert.equal(seen.size,7);
});
