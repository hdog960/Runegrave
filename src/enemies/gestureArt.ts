/** Gate A original enemy silhouettes: animated accessory/attack gestures.
 * Only paints within an individual enemy transform. Combat timings, radius, hit
 * logic and movement are entirely determined by HostileEncounter, not here.
 */
import type {EnemyKind} from './encounters.js';
export const ENEMY_GESTURES=Object.freeze({
 draugr:'raised-iron-claw',wisp:'orbiting-will-lights',archer:'drawn-bow',
 charger:'sparking-horns',sentinel:'radial-rune-teeth',shade:'spectral-ribbons',
 warden:'rootbound-crown'
} as const satisfies Record<EnemyKind,string>);
export function gestureIntensity(state:string,phase:number,time:number):number {
 if(!Number.isFinite(phase)||!Number.isFinite(time))throw new RangeError('Nonfinite enemy gesture');
 if(state==='warning')return 1;
 if(state==='charge')return .85;
 return .22+.12*Math.sin(time*(phase>1?4:3));
}
export function drawEnemyGesture(g:CanvasRenderingContext2D,kind:EnemyKind,state:string,phase:number,t:number):void {
 if(!Object.hasOwn(ENEMY_GESTURES,kind))throw new RangeError('Unknown enemy gesture');
 const threat=gestureIntensity(state,phase,t),active=state==='warning'||state==='charge';
 const px=(x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x1:number,y1:number,x2:number,y2:number,color:string,width=1.5)=>{g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
 g.save();
 switch(kind){
  case 'draugr':{
   // Hulking corpse soldier: claw lifts into a high, clearly threatening arc.
   const lift=active?-10:-1;
   px(-13,-6+lift,5,12,'#566a62');px(-16,-9+lift,6,5,'#bda57e');
   for(const xx of [-16,-13,-10])px(xx,-12+lift,2,4,active?'#ffd796':'#9aab87');
   px(10,-3,5,11,'#3b5350');line(10,3,15,10,'#ac9066',2);
   break;
  }
  case 'wisp':{
   // Satellites broadcast a spectral projectile release, not a melee swing.
   for(let i=0;i<3;i++){
    const a=t*1.4+i*Math.PI*2/3,dist=active?17:12;
    const x=Math.cos(a)*dist,y=-3+Math.sin(a)*dist*.6;
    px(x-2,y-2,4,4,active?'#f5fbec':'#9ad9dd');
   }
   line(-3,1,3,-9,'#e5f8df',1);
   break;
  }
  case 'archer':{
   // A curved bow with drawn string gains a visible highlighted arrowhead.
   const bowX=active?15:12;
   g.strokeStyle='#d8c096';g.lineWidth=2;g.beginPath();g.moveTo(bowX,-18);g.lineTo(bowX+5,-11);g.lineTo(bowX+6,1);g.lineTo(bowX,9);g.stroke();
   line(bowX,-18,bowX,9,'#d8efcf',.8);
   line(5,-7,bowX+5,-7,active?'#fff1c5':'#aaa995',1.5);
   px(bowX+2,-10,4,5,active?'#ffd48e':'#768b80');
   break;
  }
  case 'charger':{
   // Braced ram horns and rear-facing sparks show charge direction plainly.
   px(-16,-21,6,10,active?'#e7bd8d':'#aa9176');px(10,-21,6,10,active?'#e7bd8d':'#aa9176');
   for(const side of [-1,1]){
    line(side*13,-19,side*17,-24,active?'#fff3c9':'#c2b18f',2);
    if(active)px(side*18,-27+(Math.round(t*14)%3),3,3,'#ffc573');
   }
   px(-8,8,6,4,'#847057');px(2,8,6,4,'#847057');
   break;
  }
  case 'sentinel':{
   // Rotating metallic teeth communicate a radial projectile family.
   const ring=active?16:14;
   g.strokeStyle=active?'#ffe4a8':'#89b3a8';g.lineWidth=1.5;g.beginPath();g.arc(0,-3,ring,0,Math.PI*2);g.stroke();
   for(let k=0;k<4;k++){
    const a=t*.45+k*Math.PI/2;
    px(Math.cos(a)*ring-2,-3+Math.sin(a)*ring-2,4,4,active?'#fff2b7':'#6e8e91');
   }
   break;
  }
  case 'shade':{
   // Trailing torn spectral cloth makes the blink/teleport silhouette visible.
   for(const s of [-1,1]){
    const flick=active?5:2;
    line(s*9,2,s*(15+flick),10+Math.sin(t*3+s)*3,active?'#e1c7ff':'#897bab',2);
    px(s*(14+flick),9,3,3,'#8176b7');
   }
   px(-3,-14,6,3,active?'#f8d9ff':'#857eb0');
   break;
  }
  case 'warden':{
   // Crown roots and the phase-two forging aura are boss-only, not fake hitboxes.
   const c=phase>1?'#ffb174':'#bed4a3';
   for(const s of [-1,1]){
    line(s*20,-24,s*28,-34+Math.sin(t*2+s)*2,c,3);
    line(s*28,-34,s*31,-43+Math.sin(t*2+s)*2,c,2);
    px(s*30-2,-43,5,5,active?'#fff0bc':c);
   }
   if(phase>1){
    px(-14,17,7,3,active?'#ffe09e':'#cd9566');
    px(7,17,7,3,active?'#ffe09e':'#cd9566');
   }
   break;
  }
 }
 if(active){
  // Body-centered, non-color-only windup chevron in each original silhouette.
  const top=kind==='warden'?-48:-23;
  line(-4,top+4,0,top,'#fff2ce',2);
  line(0,top,4,top+4,'#fff2ce',2);
 }
 g.restore();
}
