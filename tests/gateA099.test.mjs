import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {MotionTrails,TRAIL_CAP,DISSOLVE_CAP,GROUND_COLORS} from '../dist/js/scene/motionTrails.js';
import {roomHeraldry,paintRoomHeraldry} from '../dist/js/scene/roomHeraldry.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {paintRoomFamily} from '../dist/js/scene/familyArt.js';

function painter(){
 const calls=[];
 const obj={canvas:{width:840,height:450},getTransform:()=>({a:2,d:2})};
 for(const name of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText','strokeText'])
  obj[name]=(...a)=>calls.push([name,...a]);
 obj.createRadialGradient=()=>({addColorStop:()=>{}});
 return {g:new Proxy(obj,{set(t,k,v){t[k]=v;calls.push(['set',k,v]);return true}}),calls};
}
test('v0.09.9 Norse motion trails are strictly bounded and fixed-step aged',()=>{
 const fx=new MotionTrails();
 assert.deepEqual(fx.state,{footsteps:0,dissolves:0,tracked:0});
 for(let n=0;n<420;n++)fx.step(1/120,{x:135+n*.2,y:115},{x:1,y:0});
 assert.ok(fx.state.footsteps>0&&fx.state.footsteps<=TRAIL_CAP,fx.state);
 const {g,calls}=painter();fx.paintGround(g,420,220,'ASH');
 assert.ok(calls.some(c=>c[0]==='fillRect'));
 assert.equal(fx.state.footsteps,fx.state.footsteps,'render cannot change simulation ages');
 for(let n=0;n<120;n++)fx.step(1/120,{x:210,y:118},{x:0,y:0});
 assert.equal(fx.state.footsteps,0,'aged footsteps must expire even after player stops');
 assert.throws(()=>fx.step(0,{x:100,y:100},{x:1,y:0}));
 assert.throws(()=>fx.step(1/2,{x:100,y:100},{x:1,y:0}));
 assert.throws(()=>fx.step(1/120,{x:NaN,y:100},{x:1,y:0}));
});
test('Soul-ash blooms require an actual living-to-dead hostile transition',()=>{
 const fx=new MotionTrails();
 const e={id:'rune-draugr',alive:true,kind:'draugr',radius:9,x:130,y:125};
 fx.observeEnemies([e]);fx.observeEnemies([e]);
 assert.equal(fx.state.dissolves,0,'no spawn effects that could mimic pickup damage');
 fx.observeEnemies([{...e,alive:false}]);fx.observeEnemies([{...e,alive:false}]);
 assert.equal(fx.state.dissolves,1,'death should bloom exactly once');
 const {g,calls}=painter();fx.paintDissolves(g,420,220);
 assert.ok(calls.some(c=>c[0]==='arc'));
 for(let i=0;i<18;i++)fx.observeEnemies([{...e,id:'other'+i,alive:true},{...e,id:'other'+i,alive:false}]);
 assert.ok(fx.state.dissolves<=DISSOLVE_CAP);
 for(let n=0;n<120;n++)fx.step(1/120,{x:180,y:130},{x:0,y:0});
 assert.equal(fx.state.dissolves,0,'all blooms expire by fixed simulation time');
 fx.reset();assert.deepEqual(fx.state,{footsteps:0,dissolves:0,tracked:0});
});
test('Reduced-motion presentation draws no transient FX and never touches player HUD',()=>{
 const fx=new MotionTrails();
 for(let i=0;i<60;i++)fx.step(1/120,{x:110,y:130},{x:1,y:0});
 fx.observeEnemies([{id:'warden',kind:'warden',alive:true,x:210,y:130,radius:18}]);
 fx.observeEnemies([{id:'warden',kind:'warden',alive:false,x:210,y:130,radius:18}]);
 const {g,calls}=painter();fx.paintGround(g,420,215,'FATE',true);fx.paintDissolves(g,420,215,true);
 assert.equal(calls.length,0);
 const live=painter();fx.paintGround(live.g,420,215,'ROOT',false);fx.paintDissolves(live.g,420,215,false);
 assert.ok(live.calls.some(c=>c[0]==='arc'));
 assert.equal(live.calls.filter(c=>c[0]==='save').length,live.calls.filter(c=>c[0]==='restore').length);
 assert.equal(Object.keys(GROUND_COLORS).length,5);
});
test('All 25 room heraldry signatures are distinct and keep their canonical family',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 const labels=FIRST_SOUL_ROOMS.map(room=>roomHeraldry(room));
 assert.equal(new Set(labels.map(x=>`${x.sigil}:${x.cuts}`)).size,25);
 for(const label of labels){assert.ok(label.cuts>=1&&label.cuts<=5);assert.ok(label.sigil>=0&&label.sigil<5);}
 assert.throws(()=>roomHeraldry({id:'bad',family:'ASH'}));
 assert.throws(()=>roomHeraldry({id:'fs-01',family:'FATE'}));
 assert.throws(()=>roomHeraldry({id:'fs-44',family:'ASH'}));
});
test('World heraldry art is bounded, noninteractive and respects mobile draw budgets',()=>{
 const signatures=[];
 for(const room of FIRST_SOUL_ROOMS){
  const {g,calls}=painter();paintRoomHeraldry(g,420,190,room);
  assert.ok(calls.length<70,`bounded heraldry draw for ${room.id}`);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
  signatures.push(JSON.stringify(calls));
  const full=painter();paintRoomFamily(full.g,420,190,0,room);
  assert.ok(full.calls.length<565,`mobile room draw budget for ${room.id}: ${full.calls.length}`);
 }
 assert.equal(new Set(signatures).size,25,'25 authored compositions must be visibly distinguishable');
});
test('Gate A source preserves seven authorities, saved controller preferences and offline FX modules',()=>{
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);assert.match(version,/APP_VERSION = '0\.09\.30'/);
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(sw,/runegrave-shell-v0\.09\.30/);
 for(const file of ['js/scene/motionTrails.js','js/scene/roomHeraldry.js']){
  assert.ok(sw.includes(file),file);assert.ok(existsSync(new URL('../dist/'+file,import.meta.url)));
 }
 const controls=readFileSync(new URL('../dist/js/input/twinStick.js',import.meta.url),'utf8');
 assert.match(controls,/runegrave:input:v1/);assert.match(controls,/pauseForInterruption/);
 const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.match(css,/min-height:34px/);
});
