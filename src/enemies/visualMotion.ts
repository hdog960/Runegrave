/** Pure, bounded visual animation frames. Nothing here changes enemy AI, hitboxes,
 * windups or physics. When render t=0 (reduced-motion preference) every pose is steady. */
import type { EnemyKind, Enemy } from './encounters.js';
export type EnemyVisualMotion=Readonly<{
 facing:1|-1; step:0|1; bob:number; pulse:number; lean:number; strike:boolean
}>;
export function enemyVisualMotion(enemy:Pick<Enemy,'kind'|'state'|'dx'|'dy'|'phase'>, time:number):EnemyVisualMotion {
 if(!Number.isFinite(time))throw new RangeError('Invalid animation time');
 const moving=enemy.state==='charge';
 const stride=Math.floor(Math.max(0,time)*(moving?14:enemy.kind==='draugr'?7:4));
 const step=(stride%2) as 0|1;
 const hovering=enemy.kind==='wisp'||enemy.kind==='shade';
 const bob=hovering?Math.round(Math.sin(time*4)*2):moving?(step?1:-1):Math.round(Math.sin(time*2)*.65);
 const pulse=.5+.5*Math.sin(time*(enemy.kind==='warden'?4:5)+enemy.kind.length);
 const lean=enemy.state==='warning'?.06:enemy.state==='charge'?.16:0;
 return {facing:enemy.dx<-.08?-1:1,step,bob,pulse,lean,strike:enemy.state==='warning'||enemy.state==='charge'};
}
export function clampWarningLabel(x:number,labelWidth:number,worldWidth:number):number {
 if(!(worldWidth>=80&&labelWidth>0))throw new RangeError('Invalid warning frame');
 return Math.min(worldWidth-labelWidth/2-3,Math.max(labelWidth/2+3,x));
}
/** Warning lines stay visible to the actual center canvas edge, not behind rails. */
export function visibleWarningEnd(x:number,y:number,dx:number,dy:number,length:number,width:number,height:number){
 const margin=9;
 return {x:Math.max(margin,Math.min(width-margin,x+dx*length)),
         y:Math.max(margin,Math.min(height-margin,y+dy*length))};
}
