/** v0.09.28: seven genuinely different original 9×5 impact fractures.
 * Replaces existing pixels on the ONE actual hostile body on a real damage
 * event. No independent timer, floating flare, fake warning or hitbox.
 */
export const SAGA_DAMAGE_FRACTURES=Object.freeze({
 "draugr": [
  "#........",
  ".##......",
  "..#.#....",
  "...##....",
  "....#...."
 ],
 "wisp": [
  "....#....",
  "...#.#...",
  "..#...#..",
  ".#.....#.",
  "#.......#"
 ],
 "archer": [
  ".......#.",
  ".....##..",
  "...##....",
  "..#......",
  ".#......."
 ],
 "charger": [
  "#.......#",
  ".#.....#.",
  "..##.##..",
  "...###...",
  "....#...."
 ],
 "sentinel": [
  "...###...",
  "..#...#..",
  ".#.#.#.#.",
  "..#...#..",
  "...###..."
 ],
 "shade": [
  "#.#...#.#",
  ".#.#.#.#.",
  "..#.#.#..",
  ".#.#.#.#.",
  "#.#...#.#"
 ],
 "warden": [
  "#.......#",
  "##.....##",
  ".##...##.",
  "..#####..",
  "...###..."
 ]
});
const SCAR_AT=Object.freeze({draugr:8,wisp:5,archer:8,charger:6,sentinel:5,shade:6,warden:10});
export function inkedImpactBody(base,kind,flash){
 if(!Object.hasOwn(SAGA_DAMAGE_FRACTURES,kind)||!Number.isFinite(flash))throw new RangeError('Unknown authentic damage sculpture');
 if(flash<=0)return base;
 const lines=SAGA_DAMAGE_FRACTURES[kind],at=SCAR_AT[kind];
 const width=Math.max(...base.map(x=>x.length));
 if(width<9||at+lines.length>base.length)throw new RangeError('Invalid damage sprite dimensions');
 const left=Math.floor((width-9)/2),out=[...base];
 for(let y=0;y<5;y++){
  const row=(base[at+y]??'').replace(/ /g,'.').padEnd(width,'.').split('');
  for(let x=0;x<9;x++)if(lines[y][x]==='#'&&row[left+x]!=='.')
   row[left+x]=flash>.10?'r':'e';
  out[at+y]=row.join('');
 }
 return out;
}
