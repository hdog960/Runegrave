/** v0.08: two-wave hostile crypt, Rootbound Warden, and locked-door transitions.
 * All actual game content stays strictly inside the measured gameplay canvas.
 */
import { rngStream } from '../core/rng.js';
import { paintSanctuary, drawWayfarer } from './sanctuaryArt.js';
import { ZERO, type Vector2 } from '../input/vector.js';
import type { InputSnapshot } from '../input/twinStick.js';
import { FixedStepClock } from '../physics/fixedStep.js';
import { makeRootvaultWorld, moveCircle, safeSpawn, isPositionFree, WALK_SPEED, HERO_RADIUS, type CollisionWorld } from '../physics/world.js';
import { SoulboltCombat } from '../combat/soulbolts.js';
import { drawPracticeTargets, drawSoulbolts, drawCombatSparks, type CombatSpark } from '../combat/combatArt.js';
import { MortalHearts, heartSlots } from '../health/mortalHearts.js';
import { EmberTrial } from '../health/emberTrial.js';
import { drawEmberTrial } from '../health/healthArt.js';
import { HostileEncounter, placeDirectedExit, reachableFloor, walkableRoute } from '../enemies/encounters.js';
import { drawEncounter } from '../enemies/enemyArt.js';
import { FIRST_SOUL_CHAMBERS, FIRST_SOUL_RELICS, createFirstSoulRoute, encounterPlan, FirstSoulInventory, type FirstRoom } from '../run/firstSoul.js';
import { drawRoomDrops, paintRoomSigil, nearDrop, type RoomDrop } from '../run/lootArt.js';
import { objectiveText } from '../platform/firstRunGuide.js';
import { directionForChamber, EXIT_LABELS, type ExitDirection } from '../run/wayfinding.js';
import { drawRuneDoor } from './doorArt.js';
import { carvedWaystones, paintWaystones } from './routeArt.js';
import { describeRelicImpact } from '../run/relicImpact.js';

const WIDTH=420;
export type StageMetrics={cssWidth:number;cssHeight:number;pixelWidth:number;pixelHeight:number;cameraWidth:number;cameraHeight:number};
/** The camera never renders behind either controller rail or any persistent HUD. */
export function stageMetrics(cssWidth:number,cssHeight:number,devicePixelRatio=1):StageMetrics {
  if(!(cssWidth>0&&cssHeight>0)||!Number.isFinite(cssWidth+cssHeight))throw new RangeError('Stage requires a nonzero measurable center canvas');
  const dpr=Math.min(2.5,Math.max(1,devicePixelRatio));
  return {cssWidth,cssHeight,pixelWidth:Math.max(1,Math.round(cssWidth*dpr)),pixelHeight:Math.max(1,Math.round(cssHeight*dpr)),cameraWidth:WIDTH,cameraHeight:WIDTH*cssHeight/cssWidth};
}
function rect(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){g.fillStyle=color;g.fillRect(x,y,w,h);}

