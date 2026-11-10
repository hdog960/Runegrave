import type { EmberTrial } from './emberTrial.js';
/** Only in-world interactive art belongs here; every health display lives in a grip. */
export function drawEmberTrial(g:CanvasRenderingContext2D,trial:EmberTrial,time:number){
  const px=(x:number,y:number,w:number,h:number,color:string)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
  for(const p of trial.pads){
    g.save();g.translate(Math.round(p.x),Math.round(p.y));
    g.globalAlpha=.94;
    g.fillStyle=p.active?'#753b23':p.warning?'#5c4630':'#283b3d';
    g.beginPath();g.arc(0,0,p.radius+4,0,Math.PI*2);g.fill();
    g.strokeStyle=p.active?'#ffaf6a':p.warning?'#f0c976':'#779e96';g.lineWidth=2;
    g.beginPath();g.arc(0,0,p.radius+1,0,Math.PI*2);g.stroke();
    g.beginPath();g.moveTo(-5,0);g.lineTo(0,-7);g.lineTo(5,0);g.lineTo(0,7);g.closePath();g.stroke();
    if(p.active){
      g.strokeStyle='#ffe6a2';g.lineWidth=1;
      const pulse=Math.sin(time*7)*2;
      g.beginPath();g.arc(0,0,p.radius+5+pulse,0,Math.PI*2);g.stroke();
      px(-2,-7,4,6,'#ffde81');
    }
    if(p.warning){g.strokeStyle='#f2d18e';g.beginPath();g.moveTo(-8,-9);g.lineTo(8,9);g.moveTo(-8,9);g.lineTo(8,-9);g.stroke();}
    g.restore();
  }
  const shrine=trial.shrine;
  g.save();g.translate(Math.round(shrine.x),Math.round(shrine.y));
  g.globalAlpha=shrine.ready?1:.4;
  g.fillStyle='#132e34';g.beginPath();g.arc(0,0,shrine.radius+5,0,Math.PI*2);g.fill();
  g.strokeStyle=shrine.ready?'#a6f0d7':'#506d70';g.lineWidth=2;
  g.beginPath();g.arc(0,0,shrine.radius+2,0,Math.PI*2);g.stroke();
  px(-2,-7,4,14,'#95e0c7');px(-7,-2,14,4,'#95e0c7');
  g.restore();
}
