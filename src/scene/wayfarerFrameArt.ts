/** Gate A v0.09.13: authored directional hero animation frames.
 * Four cadence frames plus eight facings. Cosmetic-only, small bounded draw
 * footprint; uses existing WayfarerPose, never mutates physics or attack state.
 */
import type { WayfarerPose, WayfarerFacing } from './wayfarerMotion.js';
type G=CanvasRenderingContext2D;
export const EIGHT_FACINGS: readonly WayfarerFacing[] = Object.freeze(['N','NE','E','SE','S','SW','W','NW']);
export const HERO_FRAME_COUNT=4;
export function heroAnimFrame(pose:WayfarerPose,time:number):0|1|2|3 {
 if(!Number.isFinite(time))throw new RangeError('Invalid hero animation clock');
 return (pose.moving?Math.floor(Math.max(0,time)*9)%HERO_FRAME_COUNT:0) as 0|1|2|3;
}
/** Paint over the already-rendered physical silhouette, beneath the weapon. */
export function paintWayfarerFrames(g:G,pose:WayfarerPose,t:number,reducedMotion=false):void {
 const frame=reducedMotion?0:heroAnimFrame(pose,t);
 const phase=pose.moving&&!reducedMotion ? [-2,0,2,0][frame]! : 0;
 const f=EIGHT_FACINGS.indexOf(pose.facing);
 if(f<0)throw new RangeError('Invalid hero facing');
 const back=pose.back, side=pose.side;
 const px=(x:number,y:number,w:number,h:number,col:string)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h);};
 g.save();
 // Two distinct articulated leg plates. Alternating positions are visible at
 // normal phone pixel scales, but never extend past the actor's 25px radius.
 for(const s of [-1,1]){
  const gait=s*phase;
  px(s*5-(s<0?4:0),13+gait,6,6,'#273c3d');
  px(s*5-(s<0?3:0),14+gait,4,3,'#aeb6a0');
  px(s*5-(s<0?3:0),18+gait,5,2,'#d2b27b');
 }
 // Back views expose a World Tree cloak spine; front views show a gold
 // chest buckle. Quarter turns show one illuminated shoulder-guard edge.
 if(back){
  px(-2,0,4,14,'#213f43');px(-1,2,2,10,'#b4c7aa');
  px(-5,6,10,2,'#739e8e');
 } else {
  px(-4,1,8,6,'#182e31');px(-3,2,6,4,'#ccad73');
  px(-1,2,2,4,'#f0deb0');
 }
 if(side!==0){
  const sx=side>0?11:-14;
  px(sx,-2,4,11,'#3a6264');px(sx+1,0,2,6,'#c2d0aa');
  px(sx,-12,3,6,'#d7be87');
 }
 // Four-frame fabric folds vary by facing. When the player enables reduced
 // motion, frame 0 is guaranteed to remain completely stationary.
 const taper=pose.moving&&!reducedMotion?(frame===1?2:frame===3?-2:0):0;
 g.strokeStyle=back?'#7ea99a':'#e1b981';g.lineWidth=1.4;
 g.beginPath();g.moveTo(-8,8);g.lineTo(-11+taper+side,17);g.stroke();
 g.beginPath();g.moveTo(8,8);g.lineTo(11-taper+side,17);g.stroke();
 // Eight facing variants each have an individually placed tiny helmet jewel.
 const directions:[[number,number],[number,number],[number,number],[number,number],[number,number],[number,number],[number,number],[number,number]]=[
  [0,-25],[5,-22],[9,-17],[6,-12],[0,-9],[-6,-12],[-9,-17],[-5,-22]
 ];
 const [jx,jy]=directions[f]!;
 px(jx-2,jy-1,4,3,back?'#a2dcc8':'#e9ca8b');
 if(pose.recoil>.25){ // short real-attack recoil, not a looping decorative flash
  const arm=side<0?-13:10;
  px(arm,-5,4,5,'#fff1ba');
  px(arm+1,-3,2,2,'#d6f4e4');
 }
 
 // Gate A v0.09.17: silhouette-carved helm, woven tabard and articulated
 // plated elbows. Facing and 4-step cadence, not idle wall-clock glitter.
 const edge=side<0?-1:side>0?1:0;
 const swing=pose.moving&&!reducedMotion?[0,1,0,-1][frame]:0;
 for(const s of [-1,1]){
  px(s<0?-13:9,-4+swing*s,4,8,'#172f34');
  px(s<0?-12:10,-5+swing*s,3,4,'#83998b');
  px(s<0?-11:10,2+swing*s,3,2,'#dfbd7d');
 }
 // Distinct front facial guard / back flowing mantle / side helmet profile.
 if(back){
  px(-7,-17,14,2,'#29494a');px(-5,-15,10,2,'#6a9b8f');
  px(-3,5,6,2,'#d2b785');
  px(-2,8+swing,4,7,'#47645c');
 }else if(edge!==0){
  px(edge>0?2:-8,-19,6,3,'#d6c89f');
  px(edge>0?6:-10,-15,4,9,'#243b3e');
  px(edge>0?6:-8,-13,2,2,'#dff1d1');
  px(edge>0?-3:-2,8,5,6,'#c5a571');
 }else{
  px(-7,-19,14,2,'#e2c58e');
  px(-4,-14,3,2,'#d8e9d7');px(2,-14,3,2,'#d8e9d7');
  px(-3,9,6,6,'#d6b275');
  px(-1,11,2,3,'#365c58');
 }
g.restore();
}
