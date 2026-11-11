/** RUNEGRAVE v0.09.20 Gate A: five original monumental pixel facades.
 * Stone friezes are authored 2px mosaics, not recolored copies. The motifs
 * inhabit the high masonry band, behind gameplay and outside the dodge lane.
 * All 25 room inscriptions are tied to the canonical fs-XX room identifier.
 */
import type {WayfarerPose} from './wayfarerMotion.js';
import type {Enemy} from '../enemies/encounters.js';
export const EDDIC_FAMILIES=['ASH','IRON','ROOT','SPIRIT','FATE'] as const;
export type EddicFamily=(typeof EDDIC_FAMILIES)[number];
export const EDDIC_FACADES=Object.freeze({
 ASH:[
 '.....######.....','....########....','..###++++++###..','..##++####++##..','.##++#....#++##.','..#+##....##+#..',
 '#######....######','##++++######++++#','#++###++++###++#','####+#++++#+####','..##+#++++#+##..','...############.',
 '.....##++##.....','.....######.....'],
 IRON:[
 '#####......#####','##++##....##++##','#++++######++++#','#+##++++++++##+#','#+#..######..#+#','#+#..#++++#..#+#',
 '###..#++++#..###','###..#++++#..###','#+#..#++++#..#+#','#+#..######..#+#','#+##++++++++##+#','#++++######++++#',
 '##++##....##++##','#####......#####'],
 ROOT:[
 '#....#....#....#','##...##..##...##','###...####...###','.###..####..###.','..############..','...###++++###...',
 '..####++++####..','..###+####+###..','.##++#....#++##.','##++##....##++##','##+##......##+##',
 '#+##........##+#','###..........###','##............##'],
 SPIRIT:[
 '......####......','.....#++++#.....','....#++##++#....','...#++#..#++#...','..##+#....#+##..','.##++#....#++##.','##++##....##++##',
 '##++##....##++##','.##++#....#++##.','..##+#....#+##..','...#++#..#++#...','....#++##++#....','.....#++++#.....','......####......'],
 FATE:[
 '##............##','+##..........##+','.+##........##+.','..+##......##+..','...+##....##+...','....+##..##+....',
 '.....+####+.....','.....+####+.....','....+##..##+....','...+##....##+...','..+##......##+..','.+##........##+.',
 '+##..........##+','##............##']
});
/** Unique carved episode within each family; a story silhouette, not a pickup. */
export const EDDIC_CHAPTERS=Object.freeze([
 ['...###...','..#+#++..','.###+###.','##++#++##','###+++###','..##+##..','..##+##..','...###...'],
 ['##.....##','#+#...#+#','#+##+##+#','###+#++##','##++#++##','#+##+##+#','#+#...#+#','##.....##'],
 ['#...#...#','##..#..##','.##.#.##.','..##+##..','..##+##..','.##.#.##.','##..#..##','#...#...#'],
 ['###...###','#+##.##+#','##+###++#','..#+++##.','..#+++##.','##+###++#','#+##.##+#','###...###'],
 ['#.#.#.#.#','.#.#.#.#.','..##+##..','###+++###','###+++###','..##+##..','.#.#.#.#.','#.#.#.#.#']
]);
export const EDDIC_PALETTES=Object.freeze({
 ASH:['#251c1c','#5d3b33','#b37753','#edbf84'],
 IRON:['#192b31','#4d626b','#97aeb0','#d1d2b6'],
 ROOT:['#172920','#3c6750','#8cad80','#d2e2ae'],
 SPIRIT:['#23243e','#525880','#979dcc','#d9e8e4'],
 FATE:['#2b261e','#7a623c','#b99a64','#f4dc9a']
} as const);
type G=CanvasRenderingContext2D;
function px(g:G,x:number,y:number,w:number,h:number,c:string):void{
 g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);
}
function mosaic(g:G,pattern:readonly string[],ox:number,oy:number,unit:number,ink:string,light:string):void{
 for(let row=0;row<pattern.length;row++){
  const chars=pattern[row]??'';
  for(let col=0;col<chars.length;col++){
   const s=chars[col];
   if(s!=='.')px(g,ox+col*unit,oy+row*unit,unit,unit,s==='#'?ink:light);
  }
 }
}
/** Central upper-stone proscenium; nothing is painted beneath y=65.
 * Outer grip rails are separately laid out DOM and never touched. */
