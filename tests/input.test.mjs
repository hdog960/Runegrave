import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStick, clampVector, combineDirections } from '../dist/js/input/vector.js';
import { sanitizeSettings, SETTINGS_KEY } from '../dist/js/input/twinStick.js';

test('v0.04 stick uses radial dead-zone and normalized unit-range movement',()=>{
  assert.deepEqual(normalizeStick(1,1,50),{x:0,y:0});
  const east=normalizeStick(100,0,50);assert.deepEqual(east,{x:1,y:0});
  const north=normalizeStick(0,-30,50);assert.ok(north.y<-.4&&north.y>-.6);
  const diagonal=normalizeStick(100,100,50);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-1)<1e-9);
  assert.throws(()=>normalizeStick(0,0,0));assert.throws(()=>normalizeStick(1,1,20,1));
  assert.throws(()=>normalizeStick(Infinity,0,50));
});
test('keyboard axes normalize diagonals and prevent diagonal speed advantage',()=>{
  const diag=combineDirections(new Set(['w','d']),['w'],['s'],['a'],['d']);
  assert.ok(Math.abs(Math.hypot(diag.x,diag.y)-1)<1e-9);
  assert.deepEqual(combineDirections(new Set(['w','s']),['w'],['s'],['a'],['d']),{x:0,y:0});
  assert.deepEqual(clampVector(2,0),{x:1,y:0});
});
test('input preferences remain rail-bound and sanitize corrupt persisted values',()=>{
  assert.equal(SETTINGS_KEY,'runegrave:input:v1');
  const defaults=sanitizeSettings(null);assert.deepEqual(defaults,{leftHanded:false,padScale:100,padOffset:0,deadZone:.15});
  assert.deepEqual(sanitizeSettings({leftHanded:true,padScale:900,padOffset:999,deadZone:-1}),{leftHanded:true,padScale:110,padOffset:9,deadZone:.08});
  assert.deepEqual(sanitizeSettings({leftHanded:'true',padScale:NaN,padOffset:NaN,deadZone:Infinity}),defaults);
});
test('UI controls including paused PWA update stay off active game display',()=>{
  const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  assert.match(html,/id="move-rune-disc"/);assert.match(html,/id="aim-rune-disc"/);
  assert.match(html,/id="pause-btn"/);assert.match(html,/id="pause-overlay"[^>]+hidden/);
  assert.match(html,/id="handed-toggle"/);assert.match(html,/id="resume-btn"/);
  assert.ok(html.indexOf('id="pwa-update"')>html.indexOf('id="pause-overlay"'));
});
