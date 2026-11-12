/** RUNEGRAVE Gate A v0.09.47 — two truly independently carved, 17×9
 * outgoing SOULBOLT ink silhouettes keyed ONLY to REAL pooled projectile
 * damage: ordinary original 2 damage and empowered actual 3-damage Wyrd
 * Fang. This cannot grant the relic or change projectile behavior.
 * Three rear engraving cuts are determined solely by TRUE distance traveled,
 * never by invented wall-clock or forged effects. The forward nose persists.
 */
export const SOULBOLT_INK_CLASSES=['ordinary-oath','fang-bound'];
export const SOULBOLT_INK_PATTERNS=Object.freeze({"ordinary-oath":[".............o...","............obo..",".....o.....obbo..","...oobo...obcco..","ooobbbbobbcccwcoo","...oobo...obcco..",".....o.....obbo..","............obo..",".............o..."],"fang-bound":["..........o...o..",".........obobo...","o...o...obccbo...",".oobboooobccccbo.","oobbbcbbc++wccco.",".oobboooobccccbo.","o...o...obccbo...",".........obobo...","..........o...o.."]});
export const SOULBOLT_INK_COLORS=Object.freeze({"ordinary-oath":{"o":"#0c2732","b":"#4e8790","c":"#89cfc8","w":"#fff0bc","+":"#efcf83"},"fang-bound":{"o":"#291d2c","b":"#966a59","c":"#f1b57c","w":"#fff9d3","+":"#f1e2a2"}});
export function soulboltInkClass(b){
 if(!Number.isFinite(b.damage)||b.damage<=0)throw new RangeError('Invalid actual soulbolt damage');
 return b.damage>2?'fang-bound':'ordinary-oath';
}
/** True traveled distance is the existing fixed-step simulation field.
 * No damage, lifetime, hit-radius or speed interpretation is made here.
 */
export function soulboltInkPhase(travel){
 if(!Number.isFinite(travel)||travel<0)throw new RangeError('Invalid actual soulbolt travel');
 return travel>=180?2:travel>=80?1:0;
}
export function soulboltInkRows(b){
 const kind=soulboltInkClass(b),phase=soulboltInkPhase(b.travel);
 if(phase===0)return SOULBOLT_INK_PATTERNS[kind];
 const frontMask=phase===1?3:6;
 return SOULBOLT_INK_PATTERNS[kind].map(row=>row.slice(0,frontMask).replace(/[obcw+]/g,'.')+row.slice(frontMask));
}
/** Pure Canvas cosmetic ink at the original actual projectile coordinates
 * and heading; the existing SOULBOLT_STATS.radius=3 collision remains.
 * Reject forged/malformed active projectiles; never draw dead pooled slots.
 */
export function paintTrueSoulbolt(g,b){
 if(!b.active)return false;
 if(![b.x,b.y,b.dx,b.dy,b.damage,b.travel].every(Number.isFinite)
   ||Math.hypot(b.dx,b.dy)<.1)throw new RangeError('Invalid active actual Soulbolt');
 const kind=soulboltInkClass(b),rows=soulboltInkRows(b),p=SOULBOLT_INK_COLORS[kind];
 g.save();g.translate(Math.round(b.x),Math.round(b.y));g.rotate(Math.atan2(b.dy,b.dx));
 // Small engraved single-world-pixel cuts with contiguous horizontal runs,
 // bounded to x -8..8 and y -4..4; no fake area-of-effect footprint.
 for(let y=0;y<9;y++){
  const line=rows[y];
  for(let x=0;x<17;){
   const k=line[x];
   if(k==='.') {x++;continue;}
   let end=x+1;while(end<17&&line[end]===k)end++;
   g.fillStyle=p[k];
   g.fillRect(-8+x,-4+y,end-x,1);
   x=end;
  }
 }
 g.restore();
 return true;
}
