export const LANDMARK_IDENTITIES = Object.freeze({
    ASH: 'Ember forges · chain bellows',
    IRON: 'Riveted gear vaults · silver teeth',
    ROOT: 'Elder root reliefs · living leaves',
    SPIRIT: 'Hanging ghostglass lanterns · mist',
    FATE: 'Woven Norn looms · golden threads'
});
const box = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
const path = (g, pts, color, width = 1) => { g.strokeStyle = color; g.lineWidth = width; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2)
    g.lineTo(pts[i], pts[i + 1]); g.stroke(); };
const diamond = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); g.fill(); };
/** Far upper-wall landmarks: symmetric in architectural mass, but each room
 * family has its own unmistakable material, silhouette and small motion.
 * Art runs behind actor/enemies/doors and is explicitly non-interactive. */
export function paintFamilyLandmarks(g, W, H, t, room) {
    if (!Object.hasOwn(LANDMARK_IDENTITIES, room.family))
        throw new RangeError('Unknown landmark family');
    const family = room.family;
    const variant = Number(room.id.replace(/\D/g, '')) % 5;
    const upper = Math.max(85, Math.min(98, H * .37));
    g.save();
    for (const side of [-1, 1]) {
        const x = side < 0 ? Math.max(63, W * .20) : Math.min(W - 63, W * .80);
        g.save();
        g.translate(Math.round(x), Math.round(upper));
        const pulse = .7 + .3 * Math.sin(t * 1.3 + variant + side);
        // All monuments are recessed in the upper wall, never blocking hero movement.
        box(g, -25, -23, 50, 36, '#11191c');
        box(g, -23, -22, 46, 3, '#6a6151');
        box(g, -24, 10, 48, 4, '#232e2d');
        box(g, -25, 12, 50, 2, '#7b6e55');
        if (family === 'ASH') {
            // A smoking furnace and a chain-operated forge bellows.
            box(g, -17, -16, 34, 27, '#392820');
            box(g, -14, -13, 28, 22, '#6e4230');
            box(g, -12, -8, 24, 15, '#18191c');
            box(g, -10, -6, 20, 11, '#ae5030');
            box(g, -7, -4, 14, 8, '#e69a48');
            box(g, -3, -2, 6, 4, '#ffe1a0');
            for (const q of [-19, 19]) {
                box(g, q, -19, 3, 30, '#9b7b59');
                for (let yy = -17; yy < 10; yy += 7)
                    box(g, q + 1, yy, 2, 3, '#d5ae78');
            }
            box(g, -13, -22, 26, 4, '#b89c68');
            for (const k of [-8, 0, 8])
                box(g, k, -24, 3, 3, '#dbb77d');
            box(g, side * 17, -12, 2, 10, '#6b6e67');
            diamond(g, side * 17, 1, 3, '#b37b45');
            g.globalAlpha = .24 * pulse;
            box(g, -8, -13, 16, 10, '#ffc16b');
            g.globalAlpha = 1;
        }
        else if (family === 'IRON') {
            // Machined cog teeth in a riveted steel lock-box: strong angular silhouette.
            box(g, -20, -20, 40, 31, '#34454d');
            box(g, -18, -18, 36, 27, '#627780');
            for (const xx of [-15, 15])
                for (const yy of [-15, 7])
                    box(g, xx, yy, 3, 3, '#c7c4a9');
            g.save();
            g.translate(0, -4);
            g.rotate(variant * Math.PI / 10);
            for (let a = 0; a < 8; a++) {
                g.save();
                g.rotate(a * Math.PI / 4);
                box(g, -3, -18, 6, 7, '#afbdc0');
                g.restore();
            }
            g.fillStyle = '#12292f';
            g.beginPath();
            g.arc(0, 0, 13, 0, Math.PI * 2);
            g.fill();
            g.strokeStyle = '#e0d5ac';
            g.lineWidth = 2;
            g.beginPath();
            g.arc(0, 0, 9, 0, Math.PI * 2);
            g.stroke();
            diamond(g, 0, 0, 5, '#acc8c5');
            box(g, -2, -2, 4, 4, '#1b3337');
            g.restore();
            for (const xx of [-23, 21]) {
                box(g, xx, -23, 3, 33, '#a0a69e');
                box(g, xx, -18, 3, 2, '#dfd4a5');
            }
        }
        else if (family === 'ROOT') {
            // Massive living trunk branching into green veins; leaf tips are deliberately
            // not golden pickup colors.
            box(g, -19, -20, 38, 31, '#223a2b');
            path(g, [0, 12, -3, 4, -5, -6, -13, -17], '#69543a', 5);
            path(g, [0, 12, 3, 4, 5, -8, 16, -19], '#806b4a', 5);
            path(g, [-5, -6, -16, -12, -21, -10], '#807454', 3);
            path(g, [5, -8, 15, -12, 22, -8], '#7f6947', 3);
            for (const [xx, yy] of [[-13, -17], [13, -20], [-20, -10], [20, -8], [-2, -20]]) {
                diamond(g, xx, yy, 4, '#468a67');
                box(g, xx, yy - 1, 2, 2, '#a3df9c');
            }
            box(g, -7, 4, 14, 6, '#33452d');
            diamond(g, 0, 6, 3, '#92cda0');
        }
        else if (family === 'SPIRIT') {
            // Two-tier ghostglass cage with a hanging spectral flame and silver chains.
            for (const xx of [-17, 17])
                for (let y = -22; y < -7; y += 5)
                    box(g, xx, y, 2, 3, '#8f91b4');
            box(g, -16, -10, 32, 17, '#2b354d');
            box(g, -14, -8, 28, 13, '#677293');
            box(g, -11, -6, 22, 10, '#20283a');
            for (const xx of [-9, 9])
                box(g, xx, -7, 2, 12, '#bdc1dd');
            box(g, -16, 7, 32, 3, '#b5adcf');
            diamond(g, 0, -1, Math.round(5 + pulse), '#99d6e0');
            box(g, -2, 1, 4, 3, '#e5f5e8');
            g.globalAlpha = .25 * pulse;
            g.fillStyle = '#a8b9f2';
            g.beginPath();
            g.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
            g.fill();
            g.globalAlpha = 1;
        }
        else {
            // The Norns' thread loom, distinct from sword/rune/pickup silhouettes.
            box(g, -19, -20, 38, 32, '#5d4a32');
            box(g, -17, -18, 34, 28, '#bc9c61');
            box(g, -14, -16, 28, 24, '#2b3030');
            for (const xx of [-10, -5, 0, 5, 10])
                path(g, [xx, -15, xx + ((xx + variant) % 3) - 1, 7], '#d5bd80', 1);
            diamond(g, 0, -5, 8, '#a98d55');
            diamond(g, 0, -5, 4, '#e2d09d');
            for (const k of [-1, 1]) {
                path(g, [k * 12, -15, k * 12, 8, k * 16, 11], '#d5bf8e', 2);
                box(g, k * 20 - 1, -22, 2, 35, '#80704a');
            }
            box(g, -16, -22, 32, 4, '#ebd39a');
        }
        g.restore();
    }
    g.restore();
}
