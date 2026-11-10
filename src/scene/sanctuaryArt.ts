import { wayfarerPose } from './wayfarerMotion.js';
import { paintWayfarerEmblems } from './wayfarerEmblems.js';
import { paintWayfarerProfile } from './wayfarerProfileArt.js';
import { paintWayfarerFrames } from './wayfarerFrameArt.js';
import { paintChamberSetpieces, type ChamberFamily } from './chamberSetpieces.js';
type Family=ChamberFamily;
/** v0.04 original hand-authored procedural 32-bit-inspired Midgard Rootvault art.
 * All paint operations are WORLD SPACE and clipped by the dedicated canvas.
 * The rendered art is decorative; no enemy collision or content is implied.
 */
export type Point = readonly [number, number];
type G = CanvasRenderingContext2D;
export const ART_PALETTE = Object.freeze({
  void:'#071013', mortar:'#0c1b1c', stone:'#233433', stoneLit:'#415650',
  iron:'#101c20', brass:'#ae8b59', jade:'#83c4ae', flame:'#f5bb63'
});
const tileSize = 30;
/** These are actual base masonry palettes, not transparent theme overlays.
 * The ROOT palette exactly preserves the original Rootvault material. */
export const BASE_MASONRY:Readonly<Record<Family,Readonly<{mortar:string;slab:string;slabLit:string;wall:string;wallLit:string;accent:string;glint:string}>>> = Object.freeze({
 ROOT:{mortar:'#142324',slab:'#243735',slabLit:'#30423b',wall:'#334641',wallLit:'#566960',accent:'#596655',glint:'#6c9c83'},
 ASH:{mortar:'#271b1b',slab:'#43302b',slabLit:'#594138',wall:'#4d352e',wallLit:'#977257',accent:'#b07a57',glint:'#e4a567'},
 IRON:{mortar:'#18272e',slab:'#293e47',slabLit:'#41575e',wall:'#3c4c54',wallLit:'#9aa8ab',accent:'#a4a9a9',glint:'#b9cfd0'},
 SPIRIT:{mortar:'#202337',slab:'#30364b',slabLit:'#4d536e',wall:'#414760',wallLit:'#9292b2',accent:'#999dca',glint:'#b7b9e4'},
 FATE:{mortar:'#29251e',slab:'#473d30',slabLit:'#61543b',wall:'#4c4434',wallLit:'#b09c6f',accent:'#c3a771',glint:'#eed4a0'}
});
const floorHash=(x:number,y:number)=>{
  let v=Math.imul(x+12345,374761393)+Math.imul(y+54321,668265263);
  v=Math.imul(v^(v>>>13),1274126177);return (v^(v>>>16))>>>0;
};
function box(g:G,x:number,y:number,w:number,h:number,c:string){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
function stroke(g:G,pts:Point[],c:string,w=1){g.beginPath();g.moveTo(pts[0]![0],pts[0]![1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i]![0],pts[i]![1]);g.lineWidth=w;g.strokeStyle=c;g.stroke();}
function shape(g:G,pts:Point[],c:string){g.beginPath();g.moveTo(pts[0]![0],pts[0]![1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i]![0],pts[i]![1]);g.closePath();g.fillStyle=c;g.fill();}
function ellipse(g:G,x:number,y:number,rx:number,ry:number,fill:string,strokeColor?:string){g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=fill;g.fill();if(strokeColor){g.strokeStyle=strokeColor;g.lineWidth=1;g.stroke();}}
function knot(g:G,x:number,y:number,s:number,lit:boolean){
 g.save();g.translate(x,y);g.scale(s,s);
 stroke(g,[[-8,-6],[0,-13],[8,-6],[0,1],[-8,-6]],lit?'#94cbb2':'#526b61',2);
 stroke(g,[[0,1],[0,12],[-6,5],[0,-3],[6,5],[0,12]],lit?'#b2dcb4':'#435950',1.5);
 box(g,-2,-14,4,3,lit?'#daefc5':'#899c7f');g.restore();
}
function wall(g:G,W:number,family:Family){
 const p=BASE_MASONRY[family];
 box(g,0,0,W,51,'#091418');
 box(g,0,0,W,5,'#48554a');box(g,0,5,W,3,'#161f21');
 for(let x=0;x<W;x+=21){const even=(Math.floor(x/21)%2)===0;
   box(g,x+(even?0:3),8,19,13,even?p.wall:p.mortar);box(g,x+1,8,17,1,p.wallLit);
   box(g,x,22,20,13,p.mortar);box(g,x+2,24,15,1,p.wallLit);
   box(g,x+1,35,19,11,even?p.wall:p.slab);box(g,x,48,20,3,p.wallLit);
 }
 box(g,0,15,W,2,'#111f22');box(g,0,30,W,2,'#0c191c');box(g,0,48,W,3,'#071115');
}
function gate(g:G,cx:number,time:number){
 const glow=.52+.18*Math.sin(time*.7);
 ellipse(g,cx,47,67,21,'#000b');
 shape(g,[[cx-50,60],[cx-52,34],[cx-43,10],[cx-25,-4],[cx+25,-4],[cx+43,10],[cx+52,34],[cx+50,60]],'#071417');
 shape(g,[[cx-46,57],[cx-45,31],[cx-36,10],[cx-23,-3],[cx+23,-3],[cx+36,10],[cx+45,31],[cx+46,57]],'#3d5047');
 shape(g,[[cx-38,57],[cx-38,33],[cx-31,16],[cx-18,3],[cx+18,3],[cx+31,16],[cx+38,33],[cx+38,57]],'#122123');
 shape(g,[[cx-27,52],[cx-27,32],[cx-21,18],[cx-11,7],[cx+11,7],[cx+21,18],[cx+27,32],[cx+27,52]],'#08131a');
 // Iron jaws around an extinguished fate door.
 for(const side of [-1,1]){
  stroke(g,[[cx+side*37,55],[cx+side*36,31],[cx+side*28,13],[cx+side*16,3]],'#8d8662',2);
  stroke(g,[[cx+side*16,4],[cx+side*26,20],[cx+side*31,37]],'#182b2a',3);
  for(let y=22;y<52;y+=9)box(g,cx+side*41-1,y,3,3,'#ae9b73');
 }
 const aura=g.createRadialGradient(cx,38,2,cx,38,41);aura.addColorStop(0,`rgba(122,208,179,${.24*glow})`);aura.addColorStop(1,'#4fbaa000');g.fillStyle=aura;g.fillRect(cx-44,2,88,72);
 stroke(g,[[cx,15],[cx,45]],'#80b7a8',2);stroke(g,[[cx-9,27],[cx+9,27]],'#80b7a8',2);
 stroke(g,[[cx-9,38],[cx,29],[cx+9,38]],'#456f67',1);
 box(g,cx-62,53,124,7,'#171f20');box(g,cx-57,51,114,3,'#b19a6c');box(g,cx-61,58,122,3,'#435c51');
 box(g,cx-65,61,130,7,'#101c1d');
}
function floor(g:G,W:number,H:number,time:number,family:Family){
 const p=BASE_MASONRY[family];
 const grad=g.createLinearGradient(0,0,W,H);grad.addColorStop(0,p.mortar);grad.addColorStop(.52,p.slab);grad.addColorStop(1,'#0b181c');g.fillStyle=grad;g.fillRect(0,0,W,H);
 // Offset masonry tiles, mortar and authored hand-chiseled notches.
 for(let row=0;row<Math.ceil(H/tileSize)+1;row++){
  for(let col=-1;col<Math.ceil(W/tileSize)+1;col++){
   const x=col*tileSize+((row&1)?tileSize*.5:0),y=row*tileSize;
   const n=floorHash(col,row)%11;
   box(g,x,y,tileSize-1,tileSize-2,n<2?p.slabLit:n<6?p.slab:n<9?p.mortar:p.wall);
   box(g,x+3,y+2,tileSize-7,1,p.wallLit);box(g,x+2,y+tileSize-4,tileSize-5,1,'#0c1c20');
   if(n===3||n===7)stroke(g,[[x+7,y+18],[x+13,y+10],[x+18,y+13],[x+21,y+6]],p.accent,1);
   if(n===6){box(g,x+22,y+9,2,2,p.glint);box(g,x+24,y+11,2,1,'#4b765e');}
   if(n===10){box(g,x+7,y+15,3,2,p.accent);box(g,x+19,y+21,2,2,'#56715d');}
  }
 }
 // Soot and floor-side shadows don't enter any separate HUD area.
 const shade=g.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#050e1199');shade.addColorStop(.45,'#111c1a00');shade.addColorStop(1,'#0612168b');g.fillStyle=shade;g.fillRect(0,0,W,H);
 // Real room geometry integrated with the display edges, no UI masking.
 box(g,0,0,12,H,'#071417');box(g,W-12,0,12,H,'#071417');
 box(g,0,H-13,W,13,'#101d1e');box(g,0,H-13,W,2,'#4c6458');
 box(g,0,0,W,4,'#172625');
 // Central engraved Wyrd-knot; it is painted onto the floor and does not obstruct controls.
 const cx=W*.5,cy=H*.55;
 const glow=.52+.12*Math.sin(time*.8);
 ellipse(g,cx,cy+20,67,27,'#091c1c9e','#526d5a');
 ellipse(g,cx,cy+20,54,22,'#132826b0','#8a7955');
 ellipse(g,cx,cy+20,42,17,'#152c2b70','#4b8274');
 for(let i=0;i<16;i++){
  const a=i*Math.PI/8;
  const ox=cx+59*Math.cos(a),oy=cy+20+24*Math.sin(a);
  box(g,ox-1,oy-1,i%4===0?4:2,i%4===0?3:2,i%4===0?'#b4a672':'#5b917b');
 }
 const flare=g.createRadialGradient(cx,cy+20,7,cx,cy+20,61);flare.addColorStop(0,`rgba(55,149,126,${.09*glow})`);flare.addColorStop(1,'#1d5d4a00');g.fillStyle=flare;g.fillRect(cx-65,cy-42,130,125);
 stroke(g,[[cx-17,cy+27],[cx,cy+10],[cx+17,cy+27],[cx,cy+37],[cx-17,cy+27]],'#648c75',1);
}
function root(g:G,pts:Point[],width:number){
 g.lineCap='round';g.lineJoin='round';stroke(g,pts,'#071415',width+6);stroke(g,pts,'#25382f',width+2);stroke(g,pts,'#435544',Math.max(1,width*.42));
}
function relief(g:G,x:number,y:number,scale:number,right:boolean){
 g.save();g.translate(x,y);g.scale(right?-scale:scale,scale);
 shape(g,[[-12,17],[-15,-14],[-8,-31],[6,-37],[15,-31],[18,17]],'#0b1718');
 shape(g,[[-9,16],[-11,-14],[-5,-29],[6,-34],[13,-28],[15,16]],'#43564d');
 stroke(g,[[-6,-25],[-7,4],[5,1],[7,-25]],'#91a38b',2);
 stroke(g,[[-3,-12],[4,-23],[7,-16],[4,-6],[-3,-12]],'#98bd9e',1);
 box(g,-9,12,26,5,'#1a2b2a');g.restore();
}
function column(g:G,x:number,y:number,scale:number){
 g.save();g.translate(x,y);g.scale(scale,scale);
 shape(g,[[-14,8],[-14,-47],[-10,-58],[8,-58],[13,-47],[13,8]],'#071517');
 shape(g,[[-11,8],[-11,-46],[-8,-55],[4,-55],[10,-48],[10,8]],'#374b44');
 box(g,-16,-48,32,6,'#716b52');box(g,-19,-51,38,4,'#b29d69');
 box(g,-15,5,31,7,'#273c35');box(g,-16,8,34,3,'#5a6853');
 for(let yy=-39;yy<-1;yy+=12){box(g,-5,yy,3,3,'#7f9f88');box(g,4,yy+6,2,2,'#a89467');}
 stroke(g,[[-8,-42],[-8,-1]],'#738979',1);stroke(g,[[7,-41],[7,-2]],'#1b2c2b',2);
 g.restore();
}
function brazier(g:G,x:number,y:number,t:number){
 const glow=g.createRadialGradient(x,y-17,1,x,y-17,39);
 glow.addColorStop(0,'#e1a04b54');glow.addColorStop(.52,'#d5913128');glow.addColorStop(1,'#cb7c1800');g.fillStyle=glow;g.fillRect(x-39,y-57,78,78);
 box(g,x-3,y-6,7,19,'#1a2120');box(g,x-8,y-8,17,5,'#ad8756');box(g,x-6,y-11,13,3,'#191c1b');
 const h=13+3*Math.sin(t*3.3+x);
 shape(g,[[x-6,y-12],[x-7,y-21],[x-2,y-25-h],[x+1,y-20],[x+6,y-27-h*.65],[x+7,y-16],[x+3,y-11]],'#f5a858');
 shape(g,[[x-3,y-15],[x-2,y-22],[x+1,y-24-h*.4],[x+3,y-15]],'#ffecad');
 for(let i=0;i<3;i++)box(g,x+Math.sin(t+i*2+x)*7,y-30-(t*13+i*11)%19,2,2,'#eab669');
}
function sarcophagus(g:G,x:number,y:number){
 g.save();g.translate(x,y);shape(g,[[-18,25],[-17,-10],[-12,-23],[10,-23],[17,-12],[18,25]],'#081719');
 shape(g,[[-14,20],[-14,-10],[-9,-19],[8,-19],[13,-9],[14,20]],'#53675a');
 box(g,-13,-7,26,23,'#273b38');box(g,-9,-4,18,15,'#2e514b');
 stroke(g,[[0,-12],[0,10]],'#97b4a0',2);stroke(g,[[-6,-2],[6,-2]],'#97b4a0',2);
 box(g,-19,21,38,7,'#212e2b');box(g,-17,23,33,2,'#7f7557');g.restore();
}
/** Pure drawing layer. Inputs are actual camera bounds and animation time. */
export function paintSanctuary(g:G,W:number,H:number,t:number,family:string='ROOT',variant=0){
 if(!Object.hasOwn(BASE_MASONRY,family))throw new RangeError('Unknown chamber base');
 const chosen=family as Family;
 floor(g,W,H,t,chosen);wall(g,W,chosen);gate(g,W*.5,t);
 // Columns are outside the central dodge ring, with strong original silhouettes.
 column(g,35,H*.38,1.0);column(g,W-35,H*.38,1.0);
 column(g,48,H*.91,.83);column(g,W-48,H*.91,.83);
 if(chosen==='ROOT'){
  sarcophagus(g,75,H*.70);sarcophagus(g,W-75,H*.70);
  // The living roots are a ROOT material, not a generic dungeon texture.
  root(g,[[0,H*.63],[15,H*.59],[26,H*.49],[40,H*.45],[56,H*.37]],7);
  root(g,[[W,H*.64],[W-18,H*.58],[W-29,H*.50],[W-42,H*.42],[W-58,H*.39]],7);
  root(g,[[0,H*.89],[26,H*.82],[47,H*.89],[77,H*.80]],10);
  root(g,[[W,H*.90],[W-24,H*.84],[W-47,H*.87],[W-76,H*.79]],10);
 }else paintChamberSetpieces(g,W,H,t,chosen,variant);
 relief(g,W*.18,H*.82,.64,false);relief(g,W*.82,H*.82,.64,true);
 brazier(g,W*.5-57,73,t);brazier(g,W*.5+57,73,t);
 // Irregular iron bound wall seams provide shape without false enemy/projectile cues.
 stroke(g,[[0,H*.38],[20,H*.37],[30,H*.35]],'#7e7051',2);
 stroke(g,[[W,H*.42],[W-21,H*.4],[W-31,H*.37]],'#7e7051',2);
 const v=g.createRadialGradient(W/2,H*.52,Math.min(W,H)*.13,W/2,H*.52,Math.max(W,H)*.74);
 v.addColorStop(0,'#0000');v.addColorStop(1,'#000000b5');g.fillStyle=v;g.fillRect(0,0,W,H);
}
/** Frame-based hero with eight-direction facing cues, idle and locomotion frames.
 * Pure art state: real hitboxes/weapon damage are future milestones.
 */
/** Full Wayfarer silhouette with distinct eight-direction helmet, active attack
 * recoil, alternating boots and cloak panels. All paint remains WORLD SPACE. */
export function drawWayfarer(g:G,x:number,y:number,t:number,dx:number,dy:number,aimX:number,aimY:number,firing:boolean,reducedMotion=false){
 const m=wayfarerPose(t,dx,dy,aimX,aimY,firing);
 const faceX=m.aimX,faceY=m.aimY;
 g.save();g.translate(Math.round(x),Math.round(y));
 // Matte floor shadow: important for showing feet remain on solid ground.
 ellipse(g,0,23,17,5,'#020b0bb8');
 ellipse(g,0,21,12,3,'#273b393b');
 // Two independent boots alternate in movement, with heel and toe plates.
 box(g,-10,15+m.bootLeft,8,8,'#1c2928');
 box(g,-9,17+m.bootLeft,7,5,'#8b7553');
 box(g,3,15+m.bootRight,8,8,'#1c2928');
 box(g,3,17+m.bootRight,7,5,'#927958');
 box(g,-8,20+m.bootLeft,7,2,'#d0b37b');
 box(g,4,20+m.bootRight,7,2,'#d0b37b');
 // Inverted triangular split cloak with moving border, never a square blob.
 shape(g,[[-11,-3],[-15,10],[-13+m.cape,20],[-3,17],[0,18],[4,17],[13-m.cape,20],[15,9],[11,-3]],'#0e2329');
 shape(g,[[-9,-1],[-12,12],[-9+m.cape,17],[0,14],[9-m.cape,17],[12,12],[9,-1]],m.back?'#30545a':'#2b5961');
 stroke(g,[[-10,3],[-9,14],[-8,17]],'#76a6a1',1.4);
 stroke(g,[[10,3],[9,14],[8,17]],'#789a8d',1.4);
 // Layered chest mail and four sharply readable gold armor corners.
 box(g,-11,-4,22,17,'#172b2f');
 box(g,-8,-3,16,13,'#56736c');
 box(g,-5,0,10,8,m.back?'#364b4e':'#25474e');
 box(g,-8,10,16,3,'#c3a36b');
 for(const sx of [-1,1]){
  box(g,sx*9-3,-5+m.shoulder,7,7,'#7f8c79');
  box(g,sx*9-3,-6+m.shoulder,7,2,'#e4bf7b');
  box(g,sx*11-2,3,5,10,'#41545a');
  box(g,sx*11-2,8,5,2,'#aeb8a3');
 }
 // Forged helmet with embossed brow, crested ridge and orientation-specific visor.
 shape(g,[[-10,-6],[-12,-17],[-6,-25],[4,-25],[11,-19],[12,-7],[7,1],[-7,1]],'#102129');
 shape(g,[[-8,-17],[-3,-23],[5,-22],[9,-17],[8,-7],[-7,-7]],'#81938a');
 box(g,-8,-21,16,3,'#c1b18a');box(g,-1,-27,3,9,'#deb778');
 box(g,-6,-18,12,2,m.back?'#394f51':'#e9c58d');
 if(m.back){
  box(g,-6,-12,12,6,'#38585b');
  box(g,-3,-8,6,3,'#6b8a83');
 }else if(m.side!==0){
  // Side and diagonal profiles reveal a single glowing eye under a sloping cheek.
  box(g,m.side>0?1:-5,-12,5,3,'#e5f3d7');
  box(g,m.side>0?4:-6,-10,4,5,'#2e4c4a');
  box(g,m.side>0?-7:5,-10,3,6,'#6b8177');
 }else{
  box(g,-6,-12,4,3,'#e5f4da');box(g,3,-12,4,3,'#e5f4da');
  box(g,-3,-7,7,3,'#263e41');
 }
 paintWayfarerEmblems(g,m,t);
 paintWayfarerProfile(g,m,t);
 paintWayfarerFrames(g,m,t,reducedMotion);
 // An active runebound weapon reads as the same arm that launches Soulbolts.
 const handX=faceX*18,handY=faceY*15-3;
 const recoil=m.recoil*3;
 stroke(g,[[m.side<0?-5:5,-3],[handX-faceX*recoil,handY-faceY*recoil]],'#c1a984',3.5);
 ellipse(g,handX-faceX*recoil,handY-faceY*recoil,5,5,'#16383b');
 ellipse(g,handX-faceX*recoil,handY-faceY*recoil,3.2,3.2,firing?'#e6ffd1':'#a3ded1');
 // A three-rune firing crown remains tiny enough not to obscure enemy warnings.
 if(firing){
  const ux=handX-faceX*recoil,uy=handY-faceY*recoil;
  stroke(g,[[ux-4,uy-5],[ux,uy-8],[ux+4,uy-5]],'#ffdf95',1.1);
  box(g,ux-1,uy-1,2,2,'#fff4ca');
 }
 g.restore();
}
