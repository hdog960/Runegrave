import test from 'node:test';
import assert from 'node:assert/strict';
import {paintRuneThreshold,drawRuneDoor} from '../dist/js/scene/doorArt.js';
import {drawRoomDrops,RELIC_PEDESTAL_BONUS} from '../dist/js/run/lootArt.js';
import {chamberFrameVariant,paintChamberSetpieces} from '../dist/js/scene/chamberSetpieces.js';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
function mock(){const calls=[],o={canvas:{width:840,height:420},getTransform:()=>({a:2,d:2})};
 for(const k of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText'])o[k]=(...x)=>calls.push([k,...x]);
 o.createRadialGradient=()=>({addColorStop(){}});
 return {calls,g:new Proxy(o,{set(x,k,v){x[k]=v;return true}})};}
test('four directional doors show separate physical beacons and open/closed chain shapes',()=>{
 for(const d of ['north','south','east','west']){const a=mock(),b=mock();paintRuneThreshold(a.g,d,false,0);paintRuneThreshold(b.g,d,true,0);
 assert.ok(a.calls.length<120);assert.notDeepEqual(a.calls.filter(x=>x[0]==='moveTo'),b.calls.filter(x=>x[0]==='moveTo'));
 assert.equal(a.calls.filter(x=>x[0]==='save').length,a.calls.filter(x=>x[0]==='restore').length);
 const gate=mock();drawRuneDoor(gate.g,{x:210,y:115},d,true,1);assert.ok(gate.calls.some(x=>x[0]==='fillText'&&x[1]==='EXIT'));}
 assert.throws(()=>paintRuneThreshold(mock().g,'north',true,NaN),/Invalid/);
});
test('all eight functional relic pedestals show distinct, accurate earned bonuses',()=>{
 assert.equal(new Set(Object.values(RELIC_PEDESTAL_BONUS)).size,8);
 for(const relic of FIRST_SOUL_RELICS){const {g,calls}=mock();drawRoomDrops(g,[{id:'r',kind:'relic',relic,x:110,y:110,amount:1,collected:false}],0);
 assert.ok(calls.some(x=>x[0]==='fillText'&&x[1]===RELIC_PEDESTAL_BONUS[relic.id]));assert.ok(calls.length<165);}
});
test('all 25 authored rooms retain deterministic five-variant bounded stone finials',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);assert.equal(FIRST_SOUL_RELICS.length,8);
 for(let i=0;i<25;i++)assert.equal(chamberFrameVariant(i),i%5);
 assert.throws(()=>chamberFrameVariant(25),/Invalid/);
 for(const family of ['ASH','IRON','SPIRIT','FATE']){const variants=[];
 for(let v=0;v<5;v++){const {g,calls}=mock();paintChamberSetpieces(g,420,235,1,family,v);
 assert.ok(calls.length<290);variants.push(JSON.stringify(calls.filter(x=>x[0]==='lineTo').slice(-1)));}
 assert.equal(new Set(variants).size,5);}
});
test('Gate A and save schema remain locked despite new artwork',async()=>{
 const v=await import('../dist/js/core/version.js');assert.equal(v.ROADMAP_VERSION,'v0.09');assert.equal(v.SAVE_SCHEMA_VERSION,1);assert.equal(v.APP_VERSION,'0.09.41');
});
