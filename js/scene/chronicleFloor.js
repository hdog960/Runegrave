/** Gate A v0.09.22 — original etched stone chronicles, 25 authored scenes.
 * A legible, deliberately low-contrast floor-inlay beneath combat.
 * Five independently designed material contours × five narrative episodes;
 * the canonical fs-XX ID rather than visit order selects the picture.
 * This painter is only world canvas decoration: never a collision, door,
 * collectable, enemy, spell, hazard ring or touch target.
 */

export const CHRONICLE_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'];
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
/** Twenty-five individually cut fracture fingerprints, not tinted repetitions.
 * 3–4 short scars each; only in the existing inert 56×50px floor inlay. */
export const SAGA_WEAR_MARKS=Object.freeze({
 ASH:[
  [[-22,-16,4,2],[-19,-14,2,5],[-15,-8,4,2]],
  [[16,-19,5,2],[13,-17,3,5],[19,-12,2,4]],
  [[-19,13,5,2],[-15,15,2,6],[-9,17,4,2]],
  [[17,12,4,2],[15,14,2,6],[10,18,5,2]],
  [[-23,-2,6,2],[19,0,5,2],[-21,3,2,5]]
 ],
 IRON:[
  [[-23,-18,2,7],[-20,-14,6,2],[19,16,2,5]],
  [[20,-17,2,6],[14,-14,6,2],[-18,15,4,2]],
  [[-19,18,9,2],[-13,14,2,4],[20,-6,2,4]],
  [[14,18,8,2],[18,12,2,6],[-22,-3,2,6]],
  [[-24,-2,7,2],[18,0,6,2],[-14,-18,3,3]]
 ],
 ROOT:[
  [[-21,-17,3,6],[-18,-14,5,2],[-14,-10,2,5]],
  [[18,-18,3,5],[14,-15,6,2],[12,-12,2,5]],
  [[-20,15,5,2],[-16,12,2,6],[-12,10,4,2]],
  [[18,15,4,2],[14,12,4,2],[13,9,2,6]],
  [[-24,-1,5,2],[-21,1,3,5],[19,-3,5,2]]
 ],
 SPIRIT:[
  [[-22,-16,5,2],[-19,-13,2,5],[16,15,3,4]],
  [[18,-16,5,2],[16,-13,2,5],[-21,11,3,4]],
  [[-21,17,7,2],[-16,13,2,5],[17,-9,3,4]],
  [[15,16,7,2],[17,11,2,5],[-19,-9,3,4]],
  [[-23,-3,6,2],[19,-2,5,2],[-17,2,3,4]]
 ],
 FATE:[
  [[-21,-17,5,2],[-16,-15,2,5],[18,16,5,2]],
  [[18,-18,5,2],[16,-15,2,5],[-20,16,5,2]],
  [[-21,17,5,2],[-16,12,2,5],[18,-17,5,2]],
  [[17,17,5,2],[14,12,2,5],[-22,-18,5,2]],
  [[-24,-2,7,2],[17,-2,7,2],[-17,1,3,5]]
 ]
});
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
});

function carve(g,pattern,x,y,unit,low,hi){
 for(let row=0;row<pattern.length;row++)for(let col=0;col<(pattern[row]?.length??0);col++){
  const c=pattern[row][col];if(c==='.'||c===' ')continue;
  g.fillStyle=c==='#'?low:hi;
  g.fillRect(x+col*unit,y+row*unit,unit,unit);
 }
}
/** Visual bounding box: near [W/2-29,W/2+29] × [H*.69-25,H*.69+24].
 * Does not create an interactable-looking bright halo, label, or beam. */
export function paintChronicleFloor(g,W,H,family,serial,reducedMotion=false){
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
 carve(g,CHRONICLE_EPISODES[chapter],cx-9,cy-9,2,cut,light);
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
 // Individual material chips make all 25 story plinths visibly weathered,
 // without adding a false door, glowing pickup or telegraph circle.
 for(const piece of SAGA_WEAR_MARKS[family][chapter]){
  const [x=0,y=0,w=0,h=0]=piece;
  g.fillStyle=shadow;
  g.fillRect(cx+x,cy+y,w,h);
 }
 g.restore();
 void reducedMotion;
}
