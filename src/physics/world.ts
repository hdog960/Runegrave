/** RUNEGRAVE v0.05 — deterministic Rootvault collision world, matching the v0.04 scene.
 * World geometry is data, independent of DOM, renderer, browser time and random seeds.
 * Player collision is a circle at the hero's feet; scenery may use AABBs, circles or root capsules.
 */
export type Vec2 = Readonly<{x:number;y:number}>;
export type Solid =
  | Readonly<{id:string;kind:'box';x:number;y:number;width:number;height:number}>
  | Readonly<{id:string;kind:'circle';x:number;y:number;radius:number}>
  | Readonly<{id:string;kind:'capsule';ax:number;ay:number;bx:number;by:number;radius:number}>;
export type CollisionWorld = Readonly<{width:number;height:number;minX:number;maxX:number;minY:number;maxY:number;solids:readonly Solid[]}>;
export const HERO_RADIUS=10;
export const WALK_SPEED=104;
const EPS=1e-8;
const cl=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

/** Room bounds omit the upper stone wall and lower threshold; the avatar cannot hide in them. */
export function makeRootvaultWorld(width:number,height:number):CollisionWorld {
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<240||height<148)
    throw new RangeError('Rootvault viewport too small for a fair traversable stage');
  const solids:Solid[]=[];
  for(const [side,x] of [['left',35],['right',width-35]] as const){
    solids.push({id:`column-upper-${side}`,kind:'box',x:x-12,y:height*.38-8,width:24,height:20});
    solids.push({id:`column-lower-${side}`,kind:'box',x:(side==='left'?48:width-48)-14,y:height*.91-4,width:28,height:15});
    solids.push({id:`tomb-${side}`,kind:'box',x:(side==='left'?75:width-75)-16,y:height*.70-18,width:32,height:44});
  }
  const roots:[string,number,number,number,number,number][]=[
    ['root-west-upper',0,.63,56,.37,4],['root-east-upper',width,.64,width-58,.39,4],
    ['root-west-lower',0,.89,77,.80,5],['root-east-lower',width,.90,width-76,.79,5],
  ];
  for(const [id,ax,ay,bx,by,radius] of roots)
    solids.push({id,kind:'capsule',ax,ay:ay*height,bx,by:by*height,radius});
  // Art depicts an impassable top wall and bottom lip; the center ornamental knot is passable floor.
  return Object.freeze({width,height,minX:16,maxX:width-16,minY:76,maxY:height-22,solids:Object.freeze(solids)});
}

