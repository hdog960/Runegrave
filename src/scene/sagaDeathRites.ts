import type {EnemyKind} from '../enemies/encounters.js';
type G=CanvasRenderingContext2D;
export type DeathRiteMark=Readonly<{x:number;y:number;kind:EnemyKind;age:number;life:number}>;
/** v0.09.39 Gate A. Seven ORIGINAL Norse sprite-ash death rites: 3 physical
 * collapse phases each. ONLY fed the prior real living->dead events; never
 * new enemies, warnings, collisions, hits, drops or HUD.
 * Source is original runestone pixel craft, not external borrowed game art.
 */
export const DEATH_RITE_KINDS:readonly EnemyKind[]=Object.freeze(['draugr','wisp','archer','charger','sentinel','shade','warden']);
/** o shadow, a material, c engraved fracture, g captured fading soul. */
export const DEATH_RITE_BODIES:Readonly<Record<EnemyKind,readonly string[]>>=Object.freeze({
 draugr:['....oo.oo....','...oaaaoo....','..oacaaacao..','.oaaaooaaao..','oaaacggcaaao.','oaacaacacaao.','..oaagaaao...','...oaaaoo....','..oacooacao..','.oao....oao..','oo.........oo'],
 wisp:['.....ggg.....','...ggacgg....','..gcaacagg...','.gcaaooacg...','gcaaoooaacg..','gcaaogoaacg..','.gcaaooacg...','..gcaacagg...','...ggacgg....','....gag......','.....g.......'],
 archer:['o...........o','.o.........o.','..o.......o..','...o.....o...','..aac...caa..','.oacc...ccao.','oaac....caao.','oacc....ccao.','.oacc...ccao.','..aac...caa..','...oo...oo...'],
 charger:['oo.........oo','oao.......oao','oaca.....acao','.oacoo.ooacao','..oaagagaao..','...oacacao...','..oacggcao...','..oaaooaaao..','.oaao....oaao','oao.......oao','oo.........oo'],
 sentinel:['.....ooo.....','...ooacao....','..oaccgaccao.','.oaccaaaccao.','oacagooogacao','oacaoggoacao.','oacagooogacao','.oaccaaaccao.','..oaccgaccao.','...ooacao....','.....ooo.....'],
 shade:['o...o...o...o','.o..oo.oo..o.','..oaggggao...','...oaccaao...','..oaaoooaao..','..oacggcaao..','...oaccaao...','..oaaggggao...','.o..oo.oo..o.','o...o...o...o','....o...o....'],
 warden:['oo...o.....o...oo','oao..oo...oo..oao','.oaooaoooaooaoo.','..oaacaaacaaoa..','.oaaaacgcaaaao.','oaaacgggggcaaaoo','oaaacgggggcaaaoo','oaaacgocgcaaaoo.','.oaaccgggccaaao.','..oaaacccaaao...','..oaacooocaao...','.oaaooo...oooao..','ooaoo.......ooaoo','oao...........oao','oo.............oo']
});
/** Final ash shapes are independently authored rather than a repeated ring. */
export const DEATH_RITE_ASH:Readonly<Record<EnemyKind,readonly string[]>>=Object.freeze({
 draugr:['o...o...o','.a..g..a.','..c.g.c..','...gga...','..c.g.c..','.a.....a.','o.......o'],
 wisp:['...ggg...','..gacag..','.ga...ag.','gca.g.acg','.ga...ag.','..gacag..','...g.g...'],
 archer:['o.......o','.o.....o.','..a...a..','...g.g...','..c...c..','.o.....o.','o.......o'],
 charger:['oo.....oo','oao...oao','..a...a..','...gcg...','..a...a..','oao...oao','oo.....oo'],
 sentinel:['...ooo...','..oacago.','.o.cgc.o.','oacgggcao','.o.cgc.o.','..oacago.','...ooo...'],
 shade:['o..g.g..o','.a.g.g.a.','..c.g.c..','...cgc...','..c.g.c..','.a.g.g.a.','o..g.g..o'],
 warden:['oo..g..oo','oac.g.cao','.oacgcao.','..ggcgg..','..gacag..','.oacgcao.','oo..g..oo']
});
export const DEATH_RITE_PALETTES:Readonly<Record<EnemyKind,Readonly<Record<string,string>>>>=Object.freeze({
 draugr:{o:'#22262a',a:'#75665a',c:'#b8a78e',g:'#e4dcc6'},
 wisp:{o:'#243942',a:'#5b8fa0',c:'#94d6d8',g:'#dbf5ed'},
 archer:{o:'#342c29',a:'#77594d',c:'#c9a17a',g:'#f1d4a5'},
 charger:{o:'#352b29',a:'#926753',c:'#ce9569',g:'#f5cd99'},
 sentinel:{o:'#242c2f',a:'#5c7372',c:'#a8b4a2',g:'#e2dec3'},
 shade:{o:'#2c2942',a:'#685985',c:'#ac9ac6',g:'#dfd5f2'},
 warden:{o:'#252c28',a:'#615740',c:'#b5a16c',g:'#f5d5a0'}
});
export function deathRiteFrame(age:number,life:number):0|1|2{
 if(!Number.isFinite(age+life)||age<0||life<=0)throw new RangeError('Real death art needs valid fixed-step lifetime');
 const progress=age/life;
 return progress<.3?0:progress<.68?1:2;
}
export function deathRiteGlyph(kind:EnemyKind,frame:0|1|2):readonly string[]{
 if(!DEATH_RITE_KINDS.includes(kind)||![0,1,2].includes(frame))throw new RangeError('Unknown authentic death ritual');
 return frame===2?DEATH_RITE_ASH[kind]:DEATH_RITE_BODIES[kind];
}
/** Bounded run-length pixel renderer. Explicit clipping excludes thumb grips.
 * Phase two physically cracks the existing rune halves; last phase retains
 * individually authored species-specific ash. Never an active hazard.
 */