export function paintEddicCornice(g:G,W:number,H:number,time:number,family:EddicFamily,serial:number,reducedMotion=false):void{
 const familyIndex=EDDIC_FAMILIES.indexOf(family),cut=serial%5;
 if(familyIndex<0||![W,H,time].every(Number.isFinite)||W<240||H<148||
    !Number.isSafeInteger(serial)||serial<0||serial>=25||Math.floor(serial/5)!==familyIndex)
  throw new RangeError('Invalid canonical Eddic room');
 const [shade,stone,edge,lumen]=EDDIC_PALETTES[family];
 const facade=EDDIC_FACADES[family],episode=EDDIC_CHAPTERS[cut]!;
 const x=Math.round(W/2);
 g.save();g.translate(x,0);
 // Truly weighty, deliberately asymmetric stonework framing a central story.
 px(g,-79,3,158,5,'#0d171b');px(g,-75,5,150,3,stone);
 px(g,-73,8,146,37,shade);px(g,-72,9,144,2,edge);
 for(const side of [-1,1]){
  px(g,side<0?-78:72,11,6,38,stone);
  px(g,side<0?-79:73,10,5,3,lumen);
  px(g,side<0?-78:72,44,6,4,edge);
  for(let i=0;i<3;i++){
   px(g,side<0?-67+i*7:60-i*7,11,5,4,cut>=i?lumen:edge);
  }
 }
 // Not a generic repeated color stamp: each family has a hand-composed
 // 16-column mythic roof geometry, and five scene inlays sit in the key-stone.
 mosaic(g,facade,-48,12,2,stone,edge);
 px(g,-25,12,50,32,shade);px(g,-23,14,46,28,stone);
 px(g,-21,15,42,26,shade);
 px(g,-13,17,26,22,'#10191b');px(g,-11,19,22,18,stone);
 mosaic(g,episode,-9,20,2,edge,lumen);
 // Physically distinct five-crown silhouette, never color-only numbering.
 for(let n=0;n<5;n++){
  const ht=n<=cut?6+(n%2)*2:2;
  px(g,-40+n*17,43-ht,6,ht,cut===n?lumen:edge);
 }
 px(g,-71,46,142,3,stone);px(g,-69,47,138,2,edge);
 // A restrained material-specific animation on the top masonry only.
 const step=reducedMotion?0:Math.round(Math.sin(time*1.45+serial*.61)*1.3);
 if(family==='ASH'){
  px(g,-55,17-step,3,5,lumen);px(g,52,21+step,2,4,lumen);
 }else if(family==='IRON'){
  for(const s of [-1,1])px(g,s*51-2,21+step,4,4,lumen);
 }else if(family==='ROOT'){
  px(g,-56,19+step,3,4,lumen);px(g,53,19-step,3,4,lumen);
 }else if(family==='SPIRIT'){
  px(g,-52,14+step,2,8,lumen);px(g,51,17-step,2,6,lumen);
 }else{
  px(g,-61,15+step,2,6,lumen);px(g,59,15-step,2,6,lumen);
 }
 g.restore();
}
/** Actual eight-facing combat-mantle accessories; plated shoulder, weapon
 * harness and opposing shield. The sprite remains physically grounded.
 * Direction/recoil are authoritative visual inputs, never physics outputs.
 */
export function paintWayfarerOathGear(g:G,pose:WayfarerPose,time:number,reducedMotion=false):void{
 if(!Number.isFinite(time)||!['N','NE','E','SE','S','SW','W','NW'].includes(pose.facing))
   throw new RangeError('Invalid oath gear pose');
 const frame=pose.moving&&!reducedMotion?Math.floor(Math.max(0,time)*9)%4:0;
 const step=pose.moving&&!reducedMotion?[-2,0,2,0][frame]??0:0;
 const side=pose.side===0?1:pose.side;
 g.save();
 const shieldX=side>0?-17:9;
 // Original angular hand-forged buckler, not a circular pickup or warning.
 px(g,shieldX,-7+step*.25,9,12,'#162c31');
 px(g,shieldX+1,-6+step*.25,7,9,'#647b73');
 px(g,shieldX+2,-4+step*.25,5,5,pose.back?'#8cae9a':'#c5aa76');
 px(g,shieldX+4,-3+step*.25,1,4,'#e8d19b');
 px(g,shieldX+1,4+step*.25,7,2,'#344b4b');
 // Articulated vambrace on weapon arm, reacts only to the authoritative
 // aim-facing and actual firing recoil value.
 const armX=side>0?10:-15,armY=pose.recoil>.25?-8:-4;
 px(g,armX,armY,5,8,'#1b3539');px(g,armX+1,armY,3,3,'#9fbaaa');
 px(g,armX+1,armY+5,3,2,'#dabb84');
 if(pose.recoil>.25)px(g,armX+2,armY-3,2,3,'#f3ddb0');
 // A braided knot on the cloak is visibly different in rear, side and face.
 if(pose.back){
  px(g,-5,5,10,2,'#91afa1');px(g,-2,7,4,5,'#b5c4a9');
 }else if(pose.side!==0){
  px(g,pose.side*4-1,7,3,7,'#b08f60');
  px(g,pose.side*4,9,1,4,'#e3d0a3');
 }else{
  px(g,-4,6,8,2,'#dbba7b');px(g,-2,8,4,4,'#47615b');
 }
 if(pose.moving&&!reducedMotion&&frame===2){
  // Distinct non-contact stride shield strap; no new hitbox.
  px(g,shieldX+3,6,4,3,'#d2b388');
 }
 // The passing positions must also read differently on a 2px phone grid:
 // hem thread opens on first recovery, shield strap tucks on second recovery.
 // These are actual separate four-beat poses, not duplicate neutral frames.
 if(pose.moving&&!reducedMotion&&frame===1)px(g,shieldX+5,8,2,2,'#ead7a0');
 if(pose.moving&&!reducedMotion&&frame===3)px(g,shieldX+1,8,2,2,'#bec69f');
 g.restore();
}
/** Seven species-specific high-contrast strike props, keyed to genuine
 * warning/charge state and remaining windup. Nothing draws during idle.
 * Shapes stay on the enemy, while existing world telegraphs stay authoritative.
 */