function closestPoint(p:Vec2,solid:Solid):{point:Vec2;effectiveRadius:number;insideBox:boolean} {
  if(solid.kind==='circle') return {point:{x:solid.x,y:solid.y},effectiveRadius:solid.radius,insideBox:false};
  if(solid.kind==='capsule'){
    const dx=solid.bx-solid.ax,dy=solid.by-solid.ay,length2=dx*dx+dy*dy;
    const t=length2<EPS?0:cl(((p.x-solid.ax)*dx+(p.y-solid.ay)*dy)/length2,0,1);
    return {point:{x:solid.ax+t*dx,y:solid.ay+t*dy},effectiveRadius:solid.radius,insideBox:false};
  }
  const cx=cl(p.x,solid.x,solid.x+solid.width),cy=cl(p.y,solid.y,solid.y+solid.height);
  return {point:{x:cx,y:cy},effectiveRadius:0,insideBox:p.x>=solid.x&&p.x<=solid.x+solid.width&&p.y>=solid.y&&p.y<=solid.y+solid.height};
}
export function overlapsSolid(p:Vec2,radius:number,solid:Solid):boolean {
  const {point,effectiveRadius,insideBox}=closestPoint(p,solid);
  return insideBox||(p.x-point.x)**2+(p.y-point.y)**2 < (radius+effectiveRadius-EPS)**2;
}
export function isPositionFree(world:CollisionWorld,p:Vec2,radius=HERO_RADIUS):boolean {
  if(!Number.isFinite(p.x+p.y+radius)||radius<=0)return false;
  if(p.x-radius<world.minX||p.x+radius>world.maxX||p.y-radius<world.minY||p.y+radius>world.maxY)return false;
  return !world.solids.some(s=>overlapsSolid(p,radius,s));
}
/** Resolves circle and polygon-independent roots without allowing a player to tunnel through scenery. */
function separate(p:Vec2,solid:Solid,radius:number):Vec2 {
  const c=closestPoint(p,solid);
  const dx=p.x-c.point.x,dy=p.y-c.point.y,dist=Math.hypot(dx,dy),needed=radius+c.effectiveRadius;
  if(!c.insideBox&&dist>=needed-EPS)return p;
  if(c.insideBox&&solid.kind==='box'){
    const candidates=[
      {cost:p.x-solid.x+radius,pos:{x:solid.x-radius,y:p.y}},
      {cost:solid.x+solid.width-p.x+radius,pos:{x:solid.x+solid.width+radius,y:p.y}},
      {cost:p.y-solid.y+radius,pos:{x:p.x,y:solid.y-radius}},
      {cost:solid.y+solid.height-p.y+radius,pos:{x:p.x,y:solid.y+solid.height+radius}}
    ];
    candidates.sort((a,b)=>a.cost-b.cost);
    return candidates[0]!.pos;
  }
  // Stable axis fallback if capsule center is exactly under the avatar.
  const nx=dist<EPS?1:dx/dist,ny=dist<EPS?0:dy/dist;
  return {x:c.point.x+nx*needed,y:c.point.y+ny*needed};
}
export function resolvePosition(world:CollisionWorld,p:Vec2,radius=HERO_RADIUS):Vec2 {
  let next={x:cl(p.x,world.minX+radius,world.maxX-radius),y:cl(p.y,world.minY+radius,world.maxY-radius)};
  // Repeat because pushing away from one prop could intersect an adjacent prop.
  for(let j=0;j<8;j++){
    let changed=false;
    for(const solid of world.solids){const proposed=separate(next,solid,radius);
      if(proposed.x!==next.x||proposed.y!==next.y){next={x:cl(proposed.x,world.minX+radius,world.maxX-radius),y:cl(proposed.y,world.minY+radius,world.maxY-radius)};changed=true;}
    }
    if(!changed)break;
  }
  return next;
}
/** Slider along obstacles, with fine deterministic substeps as an extra swept-motion safety net. */
export function moveCircle(world:CollisionWorld,position:Vec2,velocity:Vec2,dt:number,radius=HERO_RADIUS):Vec2 {
  if(!Number.isFinite(dt)||dt<0||dt>0.25||!Number.isFinite(velocity.x+velocity.y))throw new RangeError('Invalid physics step');
  let p=isPositionFree(world,position,radius)?{...position}:safeSpawn(world,position,radius);
  const travel=Math.hypot(velocity.x,velocity.y)*dt;
  const steps=Math.max(1,Math.ceil(travel/Math.max(2,radius*.4)));
  for(let i=0;i<steps;i++){
    const dx=velocity.x*dt/steps,dy=velocity.y*dt/steps;
    // Axis sliding, then geometry correction. Never pass through an obscuring pillar.
    const xCandidate=resolvePosition(world,{x:p.x+dx,y:p.y},radius);
    if(isPositionFree(world,xCandidate,radius))p=xCandidate;
    const yCandidate=resolvePosition(world,{x:p.x,y:p.y+dy},radius);
    if(isPositionFree(world,yCandidate,radius))p=yCandidate;
  }
  return p;
}
/** Guaranteed collision-free spawn, or explicit error rather than spawning in a tomb. */
export function safeSpawn(world:CollisionWorld,preferred:Vec2={x:world.width*.5,y:world.height*.55},radius=HERO_RADIUS):Vec2 {
  if(isPositionFree(world,preferred,radius))return {...preferred};
  for(let ring=1;ring<=40;ring++){
    const dist=ring*6;
    for(let a=0;a<24;a++){
      const theta=a*Math.PI/12;
      const probe={x:preferred.x+Math.cos(theta)*dist,y:preferred.y+Math.sin(theta)*dist};
      if(isPositionFree(world,probe,radius))return probe;
    }
  }
  throw new Error('No safe Rootvault spawn exists at this viewport');
}
