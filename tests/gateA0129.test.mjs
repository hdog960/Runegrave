import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEATH_RITE_KINDS,DEATH_RITE_BODIES,DEATH_RITE_ASH,DEATH_RITE_PALETTES,deathRiteFrame,deathRiteGlyph,paintDeathRite} from '../dist/js/scene/sagaDeathRites.js';
import {MotionTrails,DISSOLVE_CAP,TRAIL_CAP} from '../dist/js/scene/motionTrails.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const HERO={x:120,y:110},IDLE={x:0,y:0};
const AGENTS=DEATH_RITE_KINDS.map(kind=>({kind,id:'real-'+kind,alive:true,x:200,y:125,radius:kind==='warden'?18:10}));
function painter(){
 const calls=[],g={};
 for(const m of ['save','restore','beginPath','rect','clip','fillRect'])
  g[m]=(...args)=>calls.push([m,...args]);
 for(const prop of ['fillStyle','globalAlpha'])
  Object.defineProperty(g,prop,{set:v=>calls.push([prop,v])});
 return {g,calls};
}
test('all seven original real enemy kinds possess distinct hand-authored Norse material and soul ash silhouettes',()=>{
 assert.deepEqual(DEATH_RITE_KINDS,['draugr','wisp','archer','charger','sentinel','shade','warden']);
 assert.deepEqual(Object.keys(DEATH_RITE_BODIES),DEATH_RITE_KINDS);
 assert.deepEqual(Object.keys(DEATH_RITE_ASH),DEATH_RITE_KINDS);
 assert.deepEqual(Object.keys(DEATH_RITE_PALETTES),DEATH_RITE_KINDS);
 const pictures=new Set(), ashes=new Set();
 for(const kind of DEATH_RITE_KINDS){
  const body=DEATH_RITE_BODIES[kind],ash=DEATH_RITE_ASH[kind],pal=DEATH_RITE_PALETTES[kind];
  assert.equal(body.length,kind==='warden'?15:11,kind);
  assert.equal(ash.length,7,kind);
  assert.ok(body.every(row=>row.length>8&&row.length<=19),kind);
  assert.ok(body.join('').replace(/[. ]/g,'').length>=40,kind+' must be actual illustrated stone, not 3 random pixels');
  for(const row of [...body,...ash])for(const ch of row)if(ch!=='.'&&ch!==' ')assert.equal(typeof pal[ch],'string',kind+' missing material '+ch);
  pictures.add(body.join('|'));ashes.add(ash.join('|'));
 }
 assert.equal(pictures.size,7);assert.equal(ashes.size,7);
 assert.ok(DEATH_RITE_BODIES.warden.join('').length>DEATH_RITE_BODIES.wisp.join('').length);
});
test('three collapse silhouettes follow ONLY original fixed-step death age, not visual frame time or fake combat damage',()=>{
 assert.equal(deathRiteFrame(0,.55),0);
 assert.equal(deathRiteFrame(.18,.55),1);
 assert.equal(deathRiteFrame(.45,.55),2);
 assert.equal(deathRiteFrame(.4,.92),1,'original Warden uses .92 second lifetime');
 assert.equal(deathRiteFrame(.85,.92),2);
 assert.throws(()=>deathRiteFrame(-.2,.55),RangeError);
 assert.throws(()=>deathRiteFrame(.1,0),RangeError);
 assert.throws(()=>deathRiteGlyph('not-an-enemy',0),RangeError);
 assert.throws(()=>deathRiteGlyph('warden',3),RangeError);
 for(const kind of DEATH_RITE_KINDS){
  assert.strictEqual(deathRiteGlyph(kind,0),DEATH_RITE_BODIES[kind]);
  assert.strictEqual(deathRiteGlyph(kind,1),DEATH_RITE_BODIES[kind]);
  assert.strictEqual(deathRiteGlyph(kind,2),DEATH_RITE_ASH[kind]);
 }
});
test('actual true-kill tracking produces one rite per living-to-dead transition; fake repeat deaths produce no extra visual entity',()=>{
 const fx=new MotionTrails(),e=AGENTS[0];
 fx.observeEnemies([e]);fx.observeEnemies([e]);
 assert.equal(fx.state.dissolves,0);
 fx.observeEnemies([{...e,alive:false}]);
 fx.observeEnemies([{...e,alive:false}]);
 assert.equal(fx.state.dissolves,1,'one real physical defeat, one original kill art');
 const paint=painter();fx.paintDissolves(paint.g,420,235);
 assert.ok(paint.calls.some(x=>x[0]==='fillRect'));
 assert.ok(!paint.calls.some(x=>x[0]==='arc'),'eliminate generic shared ring');
 for(let i=0;i<16;i++){
  const id='k'+i;
  fx.observeEnemies([{...e,id,alive:true},{...e,id:'dead-'+i,alive:false}]);
  fx.observeEnemies([{...e,id,alive:false}]);
 }
 assert.ok(fx.state.dissolves<=DISSOLVE_CAP);
 fx.reset();assert.deepEqual(fx.state,{footsteps:0,dissolves:0,tracked:0});
});
test('all seven species have physically different actual-world canvas render output at the exact true death position',()=>{
 const frames=[];
 for(const agent of AGENTS){
  const fx=new MotionTrails();
  fx.observeEnemies([agent]);fx.observeEnemies([{...agent,alive:false}]);
  const one=painter(),two=painter();
  fx.paintDissolves(one.g,420,235);
  fx.paintDissolves(two.g,420,235);
  assert.deepEqual(one.calls,two.calls,'render frames cannot advance death time');
  const rects=one.calls.filter(x=>x[0]==='fillRect');
  assert.ok(rects.length>=25&&rects.length<=170,agent.kind+' mobile draw budget');
  assert.ok(rects.some(p=>p[4]===3),'real sprite-cell height must be three world pixels, not unreadable subpixels');
  for(const [,x,y,w,h] of rects){
   assert.ok(x>=agent.x-42&&x+w<=agent.x+42,agent.kind+' death pixels stay near real corpse, not in UI rail');
   assert.ok(y>=agent.y-37&&y+h<=agent.y+37,agent.kind+' death sculpture must not become a fake screen-wide hazard');
  }
  assert.ok(one.calls.some(x=>x[0]==='rect'&&x[1]===0&&x[2]===0&&x[3]===420&&x[4]===235),'explicit central canvas clipping');
  frames.push(JSON.stringify(one.calls));
 }
 assert.equal(new Set(frames).size,7);
});
test('physical scripted fixed-step middle collapse and final ash are distinctive for EVERY enemy kind',()=>{
 for(const e of AGENTS){
  const fx=new MotionTrails();fx.observeEnemies([e]);fx.observeEnemies([{...e,alive:false}]);
  const signals=[];
  const life=e.kind==='warden'?.92:.55;
  let advanced=0;
  for(const fraction of [0,.45,.80]){
   const target=Math.floor(life*fraction*120);
   for(let i=advanced;i<target;i++)fx.step(1/120,HERO,IDLE);
   advanced=target;
   assert.equal(fx.state.dissolves,1);
   const pic=painter();fx.paintDissolves(pic.g,420,235);signals.push(JSON.stringify(pic.calls));
  }
  assert.equal(new Set(signals).size,3,e.kind+' requires first, cracked and ash frames from REAL aged event');
  for(let j=advanced;j<120*1.2;j++)fx.step(1/120,HERO,IDLE);
  assert.equal(fx.state.dissolves,0,e.kind+' must expire on physics step');
 }
});
test('reduced motion keeps its prior NO TRANSIENT FX rule and never changes permanent character or gameplay state',()=>{
 const fx=new MotionTrails();
 fx.observeEnemies([AGENTS[6]]);fx.observeEnemies([{...AGENTS[6],alive:false}]);
 const a=painter();fx.paintDissolves(a.g,420,235,true);assert.deepEqual(a.calls,[]);
 const b=painter();fx.paintDissolves(b.g,420,235,false);assert.ok(b.calls.length>35);
 assert.throws(()=>fx.step(1,HERO,IDLE),RangeError);
 assert.ok(TRAIL_CAP>0&&DISSOLVE_CAP<=8);
 assert.throws(()=>paintDeathRite(painter().g,{kind:'warden',x:100,y:90,age:-1,life:.92},420,235),RangeError);
});
test('death sprites are drawn BEHIND all living enemy warnings, projectiles, pickups and unobstructed hero',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=read('../dist/js/scene/stage.js');
 const ground=stage.indexOf('motionTrails.paintGround(');
 const death=stage.indexOf('motionTrails.paintDissolves(');
 const warnings=stage.indexOf('drawEncounter(',death);
 const drops=stage.indexOf('drawRoomDrops(',warnings);
 assert.ok(ground>=0&&death>ground&&warnings>death&&drops>warnings,'safe layered world draw priority');
 assert.equal(stage.split('motionTrails.paintDissolves(').length-1,1,'no ghost second death ink pass');
 const enemy=read('../dist/js/enemies/encounters.js');
 assert.ok(enemy.includes('e.alive = false'),'only real defeated enemy creates art');
});
test('v0.09 Gate A relics, rooms, save schema and real consented offline asset remain intact without touching either thumb rail',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const v=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(v,/APP_VERSION = '0\.09\.42'/);
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.42/);
 assert.ok(sw.includes('./js/scene/sagaDeathRites.js'));
 assert.ok(read('../sw.js').includes('./js/scene/sagaDeathRites.js'));
 const controls=read('../dist/js/input/twinStick.js');
 assert.ok(controls.includes('localStorage'));
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
