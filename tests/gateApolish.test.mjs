import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {describeRelicImpact} from '../dist/js/run/relicImpact.js';
import {FirstSoulInventory,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
import {carvedWaystones} from '../dist/js/scene/routeArt.js';
import {ENEMY_ATTACK_TELLS} from '../dist/js/enemies/enemyArt.js';
import {drawRuneDoor} from '../dist/js/scene/doorArt.js';

const snap=(inventory,hearts)=>({profile:inventory.profile(),heartUnits:hearts.state.units,heartContainers:hearts.state.containers});
test('all eight collectible relic cards show changes grounded in real applied run state',()=>{
 const inventory=new FirstSoulInventory(),hearts=new MortalHearts();
 assert.equal(FIRST_SOUL_RELICS.length,8);
 for(const relic of FIRST_SOUL_RELICS){
   const before=snap(inventory,hearts);
   assert.equal(inventory.acquire(relic.id,hearts),true);
   const change=describeRelicImpact(relic.id,before,snap(inventory,hearts));
   assert.ok(change.includes('→') || change.includes('+½'),`${relic.id}: ${change}`);
   assert.ok(change.length>18,`${relic.id}: too vague`);
 }
});
test('relic impact explicitly matches the real hit, reload and heart capacity numbers',()=>{
 const inventory=new FirstSoulInventory(),h=new MortalHearts();
 let before=snap(inventory,h);inventory.acquire('wyrd-fang',h);
 assert.match(describeRelicImpact('wyrd-fang',before,snap(inventory,h)),/DAMAGE\s+2 → 3/);
 before=snap(inventory,h);inventory.acquire('skald-drum',h);
 assert.match(describeRelicImpact('skald-drum',before,snap(inventory,h)),/200ms → 160ms/);
 before=snap(inventory,h);inventory.acquire('shieldroot',h);
 assert.match(describeRelicImpact('shieldroot',before,snap(inventory,h)),/3 → 4/);
});
test('waystones appear only on valid already-reachable line segments and at bounded density',()=>{
 assert.deepEqual(carvedWaystones([]),[]);
 assert.deepEqual(carvedWaystones([{x:0,y:0}]),[]);
 const points=Array.from({length:46},(_,i)=>({x:i*5,y:20}));
 const marks=carvedWaystones(points,20);
 assert.ok(marks.length>=8&&marks.length<=12);
 assert.ok(marks.every(p=>p.y===20 && p.x>=0 && p.x<=225));
 assert.throws(()=>carvedWaystones(points,7));
 const teleport=[{x:0,y:0},{x:300,y:0}];
 assert.deepEqual(carvedWaystones(teleport,20),[],'never paint a false path across a collision gap');
});
test('all six enemy kinds and the boss have distinct and readable attack warnings',()=>{
 assert.equal(Object.keys(ENEMY_ATTACK_TELLS).length,7);
 const words=Object.values(ENEMY_ATTACK_TELLS).map(t=>t.label);
 assert.equal(new Set(words).size,7);
 for(const meta of Object.values(ENEMY_ATTACK_TELLS)){
   assert.ok(meta.label.length>=4);
   assert.match(meta.color,/^#[0-9a-f]{6}$/i);
 }
});
test('door artwork, paused relic stat preview, world-route floor stones and PWA remain separate from controls',()=>{
 assert.equal(typeof drawRuneDoor,'function');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const stage=readFileSync(new URL('../dist/js/scene/stage.js',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(html,/id="relic-reveal-change"/);
 assert.match(stage,/paintWaystones/);
 assert.match(stage,/carvedWaystones/);
 assert.match(stage,/describeRelicImpact/);
 assert.match(sw,/runegrave-shell-v0\.09\.6/);
 for(const p of ['js/run/relicImpact.js','js/scene/routeArt.js'])assert.ok(sw.includes(p));
 assert.equal((html.match(/id="gameplay-canvas"/g)||[]).length,1);
});
