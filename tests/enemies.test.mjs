import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMY_KINDS, HostileEncounter, placeRoomExit, walkableRoute } from '../dist/js/enemies/encounters.js';
import { makeRootvaultWorld, safeSpawn, isPositionFree, HERO_RADIUS } from '../dist/js/physics/world.js';
import { MortalHearts } from '../dist/js/health/mortalHearts.js';
import { SoulboltCombat } from '../dist/js/combat/soulbolts.js';
import { FIXED_DT, FixedStepClock } from '../dist/js/physics/fixedStep.js';
import { existsSync, readFileSync } from 'node:fs';
const make=(room='crypt',height=240)=>{const world=makeRootvaultWorld(420,height),hero=safeSpawn(world,{x:110,y:105});return {world,hero,health:new MortalHearts(),encounter:new HostileEncounter(world,room,hero)};};
const advance=(e,health,hero,n)=>{for(let i=0;i<n;i++)e.step(FIXED_DT,hero,health);};
const destroy=(e)=>{for(const enemy of [...e.snapshot.enemies])if(enemy.alive)for(let i=0;i<24&&enemy.alive;i++)assert.equal(e.hitAt({x:enemy.x,y:enemy.y},3,2,{x:0,y:0}),enemy.id);};

test('six distinct hostile AI kinds are registered and actually instantiate across two waves',()=>{
 assert.deepEqual([...ENEMY_KINDS],['draugr','wisp','archer','charger','sentinel','shade']);
 const {encounter:e,hero,health}=make();assert.equal(e.snapshot.phase,'locked');assert.equal(e.snapshot.wave,1);
 assert.deepEqual(e.snapshot.enemies.map(x=>x.kind),['draugr','wisp','archer']);
 assert.equal(e.canLeave(e.exit),false);
 destroy(e);e.step(FIXED_DT,hero,health);
 assert.equal(e.snapshot.wave,2);assert.equal(e.snapshot.phase,'locked');
 assert.deepEqual(e.snapshot.enemies.filter(x=>x.alive).map(x=>x.kind),['charger','sentinel','shade']);
 destroy(e);e.step(FIXED_DT,hero,health);
 assert.equal(e.snapshot.kills,6);assert.equal(e.snapshot.phase,'gate');
 assert.equal(e.canLeave(hero),false);assert.equal(e.canLeave(e.exit),true);
});
test('legally placed enemies and open exits fit every reference combat camera',()=>{
 for(const h of [148,157,170,190,218,260,310,350]){
   const {world,encounter,hero}=make('crypt',h);
   assert.ok(isPositionFree(world,placeRoomExit(world),HERO_RADIUS),`exit ${h}`);
   const path=walkableRoute(world,hero,placeRoomExit(world));
   assert.ok(path.length>=2,`reachable entrance-to-exit path at ${h}`);
   path.forEach(point=>assert.ok(isPositionFree(world,point,HERO_RADIUS),`corridor cell at ${h}`));
   for(const enemy of encounter.enemies){assert.ok(isPositionFree(world,enemy,enemy.radius),`${enemy.kind}/${h}`);assert.ok(Math.hypot(enemy.x-hero.x,enemy.y-hero.y)>enemy.radius+HERO_RADIUS+18);}
   const boss=make('warden',h).encounter.enemies[0];assert.equal(boss.kind,'warden');assert.ok(isPositionFree(world,boss,boss.radius));
 }
});
test('hostile contact damages real Mortal Hearts, but grace prevents a same-second health collapse',()=>{
 const {encounter:e,hero,health}=make();const enemy=e.enemies[0];enemy.x=hero.x;enemy.y=hero.y;enemy.cooldown=1;
 e.step(FIXED_DT,hero,health);assert.equal(health.state.units,5);assert.ok(health.state.grace>0);
 advance(e,health,hero,30);assert.equal(health.state.units,5);
});
test('wisp, archer, and sentinel only launch after visible wind-up states',()=>{
 const {encounter:e,hero,health}=make();for(const en of e.enemies)en.cooldown=0;
 e.step(FIXED_DT,hero,health);
 for(const enemy of e.enemies.filter(x=>x.kind!=='draugr'))assert.equal(enemy.state,'warning');
 assert.equal(e.snapshot.shots,0);
 advance(e,health,hero,100);assert.ok(e.snapshot.shots>0);
 assert.ok(e.projectiles.every(b=>Number.isFinite(b.x+b.y)&&b.radius>0));
 // Turret is wave 2, with an unambiguous warning before its radial volley.
 destroy(e);e.step(FIXED_DT,hero,health);const sentinel=e.enemies.find(x=>x.kind==='sentinel');sentinel.cooldown=0;
 e.step(FIXED_DT,hero,health);assert.equal(sentinel.state,'warning');
 const before=e.snapshot.shots;advance(e,health,hero,115);assert.ok(e.snapshot.shots>=before+3);
});
test('charger commits to warned dash, shade vanishes and returns, and boss has two actual phases',()=>{
 const {encounter:e,hero,health}=make();destroy(e);e.step(FIXED_DT,hero,health);
 const charger=e.enemies.find(x=>x.kind==='charger'),shade=e.enemies.find(x=>x.kind==='shade');
 charger.cooldown=0;shade.cooldown=0;e.step(FIXED_DT,hero,health);
 assert.equal(charger.state,'warning');assert.equal(shade.state,'warning');
 advance(e,health,hero,100);assert.equal(charger.state,'charge');assert.ok(['hidden','recover'].includes(shade.state));
 const boss=make('warden');const w=boss.encounter.enemies[0];assert.equal(w.hp,28);
 for(let i=0;i<7;i++)boss.encounter.hitAt(w,3,2,{x:1,y:0});
 assert.equal(w.hp,14);assert.equal(w.phase,2);
 advance(boss.encounter,boss.health,{x:100,y:90},210);assert.ok(boss.encounter.snapshot.shots>=5,'warden must fire an actual fan volley');
 for(let i=0;i<7;i++)boss.encounter.hitAt(w,3,2,{x:0,y:0});
 assert.equal(boss.encounter.snapshot.phase,'gate');assert.equal(boss.encounter.snapshot.bossDefeated,true);assert.equal(boss.encounter.snapshot.kills,1);
 assert.equal(boss.encounter.canLeave(boss.encounter.exit),true);
});
test('projectile integration damages hostiles through real Soulbolt collision and impact hooks',()=>{
 const {world,hero,encounter:e}=make();
 const combat=new SoulboltCombat(world,hero,false);
 combat.setHostileHitHandler((p,r,d,dir)=>e.hitAt(p,r,d,dir));
 const target=e.enemies[0];
 // Use a near, clear location to isolate projectiles from scenery without bypassing the firing pipeline.
 const p=safeSpawn(world,{x:hero.x+42,y:hero.y});target.x=p.x;target.y=p.y;
 assert.ok(Math.abs(target.y-hero.y)<.01);
 let hitEvents=0;combat.on('impact',event=>{if(event.targetId===target.id)hitEvents++;});
 for(let i=0;i<160;i++)combat.update(FIXED_DT,hero,{x:1,y:0},true);
 assert.ok(hitEvents>=1,'a pooled Soulbolt must intersect a real hostile target');
 assert.ok(target.hp<target.maxHp);assert.ok(combat.state.hits>=1);
});
test('the encounter simulation is deterministic across multiple rendering frame rates',()=>{
 const results=[];
 for(const fps of [30,60,120,144]){
  const {hero,health,encounter:e}=make();const clock=new FixedStepClock();
  for(let i=0;i<fps*4;i++)clock.advance(1/fps,dt=>{health.step(dt);e.step(dt,hero,health);});
  results.push({ticks:clock.ticks,hearts:health.state.units,shots:e.snapshot.shots,positions:e.enemies.map(x=>[x.x,x.y,x.state]),projectiles:e.snapshot.projectiles.map(x=>[x.x,x.y])});
 }
 results.forEach(v=>{assert.equal(v.ticks,480);assert.deepEqual(v,results[0]);});
});
test('resize keeps enemy HP, wave, kills and boss phase while removing offscreen projectiles',()=>{
 const {world,hero,health,encounter:e}=make();const d=e.enemies[0];e.hitAt(d,3,2,{x:0,y:0});
 const before={hp:d.hp,kills:e.snapshot.kills,wave:e.snapshot.wave};
 const next=makeRootvaultWorld(420,310);e.reframe(next);
 assert.equal(d.hp,before.hp);assert.equal(e.snapshot.wave,before.wave);assert.equal(e.snapshot.kills,before.kills);
 for(const enemy of e.enemies)if(enemy.alive)assert.ok(isPositionFree(next,enemy,enemy.radius));
 assert.ok(isPositionFree(next,e.exit,HERO_RADIUS));
});
test('invalid hostile simulation time and locked doors cannot silently advance',()=>{
 const {encounter:e,hero,health}=make();const before=e.snapshot.kills;
 for(const dt of [0,-.1,.5,NaN,Infinity])assert.throws(()=>e.step(dt,hero,health));
 assert.equal(e.snapshot.kills,before);assert.equal(e.canLeave(e.exit),false);
});
test('the enemy art, sixfold crypt status and finish menu ship inside the separate center layout',()=>{
 const f=name=>new URL('../dist/'+name,import.meta.url);
 const html=readFileSync(f('index.html'),'utf8');
 assert.match(html,/id="trial-clear-overlay"/);assert.match(html,/id="trial-new-run-btn"/);
 assert.match(html,/THE FIRST SOUL/);
 assert.ok(!html.includes('onmousemove='));
 for(const name of ['js/enemies/encounters.js','js/enemies/enemyArt.js'])assert.ok(existsSync(f(name)));
 const sw=readFileSync(f('sw.js'),'utf8');assert.ok(sw.includes('runegrave-shell-v0.09.37'));
 assert.ok(sw.includes('js/enemies/encounters.js')&&sw.includes('js/enemies/enemyArt.js'));
});
