/** v0.07 — Mortal Hearts, tracked as half-heart units (2 units per container).
 * No browser clock or DOM access: only the fixed-step simulation advances grace time.
 * Future special heart types must implement damage ordering separately, never by
 * silently treating Mortal Hearts as Spirit/Cursed/etc.
 */
export const HALF_HEARTS_PER_CONTAINER = 2;
export const STARTING_MORTAL_CONTAINERS = 3;
export const DAMAGE_GRACE_SECONDS = 1.0;
const HEALTH_EPS = 1e-9;
export type HurtResult = 'ignored' | 'blocked' | 'hurt' | 'dead';
export type HeartState = Readonly<{
  units:number;maxUnits:number;containers:number;grace:number;dead:boolean;
  hits:number;blocked:number;healed:number;source:string|null;
}>;
export function validateHalfHearts(value:number):void {
  if (!Number.isSafeInteger(value)||value<1||value>100) throw new RangeError('Health changes must be 1–100 positive half-hearts');
}
export class MortalHearts {
  maxUnits:number;
  private readonly initialMaxUnits:number;
  private units:number;
  private grace=0;
  private dead=false;
  private hits=0;
  private blocked=0;
  private healed=0;
  private source:string|null=null;
  constructor(containers=STARTING_MORTAL_CONTAINERS){
    if(!Number.isSafeInteger(containers)||containers<1||containers>12)throw new RangeError('Invalid mortal-heart capacity');
    this.maxUnits=containers*HALF_HEARTS_PER_CONTAINER;
    this.initialMaxUnits=this.maxUnits;
    this.units=this.maxUnits;
  }
  get state():HeartState {return {
    units:this.units,maxUnits:this.maxUnits,containers:this.maxUnits/2,
    grace:this.grace,dead:this.dead,hits:this.hits,blocked:this.blocked,healed:this.healed,source:this.source
  };}
  step(dt:number):void {
    if(!Number.isFinite(dt)||dt<=0||dt>1/30)throw new RangeError('Health requires a bounded fixed tick');
    if(!this.dead)this.grace=Math.max(0,this.grace-dt);
    if(this.grace<HEALTH_EPS)this.grace=0;
  }
  hurt(halfHearts:number,source:string):HurtResult {
    validateHalfHearts(halfHearts);
    if(!source||source.length>64)throw new Error('Damage needs a specific source');
    if(this.dead)return 'ignored';
    if(this.grace>0){this.blocked++;return 'blocked';}
    this.units=Math.max(0,this.units-halfHearts);
    this.hits++;this.source=source;
    if(this.units===0){this.dead=true;this.grace=0;return 'dead';}
    this.grace=DAMAGE_GRACE_SECONDS;
    return 'hurt';
  }
  heal(halfHearts:number):number {
    validateHalfHearts(halfHearts);
    if(this.dead)return 0; // a normal healing pickup is never a revival
    const before=this.units;
    this.units=Math.min(this.maxUnits,this.units+halfHearts);
    this.healed+=this.units-before;
    return this.units-before;
  }
  /** Genuinely increases both maximum and current health; capped to twelve Mortal containers. */
  addContainer():boolean {
    if(this.dead||this.maxUnits>=24)return false;
    this.maxUnits+=2;this.units=Math.min(this.maxUnits,this.units+2);return true;
  }
  reset():void {
    this.maxUnits=this.initialMaxUnits;
    this.units=this.maxUnits;this.grace=0;this.dead=false;
    this.hits=0;this.blocked=0;this.healed=0;this.source=null;
  }
}
/** Full, half-full and empty container states; there are no fake extra hearts. */
export function heartSlots(units:number,maxUnits:number):readonly ('full'|'half'|'empty')[] {
  if(!Number.isSafeInteger(units)||!Number.isSafeInteger(maxUnits)||maxUnits<2||maxUnits%2!==0||units<0||units>maxUnits)
    throw new RangeError('Invalid mortal heart display state');
  return Array.from({length:maxUnits/2},(_,i)=>units>=2*i+2?'full':units===2*i+1?'half':'empty');
}
