/** RUNEGRAVE 0.09.24 Gate A — seven original enemy weapon silhouettes.
 * Unlike successive outline overlays, this single weapon sprite is physically
 * articulated in four genuine encounter windup stages and uses one authored
 * material-coded sheet per enemy. No independent visual attack clock, no false
 * damage telegraphs, physics, AI, HUD, or input changes.
 */
import type {Enemy,EnemyKind} from '../enemies/encounters.js';
type G=CanvasRenderingContext2D;
export const WEAPON_SAGA_KINDS=['draugr','wisp','archer','charger','sentinel','shade','warden'] as const;
export const ENEMY_WEAPON_SHEETS=Object.freeze({
 draugr:[
 '...oo....oo..','..o##o..o##o.','..o###oo###o.','.o###++###o..','o###++##o....','o##+#o##o....','o##+#o##o....','.o##oo##o....','..o#..o#.....','...o..o......'
 ],
 wisp:[
 '......o......','.....o#o.....','....o#+#o....','...o#+o+#o...','..o#+o.o+#o..','.o#+o...o+#o.','..o+o...o+o..','...oo...oo...','...o.....o...','..o.......o..'
 ],
 archer:[
 '...ooo.......','..o##oo......','.o##++oo.....','o#o...o#o....','o#o...o#o....','o#o...o#o....','.o#o..o#o....','..o#oo#o.....','...o++o......','....oo.......'
 ],
 charger:[
 'oo.........oo','o##oo.....oo#o','o####o...o###o','.o##+#o.o#+##.','..o##+#o#+##o.','...o##++##o...','....o####o....','.....o##o.....','......oo......','......oo......'
 ],
 sentinel:[
 '......o......','..o..o#o..o..','..o#oo#oo#o..','o###++#++###o','o##++###++##o','o###++#++###o','..o#oo#oo#o..','..o..o#o..o..','......o......','......o......'
 ],
 shade:[
 '..ooo...ooo..','.o###o.o###o.','o##+#ooo#+##o','o#+#o...o#+#o','o##o.....o##o','o#o.......o#o','o#o.......o#o','.oo.......oo.','..o.......o..','...o.....o...'
 ],
 warden:[
 'ooo.......ooo','o##oo.....oo#o','o###oo...oo##o','o##++oo.oo+##o','.o###o#o#o###.','..o##++#++##o.','...o###o###o..','....o##o##o...','.....o###o....','......ooo.....'
 ]
});
export const WEAPON_SAGA_PALETTES=Object.freeze({
 draugr:{o:'#1a302d','#':'#6b9385','+':'#ecd4ac'},
 wisp:{o:'#1c4659','#':'#85cbd3','+':'#e6ffff'},
 archer:{o:'#27273b','#':'#ad95a9','+':'#f8dda3'},
 charger:{o:'#332d28','#':'#b48b67','+':'#ffe0aa'},
 sentinel:{o:'#1a3741','#':'#87ada5','+':'#f1edc4'},
 shade:{o:'#241f35','#':'#9e8dbd','+':'#f5e8ff'},
 warden:{o:'#1d322c','#':'#77977a','+':'#f2c792'}
} as const);
export type WeaponPose=Pick<Enemy,'kind'|'state'|'windup'|'phase'|'flash'>;
export function enemyWeaponStage(e:WeaponPose):0|1|2|3 {
 if(!Number.isFinite(e.windup))throw new RangeError('Invalid weapon countdown');
 if(e.state==='charge')return 3;
 if(e.state!=='warning')return 0;
 const w=Math.max(0,e.windup);
 return (w>.65?0:w>.42?1:w>.20?2:3) as 0|1|2|3;
}
function strokeSheet(g:G,rows:readonly string[],x:number,y:number,color:Record<string,string>):void{
 for(let row=0;row<rows.length;row++){
  const line=rows[row]??'';
  for(let col=0;col<line.length;){
   const s=line[col]??'.';
   if(s==='.') {col++;continue;}
   const fill=color[s];
   if(!fill)throw new Error('Unrecognized authored weapon ink '+s);
   let end=col+1;
   while(end<line.length&&line[end]===s)end++;
   g.fillStyle=fill;g.fillRect(Math.round(x+col*2),Math.round(y+row*2),(end-col)*2,2);
   col=end;
  }
 }
}
/** Drawn inside the existing world-space enemy translation, before the face
 * visor. With reduced motion, a given real windup state is geometrically still.
 * The only motion is actual state progression through four legible poses.
 */
export function paintEnemySagaWeapon(g:G,e:WeaponPose,time:number,reducedMotion=false):void{
 if(!Number.isFinite(time)||!WEAPON_SAGA_KINDS.includes(e.kind)||
 !Object.hasOwn(ENEMY_WEAPON_SHEETS,e.kind))throw new RangeError('Invalid hostile saga weapon');
 if(e.state!=='warning'&&e.state!=='charge')return;
 const frame=enemyWeaponStage(e),weapon=ENEMY_WEAPON_SHEETS[e.kind];
 const ink=WEAPON_SAGA_PALETTES[e.kind];
 const extension=[0,2,5,8][frame]??0;
 const boss=e.kind==='warden',charger=e.kind==='charger';
 // A deliberate lean towards the actual stroke on successive windup frames.
 // Position is cosmetic; all attack endpoints are still owned by runeWarning.
 const left=(boss||charger?-13:9)+extension;
 const top=(boss?-35:-24)-(frame>=2?2:0);
 g.save();
 strokeSheet(g,weapon,left,top,ink);
 // A physical band, split rivet, and last-frame fang change geometry at each
 // phase. No fake glow ring or impact target appears under the player.
 g.fillStyle=ink['#'];
 g.fillRect(left+5,top+19,4+frame*2,3);
 if(frame>=1){
  g.fillStyle=ink['+'];g.fillRect(left+3,top+1-frame*2,3,3);
 }
 if(frame>=2){
  g.fillStyle=ink.o;g.fillRect(left+23,top+9,2+frame,6);
 }
 if(frame===3){
  g.fillStyle=ink['+'];g.fillRect(left+26,top+5,3,5);
  g.fillRect(left+28,top+2,2,3);
 }
 if(boss&&e.phase===2){
  g.fillStyle=ink['+'];
  g.fillRect(left-5,top-8,5,12);
  g.fillRect(left+22,top-10,5,11);
  g.fillRect(left+26,top-12,3,4);
 }
 if(e.flash>0){
  // Only an actual hit fracture, not periodic sparkle while idle.
  g.fillStyle=ink['+'];g.fillRect(left+8,top+3,3,3);
 }
 g.restore();
 void reducedMotion;
}
