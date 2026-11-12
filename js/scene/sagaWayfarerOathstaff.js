/** v0.09.44 — EIGHT authored 11×11 Norse oathstaff heads, hand-carved
 * for the eight real current Wayfarer aim facings. Not rotating a generic
 * dot/line stamp, nor a new pointer reticle or an area-of-effect.
 * Pure translated actor-local art, attached to the EXISTING aim vector.
 */
export const OATHSTAFF_FACINGS=['N','NE','E','SE','S','SW','W','NW'];

export const OATHSTAFF_CARVINGS=Object.freeze({"N":[".....s.....","....wgw....","...wgggw...","..oiiggio..","...iaai....","...iiai....","...iiiii...","....iii....","....iai....","....iai....",".....o....."],"NE":[".......s...","......wgw..",".....wgggw.","....oiiggi.","...oiiaai..","..oiiaai...",".oiiii.....","..iii......","...iai.....","....ia.....",".....o....."],"E":["...........","...........",".......sw..","......wgw..","oiiiaigggws","oiiiiagggws",".......sw..","...........","...........","...........","..........."],"SE":[".....o.....","....iai....","...iai.....","..iii......",".oiiii.....","..oiiaai...","...oiiaai..","....oiiggi.",".....wgggw.","......wgw..",".......s..."],"S":[".....o.....","....iai....","....iai....","....iii....","...iiiii...","...iiai....","...iaai....","..oiiggio..","...wgggw...","....wgw....",".....s....."],"SW":[".....o.....","....ia.....","...iai.....","......iii..",".....iiiio.","...iaaiio..","..iaaiio...","iiggio.....",".wgggw.....","..wgw......","...s......."],"W":["...........","...........","..ws.......","..wgw......","swgggaioiio","swgggaioiio","..ws.......","...........","...........","...........","..........."],"NW":["...s.......","..wgw......",".wgggw.....","iiggio.....","..iaaiio...","...iaaiio..",".....iiiio.","......iii..","...iai.....","....ia.....",".....o....."]});
export const OATHSTAFF_MATERIALS=Object.freeze({
 o:'#0c252c',i:'#728f88',g:'#c8a46e',a:'#4c9a91',
 w:'#f6dfaa',s:'#e5fbef'
});
export const OATHSTAFF_CELL=1.25;

/** Muzzle is exactly the previous real equipped hand position from
 * sanctuaryArt: (aimX*18, aimY*15-3), with the same existing recoil.
 * No independent clock, new aim physics, projectile direction or hitbox.
 */
export function oathstaffGrip(pose){
 if(!OATHSTAFF_FACINGS.includes(pose.facing)||![pose.aimX,pose.aimY,pose.recoil].every(Number.isFinite)||
 Math.hypot(pose.aimX,pose.aimY)>1.51||pose.recoil<0||pose.recoil>1)
  throw new RangeError('Oathstaff requires an actual finite Wayfarer aim pose');
 const recoil=pose.recoil*3,fx=pose.aimX,fy=pose.aimY;
 return {x:fx*(18-recoil),y:fy*(15-recoil)-3,startX:pose.side<0?-5:5,startY:-3,facing:pose.facing};
}
export function paintWayfarerOathstaff(g,pose,firing){
 const grip=oathstaffGrip(pose),mask=OATHSTAFF_CARVINGS[grip.facing];
 const {x,y,startX,startY}=grip;
 g.save();
 // One original inlaid ashwood shaft, physically connected to the already
 // equipped hand. Keeps the real direction even between eight facings.
 for(const [w,c] of [[4,'#122c2e'],[2.6,'#aa9271'],[1,'#e4d3a8']]){
  g.beginPath();g.moveTo(startX,startY);g.lineTo(x,y);
  g.lineWidth=w;g.strokeStyle=c;g.stroke();
 }
 // Small gold cut at the hand, NOT an extra projectile.
 g.fillStyle='#d9b981';g.fillRect(Math.round(startX-2),Math.round(startY-1),4,3);
 g.translate(x,y);
 // Unique authored 11×11 asymmetric profile for each real aim-facing.
 const cell=OATHSTAFF_CELL,offset=-5.5*cell;
 for(let row=0;row<mask.length;row++){
  const line=mask[row];
  for(let col=0;col<11;){
   const mark=line[col];
   if(mark==='.') {col++;continue;}
   let end=col+1;while(end<11&&line[end]===mark)end++;
   const color=OATHSTAFF_MATERIALS[mark];
   g.fillStyle=mark==='s'&&!firing?'#78b9aa':color;
   g.fillRect(offset+col*cell,offset+row*cell,(end-col)*cell,cell);
   col=end;
  }
 }
 // The head's existing center brightens ONLY when the actual fire control
 // is held, replacing the old generic glowing circle/triangle. Never a HUD.
 if(firing){
  g.fillStyle='#f5ffe5';g.fillRect(-1.3,-1.3,2.6,2.6);
  g.fillStyle='#f4c88c';g.fillRect(-.5,2.1,1,2);
 }
 g.restore();
}
