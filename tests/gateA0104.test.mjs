import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {relicAppearance,paintEarnedSoulboltArt,paintBoundRuneHalo,RELIC_ART_CAP} from '../dist/js/run/relicBattleArt.js';
import {FIRST_SOUL_RELICS,FIRST_SOUL_ROOMS,FirstSoulInventory} from '../dist/js/run/firstSoul.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
function canvas(){const calls=[];const c={};for(const k of ['save','restore','fillRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale'])c[k]=(...a)=>calls.push([k,...a]);return {calls,g:c};}
test('all eight REAL equipped relics are represented and illegal visual identities are refused',()=>{
 const ids=FIRST_SOUL_RELICS.map(r=>r.id);assert.equal(ids.length,8);
 const all=relicAppearance(ids);assert.deepEqual(Object.values(all),Array(8).fill(true));
 assert.throws(()=>relicAppearance(['wyrd-fang','wyrd-fang']),/Invalid/);
 assert.throws(()=>relicAppearance(['imaginary']),/Invalid/);
 const inv=new FirstSoulInventory(),hearts=new MortalHearts();for(const id of ids)inv.acquire(id,hearts);
 assert.deepEqual(relicAppearance(inv.state.relics),all);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
});
test('Soulbolt accents do NOT render in empty loadouts, with capped active projectiles',()=>{
 const bolt=(i)=>({active:true,x:20+i,y:30,dx:1,dy:0});
 const none=canvas();paintEarnedSoulboltArt(none.g,Array.from({length:50},(_,i)=>bolt(i)),[],1.2);
 assert.equal(none.calls.length,0);
 const all=canvas();paintEarnedSoulboltArt(all.g,Array.from({length:90},(_,i)=>bolt(i)),FIRST_SOUL_RELICS.map(x=>x.id),1.2);
 assert.equal(all.calls.filter(x=>x[0]==='translate').length,RELIC_ART_CAP);
 assert.equal(all.calls.filter(x=>x[0]==='save').length,RELIC_ART_CAP+1);
 assert.equal(all.calls.filter(x=>x[0]==='restore').length,RELIC_ART_CAP+1);
 assert.ok(all.calls.length<RELIC_ART_CAP*25,'bounded draw-call count');
});
test('Each offensive relic changes projectile silhouette, including stacked relic builds',()=>{
 const bolt=[{active:true,x:120,y:60,dx:1,dy:0}];const signatures=[];
 for(const id of ['wyrd-fang','skald-drum','storm-feather','hugin-lens','ash-anchor']){
   const c=canvas();paintEarnedSoulboltArt(c.g,bolt,[id],1,true);signatures.push(JSON.stringify(c.calls));
 }
 assert.equal(new Set(signatures).size,5);
 const c=canvas();paintEarnedSoulboltArt(c.g,bolt,['wyrd-fang','storm-feather','hugin-lens'],1,true);
 assert.ok(c.calls.length>Math.max(...signatures.map(x=>JSON.parse(x).length)));
});
test('Hero relic halo shows at most three equipped rune chips and freezes in reduced motion',()=>{
 const ids=FIRST_SOUL_RELICS.map(x=>x.id),player={x:200,y:120};
 const p=canvas();paintBoundRuneHalo(p.g,player,ids,4.4);
 assert.equal(p.calls.filter(c=>c[0]==='fill').length,3);
 const a=canvas(),b=canvas();paintBoundRuneHalo(a.g,player,ids,0,true);paintBoundRuneHalo(b.g,player,ids,45,true);
 assert.deepEqual(a.calls,b.calls);
 assert.ok(p.calls.length<65);assert.equal(p.calls.filter(c=>c[0]==='restore').length,1);
 const quiet=canvas();paintBoundRuneHalo(quiet.g,player,[],1);assert.equal(quiet.calls.length,0);
});
test('Gate A remains v0.09 and offline preload has the new module; input prefs and canonical docs remain protected',()=>{
 const version=readFileSync(new URL('../src/core/version.ts',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 const stage=readFileSync(new URL('../src/scene/stage.ts',import.meta.url),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);assert.match(version,/APP_VERSION = '0\.09\.17'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);assert.match(sw,/runegrave-shell-v0\.09\.17/);
 assert.match(sw,/js\/run\/relicBattleArt\.js/);
 assert.match(stage,/paintEarnedSoulboltArt\(/);assert.match(stage,/paintBoundRuneHalo\(/);
 assert.doesNotMatch(stage,/setInterval|setTimeout/);
});
