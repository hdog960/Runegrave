/** v0.06: real deterministic Soulbolt collision/damage against destructible training props.
 * Enemy AI and player health are NOT implemented until the locked later milestones.
 */
import { rngStream } from '../core/rng.js';
import { paintSanctuary, drawWayfarer } from './sanctuaryArt.js';
import { ZERO, type Vector2 } from '../input/vector.js';
import type { InputSnapshot } from '../input/twinStick.js';
import { FixedStepClock } from '../physics/fixedStep.js';
import { makeRootvaultWorld, moveCircle, safeSpawn, isPositionFree, WALK_SPEED, HERO_RADIUS, type CollisionWorld } from '../physics/world.js';
import { SoulboltCombat } from '../combat/soulbolts.js';
import { drawPracticeTargets, drawSoulbolts, drawCombatSparks, type CombatSpark } from '../combat/combatArt.js';

const WIDTH=420;
export type StageMetrics={cssWidth:number;cssHeight:number;pixelWidth:number;pixelHeight:number;cameraWidth:number;cameraHeight:number};
/** The camera never renders behind either controller rail or any persistent HUD. */
export function stageMetrics(cssWidth:number,cssHeight:number,devicePixelRatio=1):StageMetrics {
  if(!(cssWidth>0&&cssHeight>0)||!Number.isFinite(cssWidth+cssHeight))throw new RangeError('Stage requires a nonzero measurable center canvas');
  const dpr=Math.min(2.5,Math.max(1,devicePixelRatio));
  return {cssWidth,cssHeight,pixelWidth:Math.max(1,Math.round(cssWidth*dpr)),pixelHeight:Math.max(1,Math.round(cssHeight*dpr)),cameraWidth:WIDTH,cameraHeight:WIDTH*cssHeight/cssWidth};
}
function rect(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){g.fillStyle=color;g.fillRect(x,y,w,h);}

