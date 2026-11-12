import type {Enemy,EnemyKind} from './encounters.js';
import {warningBeat} from './warningClarity.js';

/** Seven individually authored 9x9 original Norse warning crests, never
 * predictions of an attack lane or false new powers. An actual warning state
 * is the ONLY trigger. The two flanking engravings replace a generic ring.
 */
export const SAGA_CAST_WARDS:Readonly<Record<EnemyKind,readonly string[]>>=Object.freeze({
 draugr: '#.#...#.#/.##...##./..#.#.#../###.#.###/#...+...#/.##.#.##./..#.#.#../.#.....#./##.....##'.split('/'),
 wisp: '....#..../...#+#.../..#+++#../.#+++++#./#++...++#/.#++.++#./..#+++#../...#+#.../....#....'.split('/'),
 archer: '#.......#/.#.....#./..#...#../...#.#.../####+####/...#.#.../..#...#../.#.....#./#.......#'.split('/'),
 charger:'##.....##/##.....##/.#.#...#./..#.#.#../...#+#.../...###.../..#...#../.##...##./##.....##'.split('/'),
 sentinel:'..#####../.##...##./##.#.#.##/#...+...#/#.#+++#.#/#...+...#/##.#.#.##/.##...##./..#####..'.split('/'),
 shade: '#.#...#.#/.#.#.#.#./..#...#../...#+#.../....+..../...#+#.../..#...#../.#.#.#.#./#.#...#.#'.split('/'),
 warden: '##.....##/##.#.#.##/.###.###./..#+#+#../###+++###/.##+#+##./..##+##../.#.#.#.#./##.....##'.split('/')
});
export const SAGA_CAST_MATERIALS:Readonly<Record<EnemyKind,{frame:string;shadow:string;ink:string;heart:string}>>=Object.freeze({
 draugr:{frame:'#8d8675',shadow:'#253237',ink:'#c6b79a',heart:'#fff0cd'},
 wisp:{frame:'#568e9c',shadow:'#18373f',ink:'#8edfea',heart:'#d9fbff'},
 archer:{frame:'#b68d60',shadow:'#403227',ink:'#f2cb91',heart:'#fff1c6'},
 charger:{frame:'#bc6e57',shadow:'#432924',ink:'#ffaa87',heart:'#ffe1b0'},
 sentinel:{frame:'#ab8e5b',shadow:'#34362d',ink:'#e3bd70',heart:'#fff1b0'},
 shade:{frame:'#8067aa',shadow:'#2c263f',ink:'#cbb4f0',heart:'#faf0ff'},
 warden:{frame:'#9c814d',shadow:'#253a32',ink:'#e4c575',heart:'#ffecad'}
});
export type CastWardEnemy=Pick<Enemy,'kind'|'state'|'alive'|'x'|'y'|'radius'|'windup'>;
export type CastWardTile=Readonly<{x:number;y:number;mirror:boolean}>;
export const CAST_WARD_TILE_WIDTH=26,CAST_WARD_TILE_HEIGHT=27;
/** Never move a threatened enemy's rune into a controller grip or cover its
 * silhouette by clamping a missing edge-side tile onto its body. Omit that
 * side entirely instead; keep the readable existing warning label.
 */
export function castWardGeometry(e:CastWardEnemy,worldWidth:number,worldHeight:number):
 null|Readonly<{urgency:0|1|2|3;tiles:readonly CastWardTile[]}> {
 if(e.state!=='warning'||!e.alive)return null;
 if(!Number.isFinite(worldWidth)||!Number.isFinite(worldHeight)||worldWidth<100||worldHeight<100
 ||![e.x,e.y,e.radius,e.windup].every(Number.isFinite)||e.radius<=0||e.windup<0)
  throw new RangeError('Rune cast ward must represent an actual finite center-world warning');
 const urgency=warningBeat(e.windup);
 const y=Math.max(2,Math.min(worldHeight-CAST_WARD_TILE_HEIGHT-2,Math.round(e.y-CAST_WARD_TILE_HEIGHT/2)));
 const left=Math.round(e.x-e.radius-CAST_WARD_TILE_WIDTH-7),right=Math.round(e.x+e.radius+7);
 const tiles:CastWardTile[]=[];
 if(left>=2&&left+CAST_WARD_TILE_WIDTH<=worldWidth-2)tiles.push({x:left,y,mirror:false});
 if(right>=2&&right+CAST_WARD_TILE_WIDTH<=worldWidth-2)tiles.push({x:right,y,mirror:true});
 return {urgency,tiles};
}
const rect=(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,c:string)=>{
 g.fillStyle=c;g.fillRect(x,y,w,h);
};
/** Static low-cost pixel rectangles; three honest fixed countdown notches.
 * Shape is readable independently of colour, motion, or attack direction.
 */
export function paintSagaCastWards(g:CanvasRenderingContext2D,e:CastWardEnemy,
 worldWidth:number,worldHeight:number):boolean{
 const geometry=castWardGeometry(e,worldWidth,worldHeight);
 if(!geometry)return false;
 const mask=SAGA_CAST_WARDS[e.kind],mat=SAGA_CAST_MATERIALS[e.kind];
 for(const tile of geometry.tiles){
  rect(g,tile.x,tile.y,CAST_WARD_TILE_WIDTH,CAST_WARD_TILE_HEIGHT,'#101e20');
  rect(g,tile.x+1,tile.y+1,CAST_WARD_TILE_WIDTH-2,CAST_WARD_TILE_HEIGHT-2,mat.frame);
  rect(g,tile.x+2,tile.y+2,CAST_WARD_TILE_WIDTH-4,CAST_WARD_TILE_HEIGHT-4,mat.shadow);
  for(let row=0;row<9;row++)for(let col=0;col<9;col++){
   const ch=mask[row]![col]!;
   if(ch!=='.'){
    const x=tile.x+4+(tile.mirror?8-col:col)*2,y=tile.y+3+row*2;
    rect(g,x,y,2,2,ch==='+'?mat.heart:mat.ink);
   }
  }
  for(let n=0;n<3;n++)
   rect(g,tile.x+4+n*7,tile.y+23,5,2,n<geometry.urgency?mat.heart:'#33454a');
 }
 return geometry.tiles.length>0;
}
