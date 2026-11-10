/** Original 32-bit-inspired carved threshold with readable EXIT / LOCKED cues.
 * Entirely inside the active room; it is scenery, never an input/HUD overlay.
 */
import type { Vec2 } from '../physics/world.js';
import { EXIT_LABELS, type ExitDirection } from '../run/wayfinding.js';
export function drawRuneDoor(g:CanvasRenderingContext2D,pos:Vec2,direction:ExitDirection,open:boolean,time:number):void {
 const meta=EXIT_LABELS[direction],green=open?'#a6e4a8':'#e0a078';
 g.save();g.translate(Math.round(pos.x),Math.round(pos.y));
 // Contrasting stone threshold and footplate, wider than the collectible glyphs.
 g.fillStyle='#050e10a8';g.beginPath();g.ellipse(0,13,27,8,0,0,Math.PI*2);g.fill();
 g.fillStyle='#5e5347';g.fillRect(-22,-15,44,34);g.fillStyle='#b6a079';g.fillRect(-20,-19,40,39);
 g.fillStyle='#233033';g.fillRect(-16,-16,32,33);g.fillStyle=open?'#2b594b':'#5d3933';g.fillRect(-12,-12,24,29);
 g.fillStyle='#101a20';g.fillRect(-10,-10,20,24);
 g.fillStyle=open?'#4c9c77':'#8b5341';g.fillRect(-8,-9,16,21);
 // Arched cap, rune-letter, and obvious direction arrow.
 g.fillStyle='#b2a07a';g.fillRect(-22,-22,44,6);g.fillStyle='#d5c59a';g.fillRect(-18,-25,36,5);
 g.fillStyle=green;g.font='bold 15px Georgia,serif';g.textAlign='center';g.fillText(meta.arrow,0,7);
 if(open){
   g.globalAlpha=.25+.12*Math.sin(time*4);g.fillStyle='#98ffbc';g.fillRect(-9,-12,18,26);g.globalAlpha=1;
 }
 g.strokeStyle=open?'#aeeebb':'#eab394';g.lineWidth=2;g.strokeRect(-17,-17,34,35);
 g.fillStyle='#091416';g.fillRect(-27,-43,54,16);g.strokeStyle='#d8bf8d';g.strokeRect(-27,-43,54,16);
 g.fillStyle=open?'#b9ffd3':'#f5ba9c';g.font='bold 10px system-ui,sans-serif';g.fillText(open?'EXIT':'LOCKED',0,-31);
 g.fillStyle='#e9d1a1';g.font='bold 9px system-ui,sans-serif';g.fillText(meta.label+' DOOR',0,-46);
 g.restore();
}
