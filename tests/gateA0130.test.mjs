import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VITAL_RUNE_SEALS,VITAL_RUNE_MATERIALS,vitalRuneFractions,vitalPlaqueGeometry,paintVitalRunePlaque} from '../dist/js/scene/sagaVitalRunes.js';
import {ENEMY_KINDS,HostileEncounter} from '../dist/js/enemies/encounters.js';
import {makeRootvaultWorld,safeSpawn} from '../dist/js/physics/world.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';

const KINDS=[...ENEMY_KINDS,'warden'];
const HP={draugr:6,wisp:4,archer:4,charger:7,sentinel:8,shade:5,warden:28};
const RADII={draugr:9,wisp:8,archer:8,charger:10,sentinel:11,shade:8,warden:18};
const hostile=(kind,hp=HP[kind],state='idle')=>({
 kind,x:210,y:110,radius:RADII[kind],hp,maxHp:HP[kind],alive:true,state
});
function canvas(){
 const calls=[],g={fillRect(...a){calls.push(['rect',...a]);},fillText(...a){calls.push(['text',...a]);}};
 for(const prop of ['fillStyle','textAlign','textBaseline','font'])Object.defineProperty(g,prop,{set(v){calls.push([prop,v]);}});
 return {g,calls};
}
function render(enemy,width=420,height=240){
 const {g,calls}=canvas();paintVitalRunePlaque(g,enemy,width,height);return calls;
}
test('seven wholly original Norse seals are five-row physically distinct authored silhouettes, not colour-only bars',()=>{
 assert.deepEqual(Object.keys(VITAL_RUNE_SEALS),KINDS);
 assert.deepEqual(Object.keys(VITAL_RUNE_MATERIALS),KINDS);
 const all=new Set();
 for(const kind of KINDS){
  const rows=VITAL_RUNE_SEALS[kind],mat=VITAL_RUNE_MATERIALS[kind];
  assert.equal(rows.length,5);
  assert.ok(rows.every(row=>row.length===5&&/^[.#]+$/.test(row)));
  assert.ok(rows.join('').split('#').length>=8,kind+' lacks meaningful carved silhouette');
  for(const color of Object.values(mat))assert.match(color,/^#[0-9a-f]{6}$/i);
  all.add(rows.join('|'));
 }
 assert.equal(all.size,7);
});
test('all real HP amounts map to exact continuously fractional, finite, bounded stone notches',()=>{
 assert.deepEqual(vitalRuneFractions(0,8,6),Array(6).fill(0));
 assert.deepEqual(vitalRuneFractions(8,8,6),Array(6).fill(1));
 assert.deepEqual(vitalRuneFractions(2,8,4),[1,0,0,0]);
 assert.deepEqual(vitalRuneFractions(1,8,4),[.5,0,0,0]);
 assert.deepEqual(vitalRuneFractions(7,28,10),[1,1,.5,0,0,0,0,0,0,0]);
 for(const args of [[-1,10,6],[11,10,6],[5,0,6],[NaN,10,6],[4,5,0],[4,5,17],[4,5,3.5]])
  assert.throws(()=>vitalRuneFractions(...args),RangeError);
});
test('plaques are placed only INSIDE real center canvas, including south door, east edge and Warden',()=>{
 for(const kind of KINDS)for(const [x,y,w,h] of [[210,100,420,240],[8,225,420,240],[418,10,420,240],[80,115,115,115]]){
  const e={...hostile(kind),x,y},p=vitalPlaqueGeometry(e,w,h);
  assert.ok(p.x>=3&&p.y>=3&&p.x+p.width<=w-3&&p.y+p.height<=h-3,kind+' world pixel escapes center canvas');
  assert.equal(p.slots,kind==='warden'?10:6);
  assert.equal(p.width,kind==='warden'?88:56);
 }
 for(const size of [[0,200],[105,200],[200,NaN]])
  assert.throws(()=>vitalPlaqueGeometry(hostile('wisp'),...size),RangeError);
});
test('eight-stage artwork is not falsely offered on pristine ordinary idles or physically hidden/killed enemies',()=>{
 for(const kind of KINDS){
  const full=render(hostile(kind));
  if(kind==='warden')assert.ok(full.length>25,'Warden always has actual boss vitality');
  else assert.deepEqual(full,[],'undamaged ordinary enemies must not clutter small viewport');
  assert.deepEqual(render({...hostile(kind,1),state:'hidden'}),[]);
  assert.deepEqual(render({...hostile(kind,1),alive:false}),[]);
  assert.deepEqual(render({...hostile(kind,0),alive:true}),[]);
  assert.ok(render(hostile(kind,HP[kind],'warning')).length>25,'actual warning can show readable genuine HP');
 }
});
test('all seven carved real-HP plaques and full/half/near-death damage states are different in actual production Canvas calls',()=>{
 const species=new Set();
 for(const kind of KINDS){
  const images=[];
  for(const hp of [HP[kind],Math.ceil(HP[kind]/2),1]){
   const calls=render(hostile(kind,hp,'warning'));
   assert.ok(calls.length>25&&calls.length<110,kind+' artwork should be mobile-efficient');
   assert.ok(calls.some(c=>c[0]==='text'&&c[1]===hp+'/'+HP[kind]),kind+' must print actual numerical health, not approximate');
   assert.ok(calls.filter(c=>c[0]==='rect').every(c=>c[1]>=0&&c[2]>=0&&c[3]>0&&c[4]>0));
   images.push(JSON.stringify(calls));
  }
  assert.equal(new Set(images).size,3,kind+' actual health must alter artwork');
  species.add(images[1]);
 }
 assert.equal(species.size,7,'distinct species require independent authored runic faces');
});
test('a real Warden projectile hit via the existing HP physics updates the existing visual numbers without changing boss phases',()=>{
 const world=makeRootvaultWorld(420,240);
 const hero=safeSpawn(world,{x:95,y:120});
 const encounter=new HostileEncounter(world,'warden',hero);
 const e=encounter.snapshot.enemies[0];
 assert.equal(e.hp,28);assert.equal(e.phase,1);
 assert.equal(render(e).find(c=>c[0]==='text')[1],'28/28');
 const hit=encounter.hitAt({x:e.x,y:e.y},2,3,{x:1,y:0});
 assert.equal(hit,e.id);assert.equal(e.hp,25);assert.equal(e.phase,1);
 assert.equal(render(e).find(c=>c[0]==='text')[1],'25/28');
 assert.equal(encounter.snapshot.enemies.length,1,'no fake extra enemy from runic artwork');
});
test('the plaque replaces the earlier generic four-pixel health bar, not an extra stacked body overlay',()=>{
 const src=readFileSync(new URL('../dist/js/enemies/enemyArt.js',import.meta.url),'utf8');
 assert.match(src,/paintVitalRunePlaque\(g, e,/);
 assert.doesNotMatch(src,/width \* e\.hp \/ e\.maxHp/);
 const world=readFileSync(new URL('../dist/js/scene/stage.js',import.meta.url),'utf8');
 assert.ok(world.indexOf('drawEncounter(')<world.indexOf('drawRoomDrops('));
 assert.ok(world.includes('motionTrails.paintDissolves('));
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
test('v0.09.41 stays in Gate A: actual 25 rooms, eight real relics, schema1, consented OFFLINE cache and identical root Pages mirror',()=>{
 const read=x=>readFileSync(new URL(x,import.meta.url),'utf8');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(read('../dist/js/core/version.js'),/APP_VERSION = '0\.09\.41'/);
 assert.match(read('../dist/js/core/version.js'),/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(read('../dist/js/core/version.js'),/SAVE_SCHEMA_VERSION = 1/);
 const cache=read('../dist/sw.js'),root=read('../sw.js');
 assert.match(cache,/runegrave-shell-v0\.09\.41/);
 assert.equal(cache,root);
 assert.ok(cache.includes('./js/scene/sagaVitalRunes.js'));
 assert.ok(read('../js/scene/sagaVitalRunes.js').includes('paintVitalRunePlaque'));
 assert.ok(read('../js/enemies/enemyArt.js').includes('paintVitalRunePlaque'));
});
