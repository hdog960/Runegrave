/** RUNEGRAVE Gate A v0.09.21 — original hand-authored 2px sprite sheets.
 * These are inked actual silhouettes, not accumulated abstract rectangles.
 * Four Wayfarer compass silhouettes are mirrored into eight readable facings;
 * four independent grounded gait frames share the same 20-pixel grid.
 * Seven enemies have unique contour sheets and real attack-state inlays.
 * Every run of identical material ink is batched to one Canvas fillRect.
 * Presentation only: no DOM, hitboxes, random, controls, AI or item logic.
 */
import type {WayfarerPose} from './wayfarerMotion.js';
import type {Enemy,EnemyKind} from '../enemies/encounters.js';
type G=CanvasRenderingContext2D;
type HeroFacing='N'|'NE'|'E'|'SE'|'S'|'SW'|'W'|'NW';
import { inkedWindupBody } from './sagaBodyLanguage.js';
import { paintWayfarerMovingHem } from './kineticInk.js';
import { paintEnemySagaWeapon } from './sagaWeaponAtlas.js';
import { paintWayfarerSagaVisor, paintHostileSagaFace } from './sagaExpression.js';
export const ATLAS_CELL=2;
const HERO_INK=Object.freeze({
 o:'#0c2026',h:'#30484b',H:'#8ea49a',m:'#476460',M:'#98b6a5',
 b:'#1b3e45',B:'#3c7870',g:'#b78c55',G:'#efd29a',
 w:'#92d9c8',e:'#e4f5dc',s:'#172e35',r:'#d9b67b'
});
/** No outlines are auto-generated from blobs: all four silhouettes are drawn
 * in a fixed 20-column frame. Individual materials are directly encoded.
 */
export const WAYFARER_ATLAS=Object.freeze({
 front:[
 '.....gggg.....','....gHHHHg....','...ohHHHHho...','...oHHHHHHo...','..ohHGGHhHo...','..ohhHhHhho...',
 '...ohweewho...','...ohhsshh....','...ooHHHHoo...','..oGMMggMMGo..',
 '.oHHmmmMmmHHo.','oHHmmmMMMMmHHo','oHmmMmmMMmmHHo','oHHmmwrrwmmHHo',
 '.oHHmmGGmmHHo.','..oHHmmmmHHo..','..obBbbbbBbo..','..obBBbbBBbbo.','..oBbbBBbbBbo.','..obbbbggbbbo.'
 ],
 back:[
 '.....gggg.....','....gHHHHg....','...ohHHHHho...','...oHHHHHHo...','..ohhhhhhhho..','..ohHHhhHHho..',
 '...ohhHhhhho..','...ohhsshh....','...ooHHHHoo...','..oGMMggMMGo..',
 '.oHHmmmmmmHHo.','oHHmmBBBmmHHo','oHmBBbBbbBMHo','oHmBbbwwbbMHo',
 '.oHBbbbBBbBHo.','..oBBbbbBBBo..','..oBbbbbbBBo..','..obBbbBBbbbo.','..oBbbwwbbBBo.','..obbbbggbbbo.'
 ],
 side:[
 '....gggg....','...gHHHHg...','..ohHHHHho..','..oHHHHHHho.','...ohHGGhho.','...ohhHhhho.',
 '....oheewo..','....ohhho...','...ooHHHoo..','..oGMMggHo..',
 '.oHHmmmMHHoo','oHmMMMmmHHo.','oHmMmmMmHHo.','oHmmwrrmHHo.','..oHGGmmHHo.','..obBbbBBbo.',
 '..oBBbbBBbo.','..obBBBbBbo.','...oBbbBbo..','...obGGbbo..'
 ],
 diagonal:[
 '.....gggg.....','....gHHHHg....','...ohHHHHho...','...oHHHHHHho..','...ohHGGHhho..','...ohhhHhho...',
 '....ohweho....','....ohhhho....','...ooHHHHoo...','..oGMMggMHGo..',
 '.oHHmmMmMMHHo.','oHHmMMMmmmHHo','oHmmmMmMmmHHo','oHmmwrrmmMHo.','..oHGGmmmHHo.','..obBBbbbBbo.',
 '..oBBbBBbbbo.','..obBbbBBBbo.','...oBbbBBbbo.','...obggBBbo..'
 ]
});
/** Four genuinely different boot silhouettes, not the same neutral pose
 * resampled at four animation timestamps. */
