type G=CanvasRenderingContext2D;
type Family='ASH'|'IRON'|'ROOT'|'SPIRIT'|'FATE';
/** v0.09.27 — The five physically distinct vault head profiles, with
 * five different engraved historical episodes. The 25 actual fs-01..fs-25
 * rooms select their canonical family/episode; nothing depends on visit order.
 * Flat 2px-batched carved masonry (no door/pickup/telegraph illusion).
 */
export const VAULT_CANOPY_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'] as const;
export const VAULT_CANOPY_ARCHES=Object.freeze({
 "ASH": [
  "...###.....###...",
  "..##++#...#++##..",
  ".##+##.....##+##.",
  "##+##.......##+##",
  "##+##..###..##+##",
  "..##++##+##++##..",
  "....####.####...."
 ],
 "IRON": [
  "..##########.....",
  ".##++####++##....",
  "##++######++##...",
  "##+###++###+##...",
  "##+##++++##+##...",
  "##++######++##...",
  "..##########....."
 ],
 "ROOT": [
  "##...........##..",
  ".##.........##...",
  "..##.......##....",
  "...##.....##.....",
  "....###+###......",
  "..##++##++##.....",
  "##..##..##..##..."
 ],
 "SPIRIT": [
  ".......###.......",
  "......#+#++......",
  ".....#++#++#.....",
  "....#++###++#....",
  "...#++##+##++#...",
  "..#++#.....#++#..",
  "..#.#.......#.#.."
 ],
 "FATE": [
  "##...........##..",
  ".##.........##...",
  "..##.......##....",
  "...##.....##.....",
  "....###+###......",
  "...##++#++##.....",
  "..##+++++++##...."
 ]
} as const);
export const VAULT_CANOPY_MYTHS=Object.freeze([
 [
  "....#....",
  "...###...",
  "..##+##..",
  "..##+##..",
  "..##+##..",
  "...#+#...",
  "...#+#...",
  "...#.#...",
  "..#...#.."
 ],
 [
  "..#...#..",
  ".##...##.",
  "##++#++##",
  "#++###++#",
  "##++#++##",
  ".##+++##.",
  "..#####..",
  "...###...",
  "....#...."
 ],
 [
  "....#....",
  "...###...",
  "..##+##..",
  "##+###+##",
  "..##+##..",
  "..##+##..",
  ".##...##.",
  "##.....##",
  "#.......#"
 ],
 [
  "...###...",
  "..##+##..",
  ".##+++##.",
  "##++#++##",
  "#++###++#",
  "##++#++##",
  ".##+++##.",
  "..##+##..",
  "...###..."
 ],
 [
  "##.....##",
  "+##...##+",
  ".+##.##+.",
  "..+###+..",
  "...++#...",
  "..+###+..",
  ".+##.##+.",
  "+##...##+",
  "##.....##"
 ]
] as const);
/** Five original carved vault-keystone seals, keyed to the real
 * canonical story episode. They are masonry, not door/item/status markings.
 */
export const VAULT_CANOPY_SEALS=Object.freeze([
 [
  "..####..",
  ".##++##.",
  "##+##+##",
  ".##++##.",
  "..####.."
 ],
 [
  "#......#",
  "##....##",
  ".##++##.",
  "..####..",
  "...##..."
 ],
 [
  "...##...",
  "..####..",
  ".##++##.",
  "##+##+##",
  "#......#"
 ],
 [
  "..#..#..",
  ".##++##.",
  "##++++##",
  ".##++##.",
  "..#..#.."
 ],
 [
  "#.#..#.#",
  ".#.#.#.#",
  "..####..",
  ".#.#.#.#",
  "#.#..#.#"
 ]
]);
/** Five actual negative-space stone arch cuts replace flat upper-masonry
 * texture: non-interactive scene geometry strictly behind combat. */
/** Five original paired burial effigies, shaped to five true room
 * material families. Carved into upper *outer* wall plinths only, never
 * status, collision, door, interactable or dangerous telegraph content.
 */
