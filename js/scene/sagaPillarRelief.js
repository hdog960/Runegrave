/** v0.09.25 Gate A — twin, authored Norse saga wall-piers, pure scenery.
 * 25 canonical room identities, no hitboxes, false loot, door clues or HUD.
 */
export const PIER_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'];
export const PIER_STONE=Object.freeze({
 ASH:['....##......','...####.....','..##++##....','.##++++##...','##++##++##..','##++##++##..','.##++++##...','..##++##....','...####.....','....##......'],
 IRON:['############','##++####++##','#++##++##++#','##++####++##','###++##++###','###++##++###','##++####++##','#++##++##++#','##++####++##','############'],
 ROOT:['#..........#','##........##','.##......##.','..##....##..','...##++##...','..##++++##..','.##++##++##.','##++#..#++##','##..#..#..##','#...#..#...#'],
 SPIRIT:['.....##.....','....#++#....','...#++++#...','..#++##++#..','.#++#..#++#.','.#++#..#++#.','..#++##++#..','...#++++#...','....#++#....','.....##.....'],
 FATE:['##........##','+##......##+','.+##....##+.','..+##..##+..','...+####+...','...+####+...','..+##..##+..','.+##....##+.','+##......##+','##........##']
});
export const PIER_SAGAS=Object.freeze([
 ['...#...','..###..','.##+##.','##+++##','..#+#..','..#+#..','...#...'],
 ['#.....#','##...##','#+#.#++','##+++##','.##+##.','..###..','...#...'],
 ['...#...','..###..','###+###','..#+#..','..#+#..','.##.##.','##...##'],
 ['.#####.','##+++##','#+#.#++','##+++##','.##+##.','..#+#..','...#...'],
 ['#.#.#.#','.#.#.#.','..###..','.##+##.','..###..','.#.#.#.','#.#.#.#']
]);
export const PIER_INK=Object.freeze({
 ASH:['#101b1d','#594038','#ab7250','#e7bd8b'],
 IRON:['#101b20','#3b545e','#91aaa7','#e1dac1'],
 ROOT:['#13211c','#375840','#88ae80','#d3e3ac'],
 SPIRIT:['#161b2e','#414a71','#9cadd2','#e4eff0'],
 FATE:['#1b211e','#705b3f','#bba06c','#f3dba3']
});
function px(g,x,y,w,h,ink){g.fillStyle=ink;g.fillRect(Math.round(x),Math.round(y),w,h);}
function stamp(g,rows,x,y,unit,dark,light){
 for(let r=0;r<rows.length;r++){
  const line=rows[r];
  for(let i=0;i<line.length;){
   const ch=line[i];if(ch==='.') {i++;continue;}
   let n=i+1;while(n<line.length&&line[n]===ch)n++;
   px(g,x+i*unit,y+r*unit,(n-i)*unit,unit,ch==='#'?dark:light);i=n;
  }
 }
}
/** Wall-only geometry x=11..55 and W-55..W-11; y=51..109.
 * In particular, no marks enter active mid-room enemy silhouettes.
 */
export function paintSagaPillars(g,W,H,family,serial){
 const fi=PIER_FAMILIES.indexOf(family);
 if(fi<0||![W,H].every(Number.isFinite)||W<240||H<148||
 !Number.isSafeInteger(serial)||serial<0||serial>=25||
 Math.floor(serial/5)!==fi)throw new RangeError('Invalid canonical saga pier');
 const chapter=serial%5,[voidInk,stone,edge,glint]=PIER_INK[family];
 g.save();g.globalAlpha=.66;
 for(const side of [-1,1]){
  const cx=side<0?33:W-33,y=56;
  px(g,cx-21,y+4,42,49,voidInk);px(g,cx-19,y+2,38,47,stone);
  px(g,cx-17,y+3,34,44,voidInk);px(g,cx-20,y,40,5,edge);
  px(g,cx-15,y-3,30,4,stone);px(g,cx-11,y-5,22,3,edge);
  stamp(g,PIER_STONE[family],cx-12,y+5,2,stone,edge);
  px(g,cx-11,y+13,22,24,voidInk);
  stamp(g,PIER_SAGAS[chapter],cx-7,y+17,2,edge,glint);
  const notch=chapter*3;
  px(g,cx-18+notch,y+1,4,3,glint);
  px(g,cx+13-notch,y+43,4,3,edge);
  px(g,cx-21,y+47,42,4,stone);px(g,cx-17,y+50,34,3,edge);
 }
 g.restore();
}
