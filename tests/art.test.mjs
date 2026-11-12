import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { ART_PALETTE, paintSanctuary, drawWayfarer } from '../dist/js/scene/sanctuaryArt.js';
import { stageMetrics } from '../dist/js/scene/stage.js';

const dist=(name)=>new URL(`../dist/${name}`, import.meta.url);

test('v0.07 Midgard artwork is a separate modular renderer with defined original materials',()=>{
  assert.equal(typeof paintSanctuary,'function');
  assert.equal(typeof drawWayfarer,'function');
  assert.ok(Object.isFrozen(ART_PALETTE));
  assert.equal(Object.keys(ART_PALETTE).length,8);
  for(const value of Object.values(ART_PALETTE))assert.match(value,/^#[0-9a-f]{6}$/i);
  assert.ok(existsSync(dist('js/scene/sanctuaryArt.js')));
});

test('camera uses only measured center canvas, preserving correct world aspect at several iPhone sizes',()=>{
  for(const [width,height] of [[401,268],[496,310],[580,330],[690,290]]){
    const m=stageMetrics(width,height,2);
    assert.equal(m.cameraWidth,420);
    assert.ok(Math.abs((m.cameraWidth/m.cameraHeight)-(width/height))<1e-10);
    assert.equal(m.pixelWidth,width*2);
    assert.equal(m.pixelHeight,height*2);
  }
});

test('v0.07 training stage and PWA retain independent scene and controller modules',()=>{
  const stage=readFileSync(dist('js/scene/stage.js'),'utf8');
  assert.match(stage,/paintSanctuary/);
  assert.match(stage,/drawWayfarer/);
  assert.match(stage,/stageMetrics/);assert.match(stage,/moveCircle/);
  const sw=readFileSync(dist('sw.js'),'utf8');
  assert.match(sw,/runegrave-shell-v0\.09\.45/);
  assert.match(sw,/js\/scene\/sanctuaryArt\.js/);
  assert.ok(!sw.split("self.addEventListener('install'")[1].split("self.addEventListener('activate'")[0].includes('skipWaiting'));
  const html=readFileSync(dist('index.html'),'utf8');
  assert.match(html,/THE FIRST SOUL/);
  assert.match(html,/id="gameplay-canvas"/);
});
