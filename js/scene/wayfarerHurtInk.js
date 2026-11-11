/** v0.09.29: real Mortal Heart grace produces 8 directional inked armour
 * fracture patterns, replacing body pixels instead of disappearing the hero.
 * No collision, i-frame, HP, timer, input or overlay changes.
 */
export const WAYFARER_HURT_MASKS=Object.freeze({"N":["#.....#",".#...#.","..#.#..",".#...#.","#.....#"],"NE":["......#","....##.","...#...","..##...",".#....."],"E":["#......","##.....",".#.....","..#....","...#..."],"SE":[".#.....","..##...","....#..","...##..","......#"],"S":["..###..",".#...#.","#.....#",".#.#.#.","..###.."],"SW":[".....#.","...##..","..#....","...#...","#......"],"W":["......#",".....##",".....#.","....#..","...#..."],"NW":["#......",".##....","...#...","....##.","......#"]});
export function inkedWayfarerHurtBody(base,facing,grace){
 if(!Number.isFinite(grace)||!Object.hasOwn(WAYFARER_HURT_MASKS,facing))throw new RangeError('Invalid Wayfarer damage ink');
 if(grace<=0)return base;
 const width=Math.max(...base.map(r=>r.length)),rows=WAYFARER_HURT_MASKS[facing];
 if(base.length<15||width<9)throw new RangeError('Wayfarer sprite too small');
 const left=Math.floor((width-7)/2),out=[...base];
 for(let y=0;y<5;y++){
  const ink=(base[9+y]??'').replace(/ /g,'.').padEnd(width,'.').split('');
  for(let x=0;x<7;x++)if(rows[y][x]==='#'&&ink[left+x]!=='.')ink[left+x]=grace>.55?'e':'w';
  out[9+y]=ink.join('');
 }
 return out;
}
