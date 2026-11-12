import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HOSTILE_BOLT_PIXEL_SHEETS,HOSTILE_BOLT_INK,hostileProjectileStyle,hostileProjectileFrame,paintHostileProjectiles} from '../dist/js/enemies/hostileProjectileArt.js';
import {FIRST_SOUL_RELICS,FIRST_SOUL_ROOMS} from '../dist/js/run/firstSoul.js';
function mock(){
 const calls=[],g={};
 for(const key of ['save','restore','translate','rotate','fillRect'])g[key]=(...args)=>calls.push([key,...args]);
 Object.defineProperty(g,'fillStyle',{set:value=>calls.push(['ink',value])});
 Object.defineProperty(g,'globalAlpha',{set:value=>calls.push(['alpha',value])});
 return {g,calls};
}
const makeBolt=(damage,life)=>({id:7,x:211.3,y:127.8,dx:1,dy:0,radius:3.4,speed:93,damage,life});
test('two truly different enemy missile families each have three original 1px Norse silhouettes',()=>{
 assert.deepEqual(Object.keys(HOSTILE_BOLT_PIXEL_SHEETS),['spectral-dart','warden-ember']);
 assert.deepEqual(Object.keys(HOSTILE_BOLT_INK),['spectral-dart','warden-ember']);
 const all=new Set();
 for(const [kind,width,height] of [['spectral-dart',19,9],['warden-ember',22,11]]){
  const frames=HOSTILE_BOLT_PIXEL_SHEETS[kind],palette=HOSTILE_BOLT_INK[kind];
  assert.equal(frames.length,3);
  assert.equal(Object.keys(palette).length,5);
  for(const [i,rows] of frames.entries()){
   assert.equal(rows.length,height);
   assert.equal(new Set(rows.map(s=>s.length)).size,1);
   for(const line of rows){assert.equal(line.length,width);assert.match(line,/^[.otbcr]+$/);}
   for(const ink of 'otbcr')assert.ok(rows.join('').includes(ink),kind+' missing '+ink);
   assert.ok(rows.join('').split('').filter(c=>c!=='.').length>50,'readable silhouette, not one-pixel particle');
   all.add(rows.join('|'));
  }
  assert.equal(new Set(frames.map(rows=>rows.join('|'))).size,3,'authored distinct stages');
 }
 assert.equal(all.size,6);
 assert.equal(hostileProjectileStyle(makeBolt(1,2.8)).kind,'spectral-dart');
 assert.equal(hostileProjectileStyle(makeBolt(2,2.8)).kind,'warden-ember');
 assert.notEqual(HOSTILE_BOLT_INK['spectral-dart'].c,HOSTILE_BOLT_INK['warden-ember'].c);
 assert.equal(hostileProjectileFrame(2.8),0);
 assert.equal(hostileProjectileFrame(1.5),1);
 assert.equal(hostileProjectileFrame(.4),2);
 assert.throws(()=>hostileProjectileFrame(0),RangeError);
 assert.throws(()=>hostileProjectileFrame(NaN),RangeError);
});
test('six real animated enemy shot frames render visibly distinct at their true world coordinates, with strict bounds',()=>{
 for(const damage of [1,2]){
  const printed=[];
  for(const life of [2.8,1.5,.4]){
   const a=mock(),b=mock(),shot=makeBolt(damage,life);
   paintHostileProjectiles(a.g,[shot],0);paintHostileProjectiles(b.g,[shot],123);
   assert.deepEqual(a.calls,b.calls,'real lifetime controls attack art; no fake decorative clock');
   const rects=a.calls.filter(c=>c[0]==='fillRect');
   assert.ok(rects.length>=25&&rects.length<150);
   assert.equal(a.calls.filter(c=>c[0]==='save').length,1);
   assert.equal(a.calls.filter(c=>c[0]==='restore').length,1);
   assert.deepEqual(a.calls.find(c=>c[0]==='translate'),['translate',211,128]);
   assert.deepEqual(a.calls.find(c=>c[0]==='rotate'),['rotate',0]);
   for(const [,x,y,w,h] of rects){
    assert.ok(x>=-12&&x+w<=12,'hostile art remains attached to world projectile x');
    assert.ok(y>=-6&&y+h<=6,'no huge fake area or detached projectile');
    assert.ok(w>0&&h===1,'original pixel cells are exactly one world pixel high');
   }
   printed.push(JSON.stringify(a.calls));
  }
  assert.equal(new Set(printed).size,3,'three visibly different original flight stages');
 }
});
test('no dead projectile draws art, no extra world warning and actual velocity aims the sprite',()=>{
 const gone=mock();
 paintHostileProjectiles(gone.g,[],0);
 paintHostileProjectiles(gone.g,[makeBolt(1,-.01)],9);
 assert.equal(gone.calls.length,0);
 const a=mock(),b=mock();
 paintHostileProjectiles(a.g,[{...makeBolt(1,1.4),dx:0,dy:1}],0);
 paintHostileProjectiles(b.g,[{...makeBolt(1,1.4),dx:-1,dy:0}],0);
 assert.equal(a.calls.find(c=>c[0]==='rotate')[1],Math.PI/2);
 assert.equal(b.calls.find(c=>c[0]==='rotate')[1],Math.PI);
 assert.notDeepEqual(a.calls,b.calls);
 assert.throws(()=>hostileProjectileStyle({...makeBolt(1,1),damage:0}),RangeError);
 assert.throws(()=>paintHostileProjectiles(mock().g,[],NaN),RangeError);
 const src=readFileSync(new URL('../dist/js/enemies/hostileProjectileArt.js',import.meta.url),'utf8');
 assert.doesNotMatch(src,/\.arc\(|\.lineTo\(|\.stroke\(|\.beginPath\(/,'no legacy blurry vector bolt shapes');
});
test('one original 25-chamber adventure, 8 real relics, user-approved PWA upgrades and Gate A scope are unchanged',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const versions=read('../dist/js/core/version.js'),sw=read('../dist/sw.js'),enemyArt=read('../dist/js/enemies/enemyArt.js');
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(FIRST_SOUL_RELICS.length,8);
 assert.match(versions,/APP_VERSION = '0\.09\.39'/);
 assert.match(versions,/ROADMAP_VERSION = 'v0\.09'/);
 assert.match(versions,/SAVE_SCHEMA_VERSION = 1/);
 assert.match(sw,/runegrave-shell-v0\.09\.39/);
 assert.match(enemyArt,/paintHostileProjectiles\(g,\s*state\.projectiles,\s*t\)/);
 assert.ok(sw.includes('./js/enemies/hostileProjectileArt.js'));
});
