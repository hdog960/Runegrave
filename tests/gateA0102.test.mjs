import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CHAMBER_AMBIENCE,ambientMotif,paintChamberAmbience} from '../dist/js/scene/chamberAmbience.js';
import {hostileProjectileStyle,paintHostileProjectiles} from '../dist/js/enemies/hostileProjectileArt.js';
import {FACING_STITCHES,paintWayfarerProfile} from '../dist/js/scene/wayfarerProfileArt.js';
import {wayfarerPose} from '../dist/js/scene/wayfarerMotion.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function painter(){
 const calls=[],base={canvas:{width:840,height:420}};
 for(const name of ['save','restore','fillRect','fill','stroke','beginPath','closePath','moveTo','lineTo','ellipse','arc','translate','rotate','scale','quadraticCurveTo'])base[name]=(...args)=>calls.push([name,...args]);
 return {g:new Proxy(base,{set(o,k,v){o[k]=v;calls.push(['set',k,v]);return true}}),calls};
}
test('five family ambiences paint distinct motifs with bounded effects near the outer edges',()=>{
 const familyNames=['ASH','IRON','ROOT','SPIRIT','FATE'];assert.deepEqual(Object.keys(CHAMBER_AMBIENCE),familyNames);
 const signatures=[];
 for(const f of familyNames){
  const {g,calls}=painter();paintChamberAmbience(g,420,235,.35,f,4);
  assert.ok(calls.length>35&&calls.length<170,`${f} art operation budget ${calls.length}`);
  assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
  signatures.push(calls.map(x=>JSON.stringify(x)).join(''));
  assert.match(ambientMotif(f,4),/-4$/);
 }
 assert.equal(new Set(signatures).size,5);
 assert.throws(()=>paintChamberAmbience(painter().g,420,235,0,'OTHER',0),/Invalid room/);
 assert.throws(()=>paintChamberAmbience(painter().g,420,235,Infinity,'ASH',0),/Invalid ambience frame/);
});
test('all 25 authored configurations retain a valid family-specific ambient style',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(new Set(FIRST_SOUL_ROOMS.map(r=>ambientMotif(r.family,Number(r.id.replace(/\D/g,''))%5))).size,25);
});
test('hostile projectiles use distinct visible silhouettes for heavy and normal damage',()=>{
 const light={id:1,x:120,y:90,dx:1,dy:0,damage:1,life:2.4,radius:3,speed:90};
 const heavy={...light,id:2,damage:2,dx:0,dy:1};
 assert.notEqual(hostileProjectileStyle(light).kind,hostileProjectileStyle(heavy).kind);
 const {g,calls}=painter();paintHostileProjectiles(g,[light,heavy],.41);
 assert.equal(calls.filter(c=>c[0]==='save').length,2);
 assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
 // Pixel-art originals batch the real physical ink rows. Preserve strict
 // performance limits for both projectiles instead of the old vector budget.
 const pixels=calls.filter(c=>c[0]==='fillRect');
 assert.ok(pixels.length>40&&pixels.length<170,'two hostile sprites must be bounded original pixel art');
 assert.ok(calls.length>90&&calls.length<380,'no runaway projectile drawing on phone');
 const noBolts=painter();paintHostileProjectiles(noBolts.g,[],0);assert.equal(noBolts.calls.length,0);
 assert.throws(()=>hostileProjectileStyle({...light,damage:NaN}),/Invalid/);
});
test('Wayfarer has distinctive stable eight-direction cloak details without changing aiming',()=>{
 const signatures=[];assert.equal(Object.keys(FACING_STITCHES).length,8);
 for(let k=0;k<8;k++){
  const a=k*Math.PI/4,p=wayfarerPose(0,0,0,Math.cos(a),Math.sin(a),false);
  const {g,calls}=painter();paintWayfarerProfile(g,p,0);
  assert.ok(calls.length>12&&calls.length<40);
  signatures.push(JSON.stringify(calls));
 }
 assert.ok(new Set(signatures).size>=5);
 assert.throws(()=>paintWayfarerProfile(painter().g,wayfarerPose(0,0,0,1,0,false),NaN),/Invalid/);
});
test('Gate A stays locked, offline assets include all new visual modules, and existing save/preferences unchanged',()=>{
 const version=readFileSync(new URL('../src/core/version.ts',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.47'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.47/);
 for(const path of ['js/scene/chamberAmbience.js','js/scene/wayfarerProfileArt.js','js/enemies/hostileProjectileArt.js'])assert.ok(sw.includes(path),path);
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right')&&html.includes('id="world-frame"'));
});
