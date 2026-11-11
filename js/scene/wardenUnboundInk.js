/** Gate A v0.09.29: Warden's actual phase-two root crown is the SAME
 * body with a unique antler silhouette, not a duplicated actor/AI timer. */
export const WARDEN_UNBOUND_CROWN=Object.freeze([["..oo","oo.."],[".occ","cco."],["ocge","egco"],["oggr","rggo"],["ogcc","ccgo"],[".ogg","ggo."]]);
export function inkedWardenPhaseBody(base,kind,phase){
 if(!Number.isFinite(phase))throw new RangeError('Invalid boss phase');
 if(kind!=='warden'||phase!==2)return base;
 const width=Math.max(...base.map(r=>r.length)),out=[...base],at=1;
 if(base.length<at+WARDEN_UNBOUND_CROWN.length||width<11)throw new RangeError('Warden sprite too small');
 for(let y=0;y<WARDEN_UNBOUND_CROWN.length;y++){
  const [left,right]=WARDEN_UNBOUND_CROWN[y];
  const middle=(base[y+at]??'').replace(/ /g,'.').padEnd(width,'.').slice(4,width-4);
  out[at+y]=left+middle+right;
 }
 return out;
}
