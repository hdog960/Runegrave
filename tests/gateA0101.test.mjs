import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BASE_MASONRY,paintSanctuary} from '../dist/js/scene/sanctuaryArt.js';
import {paintChamberSetpieces,SETPIECE_MOTIFS} from '../dist/js/scene/chamberSetpieces.js';
import {paintWayfarerEmblems} from '../dist/js/scene/wayfarerEmblems.js';
import {paintEnemyAccents,FOE_MATERIAL} from '../dist/js/enemies/armorAccents.js';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';

function painter(){
 const calls=[];const p={canvas:{width:840,height:420},getTransform:()=>({a:2,d:2})};
 for(const name of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','closePath','moveTo','lineTo','ellipse','arc','translate','rotate','scale','fillText'])p[name]=(...args)=>calls.push([name,...args]);
 p.createRadialGradient=p.createLinearGradient=()=>({addColorStop:()=>{}});
 return {g:new Proxy(p,{set(t,k,v){t[k]=v;calls.push(['set',k,v]);return true}}),calls};
}
const families=['ASH','IRON','ROOT','SPIRIT','FATE'];
test('all five REAL underlying floor/wall palettes differ, not just color washes',()=>{
 assert.equal(new Set(families.map(f=>BASE_MASONRY[f].slab)).size,5);
 assert.equal(new Set(families.map(f=>BASE_MASONRY[f].wall)).size,5);
 for(const f of families){const {g,calls}=painter();paintSanctuary(g,420,235,0,f);
  const paintColors=calls.filter(c=>c[0]==='set'&&c[1]==='fillStyle').map(c=>c[2]);
  for(const color of [BASE_MASONRY[f].wall,BASE_MASONRY[f].slab])assert.ok(paintColors.includes(color),`${f} did not paint the base material ${color}`);
  assert.ok(calls.length<3000,`${f} exceeded artwork operation limit: ${calls.length}`);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
 }
 assert.throws(()=>paintSanctuary(painter().g,420,235,0,'INVENTED'),/Unknown chamber/);
});
test('side architecture is unique to ASH, IRON, SPIRIT and FATE; ROOT retains living roots',()=>{
 assert.equal(new Set(Object.values(SETPIECE_MOTIFS)).size,5);
 const signatures=[];
 for(const f of families){const {g,calls}=painter();paintChamberSetpieces(g,420,235,0,f);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
  if(f==='ROOT')assert.equal(calls.length,0);
  else assert.ok(calls.length>24&&calls.length<250,`${f}: ${calls.length}`);
  signatures.push(calls.map(c=>c[0]==='set'?`${c[1]}:${c[2]}`:c[0]).join(','));
 }
 assert.equal(new Set(signatures).size,5);
 assert.throws(()=>paintChamberSetpieces(painter().g,420,235,0,'RANDOM'),/Unknown/);
});
test('25 rooms render appropriate family foundations without touching authored encounter plans',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 for(const room of FIRST_SOUL_ROOMS){
  assert.ok(families.includes(room.family));const {g,calls}=painter();paintSanctuary(g,420,220,.5,room.family,Number(room.id.slice(-2)));
  assert.ok(calls.length<3000,`${room.id} exceeded mobile base-art budget`);
 }
});
test('hero insignia changes facing art, stays bounded and respects reduced-motion pose',()=>{
 const {g,calls}=painter();const a=wayfarerPose(0,1,0,1,0,true),b=wayfarerPose(0,0,-1,0,-1,false);
 paintWayfarerEmblems(g,a,0);const split=calls.length;paintWayfarerEmblems(g,b,0);
 assert.ok(split>20&&split<95);
 assert.notDeepEqual(calls.slice(0,split),calls.slice(split));
 assert.equal(calls.filter(c=>c[0]==='save').length,0);
 assert.throws(()=>paintWayfarerEmblems(g,a,Infinity),/Invalid/);
});
test('all seven enemy species get bounded, distinctive hand-authored accents',()=>{
 assert.equal(Object.keys(FOE_MATERIAL).length,7);
 assert.equal(new Set(Object.values(FOE_MATERIAL)).size,7);
 const shapes=[];
 for(const f of Object.keys(FOE_MATERIAL)){
  const {g,calls}=painter();paintEnemyAccents(g,f,'warning',2,0);
  assert.ok(calls.length>=3&&calls.length<=110,`${f}: ${calls.length}`);
  shapes.push(calls.map(c=>JSON.stringify(c)).join(','));
 }
 assert.equal(new Set(shapes).size,7);
 assert.throws(()=>paintEnemyAccents(painter().g,'UNKNOWN','idle',1,0),/Invalid/);
});
test('the new art modules are offline-preloaded; Gate A version and saved schema remain locked',()=>{
 const source=readFileSync(new URL('../src/core/version.ts',import.meta.url),'utf8');
 assert.match(source,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(source,/APP_VERSION = '0\.09\.40'/);
 assert.match(source,/SAVE_SCHEMA_VERSION = 1/);
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 for(const file of ['scene/chamberSetpieces','scene/wayfarerEmblems','enemies/armorAccents'])assert.ok(sw.includes(`js/${file}.js`));
 assert.match(sw,/runegrave-shell-v0\.09\.40/);
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/grip grip-left/);assert.match(html,/grip grip-right/);assert.match(html,/id="world-frame"/);
});
