import { paintTruePracticeCarving } from './sagaPracticeCarvings.js';
import { paintTrueSoulbolt } from './sagaSoulboltRuneInk.js';
import { paintSagaCombatImpact } from './sagaImpactCarvings.js';
/** Original, authored pixel-style combat sprites. Everything is world-space art. */
import { SOULBOLT_STATS, type Soulbolt, type TrainingTarget } from './soulbolts.js';
export type CombatSpark={x:number;y:number;life:number;maxLife:number;kind:'impact'|'break'|'wall'};
/** Real target geometry, HP, flash and lifecycle remain simulation-owned.
 * Two original practice silhouettes and physical HP scars are paint-only.
 */
export function drawPracticeTargets(g:CanvasRenderingContext2D,targets:readonly TrainingTarget[],t:number):void {
 for(const d of targets)paintTruePracticeCarving(g,d);
}
export function drawSoulbolts(g:CanvasRenderingContext2D,bolts:readonly Soulbolt[],time:number):void{
 if(!Number.isFinite(time))throw new RangeError('Invalid Soulbolt visual frame');
 for(const b of bolts){if(b.active)paintTrueSoulbolt(g,b);}
}
/** True combat simulation owns every live spark, its type and remaining life.
 * Only the nine original visual cuts change; no new event or particles.
 */
export function drawCombatSparks(g:CanvasRenderingContext2D,sparks:readonly CombatSpark[]):void{
 for(const s of sparks){
  if(s.life<=0)continue;
  paintSagaCombatImpact(g,s);
 }
}
