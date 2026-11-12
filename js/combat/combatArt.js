import { paintTrueSoulbolt } from './sagaSoulboltRuneInk.js';
import { paintSagaCombatImpact } from './sagaImpactCarvings.js';
const combatPixelRect = (g, x, y, w, h, color) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
export function drawPracticeTargets(g, targets, t) {
    for (const d of targets) {
        if (!d.alive)
            continue;
        const x = Math.round(d.x), y = Math.round(d.y), f = d.flash > 0;
        g.fillStyle = '#000b';
        g.beginPath();
        g.ellipse(x, y + 8, 18, 7, 0, 0, Math.PI * 2);
        g.fill();
        if (d.kind === 'effigy') {
            // Iron-braced rune practice effigy, not an enemy or a live creature.
            combatPixelRect(g, x - 13, y - 8, 26, 22, '#172329');
            combatPixelRect(g, x - 10, y - 13, 20, 5, '#8d7950');
            combatPixelRect(g, x - 9, y - 10, 18, 19, f ? '#d3b98c' : '#605c48');
            combatPixelRect(g, x - 6, y - 7, 12, 12, '#1d3135');
            combatPixelRect(g, x - 1, y - 8, 2, 16, '#a58d59');
            combatPixelRect(g, x - 7, y - 1, 14, 2, '#a58d59');
            combatPixelRect(g, x - 3, y - 5, 6, 9, f ? '#fff1bb' : '#82a8a0');
            combatPixelRect(g, x - 12, y + 9, 24, 3, '#ab8650');
        }
        else {
            combatPixelRect(g, x - 10, y - 5, 20, 18, '#172c30');
            combatPixelRect(g, x - 8, y - 7, 16, 18, f ? '#cba779' : '#81643f');
            combatPixelRect(g, x - 5, y - 12, 10, 5, '#5a4a3c');
            combatPixelRect(g, x - 6, y - 2, 12, 3, '#bda170');
            combatPixelRect(g, x - 2, y + 1, 4, 7, '#2b4e51');
            combatPixelRect(g, x - 1, y + 2, 2, 5, '#a6c5b0');
        }
        // A tiny in-world damage-notch around the target itself, not a UI bar.
        if (d.hp < d.maxHp) {
            const seg = d.maxHp - d.hp;
            for (let i = 0; i < Math.min(4, seg); i++)
                combatPixelRect(g, x - 7 + i * 5, y - 16, 3, 2, '#d7a666');
        }
        if (t && d.flash > 0) {
            g.globalAlpha = Math.min(.65, d.flash * 3);
            g.strokeStyle = '#f4eac0';
            g.lineWidth = 1.3;
            g.strokeRect(x - 15, y - 17, 30, 30);
            g.globalAlpha = 1;
        }
    }
}
export function drawSoulbolts(g,bolts,time){
 if(!Number.isFinite(time))throw new RangeError('Invalid Soulbolt visual frame');
 for(const b of bolts){if(b.active)paintTrueSoulbolt(g,b);}
}
/** Existing fixed-step spark count/position/remaining life only; art replacement. */
export function drawCombatSparks(g,sparks){
 for(const s of sparks){
  if(s.life<=0)continue;
  paintSagaCombatImpact(g,s);
 }
}