export function mountStage(canvas:HTMLCanvasElement,readInput:()=>InputSnapshot=()=>({move:ZERO,aim:ZERO,firing:false,paused:false})){
  const parent=canvas.parentElement,g=canvas.getContext('2d',{alpha:false});
  if(!parent||!g)throw new Error('Runegrave requires a dedicated center-only canvas');
  const random=rngStream('runegrave-v0.04','visual-floor');
  const embers=Array.from({length:22},()=>({x:random.next()*WIDTH,y:random.next()*320,s:1+random.next()*2,pace:.6+random.next()*.8}));
  const clock=new FixedStepClock();
  let raf=0,lastTime=0,lastFrameMs=-Infinity,paused=false,initialized=false;
  let walking:Vector2=ZERO,firing=false,world:CollisionWorld|undefined,combat:SoulboltCombat|undefined;
  let actor={x:WIDTH/2,y:120};let lastAim:Vector2={x:0,y:1};
  const sparks:CombatSpark[]=[];
  const score=document.querySelector<HTMLElement>('[data-combat-score]');
  function attachCombat(nextWorld:CollisionWorld){
    combat=new SoulboltCombat(nextWorld,actor);
    sparks.length=0;
    combat.on('impact',e=>{
      if(sparks.length>=24)sparks.shift();
      sparks.push({x:e.x,y:e.y,life:.3,maxLife:.3,kind:e.targetId?'impact':'wall'});
    });
    combat.on('break',e=>{
      if(sparks.length>=24)sparks.shift();
      sparks.push({x:e.x,y:e.y,life:.65,maxLife:.65,kind:'break'});
    });
  }
  let metrics:StageMetrics|undefined;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function emitState(){
    canvas.dataset.actorX=actor.x.toFixed(2);canvas.dataset.actorY=actor.y.toFixed(2);
    const state=combat?.state;
    canvas.dataset.boltCount=String(state?.activeBolts||0);
    canvas.dataset.physicsTick=String(clock.ticks);
    canvas.dataset.hitboxRadius=String(HERO_RADIUS);
    canvas.dataset.safeSpawn=String(Boolean(world&&isPositionFree(world,actor)));
    canvas.dataset.shots=String(state?.shots||0);
    canvas.dataset.hits=String(state?.hits||0);
    canvas.dataset.shattered=String(state?.shattered||0);
    canvas.dataset.liveTargets=String(state?.liveTargets||0);
    if(score)score.textContent=`ᛉ ${state?.shattered||0} SHATTERED`;
  }
  function resize(){
    const bounds=parent!.getBoundingClientRect();if(bounds.width<1||bounds.height<1)return;
    const next=stageMetrics(bounds.width,bounds.height,window.devicePixelRatio||1);
    // CSS can briefly report implausible dimensions during orientation changes. Avoid spawning into clipped geometry.
    if(next.cameraHeight<148)return;
    metrics=next;
    world=makeRootvaultWorld(next.cameraWidth,next.cameraHeight);
    if(!initialized){actor=safeSpawn(world);initialized=true;}
    else if(!isPositionFree(world,actor))actor=safeSpawn(world,actor);
    // Rebuild training objects to fit the new, physically unobstructed room bounds.
    attachCombat(world);
    const movement=combat?.getMovementWorld()||world;
    if(!isPositionFree(movement,actor))actor=safeSpawn(movement,actor);
    canvas.width=next.pixelWidth;canvas.height=next.pixelHeight;
    canvas.dataset.cameraWidth=next.cameraWidth.toFixed(2);canvas.dataset.cameraHeight=next.cameraHeight.toFixed(2);
    emitState();render(lastTime);
  }
  function render(time:number){
    if(!metrics)return;
    const W=metrics.cameraWidth,H=metrics.cameraHeight;
    g!.setTransform(metrics.pixelWidth/W,0,0,metrics.pixelHeight/H,0,0);
    paintSanctuary(g!,W,H,time);
    if(combat){drawPracticeTargets(g!,combat.targets,time);drawSoulbolts(g!,combat.bolts,time);}
    drawCombatSparks(g!,sparks);
    drawWayfarer(g!,actor.x,actor.y,time,walking.x,walking.y,lastAim.x,lastAim.y,firing);
    for(let i=0;i<embers.length;i++){
      const e=embers[i]!,y=(e.y-time*6*e.pace%340+340)%340;
      if(y<H)rect(g!,e.x,y,e.s,e.s,i%3===0?'#e9c582':'#6d9e94');
    }
  }
  function update(dt:number){
    if(paused||!world||!metrics)return;
    const input=readInput();if(input.paused)return;
    walking=input.move;firing=input.firing;
    const physicalWorld=combat?.getMovementWorld()||world;
    actor=moveCircle(physicalWorld,actor,{x:input.move.x*WALK_SPEED,y:input.move.y*WALK_SPEED},dt,HERO_RADIUS);
    if(Math.hypot(input.aim.x,input.aim.y)>.04)lastAim=input.aim;
    combat?.update(dt,actor,lastAim,input.firing);
    for(let i=sparks.length-1;i>=0;i--){sparks[i]!.life-=dt;if(sparks[i]!.life<=0)sparks.splice(i,1);}
    emitState();
  }
  function tick(ms:number){
    if(document.hidden){raf=0;lastFrameMs=-Infinity;clock.reset();return;}
    const delta=lastFrameMs===-Infinity?0:Math.min(.1,Math.max(0,(ms-lastFrameMs)/1000));
    lastFrameMs=ms;
    if(!paused){
      clock.advance(delta,dt=>update(dt));
      if(ms-lastTime>=1000/45){lastTime=ms;render(reduced.matches?0:ms/1000);}
    }
    raf=requestAnimationFrame(tick);
  }
  const observer=new ResizeObserver(resize);observer.observe(parent);
  resize();raf=requestAnimationFrame(tick);
  const onOrientation=()=>{clock.reset();lastFrameMs=-Infinity;resize();};
  const onVisibility=()=>{
    clock.reset();lastFrameMs=-Infinity;
    if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;walking=ZERO;firing=false;}
    else{resize();if(!raf)raf=requestAnimationFrame(tick);}
  };
  window.addEventListener('orientationchange',onOrientation,{passive:true});
  document.addEventListener('visibilitychange',onVisibility);
  return {
    resize,getMetrics:()=>metrics,getActor:()=>({...actor,boltCount:combat?.state.activeBolts||0,physicsTick:clock.ticks,shattered:combat?.state.shattered||0}),
    setPaused:(value:boolean)=>{paused=value;walking=ZERO;firing=false;clock.reset();lastFrameMs=-Infinity;if(!value&&raf===0&&!document.hidden)raf=requestAnimationFrame(tick);},
    stop:()=>{observer.disconnect();window.removeEventListener('orientationchange',onOrientation);document.removeEventListener('visibilitychange',onVisibility);if(raf)cancelAnimationFrame(raf);}
  };
}
