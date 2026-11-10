/** v0.09 Gate A: demonstrate a genuinely applied modifier using live before/after state.
 * The text is shown only while the simulation is paused, never over live combat.
 */
import type { CombatProfile } from '../combat/soulbolts.js';
import type { RelicId } from './firstSoul.js';
export type ImpactSnapshot=Readonly<{profile:CombatProfile;heartContainers:number;heartUnits:number}>;
const n=(value:number)=>Number(value.toFixed(1)).toString();
export function describeRelicImpact(id:RelicId,before:ImpactSnapshot,after:ImpactSnapshot):string {
 switch(id){
  case 'wyrd-fang':return `SOULBOLT DAMAGE  ${n(before.profile.damage)} → ${n(after.profile.damage)} PER HIT`;
  case 'skald-drum':return `FIRE INTERVAL  ${n(before.profile.cooldown*1000)}ms → ${n(after.profile.cooldown*1000)}ms`;
  case 'storm-feather':return `SHOT SPEED  ${n(before.profile.speed)} → ${n(after.profile.speed)}`;
  case 'hugin-lens':return `SHOT RANGE  ${n(before.profile.range)} → ${n(after.profile.range)}`;
  case 'ash-anchor':return `KNOCKBACK FORCE  ${n(before.profile.knockback)} → ${n(after.profile.knockback)}`;
  case 'shieldroot':return `MAX HEART CAPACITY  ${before.heartContainers} → ${after.heartContainers}`;
  case 'eir-thread':return `HEALED ${n((after.heartUnits-before.heartUnits)/2)} HEART NOW · +½ PER ROOM CLEAR`;
  case 'raven-hoard':return `SILVER BONUS  0 → +3 ON EVERY FUTURE SILVER PICKUP`;
 }
}
