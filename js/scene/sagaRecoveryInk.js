/** v0.09.31 — Nine physical *post-strike recovery* body silhouettes.
 * ONLY charger, shade and Rootbound Warden actually enter the simulation
 * 'recover' state. No invented recovery for draugr/wisp/archer/sentinel.
 * Three real remaining-windup phases deform the SAME enemy atlas body,
 * not a separate actor, warning or animation timer.
 */
export const HOSTILE_RECOVERY_INK=Object.freeze({
 "charger": {
  "at": 7,
  "max": 0.65,
  "frames": [
   [
    "oabb|bbao",
    ".oab|bao.",
    "..oa|ao.."
   ],
   [
    ".oab|bao.",
    "..ob|bo..",
    ".oaa|aao."
   ],
   [
    "..oa|ao..",
    "...o|o...",
    "..ob|bo.."
   ]
  ]
 },
 "shade": {
  "at": 7,
  "max": 0.32,
  "frames": [
   [
    "oacc|ccao",
    ".oac|cao.",
    "..oa|ao.."
   ],
   [
    ".occ|cco.",
    "..oc|co..",
    "...o|o..."
   ],
   [
    "..ob|bo..",
    "...o|o...",
    "..oa|ao.."
   ]
  ]
 },
 "warden": {
  "at": 10,
  "max": 0.48,
  "frames": [
   [
    "oagg|ggao",
    "ogge|eggo",
    "oabb|bbao"
   ],
   [
    ".oag|gao.",
    "..ob|bo..",
    ".oaa|aao."
   ],
   [
    "..og|go..",
    "...o|o...",
    "..oa|ao.."
   ]
  ]
 }
});
export function enemyRecoveryFrame(e){
 if(!Number.isFinite(e.windup))throw new RangeError('Nonfinite real recovery countdown');
 if(e.state!=='recover')return -1;
 if(e.kind!=='charger'&&e.kind!=='shade'&&e.kind!=='warden')return -1;
 const max=e.kind==='warden'&&e.phase===2?.28:HOSTILE_RECOVERY_INK[e.kind].max;
 const ratio=Math.max(0,Math.min(1,e.windup/max));
 return ratio>.67?0:ratio>.34?1:2;
}
export function inkedRecoveryBody(base,e){
 const frame=enemyRecoveryFrame(e);
 if(frame===-1)return base;
 const school=HOSTILE_RECOVERY_INK[e.kind],pattern=school.frames[frame];
 const width=Math.max(...base.map(r=>r.length));
 if(width<9||school.at+2>=base.length)throw new RangeError('Broken recovery body sheet');
 const out=[...base];
 for(let i=0;i<3;i++){
  const [left,right]=pattern[i].split('|');
  const old=(base[school.at+i]??'').replace(/ /g,'.').padEnd(width,'.');
  out[school.at+i]=left+old.slice(4,width-4)+right;
 }
 return out;
}
