/** v0.04 original art, responsive viewport and v0.03 aiming input trial inside an entirely separate world canvas.
 * No enemies, damage, room clearing or saved runs yet: those are later milestones. */
import { rngStream } from '../core/rng.js';
import { paintSanctuary, drawWayfarer } from './sanctuaryArt.js';
import { ZERO, type Vector2 } from '../input/vector.js';
import type { InputSnapshot } from '../input/twinStick.js';

const WIDTH = 420;

export type StageMetrics = {
  cssWidth: number;
  cssHeight: number;
  pixelWidth: number;
  pixelHeight: number;
  cameraWidth: number;
  cameraHeight: number;
};

/** Camera width follows exactly the visible canvas; never renders under UI rails. */
export function stageMetrics(cssWidth: number, cssHeight: number, devicePixelRatio = 1): StageMetrics {
  if (!(cssWidth > 0 && cssHeight > 0) || !Number.isFinite(cssWidth + cssHeight)) {
    throw new RangeError('Stage must have a measurable nonzero central viewport');
  }
  const dpr = Math.min(2.5, Math.max(1, devicePixelRatio));
  return {
    cssWidth, cssHeight,
    pixelWidth: Math.max(1, Math.round(cssWidth * dpr)),
    pixelHeight: Math.max(1, Math.round(cssHeight * dpr)),
    cameraWidth: WIDTH,
    cameraHeight: WIDTH * cssHeight / cssWidth
  };
}

function rect(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){g.fillStyle=color;g.fillRect(x,y,w,h);}

/** Input-driven original-art training view only; collisions and damage are v0.05–v0.08 roadmap work. */
export function mountStage(canvas: HTMLCanvasElement, readInput:()=>InputSnapshot=()=>({move:ZERO,aim:ZERO,firing:false,paused:false})) {
  const parent = canvas.parentElement;
  const g = canvas.getContext('2d', { alpha:false });
  if (!parent || !g) throw new Error('Runegrave requires a dedicated stage canvas');
  const random = rngStream('runegrave-v0.04','visual-floor');
  const embers = Array.from({length:22},()=>({x:random.next()*WIDTH,y:random.next()*320,s:1+random.next()*2,pace:.6+random.next()*.8}));
  let raf = 0; let lastTime = 0; let lastFrameMs = -Infinity;
  let paused=false;let initialized=false;let shotCooldown=0;let walking:Vector2=ZERO;let firing=false;
  const actor={x:WIDTH/2,y:120};let lastAim:Vector2={x:0,y:1};
  type Bolt={x:number;y:number;vx:number;vy:number;age:number};
  const bolts:Bolt[]=[];
  let metrics: StageMetrics;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function resize(){
    const bounds = parent!.getBoundingClientRect();
    if(bounds.width<1||bounds.height<1)return;
    metrics=stageMetrics(bounds.width,bounds.height,window.devicePixelRatio||1);
    if(!initialized){actor.y=metrics.cameraHeight*.55;initialized=true;}
    actor.x=Math.max(22,Math.min(metrics.cameraWidth-22,actor.x));
    actor.y=Math.max(48,Math.min(metrics.cameraHeight-25,actor.y));
    canvas.width=metrics.pixelWidth;canvas.height=metrics.pixelHeight;
    canvas.dataset.cameraWidth=metrics.cameraWidth.toFixed(2);canvas.dataset.cameraHeight=metrics.cameraHeight.toFixed(2);
    render(lastTime);
  }
  function render(time:number){
    if(!metrics)return;
    const W=metrics.cameraWidth,H=metrics.cameraHeight;
    g!.setTransform(metrics.pixelWidth/W,0,0,metrics.pixelHeight/H,0,0);
    paintSanctuary(g!,W,H,time);
    for(const bolt of bolts){
      const a=Math.max(.2,1-bolt.age/1.3);g!.globalAlpha=a;
      g!.fillStyle='#b4d2c3';g!.beginPath();g!.arc(bolt.x,bolt.y,4,0,Math.PI*2);g!.fill();
      rect(g!,bolt.x-1,bolt.y-1,3,3,'#f0e4ac');g!.globalAlpha=1;
    }
    drawWayfarer(g!,actor.x,actor.y,time,walking.x,walking.y,lastAim.x,lastAim.y,firing);
    for(let i=0;i<embers.length;i++){
      const e=embers[i]!;const y=(e.y-time*6*e.pace%340+340)%340;
      if(y<H) rect(g!,e.x,y,e.s,e.s,i%3===0?'#e9c582':'#6d9e94');
    }

  }
  function update(dt:number){
    if(paused||!metrics)return;
    const input=readInput();if(input.paused)return;
    const speed=95; // Visual training speed only; fixed-step physics arrives v0.05.
    walking=input.move;firing=input.firing;
    actor.x=Math.max(22,Math.min(metrics.cameraWidth-22,actor.x+input.move.x*speed*dt));
    actor.y=Math.max(48,Math.min(metrics.cameraHeight-25,actor.y+input.move.y*speed*dt));
    if(Math.hypot(input.aim.x,input.aim.y)>.04)lastAim=input.aim;
    shotCooldown=Math.max(0,shotCooldown-dt);
    if(input.firing&&shotCooldown<=0&&bolts.length<24){
      const len=Math.hypot(lastAim.x,lastAim.y)||1;
      const vx=lastAim.x/len,vy=lastAim.y/len;
      bolts.push({x:actor.x+vx*19,y:actor.y+vy*19,vx:vx*185,vy:vy*185,age:0});
      shotCooldown=.18;
    }
    for(let i=bolts.length-1;i>=0;i--){
      const shot=bolts[i]!;shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.age+=dt;
      if(shot.age>1.3||shot.x<0||shot.y<0||shot.x>metrics.cameraWidth||shot.y>metrics.cameraHeight)bolts.splice(i,1);
    }
    canvas.dataset.actorX=actor.x.toFixed(2);canvas.dataset.actorY=actor.y.toFixed(2);
    canvas.dataset.boltCount=String(bolts.length);
  }
  function tick(ms:number){
    if(document.hidden){raf=0;lastFrameMs=-Infinity;return;}
    const delta=lastFrameMs===-Infinity?0:Math.min(.05,Math.max(0,(ms-lastFrameMs)/1000));
    lastFrameMs=ms;
    if(!paused){
      update(delta);
      if(ms-lastTime>=1000/45){lastTime=ms;render(reduced.matches?0:ms/1000);}
    }
    raf=requestAnimationFrame(tick);
  }
  const observer=new ResizeObserver(resize);observer.observe(parent);
  resize();
  raf=requestAnimationFrame(tick);
  const onOrientation=()=>resize();
  const onVisibility=()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;lastFrameMs=-Infinity;}else{resize();if(!raf)raf=requestAnimationFrame(tick);}};
  window.addEventListener('orientationchange',onOrientation,{passive:true});
  document.addEventListener('visibilitychange',onVisibility);
  return {
    resize,
    getMetrics:()=>metrics,
    getActor:()=>({...actor,boltCount:bolts.length}),
    setPaused:(value:boolean)=>{paused=value;walking=ZERO;firing=false;lastFrameMs=-Infinity;if(!value&&raf===0&&!document.hidden)raf=requestAnimationFrame(tick);},
    stop:()=>{observer.disconnect();window.removeEventListener('orientationchange',onOrientation);document.removeEventListener('visibilitychange',onVisibility);if(raf)cancelAnimationFrame(raf);}
  };
}
