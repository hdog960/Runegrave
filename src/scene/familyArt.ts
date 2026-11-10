/** Gate A art pass: five visually distinct authored room families.
 * All marks are embedded into world masonry. They have NO collisions, don't imply
 * pickups/enemies, and never cover the separate control/HUD rails.
 */
import type { FirstRoom } from '../run/firstSoul.js';
import { paintFamilyLandmarks } from './landmarkArt.js';
import { paintFamilyRelief } from './familyRelief.js';

type G=CanvasRenderingContext2D;
type Family='ASH'|'IRON'|'ROOT'|'SPIRIT'|'FATE';
export const ROOM_MATERIALS:Readonly<Record<Family,{name:string;floor:string;light:string;shadow:string}>>=Object.freeze({
 ASH:{name:'Vitrified ash and burning iron',floor:'#925b3d',light:'#e6aa65',shadow:'#1e1819'},
 IRON:{name:'Cold riveted iron and silver',floor:'#687e85',light:'#b9c8c5',shadow:'#17262e'},
 ROOT:{name:'Verdant roots and living stone',floor:'#487f62',light:'#a5deaa',shadow:'#11271d'},
 SPIRIT:{name:'Veiled lanterns and ghostglass',floor:'#787bb2',light:'#c4b9fa',shadow:'#1e2035'},
 FATE:{name:'Golden carved knotwork',floor:'#97804c',light:'#f5d58c',shadow:'#29251c'}
});
function isFamily(s:string):s is Family{return Object.hasOwn(ROOM_MATERIALS,s);}
export function themeOfRoom(room:Pick<FirstRoom,'family'>){
 if(!isFamily(room.family))throw new RangeError('Unknown authored room family');
 return ROOM_MATERIALS[room.family];
}
function rect(g:G,x:number,y:number,w:number,h:number,col:string){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
function line(g:G,coords:number[],col:string,width=1){g.strokeStyle=col;g.lineWidth=width;g.beginPath();g.moveTo(coords[0]!,coords[1]!);for(let i=2;i<coords.length;i+=2)g.lineTo(coords[i]!,coords[i+1]!);g.stroke();}
function carvedGlyph(g:G,x:number,y:number,f:Family,light:string,variation:number){
 g.save();g.translate(Math.round(x),Math.round(y));g.strokeStyle=light;g.lineWidth=1.3;
 if(f==='ASH'){
  // Uneven slashes / fissures in an ash-scarred floor, never projectile effects.
  line(g,[-15,-7,-7,-3,-3,-11,3,-3,10,-8,16,-1],light,1.8);
  line(g,[-11,6,-2,3,3,9,12,4],light,1);
  rect(g,-10+variation,9,4,2,'#ad6840');
 } else if(f==='IRON'){
  for(let k=-2;k<=2;k++)line(g,[k*7,-10,k*7,10],'#75888b',1);
  line(g,[-17,-10,17,-10,17,10,-17,10,-17,-10],light,1.2);
  for(const sx of [-12,12])for(const sy of [-7,7])rect(g,sx,sy,2,2,light);
 } else if(f==='ROOT'){
  line(g,[-15,11,-7,3,-8,-6,-2,-12,1,-5,9,-13],light,2);
  line(g,[-6,2,5,4,10,12],light,1.8);line(g,[0,-4,9,-1,15,4],light,1);
  rect(g,10,-14,3,3,'#689c74');rect(g,13,3,2,3,'#84bf8c');
 } else if(f==='SPIRIT'){
  g.beginPath();g.ellipse(0,1,12,7,0,0,Math.PI*2);g.stroke();
  line(g,[-9,1,-3,-8,4,-6,9,1,3,9,-3,7,-9,1],light,1);
  rect(g,-2,-12,4,3,'#b5b1e2');
 } else {
  // Four interconnected diamonds represent Wyrd, not a pickup beacon.
  for(const [dx,dy] of ([[0,-8],[8,0],[0,8],[-8,0]] as const))line(g,[dx,dy-5,dx+5,dy,dx,dy+5,dx-5,dy,dx,dy-5],light,1);
  line(g,[-15,0,15,0],light,1);
 }
 g.restore();
}
/** Paint a restrained material identity around the perimeter, keeping a high-contrast
 * center for fighters, Soulbolts, pickups and attack windups. */
export function paintRoomFamily(g:G,W:number,H:number,t:number,room:FirstRoom):void {
 const theme=themeOfRoom(room),f=room.family as Family;
 const variant=Number(room.id.replace(/\D/g,''))%5;
 g.save();
 // A subtle full-floor material wash makes the five chambers distinguishable
 // at iPhone scale without hiding actors, projectiles, or red attack warnings.
 g.globalAlpha=.115;
 g.fillStyle=theme.floor;g.fillRect(20,60,W-40,Math.max(20,H-82));
 g.globalAlpha=.25;
 g.fillStyle=theme.shadow;g.fillRect(15,70,W-30,12);
 g.fillRect(15,Math.max(90,H-51),W-30,16);
 // Colored wall friezes and runic cloth strips appear behind gameplay entities.
 g.globalAlpha=.58;
 for(const xx of [67,W-67]){
   rect(g,xx-7,89,14,4,theme.light);
   rect(g,xx-5,94,10,22,theme.shadow);
   rect(g,xx-3,96,6,17,theme.floor);
   rect(g,xx-1,100,2,9,theme.light);
 }
 g.globalAlpha=.48;
 for(let i=0;i<7;i++){
   const x=27+i*(W-54)/6;
   rect(g,x,72,7,3,theme.floor);
   rect(g,x+((i+variant)%3)*2,82,2,5,theme.light);
 }
 // Family-specific floor sigils are carvings, not interactable objects.
 g.globalAlpha=.50;
 const x1=92+(variant%3)*9,x2=W-x1;
 const low=Math.min(H-42,Math.max(112,H*.77));
 carvedGlyph(g,x1,low,f,theme.light,variant);
 carvedGlyph(g,x2,low-4,f,theme.light,variant);
 g.globalAlpha=.22;
 for(let i=0;i<4;i++){
  const xx=45+i*(W-90)/3;
  line(g,[xx,94,xx+8,99,xx+4,106],theme.floor,1+(i%2));
 }
 // Original restrained lighting signature, tied to the material type.
 const glow=g.createRadialGradient(W*.5,H*.51,10,W*.5,H*.51,Math.max(W,H)*.57);
 glow.addColorStop(0,'#0000');glow.addColorStop(1,theme.shadow+'85');
 g.fillStyle=glow;g.fillRect(0,64,W,H-64);
 if(f==='SPIRIT'){
   g.globalAlpha=.22+.04*Math.sin(t*1.9);
   for(const xx of [56,W-56]){g.fillStyle=theme.light;g.beginPath();g.ellipse(xx,H*.43,11,4,0,0,Math.PI*2);g.fill();}
 } else if(f==='ASH'){
   g.globalAlpha=.30;
   for(let i=0;i<5;i++)rect(g,38+i*68,92+((variant+i)%3)*7,3,2,theme.light);
 } else if(f==='ROOT'){
   g.globalAlpha=.38;
   line(g,[24,H*.46,46,H*.49,59,H*.45,69,H*.52],theme.light,2);
   line(g,[W-25,H*.57,W-45,H*.55,W-68,H*.61],theme.light,2);
 }
 g.globalAlpha=1;
 paintFamilyLandmarks(g,W,H,t,room);
 paintFamilyRelief(g,W,H,room);
 g.restore();
}
