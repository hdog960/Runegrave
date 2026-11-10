/** Gate A v0.09.15: seven original windup silhouettes; enemy AI and timing unchanged. */
import {warningBeat} from './warningClarity.js';
export const ATTACK_STANCES=Object.freeze({
 draugr:'claw-reach',wisp:'spectral-orbit',archer:'drawn-arrow',
 charger:'ram-horns',sentinel:'radial-staves',shade:'veil-talons',warden:'twin-root-mauls'
});
export function strikePose(e,time,reducedMotion=false) {
 if(!Object.hasOwn(ATTACK_STANCES,e.kind)||![e.windup,time].every(Number.isFinite)||e.windup<0)throw new RangeError('Invalid enemy strike pose');
 const active=e.state==='warning'||e.state==='charge';
 const ready=e.state==='warning'?warningBeat(e.windup):e.state==='charge'?3:0;
 const shift=reducedMotion?0:active?[0,1,2,3][ready]!:Math.round(Math.sin(time*3)*.5);
 return {kind:e.kind,ready,shift,active};
}
export function paintStrikeSilhouette(g,e,time,reducedMotion=false) {
 const p=strikePose(e,time,reducedMotion);if(!p.active)return;
 const k=p.ready,s=p.shift,hot=k===3,ivory=hot?'#fff6d8':'#d8be8f';
 const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const line=(x,y,xx,yy,c,w=2)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();};
 g.save();
 switch(e.kind){
  case 'draugr':{
   line(8,-8,13+s,-14-s,'#718c81',4);
   for(let i=0;i<3;i++)line(13+s,-14-s+i*3,19+s,-19-s+i*3,ivory,1.5);break;
  }
  case 'wisp':{
   for(let i=0;i<3;i++){const angle=i*Math.PI*2/3+Math.PI/6,x=Math.cos(angle)*(12+s),y=Math.sin(angle)*(12+s)-3;px(x-2,y-3,4,7,hot?'#fff8d7':'#8ee3e0');}break;
  }
  case 'archer':{
   const x=15-2*s;line(x,-5,x+12,-5,ivory,2);line(x+12,-5,x+7,-9,ivory,1.2);line(x+12,-5,x+7,-1,ivory,1.2);break;
  }
  case 'charger':{
   for(const side of [-1,1]){line(side*12,-17,side*(19+s),-23-s,ivory,3);line(side*(19+s),-23-s,side*(23+s),-19-s,'#f1d4a2',2);}break;
  }
  case 'sentinel':{
   for(let i=0;i<4;i++){const ang=i*Math.PI/2,rad=18+s,x=Math.cos(ang)*rad,y=Math.sin(ang)*rad-3;
    line(Math.cos(ang)*12,Math.sin(ang)*12-3,x,y,ivory,2.3);px(x-2,y-2,4,4,hot?'#fff3c8':'#a2d6cc');}break;
  }
  case 'shade':{
   for(const side of [-1,1]){line(side*8,-6,side*(16+s),-11-s,'#ae9fd0',2.5);line(side*(16+s),-11-s,side*(22+s),-16-s,hot?'#f6d7ff':'#c3b0e6',2);}break;
  }
  case 'warden':{
   for(const side of [-1,1]){line(side*16,-8,side*(25+s),-19-s,'#879883',5);px(side*(25+s)-5,-27-s,10,10,'#3f5548');px(side*(25+s)-4,-29-s,8,3,hot?'#ffe4b2':'#cfb78a');}break;
  }
 }
 if(hot){line(-5,-26,0,-31,'#fff6d4',1.5);line(0,-31,5,-26,'#fff6d4',1.5);}
 g.restore();
}
