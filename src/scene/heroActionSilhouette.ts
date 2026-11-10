/** Gate A v0.09.15: world-space, cosmetic eight-direction silhouette; no combat state changed. */
import type {WayfarerPose} from './wayfarerMotion.js';
type G=CanvasRenderingContext2D;
export const HERO_SILHOUETTE_VARIANTS=Object.freeze({
 N:{x:0,y:-1},NE:{x:1,y:-1},E:{x:1,y:0},SE:{x:1,y:1},
 S:{x:0,y:1},SW:{x:-1,y:1},W:{x:-1,y:0},NW:{x:-1,y:-1}
} as const);
export type HeroSilhouette=Readonly<{frame:number;flow:number;front:boolean;left:number;right:number;stride:number}>;
export function heroSilhouette(pose:WayfarerPose,time:number,reducedMotion=false):HeroSilhouette {
 if(!Number.isFinite(time)||!Object.hasOwn(HERO_SILHOUETTE_VARIANTS,pose.facing))throw new RangeError('Invalid hero silhouette frame');
 const facing=HERO_SILHOUETTE_VARIANTS[pose.facing];
 const frame=reducedMotion||!pose.moving?0:Math.floor(Math.max(0,time)*8)%4;
 const stride=pose.moving&&!reducedMotion?[0,2,0,-2][frame]!:0;
 const flow=pose.moving&&!reducedMotion?[0,1,0,-1][frame]!:0;
 return {frame,flow,front:facing.y>=0,left:facing.x<0?-1:facing.x>0?1:0,right:facing.y,stride};
}
export function paintHeroActionSilhouette(g:G,pose:WayfarerPose,time:number,reducedMotion=false):void {
 const a=heroSilhouette(pose,time,reducedMotion);
 const px=(x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
 g.save();
 const hem=a.flow;
 g.fillStyle=pose.back?'#234d54':'#1a3c45';g.beginPath();
 g.moveTo(-12,7);g.lineTo(-13+hem,17);g.lineTo(-4,14);g.lineTo(0,19);g.lineTo(4,14);g.lineTo(13-hem,17);g.lineTo(12,7);g.closePath();g.fill();
 g.strokeStyle=pose.back?'#91c4ad':'#bdac78';g.lineWidth=1.2;g.beginPath();
 g.moveTo(-12,14);g.lineTo(-5,13);g.lineTo(0,18);g.lineTo(5,13);g.lineTo(12,14);g.stroke();
 for(const side of [-1,1]){
  const y=20+side*a.stride;px(side<0?-10:4,y,7,2,'#c8b080');px(side<0?-11:10,y-2,3,3,'#627c70');
 }
 if(a.left!==0){
  const bx=a.left>0?12:-17;px(bx,-1,5,13,'#132d32');px(bx+1,0,3,10,'#c0aa77');px(bx+1,4,3,3,'#6ca79d');px(a.left>0?-12:9,-7,4,5,'#b2bd9a');
 }else{
  px(-12,-6,4,3,a.front?'#d9bc83':'#92c7ae');px(8,-6,4,3,a.front?'#d9bc83':'#92c7ae');
 }
 px(a.left*5-1,8+hem,2,5,pose.back?'#85bf9f':'#bd9b68');
 g.restore();
}
