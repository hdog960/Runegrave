/** Gate A v0.09.13: authored near-wall silhouette architecture.
 * Drawn BEFORE gameplay actors, wholly inside the canvas. Nothing interactive,
 * no randomness, no collision geometry, no canvas-wide translucent HUD veil.
 */
export type VaultFamily='ASH'|'IRON'|'ROOT'|'SPIRIT'|'FATE';
type G=CanvasRenderingContext2D;
export const VAULT_DEPTH_MOTIFS=Object.freeze({
 ASH:'basalt-cinder-arches',IRON:'chain-hung-iron-buttresses',ROOT:'gnarled-living-trunks',
 SPIRIT:'spectral-window-recesses',FATE:'woven-loom-pillars'
} as const satisfies Record<VaultFamily,string>);
const palettes={ASH:['#3a2522','#976c4c','#e6ab67'],IRON:['#233640','#7f9396','#c4c9b9'],ROOT:['#1b3430','#61795a','#b0c29b'],SPIRIT:['#2b2e4b','#8888b5','#c0dfeb'],FATE:['#40392a','#b69c66','#e9d4a2']} as const;
/** Variant is the authored room number; it changes the etched seam group. */
export function paintVaultDepth(g:G,W:number,H:number,time:number,family:VaultFamily,variant=0,reducedMotion=false):void {
 if(!Object.hasOwn(VAULT_DEPTH_MOTIFS,family)||![W,H,time,variant].every(Number.isFinite)||W<240||H<148)throw new RangeError('Invalid chamber depth art');
 const [shadow,stone,glow]=palettes[family];
 const px=(x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x:number,y:number,xx:number,yy:number,c:string,weight=2)=>{g.strokeStyle=c;g.lineWidth=weight;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();};
 g.save();
 // Edge arches are no more than 21px wide. They never conceal the dodge ring.
 for(const side of [-1,1]){
  const x=side<0?16:W-16;
  const x2=x+side*6;
  px(x-9,56,18,Math.max(10,H-118),shadow);
  px(x-6,62,12,Math.max(10,H-132),stone);
  px(x-4,65,3,Math.max(10,H-138),shadow);
  line(x-6,61,x2,49,glow,1.3);
  line(x2,49,x2+side*8,39,stone,2.5);
  for(let n=0;n<3;n++){
   const yy=81+n*Math.max(18,(H-150)/3);
   if(yy>H-30)break;
   px(x-7,yy,14,4,shadow);
   px(x-5,yy+1,10,2,n===variant%3?glow:stone);
  }
  if(family==='ASH'){
   // Embers through arched furnace slits.
   const flick=reducedMotion?0:Math.round(Math.sin(time*4+side)*2);
   px(x-3,94,6,18,'#231719');px(x-2,104+flick,4,5,glow);
   px(x-3,98,6,2,stone);
  }else if(family==='IRON'){
   // Hanging chain links and riveted threshold.
   for(let n=0;n<4;n++){g.strokeStyle=n%2?stone:glow;g.lineWidth=1.4;g.beginPath();g.ellipse(x,78+n*11,3,6,0,0,Math.PI*2);g.stroke();}
   px(x-5,H-50,10,5,glow);
  }else if(family==='ROOT'){
   // Branches split in two, distinct from iron straight lines.
   line(x,100,x-side*12,88,stone,3);line(x,100,x-side*9,116,glow,2);
   line(x-side*12,88,x-side*15,80,glow,1.4);
  }else if(family==='SPIRIT'){
   // Cold stained-glass shards, no false projectile colors.
   px(x-4,93,8,15,'#394a69');px(x-2,96,4,9,glow);
   line(x-4,93,x+4,109,stone,1);line(x+4,93,x-4,109,stone,1);
  }else{
   // Three vertical threads between upper and lower stone weights.
   for(let n=-1;n<=1;n++)line(x+n*3,84,x+n*3,117,n===0?glow:stone,1.2);
   px(x-7,81,14,4,stone);px(x-7,117,14,4,glow);
  }
 }
 // A three-stone floor threshold that reinforces chamber depth outside center.
 for(const side of [-1,1]){
  const x=side<0?35:W-35;
  px(x-15,H-20,30,4,shadow);
  px(x-12,H-19,24,2,stone);
  px(x-2,H-19,4,2,glow);
 }
 
 // Gate A v0.09.17: a pair of unique carved wall galleries. Their 25 family/cut
 // combinations are painted in world space BEHIND actors; none act as exits,
 // loot, attack telegraphs, collision props, or touch targets.
 const cut=((Math.floor(variant)%5)+5)%5;
 for(const side of [-1,1]){
  const cx=Math.round(side<0?47:W-47),cy=56;
  px(cx-25,cy-31,50,39,shadow);px(cx-23,cy-29,46,35,stone);
  px(cx-20,cy-26,40,29,shadow);
  px(cx-18,cy-25,36,2,glow);
  px(cx-18,cy+1,36,2,stone);
  // Five family-specific monumental frescoes. The outline must be readable
  // without hue, so these have separate silhouettes and structure.
  if(family==='ASH'){
   // Blackened anvil, rising triangular forge flame, paired smoke stacks.
   px(cx-13,cy-6,26,5,stone);px(cx-9,cy-1,18,4,glow);
   line(cx-12,cy-7,cx-5,cy-17,glow,2);
   line(cx-5,cy-17,cx+1,cy-11,glow,2);
   line(cx+1,cy-11,cx+8,cy-22,stone,2.5);
   line(cx+8,cy-22,cx+13,cy-8,glow,2);
   px(cx-14,cy-18,3,9,stone);px(cx+14,cy-19,3,10,stone);
  }else if(family==='IRON'){
   // Forged compass wheel, hard vertical axles and heavy machine teeth.
   px(cx-16,cy-17,5,20,stone);px(cx+11,cy-17,5,20,stone);
   g.strokeStyle=glow;g.lineWidth=2;g.beginPath();g.arc(cx,cy-10,10,0,Math.PI*2);g.stroke();
   line(cx,cy-21,cx,cy+1,stone,2.4);
   line(cx-12,cy-10,cx+12,cy-10,stone,2.4);
   px(cx-3,cy-13,6,6,glow);
  }else if(family==='ROOT'){
   // Living split-tree canopy with descending knotted roots.
   line(cx,cy+1,cx,cy-21,stone,5);
   line(cx,cy-13,cx-14,cy-23,glow,2.4);
   line(cx,cy-14,cx+14,cy-25,glow,2.4);
   line(cx-14,cy-23,cx-18,cy-15,stone,2);
   line(cx+14,cy-25,cx+17,cy-16,stone,2);
   line(cx,cy, cx-9,cy+3,glow,1.5);
   line(cx,cy, cx+9,cy+3,glow,1.5);
  }else if(family==='SPIRIT'){
   // Three jagged panes frame an empty, ghostly negative-space figure.
   for(const s of [-1,1]){
    line(cx+s*15,cy-22,cx+s*10,cy-4,stone,2);
    line(cx+s*10,cy-4,cx+s*3,cy-16,glow,1.5);
   }
   px(cx-3,cy-23,6,6,glow);
   px(cx-5,cy-13,10,2,stone);
   px(cx-2,cy-10,4,11,glow);
  }else{
   // Fate-loom: counterweighted shuttle, diamond and crossed warp strands.
   for(let k=-1;k<=1;k++)px(cx+k*9-1,cy-22,2,23,k===0?glow:stone);
   px(cx-10,cy-12,20,2,glow);
   px(cx-4,cy-19,8,2,glow);
   px(cx-6,cy-5,12,2,stone);
   px(cx-3,cy-13,6,3,glow);
  }
  // Every room in a family has a separate cut-count AND outer crown contour.
  // This is a permanent authored identity, not a random effect or new room.
  for(let n=0;n<=cut;n++){
   px(cx-17+n*7,cy-30-(n%2===cut%2?2:0),4,3,n===cut?glow:stone);
  }
  if(cut===0)line(cx-17,cy+5,cx-5,cy+5,glow,1.2);
  if(cut===1)line(cx-11,cy+5,cx+10,cy+5,glow,1.2);
  if(cut===2)line(cx-17,cy+5,cx+17,cy+5,glow,1.2);
  if(cut===3){px(cx-17,cy+4,7,3,glow);px(cx+10,cy+4,7,3,glow);}
  if(cut===4){px(cx-17,cy+4,34,3,glow);}
 }
g.restore();
}
