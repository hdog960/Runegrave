import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WAYFARER_ATLAS,HOSTILE_ATLAS,paintHeroAtlas,paintHostileAtlas} from '../dist/js/scene/pixelSpriteAtlas.js';
import {WAYFARER_HURT_MASKS,inkedWayfarerHurtBody} from '../dist/js/scene/wayfarerHurtInk.js';
import {WARDEN_UNBOUND_CROWN,inkedWardenPhaseBody} from '../dist/js/scene/wardenUnboundInk.js';
import {VAULT_CANOPY_FAMILIES,VAULT_DEPTH_CUTS,paintVaultCanopies} from '../dist/js/scene/sagaVaultCanopies.js';
import {FIRST_SOUL_RELICS,FIRST_SOUL_ROOMS} from '../dist/js/run/firstSoul.js';
const facings=['N','NE','E','SE','S','SW','W','NW'];
const types={N:'back',NE:'diagonal',E:'side',SE:'diagonal',S:'front',SW:'diagonal',W:'side',NW:'diagonal'};
function mock(){const calls=[],g={};for(const op of ['save','restore','translate','scale','fillRect'])g[op]=(...args)=>calls.push([op,...args]);return {g,calls};}
test('all eight distinct directional hero armours visibly react to actual Mortal Heart grace, never hide actor',()=>{
 assert.deepEqual(Object.keys(WAYFARER_HURT_MASKS),facings);
 assert.equal(new Set(Object.values(WAYFARER_HURT_MASKS).map(rows=>rows.join('|'))).size,8);
 for(const f of facings){
  const rows=WAYFARER_HURT_MASKS[f];
  assert.equal(rows.length,5);for(const r of rows){assert.equal(r.length,7);assert.match(r,/^[.#]+$/);}
  const base=WAYFARER_ATLAS[types[f]],idle=inkedWayfarerHurtBody(base,f,0);
  assert.strictEqual(idle,base,'no damage means untouched original atlas reference');
  const heavy=inkedWayfarerHurtBody(base,f,.9),fading=inkedWayfarerHurtBody(base,f,.3);
  assert.notDeepEqual(heavy,base,'real damage draws in-body damage');
  assert.notDeepEqual(heavy,fading,'real recovery has two material stages');
  assert.equal(heavy.length,base.length);
  for(const row of heavy)assert.match(row,/^[.obhHmMbBgGwers]+$/);
  const pose={facing:f,side:f.includes('W')?-1:f.includes('E')?1:0,back:f.includes('N'),moving:false,recoil:0,aimX:0,aimY:1};
  const healthy=mock(),hurt=mock();
  paintHeroAtlas(healthy.g,pose,0,true,0);paintHeroAtlas(hurt.g,pose,0,true,.9);
  assert.notDeepEqual(healthy.calls,hurt.calls,'actual rendered hero remains painted and visually wounded');
  assert.equal(hurt.calls.filter(x=>x[0]==='save').length,5,'same original 5 hero painter layers');
  assert.equal(hurt.calls.filter(x=>x[0]==='restore').length,5);
  const rects=hurt.calls.filter(x=>x[0]==='fillRect');
  assert.ok(rects.length>75&&rects.length<550);
  for(const [,x,y,w,h] of rects)assert.ok(x>=-35&&x+w<=36&&y>=-37&&y+h<=34);
  assert.throws(()=>inkedWayfarerHurtBody(base,f,NaN),RangeError);
 }
});
test('Rootbound Warden has a physical phase-two crown, other enemies and phase-one body unchanged',()=>{
 assert.equal(WARDEN_UNBOUND_CROWN.length,6);
 for(const pair of WARDEN_UNBOUND_CROWN){assert.equal(pair.length,2);for(const side of pair){assert.equal(side.length,4);assert.match(side,/^[.oabcegrs]+$/);}}
 const old=HOSTILE_ATLAS.warden,newBody=inkedWardenPhaseBody(old,'warden',2);
 assert.strictEqual(inkedWardenPhaseBody(old,'warden',1),old);
 assert.notDeepEqual(newBody,old);
 assert.equal(newBody.length,old.length);
 assert.ok(newBody.filter((row,i)=>row!==old[i]).length>=4,'real antlers and six-body anatomy changed');
 for(const row of newBody)assert.match(row,/^[. oabcegrs]+$/);
 const before=mock(),after=mock();
 const boss={kind:'warden',state:'warning',windup:.1,phase:1,flash:0};
 paintHostileAtlas(before.g,boss,0,true);paintHostileAtlas(after.g,{...boss,phase:2},0,true);
 assert.notDeepEqual(before.calls,after.calls,'real encounter boss phase visibly different');
 for(const kind of ['draugr','wisp','archer','charger','sentinel','shade'])
  assert.strictEqual(inkedWardenPhaseBody(HOSTILE_ATLAS[kind],kind,2),HOSTILE_ATLAS[kind]);
 assert.throws(()=>inkedWardenPhaseBody(old,'warden',NaN),RangeError);
});
test('five physically distinct vaulted roof cuts keep 25 actual rooms and center combat clear',()=>{
 const families=['ASH','IRON','ROOT','SPIRIT','FATE'];
 assert.deepEqual([...VAULT_CANOPY_FAMILIES],families);
 assert.deepEqual(Object.keys(VAULT_DEPTH_CUTS),families);
 assert.equal(new Set(Object.values(VAULT_DEPTH_CUTS).map(x=>x.join('|'))).size,5);
 for(const rows of Object.values(VAULT_DEPTH_CUTS)){assert.equal(rows.length,5);for(const row of rows){assert.equal(row.length,13);assert.match(row,/^[.#+]+$/);}}
 assert.equal(FIRST_SOUL_ROOMS.length,25);const signatures=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const a=mock(),b=mock();
  paintVaultCanopies(a.g,420,235,room.family,i);paintVaultCanopies(b.g,420,235,room.family,i);
  assert.deepEqual(a.calls,b.calls);
  const pixels=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(pixels.length>70&&pixels.length<650);
  for(const [,x,y,w,h] of pixels)assert.ok(((x>=58&&x+w<=100)||(x>=320&&x+w<=362))&&y>=20&&y+h<=92&&w>0&&h>0,room.id+' outer wall only');
  signatures.add(JSON.stringify(a.calls));
 }
 assert.equal(signatures.size,25);
});
test('real health source always renders hero, save/relic/PWA/controls stay intact at locked v0.09',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=read('../dist/js/scene/stage.js'),sanctuary=read('../dist/js/scene/sanctuaryArt.js');
 const version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(stage,/drawWayfarer\(g, actor\.x, actor\.y/);
 assert.match(stage,/reduced\.matches, health\.state\.grace\)/);
 assert.doesNotMatch(stage,/if \(health\.state\.grace === 0 \|\| Math\.floor/,'real invulnerable actor never disappears');
 assert.match(sanctuary,/paintHeroAtlas\(g,\s*pose,\s*t,\s*reducedMotion,\s*damageGrace\)/);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.40'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.40/);
 assert.ok(sw.includes('wayfarerHurtInk.js')&&sw.includes('wardenUnboundInk.js'));
});
