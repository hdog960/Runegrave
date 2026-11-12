import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAGA_IMPACT_KINDS,SAGA_IMPACT_BASE,SAGA_IMPACT_CELS,SAGA_IMPACT_PALETTE,SAGA_IMPACT_SIZE,
 sagaImpactFrame,sagaImpactPixels,paintSagaCombatImpact} from '../dist/js/combat/sagaImpactCarvings.js';
import {drawCombatSparks,drawSoulbolts} from '../dist/js/combat/combatArt.js';
import {MAX_BOLTS,SOULBOLT_STATS} from '../dist/js/combat/soulbolts.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const spark=(kind,ratio=1)=>({x:218,y:137,life:(kind==='break'?.65:.3)*ratio,maxLife:kind==='break'?.65:.3,kind});
const paint=(s)=>{const calls=[],g={save(){calls.push(['save']);},restore(){calls.push(['restore']);},fillRect(...x){calls.push(['rect',...x]);}};
 for(const k of ['fillStyle','globalAlpha'])Object.defineProperty(g,k,{set:v=>calls.push([k,v])});
 paintSagaCombatImpact(g,s);return calls;};
test('three original distinct Norse chiseled collision forms, not three recolors of generic radial particles',()=>{
 assert.deepEqual(SAGA_IMPACT_KINDS,['impact','break','wall']);
 assert.deepEqual(Object.keys(SAGA_IMPACT_BASE),SAGA_IMPACT_KINDS);
 assert.deepEqual(Object.keys(SAGA_IMPACT_CELS),SAGA_IMPACT_KINDS);
 assert.equal(SAGA_IMPACT_SIZE,15);
 const shapes=new Set();
 for(const kind of SAGA_IMPACT_KINDS){
  const m=SAGA_IMPACT_BASE[kind],pal=SAGA_IMPACT_PALETTE[kind];
  assert.equal(m.length,15);
  assert.ok(m.every(s=>s.length===15&&/^[.obxl]+$/.test(s)),kind+' malformed original Norse stamp');
  assert.ok(m.join('').replace(/\./g,'').length>=75,kind+' insufficient visible material');
  for(const pigment of ['o','b','l','x'])assert.match(pal[pigment],/^#[0-9a-f]{6}$/i);
  shapes.add(m.join('|'));
 }
 assert.equal(shapes.size,3);
});
test('nine distinct genuinely fixed-step life-selected impact artworks, no fabricated animation time',()=>{
 const nine=new Set();
 for(const kind of SAGA_IMPACT_KINDS){
  const stagePictures=[];
  for(const ratio of [1,.50,.2]){
   const s=spark(kind,ratio),stage=sagaImpactFrame(s);
   assert.ok(stage>=0&&stage<3);
   const rows=sagaImpactPixels(s);
   assert.deepEqual(rows,SAGA_IMPACT_CELS[kind][stage]);
   assert.ok(rows.every(row=>row.length===15&&/^[.obxl]+$/.test(row)));
   stagePictures.push(rows.join('|'));nine.add(rows.join('|'));
  }
  assert.equal(new Set(stagePictures).size,3,kind+' missing life transitions');
 }
 assert.equal(nine.size,9,'3 true original collision kinds x3 actual life cuts must remain distinct');
});
test('real original 0.30s impact/wall and 0.65s break lifetimes provide identical fractional art phases',()=>{
 for(const kind of SAGA_IMPACT_KINDS){
  assert.equal(sagaImpactFrame(spark(kind,1)),0);
  assert.equal(sagaImpactFrame(spark(kind,.5)),1);
  assert.equal(sagaImpactFrame(spark(kind,.2)),2);
  assert.equal(sagaImpactFrame(spark(kind,2/3)),1,'strict old threshold avoids drift');
  assert.equal(sagaImpactFrame(spark(kind,1/3)),2);
 }
});
test('all nine actual collision artists deterministic, world-attached and bounded at 15x15 in real Canvas',()=>{
 const unique=new Set();
 for(const kind of SAGA_IMPACT_KINDS)for(const ratio of [1,.5,.2]){
  const s=spark(kind,ratio),p=paint(s),q=paint(s);
  assert.deepEqual(p,q,'render must not use independent clock/Math.random');
  assert.deepEqual(p[0],['save']);assert.deepEqual(p.at(-1),['restore']);
  const rects=p.filter(x=>x[0]==='rect');
  assert.ok(rects.length>=12&&rects.length<125,'bounded phone-size draw calls');
  assert.ok(rects.every(x=>x[1]>=211&&x[1]+x[3]<=226&&x[2]>=130&&x[2]+x[4]<=145&&x[3]>0&&x[4]===1));
  unique.add(JSON.stringify(p));
 }
 assert.equal(unique.size,9);
});
test('dead/future/malformed sparks cannot become misleading collision art or invented effects',()=>{
 for(const bad of [{kind:'heal'},{x:NaN},{y:Infinity},{life:0},{life:-.1},{life:2},{maxLife:0},{maxLife:NaN}])
  assert.throws(()=>sagaImpactFrame({...spark('impact'),...bad}),RangeError);
 for(const kind of SAGA_IMPACT_KINDS){
  const calls=[],g={save(){calls.push('save');}};
  drawCombatSparks(g,[spark(kind,0)]);
  assert.deepEqual(calls,[],'dead combat impact must be removed, not rendered');
 }
});
test('shipping REAL collision event renderer calls original Norse art, retains existing practice/bolts',()=>{
 const ts=read('../src/combat/combatArt.ts'),js=read('../dist/js/combat/combatArt.js');
 assert.match(ts,/paintSagaCombatImpact\s*\(\s*g,\s*s\s*\)/);
 assert.match(js,/paintSagaCombatImpact\s*\(\s*g,\s*s\s*\)/);
 assert.ok(!js.includes('Math.cos(a) * spread'),'old six identical radial rectangles removed from live gameplay');
 assert.match(js,/export function drawPracticeTargets\(/);
 assert.match(js,/export function drawSoulbolts\(/);
 assert.equal(typeof drawSoulbolts,'function');
 const game=read('../src/scene/stage.ts');
 assert.match(game,/sparks\.length>=24/);
 assert.match(game,/sparks\[i\]!\.life-=dt/);
 assert.match(game,/kind:e\.targetId\?'impact':'wall'/);
 assert.match(game,/life:\.65,maxLife:\.65,kind:'break'/);
 assert.equal(MAX_BOLTS,48);assert.equal(SOULBOLT_STATS.damage,2);
});
test('actual collision paint never fabricates an extra splash, status, hitbox or thumb HUD',()=>{
 const s=read('../dist/js/combat/sagaImpactCarvings.js');
 for(const forbidden of ['document.','localStorage','setTimeout(','setInterval(','requestAnimationFrame(','Math.random(','fillText(','getBoundingClientRect('])
  assert.ok(!s.includes(forbidden),forbidden+' must not occur in impact renderer');
 assert.ok(read('../js/combat/sagaImpactCarvings.js').includes('SAGA_IMPACT_CELS'));
 assert.ok(read('../js/combat/combatArt.js').includes('paintSagaCombatImpact'));
});
test('Gate A protected 25 original chambers, 8 relics, single old boss, save1, opt-in PWA and two outer grips',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=read('../dist/js/core/version.js');
 assert.match(version,/APP_VERSION = '0\.09\.46'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 const sw=read('../dist/sw.js');
 assert.equal(sw,read('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.46/);
 assert.ok(sw.includes('./js/combat/sagaImpactCarvings.js'));
 assert.ok(sw.includes('ACTIVATE_UPDATE')&&sw.includes('cache.addAll(ASSETS.map('));
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
