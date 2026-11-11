import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HOSTILE_RECOVERY_INK,enemyRecoveryFrame,inkedRecoveryBody} from '../dist/js/scene/sagaRecoveryInk.js';
import {HOSTILE_ATLAS,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {SAGA_BURIAL_CARYATIDS,paintVaultCanopies} from '../dist/js/scene/sagaVaultCanopies.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const kinds=['charger','shade','warden'];
const durations={charger:.65,shade:.32,warden:.48};
const cast=(kind,windup,phase=1,state='recover')=>({kind,windup,phase,state,flash:0});
function painter(){const calls=[];const g={};for(const method of ['save','restore','translate','scale','fillRect','rotate'])g[method]=(...args)=>calls.push([method,...args]);Object.defineProperty(g,'fillStyle',{set(value){calls.push(['ink',value]);}});return {g,calls};}
test('nine original enemy recovery silhouettes follow ONLY three actual recovery species and actual time remaining',()=>{
 assert.deepEqual(Object.keys(HOSTILE_RECOVERY_INK),kinds);
 const across=new Set();
 for(const kind of kinds){
  const school=HOSTILE_RECOVERY_INK[kind],base=HOSTILE_ATLAS[kind],max=durations[kind];
  assert.equal(school.frames.length,3);
  assert.equal(school.max,max);
  const frames=[];
  for(const [phase,factor] of [.9,.5,.1].entries()){
   const f=enemyRecoveryFrame(cast(kind,max*factor));
   assert.equal(f,phase);
   const art=inkedRecoveryBody(base,cast(kind,max*factor));
   assert.equal(art.length,base.length);
   assert.ok(art.every(r=>/^[. oabcegrs]+$/.test(r)),kind+' no invalid material');
   assert.notDeepEqual(art,base,'actual recovery physically changes the same body');
   const edited=art.map((s,i)=>s!==base[i]?i:null).filter(i=>i!==null);
   assert.ok(edited.length>=5&&edited.length<=14,kind+' substantially recut 11 authentic body rows without expanding sprite');
   const signature=art.join('|');frames.push(signature);across.add(signature);
  }
  assert.equal(new Set(frames).size,3,'three truly different original recoveries, not repaints');
  assert.strictEqual(inkedRecoveryBody(base,cast(kind,.28,1,'idle')),base,'idle never pretends a safe recovery');
  assert.strictEqual(inkedRecoveryBody(base,cast(kind,.28,1,'warning')),base,'warning never loses authoritative attack body');
  assert.strictEqual(inkedRecoveryBody(base,cast(kind,.28,1,'charge')),base,'charging never masquerades as safe recovery');
  assert.equal(enemyRecoveryFrame(cast(kind,-1/120)),2,'negative countdown crossing must be render-safe');
  assert.throws(()=>enemyRecoveryFrame(cast(kind,NaN)),RangeError);
 }
 assert.equal(across.size,9,'all nine forms genuinely distinct');
 for(const kind of ['draugr','wisp','archer','sentinel']){
  const base=HOSTILE_ATLAS[kind];
  assert.equal(enemyRecoveryFrame(cast(kind,.2)),-1,'do not invent recovery states for these foes');
  assert.strictEqual(inkedRecoveryBody(base,cast(kind,.2)),base);
 }
});
test('Warden phase two uses its real shorter recovery duration and no decorative timer',()=>{
 const b=HOSTILE_ATLAS.warden;
 assert.equal(enemyRecoveryFrame(cast('warden',.25,2)),0);
 assert.equal(enemyRecoveryFrame(cast('warden',.14,2)),1);
 assert.equal(enemyRecoveryFrame(cast('warden',.02,2)),2);
 for(const kind of kinds){
  const max=kind==='warden'?.28:durations[kind];
  for(const f of [.9,.5,.1]){
   const a=painter(),b=painter(),e=cast(kind,max*f,kind==='warden'?2:1);
   paintHostileAtlas(a.g,e,0,true);paintHostileAtlas(b.g,e,30,true);
   assert.deepEqual(a.calls,b.calls,'recovery must not independently animate at arbitrary real time');
   assert.ok(a.calls.filter(x=>x[0]==='fillRect').length>30);
   assert.equal(a.calls.filter(x=>x[0]==='save').length,a.calls.filter(x=>x[0]==='restore').length);
  }
 }
});
test('five hand-engraved supporting memorial figures stay strictly inside original 25 side-vaults',()=>{
 const fam=['ASH','IRON','ROOT','SPIRIT','FATE'];
 assert.deepEqual(Object.keys(SAGA_BURIAL_CARYATIDS),fam);
 const shapes=new Set();
 for(const f of fam){
  const rows=SAGA_BURIAL_CARYATIDS[f];
  assert.equal(rows.length,7);
  for(const line of rows){assert.equal(line.length,9);assert.match(line,/^[.#+]+$/);}
  shapes.add(rows.join('|'));
 }
 assert.equal(shapes.size,5,'five physically distinct statues, no empty palette swaps');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 const scenes=new Set();
 for(const [index,room] of FIRST_SOUL_ROOMS.entries()){
  const a=painter(),b=painter();
  paintVaultCanopies(a.g,420,235,room.family,index);
  paintVaultCanopies(b.g,420,235,room.family,index);
  assert.deepEqual(a.calls,b.calls,'no decorative wall clock');
  const rects=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(rects.length>80&&rects.length<800,'full but bounded original stone composition');
  for(const [,x,y,w,h] of rects)assert.ok(((x>=58&&x+w<=100)||(x>=320&&x+w<=362))&&y>=20&&y+h<=92&&w>0&&h>0,room.id+' keep dodge arena and control grips empty');
  scenes.add(JSON.stringify(a.calls));
 }
 assert.equal(scenes.size,25);
});
test('render integration, 8 real relics, versioned PWA, save schema and Gate A lock all remain',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const pixel=read('../dist/js/scene/pixelSpriteAtlas.js'),stage=read('../dist/js/scene/stage.js');
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(pixel,/inkedRecoveryBody\(windupBody,\s*e\)/,'body recovery must be in production renderer');
 assert.match(stage,/drawEncounter\(/,'authentic existing combat drawn');
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(version,/APP_VERSION = '0\.09\.35'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.35/);
 assert.ok(sw.includes('./js/scene/sagaRecoveryInk.js'));
});
