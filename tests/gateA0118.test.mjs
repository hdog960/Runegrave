import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {HOSTILE_ATLAS,WAYFARER_OATH_SHIELDS,paintWayfarerOathStance,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {SAGA_DAMAGE_FRACTURES,inkedImpactBody} from '../dist/js/scene/sagaImpactFractures.js';
import {VAULT_CANOPY_SEALS,paintVaultCanopies} from '../dist/js/scene/sagaVaultCanopies.js';
const enemies=['draugr','wisp','archer','charger','sentinel','shade','warden'];
const facings=['N','NE','E','SE','S','SW','W','NW'];
function mock(){
 const calls=[],g={};
 for(const op of ['save','restore','translate','scale','fillRect'])g[op]=(...a)=>calls.push([op,...a]);
 return {g,calls};
}
const hero=(f,moving=false,recoil=0)=>({facing:f,moving,recoil,side:f.includes('W')?-1:f.includes('E')?1:0,back:f.includes('N'),aimX:1,aimY:0});
test('seven authored hostile damage fracture contours activate only on real hit flash',()=>{
 assert.deepEqual(Object.keys(SAGA_DAMAGE_FRACTURES),enemies);
 const patterns=new Set();
 for(const kind of enemies){
  const rows=SAGA_DAMAGE_FRACTURES[kind],base=HOSTILE_ATLAS[kind];
  assert.equal(rows.length,5);
  for(const row of rows){assert.equal(row.length,9);assert.match(row,/^[.#]+$/);}
  patterns.add(rows.join('|'));
  assert.strictEqual(inkedImpactBody(base,kind,0),base,'no allocation when no hit');
  assert.strictEqual(inkedImpactBody(base,kind,-1),base,'non-positive flash never implies damage');
  const hit=inkedImpactBody(base,kind,.08);
  const strong=inkedImpactBody(base,kind,.22);
  assert.notDeepEqual(hit,base,kind+' actual impact changes body pixels');
  assert.notDeepEqual(strong,hit,kind+' genuine stronger impact has contrasting original fracture ink');
  assert.equal(hit.length,base.length);
  const bad=hit.map((s,i)=>s!==base[i]?i:null).filter(i=>i!==null);
  assert.ok(bad.length>=1&&bad.length<=5);
  for(const s of hit)assert.match(s,/^[. oabcegrs]+$/);
  const idle=mock(),damaged=mock(),quiet=mock();
  paintHostileAtlas(idle.g,{kind,state:'idle',windup:0,phase:1,flash:0},0,true);
  paintHostileAtlas(damaged.g,{kind,state:'idle',windup:0,phase:1,flash:.08},0,true);
  paintHostileAtlas(quiet.g,{kind,state:'recover',windup:-1/120,phase:1,flash:0},0,true);
  assert.notDeepEqual(idle.calls,damaged.calls);
  // Only these three actual encounter species enter 'recover'. Their new
  // body posture must differ from idle WITHOUT masquerading as windup.
  const realRecovery=['charger','shade','warden'].includes(kind);
  if(realRecovery)assert.notDeepEqual(idle.calls,quiet.calls,kind+' truly post-strike recovering body');
  else assert.deepEqual(idle.calls,quiet.calls,'no invented recover state for '+kind);
  const warning=mock();
  paintHostileAtlas(warning.g,{kind,state:'warning',windup:.10,phase:1,flash:0},0,true);
  assert.notDeepEqual(quiet.calls,warning.calls,'post-strike recovery can never fake an incoming attack');
  assert.throws(()=>inkedImpactBody(base,kind,NaN),RangeError);
 }
 assert.equal(patterns.size,7,'all species use different scars');
});
test('Wayfarer has eight individually drawn engraved shield designs with four authentic walking placements',()=>{
 assert.deepEqual(Object.keys(WAYFARER_OATH_SHIELDS),facings);
 const unique=new Set();
 for(const f of facings){
  const rows=WAYFARER_OATH_SHIELDS[f];
  assert.equal(rows.length,7);
  for(const r of rows){assert.equal(r.length,7);assert.match(r,/^[.oHhGwGe]+$/);}
  unique.add(rows.join('|'));
  const states=[0,.12,.24,.36].map(time=>{const a=mock();paintWayfarerOathStance(a.g,hero(f,true,0),time);return JSON.stringify(a.calls);});
  assert.equal(new Set(states).size,4,f+' four meaningful braced hand positions');
  const a=mock(),b=mock(),firing=mock();
  paintWayfarerOathStance(a.g,hero(f,true,0),0,true);
  paintWayfarerOathStance(b.g,hero(f,true,0),120,true);
  assert.deepEqual(a.calls,b.calls,'reduced motion freezes real arm art');
  paintWayfarerOathStance(firing.g,hero(f,false,.75),0,true);
  assert.notDeepEqual(a.calls,firing.calls,'actual recoil changes physical handguard');
  const rects=a.calls.filter(x=>x[0]==='fillRect');
  for(const [,x,y,w,h] of rects)assert.ok(x>=-19&&x+w<=29&&y>=-35&&y+h<=23&&w>0&&h>0);
 }
 assert.equal(unique.size,8,'all compass bracers must be independently authored');
});
test('25 canonical vaults retain five genuinely distinct story seals and outer-wall-only gameplay geometry',()=>{
 assert.equal(VAULT_CANOPY_SEALS.length,5);
 const signatures=new Set(VAULT_CANOPY_SEALS.map(rows=>rows.join('|')));
 assert.equal(signatures.size,5);
 for(const rows of VAULT_CANOPY_SEALS){assert.equal(rows.length,5);for(const r of rows){assert.equal(r.length,8);assert.match(r,/^[.#+]+$/);}}
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 const unique=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintVaultCanopies(a.g,420,235,room.family,i);paintVaultCanopies(b.g,420,235,room.family,i);
  assert.deepEqual(a.calls,b.calls,'vaults stay authored and stable without decorative clock');
  for(const [,x,y,w,h] of a.calls.filter(c=>c[0]==='fillRect')){
   assert.ok((x>=58&&x+w<=100)||(x>=320&&x+w<=362),room.id+' preserve center arena');
   assert.ok(y>=20&&y+h<=92,room.id+' preserve vertical fighting area');
   assert.ok(w>0&&h>0);
  }
  unique.add(JSON.stringify(a.calls));
 }
 assert.equal(unique.size,25,'five stone schools times five story seals stay distinct');
});
test('real scene/warnings, eight functional relics, original save/PWA and locked Gate A are preserved',()=>{
 const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const art=file('../dist/js/scene/pixelSpriteAtlas.js');
 const stage=file('../dist/js/scene/stage.js');
 const enemies=file('../dist/js/enemies/enemyArt.js');
 const sw=file('../dist/sw.js'),version=file('../dist/js/core/version.js');
 assert.match(art,/inkedImpactBody\(/);
 assert.match(art,/WAYFARER_OATH_SHIELDS\[/);
 assert.match(stage,/paintVaultCanopies\(/);
 assert.match(enemies,/runeWarning\(g, e, t\)/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.33'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.33/);
 assert.ok(sw.includes('scene/sagaImpactFractures.js'));
});
