import type {HostileBolt} from './encounters.js';
type G=CanvasRenderingContext2D;
/** v0.09.30: six ORIGINAL pixel-authored enemy projectiles in two authentic
 * families. Life stages come ONLY from real hostile bolt remaining lifetime,
 * never an independent decorative clock. World physics / collision unchanged.
 */
export const HOSTILE_BOLT_PIXEL_SHEETS=Object.freeze({"spectral-dart":[[".........o.........",".......ooroo.......",".....oorrroo.......","...oootrcrrroo.....",".ootttbcccrrroooo..","...oootrcrrroo.....",".....oorrroo.......",".......ooroo.......",".........o........."],["...........o.......","........ooroo......",".....oootrroo......","..ooottrccrrooo....","oottbbbcccrrrooooo.","..ooottrccrrooo....",".....oootrroo......","........ooroo......","...........o......."],["..........o........","........oroo.......","......oorrroo......","...oootrccrrooo....",".ootttbcccrrrroooo.","...oootrccrrooo....","......oorrroo......","........oroo.......","..........o........"]],"warden-ember":[["..........o...........","........ooroo.........","......oorrrroo........","....oottbrbbroo.......","..oottbbcccbbrroo.....","ootttbbbcccbbrrrroooo.","..oottbbcccbbrroo.....","....oottbrbbroo.......","......oorrrroo........","........ooroo.........","..........o..........."],["...........o..........",".........ooroo........",".......oorrroo........","....oottbrbbrooo......","..oottbbcccbbrrooo....","ootttbbbcccrrrrrooooo.","..oottbbcccbbrrooo....","....oottbrbbrooo......",".......oorrroo........",".........ooroo........","...........o.........."],[".........ooo..........",".......oorrroo........",".....oorrrbrroo.......","...oottrbbbrrroo......",".ootttbbcccbrrrooo....","ootttbbbcccbbrrrroooo.","..oottbbcccbrrrooo....","....ootrbbbrrroo......","......oorrrbrroo......","........oorrroo.......",".........ooo.........."]]});
export const HOSTILE_BOLT_INK=Object.freeze({"spectral-dart":{"o":"#17213a","t":"#624c8a","b":"#9e78c7","c":"#f3c3ff","r":"#d9a4f1"},"warden-ember":{"o":"#361923","t":"#78383b","b":"#c5654c","c":"#fff0b0","r":"#ffb77b"}});
export function hostileProjectileFrame(life:number):0|1|2{
 if(!Number.isFinite(life)||life<=0)throw new RangeError('Invalid hostile projectile lifetime');
 return life>1.9?0:life>.95?1:2;
}
export function hostileProjectileStyle(b:Pick<HostileBolt,'damage'|'dx'|'dy'>){
 if(![b.damage,b.dx,b.dy].every(Number.isFinite)||b.damage<=0)throw new RangeError('Invalid hostile bolt');
 return b.damage>=2 ? {kind:'warden-ember',color:'#ffac76',core:'#ffefb0',tail:'#b65247',size:5.2}
                    : {kind:'spectral-dart',color:'#9ee2e0',core:'#f0f5db',tail:'#4f8d94',size:3.5};
}
function inkHostileBolt(g:G,rows:readonly string[],palette:Record<string,string>):void{
 const width=rows[0]?.length??0;
 if(width<8)throw new Error('Missing original hostile pixel sheet');
 const left=-Math.floor(width/2),top=-Math.floor(rows.length/2);
 for(let y=0;y<rows.length;y++){
  const row=rows[y]!;
  for(let x=0;x<width;){
   const ink=row[x]!;
   if(ink==='.') {x++;continue;}
   let end=x+1;while(end<width&&row[end]===ink)end++;
   g.fillStyle=palette[ink]!;
   g.fillRect(left+x,top+y,end-x,1);
   x=end;
  }
 }
}
export function paintHostileProjectiles(g:G,bolts:readonly HostileBolt[],time:number):void{
 if(!Number.isFinite(time))throw new RangeError('Invalid projectile frame');
 for(const b of bolts){
  const s=hostileProjectileStyle(b);
  if(![b.x,b.y,b.life].every(Number.isFinite)||b.life<=0)continue;
  const frame=hostileProjectileFrame(b.life);
  g.save();g.translate(Math.round(b.x),Math.round(b.y));
  g.rotate(Math.atan2(b.dy,b.dx));
  g.globalAlpha=Math.max(.3,Math.min(1,b.life*2));
  inkHostileBolt(g,HOSTILE_BOLT_PIXEL_SHEETS[s.kind][frame]!,HOSTILE_BOLT_INK[s.kind]);
  g.restore();
 }
}
