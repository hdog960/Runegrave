import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HOSTILE_RECOVERY_SILHOUETTES,recoveryGroundShift,enemyRecoveryFrame,inkedRecoveryBody} from '../dist/js/scene/sagaRecoveryInk.js';
import {HOSTILE_ATLAS,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {BASE_MASONRY,paintSanctuary} from '../dist/js/scene/sanctuaryArt.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const species=['charger','shade','warden'];
const full={charger:.65,shade:.32,warden:.48};
const e=(kind,f,state='recover',phase=1)=>({kind,windup:f,phase,state,flash:0});
function ctx(){
 const calls=[],g={};
 for(const op of ['save','restore','translate','scale','rotate','fillRect'])g[op]=(...args)=>calls.push([op,...args]);
 Object.defineProperty(g,'fillStyle',{set:v=>calls.push(['ink',v])});
 return {g,calls};
}
test('v0.09.36 physically recuts eleven rows across nine true enemy recovery bodies rather than old three-pixel twitch',()=>{
 assert.deepEqual(Object.keys(HOSTILE_RECOVERY_SILHOUETTES),species);
 let distinct=0;
 for(const kind of species){
  const design=HOSTILE_RECOVERY_SILHOUETTES[kind],original=HOSTILE_ATLAS[kind];
  assert.equal(design.frames.length,3);
  assert.ok(design.at>=4&&design.at+11<=original.length);
  const forms=[];
  for(const [frame,factor] of [.9,.5,.1].entries()){
   const cuts=design.frames[frame];
   assert.equal(cuts.length,11);
   assert.ok(cuts.every(k=>Number.isInteger(k)&&k>=0&&k<=5));
   const art=inkedRecoveryBody(original,e(kind,full[kind]*factor));
   assert.equal(art.length,original.length);
   assert.ok(art.every(x=>/^[. oabcegrs]+$/.test(x)));
   let changed=0,positive=0;
   for(let i=0;i<original.length;i++)if(art[i]!==original[i]){changed++;if(i>=design.at&&i<design.at+11)positive++;}
   assert.ok(changed>=5&&changed<=14,`${kind} stage ${frame} must be a substantial but bounded full-body pose: ${changed}`);
   assert.ok(positive>=3,'not just old 3 shoulder pixels');
   forms.push(art.join('|'));
  }
  assert.equal(new Set(forms).size,3,kind+' has three distinct full-body poses');
  distinct+=forms.length;
 }
 assert.equal(distinct,9);
});
test('actual recovery state drives grounded 4/2/0 pixel rise, never false warning or fake idle attack',()=>{
 for(const kind of species){
  for(const [factor,drop] of [[.9,4],[.5,2],[.1,0]]){
   const body=e(kind,full[kind]*factor);
   assert.equal(recoveryGroundShift(body),drop);
   const a=ctx(),b=ctx();paintHostileAtlas(a.g,body,0,true);paintHostileAtlas(b.g,body,123,true);
   assert.deepEqual(a.calls,b.calls,'no free-running decorative recover clock');
   const move=a.calls.find(x=>x[0]==='translate');
   assert.deepEqual(move,['translate',0,drop],'grounded rise inside same world-space actor');
   const rects=a.calls.filter(x=>x[0]==='fillRect');
   assert.ok(rects.length>35&&rects.length<450);
  }
  for(const state of ['idle','warning','charge']){
   const normal=e(kind,.1,state);
   assert.equal(recoveryGroundShift(normal),0,'no displaced actor on a dangerous windup');
   assert.strictEqual(inkedRecoveryBody(HOSTILE_ATLAS[kind],normal),HOSTILE_ATLAS[kind]);
  }
 }
 assert.equal(recoveryGroundShift(e('warden',.25,'recover',2)),4);
 assert.equal(recoveryGroundShift(e('warden',.14,'recover',2)),2);
 assert.equal(recoveryGroundShift(e('warden',.02,'recover',2)),0);
 for(const kind of ['draugr','wisp','archer','sentinel']){
  assert.equal(enemyRecoveryFrame(e(kind,.1)),-1);
  assert.equal(recoveryGroundShift(e(kind,.1)),0);
 }
 assert.throws(()=>recoveryGroundShift(e('warden',NaN)),RangeError);
});
test('re-authored large quiet-masonry ground keeps five real family palettes without introducing world/UI actors',()=>{
 assert.deepEqual(Object.keys(BASE_MASONRY),['ROOT','ASH','IRON','SPIRIT','FATE']);
 const s=readFileSync(new URL('../dist/js/scene/sanctuaryArt.js',import.meta.url),'utf8');
 assert.match(s,/const stoneW = 48, stoneH = 36|const stoneW=48,stoneH=36/,'larger flagship 48×36 stones');
 assert.match(s,/floorHash\(col, row\)|floorHash\(col,row\)/,'deterministic authored stones');
 assert.match(s,/createRadialGradient\(W \* \.5, H \* \.54|createRadialGradient\(W\*\.5,H\*\.54/,'central color quiet zone');
 assert.ok(!s.includes('n < 2 ? p.slabLit'), 'old high-frequency floor eliminated');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
});
test('Gate A v0.09, PWA user consent, schema one, external thumb controls and original first-soul gameplay stay locked',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js'),stage=read('../dist/js/scene/stage.js');
 assert.match(version,/APP_VERSION = '0\.09\.36'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.36/);
 assert.ok(sw.includes('./js/scene/sagaRecoveryInk.js'));
 assert.match(stage,/drawEncounter\(/);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
});
