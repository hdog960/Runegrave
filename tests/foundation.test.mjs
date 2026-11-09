import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { contentId, isContentId, assertUniqueIds } from '../dist/js/core/ids.js';
import { hashSeed, SeededRng, rngStream } from '../dist/js/core/rng.js';
import { PLANNED_REALMS } from '../dist/js/content/realmCatalog.js';
import { ROADMAP_VERSION, PLAYER_APPROVAL_GATES } from '../dist/js/core/version.js';

test('v0.01 baseline and mandatory art gates stay explicit', () => {
  assert.equal(ROADMAP_VERSION,'v0.01');
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
test('all nine canonical realms have unique planned IDs (not playable counts)', () => {
  assert.equal(PLANNED_REALMS.length,9);
  assertUniqueIds(PLANNED_REALMS.map(realm=>realm.id));
  assert.equal(PLANNED_REALMS[0].id,'realm:midgard');
});
test('seeded streams reproduce and separate correctly', () => {
  assert.equal(hashSeed('ninefold'), hashSeed('ninefold'));
  const a = rngStream('run-42','rooms');
  const b = rngStream('run-42','rooms');
  const c = rngStream('run-42','combat');
  assert.deepEqual(Array.from({length:40},()=>a.nextUint32()), Array.from({length:40},()=>b.nextUint32()));
  assert.notEqual(rngStream('run-42','rooms').nextUint32(),c.nextUint32());
  assert.throws(() => rngStream('run-42',''));
});
test('unbiased bounded integer API returns valid values and rejects invalid bounds', () => {
  const rng = new SeededRng(0);
  for(let i=0;i<1000;i++){const n=rng.int(7);assert.ok(n>=0&&n<7);}
  assert.throws(()=>rng.int(0));
  assert.throws(()=>rng.int(2.5));
  assert.ok(rng.next()>=0 && rng.next()<1);
});
test('static Pages output references relative module paths and no combat overlays', () => {
  const html = readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  assert.match(html, /\.\/js\/main\.js/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /NOT YET PLAYABLE/);
  assert.ok(existsSync(new URL('../dist/js/main.js',import.meta.url)));
  assert.ok(existsSync(new URL('../dist/art/world-tree.svg',import.meta.url)));
});
