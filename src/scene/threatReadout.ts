/** Fixed-step encounter snapshot -> succinct external grip status.
 * No canvas overlay and no requirement to read detailed enemy lore mid-combat.
 */
import type { EncounterSnapshot, Enemy } from '../enemies/encounters.js';
export type ThreatStatus=Readonly<{label:string;detail:string;tone:'calm'|'active'|'urgent'|'cleared';fraction:number}>;
const CLAMP=(n:number)=>Math.max(0,Math.min(1,n));
const names:Readonly<Record<Enemy['kind'],string>>={
 draugr:'DRAUGR',wisp:'WISP',archer:'ARCHER',charger:'CHARGER',sentinel:'SENTINEL',shade:'SHADE',warden:'WARDEN'
};
export function threatStatus(room:'practice'|'crypt'|'warden'|'complete',snapshot?:EncounterSnapshot):ThreatStatus {
 if(room==='complete')return {label:'TRIAL CLEARED',detail:'WYRDS UNBOUND',tone:'cleared',fraction:1};
 if(room==='practice'||!snapshot)return {label:'PRACTICE HALL',detail:'GO TO THE DOOR',tone:'calm',fraction:0};
 if(snapshot.phase==='gate')return {label:'ROOM CLEARED',detail:'CLAIM • FIND EXIT',tone:'cleared',fraction:1};
 const live=snapshot.enemies.filter(e=>e.alive);
 if(room==='warden'){
  const boss=live.find(e=>e.kind==='warden');
  if(!boss)return {label:'WARDEN FALLEN',detail:'EXIT OPEN',tone:'cleared',fraction:1};
  const critical=boss.state==='warning' && boss.windup<=.33;
  return {label:critical?'DODGE • WARDEN':`WARDEN • PHASE ${boss.phase}`,detail:`${boss.hp}/${boss.maxHp} HEARTSTONE`,tone:critical?'urgent':'active',fraction:CLAMP(boss.hp/boss.maxHp)};
 }
 const imminent=live.filter(e=>e.state==='warning').sort((a,b)=>a.windup-b.windup)[0];
 if(imminent){return {label:`DODGE • ${names[imminent.kind]}`,detail:`STRIKE IN ${Math.max(0,imminent.windup).toFixed(1)}s`,tone:'urgent',fraction:CLAMP(1-imminent.windup/.9)};}
 return {label:`WAVE ${Math.max(1,snapshot.wave)}`,detail:`${live.length} ${live.length===1?'ENEMY':'ENEMIES'} REMAIN`,tone:'active',fraction:live.length?0:1};
}