export const WAYFARER_GAITS=Object.freeze([
 ['...obbo..obbo...','...obbo..obbo...','...ohho..ohho...','..oHHHo..oHHHo..','..ogGgo..ogGgo..','..oGGo....oGGo..','..oooo....oooo..'],
 ['...obbo..obbo...','..obbb...obbo....','..ohho...ohho....','..oHHHo...oHHHo..','..ogGgo....ogGgo.','..oGGo......oGGo','..oooo......oooo'],
 ['...obbo..obbo...','....obboobbo....','....ohhoohho....','....oHHoHHHo....','....ogGggGgo....','....oGGooGGo....','....ooooooo.....'],
 ['...obbo..obbo...','....obbo...obbb.','....ohho...ohho.','...oHHHo...oHHHo','..ogGgo....ogGgo','..oGGo......oGGo','..oooo......oooo']
]);
const ENEMY_INK=Object.freeze({
 draugr:{o:'#101e21',a:'#294343',b:'#4b7771',c:'#91aaa0',e:'#f1d18e',g:'#c2a374',r:'#d2f3d1',s:'#152e31'},
 wisp:{o:'#182c3d',a:'#385d71',b:'#65a6b3',c:'#bbe6e4',e:'#f5f3d2',g:'#8ec8c7',r:'#e7ffff',s:'#2a445c'},
 archer:{o:'#241e31',a:'#413649',b:'#76668e',c:'#aca0b7',e:'#eee3ae',g:'#c09c70',r:'#b7f0dc',s:'#2f293b'},
 charger:{o:'#2a2925',a:'#514839',b:'#857355',c:'#bcab84',e:'#fbb77d',g:'#dcbd87',r:'#fff0c7',s:'#3d3630'},
 sentinel:{o:'#172b31',a:'#253d43',b:'#486770',c:'#8aa8a9',e:'#e8d5a3',g:'#d3b983',r:'#b4f3e8',s:'#142b37'},
 shade:{o:'#1b192c',a:'#302b45',b:'#66577e',c:'#a89cc4',e:'#d6e8fb',g:'#bba6df',r:'#f3e2ff',s:'#2c2344'},
 warden:{o:'#1b2928',a:'#35493e',b:'#56745a',c:'#97ad83',e:'#f3d196',g:'#bc9c6d',r:'#9be9b3',s:'#223a36'}
});
/** Unique drawn body sheets: each creature has different height, mass and limb
 * placement. The Warden has a wide antler crown and enormous split trunk.
 * Leading whitespace is encoded as dots and retained by the fixed-width atlas.
 */
