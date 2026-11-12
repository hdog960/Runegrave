/** RUNEGRAVE v0.09.46 — authentic fixed-step combat impact art.
 * Three original separately chiseled 15x15 Norse event shapes:
 * impact=soulbite star, break=shattered shield, wall=fractured stone.
 * Three chipped life cels per kind come only from EXISTING spark lifetime.
 * Never a new hitbox, damage event, projectile, HUD or independent timer.
 */
export const SAGA_IMPACT_KINDS=['impact','break','wall'] as const;
export type SagaImpactKind=typeof SAGA_IMPACT_KINDS[number];
export const SAGA_IMPACT_BASE:Readonly<Record<SagaImpactKind,readonly string[]>>=Object.freeze({"impact":[".......x.......","......xlx......",".....obxbo.....","....obllbbo....","...oobllbboo...","..oooblbbboo...","....blllb......","xxxblllllbbxxx.","....blllb......","..oooblbbboo...","...oobllbboo...","....obllbbo....",".....obxbo.....","......xlx......",".......x......."],"break":["..o.........o..","..bo.......ob..","...b..o..ob....","....b.ob.o.....","..o..obbboo.o..","...obllllbbo...","..obllxxllbbo..","...blxoxxlbb...","..obllxxllbbo..","...obllllbbo...","..o..obbboo.o..","....b.ob.o.....","...b..o..ob....","..bo.......ob..","..o.........o.."],"wall":["oobbooo..ooobbo","blboobo.obooblb","oobboo...oobboo","...oobl.lboo...","....oblllbbo...","...oobblbboo...","ooobllobllboooo","bbblxloollxlbbb","ooobllobllboooo","...oobblbboo...","....oblllbbo...","...oobl.lboo...","oobboo...oobboo","blboobo.obooblb","oobbooo..ooobbo"]});
export const SAGA_IMPACT_PALETTE:Readonly<Record<SagaImpactKind,Readonly<Record<'o'|'b'|'l'|'x',string>>>>=Object.freeze({"impact":{"o":"#183b43","b":"#588e88","l":"#acebd5","x":"#f8f6cd"},"break":{"o":"#2b2d2f","b":"#aa7751","l":"#f4c681","x":"#fff3d1"},"wall":{"o":"#263436","b":"#708486","l":"#bbc4b3","x":"#e4d2ac"}});
export const SAGA_IMPACT_SIZE=15 as const;
export type RealImpactSpark=Readonly<{x:number;y:number;life:number;maxLife:number;kind:SagaImpactKind}>;
/** Pure original chisel-fading: dark outlines vanish, then stone/metal
 * recedes leaving only physically-authored luminous cuts. No new particle. */
export const SAGA_IMPACT_CELS:Readonly<Record<SagaImpactKind,readonly (readonly string[])[]>>=Object.freeze(Object.fromEntries(
 SAGA_IMPACT_KINDS.map(kind=>{
 const base=SAGA_IMPACT_BASE[kind];
 return [kind,Object.freeze([
  base,
  Object.freeze(base.map(row=>row.replace(/o/g,'.'))),
  Object.freeze(base.map(row=>row.replace(/[ob]/g,'.')))
 ])];
 })) as Record<SagaImpactKind,readonly (readonly string[])[]>);
export function sagaImpactFrame(s:RealImpactSpark):0|1|2{
 if(!SAGA_IMPACT_KINDS.includes(s.kind)||![s.x,s.y,s.life,s.maxLife].every(Number.isFinite)||s.maxLife<=0||s.life<=0||s.life>s.maxLife+1e-6)
  throw new RangeError('Invalid true combat-spark state');
 const remaining=s.life/s.maxLife;
 return remaining>2/3?0:remaining>1/3?1:2;
}
export function sagaImpactPixels(s:RealImpactSpark):readonly string[]{
 return SAGA_IMPACT_CELS[s.kind][sagaImpactFrame(s)]!;
}
type G=CanvasRenderingContext2D;
/** Render ON real fixed-step collision x/y within a maximum 15×15 region;
 * row-run painting limits smartphone draw calls even at original 24 sparks.
 */
export function paintSagaCombatImpact(g:G,s:RealImpactSpark):void{
 const cel=sagaImpactPixels(s),pal=SAGA_IMPACT_PALETTE[s.kind];
 const x0=Math.round(s.x)-7,y0=Math.round(s.y)-7;
 g.save();
 g.globalAlpha=Math.max(.22,Math.min(1,s.life/s.maxLife));
 for(let y=0;y<15;y++){
  const row=cel[y]!;
  for(let x=0;x<15;){
   const ch=row[x]!;
   if(ch==='.') {x++;continue;}
   let end=x+1;while(end<15&&row[end]===ch)end++;
   g.fillStyle=pal[ch as keyof typeof pal];
   g.fillRect(x0+x,y0+y,end-x,1);
   x=end;
  }
 }
 g.restore();
}
