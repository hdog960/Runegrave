import { drawRelicCrest, RELIC_CRESTS } from './relicCrests.js';
import { PICKUP_RADIUS, paintSagaPlinth, paintPickupBoundary, pickupBand } from './sagaPlinthArt.js';
/** Mechanics-accurate runic pedestal engraving for all eight real relics. */
export const RELIC_PEDESTAL_BONUS=Object.freeze({
 'wyrd-fang':'DMG +1','skald-drum':'FIRE +20%',
 'storm-feather':'BOLT +25%','hugin-lens':'REACH +30%',
 'ash-anchor':'PUSH +70%','shieldroot':'HEART +1',
 'eir-thread':'ROOM HEAL','raven-hoard':'SILVER +3'
});

export function paintRoomSigil(g, W, H, t, room) {
    const x = W * .5, y = Math.min(H - 33, H * .39), col = room.accent;
    g.save();
    g.globalAlpha = .68;
    g.strokeStyle = col;
    g.lineWidth = 1.1;
    for (let n = 0; n < 3; n++) {
        g.beginPath();
        g.ellipse(x, y, 23 + n * 8, 7 + n * 3, 0, 0, Math.PI * 2);
        g.stroke();
    }
    const family = room.family === 'ASH' ? 3 : room.family === 'IRON' ? 4 : room.family === 'ROOT' ? 5 : room.family === 'SPIRIT' ? 6 : 7;
    for (let i = 0; i < family; i++) {
        const a = i * Math.PI * 2 / family + t * .014;
        g.beginPath();
        g.moveTo(x + Math.cos(a) * 23, y + Math.sin(a) * 11);
        g.lineTo(x + Math.cos(a) * 34, y + Math.sin(a) * 17);
        g.stroke();
    }
    g.fillStyle = col;
    g.font = 'bold 19px Georgia,serif';
    g.textAlign = 'center';
    g.fillText(room.rune, x, y + 6);
    g.globalAlpha = .34;
    for (let j = 0; j < 4; j++) {
        const xx = 25 + j * (W - 50) / 3;
        g.fillRect(xx, H - 37, 17 + (family + j) % 3 * 5, 1);
        g.fillRect(xx + 5, H - 34, 7, 2);
    }
    g.restore();
}
export function drawRoomDrops(g, drops, t, hero, reducedMotion = false) {
    for (const drop of drops) {
        if (drop.collected)
            continue;
        const pulse = reducedMotion ? .65 : .55 + .2 * Math.sin(t * 3 + drop.x * .03);
        const col = drop.kind === 'relic' ? '#dbb576' : drop.kind === 'silver' ? '#bfdcc7' : '#e2a6a0';
        g.save();
        g.translate(drop.x, drop.y);
        g.globalAlpha = .8;
        g.fillStyle = '#061619';
        g.beginPath();
        g.ellipse(0, 14, 16, 5, 0, 0, Math.PI * 2);
        g.fill();
        const glow = g.createRadialGradient(0, -4, 2, 0, -4, 30);
        glow.addColorStop(0, `rgba(${drop.kind === 'heart' ? '231,147,138' : '196,181,116'},${pulse * .35})`);
        glow.addColorStop(1, 'rgba(20,48,40,0)');
        g.fillStyle = glow;
        g.fillRect(-30, -34, 60, 60);
        g.strokeStyle = col;
        g.lineWidth = 1.5;
        g.beginPath();
        g.ellipse(0, 8, 13, 5, 0, 0, Math.PI * 2);
        g.stroke();
        const plinthId = drop.kind === 'relic' && drop.relic ? drop.relic.id : drop.kind === 'relic' ? 'silver' : drop.kind;
        paintPickupBoundary(g, plinthId, pickupBand(hero, drop));
        paintSagaPlinth(g, plinthId);
        const bob = reducedMotion ? 0 : Math.sin(t * 3 + drop.x) * 2;
        g.fillStyle = col;
        g.textAlign = 'center';
        g.font = 'bold 17px Georgia,serif';
        if (drop.kind === 'relic' && drop.relic) {
            // The eight relics are visibly different objects, not identical gold boxes.
            const crest = RELIC_CRESTS[drop.relic.id];
            g.save();
            g.translate(0, bob - 1);
            drawRelicCrest(g, drop.relic.id);
            g.restore();
            // A world-space inscription tells first-time players what the object IS.
            // This is attached to the pedestal and never steals a touch target.
            g.fillStyle = '#101a1cd9';
            g.fillRect(-41, -41, 82, 12);
            g.strokeStyle = '#d7bb83';
            g.lineWidth = 1;
            g.strokeRect(-41, -41, 82, 12);
            g.fillStyle = crest.color;
            g.font = 'bold 7px system-ui,sans-serif';
            g.fillText(`RELIC · ${crest.label}`, 0, -33);
            const bonus = RELIC_PEDESTAL_BONUS[drop.relic.id];
            g.fillStyle = '#0b1b1dcc'; g.fillRect(-41, 23, 82, 12);
            g.fillStyle = '#cfe8ce'; g.font = 'bold 8px system-ui,sans-serif'; g.fillText(bonus, 0, 32);
            for (const side of [-1, 1]) {
                g.fillStyle = crest.color; g.fillRect(side * 37 - 1, 24, 3, 9);
                g.fillStyle = '#efd9a3'; g.fillRect(side * 37, 26, 1, 4);
            }
            g.strokeStyle = '#eacb89';
            g.lineWidth = 1.4;
            g.beginPath();
            g.moveTo(-13, -13);
            g.lineTo(0, -25);
            g.lineTo(13, -13);
            g.stroke();
        }
        else {
            g.fillText(drop.kind === 'heart' ? '♥' : 'ᚠ', 0, 5 + bob);
            g.fillStyle = '#f0dfb6';
            g.font = 'bold 7px system-ui,sans-serif';
            g.fillText(drop.kind === 'heart' ? 'HEAL' : 'SILVER', 0, -19);
        }
        g.restore();
    }
}
export function nearDrop(player, drop) { return !drop.collected && Math.hypot(player.x - drop.x, player.y - drop.y) < PICKUP_RADIUS; }
