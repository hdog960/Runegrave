/** World-space threshold architecture, never an on-screen control or HUD element.
 * v0.09.3 Gate A door polish: weighty ash-stone jambs, visible barred/open portal,
 * compass arrow and explicit LOCKED / EXIT plaque, plus original carved lighting.
 */
import type { Vec2 } from '../physics/world.js';
import type {ExitDirection} from '../run/wayfinding.js';
import { paintRuneGateMechanism } from './ageStoneArt.js';
import { paintSagaGate } from './sagaGateArt.js';

/** Stone approach travels FROM the doorway into the traversable room, so a
 * clearly chiseled threshold visually connects to the actual gate position. */
export function inwardApproach(direction:ExitDirection,distance:number):{x:number;y:number} {
 if(!(Number.isFinite(distance)&&distance>=0))throw new RangeError('Invalid approach distance');
 switch(direction){
   case 'north':return {x:0,y:distance};
   case 'south':return {x:0,y:-distance};
   case 'east':return {x:-distance,y:0};
   case 'west':return {x:distance,y:0};
 }
}

/** A floor-engraved compass arrow pointing INTO the real doorway, never a false
 * pickup or touch target. Its origin is on the walkable side of the threshold. */
export function doorEntryArrow(direction:ExitDirection,distance:number):readonly Vec2[]{
 if(!Number.isFinite(distance)||distance<0)throw new RangeError('Invalid door arrow distance');
 const step=inwardApproach(direction,distance);
 const heading=direction==='north'?{x:0,y:-1}:direction==='south'?{x:0,y:1}:direction==='west'?{x:-1,y:0}:{x:1,y:0};
 const sideways={x:-heading.y,y:heading.x};
 return [
  {x:step.x+heading.x*8,y:step.y+heading.y*8},
  {x:step.x-heading.x*5+sideways.x*5,y:step.y-heading.y*5+sideways.y*5},
  {x:step.x-heading.x*5-sideways.x*5,y:step.y-heading.y*5-sideways.y*5}
 ];
}

/** World-space threshold beacons, directional stonework and readable open/locked chains.
 * Render-only: no hitboxes, navigation, controls or HUD elements are modified. */
export function paintRuneThreshold(g:CanvasRenderingContext2D,direction:ExitDirection,open:boolean,t:number):void {
 if(!Number.isFinite(t))throw new RangeError('Invalid threshold clock');
 const inward=inwardApproach(direction,1),side={x:-inward.y,y:inward.x};
 const ember=open?'#b5edb6':'#d8a27c';
 g.save();
 for(let n=0;n<3;n++){
   const dist=29+n*9,span=18+n*4,alpha=open?(.52+.12*Math.sin(t*2.7-n*.7)):.55;
   for(const s of [-1,1]){
     const x=Math.round(inward.x*dist+side.x*span*s),y=Math.round(inward.y*dist+side.y*span*s);
     g.fillStyle='#121d1f';g.fillRect(x-3,y-3,6,6);
     g.fillStyle='#a99675';g.fillRect(x-2,y-3,4,2);
     g.globalAlpha=alpha;g.fillStyle=ember;g.fillRect(x-1,y-1,2,3);g.globalAlpha=1;
   }
 }
 g.strokeStyle=ember;g.lineWidth=1.5;g.beginPath();
 if(open){g.moveTo(-7,9);g.lineTo(-1,12);g.moveTo(2,12);g.lineTo(7,9);}
 else{g.moveTo(-7,11);g.lineTo(7,11);g.moveTo(-5,8);g.lineTo(5,14);}
 g.stroke();g.restore();
}

