/** RUNEGRAVE Gate A v0.09.18 — original pixel-mosaic wall standards and combat poses.
 * Pure world-space Canvas presentation, no DOM/input/physics/save mutations.
 */


export const SAGA_MOSAICS=Object.freeze({
 ASH:['....##......','...####.....','...#++#.....','..##++##....','..#+##+#....','..#++++#....','..#++++#....','..###++###..','...#++++#...','..########..','....####....','...######...'],
 IRON:['..##....##..','..#++++++#..','###++##++###','#+#++##++#+#','#+++####+++##','#+###++###+#','#+###++###+#','#+++####+++##','#+#++##++#+#','###++##++###','..#++++++#..','..##....##..'],
 ROOT:['##........##','+##......##+','.+##....##+.','..+##..##+..','...+####+...','....####....','..###++###..','..##+##+##..','....####....','...+#++#+...','..+#....#+..','..##....##..'],
 SPIRIT:['.....##.....','....#++#....','...#++++#...','..#++##++#..','..#+#..#+#..','..#+####+#..','..#++++++#..','..##+##+##..','...#+##+#...','....####....','...##..##...','..##....##..'],
 FATE:['#...........#','+#.........#+','.+#.......#+.','..+##...##+..','...+##.##+...','....+###+....','...###+##+...','..##+...+##..','.+#.......#+.','+#.........#+','#...........#','#############']
});

export const SAGA_PALETTES=Object.freeze({
 ASH:['#241d1b','#75533e','#d5a26d'],IRON:['#1d2e34','#697f84','#c1c8bd'],
 ROOT:['#172e29','#517760','#add5a9'],SPIRIT:['#292a47','#727ba1','#c4d9e1'],
 FATE:['#302b23','#917c54','#e1c68f']
});
/** Two hand-authored 2px mosaics on fixed upper-edge tapestry mounts.
 * Each family has a distinct silhouette; five numbered hem cuts per family.
 */
export function paintSagaStandards(g,W,H,t,family,variant,reducedMotion=false){
 if(!Object.hasOwn(SAGA_MOSAICS,family)||![W,H,t].every(Number.isFinite)||
 W<240||H<148||!Number.isInteger(variant)||variant<0||variant>24)throw new RangeError('Invalid saga standard');
 const pattern=SAGA_MOSAICS[family],colors=SAGA_PALETTES[family],cut=variant%5;
 const [shade,metal,thread]=colors;
 const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 g.save();
 for(const side of [-1,1]){
  const anchor=side<0?82:W-82;
  const sway=reducedMotion?0:Math.round(Math.sin(t*1.7+variant*.55+(side<0?0:2))*1.25);
  g.save();g.translate(Math.round(anchor),0);
  // Forged attachment, double-sided cloth, scalloped border and corner wax seal.
  px(-22,9,44,5,'#111a1d');px(-20,10,40,2,metal);
  for(const nail of [-18,17]){px(nail,10,3,5,thread);px(nail+1,13,1,3,shade);}
  px(-18,16,36,48,'#0b181b');px(-16,17,32,44,shade);
  px(-14,19,28,40,metal);px(-12,20,24,37,shade);
  for(const s of [-1,1]){px(s<0?-18:16,18,2,38,thread);px(s<0?-17:15,22,2,29,shade);}
  // Pixel-by-pixel artistic silhouette instead of a procedural generic rune.
  for(let ry=0;ry<pattern.length;ry++){
   const row=pattern[ry]??'';
   for(let rx=0;rx<row.length;rx++){
    const symbol=row[rx];
    if(symbol==='.')continue;
    px(-12+rx*2,25+ry*2,2,2,symbol==='#'?thread:metal);
   }
  }
  // Distinct cut marks for all five rooms per family (not recolor-only).
  for(let i=0;i<5;i++){px(-15+i*7,57,4,2,i<=cut?thread:shade);if(i<=cut)px(-14+i*7,59,2,2,metal);}
  for(let i=0;i<4;i++)px(-13+i*8,63,3,2+(i+cut)%3+(i===cut%4?sway:0),thread);
  px(side<0?-19:15,48,4,6,shade);px(side<0?-19:16,49,3,3,metal);
  g.restore();
 }
 g.restore();
}
/** Eight-direction plated hero: opposite greave motion, cloak embroidery and
 * helmet crest, recoil keyed only to actual firing input. No hitbox changes.
 */
