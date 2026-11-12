import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PRACTICE_CARVINGS,PRACTICE_MATERIALS,practiceCarvingPhase,practiceCarvingRows,paintTruePracticeCarving} from '../dist/js/combat/sagaPracticeCarvings.js';
import {drawPracticeTargets} from '../dist/js/combat/combatArt.js';
import {SOULBOLT_STATS,MAX_BOLTS} from '../dist/js/combat/soulbolts.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const T=(kind='effigy',hp=6,maxHp=6)=>({id:'real-training',kind,x:220,y:119,radius:kind==='effigy'?12:10,hp,maxHp,flash:0,respawn:0,alive:true});
function mock(){const calls=[];const g={save(){calls.push(['save']);},restore(){calls.push(['restore']);},translate(...args){calls.push(['translate',...args]);},beginPath(){},ellipse(...args){calls.push(['ellipse',...args]);},fill(){},fillRect(...args){calls.push(['rect',...args]);}};Object.defineProperty(g,'fillStyle',{set(s){calls.push(['color',s]);}});return {g,calls};}
test('two independently shaped original full-size Norse practice carvings, not color swaps',()=>{
 assert.equal(PRACTICE_CARVINGS.effigy.length,27);assert.equal(PRACTICE_CARVINGS.urn.length,25);
 assert.notDeepEqual(PRACTICE_CARVINGS.effigy,PRACTICE_CARVINGS.urn);
 for(const kind of ['effigy','urn']){const rows=PRACTICE_CARVINGS[kind];assert.ok(rows.every(s=>s.length===29 && /^[.oibwrh]+$/.test(s)));assert.ok(rows.join('').replace(/\./g,'').length>210);}
 assert.deepEqual(Object.keys(PRACTICE_MATERIALS).sort(),['b','c','h','i','o','r','w']);
 for(const code of Object.keys(PRACTICE_MATERIALS))assert.match(PRACTICE_MATERIALS[code],/^#[0-9a-f]{6}$/);
});
test('only actual target HP selects intact, wounded or critical material cracks',()=>{
 assert.equal(practiceCarvingPhase(6,6),0);assert.equal(practiceCarvingPhase(5,6),1);
 assert.equal(practiceCarvingPhase(3,6),2);assert.equal(practiceCarvingPhase(2,4),2);
 for(const invalid of [[-1,6],[7,6],[0,0],[NaN,6],[3,Infinity]])assert.throws(()=>practiceCarvingPhase(...invalid),RangeError);
 for(const kind of ['effigy','urn']){const rows=[practiceCarvingRows(kind,6,6),practiceCarvingRows(kind,5,6),practiceCarvingRows(kind,2,6)];
  assert.equal(new Set(rows.map(r=>r.join('|'))).size,3,kind+' must have honest 3-state art');
  for(let phase=1;phase<=2;phase++){const sample=rows[phase];assert.ok(sample.some(r=>r.includes('c')));assert.ok(sample.every((r,i)=>r.length===rows[0][i].length));}
 }
});
test('six visibly different production states are deterministic with a bounded world-space footprint',()=>{
 const art=new Set();
 for(const kind of ['effigy','urn'])for(const hp of [6,5,2]){
  const obj=T(kind,hp,6),a=mock(),b=mock();
  assert.equal(paintTruePracticeCarving(a.g,obj),true);
  assert.equal(paintTruePracticeCarving(b.g,obj),true);
  assert.deepEqual(a.calls,b.calls,'no artificial wall clock');
  assert.deepEqual(a.calls[0],['save']);assert.deepEqual(a.calls[1],['translate',220,119]);
  assert.deepEqual(a.calls.at(-1),['restore']);
  const cells=a.calls.filter(c=>c[0]==='rect');
  assert.ok(cells.length>30&&cells.length<400);
  assert.ok(cells.every(([_,x,y,w,h])=>x>=-14&&x+w<=15&&y>=-17&&y+h<=12&&w>0&&h===1));
  art.add(JSON.stringify(a.calls));
 }
 assert.equal(art.size,6);
});
test('flash is tied to existing target.flash and affects only authentic material ink',()=>{
 const base=mock(),hit=mock();paintTruePracticeCarving(base.g,T(),0);paintTruePracticeCarving(hit.g,{...T(),flash:.2});
 assert.notDeepEqual(base.calls,hit.calls);
 assert.ok(hit.calls.some(c=>c[0]==='color'&&c[1]==='#fff6cb'));
});
test('dead real target paints nothing; malformed target art cannot forge graphics',()=>{
 const dead=mock();assert.equal(paintTruePracticeCarving(dead.g,{...T(),alive:false}),false);assert.deepEqual(dead.calls,[]);
 for(const fault of [{x:NaN},{y:Infinity},{flash:NaN},{hp:-1}])assert.throws(()=>paintTruePracticeCarving(mock().g,{...T(),...fault}),RangeError);
});
test('shipping renderer calls production painter, retains actual target identity and prior 2/3 damage combat',()=>{
 const g=mock();drawPracticeTargets(g.g,[T('effigy'),{...T('urn',4,4),x:260}],10);
 assert.equal(g.calls.filter(c=>c[0]==='save').length,2);
 const src=read('../src/combat/combatArt.ts'),compiled=read('../dist/js/combat/combatArt.js'),root=read('../js/combat/combatArt.js');
 for(const file of [src,compiled,root])assert.match(file,/paintTruePracticeCarving\s*\(\s*g\s*,\s*d\s*\)/);
 assert.equal(SOULBOLT_STATS.damage,2);assert.equal(MAX_BOLTS,48);
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
});
test('v0.09 Gate A, honest updated shell cache, separate rails and unchanged schema1',()=>{
 const v=read('../dist/js/core/version.js');
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);assert.match(v,/APP_VERSION = '0\.09\.48'/);assert.match(v,/SAVE_SCHEMA_VERSION = 1/);
 const shell=read('../dist/sw.js');assert.equal(shell,read('../sw.js'));assert.equal(shell,read('../public/sw.js'));
 assert.match(shell,/runegrave-shell-v0\.09\.48/);assert.ok(shell.includes('./js/combat/sagaPracticeCarvings.js'));
 assert.ok(shell.includes('ACTIVATE_UPDATE')&&shell.includes('cache.addAll(ASSETS.map('));
 const html=read('../dist/index.html');assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
