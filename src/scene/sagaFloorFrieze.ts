/** RUNEGRAVE 0.09.24 Gate A — five Norse masonry schools, five myth cycles.
 * The lower architectural edge is one broad authored 5-panel story frieze.
 * Each canonical fs-XX chamber has a different physical carved episode and
 * selected-panel profile, rather than a recolored copy or random decoration.
 * Background ONLY: no hitboxes, HUD, pickups, door states, warning semantics.
 */
export const FRIEZE_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'] as const;
export type FriezeFamily=(typeof FRIEZE_FAMILIES)[number];
export const FRIEZE_STONE=Object.freeze({
 ASH:['....####....','...##++##...','..##++++##..','.##++##++##.','##++#..#++##','##++#..#++##','.##++##++##.','..##++++##..','...##++##...','....####....'],
 IRON:['..########..','.##++++++##.','##++####++##','##++#..#++##','##++####++##','##++####++##','##++#..#++##','##++####++##','.##++++++##.','..########..'],
 ROOT:['#....##....#','##...##...##','.##..##..##.','..##.##.##..','...######...','...######...','..##.##.##..','.##..##..##.','##...##...##','#....##....#'],
 SPIRIT:['.....##.....','....#++#....','...#++++#...','..#++##++#..','.#++#..#++#.','.#++#..#++#.','..#++##++#..','...#++++#...','....#++#....','.....##.....'],
 FATE:['##........##','+##......##+','.+##....##+.','..+##..##+..','...+####+...','...+####+...','..+##..##+..','.+##....##+.','+##......##+','##........##']
});
/** Five original 9-column saga episodes: forged blade, fallen crown, world
 * tree, soul ferry, spun fate. No letters or pseudo-pickup glyphs. */
export const FRIEZE_EPISODES=Object.freeze([
 ['....#....','...###...','..##+##..','###+++###','..##+##..','..##+##..','...###...','...#.#...','...#.#...'],
 ['..#...#..','..##.##..','###+++###','##++#++##','##+++++##','.##+++##.','..#####..','...###...','....#....'],
 ['....#....','...###...','..##+##..','###+++###','###+++###','..##+##..','..##+##..','.##...##.','##.....##'],
 ['...###...','..#+++#..','.##+++#..','##++#++##','#+#+++#+#','##++#++##','..#+++#..','..#+++#..','...###...'],
 ['##.....##','+##...##+','.+##.##+.','..+###+..','...++#...','..+###+..','.+##.##+.','+##...##+','##.....##']
]);
export const FRIEZE_PALETTES=Object.freeze({
 ASH:['#131d1f','#4e3a32','#ad7251','#e6b47b'],
 IRON:['#111e21','#3e545e','#90a6a8','#dae0c1'],
 ROOT:['#112322','#315542','#86b28b','#d2e6ad'],
 SPIRIT:['#151b29','#384562','#8193b6','#d0e0ed'],
 FATE:['#1f211b','#68583b','#bea069','#f0dca6']
} as const);
type G=CanvasRenderingContext2D;
function px(g:G,x:number,y:number,w:number,h:number,ink:string):void {
 g.fillStyle=ink;g.fillRect(Math.round(x),Math.round(y),w,h);
}
function inlay(g:G,pattern:readonly string[],x:number,y:number,unit:number,cut:string,rim:string):void {
 // One fillRect per contiguous run, rather than per-pixel; more efficient on
 // iPhone and retains deliberate, hard-edged native pixel artwork.
 for(let iy=0;iy<pattern.length;iy++){
  const row=pattern[iy]??'',W=row.length;
  for(let ix=0;ix<W;){
   const ch=row[ix]??'.';
   if(ch==='.') {ix++;continue;}
   let end=ix+1;
   while(end<W&&row[end]===ch)end++;
   px(g,x+ix*unit,y+iy*unit,(end-ix)*unit,unit,ch==='#'?cut:rim);
   ix=end;
  }
 }
}
/** A fixed 5×1 strip at the lower architectural floor edge. Bounds relative
 * to the center world canvas: [W/2-106,W/2+106] × [H-39,H-5].
 * Never uses DOM, collision coordinates, randomness or an animation clock.
 */
export function paintSagaFloorFrieze(g:G,W:number,H:number,family:FriezeFamily,canonicalSerial:number):void {
 const fi=FRIEZE_FAMILIES.indexOf(family);
 if(fi<0||![W,H].every(Number.isFinite)||W<240||H<148||
 !Number.isSafeInteger(canonicalSerial)||canonicalSerial<0||canonicalSerial>=25||
 Math.floor(canonicalSerial/5)!==fi)throw new RangeError('Invalid saga frieze room');
 const chapter=canonicalSerial%5;
 const [shadow,stone,cut,gold]=FRIEZE_PALETTES[family];
 const base=FRIEZE_STONE[family],episode=FRIEZE_EPISODES[chapter]!;
 const cx=Math.round(W/2),top=Math.round(H)-35;
 g.save();g.globalAlpha=.73;
 // A single low carved shelf, not a fake door, enemy or interactable item.
 px(g,cx-107,top+25,214,4,shadow);
 px(g,cx-104,top+27,208,2,stone);
 px(g,cx-105,top+2,210,2,stone);
 for(let i=0;i<5;i++){
  const x=cx-86+i*43;  // five distinct original family-cut panels
  px(g,x-16,top+1,32,28,shadow);
  px(g,x-15,top+2,30,24,stone);
  px(g,x-14,top+3,28,22,shadow);
  // Unique family frame silhouettes visible in all five panels.
  inlay(g,base,x-12,top+3,2,stone,cut);
  if(i===chapter){
   // An inset scene physically replaces the central stone section, with
   // open side-brackets and notched crown; not merely a color change.
   px(g,x-11,top+5,22,20,shadow);
   inlay(g,episode,x-9,top+6,2,cut,gold);
   px(g,x-9,top-2,18,5,stone);
   px(g,x-6,top-5,12,4,cut);
   px(g,x-1,top-7,2,3,gold);
   px(g,x-15,top+9,3,9,cut);
   px(g,x+12,top+9,3,9,cut);
  } else {
   // Physical unselected lintel notch, never false gold pickup.
   px(g,x-9,top+25,18,2,stone);
  }
  // A family-dependent corner key that differs between every room's five
  // scenes because the selected chapter sits in a distinct stone bay.
  px(g,x-16,top+1,4,4,stone);
  px(g,x+12,top+1,4,4,stone);
  px(g,x-13,top+2,2,2,cut);
  px(g,x+12,top+2,2,2,cut);
 }
 // One grounded boundary cap at each end; symmetry anchors the corridor.
 for(const side of [-1,1]){
  const x=cx+side*102;
  px(g,x-3,top-1,6,30,shadow);
  px(g,x-2,top,4,26,stone);
  px(g,x-1,top+5,2,13,cut);
  px(g,x-3,top-4,6,4,stone);
 }
 g.restore();
}
