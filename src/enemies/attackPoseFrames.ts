/** Gate A v0.09.13: distinct directional silhouette/action frames for all
 * six hostile types and the Warden. Never changes their state or hitboxes. */
import type { Enemy, EnemyKind } from './encounters.js';
type G=CanvasRenderingContext2D;
export const ENEMY_ACTION_FRAMES=Object.freeze({
 draugr:'lunging-claw',wisp:'orbit-and-pulse',archer:'bow-draw',charger:'braced-charge',
 sentinel:'radial-cast',shade:'veil-dissolve',warden:'root-maul'
} as const satisfies Record<EnemyKind,string>);
export type EnemyFrame=Readonly<{stage:'idle'|'windup'|'strike';direction:'north'|'south'|'side';frame:0|1|2|3}>;
export function enemyActionFrame(e:Pick<Enemy,'kind'|'state'|'dx'|'dy'>,t:number,reducedMotion=false):EnemyFrame {
 if(!Object.hasOwn(ENEMY_ACTION_FRAMES,e.kind)||!Number.isFinite(t)||!Number.isFinite(e.dx)||!Number.isFinite(e.dy))throw new RangeError('Invalid enemy animation frame');
 const stage=e.state==='warning'?'windup':e.state==='charge'?'strike':'idle';
 const direction=e.dy<-.45?'north':e.dy>.45?'south':'side';
 const frame=(reducedMotion?0:Math.floor(Math.max(t,0)*(stage==='idle'?5:12))%4) as 0|1|2|3;
 return {stage,direction,frame};
}
/** Render inside the enemy's translated/rotated character group. */
export function paintEnemyActionFrame(g:G,e:Pick<Enemy,'kind'|'state'|'dx'|'dy'|'phase'>,t:number,reducedMotion=false):void {
 const a=enemyActionFrame(e,t,reducedMotion),active=a.stage!=='idle';
 const k=a.frame,tilt=a.direction==='north'?-1:a.direction==='south'?1:0;
 const px=(x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x1:number,y1:number,x2:number,y2:number,c:string,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
 g.save();
 switch(e.kind){
  case 'draugr':{ // shoulder advances, iron claws open into a three-prong slash
   const reach=active?5+(k%2)*3:0;
   px(-13,-12+tilt,5,9,'#344f4b');px(10,-10-reach,6,10,'#83988d');
   for(let n=0;n<3;n++)line(15,-9-reach+n*3,21+reach,-12-reach+n*3,active?'#ffdaa6':'#b7a884',1.4);
   break;
  }
  case 'wisp':{ // two offset ghostglass petals with pulsing interior
   const drift=active?4:2;
   line(-5,-7,-10-drift,-12+tilt,'#abdde9',2);
   line(4,1,9+drift,7+tilt,'#79c4d8',2);
   px(-2,-8-(active?k%2:0),4,6,active?'#fff8d5':'#bce6db');break;
  }
  case 'archer':{ // drawstring visibly pulls back before release
   const pull=active?5+k%2:1;
   line(15,-16,15,8,'#d7c79c',1);
   line(15,-16,15-pull,-5,'#fff0c2',1.3);
   line(15-pull,-5,15,8,'#fff0c2',1.3);
   px(6-pull,-7,10+pull,2,active?'#ffda89':'#aab6a0');break;
  }
  case 'charger':{ // animated front horns and stamped iron hoof plates
   const brace=active?k%2:0;
   px(-15,-20-brace,6,7,'#deba86');px(9,-20-brace,6,7,'#deba86');
   line(-14,-20-brace,-21,-25-brace,active?'#ffe6b1':'#ad9876',2);
   line(14,-20-brace,21,-25-brace,active?'#ffe6b1':'#ad9876',2);
   px(-12,9+brace,8,3,'#aaa084');px(4,9-brace,8,3,'#aaa084');break;
  }
  case 'sentinel':{ // four runic casting talons, radial cast vs idle
   const r=active?19:15;
   for(let n=0;n<4;n++){
    const angle=n*Math.PI/2+(reducedMotion?0:t*.7);
    const x=Math.cos(angle)*r,y=-3+Math.sin(angle)*r;
    px(x-2,y-2,4,4,active?'#ffdf9b':'#97bbb7');
   }break;
  }
  case 'shade':{ // torn cloak is temporarily projected for blink windup
   const extension=active?7+k%2:2;
   for(const s of [-1,1]){
    line(s*6,0,s*(10+extension),8+tilt,active?'#d6c3f8':'#8d85ac',2);
    line(s*7,5,s*(12+extension),13+tilt,'#665a88',1.5);
   }break;
  }
  case 'warden':{ // two great root mauls lift asymmetrically in phase two
   const lift=active?7+k%2*2:1;
   const c=e.phase>1?'#ffb37c':'#d4c29b';
   for(const s of [-1,1]){
    line(s*19,-5,s*26,-16-lift,c,4);
    px(s*26-5,-22-lift,11,10,'#4b594b');
    px(s*26-4,-23-lift,9,3,c);
   }
   px(-6,-14,12,3,e.phase>1?'#f28a65':'#a8c6ab');break;
  }
 }
 // Geometry, not color alone: braced attack stance adds shoulder chevrons.
 if(active&&e.kind!=='wisp'&&e.kind!=='shade'){
  line(-4,-22,-1,-26,'#fff0c6',1.5);line(1,-26,4,-22,'#fff0c6',1.5);
 }
 g.restore();
}
