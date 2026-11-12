/** v0.09.45: eight independently hand-authored 9×9 Norse relic
 * seal carvings, selected from the EIGHT EXISTING genuinely owned relic IDs.
 * Replace generic identical orbiting diamonds, do NOT create items, glow
 * hazards, health UI, combat powers, input targets, or new timers.
 */
import {RELIC_CRESTS} from './relicCrests.js';
export const EARNED_SEAL_IDS=['wyrd-fang','skald-drum','storm-feather','hugin-lens','ash-anchor','shieldroot','eir-thread','raven-hoard'];
export const EARNED_SEAL_CARVINGS=Object.freeze({"wyrd-fang":["oo.....oo","o#o...o#o",".##o.o##.","..#o.o#..","..##.##..","...###...","...#+#...","...#+#...","....o...."],"skald-drum":["..ooooo..",".o#####o.","o#o...o#o","o#o+++o#o","o##+++##o","o#o+++o#o","o#o...o#o",".o#####o.","..ooooo.."],"storm-feather":[".......oo","......o#o",".....o#+o","....o##o.","...o##o..","..o##o...","..##o....",".##o.....","o#o......"],"hugin-lens":["..ooooo..",".o##+##o.","o##ooo##o","o#o...o#o","o+o#+#o+o","o#o...o#o","o##ooo##o",".o##+##o.","..ooooo.."],"ash-anchor":["....o....","...o#o...","...o+o...","...o#o...","o..o#o..o","o#.o#o.#o",".o####+o.","..o###o..","...ooo..."],"shieldroot":[".ooooooo.","o###+###o","o#o###o#o","o##o#o##o",".o#o#o#o.","..o###o..","...o#o...","....#....","....o...."],"eir-thread":["..oo.oo..",".o##o##o.","o#+o.o+#o","o#o...o#o",".o#ooo#o.","..o#+#o..",".o#ooo#o.","o#o...o#o",".ooo.ooo."],"raven-hoard":[".oo...oo.","o##o.o##o","o#+#o#+#o",".o##o##o.","..oo#oo..","..o#+#o..",".o#####o.","o#ooooo#o",".ooooooo."]});
export const EARNED_SEAL_FRAME_SIZE=12;
const px=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
/** Draw one true earned seal in the PRE-EXISTING floating position only.
 * Body 12×12 exactly; no misleading outer ring, collision or HUD.
 */
export function paintEarnedRelicSeal(g,id,x,y){
 if(!Object.hasOwn(EARNED_SEAL_CARVINGS,id)||!Number.isFinite(x+y))throw new RangeError('Relic seal requires authentic owned relic and world coordinates');
 const rows=EARNED_SEAL_CARVINGS[id],col=RELIC_CRESTS[id].color;
 const X=Math.round(x)-6,Y=Math.round(y)-6;
 g.save();
 px(g,X,Y,12,12,'#091b20');
 px(g,X+1,Y+1,10,10,'#1e3433');
 px(g,X+1,Y+1,10,1,'#6d8577');
 px(g,X+1,Y+10,10,1,'#0d2529');
 for(let row=0;row<9;row++){
  const line=rows[row];
  for(let i=0;i<9;){
   const ch=line[i];
   if(ch==='.') {i++;continue;}
   let j=i+1;while(j<9&&line[j]===ch)j++;
   px(g,X+1+i,Y+1+row,j-i,1,ch==='o'?'#102126':ch==='+'?'#fff0c1':col);
   i=j;
  }
 }
 g.restore();
}
