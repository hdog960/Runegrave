/** Gate A v0.09.9: real-event-only, bounded world-space animation.
 * Wayfarer footsteps and defeated enemy soul ash are cosmetic. Fixed-step physics
 * owns their lifetime; render frames and browser clocks cannot advance them.
 * No new hitboxes, controls, DOM overlays or game RNG streams are involved.
 */
import type {Vec2} from '../physics/world.js';
import type {Enemy} from '../enemies/encounters.js';
import type {FirstRoom} from '../run/firstSoul.js';
import {paintDeathRite} from './sagaDeathRites.js';

type Family=FirstRoom['family'];
type Trail={x:number;y:number;side:number;age:number;life:number};
type Dissolve={x:number;y:number;radius:number;age:number;life:number;kind:Enemy['kind']};
export const TRAIL_CAP=14;
export const DISSOLVE_CAP=8;
export const GROUND_COLORS:Readonly<Record<Family,readonly [string,string]>>=Object.freeze({
 ASH:['#cb9a65','#5b4c40'],IRON:['#b7c7c7','#53616c'],ROOT:['#a2cf96','#3a7658'],
 SPIRIT:['#c5b7ed','#666eaa'],FATE:['#e8c78d','#8b7652']
});
const finite=(p:Vec2)=>Number.isFinite(p.x)&&Number.isFinite(p.y);
const cap=<T>(items:T[],n:number)=>{while(items.length>n)items.shift();};
export class MotionTrails {
 private footsteps:Trail[]=[];
 private dissolves:Dissolve[]=[];
 private tracked=new Map<string,boolean>();
 private stride=0;
 private foot=0;
 get state(){return {footsteps:this.footsteps.length,dissolves:this.dissolves.length,tracked:this.tracked.size};}
 reset(){this.footsteps.length=0;this.dissolves.length=0;this.tracked.clear();this.stride=0;this.foot=0;}
 /** Observe only real living->dead state transitions, including boss defeat.
  * New waves may add fresh IDs without producing false death effects. */
 observeEnemies(enemies:readonly Pick<Enemy,'id'|'alive'|'kind'|'radius'|'x'|'y'>[]){
  for(const enemy of enemies){
   const was=this.tracked.get(enemy.id);
   if(was===true&&!enemy.alive&&Number.isFinite(enemy.x+enemy.y)){
    this.dissolves.push({x:enemy.x,y:enemy.y,radius:enemy.radius,kind:enemy.kind,age:0,life:enemy.kind==='warden'?.92:.55});
    cap(this.dissolves,DISSOLVE_CAP);
   }
   this.tracked.set(enemy.id,enemy.alive);
  }
 }
 /** Called once per 120-Hz physics step, and only then. */
 step(dt:number,hero:Vec2,velocity:Vec2){
  if(!(dt>0&&dt<=1/30)||!finite(hero)||!finite(velocity))throw new RangeError('Motion trails require valid fixed-step coordinates');
  for(let i=this.footsteps.length-1;i>=0;i--){this.footsteps[i]!.age+=dt;if(this.footsteps[i]!.age>=this.footsteps[i]!.life)this.footsteps.splice(i,1);}
  for(let i=this.dissolves.length-1;i>=0;i--){this.dissolves[i]!.age+=dt;if(this.dissolves[i]!.age>=this.dissolves[i]!.life)this.dissolves.splice(i,1);}
  const speed=Math.min(1,Math.hypot(velocity.x,velocity.y));
  if(speed<.17){this.stride=0;return;}
  this.stride+=dt*speed;
  if(this.stride<.17)return;
  this.stride-=.17;
  const mag=Math.hypot(velocity.x,velocity.y);const ux=velocity.x/mag,uy=velocity.y/mag;
  const perp={x:-uy,y:ux};this.foot=1-this.foot;
  const side=this.foot===0?-1:1;
  const x=hero.x-ux*12+perp.x*side*5,y=hero.y-uy*12+perp.y*side*5+12;
  this.footsteps.push({x,y,side,age:0,life:.7});cap(this.footsteps,TRAIL_CAP);
 }
 /** Underlying surface marks: behind enemies, bullets, hero, and critical tells. */
 paintGround(g:CanvasRenderingContext2D,W:number,H:number,family:Family='ROOT',reduced=false){
  if(reduced||!Object.hasOwn(GROUND_COLORS,family))return;
  const [light,shadow]=GROUND_COLORS[family]!;g.save();
  for(const f of this.footsteps){
   if(f.x<9||f.x>W-9||f.y<65||f.y>H-9)continue;
   g.globalAlpha=.36*(1-f.age/f.life);
   g.fillStyle=shadow;g.fillRect(Math.round(f.x-3),Math.round(f.y-1),6,4);
   g.fillStyle=light;g.fillRect(Math.round(f.x-2),Math.round(f.y-2),4,2);
   g.fillRect(Math.round(f.x+f.side),Math.round(f.y+2),2,2);
  }
  g.restore();
 }
 /** Actual living-to-dead ONLY. Seven species-specific chiseled soul-ash
  * silhouettes replace every shared circle. Painted behind living combat. */
 paintDissolves(g:CanvasRenderingContext2D,W:number,H:number,reduced=false){
  if(reduced)return;
  for(const b of this.dissolves)if(b.x>=0&&b.x<=W&&b.y>=0&&b.y<=H)paintDeathRite(g,b,W,H);
 }

}
