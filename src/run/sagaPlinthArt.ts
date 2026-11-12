import type {RelicId} from './firstSoul.js';
import type {Vec2} from '../physics/world.js';
type G=CanvasRenderingContext2D;
export type PlinthId=RelicId|'silver'|'heart';
export type PickupBand='far'|'approach'|'ready';
/** RUNEGRAVE v0.09.38 — TEN original material-specific portable altars.
 * Eight ARE the eight currently functioning First Soul relics. Silver and
 * heart rewards use completely distinct carved cases. These are not new
 * inventory objects, interactables, attack targets or HUD/pointer buttons.
 * Carving-only shapes, centered on existing collectible position.
 */
export const PICKUP_RADIUS=17;
export const PICKUP_APPROACH_RADIUS=31;
export const SAGA_PLINTH_SHEETS:Readonly<Record<PlinthId,readonly string[]>>=Object.freeze({
 'wyrd-fang':[
 '....o.....o....','...ooo...ooo...','..oorao.oaroo..','..oaggogoggao..','..oagggrgggao..',
 '.ooagggggggaoo.','oabbbaaaaabbbo','oabbararaabbo.','.obbbbbbabbbo.','..ooooooooooo..'
 ],
 'skald-drum':[
 '....oaaaaao....','...oaaaaaaao...','..oarrarrarro..','..oaabbabbbao..','..oaaagaaaoo..',
 '..oaabbabbbao..','..oarrarrarro..','..oaaaaaaao...','...obbbbbbo....','....ooooooo....'
 ],
 'storm-feather':[
 '...o.......o...','..oor......oo..','.oorrro...oro..','oorrrrro.oro...','oarrrrrooora...',
 '..oarrrrrooo...','...oarrrooro...','....oarrooo....','..obbbbbbbbo...','...oooooooo....'
 ],
 'hugin-lens':[
 '...ooooooooo...','..oobbbbbbooo..','..obarrrrabo...','.oabrgggrrbao..','oabrgeeegrrbao.','oabrrgegrrrbao',
 '.oabrgggrrbao..','..obarrrrabo...','..oobbbbbbooo..','...ooooooooo...'
 ],
 'ash-anchor':[
 '.......o.......','......oro......','....ooaroo.....','....oaaroo.....','....oaraoo.....','...oaarraooo...',
 'oooaaggggaaaoo','oabbaaaraabbbo','.obbbbbbabbbo.','..ooooooooooo..'
 ],
 'shieldroot':[
 '......ooo......','....ooeeooo....','...oeegeeeoo...','..oeegggeeoo...','..oegggggeoo...','..oeeggeeeoo...',
 '...oeegeeeoo...','....oeeeeeoo...','..oabbggabbbo..','..ooooooooooo..'
 ],
 'eir-thread':[
 '.....ooooo.....','...ooarrroo....','..oarrararoo...','.oaragggaraoo..','oaargeeegarroo.','oaargeeegarroo.',
 '.oaragggaraoo..','..oarrararoo...','...oobbbbboo...','....oooooooo...'
 ],
 'raven-hoard':[
 '..oo.......oo..','.oaroo...oorro.','oarraaoooaarro','oarrggrrggarro','..oagggrggao..',
 '...oaggggao...','..oabbrrbbao..','.oabbbrrbbbao.','..oobbbbbboo..','...oooooooo....'
 ],
 silver:[
 '..ooo.....ooo..','.obbbbo.obbbbo.','obcccbboobcccbo','obccrbbobccrbbo',
 'obbbbbbobbbbbbo','..oobbbbbboo...','...oabbbbao....','..oabbbbbbao...','..obbbbbbo....','...oooooooo....'
 ],
 heart:[
 '...ooo...ooo...','..oaroooorao...','.oarraarraroo..','oarrraarrrrao.','oarrraaarrrao.','..oarrarraoo...',
 '...oarrarro....','....oarroo.....','..oabbabbbo....','...oooooooo....'
 ]
});
export const SAGA_PLINTH_PALETTES:Readonly<Record<PlinthId,Readonly<Record<string,string>>>>=Object.freeze({
 'wyrd-fang':{o:'#17252a',a:'#695746',b:'#3b4749',r:'#e6b38a',g:'#f9dab0',e:'#afc6a3',c:'#cedcdb'},
 'skald-drum':{o:'#232728',a:'#81634e',b:'#514740',r:'#d9b37e',g:'#f6d9a4',e:'#d2b58a',c:'#d5dcd3'},
 'storm-feather':{o:'#172733',a:'#416572',b:'#374f56',r:'#a4d8da',g:'#d4f1ed',e:'#80c4d3',c:'#c5e7e3'},
 'hugin-lens':{o:'#182c34',a:'#3e596b',b:'#334a55',r:'#89b9c7',g:'#dcf1ee',e:'#f5e6b4',c:'#c0dfed'},
 'ash-anchor':{o:'#29262a',a:'#725046',b:'#4e4140',r:'#e5a27e',g:'#ffd5a0',e:'#ddaa84',c:'#e5d0a6'},
 'shieldroot':{o:'#192924',a:'#45644d',b:'#364a38',r:'#81b589',g:'#bcdfab',e:'#c7e5b0',c:'#e7ead4'},
 'eir-thread':{o:'#29243c',a:'#675678',b:'#48394e',r:'#b8a6d4',g:'#f0d4e7',e:'#e2d2ff',c:'#dfd4f3'},
 'raven-hoard':{o:'#292821',a:'#77664c',b:'#49473c',r:'#cbb67c',g:'#f0dda1',e:'#dfe1b8',c:'#f7e5b0'},
 silver:{o:'#20353a',a:'#5e7778',b:'#385255',r:'#d0e2dd',g:'#f6f3db',e:'#b5d9d4',c:'#d5ede3'},
 heart:{o:'#30252b',a:'#81545b',b:'#543941',r:'#e69c9e',g:'#ffccbe',e:'#efb8af',c:'#f4d2c9'}
});
export function plinthInkRows(id:PlinthId):readonly string[]{
 const rows=SAGA_PLINTH_SHEETS[id],palette=SAGA_PLINTH_PALETTES[id];
 if(!rows||!palette)throw new RangeError('Unknown grounded saga plinth');
 if(rows.length!==10)throw new Error('Norse plinth must have ten original authored rows');
 const width=Math.max(...rows.map(row=>row.length));
 if(width>17||width<12)throw new Error('Norse portable altar outside physical 17-cell bounds');
 return rows.map(row=>row.padEnd(width,'.'));
}
export function pickupBand(hero:Vec2|undefined,drop:Vec2):PickupBand{
 if(!hero||!Number.isFinite(hero.x+hero.y+drop.x+drop.y))return 'far';
 const distance=Math.hypot(hero.x-drop.x,hero.y-drop.y);
 return distance<PICKUP_RADIUS?'ready':distance<PICKUP_APPROACH_RADIUS?'approach':'far';
}
export function paintSagaPlinth(g:G,id:PlinthId):void{
 const rows=plinthInkRows(id),colors=SAGA_PLINTH_PALETTES[id];
 g.save();
 // Framed stone slab is intentionally below the genuine crest and plaque.
 // One authored cell is two world pixels. All 10 materials keep a stable,
 // strictly bounded 34×20-footprint (never a control or collision shape).
 const width=Math.max(...rows.map(row=>row.length));
 const x0=-width,y0=-13;
 for(let y=0;y<rows.length;y++){
  const row=rows[y]!;
  for(let x=0;x<row.length;x++){
   const ink=row[x]!;
   if(ink==='.')continue;
   const col=colors[ink];if(!col)throw new Error('Unknown original plinth material '+ink);
   g.fillStyle=col;g.fillRect(x0+x*2,y0+y*2,2,2);
  }
 }
 g.restore();
}
export function paintPickupBoundary(g:G,id:PlinthId,band:PickupBand):void{
 if(band!=='approach'&&band!=='ready')return;
 const col=id==='heart'?'#edada3':id==='silver'?'#c8ded5':'#e4c18b';
 const active=band==='ready',p=PICKUP_RADIUS;
 g.save();g.fillStyle=active?'#fff0c7':col;
 // Four small hand-hewn rune notches at the same 17-unit true nearDrop
 // threshold; NEVER a false radius for silver or health or extra prompt.
 for(const [x,y,side] of [[p,0,0],[-p,0,0],[0,p,1],[0,-p,1]]){
  g.fillRect(x-(side?4:1),y-(side?1:4),side?8:2,side?2:8);
  g.fillRect(x-(side?1:4),y-(side?2:1),side?2:8,side?8:2);
 }
 g.restore();
}
