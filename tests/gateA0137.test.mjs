import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SOULBOLT_STATS,MAX_BOLTS,SoulboltCombat} from '../dist/js/combat/soulbolts.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS,FirstSoulInventory} from '../dist/js/run/firstSoul.js';
import {MortalHearts} from '../dist/js/health/mortalHearts.js';
import {SOULBOLT_INK_CLASSES,SOULBOLT_INK_PATTERNS,SOULBOLT_INK_COLORS,soulboltInkClass,soulboltInkPhase,soulboltInkRows,paintTrueSoulbolt} from '../dist/js/combat/sagaSoulboltRuneInk.js';
import {drawSoulbolts,drawCombatSparks} from '../dist/js/combat/combatArt.js';
const text=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const B=(damage=2,travel=0,dx=1,dy=0)=>({id:1,active:true,x:208,y:115,dx,dy,travel,damage});
const fake=()=>{const calls=[],g={save(){calls.push(['save']);},restore(){calls.push(['restore']);},translate(...a){calls.push(['translate',...a]);},rotate(a){calls.push(['rotate',a]);},fillRect(...a){calls.push(['rect',...a]);}};
 for(const k of ['fillStyle','globalAlpha'])Object.defineProperty(g,k,{set(v){calls.push([k,v]);}});
 return {g,calls};
};
const draw=(b)=>{const {g,calls}=fake();paintTrueSoulbolt(g,b);return calls;};
test('two physically distinct original 17x9 outgoing projectile silhouettes keyed only to actual combat damage',()=>{
 assert.deepEqual(SOULBOLT_INK_CLASSES,['ordinary-oath','fang-bound']);
 assert.deepEqual(Object.keys(SOULBOLT_INK_PATTERNS),SOULBOLT_INK_CLASSES);
 const distinct=new Set();
 for(const kind of SOULBOLT_INK_CLASSES){
  const rows=SOULBOLT_INK_PATTERNS[kind];
  assert.equal(rows.length,9);
  assert.ok(rows.every(s=>s.length===17&&/^[.obcw+]+$/.test(s)));
  assert.ok(rows.join('').replace(/\./g,'').length>=45,'no token minimalist icon');
  const colors=SOULBOLT_INK_COLORS[kind];
  for(const ink of ['o','b','c','w','+'])assert.match(colors[ink],/^#[a-f0-9]{6}$/i);
  distinct.add(rows.join('|'));
 }
 assert.equal(distinct.size,2,'must not just recolor the original generic projectile');
 assert.equal(SOULBOLT_STATS.damage,2);
 const inv=new FirstSoulInventory(),h=new MortalHearts();
 assert.equal(inv.profile().damage,2);
 inv.acquire('wyrd-fang',h);
 assert.equal(inv.profile().damage,3);
 assert.equal(soulboltInkClass(B(2)),'ordinary-oath');
 assert.equal(soulboltInkClass(B(3)),'fang-bound');
 assert.equal(soulboltInkClass(B(5)),'fang-bound','future stronger actual shot does not look like weak base');
});
test('six real-distance physical engravings: actual 2 attack damage classes x 3 real distance bands',()=>{
 const signatures=new Set();
 for(const damage of [2,3]){
  const frames=[0,95,195].map(distance=>soulboltInkRows(B(damage,distance)).join('|'));
  assert.equal(new Set(frames).size,3,'three travel cuts must change real rear silhouette');
  const front=frames.map(rows=>rows.split('|').map(row=>row.slice(6)).join('|'));
  assert.equal(new Set(front).size,1,'real forward hit direction and nose cannot move');
  frames.forEach(s=>signatures.add(s));
 }
 assert.equal(signatures.size,6);
 assert.equal(soulboltInkPhase(0),0);assert.equal(soulboltInkPhase(79.99),0);
 assert.equal(soulboltInkPhase(80),1);assert.equal(soulboltInkPhase(179.99),1);
 assert.equal(soulboltInkPhase(180),2);assert.equal(soulboltInkPhase(355),2);
});
test('actual incoming render coordinates/heading deterministically anchored, bounded 17x9 and never changed by wall time',()=>{
 const visuals=new Set();
 for(const damage of [2,3])for(const travel of [0,95,195]){
  const b=B(damage,travel,0,-1),a=draw(b),again=draw(b);
  assert.deepEqual(a,again);
  assert.deepEqual(a[0],['save']);assert.deepEqual(a.at(-1),['restore']);
  assert.deepEqual(a[1],['translate',208,115]);
  assert.ok(Math.abs(a[2][1]+Math.PI/2)<1e-9);
  const cells=a.filter(s=>s[0]==='rect');
  assert.ok(cells.length>=12&&cells.length<90,'bounded smartphone draw runs');
  assert.ok(cells.every(([_,x,y,w,h])=>x>=-8&&x+w<=9&&y>=-4&&y+h<=5&&w>0&&h===1));
  visuals.add(JSON.stringify(a));
 }
 assert.equal(visuals.size,6);
});
test('retired slots draw absolutely nothing, invalid real active shots do not forge false art',()=>{
 const dead=fake();
 assert.equal(paintTrueSoulbolt(dead.g,{...B(),active:false}),false);
 assert.deepEqual(dead.calls,[]);
 for(const invalid of [{damage:0},{damage:NaN},{travel:-.1},{travel:Infinity},{dx:0,dy:0},{x:NaN},{dy:Infinity}]){
  const b={...B(),...invalid};
  assert.throws(()=>paintTrueSoulbolt(fake().g,b),RangeError);
 }
 const idle=fake();drawSoulbolts(idle.g,[{...B(),active:false}],0);
 assert.deepEqual(idle.calls,[]);
 assert.throws(()=>drawSoulbolts(fake().g,[],NaN),RangeError);
});
test('same REAL Soulbolt pool, no generated extra projectiles, no modification of combat timing or collision',()=>{
 const base=fake(),boosted=fake();
 drawSoulbolts(base.g,[B(2,0)],0);drawSoulbolts(boosted.g,[B(3,0)],15);
 assert.notDeepEqual(base.calls,boosted.calls);
 assert.equal(base.calls.filter(c=>c[0]==='save').length,1);
 assert.equal(boosted.calls.filter(c=>c[0]==='save').length,1);
 assert.equal(MAX_BOLTS,48);
 assert.deepEqual(SOULBOLT_STATS,{damage:2,cooldown:.20,speed:258,range:274,radius:3,knockback:10});
 assert.equal(FIRST_SOUL_RELICS.length,8);assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(typeof drawCombatSparks,'function','all prior true fixed-step impacts preserved');
});
test('actual shipping live projectile painter is new authentic art and old generic blurred rectangle is GONE',()=>{
 const src=text('../src/combat/combatArt.ts'),built=text('../dist/js/combat/combatArt.js');
 assert.match(src,/paintTrueSoulbolt\s*\(\s*g\s*,\s*b\s*\)/);
 assert.match(built,/paintTrueSoulbolt\s*\(\s*g\s*,\s*b\s*\)/);
 assert.ok(!built.includes('const pulse = .86 + .14 * Math.sin(time * 17)'),'remove independent false visual clock');
 assert.ok(!built.includes("combatPixelRect(g, -12, -6, 24, 12"),'no old fake giant 24px hitbox haze');
 assert.match(built,/paintSagaCombatImpact\s*\(\s*g\s*,\s*s\s*\)/,'retain exactly the real per-event impact artist in compiled combat renderer');
 assert.ok(text('../js/combat/combatArt.js').includes('paintTrueSoulbolt(g,b)'));
 assert.ok(text('../js/combat/sagaSoulboltRuneInk.js').includes('SOULBOLT_INK_PATTERNS'));
});
test('new visuals preserve frozen v0.09 Gate A, root production parity, schema1 and user-consented OFFLINE PWA',()=>{
 const v=text('../dist/js/core/version.js');
 assert.match(v,/APP_VERSION = '0\.09\.47'/);
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 const sw=text('../dist/sw.js');
 assert.equal(sw,text('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.47/);
 assert.ok(sw.includes('./js/combat/sagaSoulboltRuneInk.js'));
 assert.ok(sw.includes('ACTIVATE_UPDATE')&&sw.includes('cache.addAll(ASSETS.map('),'player must approve new offline update');
 const html=text('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
 const input=text('../src/input/twinStick.ts');assert.ok(!input.includes('sagaSoulboltRuneInk'));
});