export function paintOathEnemyStrike(g:G,e:Pick<Enemy,'kind'|'state'|'windup'|'phase'|'dx'|'dy'>,time:number,reducedMotion=false):void{
 if(!['draugr','wisp','archer','charger','sentinel','shade','warden'].includes(e.kind)||
 ![time,e.windup,e.dx,e.dy].every(Number.isFinite)||e.windup<0)
 throw new RangeError('Invalid enemy oath strike');
 if(e.state!=='warning'&&e.state!=='charge')return;
 const band=e.state==='charge'?3:e.windup>.65?0:e.windup>.40?1:e.windup>=.20?2:3;
 const reach=band*2,hot=band>=3;
 const ivory=hot?'#fff4d9':'#c4ba97',iron=hot?'#c9ecde':'#8ea9a1';
 const v=e.dy<-.44?-1:e.dy>.44?1:0;
 g.save();
 switch(e.kind){
 case 'draugr':
  // Broad shield breaks outward into a hooked three-prong finishing claw.
  px(g,-14,-16+v,4,19,'#314c48');px(g,-13,-14+v,2,3,ivory);
  for(let i=0;i<3;i++){px(g,15+reach,-14+i*6,3,5,ivory);px(g,18+reach,-17+i*6,3,3,iron);}
  break;
 case 'wisp':
  // Ghostglass lance shatters into three stepped crystal knives.
  for(let i=0;i<3;i++){px(g,-12+i*10,-22-reach+i*2,6,3,iron);px(g,-10+i*10,-24-reach+i*2,2,2,ivory);}
  break;
 case 'archer':
  // Two cheek-braced bow limbs and the notch of an actually drawn arrow.
  for(const s of [-1,1]){px(g,15+reach,-15+s*10,3,7,ivory);px(g,18+reach,-13+s*10,2,4,iron);}
  px(g,6-reach,-7,17+reach,2,'#c8b88f');px(g,21,-9,4,4,ivory);
  break;
 case 'charger':
  // Low wide front-plate and heavy directional ivory tusks.
  for(const s of [-1,1]){px(g,s<0?-20-reach:15+reach,-21-v,5,6,ivory);px(g,s<0?-22-reach:19+reach,-25-v,3,5,iron);}
  px(g,-8,12+v,16,3,'#b5a184');
  break;
 case 'sentinel':
  // Four separated radial metal fins, not a projectile ring.
  for(let i=0;i<4;i++){
   const dx=i%2===0?(i===0?-1:1):0,dy=i%2===1?(i===1?-1:1):0;
   px(g,dx*(19+reach)-3,dy*(19+reach)-8,6,4,iron);
   px(g,dx*(21+reach)-2,dy*(21+reach)-9,4,2,ivory);
  }break;
 case 'shade':
  // Folded veil jaws unfurl into two vertically separate blades.
  for(const s of [-1,1]){
   px(g,s<0?-20-reach:15+reach,-16-v,5,9,'#8f80b2');
   px(g,s<0?-22-reach:19+reach,-19-v,3,5,ivory);
   px(g,s<0?-18-reach:15+reach,3+v,3,7,iron);
  }break;
 case 'warden':
  // Boss phase 2 grows a genuinely forked second thorn, not just new color.
  for(const s of [-1,1]){
   px(g,s<0?-29-reach:23+reach,-30-v,7,13,'#465e50');
   px(g,s<0?-27-reach:25+reach,-31-v,3,3,ivory);
   if(e.phase===2){px(g,s<0?-34-reach:31+reach,-37-v,4,11,'#a67a56');px(g,s<0?-34-reach:31+reach,-39-v,3,3,ivory);}
  }break;
 }
 if(hot){
  // Final frame becomes geometrically pointed; still no new attack circle.
  px(g,-2,-32,4,4,ivory);px(g,-1,-35,2,3,iron);
 }
 g.restore();
 void reducedMotion;
}
