import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WOUND_KINDS,WOUND_LIFE,WoundInk,woundKind,woundOriginAngle,paintWoundSigil} from '../dist/js/scene/woundSigilInk.js';
import {MortalHearts,DAMAGE_GRACE_SECONDS} from '../dist/js/health/mortalHearts.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const hero={x:170,y:100},source={x:190,y:100};
function fake(){
 const ops=[],g={};
 for(const m of ['save','restore','fillRect','rotate','translate','beginPath','rect','clip'])g[m]=(...args)=>ops.push([m,...args]);
 Object.defineProperty(g,'globalAlpha',{set:v=>ops.push(['globalAlpha',v])});
 Object.defineProperty(g,'fillStyle',{set:v=>ops.push(['fillStyle',v])});
 return {g,ops};
}
test('three genuinely different original forged damage-source silhouettes without fabricating a new mechanic',()=>{
 assert.deepEqual(WOUND_KINDS,['contact','ember','projectile','unknown']);
 assert.equal(woundKind('enemy:draugr'),'contact');assert.equal(woundKind('enemy:warden'),'contact');
 assert.equal(woundKind('west-ember'),'ember');assert.equal(woundKind('east-ember'),'ember');
 assert.equal(woundKind('soulshot:crypt'),'projectile');assert.equal(woundKind(null),'unknown');
 const unique=new Set();
 for(const s of ['enemy:warden','west-ember','soulshot:warden']){
  const w=new WoundInk();assert.equal(w.record(hero,s,source,2),true);
  assert.equal(w.snapshot.length,1);
  const out=fake();w.paint(out.g,420,235);
  assert.ok(out.ops.filter(x=>x[0]==='fillRect').length>=20);
  unique.add(JSON.stringify(out.ops));
 }
 assert.equal(unique.size,3,'damage kind must be shape-distinct, not one generic recolored ring');
});
test('source bearing is truthful for nearby contact and ember but NEVER invented for a destroyed projectile',()=>{
 assert.equal(woundOriginAngle('contact',hero,source),0);
 assert.ok(Math.abs(woundOriginAngle('ember',hero,{x:170,y:130})-Math.PI/2)<1e-9);
 assert.equal(woundOriginAngle('projectile',hero,source),null);
 assert.equal(woundOriginAngle('unknown',hero,source),null);
 assert.equal(woundOriginAngle('contact',hero,undefined),null);
 assert.equal(woundOriginAngle('contact',hero,hero),null);
 assert.equal(new WoundInk().record(hero,'enemy:sentinel',undefined),true);
 const p=new WoundInk();p.record(hero,'soulshot:crypt',source);
 assert.equal(p.snapshot[0].angle,null,'spent hostile projectiles have no reliable source vector');
 assert.throws(()=>paintWoundSigil(fake().g,{kind:'contact',x:0,y:0,life:0,age:0,amount:1,angle:null}),RangeError);
});
test('fixed-step actual Mortal Hearts damage—not a fake cosmetic timer—triggers and expires source-linked wound mark',()=>{
 const hp=new MortalHearts(),ink=new WoundInk();let previous=hp.state.units;
 // No injury from ordinary render/fixed step alone.
 for(let i=0;i<8;i++){hp.step(1/60);ink.step(1/60);}
 assert.equal(ink.length,0);
 assert.equal(hp.hurt(1,'enemy:draugr'),'hurt');
 if(hp.state.units<previous)ink.record(hero,hp.state.source,source,previous-hp.state.units);
 assert.equal(ink.length,1);assert.equal(ink.snapshot[0].amount,1);
 previous=hp.state.units;
 assert.equal(hp.hurt(1,'soulshot:crypt'),'blocked');
 if(hp.state.units<previous)ink.record(hero,hp.state.source,undefined,previous-hp.state.units);
 assert.equal(ink.length,1,'grace-blocked attack must not invent any additional wound');
 for(let i=0;i<Math.ceil(WOUND_LIFE*60)+2;i++)ink.step(1/60);
 assert.equal(ink.length,0,'exact fixed-step expiry');assert.equal(DAMAGE_GRACE_SECONDS,1);
});
test('all damage glyphs remain bounded, finite and preserve their silhouette under reduced motion',()=>{
 const ink=new WoundInk();ink.record(hero,'west-ember',source,1);
 const a=fake(),b=fake(),reduced=fake();ink.paint(a.g,420,235);ink.paint(b.g,420,235);ink.paint(reduced.g,420,235,true);
 assert.deepEqual(a.ops,b.ops);assert.ok(a.ops.length<110);
 assert.ok(reduced.ops.some(x=>x[0]==='clip'),'never render over touch rails');
 for(let i=0;i<10;i++)ink.step(1/60);
 assert.equal(ink.length,1);
 assert.notDeepEqual(ink.snapshot[0].age,0);
 assert.throws(()=>ink.step(2),RangeError);
 assert.throws(()=>ink.paint(fake().g,40,40),RangeError);
});
test('wound renderer never leaks events, survives reset and maintains capacity at four real events',()=>{
 const ink=new WoundInk();
 for(let i=0;i<10;i++)assert.equal(ink.record({x:hero.x+i,y:hero.y},'enemy:charger',source,1),true);
 assert.equal(ink.length,4);assert.equal(ink.snapshot[0].x,176);
 assert.ok(ink.snapshot.every(x=>x.life===WOUND_LIFE));
 const out=fake();ink.paint(out.g,420,235);
 assert.ok(out.ops.filter(z=>z[0]==='fillRect').length>80);
 ink.reset();assert.equal(ink.length,0);assert.equal(ink.record({x:NaN,y:10},'enemy:draugr',source),false);
});
test('the LIVE player health-loss code binds enemy/ember coordinates, but not fictional projectile directions',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const src=read('../dist/js/scene/stage.js');
 assert.match(src,/health\.state\.units < previousHeartUnits/);
 assert.match(src,/woundInk\.record\(actor, hurtSource, sourceEnemy \|\| sourcePad,/);
 assert.match(src,/woundInk\.paint\(g, W, H, reduced\.matches\)/);
 assert.match(src,/woundInk\.step\(dt\)/);
 assert.match(src,/woundInk\.reset\(\)/);
 assert.ok(!src.includes('sourceProjectile'),'never infer a consumed bolt origin');
 assert.match(read('../dist/js/core/version.js'),/APP_VERSION = '0\.09\.46'/);
 assert.match(read('../dist/js/core/version.js'),/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(read('../dist/js/core/version.js'),/SAVE_SCHEMA_VERSION = 1/);
 assert.match(read('../dist/sw.js'),/runegrave-shell-v0\.09\.46/);
 assert.ok(read('../dist/sw.js').includes('./js/scene/woundSigilInk.js'));
 assert.ok(read('../sw.js').includes('./js/scene/woundSigilInk.js'));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
