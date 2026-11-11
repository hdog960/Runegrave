/** Original Norse visor/armour micro-sprites, Gate A v0.09.23.
 * Shapes are hand-inked pixels fitted INSIDE the already authored actor
 * contours. They replace generic catch-all face shines with genuine compass
 * direction profiles, battle-ready expressions and damage-dependent scars.
 * No invented attacks, physics, HUD, DOM, or hitboxes.
 */



export const FACE_DIRECTIONS=['N','NE','E','SE','S','SW','W','NW'];
const HERO_PAL=Object.freeze({
 '#':'#d0b784','+':'#e9d7a7','a':'#5d9a8a','o':'#183339','s':'#365b59'
});
/** Eight original directional armour-braiding masks, rather than 4 mirrors.
 * Their distinct asymmetries are visible at actual handset pixel scale.
 * Each 11-row pattern is 15 px wide when stamped at 2x native resolution. */
export const SAGA_VISORS=Object.freeze({
 N:[
 '.......#.......','......###......','.....#+++#.....','....#a#.#a#....',
 '...ssa...ass...','..saaa...aaas..','...saa###aas...','....a##a##a....',
 '.....a#a#a.....','....s##+##s....','......sss......'
 ],
 NE:[
 '.......#.......','......##+......','.....#+##+.....','....oa...#.....',
 '...soa...a#....','..saa...aa#+...','...sa##a###....','....a##a#......',
 '.....aa#s......','....s##+#......','......s#.......'
 ],
 E:[
 '........##.....','.......#+##....','......#+###....','.....sa....a...','....sa....a....',
 '...sa##..a#....','...saa###a#....','....a#a##......','.....aa#s......','....s##+s......','......s#.......'
 ],
 SE:[
 '.....#.........','....##+........','...#+##+.......','....o...a......',
 '...sa...a#.....','..saa..aa#+....','...sa##a##+....','....a##a#......',
 '.....a#a#......','....s##+#......','......ss.......'
 ],
 S:[
 '.......#.......','......##+......','.....#+++#.....','....o#+#o#.....',
 '...sa#####as...','..saa#++#aas...','...sa#++#as....','....a#a#a......',
 '.....a#a#......','....s##+##s....','......sss......'
 ],
 SW:[
 '.........#.....','........+##....','.......+##+#...','......a...o....',
 '.....#a...as...','....+#aa..aas..','....+##a##as...','......#a##a....',
 '......#a#a.....','......#+##s....','.......ss......'
 ],
 W:[
 '.....##........','....##+#.......','....###+#......','...a....as.....','....a....as....',
 '....#a..##as...','....#a###aas...','......##a#a....','......s#aa.....','......s+##s....','.......#s......'
 ],
 NW:[
 '.......#.......','......+##......','.....+##+#.....','.....#...ao....',
 '....#a...aos...','...+#aa...aas..','....###a##as...','......#a##a....',
 '......s#aa.....','......#+##s....','.......#s......'
 ]
});
function mask(g,rows,x,y,palette){
 for(let j=0;j<rows.length;j++){
  const row=rows[j]!;
  for(let i=0;i<row.length;i++){
   const ch=row[i]!;
   if(ch==='.')continue;
   const ink=palette[ch];
   if(!ink)throw new Error('Invalid saga pixel '+ch);
   g.fillStyle=ink;g.fillRect(x+i*2,y+j*2,2,2);
  }
 }
}
/** Render inside the existing world-space hero frame, before the aimed staff.
 * No time-based flickering; only the actual locomotion gait and firing recoil.
 */
export function paintWayfarerSagaVisor(g,p,time,reducedMotion=false){
 if(!Number.isFinite(time)||!Object.hasOwn(SAGA_VISORS,p.facing))
 throw new RangeError('Invalid Wayfarer saga face');
 const body=SAGA_VISORS[p.facing];
 const beat=p.moving&&!reducedMotion?Math.floor(Math.max(time,0)*9)%4:0;
 const sway=p.moving&&!reducedMotion?[0,-1,0,1][beat]??0:0;
 g.save();
 mask(g,body,-15,-24+sway,HERO_PAL);
 // An actual forceful casting profile: shoulder draws back and sword arm arcs
 // forward only when the pre-existing recoil is nonzero.
 if(p.recoil>.2){
  const arm=p.side<0?-16:12;
  g.fillStyle=HERO_PAL['#'];g.fillRect(arm,-14-p.recoil*5,4,7);
  g.fillStyle=HERO_PAL['+'];g.fillRect(arm+1,-16-p.recoil*5,2,4);
 }else if(p.moving){
  g.fillStyle=HERO_PAL.a;
  g.fillRect(p.side<0?-14:10,-8+beat%2,3,4);
 }
 g.restore();
}
/** Seven original species faceplates, visually different from their costume.
 * They are actually inked head sigils, not just an interchangeable color wash.
 */