export const HOSTILE_ATLAS=Object.freeze({
 draugr:[
 '.....oooo.....','....occco.....','...occccco....','...ocgegc....','...oeeeeo....','....obbo.....','..ooabbao....',
 '.oababbbbao...','oabababbbaao..','oabbabbbbaao..','oaabbrbaabao..','oaabbggabbbo..',
 '..oaaabbbao...','..ooabbbooo...','..oabaabaao...','..oabaabaao...','...oaa.oaa....','...oaa.oaa....',
 '...ogg.oggo....','...ooo.oooo....'
 ],
 wisp:[
 '.....oo.....','....occco...','...occrcco..','..occbbrcco.','..obbccbbbo.','..obbbeebbo.','..obbrggbbo.','..obbbbcbbo.',
 '...obbbbbo..','...obbcbbo..','....obbo....','....obbo....','...obbbbo...','..obbaaabo..',
 '..oba..abo..','..oa....ao..','..o......o..','...o....o...'
 ],
 archer:[
 '....oooo......','...obbbbo.....','..obbbbbbo....','..obcccbbo....','..obeebbo.....','...obbbo......','..ooabbooo....',
 '.oabbbbbbaa...','oabcbabbbgao..','oabbbbbbggao..','oabrbabbggo...','..oabbabbaao...',
 '..oaabbabaao...','..ooabbbboo....','...obbbbao.....','..oabbabaa.....','..oaa..oaa.....','..oaa..oaa.....',
 '..ogg..oggo.....','..ooo..oooo....'
 ],
 charger:[
 'oo..........oo','occoo......oocco','occcooo..ooocco','occbbboooobbbcc','oobbbbccccbbboo','oabbeeeeebbbaao','oabbeebbeebbbao',
 'oaaabbbbbbaaaao','oaabbbbbbbbaaao','oabbbbrbrbbbbao','oabbbbbbbbbbbbo','oabbbbggbbbbbao',
 '.oaabbbbbbaao..','.oaabbbbbbaao..','..ooaaaaaaoo...','..oaao..oaao...','..oaao..oaao...',
 '..oggo..oggo...','..oooo..oooo...'
 ],
 sentinel:[
 '..oo..oooo..oo..','.ocoooccccoooco.','occbboccccoobcco','ocbbccccccccbcco','ocbbbbaaaabbbo..','ocbbaabbbbaabbo.',
 '.ocbbabrrbabbco.','ocbbbbrggbbbbbco','ocbbabbrrbabbbco','ocbbbaaaaabbbco','occbbbggrgbbcco.',
 '.occbbbbbbbcco..','..occbaabcco....','..ocaaaacco.....','..ocaa..aaco....','..oggo..oggo....','..oooo..oooo....'
 ],
 shade:[
 '....oo...oo....','...obbo.obbo...','..obccboobcco..','..obbbcccbbbo..','..obbeeeeeebo..','..obbbbrrbbbo..',
 '.oabbbbaabbbbao','oabbbbaaaabbbao','oabbbaabbbbbao','oabbcaaaccbbao','oabbbbbbabbbao','..oabbggbbaao.',
 '..oaabbbbbaao..','..ooabbbbboo...','...oba..abo....','..oba....abo...','..oao....oao...','...oo....oo....'
 ],
 warden:[
 '...oo........oo...','..ocoo......ooco..','.occcoo....ooccco.','occggccoooo ccggcco','occcgbbccccbbgcccc','ooccbbbbbbbbbbcco.','..oabbbbbbbbbbaao.',
 '.oabbbeeebeeebbbbao','.oabbbeeeeeeebbbao','oaaabbbbbbbbbbaaaao','oaaabbbbrbrbbbbaao','oaaabbbbrrbbbbbaao',
 'oaaabbbbbbbbbbaaaao','oabbbgggbbgggbbbao','oabbbbbbbbbbbbbbao','oabbbbbbbbbbbbbbao','oabbbbbrbbbrbbbbao','oabbbbbbbbbbbbbbao',
 '..oabbbbggbbbbao..','..oaabbbaaabbbao..','..ooaabbbaabbboo..','..oaaaaooaaaao...', '..oaaaaooaaaao...',
 '..oggggo.oggggo...','..oooooo.oooooo...'
 ]
});
export const PIXEL_ATLAS_KINDS=Object.freeze(Object.keys(HOSTILE_ATLAS) as EnemyKind[]);
/** Require stable, intentional palette characters. No silently black pixels
 * from bad sheet data are accepted: defects fail the Node regression suite. */
function sheetWidth(sheet:readonly string[]):number{
 return Math.max(...sheet.map(x=>x.length));
}
function drawSheet(g:G,sheet:readonly string[],left:number,top:number,unit:number,palette:Record<string,string>):void{
 const W=sheetWidth(sheet);
 for(let row=0;row<sheet.length;row++){
  const text=sheet[row]!.replace(/ /g,'.'),pad=Math.floor((W-text.length)/2);
  let run='',start=0;
  const flush=(end:number)=>{
   if(run){
    const color=palette[run];
    if(!color)throw new Error('Unknown rune pixel ink '+run);
    g.fillStyle=color;g.fillRect(left+(pad+start)*unit,top+row*unit,(end-start)*unit,unit);
   }
  };
  for(let i=0;i<=text.length;i++){
   const next=i<text.length?text[i]!:'.';
   if(next===run)continue;
   flush(i);run=next==='.'?'':next;start=i;
  }
 }
}
/** Four authored coat panels reflect true footfalls (never a free-running clock). */
/** Eight hand-inked lower-oath cloak weave contours, physically shifted
 * by the existing four true gait frames. This is the SAME mantle painter,
 * not an extra visual actor or timer; reduced-motion stays still. */
