import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {EIGHT_FACINGS,HERO_FRAME_COUNT,heroAnimFrame,paintWayfarerFrames} from '../dist/js/scene/wayfarerFrameArt.js';
import {ENEMY_ACTION_FRAMES,enemyActionFrame,paintEnemyActionFrame} from '../dist/js/enemies/attackPoseFrames.js';
import {VAULT_DEPTH_MOTIFS,paintVaultDepth} from '../dist/js/scene/vaultDepthArt.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function painter(){const calls=[],obj={};for(const k of ['save','restore','fillRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale'])obj[k]=(...a)=>calls.push([k,...a]);return {g:new Proxy(obj,{set(o,k,v){o[k]=v;return true}}),calls};}
test('four gait frames and eight facing poses produce distinct grounded Wayfarer artwork',()=>{
 assert.equal(HERO_FRAME_COUNT,4);assert.equal(EIGHT_FACINGS.length,8);const signatures=[];
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,pose=wayfarerPose(1.23,1,0,Math.cos(a),Math.sin(a),i%2===0);
  const p=painter();paintWayfarerFrames(p.g,pose,1.23);
  assert.equal(p.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(p.calls.filter(c=>c[0]==='restore').length,1);
  assert.ok(p.calls.length<45);
  signatures.push(JSON.stringify(p.calls));
 }
 assert.ok(new Set(signatures).size>=6);
 const pose=wayfarerPose(.3,1,1,1,0,false);
 assert.equal(new Set([0,.12,.24,.37].map(t=>heroAnimFrame(pose,t))).size,4);
 const quiet=painter();paintWayfarerFrames(quiet.g,pose,20,true);
 const quiet2=painter();paintWayfarerFrames(quiet2.g,pose,10,true);
 assert.deepEqual(quiet.calls,quiet2.calls,'reduced motion freezes cosmetic sprite frames');
 assert.throws(()=>heroAnimFrame(pose,NaN),/Invalid/);
});
test('six enemy species plus Warden animate different idle and pre-attack silhouettes',()=>{
 assert.equal(Object.keys(ENEMY_ACTION_FRAMES).length,7);
 const families=Object.keys(ENEMY_ACTION_FRAMES),signatures=[];
 for(const kind of families){
  const e={kind,state:'warning',phase:kind==='warden'?2:1,dx:.8,dy:-.6};
  assert.equal(enemyActionFrame(e,.23).stage,'windup');
  assert.equal(enemyActionFrame(e,.23).direction,'north');
  const p=painter();paintEnemyActionFrame(p.g,e,.23);
  assert.equal(p.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(p.calls.filter(c=>c[0]==='restore').length,1);
  assert.ok(p.calls.length<70,`${kind} draw-operation bound`);
  signatures.push(JSON.stringify(p.calls));
  assert.equal(enemyActionFrame({...e,state:'charge'},.23).stage,'strike');
  assert.equal(enemyActionFrame({...e,state:'idle'},.23).stage,'idle');
  const still1=painter(),still2=painter();paintEnemyActionFrame(still1.g,e,0,true);paintEnemyActionFrame(still2.g,e,15,true);
  assert.deepEqual(still1.calls,still2.calls,'reduced-motion enemy cosmetic frames are stable');
 }
 assert.equal(new Set(signatures).size,7);
 assert.throws(()=>enemyActionFrame({kind:'unknown',state:'warning',dx:1,dy:0},0),/Invalid/);
});
test('five family-specific edge vaults preserve the clear central dodge ring and draw budget',()=>{
 const families=Object.keys(VAULT_DEPTH_MOTIFS),signatures=[];
 assert.deepEqual(families,['ASH','IRON','ROOT','SPIRIT','FATE']);
 for(const f of families){
  const p=painter();paintVaultDepth(p.g,420,235,.34,f,4);
  assert.ok(p.calls.length>35&&p.calls.length<150,`${f} mobile draw budget`);
  assert.equal(p.calls.filter(c=>c[0]==='save').length,p.calls.filter(c=>c[0]==='restore').length);
  const rectangles=p.calls.filter(c=>c[0]==='fillRect');
  assert.ok(rectangles.every(c=>c[1]+c[3]<90||c[1]>330||c[3]<=30),`${f} shapes are outside center combat`);
  signatures.push(JSON.stringify(p.calls));
 }
 assert.equal(new Set(signatures).size,5);
 assert.throws(()=>paintVaultDepth(painter().g,420,235,Infinity,'ASH'),/Invalid/);
 assert.throws(()=>paintVaultDepth(painter().g,420,235,0,'UNSUPPORTED'),/Invalid/);
});
test('25 authored rooms and eight functional relics remain; no unauthorized roadmap advancement',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=readFileSync(new URL('../src/core/version.ts',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.43'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.43/);
 for(const file of ['js/scene/vaultDepthArt.js','js/scene/wayfarerFrameArt.js','js/enemies/attackPoseFrames.js']) assert.ok(sw.includes(file),file);
});