export const SAGA_BURIAL_CARYATIDS=Object.freeze({
 "ASH": [
  "....#....",
  "...###...",
  "..#+#+#..",
  ".###+###.",
  ".##+++##.",
  "..#...#..",
  ".##...##."
 ],
 "IRON": [
  "###...###",
  "##+#.#+##",
  ".##+++##.",
  "..#####..",
  "..##+##..",
  "..#...#..",
  "###...###"
 ],
 "ROOT": [
  "#.......#",
  ".##...##.",
  "..##.##..",
  "...###...",
  "...#+#...",
  "..##.##..",
  ".##...##."
 ],
 "SPIRIT": [
  "....#....",
  "...#+#...",
  "..#+++#..",
  "...###...",
  ".##+#+##.",
  "#...#...#",
  "..#...#.."
 ],
 "FATE": [
  "..#...#..",
  ".###.###.",
  "##++#++##",
  "..#+++#..",
  "...###...",
  "..#.#.#..",
  ".#.....#."
 ]
});
export const VAULT_DEPTH_CUTS=Object.freeze({"ASH":["###.....###..",".##.....##...","..##...##....","...##.##.....","....###......"],"IRON":["#############","##++####++###","##++####++###","###++++++####","#############"],"ROOT":["#...........#","##.........##",".##.......##.","..##.....##..","...###.###..."],"SPIRIT":[".....###.....","....##+##....","...##+++##...","..##+++++##..",".##.......##."],"FATE":["##.........##",".##.......##.","..##.....##..","...###.###...","....#####...."]});
export const VAULT_CANOPY_PALETTES=Object.freeze({
 "ASH": [
  "#0d191b",
  "#453a33",
  "#947357",
  "#d8c19a"
 ],
 "IRON": [
  "#101b20",
  "#3d5258",
  "#8ca5aa",
  "#dfd8ae"
 ],
 "ROOT": [
  "#101e19",
  "#34523e",
  "#83a778",
  "#d3e1a8"
 ],
 "SPIRIT": [
  "#14172a",
  "#39456b",
  "#8696bc",
  "#e3edf2"
 ],
 "FATE": [
  "#1a1f1b",
  "#66563b",
  "#b59b70",
  "#e8d6ad"
 ]
} as const);
function rect(g:G,x:number,y:number,w:number,h:number,color:string):void{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);}
function relief(g:G,rows:readonly string[],x:number,y:number,cell:number,dark:string,light:string):void{
 for(let r=0;r<rows.length;r++){
  const line=rows[r]!;
  for(let c=0;c<line.length;){
   const ink=line[c]!;if(ink==='.') {c++;continue;}
   let end=c+1;while(end<line.length&&line[end]===ink)end++;
   rect(g,x+c*cell,y+r*cell,(end-c)*cell,cell,ink==='#'?dark:light);
   c=end;
  }
 }
}
/** Each side stays entirely inside x=58..100 and x=W-100..W-58.
 * The 320px-wide middle of a 420px room remains clear, as do external grips.
 * Upper-wall y is strictly 15..94 even at minimum supported world height.
 */
export function paintVaultCanopies(g:G,W:number,H:number,family:Family,serial:number):void{
 const familyIndex=VAULT_CANOPY_FAMILIES.indexOf(family);
 if(familyIndex<0||W<240||H<148||!Number.isFinite(W)||!Number.isFinite(H)||
 !Number.isSafeInteger(serial)||serial<0||serial>=25||Math.floor(serial/5)!==familyIndex)
  throw new RangeError('Invalid canonical carved vault canopy');
 const story=serial%5,ink=VAULT_CANOPY_PALETTES[family];
 const [voidInk,stone,rim,gold]=ink;
 g.save();g.globalAlpha=.56;
 for(const side of [-1,1]){
  const x=side<0?62:W-96,y=20;
  // These stones tie into the previously authored piers at their edges,
  // visually joined rather than two unconnected black rectangles.
  rect(g,x-4,y+3,42,69,voidInk);
  rect(g,x-2,y+2,38,64,stone);
  rect(g,x,y,34,24,voidInk);
  relief(g,VAULT_CANOPY_ARCHES[family],x,y,2,stone,rim);
  // Genuine family-specific stone negative space replaces flat roof ink.
  relief(g,VAULT_DEPTH_CUTS[family],x+4,y+12,2,voidInk,stone);
  rect(g,x+6,y+27,22,25,voidInk);
  relief(g,VAULT_CANOPY_MYTHS[story]!,x+8,y+29,2,rim,gold);
  rect(g,x-3,y+55,40,4,stone);
  rect(g,x-1,y+59,36,5,rim);
  rect(g,x+2,y+66,30,4,stone);
  // The authored cut-count changes a small physical lintel, never UI text.
  rect(g,x+3+story*5,y+59,4,4,gold);
  // Carved, shaded lower keystone ties the arch to its existing side pier.
  relief(g,VAULT_CANOPY_SEALS[story]!,x+9,y+58,2,rim,gold);
  rect(g,x+1,y+70,32,2,stone);
  // A carved supporting figure per family at world y=74..88.
  // Placed inside the existing 20..92 outer wall silhouette.
  relief(g,SAGA_BURIAL_CARYATIDS[family],x+8,y+54,2,stone,gold);
 }
 g.restore();
}