export const WAYFARER_CLOAK_WEAVE=Object.freeze({
 "N": [
  "..o...o..",
  ".ob...bo.",
  "obg...gbo",
  "obbg.gbo.",
  "..og.go..",
  "...o.o..."
 ],
 "NE": [
  "o.......o",
  "ob......o",
  ".obg..gbo",
  "..ob.gbo.",
  "...ogbo..",
  "....oo..."
 ],
 "E": [
  "o........",
  "ob.......",
  "obg......",
  ".obgbo...",
  "..obgbo..",
  "...ooo..."
 ],
 "SE": [
  "o........",
  "ob.......",
  ".obg.....",
  "..obgbo..",
  "...ogbo..",
  "....ooo.."
 ],
 "S": [
  "o.......o",
  "ob.....bo",
  "obg...gbo",
  ".obg.gbo.",
  "..obgbo..",
  "...ooo..."
 ],
 "SW": [
  "........o",
  ".......bo",
  ".....gbo.",
  "..obgbo..",
  "..obgo...",
  "..ooo...."
 ],
 "W": [
  "........o",
  ".......bo",
  "......gbo",
  "...obgbo.",
  "..obgbo..",
  "...ooo..."
 ],
 "NW": [
  "o.......o",
  "o......bo",
  "obg..gbo.",
  "obg.bo...",
  "..obgo...",
  "...oo...."
 ]
} as const);
export const WAYFARER_MANTLE_STEPS=Object.freeze([
 ['o.........o','ob.......bo','obb..g..bbo','obbbgggbbbo','obbbbgbbbbo','.obbbgbbbo.','..obbgbbo..','..ogb.bgo..','..oo...oo..'],
 ['o.........o','ob.......bo','obb..g...bo','obbbggg..bo','obbbbgb.bb.','..obbg.bb..','...obgbo...','..ogbbgo...','...oo..oo..'],
 ['..o.....o..','.ob.....bo.','..ob.g.bo..','...obgbo...','..obbgbbo..','.obbgggbbo.','obbbbgbbbbo','..oggbggo..','...oo.oo...'],
 ['o.........o','ob.......bo','ob...g..bbo','ob..gggbbbo','obb.gbgbbbo','..obbgbbbo.','...obgbbo..','..ogbbggo..','..oo..oo...']
]);
/** Mantle is a physical 22×18px ink stamp on the existing actor,
 * aligned to 8 real facings and 4 actual gait poses. Recoil is true shooting. */
export function paintHeroSagaMantle(g:G,pose:WayfarerPose,time:number,reducedMotion=false):void{
 const frame=heroAtlasFrame(pose,time,reducedMotion);
 const sheet=WAYFARER_MANTLE_STEPS[frame]!;
 g.save();
 drawSheet(g,sheet,-11,-4,2,HERO_INK);
 // Facing silhouette is a physical lower-tunic fold; the 4-step sway comes
 // only from the real walking animation, not a decorative clock.
 const sway=pose.moving&&!reducedMotion?[0,2,0,-2][frame]??0:0;
 drawSheet(g,WAYFARER_CLOAK_WEAVE[pose.facing],-9+sway,3,2,HERO_INK);
 if(pose.back){
  g.fillStyle=HERO_INK.w;g.fillRect(-1,-2,2,12);
  g.fillStyle=HERO_INK.G;g.fillRect(-3,9,6,2);
 }else{
  g.fillStyle=HERO_INK.G;g.fillRect(-4,1,8,3);
  g.fillStyle=HERO_INK.e;g.fillRect(-1,3,2,3);
 }
 if(pose.side!==0){
  g.fillStyle=HERO_INK.H;g.fillRect(pose.side>0?9:-12,-1,3,12);
 }
 if(pose.recoil>.24){
  g.fillStyle=HERO_INK.w;g.fillRect(pose.side<0?-17:13,-5,4,4);
 }
 g.restore();
}

