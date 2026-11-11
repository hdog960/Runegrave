/** Gate A v0.09.22 — original etched stone chronicles, 25 authored scenes.
 * A legible, deliberately low-contrast floor-inlay beneath combat.
 * Five independently designed material contours × five narrative episodes;
 * the canonical fs-XX ID rather than visit order selects the picture.
 * This painter is only world canvas decoration: never a collision, door,
 * collectable, enemy, spell, hazard ring or touch target.
 */
export type ChronicleFamily='ASH'|'IRON'|'ROOT'|'SPIRIT'|'FATE';
export const CHRONICLE_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'] as const;
/** A mosaic tile: # = deeply cut basalt, + = material edge, . = uncut. */
export const CHRONICLE_FAMILY_STONES=Object.freeze({
 ASH:[
 '......#####......','....###+++###....','...##++...++##...','..##++.....++##..','..#++.......++#..',
 '.##+.........+##.','.#++.........++#.','##+...........+##','##+...........+##','.#++.........++#.',
 '.##+.........+##.','..#++.......++#..','..##++.....++##..','...##++...++##...','....###+++###....','......#####......'],
 IRON:[
 '..###.......###..','.##+##.....##+##.','##+++##...##+++##','#+#..+##### +..#+#','##+..+##### +..+##',
 '.#+...+###+...+#.','.#+...+###+...+#.','.##+...###+..+##.','..#+...###+..+#..','..#+...###+..+#..',
 '.##+...###+..+##.','.#+...+###+...+#.','.##+..#####..+##.','##+++##...##+++##','.#++##.....##++#.','..###.......###..'],
 ROOT:[
 '#.......#.......#','##......#......##','.##.....#.....##.','..##....#....##..','...##...#...##...',
 '....##..#..##....','.....##.#.##.....','.......###.......','#####..###..#####','.......###.......',
 '.....##.#.##.....','....##..#..##....','...##...#...##...','..##....#....##..','.##.....#.....##.','##......#......##'],
 SPIRIT:[
 '.......###.......','......#+++#......','.....#++#++#.....','....#++#.#++#....','...#++#...#++#...',
 '..#++#.....#++#..','.#++#.......#++#.','##+#.........#+##','##+#.........#+##',
 '.#++#.......#++#.','..#++#.....#++#..','...#++#...#++#...','....#++#.#++#....','.....#++#++#.....','......#+++#......','.......###.......'],
 FATE:[
 '##.............##','+##...........##+','.+##.........##+.','..+##.......##+..','...+##.....##+...',
 '....+##...##+....','.....+##.##+.....','......+###+......','......+###+......','.....+##.##+.....',
 '....+##...##+....','...+##.....##+...','..+##.......##+..','.+##.........##+.','+##...........##+','##.............##']
});
/** Five truly different mythic pictograms; each family embeds its own episode. */
export const CHRONICLE_EPISODES=Object.freeze([
 [
 '....#....','...###...','..#+#++..','.##+#+##.','###++###.','.##+#+##.','..#+#++..','...###...','....#....'
 ],
 [
 '#.......#','##.....##','#+#...#+#','##+#.#+##','.#++#++#.','##+#.#+##','#+#...#+#','##.....##','#.......#'
 ],
 [
 '....#....','...###...','..##+##..','###+++###','..#+++#..','###+++###','..##+##..','...###...','....#....'
 ],
 [
 '###...###','#+##.##+#','##+#+##+#','..##+##..','###+++###','..##+##..','##+#+##+#','#+##.##+#','###...###'
 ],
 [
 '#.#.#.#.#','.#.#.#.#.','###...###','..##+##..','###+++###','..##+##..','###...###','.#.#.#.#.','#.#.#.#.#'
 ]
]);
export const CHRONICLE_STONE_INKS=Object.freeze({
 ASH:['#111a1a','#765543','#b28761'],
 IRON:['#111c21','#536875','#96aba5'],
 ROOT:['#101b1b','#416b58','#80a08b'],
 SPIRIT:['#151926','#5c6883','#a1a9bd'],
 FATE:['#1d1b17','#7e714f','#bda878']
} as const);
type G=CanvasRenderingContext2D;
function carve(g:G,pattern:readonly string[],x:number,y:number,unit:number,low:string,hi:string){
 for(let row=0;row<pattern.length;row++)for(let col=0;col<(pattern[row]?.length??0);col++){
  const c=pattern[row]![col];if(c==='.'||c===' ')continue;
  g.fillStyle=c==='#'?low:hi;
  g.fillRect(x+col*unit,y+row*unit,unit,unit);
 }
}
/** Visual bounding box: near [W/2-29,W/2+29] × [H*.69-25,H*.69+24].
 * Does not create an interactable-looking bright halo, label, or beam. */
export function paintChronicleFloor(g:G,W:number,H:number,family:ChronicleFamily,serial:number,reducedMotion=false):void{
 const fi=CHRONICLE_FAMILIES.indexOf(family),chapter=serial%5;
 if(fi<0||!Number.isSafeInteger(serial)||serial<0||serial>=25||Math.floor(serial/5)!==fi||
 ![W,H].every(Number.isFinite)||W<240||H<148)throw new RangeError('Invalid canonical floor chronicle');
 const [shadow,cut,light]=CHRONICLE_STONE_INKS[family];
 const cx=Math.round(W*.5),cy=Math.round(H*.69);
 g.save();
 // Scarred basalt inset is always below actors and fully stationary in reduced
 // motion. Low alpha is an intentional distinction from real telegraphs.
 g.globalAlpha=.57;
 g.fillStyle=shadow;g.fillRect(cx-27,cy-23,54,46);
 g.fillStyle=cut;g.fillRect(cx-25,cy-21,50,42);
 g.fillStyle=shadow;g.fillRect(cx-23,cy-19,46,38);
 carve(g,CHRONICLE_FAMILY_STONES[family],cx-17,cy-16,2,cut,light);
 g.fillStyle=shadow;g.fillRect(cx-10,cy-10,20,20);
 carve(g,CHRONICLE_EPISODES[chapter]!,cx-9,cy-9,2,cut,light);
 // Five different notch constellations cut into the same physical plinth.
 // The progressive scars use shape *and position*, not color coding.
 for(let n=0;n<5;n++){
  const x=cx-22+n*11;
  g.fillStyle=n===chapter?light:cut;
  g.fillRect(x,cy-23,3,n===chapter?6:2);
  g.fillRect(x,cy+21-(n===chapter?4:0),3,n===chapter?6:2);
 }
 // Four displaced chipped corners create grounded material depth without
 // high contrast circles that could be mistaken for attack danger zones.
 for(const [dx,dy] of [[-25,-21],[22,-21],[-25,19],[22,19]]){
  g.fillStyle=shadow;g.fillRect(cx+dx,cy+dy,3,3);
 }
 g.restore();
 void reducedMotion;
}
