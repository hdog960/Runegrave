import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { objectiveText, GUIDE_SEEN_KEY } from '../dist/js/platform/firstRunGuide.js';
const context=(overrides={})=>({mode:'practice',phase:'gate',alive:0,missingRelic:false,roomNumber:0,roomTotal:8,...overrides});
test('first-time guide is namespaced without overriding saved control preferences',()=>{
 assert.equal(GUIDE_SEEN_KEY,'runegrave:guided-start:v1');
 assert.notEqual(GUIDE_SEEN_KEY,'runegrave:input:v1');
});
test('the starting objective gives a clear action and compass direction',()=>{
 assert.match(objectiveText(context()),/GREEN EAST DOOR TO START/);
});
test('combat objective explains enemy count rather than opaque wave state',()=>{
 assert.match(objectiveText(context({mode:'crypt',phase:'locked',alive:3,roomNumber:1})),/ROOM 1\/8.* DEFEAT 3 ENEMIES/);
 assert.match(objectiveText(context({mode:'crypt',phase:'locked',alive:1,roomNumber:4})),/DEFEAT 1 ENEMY/);
});
test('post-combat objective requires collecting the actual golden relic',()=>{
 assert.match(objectiveText(context({mode:'crypt',phase:'gate',missingRelic:true})),/PICK UP THE GOLD RELIC/);
 assert.match(objectiveText(context({mode:'crypt',phase:'gate',missingRelic:false})),/EAST DOOR.*CONTINUE/);
});
test('boss objective, finish gate and clear state each explain the next action',()=>{
 assert.match(objectiveText(context({mode:'warden',phase:'locked',alive:1})),/BOSS.* DODGE.*FIRE/);
 assert.match(objectiveText(context({mode:'warden',phase:'gate'})),/BOSS DEFEATED.*EXIT/);
 assert.match(objectiveText(context({mode:'complete'})),/TRIAL CLEARED.* RESTART/);
});
test('the tutorial is a pre-combat paused screen and is replayable from pause',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const module=readFileSync(new URL('../dist/js/platform/firstRunGuide.js',import.meta.url),'utf8');
 const sw=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 assert.match(html,/id="guide-overlay".*role="dialog"/);
 for(const id of ['guide-start-btn','guide-replay-btn','pause-overlay'])assert.ok(html.includes(`id="${id}"`),id);
 for(const phrase of ['MOVE','SHOOT','ADVANCE','GOLD relic','EXIT doorway'])assert.ok(html.includes(phrase),phrase);
 assert.match(module,/controls\.setPaused\(true\)/);
 assert.match(module,/controls\.setPaused\(false\)/);
 assert.ok(sw.includes('./js/platform/firstRunGuide.js'));
 assert.ok(sw.includes('runegrave-shell-v0.09.8'));
});
