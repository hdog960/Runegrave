/** Gate A: four original families of large edge architecture, replacing the
 * Rootvault sarcophagi outside ROOT rooms. Purely decorative; colliders remain
 * owned by the unmodified fixed-step physics world. No RNG or DOM operations. */
type G = CanvasRenderingContext2D;
export type ChamberFamily = 'ASH'|'IRON'|'ROOT'|'SPIRIT'|'FATE';
type Family = ChamberFamily;
export const SETPIECE_MOTIFS = Object.freeze({
  ASH:'ember-forge', IRON:'iron-astrolabe', ROOT:'living-roots',
  SPIRIT:'ghostglass-lantern', FATE:'norn-thread-loom'
} as const satisfies Record<Family,string>);
const px=(g:G,x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
const stroke=(g:G,x1:number,y1:number,x2:number,y2:number,c:string,width=1.5)=>{
  g.strokeStyle=c;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();
};
/** Renders at two existing side-prop positions, never over an input rail. */
export function paintChamberSetpieces(g:G,W:number,H:number,t:number,family:Family,variant=0):void {
  if(!Object.hasOwn(SETPIECE_MOTIFS,family))throw new RangeError('Unknown chamber material');
  if(W<240||H<148||family==='ROOT')return;
  for(const side of [-1,1]){
    const x=side<0?76:W-76,y=Math.min(H-43,H*.70);
    g.save();g.translate(Math.round(x),Math.round(y));
    // Stone plinth and floor shadow: consistent grounding across all families.
    g.fillStyle='#030c10b3';g.beginPath();g.ellipse(0,23,24,7,0,0,Math.PI*2);g.fill();
    px(g,-24,16,48,8,'#171c20');px(g,-22,17,44,2,'#827760');
    if(family==='ASH'){
      // Triangular basalt furnace with glowing cutout; not a pickup or enemy.
      px(g,-17,-23,34,40,'#18191b');px(g,-21,-23,6,39,'#776050');px(g,15,-23,6,39,'#776050');
      px(g,-15,-29,30,7,'#8a7054');px(g,-11,-20,22,31,'#422d29');
      px(g,-7,-13,14,22,'#ad5731');px(g,-4,-9,8,14,'#f6af5a');
      const height=5+Math.round(Math.sin(t*2.6+variant)*3);
      px(g,-2,-9-height,4,height+5,'#ffdda1');
      for(const xx of [-17,14]){px(g,xx,-29,3,35,'#bb9461');px(g,xx,-16,3,4,'#f0bd7c');}
      px(g,-12,11,24,3,'#dd9d60');
    }else if(family==='IRON'){
      // Riveted mechanical astrolabe and exposed central gear in steel housing.
      px(g,-22,-21,44,39,'#20313a');px(g,-19,-24,38,7,'#7b8f90');
      px(g,-18,-17,36,31,'#35484f');
      g.strokeStyle='#aabbb8';g.lineWidth=3;g.beginPath();g.arc(0,-1,13,0,Math.PI*2);g.stroke();
      g.strokeStyle='#283f49';g.lineWidth=3;g.beginPath();g.arc(0,-1,7,0,Math.PI*2);g.stroke();
      for(let k=0;k<8;k++){const a=k*Math.PI/4+variant*.03;
        px(g,Math.cos(a)*15-2,Math.sin(a)*15-3,4,6,k%2?'#c0bbb0':'#89a5a8');}
      px(g,-3,-4,6,6,'#d8cfab');
      for(const xx of [-18,16])for(const yy of [-14,11])px(g,xx,yy,3,3,'#a5b5ad');
    }else if(family==='SPIRIT'){
      // A broad spectral memory-mirror with asymmetrical stained glass shards.
      px(g,-16,-26,32,44,'#24243b');px(g,-20,-23,5,40,'#6e7196');px(g,15,-23,5,40,'#6e7196');
      px(g,-15,-32,30,8,'#777e9c');px(g,-12,-23,24,35,'#4b6482');
      px(g,-9,-20,18,29,'#7185a4');px(g,-4,-18,8,24,'#acd5cf');
      stroke(g,-10,-8,2,-19,'#e2dfdc',2);stroke(g,2,-19,9,-4,'#c9cae7',2);
      stroke(g,-8,5,7,-7,'#b0d1dd',1.5);
      px(g,-12,12,24,4,'#8983b7');
      // Only one subtle stationary glimmer on low-motion devices (t=0).
      px(g,Math.round(-3+Math.sin(t*1.7+variant)*4),-19,3,3,'#f1eaf5');
    }else if(family==='FATE'){
      // Woven thread loom: carved spindle, tension weights and crossed warp.
      px(g,-23,-26,46,45,'#2b281f');px(g,-19,-30,38,8,'#aa9160');
      px(g,-18,-22,5,39,'#897345');px(g,13,-22,5,39,'#897345');
      for(let k=0;k<5;k++){
        const xx=-9+k*5;
        stroke(g,xx,-20,xx,-1,'#d8c48e',1.4);
        stroke(g,xx,-1,-xx*.75,9,k%2?'#efcf91':'#9bb8a5',1.2);
      }
      stroke(g,-12,1,13,1,'#c49a54',3);px(g,-4,-7,8,8,'#d8bc7f');
      px(g,-15,12,30,4,'#b19a6b');px(g,-20,10,3,6,'#e1be7e');
    }
    g.restore();
  }
}
