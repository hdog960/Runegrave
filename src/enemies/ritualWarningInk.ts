import type {Enemy} from './encounters.js';
import type {Vec2} from '../physics/world.js';
type G=CanvasRenderingContext2D;
type RitualActor=Pick<Enemy,'kind'|'state'|'x'|'y'|'radius'|'windup'|'attackCount'>;
/** RUNEGRAVE v0.09.35 — three ORIGINAL NORSE ritual warnings drawn
 * from the enemies' ACTUAL mechanics, not extra projectile graphics.
 * - Wisp tracks the living hero up to firing, so the glass-needle aim is live.
 * - Sentinel glyphs reflect the same six-shot counting formula used by AI.
 * - Shade vanishes and reappears elsewhere: only its CURRENT body folds.
 * One-body warning-only art. No animation clock, AI, collision or future-target lie.
 */
import {sentinelShotVector} from './encounters.js';
const px=(g:G,x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
const edge=(n:number,max:number)=>Math.max(8,Math.min(max-8,n));
export function ritualWarningGeometry(e:RitualActor,hero:Vec2|undefined,W:number,H:number){
 if(!['wisp','sentinel','shade'].includes(e.kind)||e.state!=='warning')return null;
 if(!Number.isFinite(e.x+e.y+e.radius+e.windup)||!Number.isFinite(W+H)||W<80||H<70||e.radius<=0)throw new RangeError('Invalid Norse ritual warning frame');
 if(e.kind==='shade'){
  // Three steps, chosen ONLY from its real original .65-second warning countdown.
  const fold=e.windup>.43?0:e.windup>.22?1:2;
  return {kind:e.kind,rays:[],fold,origin:{x:e.x,y:e.y}};
 }
 if(e.kind==='wisp'){
  // Its shot is aimed at the hero at RELEASE, not locked when windup starts.
  if(!hero||!Number.isFinite(hero.x+hero.y))return null;
  const d=Math.hypot(hero.x-e.x,hero.y-e.y);
  if(d<.01)return null;
  const dx=(hero.x-e.x)/d,dy=(hero.y-e.y)/d;
  const start={x:e.x+dx*(e.radius+5),y:e.y+dy*(e.radius+5)};
  const tip={x:edge(start.x+dx*Math.min(d,80),W),y:edge(start.y+dy*Math.min(d,80),H)};
  return {kind:e.kind,rays:[{dx,dy,start,tip}],fold:-1,origin:{x:e.x,y:e.y}};
 }
 const n=e.attackCount??0;
 if(!Number.isSafeInteger(n)||n<0)throw new RangeError('Invalid original sentry attack count');
 // Six original cast channels are indexed using the *same mutable success
 // counter* as combat; the preview assumes all six potential shots spawn.
 // Actual emission can stop at a wall. This marks directions, not guaranteed hits.
 const rays=Array.from({length:6},(_,slot)=>{
  const {x:dx,y:dy}=sentinelShotVector(slot,n+slot);
  const start={x:e.x+dx*(e.radius+5),y:e.y+dy*(e.radius+5)};
  const tip={x:edge(e.x+dx*39,W),y:edge(e.y+dy*39,H)};
  return {dx,dy,start,tip};
 });
 return {kind:e.kind,rays,fold:-1,origin:{x:e.x,y:e.y}};
}
/** Three recognizably different crafted runes at the real enemy location.
 * All pixels are 1-3 world units and under 200 drawing operations per enemy. */
export function paintRitualWarning(g:G,e:RitualActor,hero:Vec2|undefined,W:number,H:number):boolean{
 const art=ritualWarningGeometry(e,hero,W,H);
 if(!art)return false;
 const glow=e.windup<=.2?'#fce3b1':art.kind==='wisp'?'#aeeffa':art.kind==='sentinel'?'#e2c38b':'#d6baff';
 const deep=art.kind==='wisp'?'#426a79':art.kind==='sentinel'?'#785c43':'#594872';
 const line=(a:number,b:number,c:number,d:number,color:string,width=1)=>{
  g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(Math.round(a),Math.round(b));g.lineTo(Math.round(c),Math.round(d));g.stroke();
 };
 g.save();
 if(art.kind==='wisp'){
  // One hand-etched glass lance follows the actual current hero bearing.
  const ray=art.rays[0]!,{dx,dy,start,tip}=ray,nx=-dy,ny=dx;
  line(start.x,start.y,tip.x,tip.y,deep,3);
  line(start.x,start.y,tip.x,tip.y,glow,1);
  // Notches travel along ONE line, never imply a six-projectile volley.
  for(const u of [.25,.53,.82]){
   const x=start.x+(tip.x-start.x)*u,y=start.y+(tip.y-start.y)*u;
   line(x-nx*4,y-ny*4,x+nx*4,y+ny*4,glow,1);
   px(g,x-1,y-1,2,2,'#e7f9f5');
  }
  line(tip.x-dx*9+nx*5,tip.y-dy*9+ny*5,tip.x,tip.y,glow,2);
  line(tip.x-dx*9-nx*5,tip.y-dy*9-ny*5,tip.x,tip.y,glow,2);
  // A single faceted caster crystal, not a floating HUD label.
  px(g,e.x-4,e.y-4,8,8,deep);px(g,e.x-2,e.y-5,4,10,glow);px(g,e.x-1,e.y-3,2,6,'#e1f7f6');
 }else if(art.kind==='sentinel'){
  // Six direction-bearing rune chisels for six actual radial bolts.
  for(const ray of art.rays){
   const {dx,dy,start,tip}=ray,nx=-dy,ny=dx;
   line(start.x,start.y,tip.x,tip.y,deep,3);
   line(start.x,start.y,tip.x,tip.y,glow,1);
   for(const u of [.55,.83]){
    const x=start.x+(tip.x-start.x)*u,y=start.y+(tip.y-start.y)*u;
    line(x-nx*3,y-ny*3,x+nx*3,y+ny*3,glow,1);
   }
   line(tip.x-dx*5+nx*3,tip.y-dy*5+ny*3,tip.x,tip.y,glow,1);
   line(tip.x-dx*5-nx*3,tip.y-dy*5-ny*3,tip.x,tip.y,glow,1);
  }
  // Forged central six-point seal: nested dark/bronze stone and a cut core.
  px(g,e.x-6,e.y-6,12,12,'#222b28');
  px(g,e.x-5,e.y-5,10,10,deep);
  px(g,e.x-3,e.y-3,6,6,glow);
  px(g,e.x-1,e.y-1,2,2,'#263131');
 }else{
  // The shade gives NO destination marker: its later legal spawn is unknown.
  // Physically inward-folding burial shroud at its existing x/y only.
  const width=[25,18,11][art.fold]!;
  const height=[30,22,14][art.fold]!;
  const x=e.x,y=e.y;
  for(const side of [-1,1]){
   const xx=x+side*width;
   px(g,xx-2,y-height/2,4,height,deep);
   px(g,xx-1,y-height/2+2,2,height-4,glow);
   for(const yy of [-.30,0,.30]){
    const py=y+Math.round(height*yy);
    line(xx,py,x+side*(width-6),py+side*2,glow,1);
   }
  }
  // Sharp unfilled negative-space vortex: signifies vanishing, not damage.
  px(g,x-3,y-8+art.fold*3,6,2,glow);
  px(g,x-6+art.fold*2,y-1,3,3,'#b194d8');
  px(g,x+4-art.fold*2,y-1,3,3,'#b194d8');
  px(g,x-2,y+6-art.fold*2,4,2,glow);
 }
 g.restore();
 return true;
}
