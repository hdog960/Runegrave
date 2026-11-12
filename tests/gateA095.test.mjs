import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {paintFamilyLandmarks,LANDMARK_IDENTITIES} from '../dist/js/scene/landmarkArt.js';
import {enemyVisualMotion,clampWarningLabel,visibleWarningEnd} from '../dist/js/enemies/visualMotion.js';
import {inwardApproach,drawRuneDoor} from '../dist/js/scene/doorArt.js';
import {stickDirectionGlyph} from '../dist/js/input/vector.js';
import {FIRST_SOUL_ROOMS} from '../dist/js/run/firstSoul.js';

function mockCanvas(){
 const calls=[];
 const g={canvas:{width:840,height:420},getTransform:()=>({a:2,d:2})};
 for(const name of ['save','restore','fillRect','fill','stroke','strokeRect','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText'])
   g[name]=(...args)=>{calls.push([name,...args]);};
 return {g:new Proxy(g,{set(obj,k,v){calls.push(['set',k,v]);obj[k]=v;return true;}}),calls};
}
test('five Norse room families have distinct, bounded upper-wall monuments in real compiled art',()=>{
 assert.equal(Object.keys(LANDMARK_IDENTITIES).length,5);
 const signatures=[];
 for(const family of Object.keys(LANDMARK_IDENTITIES)){
   const room=FIRST_SOUL_ROOMS.find(r=>r.family===family);
   assert.ok(room,`missing ${family} authored room`);
   const {g,calls}=mockCanvas();
   paintFamilyLandmarks(g,420,225,.25,room);
   assert.ok(calls.length>50,`${family} lacks a substantial monument`);
   assert.ok(calls.length<360,`${family} too expensive per frame (${calls.length} ops)`);
   assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
   signatures.push(calls.filter(c=>c[0]==='set'&&c[1]==='fillStyle').map(c=>c[2]).join(','));
 }
 assert.equal(new Set(signatures).size,5,'each family must be visually distinguishable even without subtitles');
});
test('seven enemy families animate and show a stable reduced-motion state without changing physics',()=>{
 const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
 for(const kind of kinds){
   const e={kind,state:'idle',dx:1,dy:0,phase:1};
   const a=enemyVisualMotion(e,0),b=enemyVisualMotion(e,.28);
   assert.equal(a.facing,1);assert.ok(a.pulse>=0&&a.pulse<=1);
   assert.ok(b.pulse>=0&&b.pulse<=1);
   assert.deepEqual(enemyVisualMotion(e,0),a,'reduced-motion frame remains deterministic');
   assert.equal(enemyVisualMotion({...e,dx:-1},.28).facing,-1);
   assert.equal(enemyVisualMotion({...e,state:'warning'},.28).strike,true);
   assert.equal(enemyVisualMotion({...e,state:'charge'},.28).strike,true);
 }
 assert.throws(()=>enemyVisualMotion({kind:'wisp',state:'idle',dx:0,dy:1,phase:1},Number.NaN));
});
test('combat warning labels and attack vectors are clamped inside the actual center canvas',()=>{
 assert.equal(clampWarningLabel(-20,70,420),38);
 assert.equal(clampWarningLabel(450,70,420),382);
 assert.throws(()=>clampWarningLabel(0,0,420));
 for(const [x,y] of [[10,10],[419,200],[280,170],[430,250]]){
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1]]){
     const p=visibleWarningEnd(x,y,dx,dy,124,420,225);
     assert.ok(p.x>=9&&p.x<=411&&p.y>=9&&p.y<=216,JSON.stringify(p));
   }
 }
});
test('door steps lead from the correct physical edge toward the walkable center',()=>{
 assert.deepEqual(inwardApproach('north',24),{x:0,y:24});
 assert.deepEqual(inwardApproach('south',24),{x:0,y:-24});
 assert.deepEqual(inwardApproach('east',24),{x:-24,y:0});
 assert.deepEqual(inwardApproach('west',24),{x:24,y:0});
 assert.throws(()=>inwardApproach('north',-1));
 for(const direction of ['north','south','east','west'])for(const open of [true,false]){
   const {g,calls}=mockCanvas();drawRuneDoor(g,{x:400,y:140},direction,open,4);
   assert.ok(calls.some(x=>x[0]==='fillText'&&x[1]===(open?'EXIT':'LOCKED')));
   assert.equal(calls.filter(x=>x[0]==='save').length,calls.filter(x=>x[0]==='restore').length);
 }
});
test('physical stick feedback covers 8 vectors, resets on release, and is never a canvas overlay',()=>{
 assert.equal(stickDirectionGlyph({x:0,y:0}),'·');
 const arrows=['→','↘','↓','↙','←','↖','↑','↗'];
 const seen=new Set();for(let i=0;i<8;i++){const a=i*Math.PI/4;seen.add(stickDirectionGlyph({x:Math.cos(a),y:Math.sin(a)}));}
 assert.deepEqual([...seen].sort(),[...arrows].sort());
 const input=readFileSync(new URL('../dist/js/input/twinStick.js',import.meta.url),'utf8');
 assert.match(input,/directionGlyph/);assert.match(input,/stick-strength/);
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.equal((html.match(/id="gameplay-canvas"/g)||[]).length,1);
 assert.ok(!html.includes('data-direction-glyph="gameplay-canvas"'));
 const style=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.match(style,/\.rune-socket\[data-held="true"\]::after/);
});
test('v0.09.5 PWA precaches every new runtime module; canonical Gate A gates remain unchanged',()=>{
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(sw,/runegrave-shell-v0\.09\.41/);
 for(const file of ['js/scene/landmarkArt.js','js/enemies/visualMotion.js']){
   assert.ok(sw.includes(file),file);
   assert.ok(existsSync(new URL(`../dist/${file}`,import.meta.url)),file);
 }
 const v=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(v,/ROADMAP_VERSION = 'v0\.09'/);assert.match(v,/APP_VERSION = '0\.09\.41'/);
 assert.match(v,/\['v0\.09', 'v0\.39', 'v0\.79', 'v0\.99'\]/);
});
