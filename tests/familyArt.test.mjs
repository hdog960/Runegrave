import test from 'node:test';
import assert from 'node:assert/strict';
import {ROOM_MATERIALS,themeOfRoom,paintRoomFamily} from '../dist/js/scene/familyArt.js';
import {FIRST_SOUL_ROOMS} from '../dist/js/run/firstSoul.js';

test('all 25 existing authored room configs have one of five visually distinguishable family materials',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 assert.equal(Object.keys(ROOM_MATERIALS).length,5);
 for(const room of FIRST_SOUL_ROOMS){
  const t=themeOfRoom(room);assert.match(t.floor,/^#[\da-f]{6}$/i);
  assert.match(t.light,/^#[\da-f]{6}$/i);
 }
 assert.equal(new Set(FIRST_SOUL_ROOMS.map(r=>themeOfRoom(r).floor)).size,5);
 assert.throws(()=>themeOfRoom({family:'INVALID'}));
});

test('world-space family artwork draws while restoring canvas state for gameplay hitboxes',()=>{
 const log=[];
 const canvas=new Proxy({}, {get:(_,p)=>p==='createRadialGradient'?()=>({addColorStop:(...s)=>log.push(s)}):p==='save'||p==='restore'||p==='fill'||p==='fillRect'||p==='beginPath'||p==='moveTo'||p==='lineTo'||p==='stroke'||p==='ellipse'||p==='translate'? (...args)=>log.push([p,...args]):undefined,set:(_,key,value)=>{log.push([key,value]);return true;}});
 for(const room of [FIRST_SOUL_ROOMS[0],FIRST_SOUL_ROOMS[5],FIRST_SOUL_ROOMS[10],FIRST_SOUL_ROOMS[15],FIRST_SOUL_ROOMS[20]]){
  log.length=0;paintRoomFamily(canvas,420,225,1.5,room);
  assert.ok(log.some(e=>e[0]==='fillRect'),room.family);
  assert.equal(log.filter(e=>e[0]==='save').length,log.filter(e=>e[0]==='restore').length,room.family);
  assert.ok(log.length<550,'art must remain cheap for mobile');
 }
});