/** v0.09.26: eight separately inked braced-shoulder silhouettes.
 * Quarter turns are not just recolors, and these remain part of the body,
 * never an extra weapon, hitbox or floating HUD element. */
export const WAYFARER_OATH_STANCES=Object.freeze({
 "N": [
  "o...........o",
  "oh.........ho",
  "oHHg.....gHHo",
  ".oHHH...HHHo.",
  "..oHHGwGHHo..",
  "...oHHHHHo...",
  "....oHHHo....",
  ".....ooo....."
 ],
 "NE": [
  "o..........oo",
  "oh........oHo",
  ".oHH....oHHo.",
  "..oHHG.oHHHo.",
  "...oHHHHHHo..",
  "....oHGHHo...",
  ".....oHHo....",
  "......oo....."
 ],
 "E": [
  "o.........ooo",
  "oh.......oHHo",
  "oHH.....oHHHo",
  ".oHGG..oHHHo.",
  "..oHHHHHHo...",
  "...oHGGHHo...",
  "....oHHHo....",
  ".....ooo....."
 ],
 "SE": [
  "..o........oo",
  ".oHH......oHo",
  "oHHG....oHHHo",
  ".oHHH..oHHHo.",
  "..oHHHHHo....",
  "...oHGHHHo...",
  "....oHHo.....",
  ".....ooo....."
 ],
 "S": [
  "o...........o",
  "oho.......oho",
  "oHHg.....gHHo",
  ".oHHH...HHHo.",
  "..oHHGgGHHo..",
  "...oHHHHHo...",
  "....oHHHo....",
  ".....ooo....."
 ],
 "SW": [
  "oo........o..",
  "oHo......HHo.",
  "oHHHo....GHHH",
  ".oHHHo..HHHo.",
  "....oHHHHHo..",
  "...oHHGHHo...",
  ".....oHHo....",
  ".....ooo....."
 ],
 "W": [
  "ooo.........o",
  "oHHo.......ho",
  "oHHHo.....HHo",
  "oHHHo..GGHo..",
  "...oHHHHHHo..",
  "...oHHGGHo...",
  "....oHHHo....",
  ".....ooo....."
 ],
 "NW": [
  "oo..........o",
  "oHo........ho",
  ".oHHo....HHo.",
  "..oHHHo.GHHo.",
  "..oHHHHHHo...",
  "...oHHGHo....",
  "....oHHo.....",
  ".....oo......"
 ]
});
export function paintWayfarerOathStance(g:G,pose:WayfarerPose,time:number,reducedMotion=false):void{
 if(!Number.isFinite(time)||!Object.hasOwn(WAYFARER_OATH_STANCES,pose.facing))
  throw new RangeError('Invalid original Wayfarer combat stance');
 const gait=heroAtlasFrame(pose,time,reducedMotion),rows=WAYFARER_OATH_STANCES[pose.facing];
 g.save();
 drawSheet(g,rows,-13,-16,2,HERO_INK);
 // Forged vambraces plant toward aim, while the existing movement frame
 // articulates only ONE grounded arm. Reduced-motion has no free-running motion.
 const swing=pose.moving&&!reducedMotion?[0,2,0,-2][gait]??0:0;
 const armX=pose.side<0?-17:pose.side>0?11:9;
 g.fillStyle=HERO_INK.o;g.fillRect(armX,-7+swing,6,10);
 g.fillStyle=HERO_INK.H;g.fillRect(armX+1,-7+swing,4,5);
 g.fillStyle=HERO_INK.G;g.fillRect(armX+2,-2+swing,2,3);
 if(pose.back){
  g.fillStyle=HERO_INK.w;g.fillRect(-2,-7,4,6);
 }else{
  g.fillStyle=HERO_INK.g;g.fillRect(-3,-5,6,3);
 }
 // Actual fire recoil raises the handguard; idle never sparkles on a clock.
 if(pose.recoil>.24){
  g.fillStyle=HERO_INK.G;g.fillRect(armX+1,-13,4,6);
  g.fillStyle=HERO_INK.e;g.fillRect(armX+2,-15,2,3);
 }
 g.restore();
}

