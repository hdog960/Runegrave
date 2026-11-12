import type { Enemy, EnemyKind } from '../enemies/encounters.js';

/** Seven independently carved five-row clan seals, not a generic coloured HP bar.
 * The plaque is in WORLD space and reads only the already existing real HP.
 * No new simulation clock, combat outcome, HUD, or canvas outside the stage.
 */
export const VITAL_RUNE_SEALS: Readonly<Record<EnemyKind,readonly string[]>>=Object.freeze({
  draugr: ['#...#','##.##','..#..','.#.#.','##.##'], // broken jaw / burial teeth
  wisp:   ['..#..','.#.#.','#...#','.#.#.','..#..'], // hollow flame
  archer: ['#....','.#...','..###','.#...','#....'], // drawn bow
  charger:['#...#','##.##','.#.#.','..#..','.#.#.'], // two cracked horns
  sentinel:['.###.','#.#.#','###.#','#.#.#','.###.'], // wardstone
  shade:  ['#.#.#','.#.#.','..#..','.#.#.','#...#'], // severed veil
  warden: ['#...#','##.##','#####','.#.#.','###.#'] // fractured root crown
});
export const VITAL_RUNE_MATERIALS: Readonly<Record<EnemyKind,{stone:string;edge:string;light:string;empty:string;ink:string}>>=Object.freeze({
 draugr:  {stone:'#263238',edge:'#81908b',light:'#c8b899',empty:'#36464a',ink:'#f2d9ad'},
 wisp:    {stone:'#1b323c',edge:'#6ca4b1',light:'#a0e7e4',empty:'#2d5057',ink:'#defafb'},
 archer:  {stone:'#42362e',edge:'#ac8761',light:'#e5bf88',empty:'#544437',ink:'#ffe4b6'},
 charger: {stone:'#442f2b',edge:'#b27055',light:'#ffbb8d',empty:'#5a3a32',ink:'#ffdbb7'},
 sentinel:{stone:'#3c3832',edge:'#aa9060',light:'#e7ca78',empty:'#58503d',ink:'#fff1b8'},
 shade:   {stone:'#302b40',edge:'#8976ac',light:'#cfb2ee',empty:'#473959',ink:'#f1dcff'},
 warden:  {stone:'#2f3c30',edge:'#b48c59',light:'#eac881',empty:'#4b5c43',ink:'#fff0b3'}
});
export type VitalHostile=Pick<Enemy,'kind'|'x'|'y'|'radius'|'hp'|'maxHp'|'alive'|'state'>;
export type VitalPlaque={x:number;y:number;width:number;height:number;slots:number};
/** Geometry is clamped INSIDE the physical scene canvas: no virtual UI rail spill.
 * Existing warning labels are ABOVE the hostile; these plaques sit BELOW the feet.
 */
export function vitalPlaqueGeometry(e:VitalHostile,worldWidth:number,worldHeight:number):VitalPlaque {
 if(!Number.isFinite(worldWidth)||!Number.isFinite(worldHeight)||worldWidth<110||worldHeight<110
   || !Number.isFinite(e.x)||!Number.isFinite(e.y)||!Number.isFinite(e.radius))
   throw new RangeError('Invalid center-canvas rune plaque geometry');
 const boss=e.kind==='warden',width=boss?88:56,height=boss?25:22,slots=boss?10:6;
 const x=Math.max(3,Math.min(worldWidth-width-3,Math.round(e.x-width/2)));
 // Never let the plaque float beyond the visible world, even at a south doorway.
 const proposed=Math.round(e.y+e.radius+12);
 const y=Math.max(3,Math.min(worldHeight-height-3,proposed));
 return {x,y,width,height,slots};
}
/** Fractional filled notches honestly represent every HP value, including 1 HP.
 * Hollow grooves count as missing health, not another shield or boss phase.
 */
export function vitalRuneFractions(hp:number,maxHp:number,slots:number):readonly number[] {
 if(!Number.isFinite(hp)||!Number.isFinite(maxHp)||maxHp<=0||hp<0||hp>maxHp
    ||!Number.isInteger(slots)||slots<1||slots>16)
    throw new RangeError('Invalid actual enemy HP');
 return Array.from({length:slots},(_,i)=>Math.max(0,Math.min(1,hp*slots/maxHp-i)));
}
const rect=(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,c:string)=>{
 g.fillStyle=c;g.fillRect(x,y,w,h);
};
/** Static (also in prefers-reduced-motion) carved enemy-attached material.
 * Untouched full-health ordinary enemies retain an uncluttered world.
 */
export function paintVitalRunePlaque(g:CanvasRenderingContext2D,e:VitalHostile,worldWidth:number,worldHeight:number):void {
 if(!e.alive||e.state==='hidden'||e.hp<=0)return;
 const fractions=vitalRuneFractions(e.hp,e.maxHp,e.kind==='warden'?10:6);
 if(e.hp===e.maxHp&&e.kind!=='warden'&&e.state!=='warning')return;
 const {x,y,width,height,slots}=vitalPlaqueGeometry(e,worldWidth,worldHeight);
 const p=VITAL_RUNE_MATERIALS[e.kind],seal=VITAL_RUNE_SEALS[e.kind];
 const boss=e.kind==='warden';
 rect(g,x,y,width,height,'#0a171a');
 rect(g,x+1,y+1,width-2,height-2,p.edge);
 rect(g,x+2,y+2,width-4,height-4,p.stone);
 // The silhouette of the real enemy is identified by a separate, hand-carved seal.
 rect(g,x+3,y+3,13,13,'#0d2324');
 for(let row=0;row<5;row++)for(let col=0;col<5;col++)
  if(seal[row]![col]==='#')rect(g,x+5+col*2,y+5+row*2,2,2,p.ink);
 const barX=x+19,barY=y+height-7,barW=width-24;
 rect(g,barX-1,barY-2,barW+2,6,'#0c1c1e');
 const gap=1,slotW=(barW-(slots-1)*gap)/slots;
 for(let i=0;i<slots;i++){
   const at=barX+i*(slotW+gap);
   rect(g,at,barY,slotW,3,p.empty);
   const remaining=fractions[i]!;
   if(remaining>0)rect(g,at,barY,slotW*remaining,3,p.light);
 }
 g.fillStyle=p.ink;
 g.textAlign='right';
 g.textBaseline='alphabetic';
 g.font=boss?'bold 10px monospace':'bold 9px monospace';
 g.fillText(e.hp+'/'+e.maxHp,x+width-5,y+(boss?13:12));
 // Fixed carved border/rivets: no pulsing FX that could counterfeit warnings.
 rect(g,x+1,y+1,2,2,p.light);
 rect(g,x+width-3,y+1,2,2,p.light);
 rect(g,x+1,y+height-3,2,2,p.edge);
 rect(g,x+width-3,y+height-3,2,2,p.edge);
}
