import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import { makeRootvaultWorld, safeSpawn, isPositionFree, HERO_RADIUS } from '../dist/js/physics/world.js';
import { placeDirectedExit, walkableRoute, HostileEncounter } from '../dist/js/enemies/encounters.js';
import { directionForChamber, EXIT_LABELS, EXIT_DIRECTIONS } from '../dist/js/run/wayfinding.js';
import { objectiveText } from '../dist/js/platform/firstRunGuide.js';
const heights=[205,215,240,275,312,350];
test('Eight curated chambers use all four compass directions instead of repetitive right-only exits',()=>{
 const directions=Array.from({length:8},(_,index)=>directionForChamber(index));
 assert.equal(directions.length,8);
 assert.deepEqual(new Set(directions),new Set(EXIT_DIRECTIONS));
 assert.ok(directions.slice(1).some((direction,index)=>direction!==directions[index]));
 assert.throws(()=>directionForChamber(8));
});
test('Each signed compass exit is reachable and stays within every supported room height',()=>{
 for(const height of heights){
   const world=makeRootvaultWorld(420,height);
   const actor=safeSpawn(world,{x:110,y:world.minY+24});
   const exits={};
   for(const direction of EXIT_DIRECTIONS){
     const door=placeDirectedExit(world,actor,direction);
     const path=walkableRoute(world,actor,door);
     assert.ok(isPositionFree(world,door,HERO_RADIUS),`${height} ${direction} door overlaps wall`);
     assert.ok(path.length>1,`${height} ${direction} has no path`);
     assert.ok(Math.hypot(door.x-actor.x,door.y-actor.y)>65,`${height} ${direction} too close to spawn`);
     const e=new HostileEncounter(world,'crypt',actor,undefined,direction);
     assert.equal(e.exitDirection,direction);
     assert.deepEqual(e.exit,door);
     e.reframe(world);
     assert.equal(e.exitDirection,direction);
     exits[direction]=door;
   }
   assert.ok(exits.north.y<exits.south.y,`north/south doors reversed at ${height}`);
   assert.ok(exits.west.x<exits.east.x,`west/east doors reversed at ${height}`);
 }
});
test('Player always sees readable directional objectives, sealed/open labels and earned relic meaning',()=>{
 for(const direction of EXIT_DIRECTIONS){
   const message=objectiveText({mode:'crypt',phase:'gate',alive:0,missingRelic:false,roomNumber:2,roomTotal:8,exitDirection:direction});
   assert.match(message,new RegExp(EXIT_LABELS[direction].label+' DOOR'));
 }
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const stage=readFileSync(new URL('../dist/js/scene/stage.js',import.meta.url),'utf8');
 const art=readFileSync(new URL('../dist/js/scene/doorArt.js',import.meta.url),'utf8');
 const cache=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 for(const fragment of ['id="relic-reveal-overlay"','id="relic-reveal-effect"','data-relic-effect','data-pickup-info','data-door-hint'])assert.ok(html.includes(fragment),fragment);
 for(const label of ['LOCKED','EXIT','DOOR'])assert.ok(art.includes(label));
 assert.ok(stage.includes('runegrave:relic-acquired'));
 for(const runtime of ['js/run/wayfinding.js','js/scene/doorArt.js','js/platform/relicDiscovery.js'])assert.ok(cache.includes(runtime),runtime);
});
