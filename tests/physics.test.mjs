import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXED_DT, FixedStepClock } from '../dist/js/physics/fixedStep.js';
import { HERO_RADIUS,WALK_SPEED,makeRootvaultWorld,moveCircle,safeSpawn,isPositionFree,overlapsSolid,resolvePosition } from '../dist/js/physics/world.js';

const near=(a,b,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} should equal ${b} (±${tolerance})`);

test('fixed-step simulation progresses identically at 30, 60, 120 and 144 rendering FPS',()=>{
  const world=makeRootvaultWorld(420,260);
  const results=[];
  for(const fps of [30,60,120,144]){
    const clock=new FixedStepClock();let actor=safeSpawn(world),ticks=0;
    for(let i=0;i<fps*2;i++)clock.advance(1/fps,(dt)=>{actor=moveCircle(world,actor,{x:WALK_SPEED*.55,y:WALK_SPEED*.2},dt);ticks++;});
    results.push({actor,ticks});
  }
  for(const r of results){assert.equal(r.ticks,240);assert.ok(isPositionFree(world,r.actor));}
  for(const r of results.slice(1)){near(r.actor.x,results[0].actor.x);near(r.actor.y,results[0].actor.y);}
});

test('a long hidden-tab frame is capped, never a burst of hundreds of movement ticks',()=>{
  const clock=new FixedStepClock();let n=0;
  assert.equal(clock.advance(70,()=>n++),12);assert.equal(n,12);
  clock.reset();assert.equal(clock.remainder,0);
  assert.equal(clock.advance(0,()=>n++),0);
  assert.throws(()=>clock.advance(-1,()=>{}));assert.throws(()=>clock.advance(Infinity,()=>{}));
});

test('camera-aware collision worlds have no duplicate solids and use box, capsule geometry',()=>{
  for(const height of [184,218.4,260,310,370]){
    const w=makeRootvaultWorld(420,height),ids=w.solids.map(s=>s.id);
    assert.equal(ids.length,10);assert.equal(new Set(ids).size,ids.length);
    assert.ok(w.solids.some(s=>s.kind==='box'));
    assert.ok(w.solids.some(s=>s.kind==='capsule'));
    assert.ok(isPositionFree(w,safeSpawn(w)));
    assert.ok(w.minY>50&&w.maxY<height-10);
  }
  assert.throws(()=>makeRootvaultWorld(100,300));assert.throws(()=>makeRootvaultWorld(420,50));
});

test('safe spawning relocates away from graves and rejects impossible radius',()=>{
  const w=makeRootvaultWorld(420,260);
  assert.ok(!isPositionFree(w,{x:75,y:182}));
  const spawn=safeSpawn(w,{x:75,y:182});assert.ok(isPositionFree(w,spawn));
  assert.ok(Math.hypot(spawn.x-75,spawn.y-182)>20);
  assert.throws(()=>safeSpawn(w,{x:210,y:110},250));
});

test('barrier prevents tunneling, even with high-speed movement across a tomb',()=>{
  const w=makeRootvaultWorld(420,260);const before={x:110,y:180};
  assert.ok(isPositionFree(w,before));
  const p=moveCircle(w,before,{x:-680,y:0},.25);
  assert.ok(isPositionFree(w,p));
  assert.ok(p.x>95,`avatar crossed tomb: ${p.x}`);
});

test('sliding along tombs and root capsules remains free of collisions',()=>{
  const w=makeRootvaultWorld(420,260);
  let p={x:114,y:147};
  for(let i=0;i<90;i++){
    p=moveCircle(w,p,{x:-WALK_SPEED*.6,y:WALK_SPEED*.8},FIXED_DT);
    assert.ok(isPositionFree(w,p),`collision at tick ${i}: ${JSON.stringify(p)}`);
  }
  assert.ok(p.y>147);assert.ok(p.x<114);
});

test('walls stop the hero at physical bounds and no off-camera movement is possible',()=>{
  const w=makeRootvaultWorld(420,260);
  let p=safeSpawn(w);
  for(let i=0;i<2000;i++)p=moveCircle(w,p,{x:-130,y:-130},FIXED_DT);
  assert.ok(isPositionFree(w,p));assert.ok(p.x>=w.minX+HERO_RADIUS);assert.ok(p.y>=w.minY+HERO_RADIUS);
  for(let i=0;i<2000;i++)p=moveCircle(w,p,{x:130,y:130},FIXED_DT);
  assert.ok(isPositionFree(w,p));assert.ok(p.x<=w.maxX-HERO_RADIUS);assert.ok(p.y<=w.maxY-HERO_RADIUS);
});

test('collision shape primitives distinguish circle, box and irregular root capsules',()=>{
  const circle={id:'round',kind:'circle',x:100,y:100,radius:15};
  const box={id:'box',kind:'box',x:50,y:50,width:25,height:25};
  const cap={id:'root',kind:'capsule',ax:100,ay:150,bx:180,by:150,radius:5};
  assert.ok(overlapsSolid({x:100,y:120},10,circle));
  assert.ok(overlapsSolid({x:70,y:65},10,box));
  assert.ok(overlapsSolid({x:140,y:161},10,cap));
  assert.ok(!overlapsSolid({x:140,y:190},10,cap));
  const artificial={width:420,height:260,minX:15,maxX:405,minY:50,maxY:240,solids:[circle,box,cap]};
  assert.ok(isPositionFree(artificial,resolvePosition(artificial,{x:100,y:100})));
});

test('zero velocity, invalid dt and corrupted move vectors cannot affect physics',()=>{
  const w=makeRootvaultWorld(420,260),start=safeSpawn(w);
  assert.deepEqual(moveCircle(w,start,{x:0,y:0},FIXED_DT),start);
  assert.throws(()=>moveCircle(w,start,{x:1,y:0},-.5));
  assert.throws(()=>moveCircle(w,start,{x:1,y:0},.5));
  assert.throws(()=>moveCircle(w,start,{x:NaN,y:0},FIXED_DT));
});

test('seeded deterministic input sequence produces identical world coordinates over time',()=>{
  const w=makeRootvaultWorld(420,260);
  const replay=()=>{
    let p=safeSpawn(w);const path=[];
    for(let i=0;i<800;i++){
      const angle=i%80<40?i*.04:-i*.06;
      p=moveCircle(w,p,{x:Math.cos(angle)*WALK_SPEED,y:Math.sin(angle)*WALK_SPEED},FIXED_DT);
      if(i%50===0)path.push([p.x,p.y]);
      assert.ok(isPositionFree(w,p));
    }
    return path;
  };
  assert.deepEqual(replay(),replay());
});
