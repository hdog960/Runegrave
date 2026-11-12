/** v0.09.42: original non-interactive paired masonry at extreme lower
 * corners, keyed to authentic fs-01..fs-25 canonical identity, never mini-run
 * order. No physics, player input, HUD, projected attack or timer. */
export const THRESHOLD_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'];
export const THRESHOLD_CRESTS=Object.freeze({"ASH":["..#.....#..",".###...###.","##+##.##+##","#++##.##++#","#+++###+++#",".##+++++##.","..##+++##..","...##+##...","..##...##..",".##.....##.","##.......##"],"IRON":["###########","##...#...##","#.#.###.#.#","#...#+#...#","###.#+#.###",".#..#+#..#.","###.#+#.###","#...#+#...#","#.#.###.#.#","##...#...##","###########"],"ROOT":["#.........#",".#...#...#.","..#..#..#..","...##+##...","..###++#...","###++#++###","...#++###..","...##+##...","..#..#..#..",".#...#...#.","#.........#"],"SPIRIT":["....###....","...#+#++...","..#++#++#..",".#++#.#++#.","##+.#.#.+##",".#++#.#++#.","..#++#++#..","...++#+#...","....###....","...#...#...","..#.....#.."],"FATE":["##.......##",".##.....##.","..##...##..","...##.##...","....#+#....","##+++#+++##","....#+#....","...##.##...","..##...##..",".##.....##.","##.......##"]});
export const THRESHOLD_EPISODES=Object.freeze([["##...##","#.#.#.#","..#+#..","..###..","..#+#..","#.#.#.#","##...##"],["...#...","..###..",".##+##.","##+++#.","..#+#..",".##.##.","#.....#"],["#.....#",".#...#.","..#.#..","...+...","..#.#..",".#...#.","#.....#"],["##.#.##",".##+##.","..#+#..","###.###","..#+#..",".##+##.","##.#.##"],["#..#..#",".#.#.#.","..#+#..","##+++#.","..#+#..",".#.#.#.","#..#..#"]]);
export const THRESHOLD_STONES=Object.freeze({
ASH:{shadow:'#1a1c1e',stone:'#574139',rim:'#97715a',glint:'#e7b47a'},
IRON:{shadow:'#14232a',stone:'#394b53',rim:'#829c9c',glint:'#d4cbb8'},
ROOT:{shadow:'#16251c',stone:'#34513b',rim:'#87a07b',glint:'#d1dab0'},
SPIRIT:{shadow:'#1a2034',stone:'#39486b',rim:'#8c9ac4',glint:'#d2e5ec'},
FATE:{shadow:'#27231d',stone:'#66563e',rim:'#bea26b',glint:'#f2ddaa'}
});
export const THRESHOLD_PANEL_WIDTH=40,THRESHOLD_PANEL_HEIGHT=78;
export function thresholdIdentity(family,serial){
 const n=THRESHOLD_FAMILIES.indexOf(family);
 if(n<0||!Number.isSafeInteger(serial)||serial<0||serial>=25||Math.floor(serial/5)!==n)throw new RangeError('Unknown canonical room mural');
 return {family,serial,episode:serial%5};
}
export function thresholdPanels(W,H){
 if(!Number.isFinite(W)||!Number.isFinite(H)||W<240||H<160)throw new RangeError('Invalid lower-wall world');
 const y=Math.floor(H)-86;
 return [{x:6,y,side:'family'},{x:Math.floor(W)-46,y,side:'episode'}];
}
const rect=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
/** Pure static hand-pixeled family crest + chapter-tale knot, with
 * two fixed outer-edge 40×78 tablets. Render beneath enemy/hero/loot ink. */
export function paintThresholdReliefs(g,W,H,family,serial){
 const id=thresholdIdentity(family,serial);if(W<240||H<160)return;
 const ink=THRESHOLD_STONES[family];
 g.save();g.globalAlpha=.72;
 for(const tile of thresholdPanels(W,H)){
  const {x,y}=tile;
  rect(g,x,y,40,78,ink.shadow);rect(g,x+2,y+2,36,74,ink.rim);
  rect(g,x+4,y+4,32,70,ink.stone);rect(g,x+4,y+4,32,2,ink.glint);
  rect(g,x+6,y+68,28,3,ink.shadow);rect(g,x+7,y+72,26,2,ink.rim);
  for(const xx of [8,29]){rect(g,x+xx,y+7,3,3,ink.glint);rect(g,x+xx,y+63,3,3,ink.shadow);}
  const lines=tile.side==='family'?THRESHOLD_CRESTS[family]:THRESHOLD_EPISODES[id.episode];
  const dx=tile.side==='family'?9:13,dy=tile.side==='family'?13:20;
  for(let row=0;row<lines.length;row++)for(let col=0;col<lines[row].length;){
   const ch=lines[row][col]!;
   if(ch==='.') {col++;continue;}
   let end=col+1;while(end<lines[row].length&&lines[row][end]===ch)end++;
   rect(g,x+dx+col*2,y+dy+row*2,(end-col)*2,2,ch==='+'?ink.glint:ink.rim);
   col=end;
  }
  // Episode engraving, never combat HP, collectible or a route arrow.
  for(let k=0;k<=id.episode;k++)rect(g,x+7+k*5,y+58,3,3,ink.glint);
  if(tile.side==='family'){rect(g,x+15,y+43,10,4,ink.shadow);rect(g,x+17,y+45,6,2,ink.glint);}
  else{rect(g,x+11,y+13,18,3,ink.shadow);rect(g,x+13,y+15,14,2,ink.glint);}
 }
 g.restore();
}
