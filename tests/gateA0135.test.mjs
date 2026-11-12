import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EARNED_SEAL_IDS,EARNED_SEAL_CARVINGS,EARNED_SEAL_FRAME_SIZE,paintEarnedRelicSeal} from '../dist/js/run/sagaEarnedRelicSeals.js';
import {relicAppearance,paintBoundRuneHalo,RELIC_ART_CAP} from '../dist/js/run/relicBattleArt.js';
import {RELIC_CRESTS} from '../dist/js/run/relicCrests.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const gfx=()=>{
 const calls=[],g={save(){calls.push(['save']);},restore(){calls.push(['restore']);},fillRect(...x){calls.push(['rect',...x]);}};
 for(const key of ['fillStyle','globalAlpha'])Object.defineProperty(g,key,{set(v){calls.push([key,v]);}});
 return {g,calls};
};
const one=(id)=>{const {g,calls}=gfx();paintEarnedRelicSeal(g,id,100,100);return calls;};
const orbit=(ids,time=0,reduced=true)=>{const {g,calls}=gfx();paintBoundRuneHalo(g,{x:210,y:110},ids,time,reduced);return calls;};
test('eight independently hand-authored 9×9 original relic heraldry seals, not eight generic color swaps',()=>{
 assert.deepEqual(EARNED_SEAL_IDS,FIRST_SOUL_RELICS.map(x=>x.id));
 assert.equal(EARNED_SEAL_FRAME_SIZE,12);
 assert.deepEqual(Object.keys(EARNED_SEAL_CARVINGS),EARNED_SEAL_IDS);
 const silhouettes=new Set();
 for(const id of EARNED_SEAL_IDS){
  const rows=EARNED_SEAL_CARVINGS[id];
  assert.equal(rows.length,9,id+' has missing pixel rows');
  assert.ok(rows.every(s=>s.length===9&&/^[.o#+]+$/.test(s)),id+' malformed original Norse glyph');
  assert.ok(rows.join('').replace(/\./g,'').length>=28,id+' too sparse for actual phone');
  assert.ok(rows.join('').includes('+')&&rows.join('').includes('#'),id+' must have primary AND chisel highlight');
  silhouettes.add(rows.join('|'));
  assert.match(RELIC_CRESTS[id].color,/^#[0-9a-f]{6}$/i);
 }
 assert.equal(silhouettes.size,8);
});
test('each original relic tile renders deterministic physical 12px squares with no avatar/rail extension',()=>{
 const signatures=new Set();
 for(const id of EARNED_SEAL_IDS){
  const a=one(id),b=one(id);
  assert.deepEqual(a,b,'earned icon must not independently animate');
  assert.deepEqual(a[0],['save']);assert.deepEqual(a.at(-1),['restore']);
  const rects=a.filter(x=>x[0]==='rect');
  assert.ok(rects.length>=18&&rects.length<=100,'pixel sheet must be bounded and legible');
  assert.ok(rects.every(c=>c[1]>=94&&c[1]+c[3]<=106&&c[2]>=94&&c[2]+c[4]<=106&&c[3]>0&&c[4]>0),
    'world-space seal may not escape existing 12×12 marker');
  signatures.add(JSON.stringify(a));
 }
 assert.equal(signatures.size,8);
});
test('unowned and forged relic identities never gain a floating body, power or collectible',()=>{
 assert.deepEqual(orbit([]),[]);
 for(const malformed of ['made-up',null,'',42])assert.throws(()=>paintEarnedRelicSeal(gfx().g,malformed,100,100),RangeError);
 assert.throws(()=>paintEarnedRelicSeal(gfx().g,'wyrd-fang',NaN,100),RangeError);
 assert.throws(()=>paintEarnedRelicSeal(gfx().g,'wyrd-fang',100,Infinity),RangeError);
 for(const unknown of [['wyrd-fang','wyrd-fang'],['wyrd-fang','fake'],Array(9).fill('eir-thread')])
  assert.throws(()=>relicAppearance(unknown),RangeError);
});
test('one actually earned relic shows exactly one authored seal, all 8 IDs produce unique real orbit artwork',()=>{
 const signatures=new Set();
 for(const id of EARNED_SEAL_IDS){
  const rendered=orbit([id]);
  const rects=rendered.filter(x=>x[0]==='rect');
  assert.ok(rects.length>=18&&rects.length<=100);
  assert.deepEqual(rendered[0],['save']);assert.deepEqual(rendered.at(-1),['restore']);
  signatures.add(JSON.stringify(rendered));
 }
 assert.equal(signatures.size,8);
});
test('genuine 1/2/3 earned seals never cover the actual Wayfarer helmet, body, or boots',()=>{
 const center={x:210,y:110},avatar={x1:188,x2:232,y1:79,y2:136};
 for(const count of [1,2,3,8]){
  const output=orbit(EARNED_SEAL_IDS.slice(0,count));
  const tiles=output.filter(c=>c[0]==='rect'&&c[3]===12&&c[4]===12);
  assert.equal(tiles.length,Math.min(count,3));
  for(const [,x,y,w,h] of tiles){
   assert.ok(!(x<avatar.x2&&x+w>avatar.x1&&y<avatar.y2&&y+h>avatar.y1),
    'an earned seal must not cover the playable Wayfarer silhouette');
   assert.ok(x>=0&&x+w<=420&&y>=0&&y+h<=240);
  }
 }
});
test('existing MAX THREE actual owned item markers, no fourth or invented earned relic in full loadout',()=>{
 const all=EARNED_SEAL_IDS;
 const single=orbit([all[0]]);
 const three=orbit(all.slice(0,3));
 const eight=orbit(all);
 const count=a=>a.filter(c=>c[0]==='rect'&&c[3]===12&&c[4]===12).length;
 assert.equal(count(single),1);
 assert.equal(count(three),3);
 assert.equal(count(eight),3);
 assert.ok(eight.length<430,'eight relics must not all clutter the battlefield at once');
});
test('original 2.6s real earned inventory cycling remains, reduced-motion freeze remains deterministic',()=>{
 const all=EARNED_SEAL_IDS;
 assert.deepEqual(orbit(all,0,true),orbit(all,2000,true),'reduced motion must never rotate owned markers');
 assert.notDeepEqual(orbit(all,0,false),orbit(all,2.7,false),'visible earned IDs rotate only on old true time cycle');
 assert.deepEqual(orbit(all,0,true),orbit(all,0,true));
});
test('real in-game relic battle painter uses actual claimed heraldry instead of generic identical diamond',()=>{
 const scene=read('../dist/js/run/relicBattleArt.js');
 const run=scene.slice(scene.indexOf('export function paintBoundRuneHalo'));
 assert.match(run,/paintEarnedRelicSeal\s*\(\s*g,\s*id,\s*x,\s*y\s*\)/);
 assert.ok(!run.includes('g.lineTo('),'old generic orbiting diamond must not layer over the new seal');
 assert.ok(!run.includes('g.fillRect(Math.round(x), Math.round(y), 1, 1)'),'no identical center-dot glyph');
 assert.ok(read('../js/run/relicBattleArt.js').includes('paintEarnedRelicSeal(g,id,x,y)'));
 assert.ok(read('../js/run/sagaEarnedRelicSeals.js').includes('EARNED_SEAL_CARVINGS'));
 assert.equal(RELIC_ART_CAP,20,'active combat bolt cap not changed');
});
test('Gate A protected 25 chambers, 8 functional relics, save schema1 and consented offline rail controls',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=read('../dist/js/core/version.js');
 assert.match(version,/APP_VERSION = '0\.09\.47'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 const sw=read('../dist/sw.js');
 assert.equal(sw,read('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.47/);
 assert.ok(sw.includes('./js/run/sagaEarnedRelicSeals.js'));
 assert.ok(sw.includes('ACTIVATE_UPDATE')&&sw.includes('cache.addAll(ASSETS.map('),'user-consented update and every asset must still be precached');
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
