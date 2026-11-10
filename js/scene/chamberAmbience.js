export const CHAMBER_AMBIENCE = Object.freeze({
    ASH: 'furnace-cinders', IRON: 'gear-sparks', ROOT: 'breathing-spores',
    SPIRIT: 'memory-shards', FATE: 'wyrd-threads'
});
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export function ambientMotif(family, variant) {
    if (!Object.hasOwn(CHAMBER_AMBIENCE, family) || !Number.isInteger(variant) || variant < 0)
        throw new RangeError('Invalid room ambience');
    return `${CHAMBER_AMBIENCE[family]}-${variant % 5}`;
}
export function paintChamberAmbience(g, W, H, t, family, variant = 0) {
    ambientMotif(family, variant);
    if (![W, H, t].every(Number.isFinite) || W < 200 || H < 140)
        throw new RangeError('Invalid ambience frame');
    g.save();
    // Both bands remain within the outer world-space 54 px. No central HUD, no
    // animations under thumb rails or in the player dodge circle.
    for (const side of [-1, 1]) {
        const edge = side < 0 ? 23 : W - 23;
        for (let n = 0; n < 5; n++) {
            const k = n + variant * 7 + (side + 1) * 11;
            const phase = t * (family === 'IRON' ? .55 : family === 'SPIRIT' ? .85 : family === 'FATE' ? .4 : .68) + k * 1.618;
            const xx = edge + Math.sin(phase) * clamp(9 + n * 2, 9, 20) * (-side);
            const yy = clamp(72 + ((n * 43 + variant * 19) % Math.max(60, Math.floor(H - 115))) + Math.sin(phase * .67) * 7, 64, H - 23);
            if (family === 'ASH') {
                g.globalAlpha = .38 + .13 * (Math.sin(phase * 2) + 1);
                g.fillStyle = n % 2 ? '#f9b55c' : '#e57f49';
                g.fillRect(Math.round(xx), Math.round(yy - 5), 3, 4);
                g.fillStyle = '#d7a578';
                g.fillRect(Math.round(xx + 3), Math.round(yy - 10), 1, 2);
            }
            else if (family === 'IRON') {
                g.globalAlpha = .43;
                g.strokeStyle = '#adceca';
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(xx - 4, yy);
                g.lineTo(xx + 4, yy - 4);
                g.stroke();
                g.fillStyle = '#e2c28b';
                g.fillRect(Math.round(xx), Math.round(yy - 3), 2, 2);
            }
            else if (family === 'ROOT') {
                g.globalAlpha = .37 + .12 * (1 + Math.sin(phase));
                g.fillStyle = '#9bdfa6';
                g.beginPath();
                g.ellipse(xx, yy, 2.4, 1.5, phase, 0, Math.PI * 2);
                g.fill();
                g.strokeStyle = '#5e9676';
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(xx, yy);
                g.lineTo(xx + side * 4, yy - 7);
                g.stroke();
            }
            else if (family === 'SPIRIT') {
                g.globalAlpha = .26 + .18 * (1 + Math.sin(phase * .7));
                g.strokeStyle = '#b5c4ed';
                g.lineWidth = 1.1;
                g.beginPath();
                g.moveTo(xx, yy - 6);
                g.lineTo(xx + 4, yy);
                g.lineTo(xx, yy + 6);
                g.lineTo(xx - 4, yy);
                g.closePath();
                g.stroke();
                g.fillStyle = '#c4f0e8';
                g.fillRect(Math.round(xx), Math.round(yy), 1, 3);
            }
            else {
                g.globalAlpha = .44;
                g.strokeStyle = n % 2 ? '#e0bf72' : '#89b6a6';
                g.lineWidth = 1;
                g.beginPath();
                g.moveTo(xx - 3, yy - 11);
                g.quadraticCurveTo(xx + Math.sin(phase) * 4, yy, xx + 3, yy + 12);
                g.stroke();
                g.fillStyle = '#f2dda6';
                g.fillRect(Math.round(xx - 1), Math.round(yy), 3, 2);
            }
        }
    }
    g.globalAlpha = 1;
    g.restore();
}
