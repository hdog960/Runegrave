/** v0.09 Gate A: eight individually recognizable collectible silhouettes.
 * The crest is WORLD SPACE decoration, not an inventory button or gameplay overlay.
 * Effects and collisions continue to belong to FirstSoulInventory/nearDrop.
 */
import type { RelicId } from './firstSoul.js';
type G = CanvasRenderingContext2D;
export type RelicCrest = Readonly<{ label:string; color:string; silhouette:string }>;
export const RELIC_CRESTS: Readonly<Record<RelicId,RelicCrest>> = Object.freeze({
  'wyrd-fang':{label:'FANG',color:'#f3c9a0',silhouette:'twin-fangs'},
  'skald-drum':{label:'DRUM',color:'#dec28e',silhouette:'stretched-drum'},
  'storm-feather':{label:'FEATHER',color:'#b7d9d8',silhouette:'wing-quill'},
  'hugin-lens':{label:'LENS',color:'#bad5e8',silhouette:'seer-eye'},
  'ash-anchor':{label:'ANCHOR',color:'#edb18b',silhouette:'hooked-anchor'},
  'shieldroot':{label:'BARK',color:'#aed5a4',silhouette:'root-shield'},
  'eir-thread':{label:'THREAD',color:'#dabfe0',silhouette:'woven-loop'},
  'raven-hoard':{label:'HOARD',color:'#e4d9a2',silhouette:'raven-coins'}
});
/** Draw at the collectible's origin; the unique shape fits within ±13 x, −17..11 y. */
export function drawRelicCrest(g:G,id:RelicId):void {
  const m=RELIC_CRESTS[id]; if(!m)throw new RangeError(`Unknown relic crest ${id}`);
  const path=(pts:number[],width=2)=>{g.strokeStyle=m.color;g.lineWidth=width;g.beginPath();g.moveTo(pts[0]!,pts[1]!);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i]!,pts[i+1]!);g.stroke();};
  const gem=(x:number,y:number,r:number)=>{g.fillStyle=m.color;g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.closePath();g.fill();};
  g.save();g.lineJoin='round';g.lineCap='round';
  switch(id){
    case 'wyrd-fang':
      path([-11,-12,-9,6,-4,2,-1,-11],2.6);path([2,-11,5,5,9,8,12,-11],2.6);gem(0,-3,2);break;
    case 'skald-drum':
      path([-11,-10,11,-10,11,9,-11,9,-11,-10],2.4);
      path([-10,-8,10,8,-10,8,10,-8],1.2);for(const x of [-8,0,8])gem(x,-11,1.4);break;
    case 'storm-feather':
      path([-10,10,9,-13],2.2);path([-8,-4,-12,-12,4,-15,9,-13,12,0,-2,7],2);
      path([-5,-1,5,-2,1,4],1);break;
    case 'hugin-lens':
      path([-13,-3,-5,-10,5,-10,13,-3,5,4,-5,4,-13,-3],2);
      g.strokeStyle=m.color;g.lineWidth=1.5;g.beginPath();g.arc(0,-3,5,0,Math.PI*2);g.stroke();gem(0,-3,2);break;
    case 'ash-anchor':
      path([0,-14,0,8,-6,9,-11,3,-11,-1],2.5);path([0,8,6,9,11,3,11,-1],2.5);
      path([-7,-10,7,-10],2);g.strokeStyle=m.color;g.beginPath();g.arc(0,-13,3,0,Math.PI*2);g.stroke();break;
    case 'shieldroot':
      path([0,-15,11,-10,9,3,0,10,-9,3,-11,-10,0,-15],2.5);
      path([0,-11,0,5,-5,1,-7,5],2);path([0,-1,5,-5,7,-1],1.5);break;
    case 'eir-thread':
      path([0,8,-9,2,-9,-9,0,-13,9,-9,9,2,0,8],2);
      path([-8,-4,8,3,-6,4,8,-7],1.3);gem(0,-3,2.5);break;
    case 'raven-hoard':
      path([-11,-10,-2,-5,0,-9,2,-5,11,-10,6,0,0,3,-6,0,-11,-10],2);
      for(const x of [-6,0,6]){g.strokeStyle=m.color;g.lineWidth=1.4;g.beginPath();g.arc(x,7,2.4,0,Math.PI*2);g.stroke();}break;
  }
  g.restore();
}
