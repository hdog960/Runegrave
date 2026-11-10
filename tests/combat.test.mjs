import test from 'node:test';
import assert from 'node:assert/strict';
import { makeRootvaultWorld, safeSpawn, isPositionFree } from '../dist/js/physics/world.js';
import { SoulboltCombat, SOULBOLT_STATS, MAX_BOLTS } from '../dist/js/combat/soulbolts.js';
import { FIXED_DT, FixedStepClock } from '../dist/js/physics/fixedStep.js';
const near=(a,b,e=.001)=>assert.ok(Math.abs(a-b)<e,`${a} ≈ ${b}`);
const setup=(height=260)=>{const w=makeRootvaultWorld(420,height);const h=safeSpawn(w);return {w,h,combat:new SoulboltCombat(w,h)};};

// Real v0.06 behavior; these targets are NOT hostile enemies.
test('training targets spawn at safe positions in every supported camera aspect',()=>{
  for(const height of [170,185,218,260,310]){
    const {w,h,combat}=setup(height);assert.equal(combat.targets.length,3);
    for(const t of combat.targets){assert.ok(isPositionFree(w,t,t.radius+4),t.id);assert.ok(Math.hypot(t.x-h.x,t.y-h.y)>t.radius+23,t.id);}
    assert.equal(combat.getMovementWorld().solids.length,w.solids.length+3);
  }
});

test('projectile pool allocates fixed slots and returns those slots to service after expiry',()=>{
  const {h,combat}=setup();assert.equal(combat.bolts.length,MAX_BOLTS);
  let shots=0,expires=0;combat.on('shot',()=>shots++);combat.on('expire',()=>expires++);
  for(let n=0;n<100;n++){
    for(let i=0;i<50;i++)combat.update(FIXED_DT,h,{x:1,y:0},true);
  }
  assert.ok(shots>80,{shots});assert.equal(combat.bolts.length,MAX_BOLTS);assert.ok(expires>50,{expires});
  assert.ok(combat.state.activeBolts<MAX_BOLTS);
  assert.ok(combat.bolts.every(b=>b.active||b.travel>=0));
});

test('world scenery blocks projectiles before any damage can pass through a solid',()=>{
  const {w,combat}=setup();
  const origin={x:118,y:182};
  let walls=0;combat.on('impact',e=>{if(e.targetId===null)walls++;});
  assert.ok(combat.fire(origin,{x:-1,y:0}));
  for(let i=0;i<180;i++)combat.update(FIXED_DT,origin,{x:-1,y:0},false);
  assert.ok(walls>0,'projectile must strike the solid or wall');
  assert.equal(combat.state.hits,0);
});

test('damage, hit events, knockback, shatter and respawn have actual effects',()=>{
  const {w,combat}=setup();const target=combat.targets.find(t=>t.kind==='effigy');assert.ok(target);
  let fired=0,impacts=0,broken=0;
  combat.on('shot',()=>fired++);combat.on('impact',e=>{if(e.targetId===target.id){impacts++;assert.equal(e.damage,2);}});
  combat.on('break',e=>{if(e.targetId===target.id)broken++;});
  const start={x:target.x-46,y:target.y};const firstX=target.x;
  assert.ok(isPositionFree(w,start,10));
  for(let t=0;t<180;t++)combat.update(FIXED_DT,start,{x:1,y:0},true);
  assert.ok(fired>1);assert.ok(impacts>=3,{impacts,fired});assert.equal(broken,1);
  assert.equal(target.alive,false);assert.equal(target.hp,0);assert.ok(target.x>firstX,'knockback is physical');
  assert.equal(combat.state.shattered,1);assert.equal(combat.getMovementWorld().solids.length,w.solids.length+2);
  for(let t=0;t<1200;t++)combat.update(FIXED_DT,start,{x:1,y:0},false);
  assert.equal(target.alive,true);assert.equal(target.hp,target.maxHp);
});

test('damage and target outcomes are frame-rate independent with a fixed-step clock',()=>{
  const outputs=[];
  for(const fps of [30,60,120,144]){
    const {h,combat}=setup();const t=combat.targets[0];const origin={x:t.x-48,y:t.y};
    const clock=new FixedStepClock();
    for(let i=0;i<fps*2;i++)clock.advance(1/fps,dt=>combat.update(dt,origin,{x:1,y:0},true));
    outputs.push({state:combat.state,targets:combat.targets.map(t=>({x:t.x,y:t.y,hp:t.hp,alive:t.alive})),ticks:clock.ticks});
  }
  for(const x of outputs.slice(1)){
    assert.equal(x.ticks,240);assert.deepEqual(x.state,outputs[0].state);
    x.targets.forEach((t,i)=>{near(t.x,outputs[0].targets[i].x);near(t.y,outputs[0].targets[i].y);assert.equal(t.hp,outputs[0].targets[i].hp);assert.equal(t.alive,outputs[0].targets[i].alive);});
  }
});

test('no zero-vector attack, cooldown bypass, invalid dt or unsafe hook recursion',()=>{
  const {h,combat}=setup();assert.equal(combat.fire(h,{x:0,y:0}),false);
  assert.ok(combat.fire(h,{x:0,y:-1}));assert.equal(combat.fire(h,{x:0,y:-1}),false);
  assert.throws(()=>combat.update(-1,h,{x:1,y:0},true));
  assert.throws(()=>combat.update(.5,h,{x:1,y:0},true));
  const second=setup().combat;
  second.on('shot',()=>second.fire(h,{x:1,y:0}));
  // Firing during shot dispatch is prevented by cooldown even without a cycle.
  assert.ok(second.fire(h,{x:0,y:-1}));
});
