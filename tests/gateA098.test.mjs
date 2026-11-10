import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {CombatFeedback,feedbackLabel,paintSoulboltHeading,FEEDBACK_CAPACITY} from '../dist/js/scene/combatFeedback.js';
import {paintFamilyRelief,RELIEF_PATTERNS} from '../dist/js/scene/familyRelief.js';
import {paintRoomFamily} from '../dist/js/scene/familyArt.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {drawRuneDoor} from '../dist/js/scene/doorArt.js';
function mock(){
 const calls=[];const obj={canvas:{width:840,height:450},getTransform:()=>({a:2,d:2}),measureText:s=>({width:s.length*5})};
 for(const name of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText','strokeText'])obj[name]=(...a)=>calls.push([name,...a]);
 obj.createRadialGradient=()=>({addColorStop:()=>{}});
 return {g:new Proxy(obj,{set(t,k,v){t[k]=v;calls.push(['set',k,v]);return true}}),calls};
}
test('v0.09.8 combat labels reflect actual fixed damage, half hearts and pickups',()=>{
 assert.equal(feedbackLabel('hit',3),'-3');
 assert.equal(feedbackLabel('hurt',1),'-0.5 ♥');
 assert.equal(feedbackLabel('hurt',2),'-1 ♥');
 assert.equal(feedbackLabel('heal',3),'+1.5 ♥');
 assert.equal(feedbackLabel('heal',0),'FULL HEARTS');
 assert.equal(feedbackLabel('silver',7),'+7 SILVER');
 assert.equal(feedbackLabel('relic'),'RELIC BOUND');
 assert.equal(feedbackLabel('shatter'),'SHATTERED');
 assert.throws(()=>feedbackLabel('hit',-1));
 assert.throws(()=>feedbackLabel('heal',NaN));
});
test('hit/reward feedback is bounded and only fixed physics steps age it',()=>{
 const marks=new CombatFeedback();
 assert.equal(marks.add({x:NaN,y:40},'hit',2),false);
 for(let i=0;i<60;i++)marks.add({x:i+4,y:30},'hit',i%4+1);
 assert.equal(marks.length,FEEDBACK_CAPACITY);
 assert.equal(marks.snapshot[0].text,'-3');
 const oldAge=marks.snapshot[0].age;
 const {g,calls}=mock();marks.paint(g,420,225);
 assert.equal(marks.snapshot[0].age,oldAge,'render never advances deterministic timer');
 assert.ok(calls.some(c=>c[0]==='strokeText'));
 assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
 assert.ok(calls.filter(c=>c[0]==='fillText').every(c=>c[2]>=0&&c[2]<=420));
 assert.throws(()=>marks.step(0));assert.throws(()=>marks.step(.25));
 for(let i=0;i<110;i++)marks.step(1/120);
 assert.equal(marks.length,0);
 marks.add({x:20,y:20},'shatter');marks.reset();assert.equal(marks.length,0);
});
test('aim heading is a short world-space visual and never an on-screen input overlay',()=>{
 const {g,calls}=mock();
 paintSoulboltHeading(g,{x:120,y:100},{x:0,y:-1},false,.5);
 assert.equal(calls.length,0);
 paintSoulboltHeading(g,{x:120,y:100},{x:0,y:-1},true,0,true);
 assert.ok(calls.some(x=>x[0]==='fill'));
 const lines=calls.filter(x=>['moveTo','lineTo'].includes(x[0]));
 assert.ok(lines.length>=4);
 assert.ok(lines.every(x=>Math.hypot(x[1]-120,x[2]-100)<45));
 assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
});
test('five new carved floor reliefs have materially different bounded silhouettes',()=>{
 assert.equal(Object.keys(RELIEF_PATTERNS).length,5);
 const signatures=[];
 for(const family of Object.keys(RELIEF_PATTERNS)){
  const room=FIRST_SOUL_ROOMS.find(r=>r.family===family);
  assert.ok(room);
  const {g,calls}=mock();paintFamilyRelief(g,420,225,room);
  assert.ok(calls.length>=70&&calls.length<=155,`${family} ${calls.length} operations`);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
  signatures.push(JSON.stringify(calls));
  const full=mock();paintRoomFamily(full.g,420,225,0,room);
  assert.ok(full.calls.length<550,'new relief replaces old trim without breaking prior mobile draw budget');
 }
 assert.equal(new Set(signatures).size,5);
 assert.throws(()=>paintFamilyRelief(mock().g,420,225,{id:'bad',family:'INVALID'}));
});
test('open original Norse doorway includes visible split leaves and stays world-space',()=>{
 const open=mock(),locked=mock();
 drawRuneDoor(open.g,{x:180,y:110},'west',true,0);
 drawRuneDoor(locked.g,{x:180,y:110},'west',false,0);
 assert.notDeepEqual(open.calls,locked.calls);
 assert.ok(open.calls.filter(x=>x[0]==='fillRect').length>locked.calls.filter(x=>x[0]==='fillRect').length);
 assert.equal(open.calls.filter(x=>x[0]==='save').length,open.calls.filter(x=>x[0]==='restore').length);
});
test('Gate A remains unapproved with eight relics and correct offline precache',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);assert.match(version,/APP_VERSION = '0\.09\.15'/);
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(sw,/runegrave-shell-v0\.09\.15/);
 for(const mod of ['js/scene/combatFeedback.js','js/scene/familyRelief.js']){
  assert.ok(sw.includes(mod));assert.ok(existsSync(new URL('../dist/'+mod,import.meta.url)));
 }
});