export function paintSagaWayfarer(g,pose,time,reducedMotion=false){
 const facings=['N','NE','E','SE','S','SW','W','NW'];
 if(!Number.isFinite(time)||!facings.includes(pose.facing))throw new RangeError('Invalid Wayfarer saga pose');
 const index=facings.indexOf(pose.facing);
 const frame=pose.moving&&!reducedMotion?Math.floor(Math.max(0,time)*9)%4:0;
 const gait=pose.moving&&!reducedMotion?([0,2,0,-2][frame]??0):0;
 const breath=pose.moving||reducedMotion?0:Math.round(Math.sin(time*2.1)*1.2);
 const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 g.save();
 // Alternating riveted greaves: two grounded legs and asymmetric ankle cloth.
 for(const s of [-1,1]){
  const x=s<0?-11:4,y=16+s*gait;
  px(x,y,7,6,'#172a2c');px(x+1,y+1,5,2,'#b7b59a');
  px(x+1,y+4,6,2,'#d6aa71');px(x+s*2,y-1,2,3,'#54756e');
 }
 // Split cape has different embroidered braid on back vs front view.
 for(const s of [-1,1]){
  const x=s*10;
  px(x-2,3+breath,4,10,pose.back?'#224b50':'#283e43');
  px(x-1,5+breath,2,7,pose.back?'#79b7a3':'#d4b17a');
  px(x-2+s*gait*.5,13,3,3,'#132d32');
  px(x-1+s*gait*.5,16,2,2,'#acb69d');
 }
 // Facing-specific forged crest profiles, stable in reduced-motion mode.
 const crests=[[0,-26,0],[5,-25,1],[9,-20,2],[6,-16,1],[0,-27,0],[-6,-16,-1],[-9,-20,-2],[-5,-25,-1]];
 const [cx,cy,slant]=crests[index]??[0,-26,0];
 px(cx-3,cy-2+breath,6,4,'#202e33');px(cx-2,cy-3+breath,4,2,'#e1bd82');
 px(cx+slant,cy-6+breath,2,4,pose.back?'#80b7a5':'#e6c58c');
 if(pose.side!==0){
  const x=pose.side>0?8:-11;
  px(x,-18+breath,3,7,'#a2aa96');px(x+pose.side,-14+breath,3,3,'#233c40');
 }else if(pose.back){
  px(-5,-17+breath,10,3,'#456f69');px(-1,-14+breath,2,5,'#a7c9a9');
 }else{
  px(-7,-19+breath,14,2,'#e6c18b');
  px(-4,-14+breath,3,2,'#f0f2cd');px(2,-14+breath,3,2,'#f0f2cd');
 }
 if(pose.recoil>.18&&!reducedMotion){
  const sx=pose.side<0?-17:13;
  px(sx,-7,5,4,'#f4c681');px(sx+1,-8,3,2,'#f4f0ce');
 }
 g.restore();
}

/** Seven silhouette-distinct warning choreographies. Every pose is keyed
 * to REAL remaining windup; never flash based on an unrelated wall clock.
 */
export function paintSagaEnemyStrike(g,e,time,reducedMotion=false){
 if(!['draugr','wisp','archer','charger','sentinel','shade','warden'].includes(e.kind)||
 ![time,e.windup].every(Number.isFinite)||e.windup<0)throw new RangeError('Invalid saga enemy strike');
 if(e.state!=='warning'&&e.state!=='charge')return;
 const ready=e.state==='charge'?3:e.windup>.65?0:e.windup>.40?1:e.windup>=.20?2:3;
 const reach=ready*2,hot=ready===3;
 const metal=hot?'#fff2ca':'#bbac8a',cold=hot?'#d2eee3':'#89aea4';
 const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x,y,xx,yy,c,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();};
 g.save();
 switch(e.kind){
 case 'draugr':
  px(-15,-10,5,13,'#1b3b3b');px(-14,-13,4,4,metal);
  for(let i=0;i<3;i++){line(11,-14+i*5,18+reach,-19-reach+i*5,metal,2);px(17+reach,-20-reach+i*5,3,3,cold);}break;
 case 'wisp':
  for(let i=0;i<4;i++){const x=(i-1.5)*8;line(x,-12,x+(i%2?4:-4),-20-reach,metal,1.7);px(x-1,-23-reach,3,3,cold);}break;
 case 'archer':
  line(12,-22,20+reach,-8,metal,2);line(20+reach,-8,12,9,metal,2);
  line(12,-22,7-reach,-8,cold,1);line(7-reach,-8,12,9,cold,1);
  px(7-reach,-9,14+reach,2,'#e6d5a5');line(21,-8,16,-12,metal,1.4);line(21,-8,16,-4,metal,1.4);break;
 case 'charger':
  for(const s of [-1,1]){line(s*12,-16,s*(19+reach),-24-reach,metal,3.5);
   line(s*(19+reach),-24-reach,s*(25+reach),-22-reach,cold,2);
   px(s<0?-14:6,12+((ready+s+1)%2),9,3,'#c8b088');}break;
 case 'sentinel':
  for(let i=0;i<4;i++){const a=i*Math.PI/2,r=19+reach;
   const x=Math.round(Math.cos(a)*r),y=Math.round(Math.sin(a)*r)-4;
   line(Math.cos(a)*10,Math.sin(a)*10-4,x,y,metal,2.5);
   px(x-3,y-3,6,6,cold);px(x-1,y-1,2,2,'#e6d2a2');}break;
 case 'shade':
  for(const s of [-1,1]){line(s*6,-6,s*(15+reach),-15-reach,cold,2.5);
   line(s*(15+reach),-15-reach,s*(23+reach),-10-reach,metal,2);
   line(s*8,8,s*(13+reach),13+reach,'#9688ae',2);}break;
 case 'warden':
  for(const s of [-1,1]){line(s*18,-8,s*(26+reach),-21-reach,metal,5);
   px(s*(26+reach)-5,-30-reach,10,8,'#40544a');px(s*(26+reach)-4,-31-reach,8,2,cold);
   if(e.phase===2)line(s*(26+reach),-26-reach,s*(33+reach),-36-reach,'#edab81',2);}break;
 }
 if(hot){line(-5,-29,0,-33,metal,1.5);line(0,-33,5,-29,metal,1.5);}
 g.restore();
 void reducedMotion;
}
