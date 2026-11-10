/** RUNEGRAVE Gate A v0.09.8 — honest, bounded world-space combat readouts.
 * Only actual events create these marks. Render frames never advance lifetime:
 * fixed-step simulation is the single source of truth, even while paused.
 * No DOM, touch input, randomized placement, layout overlays or heap-growing particles.
 */
import type { Vec2 } from '../physics/world.js';
export type FeedbackKind='hit'|'hurt'|'silver'|'heal'|'relic'|'shatter';
export type FeedbackMark=Readonly<{x:number;y:number;text:string;kind:FeedbackKind;age:number;life:number}>;
const MAX_MARKS=18;
const MAX_TEXT=16;
export const FEEDBACK_CAPACITY=MAX_MARKS;
export function feedbackLabel(kind:FeedbackKind,amount=0):string {
 if(!Number.isFinite(amount)||amount<0)throw new RangeError('Invalid combat feedback amount');
 switch(kind){
  case 'hit':return `-${Math.floor(amount)}`;
  case 'hurt':return `-${formatHearts(amount)} ♥`;
  case 'silver':return `+${Math.floor(amount)} SILVER`;
  case 'heal':return amount>0?`+${formatHearts(amount)} ♥`:'FULL HEARTS';
  case 'relic':return 'RELIC BOUND';
  case 'shatter':return 'SHATTERED';
 }
}
function formatHearts(halfHeartUnits:number){return (halfHeartUnits/2).toFixed(halfHeartUnits%2===0?0:1);}
const COL:Readonly<Record<FeedbackKind,string>>={hit:'#fff0bd',hurt:'#ff9782',silver:'#d6ebbd',heal:'#bcebd3',relic:'#ffe09b',shatter:'#eeae81'};
export class CombatFeedback {
 private readonly marks:Array<{x:number;y:number;text:string;kind:FeedbackKind;age:number;life:number}>=[];
 get snapshot():readonly FeedbackMark[] {return this.marks.map(m=>({...m}));}
 get length():number{return this.marks.length;}
 reset(){this.marks.length=0;}
 add(pos:Vec2,kind:FeedbackKind,amount=0):boolean {
  if(!Number.isFinite(pos.x+pos.y))return false;
  const text=feedbackLabel(kind,amount).slice(0,MAX_TEXT);
  if(this.marks.length>=MAX_MARKS)this.marks.shift();
  this.marks.push({x:pos.x,y:pos.y,text,kind,age:0,life:kind==='relic'?.95:kind==='shatter'?.74:.63});
  return true;
 }
 step(dt:number){
  if(!(dt>0&&dt<=1/30))throw new RangeError('Feedback must follow fixed-step simulation');
  for(let i=this.marks.length-1;i>=0;i--){
   const m=this.marks[i]!;m.age+=dt;
   if(m.age>=m.life)this.marks.splice(i,1);
  }
 }
 /** Clamps text to the central game canvas so it can never render behind grips. */
 paint(g:CanvasRenderingContext2D,width:number,height:number){
  if(!(width>40&&height>80))return;
  g.save();g.font='bold 9px system-ui,sans-serif';g.textAlign='center';g.lineJoin='round';
  for(const m of this.marks){
   const alpha=Math.min(1,(m.life-m.age)/.23);
   if(alpha<=0)continue;
   const textWidth=Math.min(width-16,g.measureText(m.text).width);
   const x=Math.max(8+textWidth/2,Math.min(width-8-textWidth/2,m.x));
   const y=Math.min(height-12,Math.max(16,m.y-21-m.age*22));
   g.globalAlpha=alpha;
   g.lineWidth=3;g.strokeStyle='#102021';g.strokeText(m.text,x,y);
   g.fillStyle=COL[m.kind];g.fillText(m.text,x,y);
  }
  g.restore();
 }
}
/** A short aim indicator anchored to the hero, not an aiming control or full-width laser.
 * The indicator does not imply a clear line of sight through obstacles.
 */
export function paintSoulboltHeading(g:CanvasRenderingContext2D,hero:Vec2,aim:Vec2,firing:boolean,time:number,reducedMotion=false):void {
 if(!firing||!Number.isFinite(aim.x+aim.y+hero.x+hero.y))return;
 const length=Math.hypot(aim.x,aim.y);if(length<.05)return;
 const dx=aim.x/length,dy=aim.y/length,nx=-dy,ny=dx;
 const near=19,far=32;
 g.save();
 g.strokeStyle='#e1d4a2';g.lineWidth=1.3;g.globalAlpha=.65;
 g.beginPath();g.moveTo(hero.x+dx*near,hero.y+dy*near);g.lineTo(hero.x+dx*far,hero.y+dy*far);g.stroke();
 const tip=far+(reducedMotion?0:Math.sin(time*8)*1.2);
 g.fillStyle='#fee6aa';g.globalAlpha=.78;
 g.beginPath();g.moveTo(hero.x+dx*(tip+4),hero.y+dy*(tip+4));
 g.lineTo(hero.x+dx*(tip-3)+nx*3,hero.y+dy*(tip-3)+ny*3);
 g.lineTo(hero.x+dx*(tip-3)-nx*3,hero.y+dy*(tip-3)-ny*3);
 g.closePath();g.fill();
 g.restore();
}
