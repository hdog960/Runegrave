/** v0.09.43 — Five original hand-cut moving hostile attack-ink silhouettes.
 * 90 / 100 / 115 / 145 / 155 world-speed classes are the EXISTING genuine
 * encounter values. A speed class is not an enemy identity: the 100-speed
 * crosswind may be a Wisp bolt OR Warden secondary. Art never predicts origin.
 * No projectile mechanics, speed, damage, lifetime or collision are modified.
 */
export const FLIGHT_RUNE_CLASSES=['sentry-hex','crosswind-spear','root-tusk','ember-cleaver','iron-fletch'];
export const FLIGHT_RUNE_MASKS=Object.freeze({"sentry-hex":["........o........","......ooboo......",".....obcrbo......","....obcccro......","...oobc+cbboo....","....obcccro......",".....obcrbo......","......ooboo......","........o........"],"crosswind-spear":[".............o...","...........ooro..","...o......obcroo.","tttooobbbcccccroo","...o......obcroo.","...........ooro..",".............o...",".................","................."],"root-tusk":["........oo.......","......ooroo......","....oobrrooo.....","..oobbbcrroo.....","ooobbbc+cccrroooo","..oobbbcrroo.....","....oobrrooo.....","......ooroo......","........oo......."],"ember-cleaver":["......oooo.......",".....obccoo......","....obb+crooo....","..oobbbccrrro....","ootbbbcc+cccrrooo","..oobbbccrrro....","....obb+crooo....",".....obccoo......","......oooo......."],"iron-fletch":["o...o............",".o.o....o........","..o..oobbboo.....","tttoobbbcccrrrroo","..o..oobbboo.....",".o.o....o........","o...o............",".................","................."]});
export const FLIGHT_RUNE_PALETTES=Object.freeze({"sentry-hex":{"o":"#101e29","t":"#406d70","b":"#82b0af","c":"#d9e4bd","r":"#b4c9bd","+":"#f9e1ae"},"crosswind-spear":{"o":"#19263c","t":"#455a86","b":"#86acc1","c":"#d8f5e8","r":"#adc1f1","+":"#fff2d4"},"root-tusk":{"o":"#1a251d","t":"#3f6651","b":"#77a080","c":"#d2c5a3","r":"#b5d4a5","+":"#ecdbb5"},"ember-cleaver":{"o":"#2d1b22","t":"#803834","b":"#c96e4c","c":"#ffe0a1","r":"#eea86d","+":"#fff7ca"},"iron-fletch":{"o":"#1d292e","t":"#4b6269","b":"#809ba2","c":"#e8dac2","r":"#c0c8b4","+":"#fff5d3"}});
export const FLIGHT_RUNE_CELL=1;
/** Only the real existing projectile speed and damage select a silhouette.
 * Unknown future speeds stay in a truthful generic flight class.
 */
export function flightRuneClass(b){
 if(![b.x,b.y,b.dx,b.dy,b.speed,b.damage,b.life].every(Number.isFinite)
 ||b.speed<=0||b.damage<=0||b.life<=0||Math.hypot(b.dx,b.dy)<.1)
  throw new RangeError('Invalid actual hostile flight state');
 // Physical damage strength wins over speed: even a 100-speed TEST heavy
 // projectile must not look identical to an ordinary 100-speed shot.
 // Real existing Warden phase-two side projectiles are damage=1.
 if(b.damage>=2)return 'ember-cleaver';
 const speed=b.speed;
 if(Math.abs(speed-90)<.001)return 'sentry-hex';
 if(Math.abs(speed-100)<.001)return 'crosswind-spear';
 if(Math.abs(speed-115)<.001)return 'root-tusk';
 if(Math.abs(speed-155)<.001)return 'iron-fletch';
 return 'crosswind-spear';
}
/** Same original lifetime thresholds as the previous production projectile.
 * The rear-only fletching disappears as the REAL lifetime expires, with
 * no independent wall-clock, misleading extra warning or enlarged hitbox.
 */
export function flightRuneAge(life){
 if(!Number.isFinite(life)||life<=0)throw new RangeError('Invalid projectile lifetime');
 return life>1.9?0:life>.95?1:2;
}
export function flightRuneRows(b){
 const kind=flightRuneClass(b),age=flightRuneAge(b.life);
 const rows=FLIGHT_RUNE_MASKS[kind];
 if(age===0)return rows;
 // Crop exclusively the tail at the NEGATIVE-X rear (bolt always points +X
 // inside its local painter) — the moving nose stays on the real bolt.
 const start=age===1?5:6;
 return rows.map(row=>row.slice(0,start).replace(/[otbcr+]/g,'.')+row.slice(start));
}
/** Pure world-space ink at the REAL projectile coordinates and heading.
 * No hitbox/size changes. An uncluttered dark outline and bright physical
 * moving core make danger readable in all original room palettes.
 */
export function paintSagaFlightRune(g,b){
 const kind=flightRuneClass(b),rows=flightRuneRows(b),pal=FLIGHT_RUNE_PALETTES[kind];
 g.save();
 g.translate(Math.round(b.x),Math.round(b.y));
 g.rotate(Math.atan2(b.dy,b.dx));
 g.globalAlpha=Math.max(.3,Math.min(1,b.life*2));
 const x0=-8,y0=-4;
 for(let row=0;row<9;row++){
  const ink=rows[row];
  // Render each hand-carved pixel individually: subtle narrow fletching must
  // remain physically legible on native iPhone without blur or false area.
  for(let x=0;x<17;x++){
   const ch=ink[x];
   if(ch==='.')continue;
   g.fillStyle=pal[ch];
   g.fillRect(x0+x,y0+row,FLIGHT_RUNE_CELL,FLIGHT_RUNE_CELL);
  }}
 g.restore();
 return true;
}