export const HOSTILE_FACEPLATES=Object.freeze({
 draugr:['.###.###.','##o###o##','.##a#a##.','..#####..','...#a#...'],
 wisp:['...###...','..#a+a#..','.aa#+#aa.','..#a+a#..','...###...'],
 archer:['##.....##','o##a#a##o','.oa###ao.','..#aaa#..','...###...'],
 charger:['###...###','o#######o','.o#a#a#o.','..##+##..','...###...'],
 sentinel:['..##a##..','##a###a##','o#a#+#a#o','##a###a##','..##a##..'],
 shade:['###...###','.o#aa#o..','..a###a..','.o#aa#o..','###...###'],
 warden:['##a###a##','o###a###o','##o#+#o##','.##aaa##.','..#####..']
});
const FOE_PAL=Object.freeze({
 draugr:{'#':'#243d3d','o':'#afc5a1','a':'#88a98c','+':'#f0e1b2'},
 wisp:{'#':'#376778','o':'#c8f1e7','a':'#76c2d1','+':'#f0ffff'},
 archer:{'#':'#46374f','o':'#ead7b5','a':'#9678ac','+':'#f4e4be'},
 charger:{'#':'#7a6244','o':'#d3ba85','a':'#efcf9a','+':'#fff1ca'},
 sentinel:{'#':'#385761','o':'#e1f2dc','a':'#9dbcb8','+':'#f4dfaf'},
 shade:{'#':'#403354','o':'#dec9f3','a':'#a98fc8','+':'#f0ebff'},
 warden:{'#':'#425f4a','o':'#b8cfa0','a':'#91ae78','+':'#ffecbe'}
});
/** Real face reactions: neutral, drawn-to-strike, and damaged. The art
 * preserves the real signed post-strike residual windup and avoids fake attacks.
 */
export function paintHostileSagaFace(g,e,time,reducedMotion=false){
 if(!Object.hasOwn(HOSTILE_FACEPLATES,e.kind)||!Number.isFinite(time)||!Number.isFinite(e.windup))
 throw new RangeError('Invalid hostile saga face');
 const rows=HOSTILE_FACEPLATES[e.kind],ink=FOE_PAL[e.kind];
 const boss=e.kind==='warden',left=-rows[0]!.length,top=boss?-28:-19;
 g.save();
 // The actor is already grounded in the actual world renderer. This face
 // shifts by at most 1 pixel when charging; reduced-motion stays completely still.
 const moving=e.state==='charge'&&!reducedMotion;
 g.translate(0,moving?Math.round(Math.sin(time*8)):0);
 mask(g,rows,left,top,ink);
 if(e.state==='warning'||e.state==='charge'){
  const level=e.state==='charge'?3:e.windup>.4?1:e.windup>.2?2:3;
  const half=level+1;
  // Narrowing eyes are a real threat-time cue, but never an invented warning line.
  g.fillStyle=ink.o;g.fillRect(-half-5,top+5,half+1,2);g.fillRect(4,top+5,half+1,2);
  if(level===3){g.fillStyle=ink['+'];g.fillRect(-1,top+1,2,3);}
 }
 if(e.flash>0){
  // Actual damage event: split visor material, not a permanent blinking glow.
  g.fillStyle=ink['+'];
  g.fillRect(1,top+7,2,3);g.fillRect(3,top+9,2,4);
  g.fillStyle='#132126';g.fillRect(0,top+6,2,3);
 }
 if(boss&&e.phase===2){
  g.fillStyle=ink['+'];g.fillRect(-12,top-4,5,3);g.fillRect(7,top-4,5,3);
 }
 g.restore();
}
