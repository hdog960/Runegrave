import { paintEarnedRelicSeal } from './sagaEarnedRelicSeals.js';
/** RUNEGRAVE Gate A: earned relics leave readable, bounded marks on real combat art.
 * Each mark is strictly world-space presentation. Item bonuses, projectile physics,
 * player radius and all state transitions still live in their original modules.
 */
import type { Soulbolt } from '../combat/soulbolts.js';
import type { RelicId } from './firstSoul.js';
import { RELIC_CRESTS } from './relicCrests.js';
import type { Vec2 } from '../physics/world.js';

type G = CanvasRenderingContext2D;
export const RELIC_ART_CAP=20;
export const BOLT_RELICS:readonly RelicId[]=['wyrd-fang','skald-drum','storm-feather','hugin-lens','ash-anchor'];
const px=(g:G,x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
export function relicAppearance(owned:readonly RelicId[]){
  if(owned.length>8||new Set(owned).size!==owned.length||owned.some(x=>!RELIC_CRESTS[x]))throw new RangeError('Invalid acquired relic visual loadout');
  const has=(x:RelicId)=>owned.includes(x);
  return {fang:has('wyrd-fang'),rhythm:has('skald-drum'),feather:has('storm-feather'),lens:has('hugin-lens'),anchor:has('ash-anchor'),shield:has('shieldroot'),thread:has('eir-thread'),hoard:has('raven-hoard')};
}
/** Composite accents respect active projectile limits and never invent a shot. */
export function paintEarnedSoulboltArt(g:G,bolts:readonly Soulbolt[],owned:readonly RelicId[],time:number,reducedMotion=false){
  const a=relicAppearance(owned);
  if(!BOLT_RELICS.some(id=>owned.includes(id)))return;
  if(!Number.isFinite(time))throw new RangeError('Invalid render time');
  let shown=0;
  g.save();
  for(const b of bolts){
    if(!b.active)continue;
    if(++shown>RELIC_ART_CAP)break;
    g.save();g.translate(Math.round(b.x),Math.round(b.y));g.rotate(Math.atan2(b.dy,b.dx));
    if(a.fang){ // The Wyrd Fang reinforces the front of the damaging projectile.
      px(g,5,-4,3,3,'#f4d49f');px(g,7,-2,4,2,'#fff0bd');px(g,5,1,3,3,'#f4d49f');
    }
    if(a.rhythm){ // Drumbeat notches travel with a faster shot, never a false hitbox.
      px(g,-13,-4,2,8,'#e6c18c');px(g,-17,-2,2,4,'#aa865d');
    }
    if(a.feather){
      g.strokeStyle='#b5e5df';g.lineWidth=1.1;g.beginPath();g.moveTo(-2,-3);g.lineTo(-11,-9);g.moveTo(-2,3);g.lineTo(-11,9);g.stroke();
    }
    if(a.lens){
      g.strokeStyle='#bcdcf0';g.lineWidth=1.15;g.beginPath();g.ellipse(4,0,5,4,0,0,Math.PI*2);g.stroke();px(g,3,-1,2,2,'#fff6ca');
    }
    if(a.anchor){
      px(g,-7,-4,4,8,'#d99c76');px(g,-11,-2,3,4,'#997259');
    }
    // No flicker when system accessibility preferences reduce animation.
    if(!reducedMotion&&a.rhythm&&shown<=4){g.globalAlpha=.38+.14*Math.sin(time*10+shown);px(g,-18,-1,2,2,'#f5d9a0');}
    g.restore();
  }
  g.restore();
}
/** Three earned-rune seals stay completely CLEAR of the actual hero helmet, shield and boots.
 * Rotation shows every earned relic over time; reduced-motion mode is fixed.
 * Up to three marks per frame prevent full-run pickup spam and visual clutter.
 */
export function paintBoundRuneHalo(g:G,hero:Vec2,owned:readonly RelicId[],time:number,reducedMotion=false){
  relicAppearance(owned);
  if(!owned.length)return;
  if(!Number.isFinite(hero.x+hero.y+time))throw new RangeError('Invalid rune halo');
  const count=Math.min(3,owned.length),cycle=reducedMotion?0:Math.floor(Math.max(0,time)/2.6)%owned.length;
  g.save();
  for(let i=0;i<count;i++){
    const id=owned[(cycle+i)%owned.length]!;
    const angle=2*Math.PI*i/count-Math.PI/2+(reducedMotion?0:Math.sin(time*.8+i)*.12);
    const x=hero.x+Math.cos(angle)*39,y=hero.y+Math.sin(angle)*39;
    g.globalAlpha=.9;
    paintEarnedRelicSeal(g,id,x,y);
  }
  g.restore();
}
