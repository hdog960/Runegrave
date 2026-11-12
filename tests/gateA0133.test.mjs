import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FLIGHT_RUNE_CLASSES,FLIGHT_RUNE_MASKS,FLIGHT_RUNE_PALETTES,
 flightRuneClass,flightRuneAge,flightRuneRows,paintSagaFlightRune
} from '../dist/js/enemies/sagaFlightRunes.js';
import {paintHostileProjectiles,hostileProjectileFrame} from '../dist/js/enemies/hostileProjectileArt.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const B=(speed=100,damage=1,life=2.8,dx=1,dy=0)=>({id:1,x:210,y:128,speed,damage,life,dx,dy,radius:3.4});
const profiles=[[90,1,'sentry-hex'],[100,1,'crosswind-spear'],[115,1,'root-tusk'],[145,2,'ember-cleaver'],[155,1,'iron-fletch']];
function recorder(){
 const calls=[],g={
 save(){calls.push(['save']);},restore(){calls.push(['restore']);},
 translate(...v){calls.push(['translate',...v]);},
 rotate(v){calls.push(['rotate',v]);},
 fillRect(...v){calls.push(['rect',...v]);}
 };
 for(const s of ['fillStyle','globalAlpha'])Object.defineProperty(g,s,{set(v){calls.push([s,v]);}});
 return {g,calls};
}
test('five completely distinct original Norse pixel-mask projectile silhouettes, not five recolors',()=>{
 assert.deepEqual(FLIGHT_RUNE_CLASSES,profiles.map(p=>p[2]));
 assert.deepEqual(Object.keys(FLIGHT_RUNE_MASKS),FLIGHT_RUNE_CLASSES);
 const masks=new Set();
 for(const kind of FLIGHT_RUNE_CLASSES){
  const rows=FLIGHT_RUNE_MASKS[kind],ink=FLIGHT_RUNE_PALETTES[kind];
  assert.equal(rows.length,9,kind);
  assert.ok(rows.every(row=>row.length===17&&/^[.otbcr+]+$/.test(row)),kind);
  assert.ok(rows.join('').replace(/\./g,'').length>=30,kind+' is not authored material');
  for(const letter of ['o','t','b','c','r','+'])assert.match(ink[letter],/^#[\da-f]{6}$/i);
  masks.add(rows.join('|'));
 }
 assert.equal(masks.size,5);
});
test('all five real shipped speed/damage classes map to honest visually distinct silhouettes',()=>{
 for(const [speed,damage,kind] of profiles){
  assert.equal(flightRuneClass(B(speed,damage)),kind);
  // A 100-speed Warden secondary shares a 100-speed Wisp-class visual: do
  // NOT infer an unsupported enemy origin or separate source-kind flag.
  if(speed===100)assert.equal(flightRuneClass(B(speed,1)),'crosswind-spear');
 }
 assert.equal(flightRuneClass(B(145,1)),'crosswind-spear','never call an ordinary-damage bolt a strong ember-cleaver');
 assert.equal(flightRuneClass(B(123,1)),'crosswind-spear','future unknown attacks receive safe generic art');
 assert.equal(flightRuneClass(B(93,2)),'ember-cleaver','actual heavy-damage unknown-speed bolt remains visibly heavy');
 assert.equal(flightRuneClass(B(100,2)),'ember-cleaver','same actual flight speed must show real two-damage weight');
 assert.equal(flightRuneClass(B(93,1)),'crosswind-spear','actual regular-damage unknown-speed bolt remains visibly ordinary');
});
test('three LIFE-ONLY real flight silhouettes for every physical speed, without invented time progression',()=>{
 for(const [speed,damage] of profiles){
  const frames=[2.8,1.4,.5].map(life=>flightRuneRows(B(speed,damage,life)).join('|'));
  assert.equal(new Set(frames).size,3,speed+' has no true visual lifetime differentiation');
  assert.equal(flightRuneAge(2.8),0);assert.equal(flightRuneAge(1.4),1);assert.equal(flightRuneAge(.5),2);
  assert.equal(hostileProjectileFrame(2.8),0);assert.equal(hostileProjectileFrame(1.4),1);assert.equal(hostileProjectileFrame(.5),2);
  const front=frames.map(t=>t.split('|').map(row=>row.slice(8)).join('|'));
  assert.equal(new Set(front).size,1,'must not change nose/forward threat extent as lifetime expires');
 }
});
test('actual living flight painters are deterministic, world-relative and physically heading-correct',()=>{
 const signatures=new Set();
 for(const [speed,damage] of profiles)for(const life of [2.8,1.4,.5]){
  const b=B(speed,damage,life,0,-1),a=recorder(),repeat=recorder();
  assert.equal(paintSagaFlightRune(a.g,b),true);
  paintSagaFlightRune(repeat.g,b);
  assert.deepEqual(a.calls,repeat.calls,'no independent decorative clock or nondeterminism');
  assert.deepEqual(a.calls[0],['save']);
  assert.deepEqual(a.calls[1],['translate',210,128]);
  assert.ok(Math.abs(a.calls[2][1]+Math.PI/2)<.00001,'use the REAL firing vector');
  assert.deepEqual(a.calls.at(-1),['restore']);
  const rects=a.calls.filter(c=>c[0]==='rect');
  assert.ok(rects.length>=12&&rects.length<=85,'bounded smartphone paint workload');
  assert.ok(rects.every(c=>c[1]>=-8&&c[1]+c[3]<=9&&c[2]>=-4&&c[2]+c[4]<=5),'bounded local sprite pixels');
  signatures.add(JSON.stringify(a.calls));
 }
 assert.equal(signatures.size,15,'must draw 5 physically distinct classes × 3 real ages');
});
test('unrenderable/dead/infinite flight is rejected without generating false enemy missiles',()=>{
 for(const bad of [{speed:0},{speed:NaN},{damage:0},{life:0},{life:-1},{dx:0,dy:0},{dx:Infinity},{x:NaN}]){
  const b={...B(),...bad};
  assert.throws(()=>flightRuneClass(b),RangeError);
 }
 const a=recorder();
 paintHostileProjectiles(a.g,[B(100,1,0),B(100,1,NaN)],0);
 assert.deepEqual(a.calls,[],'retired bolt must never remain visually active');
});
test('real runtime hostileProjectile painter uses new five-source masks, with all old API exports preserved',()=>{
 const game=read('../dist/js/enemies/hostileProjectileArt.js');
 assert.match(game,/paintSagaFlightRune\(g,\s*b\)/,'actual render path must paint new art');
 assert.match(game,/export function hostileProjectileStyle\(/,'retain original existing test contract');
 assert.match(game,/export function hostileProjectileFrame\(/,'retain original lifetime contract');
 assert.ok(!game.includes('inkHostileBolt(g, HOSTILE_BOLT_PIXEL_SHEETS[kind]'),'remove old two-sprite runtime call, not merely stack new art');
 const combat=read('../dist/js/enemies/encounters.js');
 for(const speed of [90,100,115,145,155])assert.ok(new RegExp('\\b'+speed+'\\b').test(combat),'class must originate from genuine game speeds: '+speed);
});
test('original hostile simulation, fixed-step collision, player saves and opt-in offline refresh remain strictly unchanged',()=>{
 const code=read('../dist/js/core/version.js');
 assert.match(code,/APP_VERSION = '0\.09\.44'/);
 assert.match(code,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(code,/SAVE_SCHEMA_VERSION = 1/);
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const sw=read('../dist/sw.js');
 assert.equal(sw,read('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.44/);
 assert.match(sw,/js\/enemies\/sagaFlightRunes\.js/);
 assert.ok(sw.includes('ACTIVATE_UPDATE')&&sw.includes('cache.addAll(ASSETS'));
});
test('new and classic combat artists stay central-canvas only with original exterior dual-thumb controllers',()=>{
 const html=read('../dist/index.html'),stage=read('../dist/js/scene/stage.js');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
 assert.ok(!read('../dist/js/enemies/sagaFlightRunes.js').includes('document.querySelector'));
 assert.ok(read('../js/enemies/sagaFlightRunes.js').includes('FLIGHT_RUNE_MASKS'));
 assert.ok(read('../js/enemies/hostileProjectileArt.js').includes('paintSagaFlightRune'));
 assert.ok(stage.includes('drawEncounter('));
 assert.ok(read('../dist/js/input/twinStick.js').includes('localStorage'));
});
