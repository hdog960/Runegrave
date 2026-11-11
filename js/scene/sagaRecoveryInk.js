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
/** Gate A v0.09.32: broad BODY contour recovery, not cosmetic twinkles.
 * Eleven consecutive original sprite rows per actual recovering enemy are
 * deliberately sculpted into a strong hunched > braced > upright silhouette.
 * A physical two-pixel rising stride is coordinated with its real countdown.
 * These insets are engraved directly into the existing one-body pixel atlas.
 */
export const HOSTILE_RECOVERY_SILHOUETTES=Object.freeze({"charger":{"at":5,"frames":[[1,2,3,3,4,4,3,3,2,1,1],[0,1,2,3,3,3,2,2,1,1,0],[0,0,1,1,2,2,1,1,0,0,0]]},"shade":{"at":4,"frames":[[1,2,2,3,3,4,3,3,2,1,1],[0,1,2,2,3,3,2,2,1,1,0],[0,0,0,1,2,2,1,1,0,0,0]]},"warden":{"at":6,"frames":[[2,2,3,4,4,5,5,4,4,3,3],[1,1,2,3,3,4,4,3,2,2,1],[0,0,1,1,2,2,2,1,1,0,0]]}});
export function recoveryGroundShift(e){
 const frame=enemyRecoveryFrame(e);
 return frame<0?0:frame===0?4:frame===1?2:0;
}
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
 if(width<9||school.at+2>=base.length||HOSTILE_RECOVERY_SILHOUETTES[kind].at+11>base.length)throw new RangeError('Broken recovery body sheet');
 const out=[...base];
 for(let i=0;i<3;i++){
  const [left,right]=pattern[i].split('|');
  const old=(base[school.at+i]??'').replace(/ /g,'.').padEnd(width,'.');
  out[school.at+i]=left+old.slice(4,width-4)+right;
 }
 // Unlike the older 3-row twitch, eleven AUTHORED torso/limb
 // contour rows now visibly hunch and recover at the original 2px pixel scale.
 const contour=HOSTILE_RECOVERY_SILHOUETTES[kind];
 for(let i=0;i<11;i++){
  const source=(out[contour.at+i]??'').replace(/ /g,'.').padEnd(width,'.');
  const inset=contour.frames[frame][i];
  out[contour.at+i]=source.split('').map((ch,j)=>j<inset||j>=width-inset?'.':ch).join('');
 }
 return out;
}
