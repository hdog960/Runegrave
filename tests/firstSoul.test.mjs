import test from 'node:test';
import assert from 'node:assert/strict';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS,FIRST_SOUL_CHAMBERS,FirstSoulInventory,createFirstSoulRoute,encounterPlan} from '../dist/js/run/firstSoul.js';
import {HostileEncounter,walkableRoute,reachableFloor,placeRoomExit} from '../dist/js/enemies/encounters.js';
import {makeRootvaultWorld,safeSpawn,isPositionFree,HERO_RADIUS} from '../dist/js/physics/world.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
import {SoulboltCombat,SOULBOLT_STATS} from '../dist/js/combat/soulbolts.js';
import {readFileSync} from 'node:fs';

const worlds=[148,160,190,218,260,310].map(h=>makeRootvaultWorld(420,h));
test('exactly 25 titled authored encounter configurations have unique ID and playable rules',()=>{
  assert.equal(FIRST_SOUL_ROOMS.length,25);
  assert.equal(new Set(FIRST_SOUL_ROOMS.map(r=>r.id)).size,25);
  assert.equal(new Set(FIRST_SOUL_ROOMS.map(r=>JSON.stringify(r.waves))).size,25);
  assert.equal(new Set(FIRST_SOUL_ROOMS.map(r=>r.title)).size,25);
  for(const room of FIRST_SOUL_ROOMS){
    assert.ok(room.title.length>7&&room.rune.length>=1&&/^#[a-f0-9]{6}$/i.test(room.accent));
    assert.ok(room.waves.length>=1&&room.waves.length<=3);
    for(const wave of room.waves)assert.ok(wave.length>=1&&wave.length<=3);
  }
});
test('all 25 room configurations spawn legal enemies and a connected gate across compact/large cameras',()=>{
 for(const world of worlds){
   const hero=safeSpawn(world,{x:110,y:105});
   for(const room of FIRST_SOUL_ROOMS){
     const encounter=new HostileEncounter(world,'crypt',hero,encounterPlan(room));
     const path=walkableRoute(world,hero,encounter.exit);
     assert.ok(path.length>1,`${room.id} has no east exit at height ${world.height}`);
     assert.ok(isPositionFree(world,encounter.exit,HERO_RADIUS));
     assert.ok(encounter.enemies.length===room.waves[0].length);
     for(const e of encounter.enemies)assert.ok(isPositionFree(world,e,e.radius),`${room.id}:${e.id} collision`);
   }
 }
});
test('authored chambers are reachable via connected walkable routes and reward-floor options',()=>{
 const world=worlds[2],hero=safeSpawn(world,{x:110,y:105});
 for(const room of FIRST_SOUL_ROOMS){
   const encounter=new HostileEncounter(world,'crypt',hero,encounterPlan(room));
   const floor=reachableFloor(world,hero);
   assert.ok(floor.length>100,`${room.id} no reachable pickup floor`);
   const goal=floor.find(p=>Math.hypot(p.x-hero.x,p.y-hero.y)>28&&Math.hypot(p.x-encounter.exit.x,p.y-encounter.exit.y)>25);
   assert.ok(goal&&walkableRoute(world,hero,goal).length>0,room.id);
 }
});
test('connected eight-room routes are reproducible, nonrepeating, and draw from all 25 authored configurations',()=>{
 const seed='wyrd-needle-001';
 const a=createFirstSoulRoute(seed),b=createFirstSoulRoute(seed);
 assert.deepEqual(a,b);assert.equal(a.length,FIRST_SOUL_CHAMBERS);assert.equal(new Set(a.map(r=>r.id)).size,8);
 assert.ok(a.every(r=>FIRST_SOUL_ROOMS.includes(r)));
 const seen=new Set();for(let i=0;i<32;i++)for(const r of createFirstSoulRoute(`first-soul-${i}`))seen.add(r.id);
 assert.equal(seen.size,25,'all room configurations must be reachable through alternate first-soul runs');
 assert.notDeepEqual(createFirstSoulRoute('A').map(r=>r.id),createFirstSoulRoute('B').map(r=>r.id));
 for(const bad of ['', 'x'.repeat(161)])assert.throws(()=>createFirstSoulRoute(bad));
});
test('all eight relics have stable IDs, distinct bonuses and a real cumulative combat modifier',()=>{
 const health=new MortalHearts(),bag=new FirstSoulInventory();
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(new Set(FIRST_SOUL_RELICS.map(r=>r.id)).size,8);
 let old=bag.profile();
 for(const relic of FIRST_SOUL_RELICS){
   assert.ok(bag.acquire(relic.id,health),relic.id);assert.equal(bag.acquire(relic.id,health),false,'relic must not duplicate');
   const next=bag.profile();
   if(['wyrd-fang','skald-drum','storm-feather','hugin-lens','ash-anchor'].includes(relic.id))assert.notDeepEqual(old,next,`${relic.id} no combat benefit`);
   old=next;
 }
 assert.equal(bag.state.relics.length,8);assert.equal(health.state.containers,4);
 assert.equal(bag.profile().damage,3);assert.equal(bag.profile().cooldown,SOULBOLT_STATS.cooldown*.8);
 assert.equal(bag.profile().speed,SOULBOLT_STATS.speed*1.25);
 assert.equal(bag.profile().range,SOULBOLT_STATS.range*1.3);
 assert.equal(bag.profile().knockback,SOULBOLT_STATS.knockback*1.7);
 assert.equal(bag.collectSilver(2),5);
 assert.equal(bag.state.silver,5);
});
test('the healing relic actually restores health on room clear and guarded pickup handling rejects invalid amounts',()=>{
 const bag=new FirstSoulInventory(),health=new MortalHearts();health.hurt(2,'test');
 assert.equal(health.state.units,4);
 bag.acquire('eir-thread',health);assert.equal(health.state.units,5);
 bag.roomCleared(health);assert.equal(health.state.units,6);
 bag.roomCleared(health);assert.equal(health.state.units,6);
 assert.equal(bag.state.heartsRestored,2);
 for(const invalid of [0,-2,NaN,1.4,101])assert.throws(()=>bag.collectSilver(invalid));
 assert.throws(()=>bag.acquire('fake-relic',health));
});
test('Soulbolt damage/cadence/range/speed/knockback physically adopt new relic profile',()=>{
 const world=worlds[2],hero=safeSpawn(world,{x:210,y:115});
 const bag=new FirstSoulInventory(),health=new MortalHearts(),c=new SoulboltCombat(world,hero,false);
 c.setProfile(bag.profile());
 assert.equal(c.combatProfile.damage,SOULBOLT_STATS.damage);
 for(const relic of FIRST_SOUL_RELICS)bag.acquire(relic.id,health);
 c.setProfile(bag.profile());
 assert.equal(c.combatProfile.damage,3);
 assert.equal(c.combatProfile.speed,SOULBOLT_STATS.speed*1.25);
 const events=[];c.on('shot',e=>events.push(e));
 c.update(1/120,hero,{x:1,y:0},true);
 assert.ok(events.length>=1);
 assert.equal(c.bolts.find(b=>b.active)?.damage,3);
 assert.throws(()=>c.setProfile({...bag.profile(),damage:0}));
});
test('Mortal container bonus truly enlarges health capacity, then restart resets to original three',()=>{
 const health=new MortalHearts(),bag=new FirstSoulInventory();
 health.hurt(2,'test');assert.equal(health.state.units,4);
 assert.equal(bag.acquire('shieldroot',health),true);
 assert.equal(health.state.units,6);assert.equal(health.state.maxUnits,8);
 health.reset();bag.reset();
 assert.equal(health.state.maxUnits,6);assert.equal(health.state.units,6);assert.equal(bag.state.relics.length,0);
});
test('PWA precaches v0.09 run modules and Gate A artwork approval is not silently granted',()=>{
 const read=x=>readFileSync(new URL(`../dist/${x}`,import.meta.url),'utf8');
 const sw=read('sw.js'),html=read('index.html'),stage=read('js/scene/stage.js');
 for(const p of ['js/run/firstSoul.js','js/run/lootArt.js'])assert.ok(sw.includes(p));
 assert.ok(sw.includes('runegrave-shell-v0.09.46'));
 assert.match(html,/GATE A .*APPROVAL REQUIRED/);
 assert.match(html,/data-relic-line/);assert.match(html,/data-silver/);
 assert.match(stage,/setCanvasData\('roomIndex'|data\.roomIndex|dataset\.roomIndex/);
 assert.equal((html.match(/id="gameplay-canvas"/g)||[]).length,1);
});
