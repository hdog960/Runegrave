import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { contentId, isContentId, assertUniqueIds } from '../dist/js/core/ids.js';
import { hashSeed, SeededRng, rngStream } from '../dist/js/core/rng.js';
import { PLANNED_REALMS } from '../dist/js/content/realmCatalog.js';
import { ROADMAP_VERSION, PLAYER_APPROVAL_GATES } from '../dist/js/core/version.js';
import { stageMetrics } from '../dist/js/scene/stage.js';
const dist = (file) => new URL(`../dist/${file}`, import.meta.url);

test('v0.07 physics milestone and four player approval gates stay explicit', () => {
  assert.equal(ROADMAP_VERSION,'v0.09');
  assert.deepEqual(PLAYER_APPROVAL_GATES, ['v0.09','v0.39','v0.79','v0.99']);
});
test('stable content IDs reject malformed and duplicated entries', () => {
  assert.equal(contentId('relic','broken-bifrost'),'relic:broken-bifrost');
  assert.throws(() => contentId('relic','Broken Bifrost'));
  assert.equal(isContentId('relic:broken-bifrost'), true);
  assert.equal(isContentId('monster:bad'), false);
  assert.equal(isContentId('realm::bad'), false);
  assert.throws(() => assertUniqueIds(['realm:midgard','realm:midgard']));
});
test('nine canonical realms remain planned-only unique IDs', () => {
  assert.equal(PLANNED_REALMS.length,9);
  assertUniqueIds(PLANNED_REALMS.map(realm=>realm.id));
  assert.equal(PLANNED_REALMS[0].id,'realm:midgard');
});
test('seeded streams reproduce and separate correctly', () => {
  assert.equal(hashSeed('ninefold'), hashSeed('ninefold'));
  const a = rngStream('run-42','rooms');const b = rngStream('run-42','rooms');const c = rngStream('run-42','combat');
  assert.deepEqual(Array.from({length:40},()=>a.nextUint32()), Array.from({length:40},()=>b.nextUint32()));
  assert.notEqual(rngStream('run-42','rooms').nextUint32(),c.nextUint32());
  assert.throws(() => rngStream('run-42',''));
});
test('unbiased bounded integer API valid and rejects bounds', () => {
  const rng = new SeededRng(0);
  for(let i=0;i<1000;i++){const n=rng.int(7);assert.ok(n>=0&&n<7);}
  assert.throws(()=>rng.int(0));assert.throws(()=>rng.int(2.5));assert.ok(rng.next()>=0 && rng.next()<1);
});
test('static Github Pages build uses relative asset paths and separate canvas', () => {
  const html=readFileSync(dist('index.html'),'utf8');
  assert.match(html,/\.\/js\/main\.js/);assert.match(html,/viewport-fit=cover/);
  assert.match(html,/id="gameplay-canvas"/);assert.match(html,/class="grip grip-left"/);assert.match(html,/class="grip grip-right"/);
  assert.match(html,/class="central-screen"/);assert.match(html,/THE FIRST SOUL/);
  assert.ok(!html.includes('style="position: absolute"'));
  assert.ok(existsSync(dist('js/scene/sanctuaryArt.js','js/physics/world.js','js/physics/fixedStep.js')));assert.ok(existsSync(dist('js/main.js')));assert.ok(existsSync(dist('art/world-tree.svg')));
});
test('PWA manifest, icons, service worker are within relative Pages project scope', () => {
  const manifest=JSON.parse(readFileSync(dist('manifest.webmanifest'),'utf8'));
  assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');assert.equal(manifest.orientation,'landscape');
  for(const size of [180,192,512]){
    const icon=readFileSync(dist(`icons/runegrave-${size}.png`));
    assert.equal(icon.readUInt32BE(16),size);assert.equal(icon.readUInt32BE(20),size);
  }
  const sw=readFileSync(dist('sw.js'),'utf8');assert.match(sw,/CACHE_NAME = 'runegrave-shell-v0\.09\.2'/);
  assert.match(sw,/ACTIVATE_UPDATE/);assert.match(sw,/registration\.scope/);
  const installBlock=sw.split("self.addEventListener('install'")[1].split("self.addEventListener('activate'")[0];
  assert.ok(!installBlock.includes('skipWaiting('),'installation must not forcibly activate over live gameplay');
});
test('world camera derives precisely from available canvas geometry',()=>{
  const rect=stageMetrics(500,260,3);
  assert.equal(rect.cameraWidth,420);assert.equal(rect.cameraHeight,218.4);
  assert.equal(rect.pixelWidth,1250);assert.equal(rect.pixelHeight,650);
  assert.throws(()=>stageMetrics(0,200));assert.throws(()=>stageMetrics(300,-1));
});
test('service worker precaches JS modules used by the v0.07 app',()=>{
  const sw=readFileSync(dist('sw.js'),'utf8');
  for (const filename of ['js/main.js','js/scene/stage.js','js/platform/pwa.js','js/core/version.js','js/core/ids.js','js/content/realmCatalog.js','js/input/vector.js','js/input/twinStick.js','js/scene/sanctuaryArt.js','js/physics/world.js','js/physics/fixedStep.js','js/combat/soulbolts.js','js/combat/combatArt.js','js/health/mortalHearts.js','js/health/emberTrial.js','js/health/healthArt.js']) {
    assert.ok(existsSync(dist(filename)),`${filename} is compiled`);
    assert.ok(sw.includes(filename),`${filename} is precached`);
  }
});
