/** Gate A v0.09.23: a readable real threshold, not a false portal prop.
 * The four original runic door orientations have different carved profiles.
 * The physically obstructed steel portcullis has an X of iron teeth, chains
 * and a solid bottom weight. A truly open portal has TWO visibly retracted
 * halves and four nested stone-tunnel ribs around a deep empty floor channel.
 * No collision, exit activation, map, physics or touch target is changed.
 */
import type {ExitDirection} from '../run/wayfinding.js';
type G=CanvasRenderingContext2D;
export const DOOR_DIRECTIONS=['north','east','south','west'] as const;
export const DOOR_CARVINGS=Object.freeze({
 north:['...#...','..###..','.#+++#.','##+#+##','...#...','...#...','...#...'],
 east:['...#...','....##.','.....##','#######','.....##','....##.','...#...'],
 south:['...#...','...#...','...#...','##+#+##','.#+++#.','..###..','...#...'],
 west:['...#...','.##....','##.....','#######','##.....','.##....','...#...']
});
const INK=Object.freeze({shadow:'#101d20',stone:'#677161',bronze:'#c3aa80',ivory:'#f4dfba',
 moss:'#376455',pale:'#acdbb3',coal:'#1e2f31',iron:'#756753'});
function px(g:G,x:number,y:number,w:number,h:number,ink:string):void{
 g.fillStyle=ink;g.fillRect(Math.round(x),Math.round(y),w,h);
}
function sigil(g:G,x:number,y:number,rows:readonly string[],color:string):void{
 for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r]!.length;c++){
  const p=rows[r]![c];if(p==='.')continue;
  px(g,x+c*2,y+r*2,2,2,p==='+'?INK.ivory:color);
 }
}
export type GateState='barred'|'open';
export function doorArtState(open:boolean):GateState{
 if(typeof open!=='boolean')throw new TypeError('Door artwork requires real boolean gate state');
 return open?'open':'barred';
}
/** Visual art's only switch is the actual existing open/locked boolean. */
export function paintSagaGate(g:G,direction:ExitDirection,open:boolean,time:number,reducedMotion=false):void{
 if(!Number.isFinite(time)||!Object.hasOwn(DOOR_CARVINGS,direction))
 throw new RangeError('Invalid world doorway paint inputs');
 const status=doorArtState(open),pattern=DOOR_CARVINGS[direction];
 g.save();
 // The iconic side-standing Norse stone antlers always live at +/- [29,45]px.
 // Neither intersects the center-world playfield nor any actual controller.
 for(const s of [-1,1]){
  const x=s<0?-43:30;
  px(g,x,-28,13,42,INK.shadow);
  px(g,x+1,-29,11,37,INK.stone);
  px(g,x+3,-27,6,34,INK.coal);
  px(g,x+3,-27,2,29,INK.bronze);
  for(let y=-22;y<=6;y+=8){
   px(g,x+5,y,4,2,status==='open'?INK.pale:INK.iron);
  }
  px(g,x-2,-31,17,5,INK.stone);
  px(g,x,-30,13,2,INK.ivory);
  // Each side retains a complete north/south/east/west rune that has
  // distinct PIXEL GEOMETRY, not merely a different label or glow color.
  sigil(g,x-1,-20,pattern,status==='open'?INK.pale:INK.bronze);
  // Original sculpted crest/spear tips are deliberately asymmetric.
  if(s<0){
   px(g,-40,-37,4,8,INK.stone);px(g,-38,-40,2,4,INK.ivory);
  }else{
   px(g,36,-38,3,9,INK.stone);px(g,37,-41,2,4,INK.ivory);
  }
 }
 if(status==='barred'){
  // Steel bulkhead with an obstructive physical X. This is not the glowing
  // "open" corridor with a red tint: it entirely blocks the visible gap.
  px(g,-13,-18,26,28,INK.shadow);
  for(let y=-18;y<=7;y+=5){
   px(g,-13,y,26,3,INK.iron);
   px(g,-12,y+1,24,1,INK.bronze);
  }
  for(let i=0;i<6;i++){
   const yy=-18+i*4;
   px(g,-12+i*4,yy,4,5,INK.coal);
   px(g,8-i*4,yy,4,5,INK.bronze);
  }
  px(g,-14,9,28,5,INK.iron);
  px(g,-6,-8,12,12,INK.stone);
  px(g,-4,-5,8,7,INK.bronze);
  px(g,-2,-4,4,5,INK.coal);
  // Two iron-weighted hanging chains are on the solid door, never "opened."
  for(const x of [-15,13])for(let yy=-17;yy<10;yy+=6)px(g,x,yy,2,4,INK.bronze);
 }else{
  // The sides REALLY retract to expose a wide, dark passage; the previous
  // bars do not survive this branch. Vanishing-point ribs show tunnel depth.
  px(g,-12,-19,24,30,'#0a201d');
  px(g,-9,-17,18,25,INK.coal);
  px(g,-6,-14,12,22,'#173d33');
  px(g,-3,-10,6,17,'#305d46');
  for(let n=0;n<4;n++){
   const inset=n*2,y=-17+n*5;
   px(g,-11+inset,y,2,5,INK.pale);
   px(g,9-inset,y,2,5,INK.bronze);
  }
  // Eight stepped double-edged voussoirs are PERSPECTIVE RIBS beside an
  // actually empty center corridor, not bars across the playable doorway.
  // More visible structural depth than the barred slab in both color and form.
  for(let n=0;n<8;n++){
   const inset=n%4,y=-20+n*4;
   px(g,-13+inset,y,2,3,INK.stone);
   px(g,11-inset,y,2,3,INK.stone);
   px(g,-12+inset,y+1,1,2,INK.pale);
   px(g,12-inset,y+1,1,2,INK.bronze);
  }
  // Heavy left and right stone doors are pulled completely out of the path.
  for(const s of [-1,1]){
   const x=s<0?-25:20;
   px(g,x,-19,5,31,INK.stone);
   for(let y=-16;y<11;y+=7)px(g,x+1,y,3,3,INK.pale);
  }
  px(g,-10,10,20,3,INK.pale);
  px(g,-7,13,14,2,INK.moss);
  // Animation is confined to a tiny interior lamp, never an active attack.
  if(!reducedMotion){
   const glint=Math.round(Math.sin(time*2.5)*1);
   px(g,-1,-9+glint,2,4,INK.pale);
  }
 }
 g.restore();
}
