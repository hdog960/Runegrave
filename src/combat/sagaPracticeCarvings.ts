import type { TrainingTarget } from './soulbolts.js';
/** RUNEGRAVE v0.09.48 — genuinely distinct hand-cut training targets.
 * Visual-only masks: live HP controls carved damage, live flash controls rune light.
 * Neither type grants a new hostile, projectile, hitbox, reward, or wall-clock effect.
 */
const RAW = {
  "effigy": [
    "..........ooo..........",
    "........ooibioo........",
    ".......oibhhbio........",
    "......oibbbbbio........",
    ".......oiiirio.........",
    "........oirio..........",
    "....oooiiwwiiooo......",
    "...oibbbwwbbbbiio.....",
    "..oibbiwwwwibbbio.....",
    "..oibiwwrrwwibbio.....",
    ".oibbiwwrhrwwibbio....",
    ".oibbiwwwrwwwibbio....",
    ".oibbiwwrhrwwibbio....",
    ".oibbiwwrrrwwibbio....",
    ".oibbiwwwwwwwibbio....",
    "..oibbiwwwwwibbio.....",
    "...oibbbiiibbbio......",
    "....oiiobbbboiio......",
    ".......oiwwio.........",
    "......oibwwbio........",
    "......oiwwwio.........",
    ".....oibwwwwbio.......",
    ".....oiwwiiwwio.......",
    "....oibwiooiwbio......",
    "....oiii....iiio......",
    "...oibbo....obbio.....",
    "...oooo......oooo....."
  ],
  "urn": [
    ".........oooo.........",
    ".......ooibbbio.......",
    "......oibhhbbio.......",
    ".....oiibbrrbbio......",
    "......oiibbbbio.......",
    ".......ooiiioo........",
    "......oibbbbbiio......",
    ".....oibwwwwwbio......",
    "....oibwwrrrwwbio.....",
    "...oibwwrrhrrwwbio....",
    "...oiwwrrrrrwwiio.....",
    "..oibwwwwwrwwwwbio....",
    "..oibwwwwrwwwwwbio....",
    "..oibwwwwrwwwwwbio....",
    "..oibwwrhrhrwwwbio....",
    "..oibwwwrrrwwwwbio....",
    "...oibwwwwwwwbio......",
    "...oibbbwwwwbbio......",
    "....oibbbiiibio.......",
    ".....oiibbbbio........",
    "......oibbbbio........",
    ".......oiiioo.........",
    "........oooo..........",
    ".........oo...........",
    "......................"
  ]
};
export const PRACTICE_MATERIALS = Object.freeze({
  "o": "#101c24",
  "i": "#57717a",
  "w": "#8e7660",
  "b": "#d5a66c",
  "r": "#7dd2ca",
  "h": "#f5e5be",
  "c": "#f3c89c"
});
const WIDTH = 29;
function centerCarving(rows: readonly string[]): readonly string[] {
  return Object.freeze(rows.map(line => {
    if(line.length>WIDTH || !/^[.oibwrh]+$/.test(line))throw new RangeError('Invalid authored Norse practice carving');
    const left=Math.floor((WIDTH-line.length)/2);
    return '.'.repeat(left)+line+'.'.repeat(WIDTH-left-line.length);
  }));
}
export const PRACTICE_CARVINGS = Object.freeze({
  effigy: centerCarving(RAW.effigy),
  urn: centerCarving(RAW.urn)
});
export function practiceCarvingPhase(hp:number,maxHp:number):0|1|2 {
  if(!Number.isFinite(hp)||!Number.isFinite(maxHp)||maxHp<=0||hp<0||hp>maxHp)
    throw new RangeError('Invalid actual training target HP');
  return hp===maxHp?0:hp>maxHp/2?1:2;
}
/** Damage appears ONLY after real HP is lost; cuts reveal through the wood/clay.
 * No procedural scene effect or fake enemy damage indicator is generated.
 */
export function practiceCarvingRows(kind:'effigy'|'urn',hp:number,maxHp:number):readonly string[] {
  const base=PRACTICE_CARVINGS[kind],phase=practiceCarvingPhase(hp,maxHp);
  if(!base)throw new RangeError('Unknown genuine training target kind');
  if(phase===0)return base;
  const out=base.map(line=>line.split(''));
  const slash=(from:number,to:number,guide:(y:number)=>number)=>{
    for(let y=from;y<=to&&y<out.length;y++){
      const line=out[y];
      if(!line)continue;
      const mid=guide(y);
      for(let off=0;off<=3;off++){
        const x=mid+(off%2===0?Math.ceil(off/2):-Math.ceil(off/2));
        if(line[x]&&line[x]!=='.'&&line[x]!=='o'){line[x]='c';break;}
      }
    }
  };
  slash(9,15,y=>kind==='effigy'?12+Math.floor((y-9)/2):13+Math.floor((y-9)/3));
  if(phase===2)slash(15,Math.min(22,out.length-2),y=>kind==='effigy'?19-Math.floor((y-15)/2):19-Math.floor((y-15)/2));
  return out.map(row=>row.join(''));
}
/** The body is painted around the same original target.x/y. No world/hit
 * geometry, center-canvas layout, AI or simulation changes are made.
 */
export function paintTruePracticeCarving(g:CanvasRenderingContext2D,target:Pick<TrainingTarget,'kind'|'x'|'y'|'hp'|'maxHp'|'alive'|'flash'>):boolean {
  if(!target.alive)return false;
  if(!Number.isFinite(target.x)||!Number.isFinite(target.y)||!Number.isFinite(target.flash))
    throw new RangeError('Invalid live practice target art coordinates');
  const rows=practiceCarvingRows(target.kind,target.hp,target.maxHp);
  const ox=-Math.floor(WIDTH/2),oy=target.kind==='effigy'?-17:-15;
  g.save();g.translate(Math.round(target.x),Math.round(target.y));
  g.fillStyle='#09141bba';g.beginPath();g.ellipse(0,11,16,5,0,0,Math.PI*2);g.fill();
  for(let y=0;y<rows.length;y++){
    const line=rows[y];
    if(!line)continue;
    for(let x=0;x<line.length;){
      const ink=line[x];
      if(ink==='.'){x++;continue;}
      let end=x+1;while(end<line.length&&line[end]===ink)end++;
      g.fillStyle=target.flash>0&&(ink==='r'||ink==='h')?'#fff6cb':PRACTICE_MATERIALS[ink];
      g.fillRect(ox+x,oy+y,end-x,1);
      x=end;
    }
  }
  g.restore();
  return true;
}