export function mountStage(canvas:HTMLCanvasElement,readInput:()=>InputSnapshot=()=>({move:ZERO,aim:ZERO,firing:false,paused:false}),onDeath:()=>void=()=>{}){
  const parent=canvas.parentElement,g=canvas.getContext('2d',{alpha:false});
  if(!parent||!g)throw new Error('Runegrave requires a dedicated center-only canvas');
  const random=rngStream('runegrave-v0.04','visual-floor');
  const embers=Array.from({length:22},()=>({x:random.next()*WIDTH,y:random.next()*320,s:1+random.next()*2,pace:.6+random.next()*.8}));
  const clock=new FixedStepClock();
  let raf=0,lastTime=0,lastFrameMs=-Infinity,paused=false,initialized=false;
  let walking:Vector2=ZERO,firing=false,world:CollisionWorld|undefined,combat:SoulboltCombat|undefined,trial:EmberTrial|undefined;
  const health=new MortalHearts();let dead=false,complete=false,restarts=0;
  let mode:'practice'|'crypt'|'warden'|'complete'='practice';
  const inventory=new FirstSoulInventory();
  let route=createFirstSoulRoute('first-soul-0001'),roomIndex=-1,currentRoom:FirstRoom|undefined;
  let drops:RoomDrop[]=[],roomRewardPlaced=false;
  const silverCounter=document.querySelector<HTMLElement>('[data-silver]');
  const relicReadout=document.querySelector<HTMLElement>('[data-relic-readout]');
  const relicLine=document.querySelector<HTMLElement>('[data-relic-line]');
  const relicEffect=document.querySelector<HTMLElement>('[data-relic-effect]');
  const pickupInfo=document.querySelector<HTMLElement>('[data-pickup-info]');
  const doorHint=document.querySelector<HTMLElement>('[data-door-hint]');
  const ledger=document.querySelector<HTMLDetailsElement>('#run-ledger');
  const ledgerList=document.querySelector<HTMLOListElement>('#ledger-relics');
  const ledgerCurrency=document.querySelector<HTMLElement>('[data-ledger-currency]');
  let displayedRelicLedger='';
  let encounter:HostileEncounter|undefined;
  let practiceExit:Vector2|undefined;
  let exitTrail:readonly Vector2[]=[];
  let gateDirection:ExitDirection='east';
  const completeOverlay=document.querySelector<HTMLElement>('#trial-clear-overlay');
  const floorLabel=document.querySelector<HTMLElement>('.status-middle');
  const deathOverlay=document.querySelector<HTMLElement>('#death-overlay');
  const heartLine=document.querySelector<HTMLElement>('[data-heart-icons]');
  const heartReadout=document.querySelector<HTMLElement>('[data-heart-readout]');
  const deathCount=document.querySelector<HTMLElement>('[data-death-summary]');
  let actor={x:WIDTH/2,y:120};let lastAim:Vector2={x:0,y:1};
  const sparks:CombatSpark[]=[];
  const score=document.querySelector<HTMLElement>('[data-combat-score]');
  function attachCombat(nextWorld:CollisionWorld){
    combat=new SoulboltCombat(nextWorld,actor,mode==='practice');
    combat.setProfile(inventory.profile());
    if(encounter)combat.setHostileHitHandler((p,radius,damage,dir)=>encounter?.hitAt(p,radius,damage,dir)||null);
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
    const hs=health.state;
    canvas.dataset.heartUnits=String(hs.units);canvas.dataset.heartMax=String(hs.maxUnits);
    canvas.dataset.invulnerability=hs.grace.toFixed(4);canvas.dataset.dead=String(hs.dead);
    canvas.dataset.healthHits=String(hs.hits);canvas.dataset.healthHealed=String(hs.healed);
    canvas.dataset.hazardHits=String(trial?.state.contacts||0);
    canvas.dataset.shrineReady=String(trial?.shrine.ready??false);
    canvas.dataset.restarts=String(restarts);
    const activeExit=encounter?.exit||practiceExit;
    canvas.dataset.exitX=activeExit?activeExit.x.toFixed(2):'';
    canvas.dataset.exitY=activeExit?activeExit.y.toFixed(2):'';
    canvas.dataset.room=mode;
    canvas.dataset.exitDirection=gateDirection;
    canvas.dataset.roomId=currentRoom?.id||'';
    canvas.dataset.roomIndex=String(roomIndex+1);
    canvas.dataset.roomTotal=String(FIRST_SOUL_CHAMBERS);
    canvas.dataset.catalogCount=String(25);
    canvas.dataset.relicCount=String(inventory.state.relics.length);
    canvas.dataset.silver=String(inventory.state.silver);
    canvas.dataset.remainingDrops=String(drops.filter(d=>!d.collected).length);
    canvas.dataset.relicGateReady=String(!drops.some(d=>d.kind==='relic'&&!d.collected));
    const exitOpen=mode==='practice'||encounter?.snapshot.phase==='gate'&&!drops.some(d=>d.kind==='relic'&&!d.collected);
    document.documentElement.dataset.doorReady=String(Boolean(exitOpen));
    canvas.dataset.roomPhase=encounter?.snapshot.phase|| (complete?'finished':'gate');
    canvas.dataset.roomWave=String(encounter?.snapshot.wave||0);
    canvas.dataset.hostilesAlive=String(encounter?.snapshot.enemies.filter(e=>e.alive).length||0);
    canvas.dataset.hostileKills=String(encounter?.snapshot.kills||0);
    canvas.dataset.bossPhase=String(encounter?.snapshot.bossPhase||0);
    canvas.dataset.bossDefeated=String(encounter?.snapshot.bossDefeated||false);
    canvas.dataset.enemyProjectiles=String(encounter?.snapshot.projectiles.length||0);
    document.documentElement.dataset.roomName=complete?'COMPLETE':mode.toUpperCase();
    document.documentElement.dataset.roomPhase=objectiveText({
      mode, phase:encounter?.snapshot.phase||'gate',
      alive:encounter?.snapshot.enemies.filter(e=>e.alive).length||0,
      missingRelic:drops.some(d=>d.kind==='relic'&&!d.collected),
      roomNumber:roomIndex+1, roomTotal:FIRST_SOUL_CHAMBERS,exitDirection:gateDirection
    });
    const footer=document.querySelector<HTMLElement>('[data-run-status]');if(footer)footer.textContent=document.documentElement.dataset.roomPhase;
    if(doorHint)doorHint.textContent=`${EXIT_LABELS[gateDirection].arrow} ${EXIT_LABELS[gateDirection].label} DOOR`;
    if(silverCounter)silverCounter.textContent=`SILVER ${inventory.state.silver}`;
    if(ledgerCurrency)ledgerCurrency.textContent=`ᚠ ${inventory.state.silver} SILVER · ${roomIndex+1}/${FIRST_SOUL_CHAMBERS} CHAMBERS`;
    const ids=inventory.state.relics;
    if(displayedRelicLedger!==ids.join(',')){
      displayedRelicLedger=ids.join(',');
      if(ledger)ledger.querySelector('summary')!.textContent=`ᛟ BOUND RELICS · ${ids.length}/8`;
      if(ledgerList){ledgerList.replaceChildren();
        if(!ids.length){const li=document.createElement('li');li.textContent='Fate has not yet bound a relic.';ledgerList.append(li);}
        for(const id of ids){const item=FIRST_SOUL_RELICS.find(x=>x.id===id)!;const li=document.createElement('li'),name=document.createElement('strong');
          name.textContent=`${item.rune} ${item.name} — `;li.append(name,item.description);ledgerList.append(li);}
      }
    }
    if(relicReadout){const last=inventory.state.relics.at(-1);const item=FIRST_SOUL_RELICS.find(x=>x.id===last);relicReadout.textContent=item?item.name.toUpperCase():'UNBOUND';}
    if(relicEffect){const newest=FIRST_SOUL_RELICS.find(x=>x.id===inventory.state.relics.at(-1));relicEffect.textContent=newest?.description||'GOLD PICKUP = NEW POWER';}
    if(relicLine)relicLine.textContent=`${inventory.state.relics.length}/8 RELICS`;
    if(floorLabel)floorLabel.textContent=mode==='practice'?'MIDGARD · ROOTVAULT ANTECHAMBER':mode==='crypt'?`MIDGARD · ${currentRoom?.title||'FIRST SOUL CHAMBER'}`:mode==='warden'?'MIDGARD · ROOTBOUND WARDEN':'MIDGARD · ROOTVAULT CLEARED';
    if(heartLine){heartLine.replaceChildren();for(const [i,slot] of heartSlots(hs.units,hs.maxUnits).entries()){
      const el=document.createElement('span');el.className=`heart-icon mortal-${slot}`;
      el.textContent=slot==='full'?'♥':slot==='half'?'◐':'♡';
      el.setAttribute('aria-hidden','true');el.dataset.slot=String(i);heartLine.append(el);
    }}
    const description=`${(hs.units/2).toFixed(hs.units%2?1:0)} / ${hs.containers} HEARTS`;
    if(heartReadout)heartReadout.textContent=hs.dead?'THREAD SEVERED':description;
    if(heartLine)heartLine.setAttribute('aria-label',`Mortal Hearts ${description}`);
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
    // Reframe hostile positions while retaining their health/wave/progress on orientation change.
    const previous=trial?.exportState();
    practiceExit=placeDirectedExit(world,actor,'east');
    if(encounter){encounter.reframe(world);gateDirection=encounter.exitDirection;}
    exitTrail=[];
    attachCombat(world);
    const movement=combat?.getMovementWorld()||world;
    if(!isPositionFree(movement,actor))actor=safeSpawn(movement,actor);
    trial=mode==='practice'?new EmberTrial(world,actor,combat?.targets||[]):undefined;
    if(previous&&trial)trial.restoreState(previous);
    canvas.width=next.pixelWidth;canvas.height=next.pixelHeight;
    canvas.dataset.cameraWidth=next.cameraWidth.toFixed(2);canvas.dataset.cameraHeight=next.cameraHeight.toFixed(2);
    emitState();render(lastTime);
  }
  function render(time:number){
    if(!metrics)return;
    const W=metrics.cameraWidth,H=metrics.cameraHeight;
    g!.setTransform(metrics.pixelWidth/W,0,0,metrics.pixelHeight/H,0,0);
    paintSanctuary(g!,W,H,time);
    if(trial)drawEmberTrial(g!,trial,time);
    if(currentRoom&&mode==='crypt')paintRoomSigil(g!,W,H,time,currentRoom);
    if(exitTrail.length)paintWaystones(g!,exitTrail,time);
    if(encounter)drawEncounter(g!,encounter,time,!drops.some(d=>d.kind==='relic'&&!d.collected));
    drawRoomDrops(g!,drops,time);
    if(mode==='practice'&&practiceExit)drawRuneDoor(g!,practiceExit,'east',true,time);
    if(combat){drawPracticeTargets(g!,combat.targets,time);drawSoulbolts(g!,combat.bolts,time);}
    drawCombatSparks(g!,sparks);
    // A subtle flicker is a shape-independent i-frame indicator; no HUD covers the playfield.
    if(health.state.grace===0||Math.floor(health.state.grace*12)%2===0)
      drawWayfarer(g!,actor.x,actor.y,time,walking.x,walking.y,lastAim.x,lastAim.y,firing);
    for(let i=0;i<embers.length;i++){
      const e=embers[i]!,y=(e.y-time*6*e.pace%340+340)%340;
      if(y<H)rect(g!,e.x,y,e.s,e.s,i%3===0?'#e9c582':'#6d9e94');
    }
  }
  function enterRoom(room:'crypt'|'warden'){
    if(!world)return;
    if(room==='crypt'){
      roomIndex++;
      if(roomIndex>=FIRST_SOUL_CHAMBERS){enterRoom('warden');return;}
      currentRoom=route[roomIndex];
    }else currentRoom=undefined;
    mode=room;trial=undefined;sparks.length=0;clock.reset();
    gateDirection=room==='warden'?'north':directionForChamber(roomIndex);
    drops=[];roomRewardPlaced=false;exitTrail=[];
    actor=safeSpawn(world,{x:world.width*.26,y:world.minY+24});
    encounter=new HostileEncounter(world,room,actor,room==='crypt'&&currentRoom?encounterPlan(currentRoom):undefined,gateDirection);
    attachCombat(world);walking=ZERO;firing=false;lastAim={x:1,y:0};emitState();
  }
  function finishTrial(){
    mode='complete';complete=true;walking=ZERO;firing=false;
    if(completeOverlay)completeOverlay.hidden=false;
    emitState();onDeath();
  }
  /** Drops are placed on the same connected floor component as the player.
   * Relic pickup is mandatory; silver and healing are optional resources. */
  function placeDrops():void {
    if(!world||!encounter||roomRewardPlaced)return;
    roomRewardPlaced=true;inventory.roomCleared(health);
    const floor=reachableFloor(world,actor);
    const taken: {x:number;y:number}[]=[];
    function near(target:{x:number;y:number}){
      const candidates=floor.filter(p=>Math.hypot(p.x-actor.x,p.y-actor.y)>28&&Math.hypot(p.x-encounter!.exit.x,p.y-encounter!.exit.y)>25&&taken.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>29));
      if(!candidates.length)throw new Error('No connected collectible position in chamber');
      candidates.sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y));
      const point=candidates[0]!;taken.push(point);return point;
    }
    if(mode==='crypt'){const relic=FIRST_SOUL_RELICS[roomIndex];if(!relic)throw new Error('Missing mandatory Gate A relic reward');
      const pos=near({x:world.width*.5,y:world.minY+(world.maxY-world.minY)*.45});
      drops.push({id:`relic-${roomIndex}`,kind:'relic',...pos,relic,amount:1,collected:false});
    }
    const silver=near({x:world.width*.62,y:world.minY+(world.maxY-world.minY)*.55});
    drops.push({id:`silver-${roomIndex}`,kind:'silver',...silver,amount:mode==='warden'?12:2+roomIndex%3,collected:false});
    if(mode==='crypt'&&roomIndex%3===1){const heart=near({x:world.width*.39,y:world.minY+(world.maxY-world.minY)*.70});drops.push({id:`heart-${roomIndex}`,kind:'heart',...heart,amount:2,collected:false});}
  }
  function collectDrops():void {
    for(const drop of drops){if(!nearDrop(actor,drop))continue;drop.collected=true;
      if(drop.kind==='relic'&&drop.relic){
        const before={profile:inventory.profile(),heartContainers:health.state.containers,heartUnits:health.state.units};
        const acquired=inventory.acquire(drop.relic.id,health);combat?.setProfile(inventory.profile());
        const change=describeRelicImpact(drop.relic.id,before,{profile:inventory.profile(),heartContainers:health.state.containers,heartUnits:health.state.units});
        if(acquired){
          if(pickupInfo)pickupInfo.textContent=`RELIC BOUND: ${drop.relic.description}`;
          window.dispatchEvent(new CustomEvent('runegrave:relic-acquired',{detail:{name:drop.relic.name,rune:drop.relic.rune,effect:drop.relic.description,change}}));
        }
      }
      else if(drop.kind==='silver'){const gained=inventory.collectSilver(drop.amount);if(pickupInfo)pickupInfo.textContent=`+${gained} SILVER · SAVED THIS RUN (SHOPS LATER)`;}
      else if(drop.kind==='heart'){const restored=health.heal(drop.amount);if(pickupInfo)pickupInfo.textContent=restored?`HEALED ${restored/2} HEART · MORE HEALTH`:'HEART PICKUP · ALREADY FULL';}
    }
  }
  function update(dt:number){
    if(paused||dead||complete||!world||!metrics)return;
    const input=readInput();if(input.paused)return;
    walking=input.move;firing=input.firing;
    const physicalWorld=combat?.getMovementWorld()||world;
    actor=moveCircle(physicalWorld,actor,{x:input.move.x*WALK_SPEED,y:input.move.y*WALK_SPEED},dt,HERO_RADIUS);
    if(Math.hypot(input.aim.x,input.aim.y)>.04)lastAim=input.aim;
    combat?.update(dt,actor,lastAim,input.firing);
    health.step(dt);
    const outcome=trial?.step(dt,actor,health);
    encounter?.step(dt,actor,health);
    if(encounter?.snapshot.phase==='gate'&&!roomRewardPlaced)placeDrops();
    collectDrops();
    if(!exitTrail.length&&world){
      const ready=mode==='practice'||encounter?.snapshot.phase==='gate'&&!drops.some(d=>d.kind==='relic'&&!d.collected);
      const target=mode==='practice'?practiceExit:encounter?.exit;
      if(ready&&target)exitTrail=carvedWaystones(walkableRoute(world,actor,target));
    }
    if(health.state.dead){
      dead=true;walking=ZERO;firing=false;
      if(deathOverlay)deathOverlay.hidden=false;
      if(deathCount)deathCount.textContent=`${health.state.hits} WOUNDS · ${encounter?.snapshot.kills||0} HOSTILES FELLED`;
      // No further simulation when the thread breaks. The replacement menu is only
      // displayed after the simulation has genuinely stopped.
      onDeath();
    }
    for(let i=sparks.length-1;i>=0;i--){sparks[i]!.life-=dt;if(sparks[i]!.life<=0)sparks.splice(i,1);}
    if(mode==='practice'&&practiceExit&&Math.hypot(actor.x-practiceExit.x,actor.y-practiceExit.y)<18){enterRoom('crypt');return;}
    if(encounter?.canLeave(actor)&&!drops.some(d=>d.kind==='relic'&&!d.collected)){
      if(mode==='crypt'){enterRoom('crypt');return;}
      if(mode==='warden'){finishTrial();return;}
    }
    emitState();
  }
  function tick(ms:number){
    if(document.hidden){raf=0;lastFrameMs=-Infinity;clock.reset();return;}
    const delta=lastFrameMs===-Infinity?0:Math.min(.1,Math.max(0,(ms-lastFrameMs)/1000));
    lastFrameMs=ms;
    if(!paused&&!dead&&!complete){
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
    resize,getMetrics:()=>metrics,
    getRoute:()=>[...route],
    getInventory:()=>inventory.state,
    getDrops:()=>drops.map(d=>({...d})),
    getActor:()=>({...actor,boltCount:combat?.state.activeBolts||0,physicsTick:clock.ticks,shattered:combat?.state.shattered||0}),
    getEncounter:()=>encounter,
    getHealth:()=>health.state,
    isComplete:()=>complete,
    getPathToExit:()=>world&&walkableRoute(world,actor,encounter?.exit||practiceExit||actor),
    restart:()=>{
      if(!world||(!dead&&!complete))return false;
      health.reset();inventory.reset();dead=false;complete=false;mode='practice';encounter=undefined;paused=false;restarts++;clock.reset();lastFrameMs=-Infinity;
      roomIndex=-1;currentRoom=undefined;gateDirection='east';
      if(pickupInfo)pickupInfo.textContent='GOLD = UPGRADE · SILVER = CURRENCY';
      route=createFirstSoulRoute(`first-soul-${String(restarts+1).padStart(4,'0')}`);drops=[];roomRewardPlaced=false;exitTrail=[];
      actor=safeSpawn(world);lastAim={x:0,y:1};walking=ZERO;firing=false;
      attachCombat(world);
      actor=safeSpawn(combat?.getMovementWorld()||world,actor);
      trial=new EmberTrial(world,actor,combat?.targets||[]);
      if(deathOverlay)deathOverlay.hidden=true;
      if(completeOverlay)completeOverlay.hidden=true;
      emitState();render(lastTime);
      if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);
      return true;
    },
    setPaused:(value:boolean)=>{if(dead||complete)return;paused=value;walking=ZERO;firing=false;clock.reset();lastFrameMs=-Infinity;if(!value&&raf===0&&!document.hidden)raf=requestAnimationFrame(tick);},
    stop:()=>{observer.disconnect();window.removeEventListener('orientationchange',onOrientation);document.removeEventListener('visibilitychange',onVisibility);if(raf)cancelAnimationFrame(raf);}
  };
}
