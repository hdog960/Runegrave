import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {WAYFARER_ATLAS,WAYFARER_GAITS,HOSTILE_ATLAS,PIXEL_ATLAS_KINDS,ATLAS_CELL,heroAtlasFrame,enemyAtlasBand,paintHeroAtlas,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {paintOathEnemyStrike} from '../dist/js/scene/eddicCornice.js';
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','translate','scale','fillRect','beginPath','ellipse','fill'])
  g[op]=(...params)=>calls.push([op,...params]);
 return {g,calls};
}
const enemies=['draugr','wisp','archer','charger','sentinel','shade','warden'];
const dirs=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
test('the ink atlas is seven actually authored enemy sheets + four hero silhouettes, not noisy overlays',()=>{
 assert.equal(ATLAS_CELL,2);
 assert.equal(Object.keys(WAYFARER_ATLAS).length,4);
 assert.equal(WAYFARER_GAITS.length,4);
 assert.deepEqual([...PIXEL_ATLAS_KINDS],enemies);
 assert.equal(new Set(Object.values(WAYFARER_ATLAS).map(x=>x.join('|'))).size,4);
 assert.equal(new Set(Object.values(HOSTILE_ATLAS).map(x=>x.join('|'))).size,7);
 for(const [kind,sheet] of Object.entries(HOSTILE_ATLAS)){
   assert.ok(sheet.length>=17&&sheet.length<=26,kind+' physical image height');
   for(const row of sheet){assert.match(row,/^[. oabcegrs]+$/,kind+' palette symbols');assert.ok(row.length<=22);}
 }
 for(const sheet of Object.values(WAYFARER_ATLAS)){
   assert.equal(sheet.length,20);
   for(const row of sheet){assert.match(row,/^[.obhHmMbBgGwers]+$/);assert.ok(row.length<=22);}
 }
 for(const rows of WAYFARER_GAITS){assert.equal(rows.length,7);}
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
test('eight hero facings and four distinctly planted foot positions are drawn, grounded and still when requested',()=>{
 const facingImages=[];
 for(const [dx,dy] of dirs){
   const p=wayfarerPose(.3,1,0,dx,dy,false);
   const a=mock(),b=mock();
   paintHeroAtlas(a.g,p,.23,true);paintHeroAtlas(b.g,p,99.5,true);
   assert.deepEqual(a.calls,b.calls,'reduced-motion hero is still');
   assert.equal(a.calls.filter(x=>x[0]==='save').length,5,'body, moving hem, eight-way shoulder silhouette, visor and four-beat mantle each isolate canvas state');
   assert.equal(a.calls.filter(x=>x[0]==='restore').length,5);
   assert.ok(a.calls.length>65&&a.calls.length<460);
   for(const c of a.calls.filter(x=>x[0]==='fillRect')){
     assert.ok(c.slice(1,5).every(Number.isFinite));
     assert.ok(Math.abs(c[1])<33&&c[2]>=-34&&c[2]<=26,'hero + moving hem remain inside actor outline');
   }
   facingImages.push(JSON.stringify(a.calls));
 }
 assert.equal(new Set(facingImages).size,8,'the silhouette genuinely changes in all eight facings');
 const p=wayfarerPose(0,1,0,1,0,false);
 const frames=[0,.12,.24,.37].map(t=>{
   const m=mock();paintHeroAtlas(m.g,p,t);return JSON.stringify(m.calls);
 });
 assert.equal(new Set(frames).size,4,'all four footfall sprites distinguishable');
 assert.deepEqual([0,.12,.24,.37].map(t=>heroAtlasFrame(p,t)),[0,1,2,3]);
 const shooting=wayfarerPose(.1,1,0,1,0,true);
 const idle=wayfarerPose(.1,1,0,1,0,false);
 const a=mock(),b=mock();paintHeroAtlas(a.g,shooting,.1);paintHeroAtlas(b.g,idle,.1);
 assert.notDeepEqual(a.calls,b.calls,'real firing recoil adds forge light');
});
test('six enemy kinds and Warden possess bounded original pixel geometry, readable four-band attacks',()=>{
 const stamps=new Set();
 for(const kind of enemies){
  const e={kind,state:'idle',windup:1,phase:1,flash:0};
  const a=mock(),b=mock();
  paintHostileAtlas(a.g,e,0,true);paintHostileAtlas(b.g,e,90,true);
  assert.deepEqual(a.calls,b.calls,'reduced-motion idle is stable');
  assert.ok(a.calls.length>24&&a.calls.length<370,kind+' draw call budget');
  assert.equal(a.calls.filter(x=>x[0]==='save').length,3,'hostile body, new state-true armour inlay and authentic reactive faceplate isolate canvas state');
  assert.equal(a.calls.filter(x=>x[0]==='restore').length,3);
  for(const c of a.calls.filter(x=>x[0]==='fillRect'))assert.ok(c.slice(1,5).every(Number.isFinite));
  stamps.add(JSON.stringify(a.calls));
  const warnings=[.95,.5,.3,.1].map(w=>{
    const p=mock();paintHostileAtlas(p.g,{...e,state:'warning',windup:w},0,true);
    return JSON.stringify(p.calls);
  });
  assert.equal(new Set(warnings).size,4,kind+' four honest warning phases');
 }
 assert.equal(stamps.size,7);
 assert.deepEqual([.9,.55,.25,.1].map(windup=>enemyAtlasBand({state:'warning',windup})),[0,1,2,3]);
 const phase1=mock(),phase2=mock();
 const w={kind:'warden',state:'warning',windup:.2,flash:0};
 paintHostileAtlas(phase1.g,{...w,phase:1},1,true);
 paintHostileAtlas(phase2.g,{...w,phase:2},1,true);
 assert.notDeepEqual(phase1.calls,phase2.calls,'Warden phase-two horn silhouette has new geometry');
});
test('real renderers now use one inked atlas per actor without old layered-body stack, and PWA caches it',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const hero=read('../dist/js/scene/sanctuaryArt.js');
 const enemy=read('../dist/js/enemies/enemyArt.js');
 const cache=read('../dist/sw.js'),version=read('../dist/js/core/version.js');
 assert.match(hero,/paintHeroAtlas\(g,\s*pose,\s*t,\s*reducedMotion,\s*damageGrace\)/);
 assert.match(enemy,/paintHostileAtlas\(g,\s*e,\s*t,\s*reducedMotion\)/);
 assert.ok(!hero.includes('paintSagaWayfarer('),'hero is no longer overdrawn six times');
 assert.ok(!enemy.includes('paintEnemyActionFrame('),'enemy has one visible strike layer');
 assert.ok(!enemy.includes('paintOathEnemyStrike('),'legacy weapon outlines no longer obscure the new articulated weapon');
 assert.match(read('../dist/js/scene/pixelSpriteAtlas.js'),/paintEnemySagaWeapon\(/);
 assert.ok(enemy.includes('runeWarning(g, e, t, hero)'),'world warning rays remain intact');
 assert.ok(cache.includes('scene/pixelSpriteAtlas.js'),'offline PWA contains newly compiled sprite');
 assert.match(cache,/runegrave-shell-v0\.09\.38/);
 assert.match(version,/APP_VERSION = '0\.09\.38'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
});

test('post-cast negative windup is legitimate idle/recover data and never crashes a live sprite',()=>{
 for(const kind of enemies){
  for(const state of ['idle','recover']){
   const e={kind,state,windup:-1/120,phase:1,flash:0,dx:1,dy:0};
   assert.equal(enemyAtlasBand(e),0,kind+' negative inactive windup stays neutral');
   const a=mock(),b=mock();
   assert.doesNotThrow(()=>paintHostileAtlas(a.g,e,12,true));
   assert.doesNotThrow(()=>paintOathEnemyStrike(b.g,e,12,true));
   assert.equal(b.calls.length,0,'no attack ornaments appear during recovery');
  }
  assert.equal(enemyAtlasBand({state:'warning',windup:-.001}),3,'near-zero attack remains urgent even if time overshoots');
  const w=mock();
  assert.doesNotThrow(()=>paintOathEnemyStrike(w.g,{kind,state:'warning',windup:-.001,phase:1,dx:1,dy:0},1,true));
  assert.ok(w.calls.length>0);
 }
 assert.throws(()=>enemyAtlasBand({state:'idle',windup:NaN}),RangeError);
});
