import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {RELIC_CRESTS,drawRelicCrest} from '../dist/js/run/relicCrests.js';
import {warningBeat,warningLabelY,drawWarningBeats} from '../dist/js/enemies/warningClarity.js';
function mock(){
 const calls=[];
 const g={};
 for(const name of ['save','restore','fill','stroke','fillRect','strokeRect','beginPath','moveTo','lineTo','closePath','arc'])g[name]=(...v)=>{calls.push([name,...v]);};
 return {g:new Proxy(g,{set(o,k,v){calls.push(['set',k,v]);o[k]=v;return true;}}),calls};
}
test('all 8 original working relic IDs have unique silhouette emblems and nonempty labels',()=>{
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.deepEqual(Object.keys(RELIC_CRESTS).sort(),FIRST_SOUL_RELICS.map(r=>r.id).sort());
 const signatures=[];
 for(const relic of FIRST_SOUL_RELICS){
  const emblem=RELIC_CRESTS[relic.id];assert.ok(emblem.label&&emblem.color&&emblem.silhouette);
  const {g,calls}=mock();drawRelicCrest(g,relic.id);
  assert.ok(calls.length>=11,`${relic.id} has insufficient custom vector commands`);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
  signatures.push(calls.filter(c=>['moveTo','lineTo','arc'].includes(c[0])).map(c=>JSON.stringify(c)).join('|'));
 }
 assert.equal(new Set(signatures).size,8,'all relics must have truly different shapes');
 assert.equal(new Set(Object.values(RELIC_CRESTS).map(c=>c.silhouette)).size,8);
 assert.throws(()=>drawRelicCrest(mock().g,'unknown'));
});
test('enemy countdown beats increase monotonically and do not alter simulation',()=>{
 assert.deepEqual([1.8,.7,.6,.4,.39,.2,.19,0].map(warningBeat),[0,0,1,2,2,2,3,3]);
 assert.throws(()=>warningBeat(-.1));assert.throws(()=>warningBeat(Infinity));
 for(const height of [148,171,200,250,375])for(const boss of [false,true])for(const y of [9,30,65,height-12,height-2]){
  const baseline=warningLabelY(y,boss?24:10,height,boss);
  assert.ok(baseline-13>=0&&baseline+6<height,{height,y,boss,baseline});
 }
 assert.throws(()=>warningLabelY(0,12,50,false));
 const {g,calls}=mock();drawWarningBeats(g,120,50,.1,'#ff8855');
 assert.equal(calls.filter(c=>c[0]==='fillRect').length,3);
 assert.equal(calls.filter(c=>c[0]==='strokeRect').length,3);
 assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
});
test('crests and warning frames are compiled, precached, and controller changes stay within side grips',()=>{
 const prefix=new URL('../dist/',import.meta.url);
 const sw=readFileSync(new URL('sw.js',prefix),'utf8');
 for(const src of ['js/run/relicCrests.js','js/enemies/warningClarity.js']){
  assert.ok(existsSync(new URL(src,prefix)),src);
  assert.ok(sw.includes(src),`not precached: ${src}`);
 }
 assert.match(sw,/runegrave-shell-v0\.09\.42/);
 const css=readFileSync(new URL('styles.css',prefix),'utf8');
 assert.match(css,/@media \(hover:none\) and \(pointer:coarse\)/);
 assert.match(css,/\.rune-socket \{?/);
 const version=readFileSync(new URL('js/core/version.js',prefix),'utf8');
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/APP_VERSION = '0\.09\.42'/);
});
