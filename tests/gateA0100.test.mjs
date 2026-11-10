import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRST_SOUL_ROOMS,FIRST_SOUL_RELICS} from '../dist/js/run/firstSoul.js';
import {roomRelief,paintRoomReliefs} from '../dist/js/scene/roomReliefs.js';
import {paintRoomFamily} from '../dist/js/scene/familyArt.js';
import {threatStatus} from '../dist/js/scene/threatReadout.js';

function painter(){
 const calls=[];const p={canvas:{width:840,height:450},getTransform:()=>({a:2,d:2})};
 for(const name of ['save','restore','fillRect','strokeRect','fill','stroke','beginPath','moveTo','lineTo','closePath','ellipse','arc','translate','rotate','scale','fillText'])p[name]=(...a)=>calls.push([name,...a]);
 p.createRadialGradient=()=>({addColorStop:()=>{}});
 return {g:new Proxy(p,{set(t,k,v){t[k]=v;calls.push(['set',k,v]);return true}}),calls};
}
const mk=(kind='charger',state='idle',windup=0,hp=7)=>({id:kind,kind,x:140,y:130,radius:10,alive:true,state,windup,hp,maxHp:7,phase:1});
const snap=(enemies,phase='locked',wave=1)=>({room:'crypt',phase,wave,kills:0,bossDefeated:false,bossPhase:0,enemies,projectiles:[],shots:0});

test('25 authored room relief identities are canonical and graphically distinguishable',()=>{
 assert.equal(FIRST_SOUL_ROOMS.length,25);
 const spec=FIRST_SOUL_ROOMS.map(room=>roomRelief(room));
 assert.equal(new Set(spec.map(x=>`${x.family}:${x.cutCount}:${x.offset}`)).size,25);
 for(const room of FIRST_SOUL_ROOMS){
  const {g,calls}=painter();paintRoomReliefs(g,420,220,room);
  assert.ok(calls.length>20&&calls.length<80,`${room.id}: ${calls.length}`);
  assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length);
  const full=painter();paintRoomFamily(full.g,420,220,0,room);
  assert.ok(full.calls.length<550,`${room.id} exceeds mobile art budget`);
 }
 assert.throws(()=>roomRelief({id:'bad',family:'FATE'}));
 assert.throws(()=>roomRelief({id:'fs-25',family:'ASH'}));
});

test('real enemy windups surface urgent threat and do not falsely claim every enemy is dangerous',()=>{
 const calm=threatStatus('practice');assert.equal(calm.tone,'calm');
 const active=threatStatus('crypt',snap([mk()]));assert.match(active.detail,/1 ENEMY/);
 const attack=threatStatus('crypt',snap([mk('charger','warning',.22),mk('archer','warning',.48)]));
 assert.equal(attack.tone,'urgent');assert.match(attack.label,/CHARGER/);assert.match(attack.detail,/0\.2s/);
 assert.ok(attack.fraction>=0&&attack.fraction<=1);
 assert.equal(threatStatus('crypt',snap([mk()], 'gate')).tone,'cleared');
 assert.equal(threatStatus('complete').tone,'cleared');
});

test('warden side-grip status tracks real boss HP and phase without a game-field overlay',()=>{
 const e={...mk('warden','idle',0,14),maxHp:28,phase:2};
 const s=threatStatus('warden',snap([e]));
 assert.equal(s.fraction,.5);assert.match(s.label,/PHASE 2/);assert.match(s.detail,/14\/28/);
 const imminent=threatStatus('warden',snap([{...e,state:'warning',windup:.2}]));
 assert.equal(imminent.tone,'urgent');assert.match(imminent.label,/DODGE/);
 const dead=threatStatus('warden',snap([],'gate'));assert.equal(dead.tone,'cleared');
});

test('new status exists only inside left controller grip, and no new controls overlay central canvas',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const grip=html.split('class="grip grip-left"')[1].split('</aside>')[0];
 assert.match(grip,/class="threat-strip"/);assert.match(grip,/data-threat-label/);assert.match(grip,/data-threat-gauge/);
 const center=html.split('class="central-screen"')[1].split('id="world-frame"')[0];
 assert.doesNotMatch(center,/threat-strip/);
 const style=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
 assert.match(style,/\.threat-strip\{position:absolute/);
 assert.match(style,/pointer-events:none/);
});

test('v0.09.10 retains all eight functional relics and cached modules, with later gates unapproved',()=>{
 assert.equal(FIRST_SOUL_RELICS.length,8);
 const ver=readFileSync(new URL('../dist/js/core/version.js',import.meta.url),'utf8');
 assert.match(ver,/ROADMAP_VERSION = 'v0\.09'/);assert.match(ver,/APP_VERSION = '0\.09\.10'/);
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 for(const asset of ['js/scene/roomReliefs.js','js/scene/threatReadout.js','js/run/firstSoul.js','js/enemies/encounters.js','js/input/twinStick.js'])assert.ok(sw.includes(asset));
 assert.doesNotMatch(sw.split("self.addEventListener('install'")[1].split("self.addEventListener('activate'")[0],/skipWaiting\(/);
});
