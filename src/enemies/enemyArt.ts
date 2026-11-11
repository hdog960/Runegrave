/** Original, deliberately shape-distinct 32-bit-inspired enemy sprites and visible warnings.
 * Rendered strictly inside the scene canvas; only in-world combat information is drawn here.
 */
import type { Enemy,HostileEncounter } from './encounters.js';
import { drawRuneDoor } from '../scene/doorArt.js';
import { enemyVisualMotion, clampWarningLabel, visibleWarningEnd } from './visualMotion.js';
import { warningBeat, warningLabelY, drawWarningBeats } from './warningClarity.js';
import { paintHostileProjectiles } from './hostileProjectileArt.js';
import { paintHostileAtlas } from '../scene/pixelSpriteAtlas.js';
const px=(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
/** Each hostile has a concrete, behavior-specific tell, not an interchangeable flash. */
export const ENEMY_ATTACK_TELLS=Object.freeze({
 draugr:{label:'CLAW',color:'#f5c78b'},
 wisp:{label:'SPIRIT SHOT',color:'#9fe6f2'},
 archer:{label:'AIMED SHOT',color:'#f3cb94'},
 charger:{label:'CHARGE!',color:'#ffa47a'},
 sentinel:{label:'RUNE VOLLEY',color:'#f5c27d'},
 shade:{label:'BLINK',color:'#c6b2fa'},
 warden:{label:'WARDEN STRIKE',color:'#f6a37b'}
} as const);

function lineHead(g:CanvasRenderingContext2D,x:number,y:number,dx:number,dy:number,color:string){
 const nx=-dy,ny=dx;
 g.fillStyle=color;g.beginPath();g.moveTo(x,y);
 g.lineTo(x-dx*11+nx*5,y-dy*11+ny*5);
 g.lineTo(x-dx*11-nx*5,y-dy*11-ny*5);g.closePath();g.fill();
}
function runeWarning(g:CanvasRenderingContext2D,e:Enemy,t:number){
 if(e.state!=='warning')return;
 const tell=ENEMY_ATTACK_TELLS[e.kind];
 const imminent=warningBeat(e.windup)===3;
 const r=e.radius+9+Math.sin(t*11)*1.5;
 const tf=g.getTransform();
 const worldWidth=tf.a>0?g.canvas.width/tf.a:420;
 const worldHeight=tf.d>0?g.canvas.height/tf.d:240;
 g.save();
 // Telegraph sits in world space around the attacker; the central HUD remains empty.
 g.strokeStyle=imminent?'#ff684f':tell.color;
 g.lineWidth=imminent?3:2;
 g.beginPath();g.arc(e.x,e.y,r,0,Math.PI*2);g.stroke();
 g.strokeStyle=imminent?'#ffab8a':tell.color;g.lineWidth=1.5;
 for(let a=0;a<4;a++){
   const theta=Math.PI*a/2+t*.25,x=e.x+Math.cos(theta)*(r+5),y=e.y+Math.sin(theta)*(r+5);
   px(g,x-3,y-2,6,4,imminent?'#ff855e':tell.color);
 }
 if(e.kind==='charger'||e.kind==='archer'||e.kind==='warden'){
   const length=e.kind==='charger'?104:e.kind==='warden'?117:124;
   const endpoint=visibleWarningEnd(e.x,e.y,e.dx,e.dy,length,worldWidth,worldHeight);
   const endX=endpoint.x,endY=endpoint.y;
   g.strokeStyle=imminent?'#ff6b4b':'#f7c883';g.lineWidth=imminent?2.5:1.7;
   g.setLineDash([7,4]);g.beginPath();g.moveTo(e.x,e.y);g.lineTo(endX,endY);g.stroke();g.setLineDash([]);
   // The tip indicates where the windup will travel. Arrowheads and a targeted
   // endpoint stay visible in both color-vision and reduced-motion modes.
   const nx=-e.dy,ny=e.dx;
   lineHead(g,endX,endY,e.dx,e.dy,imminent?'#ff816a':tell.color);
   if(e.kind==='charger'){
     g.strokeStyle=imminent?'#ff816a':'#aa7658';g.lineWidth=1;
     for(const side of [-1,1]){g.beginPath();g.moveTo(e.x+nx*12*side,e.y+ny*12*side);g.lineTo(endX+nx*12*side,endY+ny*12*side);g.stroke();}
   }else{
     g.strokeStyle=imminent?'#ff9b7c':'#dfc18e';g.lineWidth=1;
     g.beginPath();g.arc(endX,endY,6,0,Math.PI*2);g.stroke();
   }
 }else if(e.kind==='sentinel'||e.kind==='wisp'){
   // Distinguish an expanding volley from a single spirit shot.
   g.strokeStyle=tell.color;g.lineWidth=1.4;g.beginPath();
   g.arc(e.x,e.y,e.radius+(e.kind==='sentinel'?18:14),0,Math.PI*2);g.stroke();
 }

 // Short, specific attack labels appear ONLY during windup, not as permanent text clutter.
 const text=tell.label,wide=Math.max(33,Math.ceil(text.length*4.65)+10);
 const yy=warningLabelY(e.y,e.radius,worldHeight,e.kind==='warden');
 const labelX=clampWarningLabel(e.x,wide,worldWidth);
 g.fillStyle='#09191dec';g.fillRect(Math.round(labelX-wide/2),Math.round(yy-13),wide,19);
 g.strokeStyle=imminent?'#ff856c':tell.color;g.lineWidth=1;g.strokeRect(Math.round(labelX-wide/2),Math.round(yy-13),wide,19);
 g.fillStyle=imminent?'#ffddd0':'#fff1d5';g.font='bold 8px system-ui,sans-serif';g.textAlign='center';g.fillText(text,labelX,yy-3);
 drawWarningBeats(g,labelX,yy,e.windup,imminent?'#ff8f78':tell.color);
 if(imminent){g.fillStyle='#ff8d70';g.beginPath();g.arc(e.x,e.y-e.radius-4,2.5,0,Math.PI*2);g.fill();}
 g.restore();
}

/** v0.09.21: coherent atlas ink, one authentic windup silhouette.
 * Historic stacked pose/armor painters remain independently unit-tested, but
 * no longer pile competing shapes over one enemy or cover the real tell.
 */
function sprite(g:CanvasRenderingContext2D,e:Enemy,t:number,reducedMotion=false){
 const x=Math.round(e.x),y=Math.round(e.y);
 const motion=enemyVisualMotion(e,reducedMotion?0:t);
 g.save();g.translate(x,y+motion.bob);g.scale(motion.facing,1);
 if(motion.lean&&!reducedMotion)g.rotate(motion.lean*(motion.facing===1?1:-1));
 g.fillStyle='#0009';g.beginPath();g.ellipse(0,e.radius*.7,e.radius+3,4,0,0,Math.PI*2);g.fill();
 paintHostileAtlas(g,e,t,reducedMotion);
 // One deliberate species-specific shape is enough beside authoritative world warnings.
 // New authored single weapon silhouette lives inside the atlas. The world
 // warning ring and directional lance remain the only separate attack tell.
 g.restore();
 if(e.hp<e.maxHp || e.kind==='warden'||e.state==='warning'){
  const width=e.kind==='warden'?45:19;
  px(g,x-width/2,y-e.radius-17,width,4,'#171d21');
  px(g,x-width/2,y-e.radius-17,width*e.hp/e.maxHp,3,e.kind==='warden'?'#d3a15c':'#b5c68a');
 }
}
export function drawEncounter(g:CanvasRenderingContext2D,encounter:HostileEncounter,t:number,relicCollected=true,reducedMotion=false){
 const state=encounter.snapshot;
 for(const e of state.enemies){if(!e.alive)continue;
   if(e.state==='hidden'){
     g.strokeStyle='#a697c1';g.setLineDash([2,3]);g.beginPath();g.arc(e.x,e.y,e.radius+6,0,Math.PI*2);g.stroke();g.setLineDash([]);continue;
   }
   runeWarning(g,e,t);sprite(g,e,t,reducedMotion);
 }
 paintHostileProjectiles(g,state.projectiles,t);
 // Large recognizable carved doorway with LOCKED / EXIT sign and compass arrow.
 drawRuneDoor(g,encounter.exit,encounter.exitDirection,state.phase==='gate'&&relicCollected,t);
}
