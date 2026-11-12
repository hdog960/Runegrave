import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {THRESHOLD_FAMILIES,THRESHOLD_CRESTS,THRESHOLD_EPISODES,THRESHOLD_STONES,
 THRESHOLD_PANEL_WIDTH,THRESHOLD_PANEL_HEIGHT,thresholdIdentity,thresholdPanels,paintThresholdReliefs
} from '../dist/js/scene/sagaThresholdReliefs.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function painter(){
 const calls=[],g={save(){calls.push(['save']);},restore(){calls.push(['restore']);},
  fillRect(...v){calls.push(['rect',...v]);}};
 for(const name of ['fillStyle','globalAlpha'])Object.defineProperty(g,name,{set(v){calls.push([name,v]);}});
 return {g,calls};
}
function rendered(family,serial,W=420,H=240){
 const {g,calls}=painter();paintThresholdReliefs(g,W,H,family,serial);return calls;
}
test('five original Norse lower-wall family crests and five chapter tales are genuinely authored pixel art',()=>{
 assert.deepEqual(THRESHOLD_FAMILIES,['ASH','IRON','ROOT','SPIRIT','FATE']);
 assert.deepEqual(Object.keys(THRESHOLD_CRESTS),THRESHOLD_FAMILIES);
 assert.deepEqual(Object.keys(THRESHOLD_STONES),THRESHOLD_FAMILIES);
 assert.equal(THRESHOLD_EPISODES.length,5);
 const crests=new Set(),stories=new Set();
 for(const family of THRESHOLD_FAMILIES){
  const rows=THRESHOLD_CRESTS[family];
  assert.equal(rows.length,11,family);
  assert.ok(rows.every(s=>s.length===11&&/^[.#+]+$/.test(s)),family+' malformed crest');
  assert.ok(rows.join('').replace(/\./g,'').length>=35,family+' sparse unidentifiable glyph');
  for(const tone of Object.values(THRESHOLD_STONES[family]))assert.match(tone,/^#[\da-f]{6}$/i);
  crests.add(rows.join('|'));
 }
 for(const rows of THRESHOLD_EPISODES){
  assert.equal(rows.length,7);
  assert.ok(rows.every(s=>s.length===7&&/^[.#+]+$/.test(s)));
  stories.add(rows.join('|'));
 }
 assert.equal(crests.size,5);assert.equal(stories.size,5);
});
test('25 authentic canonical room serials select the correct family and unique episode, NEVER shuffled visit index',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 const signatures=new Set();
 for(const [i,room] of FIRST_SOUL_ROOMS.entries()){
  const serial=Number(room.id.slice(-2))-1;
  const id=thresholdIdentity(room.family,serial);
  assert.equal(serial,i);
  assert.equal(id.family,room.family);
  assert.equal(id.episode,i%5);
  signatures.add(THRESHOLD_CRESTS[id.family].join('')+'|'+THRESHOLD_EPISODES[id.episode].join(''));
 }
 assert.equal(signatures.size,25);
 for(const wrong of [['ASH',5],['ROOT',2],['FATE',19],['IRON',25],['ASH',-1],['SPIRIT',1.5],['ASH',NaN],['UNKNOWN',0]])
  assert.throws(()=>thresholdIdentity(...wrong),RangeError);
});
test('paired 40x78 physical tablets occupy ONLY extreme world corners and never either exterior handgrip',()=>{
 assert.equal(THRESHOLD_PANEL_WIDTH,40);assert.equal(THRESHOLD_PANEL_HEIGHT,78);
 for(const [W,H] of [[420,240],[420,168],[240,160],[540,500],[280,340]]){
  const p=thresholdPanels(W,H);
  assert.deepEqual(p.map(v=>v.side),['family','episode']);
  assert.equal(p[0].x,6);assert.equal(p[1].x,Math.floor(W)-46);
  for(const v of p){
   assert.ok(v.x>=6&&v.x+40<=W-6);
   assert.ok(v.y>=0&&v.y+78<=H-8);
   assert.ok(v.x+40<=Math.floor(W/2)-40||v.x>=Math.floor(W/2)+40,
    'central actor / warning lane must remain unobstructed');
  }
 }
 for(const [W,H] of [[200,240],[420,140],[NaN,240],[420,Infinity]])
  assert.throws(()=>thresholdPanels(W,H),RangeError);
});
test('all 25 real room paintings produce distinct deterministic production Canvas glyph commands',()=>{
 const seen=new Set();
 for(const room of FIRST_SOUL_ROOMS){
  const serial=Number(room.id.slice(-2))-1;
  const a=rendered(room.family,serial),b=rendered(room.family,serial);
  assert.deepEqual(a,b,'no fake independently animated scenery');
  assert.ok(a.length>100&&a.length<600,'bounded affordable mobile stencil draw count');
  assert.deepEqual(a[0],['save']);
  assert.deepEqual(a.at(-1),['restore']);
  assert.ok(a.some(c=>c[0]==='globalAlpha'&&c[1]===.72));
  assert.ok(!a.some(c=>c[0]==='arc'||c[0]==='fillText'));
  const rects=a.filter(v=>v[0]==='rect');
  assert.ok(rects.every(v=>v[1]>=6&&v[2]>=0&&v[1]+v[3]<=414&&v[2]+v[4]<=232));
  seen.add(JSON.stringify(a));
 }
 assert.equal(seen.size,25);
});
test('masonry paints only under real combat, never as foreground HUD, danger, or pickup',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const src=read('../dist/js/scene/stage.js');
 const mural=src.indexOf('paintThresholdReliefs('),enemy=src.indexOf('drawEncounter('),
       loot=src.indexOf('drawRoomDrops('),death=src.indexOf('motionTrails.paintDissolves(');
 assert.ok(mural>0&&enemy>mural&&loot>enemy&&death>mural);
 assert.equal(src.split('paintThresholdReliefs(').length-1,1);
 assert.ok(src.includes("mode === 'crypt'"),'not a practice room overlay');
 assert.ok(!read('../dist/js/scene/sagaThresholdReliefs.js').includes('requestAnimationFrame'));
});
test('root Pages production mirror exposes the REAL carvings and matches current consented service-worker cache',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const sw=read('../dist/sw.js');
 assert.equal(sw,read('../sw.js'));
 assert.match(sw,/runegrave-shell-v0\.09\.47/);
 assert.ok(sw.includes('./js/scene/sagaThresholdReliefs.js'));
 assert.ok(read('../js/scene/stage.js').includes('paintThresholdReliefs('));
 assert.ok(read('../js/scene/sagaThresholdReliefs.js').includes('THRESHOLD_CRESTS'));
});
test('small-room skipped decoration remains safe and does not change the canonical authored room contract',()=>{
 for(let i=0;i<25;i++){
  const family=THRESHOLD_FAMILIES[Math.floor(i/5)];
  const g=painter();
  paintThresholdReliefs(g.g,420,150,family,i);
  assert.deepEqual(g.calls,[],'do not cram lower-wall tablets into too-small world');
 }
 assert.throws(()=>paintThresholdReliefs(painter().g,420,240,'ROOT',3),RangeError);
});
test('Gate A original 25 rooms/eight functional relics/save schema1/two-thumb grips remain strictly locked in v0.09',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const version=read('../dist/js/core/version.js');
 assert.match(version,/APP_VERSION = '0\.09\.47'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
 assert.ok(read('../dist/js/input/twinStick.js').includes('localStorage'));
});
