/** Gate A room-specific carved masonry, not enemies, pickups, or colliders.
 * The 25 fixed authored IDs have individually distinctive relief counts, spacing
 * and bevel treatments. All decorations stay near the room perimeter.
 */
import type { FirstRoom } from '../run/firstSoul.js';
import { roomHeraldry } from './roomHeraldry.js';
import { GROUND_COLORS } from './motionTrails.js';

type G=CanvasRenderingContext2D;
export type RoomRelief = Readonly<{id:string;family:FirstRoom['family'];cutCount:number;pattern:number;offset:number;main:string;light:string}>;
export function roomRelief(room:Pick<FirstRoom,'id'|'family'>):RoomRelief {
 const herald=roomHeraldry(room);
 const family=room.family as keyof typeof GROUND_COLORS;
 const [light,main]=GROUND_COLORS[family]!;
 return Object.freeze({id:room.id,family,cutCount:herald.cuts,pattern:herald.sigil,offset:herald.ordinal%3,main,light});
}
function poly(g:G,xy:readonly number[],color:string,width=1){
 g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(xy[0]!,xy[1]!);
 for(let i=2;i<xy.length;i+=2)g.lineTo(xy[i]!,xy[i+1]!);g.stroke();
}
/** Strictly decorative an inset chiseled relief: the player still sees a high-contrast central arena.
 * Bounded draw count: 1 plaque, at most 5 notches per plaque, no per-frame allocations
 * outside the renderer itself and no particle/lighting RNG. */
export function paintRoomReliefs(g:G,W:number,H:number,room:Pick<FirstRoom,'id'|'family'>):void {
 if(W<220||H<148)return;
 const data=roomRelief(room);
 const y=Math.round(Math.min(H-63,Math.max(116,H*.59)));
 g.save();g.globalAlpha=.68;
 for(const side of [-1]){
  const x=Math.round(side<0?49:W-49)+(side*data.offset*2);
  g.save();g.translate(x,y);
  g.fillStyle='#101c1d';g.fillRect(-23,-23,46,48);
  g.fillStyle=data.main;g.globalAlpha=.34;g.fillRect(-19,-19,38,38);g.globalAlpha=.72;
  g.strokeStyle=data.light;g.lineWidth=1.4;g.strokeRect(-19,-19,38,38);
  // Distinguishable family motifs, engraved behind any real actors/telegraphs.
  if(data.family==='ASH'){
    poly(g,[-13,13,-6,3,-10,-8,-1,-16,5,-6,12,-13,9,13],data.light,2);
    poly(g,[-14,15,14,15],'#8f6f53');
  }else if(data.family==='IRON'){
    g.beginPath();g.arc(0,-1,11,0,Math.PI*2);g.stroke();
    g.beginPath();g.arc(0,-1,5,0,Math.PI*2);g.stroke();
    for(let k=0;k<4;k++){let a=k*Math.PI/2;g.fillStyle=data.light;g.fillRect(Math.round(Math.cos(a)*13)-2,Math.round(Math.sin(a)*13)-3,4,6);}
  }else if(data.family==='ROOT'){
    poly(g,[0,16,0,1,-9,-8,-13,-14],data.light,2.4);
    poly(g,[0,1,9,-8,13,-15],data.light,2);
    poly(g,[0,8,-11,4,-15,-2],data.light,1);
    poly(g,[2,10,10,6,14,1],data.light,1);
  }else if(data.family==='SPIRIT'){
    poly(g,[-12,-13,12,-13,9,10,0,17,-9,10,-12,-13],data.light,1.7);
    poly(g,[-6,-7,0,0,6,-7],data.light,1.5);
    poly(g,[-7,6,0,11,7,6],data.light,1);
  }else{
    poly(g,[-15,-12,15,12,-15,12,15,-12,-15,-12],data.light,1.5);
    for(let k=-1;k<=1;k++)poly(g,[k*8,-15,k*8,15],data.light,1);
  }
  // Unique visible count of diamond-shaped chisel notches in each of five variants.
  for(let j=0;j<data.cutCount;j++){
   const sx=-14+j*7,sy=21;
   g.fillStyle=data.light;g.fillRect(sx,sy,4,2);
  }
  g.restore();
 }
 g.restore();
}