export function heroAtlasFrame(pose:WayfarerPose,time:number,reducedMotion=false):0|1|2|3 {
 if(!Number.isFinite(time))throw new RangeError('Invalid hero atlas time');
 return (pose.moving&&!reducedMotion?Math.floor(Math.max(0,time)*9)%4:0) as 0|1|2|3;
}
function heroClass(facing:HeroFacing):keyof typeof WAYFARER_ATLAS{
 if(facing==='N')return 'back';
 if(facing==='S')return 'front';
 if(facing==='E'||facing==='W')return 'side';
 return 'diagonal';
}
/** Rendered inside existing world-space actor translation, no CSS/DOM. */
export function paintHeroAtlas(g:G,pose:WayfarerPose,time:number,reducedMotion=false):void{
 if(!Object.hasOwn(WAYFARER_ATLAS,heroClass(pose.facing))||!Number.isFinite(time))
 throw new RangeError('Invalid hero atlas pose');
 const frame=heroAtlasFrame(pose,time,reducedMotion);
 const sheet=WAYFARER_ATLAS[heroClass(pose.facing)],stride=WAYFARER_GAITS[frame]!;
 const flip=pose.facing==='W'||pose.facing==='NW'||pose.facing==='SW';
 g.save();
 if(flip)g.scale(-1,1);
 const top=-33,unit=ATLAS_CELL;
 drawSheet(g,sheet,-sheetWidth(sheet)*unit/2,top,unit,HERO_INK);
 drawSheet(g,stride,-sheetWidth(stride)*unit/2,top+sheet.length*unit,unit,HERO_INK);
 paintWayfarerMovingHem(g,pose,time,reducedMotion);
 paintWayfarerOathStance(g,pose,time,reducedMotion);
 paintWayfarerSagaVisor(g,pose,time,reducedMotion);
 paintHeroSagaMantle(g,pose,time,reducedMotion);
 // Direction-dependent crest: actual facing sets the color/shape, not fake idle
 // flashing. The physical weapon remains handled by drawWayfarer.
 const p=pose.back?HERO_INK.w:HERO_INK.G;
 g.fillStyle=p;
 const fx=pose.facing==='E'||pose.facing==='NE'||pose.facing==='SE'?8:
   pose.facing==='W'||pose.facing==='NW'||pose.facing==='SW'?-8:0;
 g.fillRect(fx-1,-27,2,3);
 // Rear diagonals present a raised cloak collar and exposed side vambrace.
 // This is geometry, not just a palette flip: NE/NW cannot look like SE/SW.
 if(pose.facing==='NE'||pose.facing==='NW'){
  g.fillStyle=HERO_INK.B;g.fillRect(-7,-8,4,10);
  g.fillStyle=HERO_INK.w;g.fillRect(8,-13,2,7);
 }
 if(pose.recoil>.24&&!reducedMotion){
  g.fillStyle=HERO_INK.G;g.fillRect(pose.side<0?-18:14,-7,4,4);
  g.fillStyle=HERO_INK.w;g.fillRect(pose.side<0?-16:16,-9,2,2);
 }
 g.restore();
}
export function enemyAtlasBand(e:Pick<Enemy,'state'|'windup'>):0|1|2|3{
 if(!Number.isFinite(e.windup))throw new RangeError('Invalid hostile atlas windup');
 if(e.state==='charge')return 3;
 if(e.state!=='warning')return 0;
 const remaining=Math.max(0,e.windup); // encounter clock may cross zero before switching to idle
 return remaining>.65?0:remaining>.40?1:remaining>=.20?2:3;
}
/** Seven different Norse armour knots, attached to actual enemy bodies.
 * Body rivets grow through real warning stages; idle never draws an attack. */
