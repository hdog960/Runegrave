/** Gate A v0.09.19: pixel-sculpted saga monuments for the 25 canonical chambers.
 * Real carved silhouettes, NOT five recolors or a HUD. Every 5x5 identity uses
 * its own family body, mythic central story glyph and individually cut plinth.
 * World-space edges only. No enemy, door, loot, physics or touch state here.
 */


const familyStones=Object.freeze({
 ASH:{shade:'#211b1b',stone:'#604039',edge:'#bd835a',gold:'#e3bc7e',body:[
 '......####......','.....######.....','...###++++###...','..##++++++####..','..#++##++##++#..','..#+#......#+#..',
 '.##+#......#+##.','.#++#......#++#.','.#++#......#++#.','.#++#......#++#.','..#+#......#+#..',
 '..##++++++####..','...##########...','.....######.....']},
 IRON:{shade:'#1c292f',stone:'#526a73',edge:'#a4afb0',gold:'#f1dcb3',body:[
 '....########....','...##++++++##...','..##++####++##..','..#++#....#++#..','..#++#....#++#..','###++#....#++###',
 '#++++#....#++++#','#++++#....#++++#','###++#....#++###','..#++#....#++#..','..#++#....#++#..',
 '..##++####++##..','...##++++++##...','....########....']},
 ROOT:{shade:'#182b25',stone:'#426f50',edge:'#a5c18d',gold:'#d7e6aa',body:[
 '##....####....##','.###..####..###.','..###.####.###..','...##########...','....########....','...##++++++##...',
 '..##++#..#++##..','..#++#....#++#..','..#++#....#++#..','..##+#....#+##..','...#+#....#+#...',
 '...##++++++##...','....##++++##....','...###++++###...']},
 SPIRIT:{shade:'#262840',stone:'#555d87',edge:'#a9add4',gold:'#dfedf2',body:[
 '......####......','.....#++++#.....','....##++++##....','...##++##++##...','..##++#..#++##..','..#++#....#++#..',
 '.##++#....#++##.','.#+++##..##+++#.','.#++########++#.','..#++######++#..','..##++####++##..',
 '...##++++++##...','....##++++##....','.....######.....']},
 FATE:{shade:'#2a251f',stone:'#8d7048',edge:'#d9bb7e',gold:'#fff0b1',body:[
 '..##........##..','..###......###..','..####....####..','...####..####...','....########....','..###++++++###..',
 '..##++#..#++##..','..##+#....#+##..','..##+#....#+##..','..##++#..#++##..','..###++++++###..',
 '....########....','...####..####...','..###......###..']}
});
/** Five fully separate inlaid fates, one per authored chamber within a family. */
export const CHAMBER_FATES=Object.freeze([
 ['..###..','.#+++#.','#+###++','#++#++#','#+###++','.#+++#.','..###..'],
 ['#.....#','##...##','#+#.#++','##+#+##','#+#.#++','##...##','#.....#'],
 ['...#...','..###..','.##+##.','##+++##','.##+##.','..###..','...#...'],
 ['###.###','#+#.#++','##+#+##','..+++..','##+#+##','#+#.#++','###.###'],
 ['#.#.#.#','.#.#.#.','..###..','###+++##','..###..','.#.#.#.','#.#.#.#']
]);
export const CHAMBER_FAMILY_SILHOUETTES=Object.freeze(Object.keys(familyStones));
function pixel(g,x,y,w,h,color){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);}
/** Two small monumental pixel reliefs, deeply recessed in the bottom SIDE walls,
 * never the combat center. Canonical serial, not run index, selects inlay.
 */
