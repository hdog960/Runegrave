/** v0.09.27 — The five physically distinct vault head profiles, with
 * five different engraved historical episodes. The 25 actual fs-01..fs-25
 * rooms select their canonical family/episode; nothing depends on visit order.
 * Flat 2px-batched carved masonry (no door/pickup/telegraph illusion).
 */
export const VAULT_CANOPY_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'];
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
});
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
]);
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
});
function rect(g,x,y,w,h,color){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);}
function relief(g,rows,x,y,cell,dark,light){
 for(let r=0;r<rows.length;r++){
  const line=rows[r];
  for(let c=0;c<line.length;){
   const ink=line[c];if(ink==='.') {c++;continue;}
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
export function paintVaultCanopies(g,W,H,family,serial){
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
  rect(g,x+6,y+27,22,25,voidInk);
  relief(g,VAULT_CANOPY_MYTHS[story],x+8,y+29,2,rim,gold);
  rect(g,x-3,y+55,40,4,stone);
  rect(g,x-1,y+59,36,5,rim);
  rect(g,x+2,y+66,30,4,stone);
  // The authored cut-count changes a small physical lintel, never UI text.
  rect(g,x+3+story*5,y+59,4,4,gold);
  // Carved, shaded lower keystone ties the arch to its existing side pier.
  relief(g,VAULT_CANOPY_SEALS[story],x+9,y+58,2,rim,gold);
  rect(g,x+1,y+70,32,2,stone);
 }
 g.restore();
}