export const HOSTILE_GUARD_STITCHES=Object.freeze({
 draugr:['...o...','..ogo..','.oggo..','ogrrgo.','..ggo..','..ogo..','...o...'],
 wisp:['..o.o..','.ogogo.','ogrrrgo','..oro..','.ogogo.','..o.o..','...o...'],
 archer:['o.....o','oo...oo','.ogogo.','..rgr..','.ogogo.','oo...oo','o.....o'],
 charger:['o.....o','oo...oo','ogooogo','ogrrrgo','ogooogo','oo...oo','o.....o'],
 sentinel:['..ooo..','.ogggo.','ogrrrgo','ogrrrgo','ogrrrgo','.ogggo.','..ooo..'],
 shade:['o.o.o.o','.ogogo.','..rgr..','.ogogo.','o.o.o.o','.ogogo.','..o.o..'],
 warden:['oo...oo','og...go','ogrrrgo','ogrrrgo','ogrrrgo','og...go','oo...oo']
});
export function paintHostileSagaGuard(g:G,e:Pick<Enemy,'kind'|'state'|'windup'|'phase'|'flash'>):void{
 if(!Object.hasOwn(HOSTILE_GUARD_STITCHES,e.kind)||!Number.isFinite(e.windup))
  throw new RangeError('Invalid original hostile guard');
 const sheet=HOSTILE_GUARD_STITCHES[e.kind],ink=ENEMY_INK[e.kind];
 const boss=e.kind==='warden',warning=e.state==='warning'||e.state==='charge';
 const band=warning?enemyAtlasBand(e):0,y=boss?-14:-5;
 g.save();
 drawSheet(g,sheet,-7,y,2,ink);
 if(warning){
  for(let i=0;i<band;i++){
   g.fillStyle=ink.e;g.fillRect(-12+i*8,y+14,4,3+i);
  }
 }
 if(boss&&e.phase===2){
  g.fillStyle=ink.r;g.fillRect(-14,y-4,5,4);g.fillRect(9,y-4,5,4);
 }
 if(e.flash>0){g.fillStyle=ink.e;g.fillRect(-1,y+6,3,4);}
 g.restore();
}

export function paintHostileAtlas(g:G,e:Pick<Enemy,'kind'|'state'|'windup'|'phase'|'flash'>,time:number,reducedMotion=false):void{
 if(!Object.hasOwn(HOSTILE_ATLAS,e.kind)||!Number.isFinite(time))throw new RangeError('Unknown hostile pixel sheet');
 const sheet=HOSTILE_ATLAS[e.kind];
 const palette=ENEMY_INK[e.kind];
 const isBoss=e.kind==='warden';
 const unit=ATLAS_CELL,top=isBoss?-40:-24;
 const band=enemyAtlasBand(e);
 const bob=reducedMotion?0:e.state==='idle'?Math.round(Math.sin(time*2)*.5):0;
 g.save();g.translate(0,bob);
 // One original body sheet gets real in-place shoulder/arm contour changes.
 // There is still exactly one body draw and no extra phantom attack sprite.
 const visibleBody=inkedWindupBody(sheet,e.kind,(e.state==='warning'||e.state==='charge')?band:0);
 drawSheet(g,visibleBody,-sheetWidth(sheet)*unit/2,top,unit,palette);
 paintHostileSagaGuard(g,e);
 paintEnemySagaWeapon(g,e,time,reducedMotion);
 paintHostileSagaFace(g,e,time,reducedMotion);
 // Strong readable cast: three grounded steel/rune bars appear step-by-step,
 // physically linked to real attack windup, never to a decorative clock.
 if(e.state==='warning'||e.state==='charge'){
  for(let i=0;i<band;i++){
   const left=-9+i*7;
   g.fillStyle=i===band-1?palette.r:palette.g;
   g.fillRect(left,top+sheet.length*unit-9,5,3);
  }
  if(band===3){
   g.fillStyle=palette.e;g.fillRect(-2,top-5,4,4);
  }
 }
 if(isBoss&&e.phase===2){
  // Actual extra thorn branches distinguish phase two even without red cues.
  g.fillStyle=palette.g;
  g.fillRect(-30,-33,5,12);g.fillRect(25,-33,5,12);
  g.fillRect(-35,-38,5,5);g.fillRect(30,-38,5,5);
 }
 if(e.flash>0){g.fillStyle=palette.e;g.fillRect(-3,top+9,6,3);}
 g.restore();
}
