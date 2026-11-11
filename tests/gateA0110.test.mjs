import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {EDDIC_FAMILIES,EDDIC_FACADES,EDDIC_CHAPTERS,paintEddicCornice,paintWayfarerOathGear,paintOathEnemyStrike} from '../dist/js/scene/eddicCornice.js';
const mock=()=>{
 const calls=[],ctx={};
 for(const name of ['save','restore','translate','fillRect','stroke','beginPath','lineTo','moveTo'])
  ctx[name]=(...args)=>calls.push([name,...args]);
 return {ctx,calls};
};
test('25 original upper-wall Eddic frescoes are family-authored, room-specific and upper-bound',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.deepEqual(EDDIC_FAMILIES,['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.equal(new Set(Object.values(EDDIC_FACADES).map(a=>a.join('|'))).size,5);
 assert.equal(new Set(EDDIC_CHAPTERS.map(a=>a.join('|'))).size,5);
 const scenes=new Set();
 for(const [index,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock(),motion=mock();
  paintEddicCornice(a.ctx,420,235,1.23,room.family,index,true);
  paintEddicCornice(b.ctx,420,235,95.8,room.family,index,true);
  paintEddicCornice(motion.ctx,420,235,6.5,room.family,index,false);
  assert.deepEqual(a.calls,b.calls,'reduced-motion fresco must remain still');
  assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
  assert.deepEqual(a.calls.filter(c=>c[0]==='translate'),[['translate',210,0]]);
  assert.ok(a.calls.length>115&&a.calls.length<660,'bounded pixel-drawing budget '+room.id);
  for(const [op,x,y,w,h] of a.calls.filter(c=>c[0]==='fillRect')){
   assert.ok(x>=-80&&x<=80,'top frieze x bound '+room.id+' '+x);
   assert.ok(y>=2&&y<=49,'top frieze y bound '+room.id+' '+y);
   assert.ok(w>0&&h>0&&y+h<=54,'no painted masonry enters action lane');
  }
  scenes.add(JSON.stringify(a.calls));
 }
 assert.equal(scenes.size,25,'five family silhouettes times five authored episode scenes');
 assert.throws(()=>paintEddicCornice(mock().ctx,420,235,0,'FATE',0),RangeError);
 assert.throws(()=>paintEddicCornice(mock().ctx,420,235,0,'ASH',25),RangeError);
});
test('eight grounded directional gear profiles and state-backed step/recoil marks',()=>{
 const directions=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
 const sig=[];
 for(const [x,y] of directions){
  const pose=wayfarerPose(.3,1,0,x,y,false),a=mock(),b=mock();
  paintWayfarerOathGear(a.ctx,pose,0,true);
  paintWayfarerOathGear(b.ctx,pose,100,true);
  assert.deepEqual(a.calls,b.calls);
  assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
  assert.ok(a.calls.length<50);
  for(const v of a.calls.filter(c=>c[0]==='fillRect'))assert.ok(Math.abs(v[1])<=18&&Math.abs(v[2])<=20);
  sig.push(JSON.stringify(a.calls));
 }
 assert.ok(new Set(sig).size>=4,'front/back/side and buckler stance differ');
 const step=wayfarerPose(.0,1,0,1,0,false);
 const frames=[0,.12,.24,.37].map(t=>{const a=mock();paintWayfarerOathGear(a.ctx,step,t);return JSON.stringify(a.calls)});
 assert.ok(new Set(frames).size>=3,'gait is real and bounded');
 const firing=wayfarerPose(.1,0,0,1,0,true);
 const idle=wayfarerPose(.1,0,0,1,0,false),a=mock(),b=mock();
 paintWayfarerOathGear(a.ctx,firing,0);paintWayfarerOathGear(b.ctx,idle,0);
 assert.notDeepEqual(a.calls,b.calls,'only actual recoil engraves brighter gauntlet');
});
test('seven authentic hostile attack symbols remain tied to four real windup bands',()=>{
 const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
 const signatures=[];
 for(const kind of kinds){
  const e={kind,state:'warning',windup:.3,phase:1,dx:1,dy:0},a=mock(),b=mock(),idle=mock();
  paintOathEnemyStrike(a.ctx,e,0,true);paintOathEnemyStrike(b.ctx,e,23,true);
  paintOathEnemyStrike(idle.ctx,{...e,state:'idle'},0,true);
  assert.deepEqual(a.calls,b.calls,'clock cannot fake imminent attack');
  assert.equal(idle.calls.length,0);
  assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
  assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
  assert.ok(a.calls.length>5&&a.calls.length<90);
  signatures.push(JSON.stringify(a.calls));
  const bands=[.95,.52,.32,.11].map(windup=>{const m=mock();paintOathEnemyStrike(m.ctx,{...e,windup},0,true);return JSON.stringify(m.calls);});
  assert.equal(new Set(bands).size,4,kind+' genuine pre-strike phases');
 }
 assert.equal(new Set(signatures).size,7,'seven meaningful equipment silhouettes, not palettes');
 const w1=mock(),w2=mock();
 for(const [ctx,phase] of [[w1.ctx,1],[w2.ctx,2]])
  paintOathEnemyStrike(ctx,{kind:'warden',state:'warning',windup:.11,phase,dx:0,dy:1},2,true);
 assert.notDeepEqual(w1.calls,w2.calls,'Warden second-phase fork is real geometry');
 assert.throws(()=>paintOathEnemyStrike(mock().ctx,{kind:'archer',state:'warning',windup:NaN,dx:1,dy:0,phase:1},0),RangeError);
});
test('actual compiled render paths, offline cache, controlled gates and schema survive',()=>{
 const c=path=>readFileSync(new URL(path,import.meta.url),'utf8');
 const stage=c('../dist/js/scene/stage.js'),hero=c('../dist/js/scene/sanctuaryArt.js');
 const enemies=c('../dist/js/enemies/enemyArt.js'),version=c('../dist/js/core/version.js'),sw=c('../dist/sw.js');
 assert.match(stage,/paintEddicCornice/);
 assert.match(stage,/Number\(currentRoom\.id\.slice\(-2\)\)/);
 assert.match(hero,/paintHeroAtlas/,'the new stronger atlas supersedes its former overlay');
 assert.doesNotMatch(hero,/paintWayfarerOathGear\(/,'old body overlays must not obscure the authored sprite');
 assert.match(enemies,/paintOathEnemyStrike/);
 assert.match(version,/APP_VERSION = '0\.09\.22'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.ok(sw.includes('scene/eddicCornice.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.22/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
