import { paintTruePracticeCarving } from './sagaPracticeCarvings.js';
import { paintTrueSoulbolt } from './sagaSoulboltRuneInk.js';
import { paintSagaCombatImpact } from './sagaImpactCarvings.js';
/** Pure physical visual art — no changes to damage, spawn, hitboxes or respawn. */
export function drawPracticeTargets(g, targets, t) {
 for(const d of targets)paintTruePracticeCarving(g,d);
}
export function drawSoulbolts(g,bolts,time){
 if(!Number.isFinite(time))throw new RangeError('Invalid Soulbolt visual frame');
 for(const b of bolts){if(b.active)paintTrueSoulbolt(g,b);}
}
/** Existing fixed-step spark count/position/remaining life only; art replacement. */
export function drawCombatSparks(g,sparks){
 for(const s of sparks){
  if(s.life<=0)continue;
  paintSagaCombatImpact(g,s);
 }
}
