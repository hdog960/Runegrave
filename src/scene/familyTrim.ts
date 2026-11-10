/** v0.09 Gate A: recognizable noninteractive FLOOR borders per room family.
 * These muted wall/footprint accents are deliberately separated from enemy
 * attack colors, golden relic pickups, and actual traversability/collision.
 */
import type {FirstRoom} from '../run/firstSoul.js';
export const FLOOR_TRIMS=Object.freeze({
 ASH:'scorched-slag-grates',IRON:'riveted-cog-plates',ROOT:'leaf-and-vein-mosaics',
 SPIRIT:'ghostglass-prisms',FATE:'woven-wyrd-threads'
} as const);
type G=CanvasRenderingContext2D;
export function paintFamilyTrim(g:G,W:number,H:number,t:number,room:Pick<FirstRoom,'family'|'id'>):void {
 const family=room.family as keyof typeof FLOOR_TRIMS;
 if(!Object.hasOwn(FLOOR_TRIMS,family))throw new RangeError('Invalid room trim');
 const n=Number(room.id.replace(/\D/g,''))%5;
 const px=(x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const stroke=(points:number[],c:string,width=1)=>{g.strokeStyle=c;g.lineWidth=width;g.beginPath();g.moveTo(points[0]!,points[1]!);for(let i=2;i<points.length;i+=2)g.lineTo(points[i]!,points[i+1]!);g.stroke();};
 g.save();g.globalAlpha=.58;
 // Draw only along the horizontal edge of the lower masonry, away from avatar
 // interaction, incoming projectiles and collectible pedestals.
 const y=Math.max(104,H-32);
 for(let i=0;i<5;i++){
  const x=61+i*(W-122)/4 + (i%2?n:0);
  g.save();g.translate(Math.round(x),Math.round(y));
  switch(family){
   case 'ASH':
    px(-15,-2,30,11,'#292323');for(const k of [-11,-4,3,10])px(k,-1,3,9,'#b4774a');
    px(-5,9,10,2,'#edb47e');break;
   case 'IRON':
    px(-14,-4,28,13,'#465b63');px(-12,-2,24,9,'#293f48');
    for(const k of [-10,0,10])for(const yy of [-1,7])px(k,yy,2,2,'#b5c2b8');
    stroke([-9,3,9,3],'#78999d',2);break;
   case 'ROOT':
    // A low, irregular moss-capped root knot; avoid the arrow/waystone silhouette.
    px(-15,1,30,8,'#2d4639');px(-12,1,25,2,'#667e58');
    stroke([-13,7,-7,4,0,5,7,3,13,7],'#879c74',2);
    stroke([-2,4,-3,-5,3,-8],'#819d7e',1.5);
    px(-4,-8,6,3,'#5d956b');break;
   case 'SPIRIT':
    stroke([-12,7,0,-7,12,7,-12,7],'#aaaada',1.6);
    px(-4,0,8,5,'#647ea0');px(-1,1,2,2,'#e5e3fa');
    break;
   case 'FATE':
    for(const k of [-10,-3,4,11])stroke([k,-5,k+4,0,k,7],'#cbb783',1.6);
    stroke([-14,8,14,8],'#e1cb91',1.5);break;
  }
  g.restore();
 }
 g.restore();
}
