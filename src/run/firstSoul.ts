/** RUNEGRAVE v0.09: 25 authored, mechanically distinct first-soul encounter
 * configurations. This is a curated connected route, NOT a v0.10 floor-graph generator.
 */
import { rngStream } from '../core/rng.js';
import type { EnemyKind, EncounterPlan } from '../enemies/encounters.js';
import { SOULBOLT_STATS, type CombatProfile } from '../combat/soulbolts.js';
import type { MortalHearts } from '../health/mortalHearts.js';

type HostileKind = Exclude<EnemyKind,'warden'>;
export type FirstRoom = Readonly<{
  id:string; title:string; family:string; rune:string; accent:string;
  waves: readonly (readonly HostileKind[])[]; strength:number;
}>;
const FAMILIES = [
  {title:'ASHEN THRESHOLD', family:'ASH',rune:'ᚨ',accent:'#c79068'},
  {title:'COLD IRON VAULT',family:'IRON',rune:'ᛏ',accent:'#b6b1a0'},
  {title:'WHISPERING ROOTS',family:'ROOT',rune:'ᛉ',accent:'#78b5a2'},
  {title:'WRAITH LANTERN',family:'SPIRIT',rune:'ᚹ',accent:'#9fa6e9'},
  {title:'FATE-KNOT HALL',family:'FATE',rune:'ᛟ',accent:'#d0ba7a'}
] as const;
/** Every configuration has distinct enemy composition, wave count or strength. */
const PLANS: readonly (readonly (readonly HostileKind[])[])[] = [
  [['draugr']], [['wisp']], [['archer']], [['draugr','wisp']], [['draugr','archer']],
  [['charger']], [['sentinel']], [['shade']], [['charger','draugr']], [['sentinel','archer']],
  [['wisp','shade']], [['draugr','sentinel']], [['archer','wisp']], [['charger','shade']], [['archer','shade']],
  [['draugr','wisp','archer']], [['charger','sentinel']], [['wisp','sentinel']], [['shade','sentinel']], [['charger','archer']],
  [['draugr','charger'],['wisp']], [['archer','shade'],['sentinel']], [['wisp','draugr'],['charger']],
  [['sentinel','wisp'],['archer']], [['shade','charger'],['draugr','wisp']]
] as const;
export const FIRST_SOUL_ROOMS: readonly FirstRoom[] = Object.freeze(PLANS.map((waves,index)=>{
  const family=FAMILIES[Math.floor(index/5)]!;
  return Object.freeze({id:`fs-${String(index+1).padStart(2,'0')}`,title:`${family.title} · ${index%5+1}`,family:family.family,rune:family.rune,accent:family.accent,waves,strength:1+Math.floor(index/10)});
}));
export const FIRST_SOUL_CHAMBERS=8;
/** Deterministically choose eight different rooms from the 25 authored configurations.
 * The boss remains a ninth, fixed terminal encounter. Different run seeds expose
 * the remaining curated configurations without claiming v0.10 graph generation.
 */
export function createFirstSoulRoute(seed:string):readonly FirstRoom[]{
  if(!seed||seed.length>160)throw new Error('First-soul route requires a bounded seed');
  const rng=rngStream(seed,'first-soul-chambers');
  const choices=[...FIRST_SOUL_ROOMS];
  for(let i=choices.length-1;i>0;i--){const j=rng.int(i+1);[choices[i],choices[j]]=[choices[j]!,choices[i]!];}
  return Object.freeze(choices.slice(0,FIRST_SOUL_CHAMBERS));
}
export function encounterPlan(room:FirstRoom):EncounterPlan {
  return {id:room.id,waves:room.waves,strength:room.strength};
}

export type RelicId='wyrd-fang'|'skald-drum'|'storm-feather'|'hugin-lens'|'ash-anchor'|'shieldroot'|'eir-thread'|'raven-hoard';
export type RelicDefinition=Readonly<{id:RelicId;name:string;rune:string;description:string;quality:number}>;
export const FIRST_SOUL_RELICS:readonly RelicDefinition[]=Object.freeze([
 {id:'wyrd-fang',name:'Wyrd Fang',rune:'ᚦ',description:'+1 Soulbolt damage',quality:2},
 {id:'skald-drum',name:'Skald Drum',rune:'ᚱ',description:'20% faster Soulbolt cadence',quality:2},
 {id:'storm-feather',name:'Storm Feather',rune:'ᛊ',description:'25% faster Soulbolts',quality:2},
 {id:'hugin-lens',name:'Hugin Lens',rune:'ᛟ',description:'30% longer Soulbolt reach',quality:2},
 {id:'ash-anchor',name:'Ash Anchor',rune:'ᛉ',description:'70% stronger knockback',quality:2},
 {id:'shieldroot',name:'Shieldroot Bark',rune:'ᛒ',description:'+1 Mortal Heart container',quality:3},
 {id:'eir-thread',name:'Eir’s Thread',rune:'ᛖ',description:'Heal half a Heart on room clear',quality:3},
 {id:'raven-hoard',name:'Raven Hoard',rune:'ᚠ',description:'+3 silver on each silver pickup',quality:3}
]);
const MAP=new Map<RelicId,RelicDefinition>(FIRST_SOUL_RELICS.map(r=>[r.id,r]));
export type RuneResource=Readonly<{silver:number;heartsRestored:number;relics:readonly RelicId[]}>;
export class FirstSoulInventory {
  private readonly owned=new Set<RelicId>();
  private silver=0;
  private healed=0;
  get state():RuneResource{return {silver:this.silver,heartsRestored:this.healed,relics:[...this.owned]};}
  has(id:RelicId){return this.owned.has(id);}
  acquire(id:RelicId,health:MortalHearts):boolean{
    if(!MAP.has(id))throw new Error(`Unknown relic: ${id}`);
    if(this.owned.has(id))return false;
    this.owned.add(id);
    if(id==='shieldroot')health.addContainer();
    if(id==='eir-thread')this.healed+=health.heal(1);
    return true;
  }
  collectSilver(base:number):number {
    if(!Number.isSafeInteger(base)||base<1||base>100)throw new RangeError('Invalid silver pickup');
    const gained=base+(this.has('raven-hoard')?3:0);
    this.silver+=gained;return gained;
  }
  roomCleared(health:MortalHearts){if(this.has('eir-thread'))this.healed+=health.heal(1);}
  profile():CombatProfile {return {
    damage:SOULBOLT_STATS.damage+(this.has('wyrd-fang')?1:0),
    cooldown:SOULBOLT_STATS.cooldown*(this.has('skald-drum')?.80:1),
    speed:SOULBOLT_STATS.speed*(this.has('storm-feather')?1.25:1),
    range:SOULBOLT_STATS.range*(this.has('hugin-lens')?1.30:1),
    knockback:SOULBOLT_STATS.knockback*(this.has('ash-anchor')?1.7:1)
  };}
  reset():void{this.owned.clear();this.silver=0;this.healed=0;}
}
