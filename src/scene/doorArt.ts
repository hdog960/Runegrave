/** World-space threshold architecture, never an on-screen control or HUD element.
 * v0.09.3 Gate A door polish: weighty ash-stone jambs, visible barred/open portal,
 * compass arrow and explicit LOCKED / EXIT plaque, plus original carved lighting.
 */
import type { Vec2 } from '../physics/world.js';
import { EXIT_LABELS, type ExitDirection } from '../run/wayfinding.js';
export function drawRuneDoor(g:CanvasRenderingContext2D,pos:Vec2,direction:ExitDirection,open:boolean,time:number):void {
 const meta=EXIT_LABELS[direction];const c=open?'#9be8aa':'#e49d7d';
 const px=(x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
 // Edge exits are physically near the wall. Inset the *art* slightly so labels and
 // the whole arch remain visible; the actual collision/door hit zone stays unchanged.
 const tf=g.getTransform();
 const viewW=tf.a>0?g.canvas.width/tf.a:420;
 const artX=Math.min(viewW-44,Math.max(44,pos.x));
 g.save();g.translate(Math.round(artX),Math.round(pos.y));
 // Raised threshold and perspective make it identifiable as an actual doorway.
 g.fillStyle='#020b0dc0';g.beginPath();g.ellipse(0,16,31,8,0,0,Math.PI*2);g.fill();
 px(-29,11,58,6,'#554e43');px(-25,13,50,3,'#c2af82');
 px(-28,-23,56,35,'#25292b');
 px(-28,-23,9,37,'#625a4b');px(19,-23,9,37,'#625a4b');
 px(-26,-24,5,34,'#b7a17a');px(21,-24,5,34,'#b7a17a');
 px(-24,-30,48,9,'#504a42');px(-23,-30,46,4,'#dec58e');
 px(-16,-22,32,34,'#101e22');
 if(open){
   px(-15,-21,30,33,'#214c3c');px(-12,-18,24,30,'#327a58');
   const pulse=.38+.17*Math.sin(time*3.4);
   g.fillStyle=`rgba(143,252,167,${pulse})`;g.fillRect(-11,-19,22,30);
   px(-3,-16,6,28,'#82bc93');
 } else {
   px(-15,-21,30,33,'#5b3936');px(-12,-19,24,29,'#39292c');
   px(-2,-20,4,32,'#ae8569');
   for(const yy of [-15,-5,5])px(-12,yy,24,2,'#94745a');
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
 // Plaque is part of the door, not a floating HUD panel.
 px(-28,-47,56,17,'#091719');
 g.strokeStyle=open?'#d0edab':'#ebc2a0';g.lineWidth=1.5;g.strokeRect(-28,-47,56,17);
 g.font='bold 10px system-ui,sans-serif';g.textAlign='center';
 g.fillStyle=c;g.fillText(open?'EXIT':'LOCKED',0,-34);
 g.fillStyle='#e9dbbb';g.font='bold 9px system-ui,sans-serif';g.fillText(`${meta.arrow} ${meta.label} DOOR`,0,-51);
 g.font='bold 12px system-ui,sans-serif';g.fillStyle=open?'#eaffdb':'#f2c6ac';
 g.fillText(open?meta.arrow:'×',0,-1);
 g.restore();
}
