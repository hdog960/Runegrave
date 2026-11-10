/** v0.09 original illustrated floor identity and tangible collectibles.
 * All elements are world-space props, never floating gameplay controls or HUD.
 */
import type { FirstRoom,RelicDefinition } from './firstSoul.js';
import type { Vec2 } from '../physics/world.js';
export type RoomDrop = {id:string;kind:'relic'|'silver'|'heart';x:number;y:number;relic?:RelicDefinition;amount:number;collected:boolean};
export function paintRoomSigil(g:CanvasRenderingContext2D,W:number,H:number,t:number,room:FirstRoom){
 const x=W*.5,y=Math.min(H-33,H*.39),col=room.accent;
 g.save();g.globalAlpha=.68;g.strokeStyle=col;g.lineWidth=1.1;
 for(let n=0;n<3;n++){g.beginPath();g.ellipse(x,y,23+n*8,7+n*3,0,0,Math.PI*2);g.stroke();}
 const family=room.family==='ASH'?3:room.family==='IRON'?4:room.family==='ROOT'?5:room.family==='SPIRIT'?6:7;
 for(let i=0;i<family;i++){const a=i*Math.PI*2/family+t*.014;g.beginPath();g.moveTo(x+Math.cos(a)*23,y+Math.sin(a)*11);g.lineTo(x+Math.cos(a)*34,y+Math.sin(a)*17);g.stroke();}
 g.fillStyle=col;g.font='bold 19px Georgia,serif';g.textAlign='center';g.fillText(room.rune,x,y+6);
 g.globalAlpha=.34;
 for(let j=0;j<4;j++){const xx=25+j*(W-50)/3;g.fillRect(xx,H-37,17+(family+j)%3*5,1);g.fillRect(xx+5,H-34,7,2);}
 g.restore();
}
export function drawRoomDrops(g:CanvasRenderingContext2D,drops:readonly RoomDrop[],t:number){
 for(const drop of drops){if(drop.collected)continue;
  const pulse=.55+.2*Math.sin(t*3+drop.x*.03);
  const col=drop.kind==='relic'?'#dbb576':drop.kind==='silver'?'#bfdcc7':'#e2a6a0';
  g.save();g.translate(drop.x,drop.y);g.globalAlpha=.8;
  g.fillStyle='#061619';g.beginPath();g.ellipse(0,14,16,5,0,0,Math.PI*2);g.fill();
  const glow=g.createRadialGradient(0,-4,2,0,-4,30);glow.addColorStop(0,`rgba(${drop.kind==='heart'?'231,147,138':'196,181,116'},${pulse*.35})`);glow.addColorStop(1,'rgba(20,48,40,0)');g.fillStyle=glow;g.fillRect(-30,-34,60,60);
  g.strokeStyle=col;g.lineWidth=1.5;g.beginPath();g.ellipse(0,8,13,5,0,0,Math.PI*2);g.stroke();
  g.fillStyle=drop.kind==='heart'?'#d98b8c':'#233e3a';g.fillRect(-7,-7+Math.sin(t*3+drop.x)*2,14,14);
  g.strokeStyle=col;g.lineWidth=2;g.strokeRect(-7,-7+Math.sin(t*3+drop.x)*2,14,14);
  g.fillStyle=col;g.textAlign='center';g.font='bold 17px Georgia,serif';
  g.fillText(drop.kind==='relic'?drop.relic?.rune||'ᛟ':drop.kind==='heart'?'♥':'ᚠ',0,5+Math.sin(t*3+drop.x)*2);
  if(drop.kind==='relic'){g.strokeStyle='#eacb89';g.beginPath();g.moveTo(-12,-13);g.lineTo(0,-23);g.lineTo(12,-13);g.stroke();}
  g.restore();
 }
}
export function nearDrop(player:Vec2,drop:RoomDrop){return !drop.collected&&Math.hypot(player.x-drop.x,player.y-drop.y)<17;}
