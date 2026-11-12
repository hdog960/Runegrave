import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SAGA_PLINTH_SHEETS,SAGA_PLINTH_PALETTES,PICKUP_RADIUS,PICKUP_APPROACH_RADIUS,plinthInkRows,pickupBand,paintSagaPlinth,paintPickupBoundary} from '../dist/js/run/sagaPlinthArt.js';
import {FIRST_SOUL_RELICS,FIRST_SOUL_ROOMS} from '../dist/js/run/firstSoul.js';
import {drawRoomDrops,nearDrop,RELIC_PEDESTAL_BONUS} from '../dist/js/run/lootArt.js';
const hero={x:90,y:100};
const kinds=[...FIRST_SOUL_RELICS.map(r=>r.id),'silver','heart'];
function mock(){
 const calls=[],g={};
 for(const n of ['save','restore','translate','fillRect','beginPath','ellipse','arc','fill','stroke','strokeRect','moveTo','lineTo','closePath','fillText'])
  g[n]=(...a)=>calls.push([n,...a]);
 g.createRadialGradient=(...a)=>{calls.push(['gradient',...a]);return {addColorStop:(...args)=>calls.push(['stop',...args])};};
 for(const n of ['fillStyle','strokeStyle','font','textAlign','globalAlpha','lineWidth','lineCap','lineJoin'])
  Object.defineProperty(g,n,{set:value=>calls.push([n,n==='fillStyle'&&typeof value==='object'?'[canvas-gradient]':value])});
 return {g,calls};
}
test('all 8 genuinely playable relics and 2 resource types have 10 unique hand-carved MATERIAL silhouettes',()=>{
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.deepEqual(Object.keys(SAGA_PLINTH_SHEETS).sort(),[...kinds].sort());
 assert.deepEqual(Object.keys(SAGA_PLINTH_PALETTES).sort(),[...kinds].sort());
 let signatures=new Set(),total=0;
 for(const id of kinds){
  const rows=plinthInkRows(id),palette=SAGA_PLINTH_PALETTES[id];
  assert.equal(rows.length,10);
  assert.ok(rows[0].length>=12&&rows[0].length<=17,id);
  assert.ok(rows.every(r=>r.length===rows[0].length));
  const glyphs=rows.join('');
  assert.ok([...glyphs].filter(c=>c!=='.').length>=75,id+' needs original body material');
  for(const c of new Set(glyphs))if(c!=='.')assert.equal(typeof palette[c],'string');
  signatures.add(rows.join('|'));total+=rows.length;
 }
 assert.equal(total,100);
 assert.equal(signatures.size,10,'ten different physical shapes, not recolors or one box');
 assert.throws(()=>plinthInkRows('not-a-real-relic'),RangeError);
});
test('exact real pickup zone stays strictly under 17 units; approaching has no fabricated collect collision',()=>{
 assert.equal(PICKUP_RADIUS,17);assert.equal(PICKUP_APPROACH_RADIUS,31);
 const d={id:'test',kind:'relic',x:90,y:100,amount:1,collected:false,relic:FIRST_SOUL_RELICS[0]};
 for(const [delta,band,collect] of [[0,'ready',true],[16.999,'ready',true],[17,'approach',false],[24,'approach',false],[30.999,'approach',false],[31,'far',false]]){
  const pos={x:d.x+delta,y:d.y};
  assert.equal(pickupBand(pos,d),band);
  assert.equal(nearDrop(pos,d),collect,'old real nearDrop strict <17 constraint must never change');
 }
 assert.equal(pickupBand(undefined,d),'far');
 assert.equal(nearDrop(hero,{...d,collected:true}),false);
});
test('exact 17-unit rune notches render ONLY on a real nearby pickup, never a fake UI overlay',()=>{
 for(const id of kinds){
  const a=mock(),b=mock(),c=mock();
  paintPickupBoundary(a.g,id,'far');paintPickupBoundary(b.g,id,'approach');paintPickupBoundary(c.g,id,'ready');
  assert.equal(a.calls.length,0);
  const rect=b.calls.filter(c=>c[0]==='fillRect');
  assert.equal(rect.length,8);
  assert.ok(rect.some(([,x,y])=>x>=16&&Math.abs(y)<=5));
  assert.ok(rect.some(([,x,y])=>x<=-18&&Math.abs(y)<=5));
  assert.notDeepEqual(b.calls,c.calls,'near vs truly collectible is visually truthful');
 }
});
test('10 physical plinths fit original small room canvas and render deterministically without phantom animation',()=>{
 const seen=new Set();
 for(const id of kinds){
  const a=mock(),b=mock();paintSagaPlinth(a.g,id);paintSagaPlinth(b.g,id);
  assert.deepEqual(a.calls,b.calls);
  const r=a.calls.filter(x=>x[0]==='fillRect');
  assert.ok(r.length>=75&&r.length<=180,id+' bounded mobile draw budget');
  for(const [,x,y,w,h] of r){assert.ok(x>=-17&&x+w<=18&&y>=-13&&y+h<=7,id+' visible carved piece must stay on its floor slab');}
  seen.add(JSON.stringify(r.map(x=>x.slice(1))));
 }
 assert.equal(seen.size,10);
});
test('production drop painter attaches every authentic relic crest and true floor approach to SAME existing world drop',()=>{
 const art=[];
 for(const relic of FIRST_SOUL_RELICS){
  const drop={id:relic.id,kind:'relic',x:90,y:100,relic,amount:1,collected:false};
  const a=mock(),b=mock(),far=mock(),collected=mock();
  drawRoomDrops(a.g,[drop],.2,{x:113,y:100},true);
  drawRoomDrops(b.g,[drop],49,{x:113,y:100},true);
  drawRoomDrops(far.g,[drop],.2,undefined,true);
  drawRoomDrops(collected.g,[{...drop,collected:true}],.2,{x:113,y:100},true);
  assert.deepEqual(a.calls,b.calls,'reduced-motion freezes actual glow and floating crest');
  assert.ok(a.calls.filter(x=>x[0]==='fillRect').length>80);
  assert.equal(collected.calls.length,0,'collected relic never continues to paint');
  assert.ok(a.calls.length>far.calls.length,'only nearby player receives real-world pickup radius notches');
  assert.ok(RELIC_PEDESTAL_BONUS[relic.id].length>0,'real reward description must survive');
  const plaques=a.calls.filter(x=>x[0]==='fillRect'&&(x[2]===-41||x[2]===23));
  assert.ok(plaques.some(([,x,y,w])=>x===-41&&y===-41&&w===82),'relic title must fit top tablet');
  assert.ok(plaques.some(([,x,y,w])=>x===-41&&y===23&&w===82),'relic bonus must fit bottom tablet');
  art.push(JSON.stringify(a.calls));
 }
 assert.equal(new Set(art).size,8);
});
test('both other collectible TYPES preserve same exact collection rule and distinct brick material',()=>{
 for(const kind of ['silver','heart']){
  const drop={id:kind,kind,x:90,y:100,amount:kind==='heart'?2:3,collected:false};
  const a=mock(),b=mock(),c=mock();
  drawRoomDrops(a.g,[drop],0,{x:119,y:100},true);
  drawRoomDrops(b.g,[drop],0,{x:100,y:100},true);
  drawRoomDrops(c.g,[drop],0,{x:140,y:100},true);
  assert.ok(a.calls.filter(z=>z[0]==='fillRect').length>=70);
  assert.ok(b.calls.length>c.calls.length);
  assert.equal(nearDrop({x:107,y:100},drop),false);
  assert.equal(nearDrop({x:106.99,y:100},drop),true);
 }
});
test('v0.09.45 advances only original artwork, strict offline version and outside-canvas stage wiring',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const stage=read('../dist/js/scene/stage.js'),version=read('../dist/js/core/version.js'),sw=read('../dist/sw.js');
 assert.match(stage,/drawRoomDrops\(g, drops, time, actor, reduced\.matches\)/);
 assert.match(version,/APP_VERSION = '0\.09\.45'/);
 assert.match(version,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(version,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.45/);
 assert.ok(sw.includes('./js/run/sagaPlinthArt.js'));
 assert.ok(read('../sw.js').includes('./js/run/sagaPlinthArt.js'));
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 const html=read('../dist/index.html');
 assert.ok(html.includes('grip grip-left')&&html.includes('grip grip-right'));
});
