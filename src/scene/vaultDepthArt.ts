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
 g.restore();
}
