import type {Vec2} from '../physics/world.js';
export type WoundKind='contact'|'ember'|'projectile'|'unknown';
export type WoundMark=Readonly<{x:number;y:number;kind:WoundKind;angle:number|null;amount:number;age:number;life:number}>;
type G=CanvasRenderingContext2D;
/** v0.09.36 Gate A: ORIGINAL physical Norse wound-ink follows only actual
 * lost Mortal Hearts. Three distinguishable damage sources, no fake hazard.
 * Contact and ember cues carry direction only when the source is observed;
 * a consumed soulshot has no known origin and gets no dishonest bearing.
 * Fixed-step expiration, hard cap, and no additional hit/collision logic. */
export const WOUND_KINDS:readonly WoundKind[]=Object.freeze(['contact','ember','projectile','unknown']);
export const WOUND_LIFE=.56;
const SHAPES:Readonly<Record<WoundKind,readonly (readonly [number,number,number,number])[]>>=Object.freeze({
 // Splintered AXE/BROKEN-SHIELD crest (enemy contact).
 contact:[[-24,-24,10,3],[-24,-24,3,14],[-21,-16,6,3],[-14,-25,3,9],
          [14,-24,10,3],[21,-24,3,14],[15,-16,6,3],[11,-25,3,9],
          [-24,21,10,3],[-24,10,3,14],[-21,14,6,3],[-14,16,3,9],
          [14,21,10,3],[21,10,3,14],[15,14,6,3],[11,16,3,9],
          [-27,-1,8,3],[19,-1,8,3],[-1,-27,3,8],[-1,19,3,8]],
 // Four charred FURNACE EMBER wedges (danger floor).
 ember:[[-25,-3,8,6],[-22,-10,3,7],[-22,4,3,7],[-19,-4,3,8],
        [17,-3,8,6],[19,-10,3,7],[19,4,3,7],[16,-4,3,8],
        [-3,-25,6,8],[-10,-22,7,3],[4,-22,7,3],[-4,-19,8,3],
        [-3,17,6,8],[-10,19,7,3],[4,19,7,3],[-4,16,8,3],
        [-20,-20,6,3],[14,-20,6,3],[-20,17,6,3],[14,17,6,3]],
 // Six pale, hollow SOULBOLT SHARDS, no direction claimed.
 projectile:[[-26,-2,9,3],[-26,-7,3,5],[-26,2,3,5],[-19,-4,4,7],
        [17,-2,9,3],[23,-7,3,5],[23,2,3,5],[15,-4,4,7],
        [-2,-26,3,9],[-7,-26,5,3],[2,-26,5,3],[-4,-19,7,4],
        [-2,17,3,9],[-7,23,5,3],[2,23,5,3],[-4,15,7,4],
        [-20,-19,4,4],[16,-19,4,4],[-20,15,4,4],[16,15,4,4]],
 unknown:[[-22,-2,5,5],[17,-2,5,5],[-2,-22,5,5],[-2,17,5,5],
          [-17,-17,4,4],[13,-17,4,4],[-17,13,4,4],[13,13,4,4]]
});
export function woundKind(source:string|null|undefined):WoundKind{
 if(typeof source!=='string')return 'unknown';
 if(source.startsWith('enemy:'))return 'contact';
 if(source==='east-ember'||source==='west-ember')return 'ember';
 if(source.startsWith('soulshot:'))return 'projectile';
 return 'unknown';
}
export function woundOriginAngle(kind:WoundKind,hero:Vec2,origin?:Vec2|null):number|null{
 if((kind!=='contact'&&kind!=='ember')||!origin)return null;
 if(!Number.isFinite(origin.x+origin.y+hero.x+hero.y))return null;
 const dx=origin.x-hero.x,dy=origin.y-hero.y;
 return Math.hypot(dx,dy)<.01?null:Math.atan2(dy,dx);
}
export function paintWoundSigil(g:G,mark:WoundMark,reducedMotion=false):boolean{
 if(!mark||!WOUND_KINDS.includes(mark.kind)||![mark.x,mark.y,mark.life,mark.age,mark.amount].every(Number.isFinite)||mark.age<0||mark.life<=0)throw new RangeError('Invalid live hurt rune');
 if(mark.age>=mark.life)return false;
 const col=mark.kind==='contact'?['#211f23','#cd9075','#ffdfb5']:
           mark.kind==='ember'?['#382422','#d77b45','#ffce83']:
           mark.kind==='projectile'?['#192e36','#80b9c5','#e5f4ec']:
           ['#283333','#afafa1','#e0d5b5'];
 const size=reducedMotion?0:Math.min(2,Math.floor(mark.age/(mark.life/3)));
 g.save();g.translate(Math.round(mark.x),Math.round(mark.y));
 g.globalAlpha=Math.max(.06,Math.min(1,(mark.life-mark.age)/.19));
 for(const [x,y,w,h] of SHAPES[mark.kind]){
  const ox=x<0?-size:x>0?size:0,oy=y<0?-size:y>0?size:0;
  const i=Math.abs(x+y)%3;
  g.fillStyle=col[i]??'#f5dfbe';g.fillRect(x+ox,y+oy,w,h);
 }
 // Only verified contact or floor-ember positions warrant a bearing pointer.
 if(mark.angle!==null){
  g.rotate(mark.angle);
  g.fillStyle=col[2]??'#f5dfbe';
  g.fillRect(27,-2,7,4);g.fillRect(31,-5,3,3);g.fillRect(31,2,3,3);
  g.fillStyle=col[1]??'#f5dfbe';g.fillRect(24,-1,4,2);
  g.rotate(-mark.angle);
 }
 if(mark.amount>=2){g.fillStyle=col[2]??'#f5dfbe';g.fillRect(-29,-4,3,8);g.fillRect(26,-4,3,8);}
 g.restore();return true;
}
export class WoundInk {
 private marks:Array<{x:number;y:number;kind:WoundKind;angle:number|null;amount:number;age:number;life:number}>=[];
 get snapshot():readonly WoundMark[]{return this.marks.map(m=>({...m}));}
 get length():number{return this.marks.length;}
 reset():void{this.marks.length=0;}
 record(hero:Vec2,source:string|null|undefined,origin?:Vec2|null,halfHearts=1):boolean{
  if(!hero||!Number.isFinite(hero.x+hero.y)||!Number.isSafeInteger(halfHearts)||halfHearts<1||halfHearts>100)return false;
  const kind=woundKind(source),angle=woundOriginAngle(kind,hero,origin);
  if(this.marks.length>=4)this.marks.shift();
  this.marks.push({x:hero.x,y:hero.y,kind,angle,amount:halfHearts,age:0,life:WOUND_LIFE});
  return true;
 }
 step(dt:number):void{
  if(!Number.isFinite(dt)||dt<=0||dt>1/30)throw new RangeError('Wound art must follow simulation steps');
  for(let i=this.marks.length-1;i>=0;i--){
   const mark=this.marks[i]!;mark.age+=dt;
   if(mark.age>=mark.life)this.marks.splice(i,1);
  }
 }
 paint(g:G,W:number,H:number,reducedMotion=false):void{
  if(!Number.isFinite(W+H)||W<80||H<70)throw new RangeError('Invalid combat viewport for wounds');
  g.save();g.beginPath();g.rect(0,0,W,H);g.clip();
  for(const m of this.marks)paintWoundSigil(g,m,reducedMotion);
  g.restore();
 }
}