export function drawRuneDoor(g:CanvasRenderingContext2D,pos:Vec2,direction:ExitDirection,open:boolean,time:number):void {
 const c=open?'#9be8aa':'#e49d7d';
 const px=(x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
 // Edge exits are physically near the wall. Inset the *art* slightly so labels and
 // the whole arch remain visible; the actual collision/door hit zone stays unchanged.
 const tf=g.getTransform();
 const viewW=tf.a>0?g.canvas.width/tf.a:420;
 const artX=Math.min(viewW-44,Math.max(44,pos.x));
 g.save();g.translate(Math.round(artX),Math.round(pos.y));
 // Three staggered stone stairs lead INTO the actual exit, not to a fake icon.
 // They deliberately use a different broad silhouette than loose silver/relics.
 for(let i=0;i<3;i++){
   const step=inwardApproach(direction,21+i*8);
   const w=(direction==='north'||direction==='south')?44-i*6:6;
   const h=(direction==='north'||direction==='south')?4:44-i*6;
   const tone=open?'#5d9471':'#765447';
   px(step.x-w/2,step.y-h/2,w,h,'#263033');
   px(step.x-w/2+1,step.y-h/2,w-2,1,tone);
 }
 paintRuneThreshold(g,direction,open,time);
 // Three shallow chiselled arrows mark the ENTIRE approach as traversable.
 // The arrows remain visible when the gate turns green but never move its hitbox.
 for(const distance of [31,45]){
   const [tip,a,b]=doorEntryArrow(direction,distance);
   g.fillStyle=open?'#9ac99e':'#b49a79';g.globalAlpha=open?.85:.43;
   g.beginPath();g.moveTo(tip!.x,tip!.y);g.lineTo(a!.x,a!.y);g.lineTo(b!.x,b!.y);g.closePath();g.fill();
 }
 g.globalAlpha=1;
 // Raised threshold and perspective make it identifiable as an actual doorway.
 g.fillStyle='#020b0dc0';g.beginPath();g.ellipse(0,16,31,8,0,0,Math.PI*2);g.fill();
 px(-29,11,58,6,'#554e43');px(-25,13,50,3,'#c2af82');
 px(-28,-23,56,35,'#25292b');
 px(-28,-23,9,37,'#625a4b');px(19,-23,9,37,'#625a4b');
 px(-26,-24,5,34,'#b7a17a');px(21,-24,5,34,'#b7a17a');
 px(-24,-30,48,9,'#504a42');px(-23,-30,46,4,'#dec58e');
 // Deep chiseled lintel, three-piece keystone and iron runic truss.
 px(-21,-34,42,4,'#80715c');px(-5,-36,10,6,'#cfb985');
 for(const xx of [-17,-10,8,15])px(xx,-28,2,3,'#1e3431');
 px(-16,-22,32,34,'#101e22');
 if(open){
   px(-15,-21,30,33,'#214c3c');px(-12,-18,24,30,'#327a58');
   const pulse=.38+.17*Math.sin(time*3.4);
   g.fillStyle=`rgba(143,252,167,${pulse})`;g.fillRect(-11,-19,22,30);
   px(-3,-16,6,28,'#82bc93');
   // Readable tunnel vanishing point: an OPEN doorway, not another collectible.
   px(-6,-13,12,22,'#1a3c30');px(-3,-10,6,16,'#7ce9a7');
   px(-5,8,10,2,'#e5f4bd');
   // Both heavy stone leaves are visibly pulled apart, exposing the tunnel.
   px(-17,-20,5,32,'#567b62');px(12,-20,5,32,'#567b62');
   for(const yy of [-15,-4,7]){px(-17,yy,5,2,'#c5b98a');px(12,yy,5,2,'#c5b98a');}
   px(-10,12,20,2,'#a4c99e');
 } else {
   px(-15,-21,30,33,'#5b3936');px(-12,-19,24,29,'#39292c');
   px(-2,-20,4,32,'#ae8569');
   for(const yy of [-15,-5,5])px(-12,yy,24,2,'#94745a');
   // Cross-braced locked door has a distinct X, visible even without color.
   g.strokeStyle='#d19c75';g.lineWidth=3;g.beginPath();
   g.moveTo(-11,-18);g.lineTo(11,10);g.moveTo(11,-18);g.lineTo(-11,10);g.stroke();
   px(-3,-5,6,7,'#eab68b');px(-1,-4,2,4,'#2a2525');
 }
 // Woven lintel knots; flank lamps visibly change from red/amber to green.
 px(-31,-20,4,17,'#b59b72');px(27,-20,4,17,'#b59b72');
 for(const sx of [-32,28]){
   px(sx,-19,5,7,'#27332d');px(sx+1,-18,3,5,open?'#7cef9e':'#ee966b');
   px(sx+2,-24,1,4,open?'#caefb3':'#e8b278');
 }
 px(-18,-30,36,3,'#9a8768');
 for(let i=-2;i<=2;i++)px(i*6-1,-28,2,2,i%2?'#d0b779':'#819a8c');
 paintRuneGateMechanism(g,open);
 paintSagaGate(g,direction,open,time);
// v0.09.34: a single carved LOCKED / EXIT plaque, not an oversized
 // double-line floating compass caption over the live battlefield. The
 // compass is already engraved into the four unique arch silhouettes, on
 // the floor approach and in the separate outside-canvas grip status.
 px(-24,-41,48,13,'#101d1d');
 g.strokeStyle=open?'#ccebb7':'#dfb18c';g.lineWidth=1;
 g.strokeRect(-24,-41,48,13);
 g.font='bold 9px system-ui,sans-serif';g.textAlign='center';
 g.fillStyle=c;g.fillText(open?'EXIT':'LOCKED',0,-31);
 g.font='bold 11px system-ui,sans-serif';g.fillStyle=open?'#eaffdb':'#f2c6ac';
 g.fillText(open?'✓':'×',0,-1);
 g.restore();
}
