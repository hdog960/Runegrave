export type WardenWear='bound'|'unbound'|'sundered';
/** v0.09.37 Gate A: actual Warden phase two is physically unbound.
 * At REAL <=25% remaining HP, the same body exposes its cracked heartstone.
 * This is NOT a third battle phase, attack, entity, damage or hitbox.
 * All flank pixels are etched INSIDE the one original 20-column sprite sheet.
 */
export const WARDEN_UNBOUND_CROWN=Object.freeze([["..oo","oo.."],[".occ","cco."],["ocge","egco"],["oggr","rggo"],["ogcc","ccgo"],[".ogg","ggo."]]);
/** 18 individually hand-authored pairs of flank carvings, rows 5..22. */
export const WARDEN_BARK_CUTS=Object.freeze({
 unbound:[
  ['.oag','gao.'],['oagg','ggao'],['ogge','eggo'],['obgg','ggbo'],
  ['oagb','bgao'],['oaba','abao'],['oaag','gaao'],['oaar','raao'],
  ['oaeg','geao'],['oagr','rgao'],['oaga','agao'],['oabb','bbao'],
  ['oaba','abao'],['.oab','bao.'],['..oa','ao..'],['.oab','bao.'],
  ['..oa','ao..'],['..oo','oo..']
 ],
 sundered:[
  ['orrg','grro'],['orge','egro'],['ogre','ergo'],['orge','egro'],
  ['oagr','rgao'],['oacr','rcao'],['oarr','rrao'],['oare','erao'],
  ['ogrr','rrgo'],['oarr','rrao'],['oagr','rgao'],['oaer','reao'],
  ['oaar','raao'],['.oar','rao.'],['..or','ro..'],['.oar','rao.'],
  ['..or','ro..'],['..oo','oo..']
 ]
});
/** Bright actual heartstone wear in only the original boss torso pixels. */
export const WARDEN_HEARTSTONE=Object.freeze({
 unbound:['ogrrrgo','grrerrg','rreeerr','grrerrg','ogrrrgo'],
 sundered:['orrrrro','rreeerr','reeeeer','rreeerr','orrrrro']
});
export function wardenBodyWear(kind:string,phase:number,hp?:number,maxHp?:number):WardenWear{
 if(!Number.isFinite(phase))throw new RangeError('Invalid boss phase');
 if(kind!=='warden'||phase!==2)return 'bound';
 if(hp===undefined&&maxHp===undefined)return 'unbound';
 if(typeof hp!=='number'||typeof maxHp!=='number'||!Number.isFinite(hp)||!Number.isFinite(maxHp)||maxHp<=0||hp<0||hp>maxHp)throw new RangeError('Invalid Warden physical heartstone health');
 return hp<=maxHp/4?'sundered':'unbound';
}
export function inkedWardenPhaseBody(base:readonly string[],kind:string,phase:number,hp?:number,maxHp?:number):readonly string[]{
 const wear=wardenBodyWear(kind,phase,hp,maxHp);
 if(wear==='bound')return base;
 const width=Math.max(...base.map(row=>row.length));
 if(base.length<25||width<19)throw new RangeError('Broken actual Warden body sheet');
 const out=[...base];
 // Retain original phase-two antlers, then sculpt shoulders, ribs and boots.
 for(let i=0;i<WARDEN_UNBOUND_CROWN.length;i++){
  const [left,right]=WARDEN_UNBOUND_CROWN[i]!;
  const row=(out[i+1]??'').replace(/ /g,'.').padEnd(width,'.');
  out[i+1]=left+row.slice(4,width-4)+right;
 }
 const flanks=WARDEN_BARK_CUTS[wear];
 for(let i=0;i<flanks.length;i++){
  const [left,right]=flanks[i]!,y=i+5;
  const row=(out[y]??'').replace(/ /g,'.').padEnd(width,'.');
  out[y]=left+row.slice(4,width-4)+right;
 }
 const core=WARDEN_HEARTSTONE[wear];
 for(let i=0;i<core.length;i++){
  const y=i+10,row=(out[y]??'').replace(/ /g,'.').padEnd(width,'.');
  const left=Math.floor((width-7)/2);
  out[y]=row.slice(0,left)+core[i]!+row.slice(left+7);
 }
 return out;
}