export function paintChamberSagaStones(g,W,H,time,family,serial,reducedMotion=false){
 if(!Object.hasOwn(familyStones,family)||![W,H,time].every(Number.isFinite)||W<240||H<148||
 !Number.isInteger(serial)||serial<0||serial>24||CHAMBER_FAMILY_SILHOUETTES.indexOf(family)!==Math.floor(serial/5))
 throw new RangeError('Invalid canonical chamber saga stone');
 const p=familyStones[family],inlay=CHAMBER_FATES[serial%5],cut=serial%5;
 g.save();
 for(const side of [-1,1]){
  const ax=Math.round(side<0?38:W-38),ay=Math.round(H-42);
  g.save();g.translate(ax,ay);
  // 40px deep bevel + original pixellated family silhouette; low saturation,
  // no false enemy ring, glowing projectile, doorway or interactable shine.
  pixel(g,-20,-36,40,44,'#0b1619');
  pixel(g,-18,-34,36,39,p.shade);pixel(g,-16,-33,32,31,p.stone);
  for(let row=0;row<p.body.length;row++){
   const cells=p.body[row];
   for(let col=0;col<cells.length;col++){
    const c=cells[col];
    if(c==='.')continue;
    pixel(g,-16+col*2,-32+row*2,2,2,c==='#'?p.shade:p.edge);
   }
  }
  // A meaningful separate seven-row carved scene, not merely five painted dots.
  for(let row=0;row<inlay.length;row++)for(let col=0;col<7;col++){
   const c=inlay[row][col];if(c==='.')continue;
   pixel(g,-7+col*2,-24+row*2,2,2,c==='#'?p.gold:p.edge);
  }
  pixel(g,-18,-5,36,3,p.shade);pixel(g,-17,-4,34,2,p.edge);
  pixel(g,-18,-1,36,8,p.stone);pixel(g,-20,7,40,3,p.shade);
  // Five DIFFERENT notched pedestal profiles, canonical story stone I-V.
  for(let i=0;i<5;i++){
   pixel(g,-15+i*7,0,4,(i<=cut?3:1),i<=cut?p.gold:p.shade);
   if(i===cut)pixel(g,-14+i*7,5,2,3,p.edge);
  }
  // Living family character, quiet and deterministic; reduced motion freezes
  // the animation without changing family silhouette or authored identity.
  const glint=reducedMotion?0:Math.round(Math.sin(time*1.3+serial*.9+(side<0?0:1))*1);
  if(family==='ASH'){
   pixel(g,-13,-30-glint,2,3,p.gold);pixel(g,11,-27+glint,2,2,p.edge);
  }else if(family==='IRON'){
   pixel(g,-2,-32+glint,4,2,p.gold);pixel(g,12,-8,2,3,p.edge);
  }else if(family==='ROOT'){
   pixel(g,-14,-28+glint,2,3,p.gold);pixel(g,12,-30-glint,2,3,p.edge);
  }else if(family==='SPIRIT'){
   pixel(g,-2,-29+glint,4,2,p.gold);
  }else{
   pixel(g,-12,-27+glint,2,3,p.gold);pixel(g,11,-27-glint,2,3,p.gold);
  }
  g.restore();
 }
 g.restore();
}
/** A distinct honest gate silhouette: four chained weights when barred; four
 * separated hinges and a deep open corridor when unlocked. Only DOOR STATE
 * selects the artwork, so this cannot lie about whether a door can be used.
 */
export function paintRuneGateMechanism(g,open){
 if(typeof open!=='boolean')throw new TypeError('Invalid threshold status');
 g.save();
 // Two cleaved lintel crenels / riveted jamb weights.
 for(const side of [-1,1]){
  pixel(g,side<0?-27:23,-28,4,32,'#203337');
  pixel(g,side<0?-26:23,-23,3,3,'#c5a16f');
  pixel(g,side<0?-25:23,-11,3,3,'#c5a16f');
  if(open){
   pixel(g,side<0?-18:13,-19,4,30,'#263a37');
   for(let y=-17;y<10;y+=8)pixel(g,side<0?-17:14,y,2,3,'#a2b99a');
  }else{
   pixel(g,side<0?-16:12,-18,4,29,'#4d3833');
   for(let y=-13;y<10;y+=9)pixel(g,side<0?-16:13,y,3,2,'#d1a374');
  }
 }
 if(open){
  // Six paired perspective ribs lead the eye through the genuinely OPEN arch.
  // They add a recognizable stone tunnel silhouette without filling the gap.
  for(let y=-19;y<=6;y+=5){
   pixel(g,-8,y,2,3,'#b3bd9d');pixel(g,6,y,2,3,'#678b74');
  }
  // Open center recedes, not a bright collectible dot.
  pixel(g,-5,-19,10,25,'#132d2a');pixel(g,-3,-15,6,22,'#3e6851');
  pixel(g,-1,-12,2,18,'#b0cb96');pixel(g,-8,6,16,3,'#293e34');
 }else{
  // Solid portcullis chain and iron weight, recognizable without red color.
  for(let y=-17;y<9;y+=7){
   pixel(g,-11,y,22,2,'#b48d6b');pixel(g,-10,y+2,3,4,'#393136');pixel(g,7,y+2,3,4,'#393136');
  }
  pixel(g,-5,-7,10,10,'#7a5941');pixel(g,-3,-4,6,5,'#e2b47f');
  pixel(g,-1,-3,2,3,'#302627');
 }
 g.restore();
}
