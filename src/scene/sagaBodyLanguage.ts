import type {EnemyKind} from '../enemies/encounters.js';
/** Gate A v0.09.27: 21 *in-place* battle-body contour passes.
 * Seven existing species, three consecutive attack postures each. A posture
 * changes the edges of THREE existing body rows, rather than adding a separate
 * floating attack sprite. One atlas body is still drawn once by the caller.
 * The authoritative warning countdown/charge comes from enemyAtlasBand; this
 * file never invents an attack or owns a timer. */
export const HOSTILE_BODY_GESTURES=Object.freeze({
 "draugr": {
  "at": 7,
  "frames": [
   [
    "..oa|ao..",
    ".oab|bao.",
    "oabg|gbao"
   ],
   [
    ".oag|gao.",
    "oaab|baao",
    "ogge|eggo"
   ],
   [
    "oaae|eaao",
    "ogge|eggo",
    "oabb|bbao"
   ]
  ]
 },
 "wisp": {
  "at": 5,
  "frames": [
   [
    "..oc|co..",
    ".oac|cao.",
    "..oe|eo.."
   ],
   [
    ".oec|ceo.",
    "oeeo|oeeo",
    "oecc|cceo"
   ],
   [
    "oeee|eeeo",
    "occe|ecco",
    "eeoo|ooee"
   ]
  ]
 },
 "archer": {
  "at": 8,
  "frames": [
   [
    "..oa|ao..",
    ".oag|gao.",
    "oabo|obao"
   ],
   [
    ".oag|gao.",
    "oago|ogao",
    "oebb|bbeo"
   ],
   [
    "ogge|eggo",
    "oagb|bgao",
    "oeeo|oeeo"
   ]
  ]
 },
 "charger": {
  "at": 6,
  "frames": [
   [
    "..oc|co..",
    ".occ|cco.",
    "oabc|cbao"
   ],
   [
    ".occ|cco.",
    "occe|ecco",
    "oabb|bbao"
   ],
   [
    "ocee|eeco",
    "occb|bcco",
    "oooo|oooo"
   ]
  ]
 },
 "sentinel": {
  "at": 6,
  "frames": [
   [
    "..og|go..",
    ".oac|cao.",
    "oagb|bgao"
   ],
   [
    ".oeg|geo.",
    "oega|ageo",
    "oeee|eeeo"
   ],
   [
    "oeee|eeeo",
    "oegc|cgeo",
    "oeec|ceeo"
   ]
  ]
 },
 "shade": {
  "at": 7,
  "frames": [
   [
    "...o|o...",
    "..oa|ao..",
    ".oac|cao."
   ],
   [
    "..oc|co..",
    ".oac|cao.",
    "oaca|acao"
   ],
   [
    "oocc|ccoo",
    "occa|acco",
    "oacc|ccao"
   ]
  ]
 },
 "warden": {
  "at": 9,
  "frames": [
   [
    "..oa|ao..",
    ".oag|gao.",
    "oaab|baao"
   ],
   [
    ".oac|cao.",
    "oaag|gaao",
    "oagg|ggao"
   ],
   [
    "oage|egao",
    "ogge|eggo",
    "oeec|ceeo"
   ]
  ]
 }
} as const);
export function inkedWindupBody(base:readonly string[],kind:EnemyKind,band:0|1|2|3):readonly string[]{
 if(!Object.hasOwn(HOSTILE_BODY_GESTURES,kind)||!Number.isInteger(band)||band<0||band>3)
  throw new RangeError('Unknown authored battle-body posture');
 if(band===0)return base; // idle and earliest warning preserve original outline
 const school=HOSTILE_BODY_GESTURES[kind],pattern=school.frames[band-1];
 if(!pattern)throw new RangeError('Missing real-windup body posture');
 const width=Math.max(...base.map(row=>row.length)),out=[...base];
 if(width<9||school.at+2>=out.length)throw new RangeError('Invalid hostile body sprite dimensions');
 for(let offset=0;offset<3;offset++){
  const [left,right]=pattern[offset]!.split('|');
  const old=(base[school.at+offset]??'').replace(/ /g,'.').padEnd(width,'.');
  out[school.at+offset]=left!+old.slice(4,width-4)+right!;
 }
 return out;
}