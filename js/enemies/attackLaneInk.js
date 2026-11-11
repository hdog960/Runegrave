/** Actual attack silhouettes. No extra attack/projectile, AI or false hazards:
 * charger = genuine existing contact radius and maximum 0.38s travel,
 * archer = one aimed spectral bolt, Warden = five real fan rays and
 * the two phase-two side shots. Time-independent rune-pixel geometry. */
import {HERO_RADIUS} from '../physics/world.js';
import {CHARGER_DASH_SPEED,CHARGER_DASH_DURATION} from './encounters.js';
import {warningBeat} from './warningClarity.js';
export function threatLaneGeometry(e,W,H){
 if(!['charger','archer','warden'].includes(e.kind)||e.state!=='warning')return null;
 if(!Number.isFinite(e.x+e.y+e.dx+e.dy+e.radius+e.windup)||W<80||H<70||e.radius<=0)throw new RangeError('Invalid attack anticipation geometry');
 const len=Math.hypot(e.dx,e.dy);if(len<.25)return null;
 const dx=e.dx/len,dy=e.dy/len;
 const reach=e.kind==='charger'?CHARGER_DASH_SPEED*CHARGER_DASH_DURATION:e.kind==='archer'?124:112;
 const halfWidth=e.kind==='charger'?e.radius+HERO_RADIUS-2:e.kind==='archer'?HERO_RADIUS+2.4:0;
 const angles=e.kind==='warden'?[-.36,-.18,0,.18,.36]:[0];
 const rays=angles.map(angle=>{
  const c=Math.cos(angle),s=Math.sin(angle),x=dx*c-dy*s,y=dy*c+dx*s;
  return {dx:x,dy:y,x:Math.max(9,Math.min(W-9,e.x+x*reach)),y:Math.max(9,Math.min(H-9,e.y+y*reach))};
 });
 return {kind:e.kind,origin:{x:e.x,y:e.y},dx,dy,reach,halfWidth,phase:e.phase,rays};
}
export function paintThreatLane(g,e,W,H){
 const art=threatLaneGeometry(e,W,H);if(!art)return false;
 const urgent=warningBeat(Math.max(0,e.windup))===3;
 const glow=urgent?'#ff9b7d':'#dfc28e',deep=urgent?'#b85848':'#837055';
 const {dx,dy,origin,rays}=art,nx=-dy,ny=dx;
 const line=(x,y,x2,y2,color,w=1)=>{
  g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
 };
 g.save();
 if(art.kind==='charger'){
  // These side rails bound the real collision radius, not an arbitrary 12px line.
  for(const side of [-1,1]){
   const ox=nx*art.halfWidth*side,oy=ny*art.halfWidth*side;
   g.setLineDash([5,5]);
   line(origin.x+ox,origin.y+oy,Math.max(9,Math.min(W-9,origin.x+ox+dx*art.reach)),Math.max(9,Math.min(H-9,origin.y+oy+dy*art.reach)),deep,1.2);
   g.setLineDash([]);
  }
  // Four chipped crossbeams mark the landing corridor, not four attacks.
  for(let n=1;n<=4;n++){
   const k=n/5,x=origin.x+dx*art.reach*k,y=origin.y+dy*art.reach*k,half=art.halfWidth*.7;
   line(x-nx*half,y-ny*half,x+nx*half,y+ny*half,glow,n===4?2:1.3);
  }
 }else if(art.kind==='archer'){
  const tip=rays[0];g.setLineDash([7,4]);
  line(origin.x,origin.y,tip.x,tip.y,glow,1.7);g.setLineDash([]);
  for(const k of [.33,.67,.90]){
   const x=origin.x+(tip.x-origin.x)*k,y=origin.y+(tip.y-origin.y)*k;
   line(x-nx*5,y-ny*5,x+nx*5,y+ny*5,deep,2);
  }
  line(tip.x-dx*9+nx*6,tip.y-dy*9+ny*6,tip.x,tip.y,glow,2);
  line(tip.x-dx*9-nx*6,tip.y-dy*9-ny*6,tip.x,tip.y,glow,2);
 }else{
  // These EXACT five angular offsets are used in the actual Warden fan volley.
  for(let n=0;n<rays.length;n++){
   const q=rays[n];g.setLineDash(n===2?[6,4]:[3,7]);
   line(origin.x,origin.y,q.x,q.y,n===2?glow:deep,n===2?1.8:1);
   g.setLineDash([]);
   const nX=-q.dy,nY=q.dx;
   line(q.x-q.dx*7+nX*4,q.y-q.dy*7+nY*4,q.x,q.y,glow,1);
   line(q.x-q.dx*7-nX*4,q.y-q.dy*7-nY*4,q.x,q.y,glow,1);
  }
  if(e.phase===2)for(const side of [-1,1]){
   const x=origin.x+nx*40*side,y=origin.y+ny*40*side;
   line(origin.x,origin.y,x,y,deep,1.4);
   g.fillStyle=glow;g.fillRect(Math.round(x)-2,Math.round(y)-2,4,4);
  }
 }
 g.restore();return true;
}
