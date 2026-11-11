/** v0.09.33 Gate A: genuinely traveled distance reshapes a SINGLE enemy body.
 * These are five bespoke 4-frame lower-body cuts for foes that actually move.
 * The sentinel never walks and the shade only blinks; they have no fictitious gait.
 * No player input, AI, attack timer, collision or new actor is created here.
 */
export const GROUND_STRIDES=Object.freeze({
 draugr:[[-2,2,1],[-1,1,2],[2,-2,2],[1,-1,1]],
 wisp:[[-1,2,2],[2,1,1],[1,-2,1],[-2,-1,2]],
 archer:[[-2,1,1],[-1,2,2],[2,-1,2],[1,-2,1]],
 charger:[[-2,2,2],[0,2,1],[2,-2,1],[-2,0,2]],
 warden:[[-2,2,1],[-2,0,2],[2,-2,2],[0,-2,1]]
});
export function enemyTravelFrame(e,reducedMotion=false){
 const stride=e.stride??0;
 if(!Number.isFinite(stride)||stride<0)throw new RangeError('Invalid physical hostile distance');
 if(reducedMotion||!e.stepping||e.state==='hidden'||e.state==='recover'||!Object.hasOwn(GROUND_STRIDES,e.kind))return -1;
 return Math.floor(stride/2.5)%4;
}
/** Edits the seven bottom runic rows in-place. Each alternating boot/ghost tail
 * repositions its LEFT and RIGHT halves differently and lifts one real leg.
 * Compositing keeps upper faces, hit fractures and warning weapons intact.
 */
export function inkedTravelBody(base,e,reducedMotion=false){
 const frame=enemyTravelFrame(e,reducedMotion);
 if(frame<0)return base;
 const strokes=GROUND_STRIDES[e.kind][frame];
 const n=e.kind==='warden'?8:e.kind==='wisp'?7:6;
 const width=Math.max(...base.map(row=>row.length));
 if(base.length<n+4||width<10)throw new RangeError('Broken enemy travel atlas');
 const split=Math.floor(width/2),start=base.length-n;
 const out=[...base],layers=Array.from({length:n},()=>Array(width).fill('.'));
 for(let i=0;i<n;i++){
  const line=(base[start+i]??'').replace(/ /g,'.').padEnd(width,'.');
  for(let x=0;x<width;x++){
   const ink=line[x];
   if(!ink||ink==='.')continue;
   const left=x<split,shift=(left?strokes[0]:strokes[1])??0;
   const nearFeet=i>=n-3;
   const raise=nearFeet&&((left&&strokes[2]===1)||(!left&&strokes[2]===2))?1:0;
   const y=Math.max(0,i-raise);
   const dx=i<2?Math.trunc(shift/2):shift;
   const dest=Math.max(0,Math.min(width-1,x+dx));
   layers[y][dest]=ink;
  }
 }
 for(let i=0;i<n;i++)out[start+i]=layers[i].join('');
 return out;
}