export function paintDeathRite(g:G,mark:DeathRiteMark,W:number,H:number):boolean{
 if(!mark||!DEATH_RITE_KINDS.includes(mark.kind)||![mark.x,mark.y,mark.age,mark.life,W,H].every(Number.isFinite)||W<180||H<120)throw new RangeError('Invalid authentic enemy death frame');
 if(mark.age>=mark.life)return false;
 const stage=deathRiteFrame(mark.age,mark.life);
 const glyph=deathRiteGlyph(mark.kind,stage),color=DEATH_RITE_PALETTES[mark.kind];
 const width=Math.max(...glyph.map(row=>row.length)),height=glyph.length;
 if(width>19||height>16||height<7)throw new RangeError('Norse crest exceeded one enemy-sized physical footprint');
 const unit=3; // Three world pixels per engraved glyph cell: legible on iPhone at landscape scale.
 const x0=mark.x-width*unit/2,y0=mark.y-height*unit/2-2+(stage===2?3:0);
 g.save();g.beginPath();g.rect(0,0,W,H);g.clip();
 g.globalAlpha=Math.max(.07,Math.min(.82,(mark.life-mark.age)/.28));
 for(let y=0;y<glyph.length;y++){
  const row=glyph[y]!;
  for(let x=0;x<row.length;){
   const ink=row[x]!;if(ink==='.'||ink===' '){x++;continue;}
   let end=x+1;while(end<row.length&&row[end]===ink)end++;
   const split=stage===1?(x<width/2?-4:4):0;
   const shade=color[ink];if(!shade)throw new RangeError('Unknown runestone pixel');
   g.fillStyle=shade;g.fillRect(Math.round(x0+x*unit+split),Math.round(y0+y*unit),(end-x)*unit,unit);
   x=end;
  }
 }
 g.restore();return true;
}
