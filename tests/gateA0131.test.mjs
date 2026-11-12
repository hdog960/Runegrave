import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ENEMY_KINDS} from '../dist/js/enemies/encounters.js';
import {SAGA_CAST_WARDS,SAGA_CAST_MATERIALS,CAST_WARD_TILE_WIDTH,CAST_WARD_TILE_HEIGHT,castWardGeometry,paintSagaCastWards} from '../dist/js/enemies/sagaCastWards.js';
import {warningBeat} from '../dist/js/enemies/warningClarity.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const KINDS=[...ENEMY_KINDS,'warden'];
const actor=(kind='draugr',windup=.50)=>({kind,x:210,y:128,radius:kind==='warden'?18:10,windup,state:'warning',alive:true});
function canvas(){
 const calls=[],g={fillRect(...x){calls.push(['rect',...x]);}};
 Object.defineProperty(g,'fillStyle',{set(v){calls.push(['color',v]);}});
 return {g,calls};
}
function paint(e){
 const {g,calls}=canvas();
 const drawn=paintSagaCastWards(g,e,420,240);
 return {drawn,calls};
}
test('seven original Norse enemy cast emblems are independent 9x9 physical silhouettes, not color-only changes',()=>{
 assert.deepEqual(Object.keys(SAGA_CAST_WARDS),KINDS);
 assert.deepEqual(Object.keys(SAGA_CAST_MATERIALS),KINDS);
 const shapes=new Set();
 for(const kind of KINDS){
  const mask=SAGA_CAST_WARDS[kind],palette=SAGA_CAST_MATERIALS[kind];
  assert.equal(mask.length,9,kind);
  assert.ok(mask.every(row=>row.length===9&&/^[.#+]+$/.test(row)),kind+' invalid cut pixels');
  assert.ok(mask.join('').replace(/[.]/g,'').length>=20,kind+' too sparse to be authored');
  assert.ok(mask.some(row=>row.includes('+')),kind+' missing distinct inner crest');
  for(const tone of Object.values(palette))assert.match(tone,/^#[0-9a-f]{6}$/i);
  shapes.add(mask.join('/'));
 }
 assert.equal(shapes.size,7,'must be distinguishable by silhouette, not only palette');
});
test('real fixed windup exclusively determines four visual urgency stages; no fake timer progression',()=>{
 const times=[.8,.55,.3,.1],stages=[0,1,2,3];
 for(const kind of KINDS)for(let i=0;i<times.length;i++){
  const e=actor(kind,times[i]),shape=castWardGeometry(e,420,240);
  assert.ok(shape&&shape.tiles.length===2);
  assert.equal(shape.urgency,stages[i]);
  assert.equal(shape.urgency,warningBeat(e.windup));
 }
 assert.throws(()=>castWardGeometry(actor('draugr',-1),420,240),RangeError);
 assert.throws(()=>castWardGeometry(actor('draugr',NaN),420,240),RangeError);
});
test('no rune visual entity is emitted for any non-warning, hidden, or dead enemy',()=>{
 for(const kind of KINDS){
  for(const state of ['idle','recover','charge','hidden']){
   const e={...actor(kind),state};
   assert.equal(castWardGeometry(e,420,240),null);
   assert.deepEqual(paint(e),{drawn:false,calls:[]});
  }
  assert.equal(castWardGeometry({...actor(kind),alive:false},420,240),null);
  assert.deepEqual(paint({...actor(kind),alive:false}),{drawn:false,calls:[]});
 }
});
test('world-space physical glyphs never leak into grips, even near left/right and north/south arena edges',()=>{
 for(const kind of KINDS)for(const [x,y,w,h] of [[210,110,420,240],[12,110,420,240],[409,110,420,240],[210,6,420,240],[210,237,420,240],[10,10,110,120],[105,118,110,120]]){
  const shape=castWardGeometry({...actor(kind),x,y},w,h);
  assert.ok(shape);
  for(const t of shape.tiles){
   assert.ok(t.x>=2&&t.y>=2&&t.x+CAST_WARD_TILE_WIDTH<=w-2&&t.y+CAST_WARD_TILE_HEIGHT<=h-2,kind+' leaked outside center canvas');
   const d=Math.abs((t.x+CAST_WARD_TILE_WIDTH/2)-x);
   assert.ok(d>=actor(kind).radius+7,kind+' glyph covered living enemy');
  }
 }
 assert.throws(()=>castWardGeometry(actor(),99,240),RangeError);
 assert.throws(()=>castWardGeometry(actor(),420,99),RangeError);
});
test('seven distinct genuinely drawn Runegrave Canvas images across real warning artwork',()=>{
 const ids=[];
 for(const kind of KINDS){
  const e=actor(kind);
  const a=paint(e),b=paint(e);
  assert.ok(a.drawn&&b.drawn);
  assert.deepEqual(a.calls,b.calls,'same real warning must not animate independent of windup');
  const rects=a.calls.filter(c=>c[0]==='rect');
  assert.ok(rects.length>=40&&rects.length<=200,'bounded smartphone drawing cost '+kind);
  assert.ok(rects.every(c=>c[1]>=2&&c[2]>=2&&c[3]>0&&c[4]>0&&c[1]+c[3]<=418&&c[2]+c[4]<=238));
  ids.push(JSON.stringify(a.calls));
 }
 assert.equal(new Set(ids).size,7);
});
test('advancing only the existing true warning timer adds three legible rune-notch stages without moving actor',()=>{
 for(const kind of KINDS){
  const frames=[.8,.55,.3,.1].map(t=>JSON.stringify(paint(actor(kind,t)).calls));
  assert.equal(new Set(frames).size,4,kind+' needs readable 0–3 original windup progress');
  assert.equal(castWardGeometry(actor(kind,.1),420,240).tiles.length,2);
 }
});
test('actual production enemy renderer preserves accurate source attack lanes and replaces old generic common ring',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const enemy=read('../dist/js/enemies/enemyArt.js');
 assert.ok(enemy.includes('paintSagaCastWards(g, e, worldWidth, worldHeight)')||
           enemy.includes('paintSagaCastWards(g,e,worldWidth,worldHeight)'));
 assert.ok(enemy.includes('paintThreatLane(g, e, worldWidth, worldHeight)')||
           enemy.includes('paintThreatLane(g,e,worldWidth,worldHeight)'));
 assert.ok(enemy.includes('paintRitualWarning(g, e, hero, worldWidth, worldHeight)')||
           enemy.includes('paintRitualWarning(g,e,hero,worldWidth,worldHeight)'));
 assert.doesNotMatch(enemy,/Math\.sin\(t\s*\*\s*11\).*1\.5/,'old fake timing circle must be absent');
 const stage=read('../dist/js/scene/stage.js');
 assert.ok(stage.includes('drawEncounter(')&&stage.includes('motionTrails.paintDissolves('));
 assert.ok(stage.indexOf('motionTrails.paintDissolves(')<stage.indexOf('drawEncounter('));
});
test('v0.09.47 stays in Gate A and preserves every real content, save, dual-thumb and opt-in PWA invariant',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const v=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(v,/APP_VERSION = '0\.09\.47'/);
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.47/);
 assert.ok(sw.includes('./js/enemies/sagaCastWards.js'));
 assert.equal(sw,read('../sw.js'));
 assert.ok(read('../js/enemies/sagaCastWards.js').includes('paintSagaCastWards'));
 assert.ok(read('../js/enemies/enemyArt.js').includes('paintSagaCastWards'));
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
 assert.ok(read('../dist/js/input/twinStick.js').includes('localStorage'));
});
