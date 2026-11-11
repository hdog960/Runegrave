/** Gate A 0.09.22: readable body articulation, not fake danger circles.
 * Animate genuine attack-ready silhouettes within each enemy sprite's reach,
 * and a four-frame hand-forged moving cloak on the Wayfarer.
 * Warning urgency derives ONLY from real encounter windup/charge state.
 * No coordinates affect physics, enemies, movement, damage or attacks.
 */



/** Four distinct sewn/weighted hems to give the still-atlas torso real motion. */
export const WAYFARER_CLOAK_HEMS=Object.freeze([
 [[-10,11,3,8],[-6,17,4,5],[4,17,4,5],[9,11,3,8]],
 [[-11,9,3,10],[-7,17,4,4],[5,16,4,7],[10,12,3,7]],
 [[-9,11,3,10],[-4,16,4,7],[3,16,4,7],[8,11,3,10]],
 [[-12,12,3,7],[-8,16,4,7],[6,17,4,4],[11,9,3,10]]
]);
/** A deliberately quiet outline: drawn within the silhouette, not another
 * full character on top. Four actual leg-stride poses also move fabric.
 */
export function paintWayfarerMovingHem(g,pose,time,reducedMotion=false){
 if(!Number.isFinite(time))throw new RangeError('Invalid hem time');
 const beat=pose.moving&&!reducedMotion?Math.floor(Math.max(0,time)*9)%4:0;
 const frames=WAYFARER_CLOAK_HEMS[beat];
 g.save();
 const flip=pose.facing==='W'||pose.facing==='NW'||pose.facing==='SW';
 if(flip)g.scale(-1,1);
 for(let i=0;i<frames.length;i++){
  const [x=0,y=0,w=0,h=0]=frames[i];
  // Inside cloak's bottom outline; does not cover boots or aim projectile.
  g.fillStyle=i%2?'#3d7770':'#192f35';
  g.fillRect(x,y,Math.min(w,3),h);
  if(i===beat){
   g.fillStyle='#bdad7a';g.fillRect(x,y+h-2,2,2);
  }
 }
 g.restore();
}

/** Countdowns are signed in real enemy simulation after the last strike tick. */
export function kineticStrikeBand(e):0|1|2|3{
 if(!Number.isFinite(e.windup))throw new RangeError('Invalid kinematic windup');
 if(e.state==='charge')return 3;
 if(e.state!=='warning')return 0;
 const w=Math.max(0,e.windup);
 return (w>.65?0:w>.4?1:w>.2?2:3);
}
function px(g,x,y,w,h,color){
 g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);
}
/** Seven visual species get seven genuinely distinct body-action mechanisms:
 * claw, crystal spread, drawn bow, ram horns, vane spokes, veil claws and boss
 * great-tree boughs. All four warning bands mutate actual geometric positions.
 * Finite negative idle/recover countdown does NOT throw or fake an attack.
 */
export function paintHostileKineticInk(g,e,time,reducedMotion=false){
 if(!Number.isFinite(time)||!['draugr','wisp','archer','charger','sentinel','shade','warden'].includes(e.kind))
 throw new RangeError('Invalid hostile kinetic ink');
 const band=kineticStrikeBand(e);
 if(e.state!=='warning'&&e.state!=='charge')return;
 const r=band*2,bright=band>=3;
 g.save();
 if(e.kind==='draugr'){
  px(g,-15,-12-r,5,13,'#304a48');px(g,-14,-9-r,3,7,'#a2b49b');
  px(g,11+r,-13,3,11,'#8aa29a');
  for(let i=0;i<3;i++)px(g,13+r,-14+i*5,3,2,bright?'#f4deb0':'#c8b48a');
 }else if(e.kind==='wisp'){
  for(const s of [-1,1]){
   px(g,s<0?-16-r:13+r,-18-r,3,8,'#66b6c1');
   px(g,s<0?-19-r:16+r,-21-r,3,5,bright?'#e6ffff':'#acdce3');
  }
  px(g,-2,-24-r,4,3,'#bce8e7');
 }else if(e.kind==='archer'){
  px(g,12+r,-18,3,25,'#c1a47e');
  px(g,16+r,-15,2,18,'#a18a74');
  px(g,7-r,-7,12+r*2,2,bright?'#fff1c6':'#d0b58c');
  px(g,7-r,-9,3,6,'#9fb0a4');
 }else if(e.kind==='charger'){
  for(const s of [-1,1]){
   px(g,s<0?-18-r:15+r,-22-r,4,14,'#c8b087');
   px(g,s<0?-20-r:17+r,-26-r,3,5,bright?'#fff3d4':'#dfc69d');
  }
  px(g,-10,8+r,20,3,'#53483b');
 }else if(e.kind==='sentinel'){
  for(const [x,y] of [[-18-r,0],[17+r,0],[-2,-22-r],[-2,13+r]]){
   px(g,x,y,5,7,'#729b9c');
   px(g,x+1,y+1,3,2,bright?'#e5f8dd':'#c1d9c6');
  }
 }else if(e.kind==='shade'){
  for(const s of [-1,1]){
   px(g,s<0?-15-r:12+r,-15-r,3,13,'#7a6d98');
   px(g,s<0?-18-r:15+r,-19-r,3,6,bright?'#f4e5ff':'#c2aee4');
   px(g,s<0?-15-r:12+r,2+r,2,7,'#57476c');
  }
 }else{
  // Warden branches: two changes for each windup stage and a separate
  // phase-two fork; readable as geometry even without red danger colors.
  for(const s of [-1,1]){
   px(g,s<0?-26-r:22+r,-26-r,5,19,'#59795f');
   px(g,s<0?-27-r:24+r,-31-r,3,7,bright?'#f8ddb1':'#c4b18e');
   if(e.phase===2){
    px(g,s<0?-33-r:29+r,-34-r,4,13,'#99764f');
    px(g,s<0?-33-r:30+r,-38-r,3,5,'#f1c69a');
   }
  }
 }
 g.restore();
 void reducedMotion;
}
