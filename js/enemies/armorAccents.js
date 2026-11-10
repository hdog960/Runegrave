export const FOE_MATERIAL = Object.freeze({
    draugr: 'oxidized-mail', wisp: 'captured-starlight', archer: 'skeletal-longbow',
    charger: 'basalt-horn', sentinel: 'wardstone-eye', shade: 'tattered-veil', warden: 'yggdrasil-heartwood'
});
const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
function line(g, a, b, c, d, color, width = 1.5) {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(a, b);
    g.lineTo(c, d);
    g.stroke();
}
export function paintEnemyAccents(g, kind, state, phase, time) {
    if (!Object.hasOwn(FOE_MATERIAL, kind) || !Number.isFinite(time))
        throw new RangeError('Invalid hostile art state');
    const charge = state === 'warning' || state === 'charge';
    switch (kind) {
        case 'draugr':
            // Uneven corroded mail, a rusty diagonal battle-scar, dark eye-sockets.
            px(g, -5, -7, 10, 2, '#c0b493');
            px(g, -3, -1, 2, 5, '#93a89a');
            px(g, 3, 1, 2, 4, '#8a9887');
            line(g, -5, -14, 4, -5, '#c9a773', 2);
            px(g, -9, -16, 3, 3, '#a88663');
            break;
        case 'wisp':
            // Core star, floating split rings and an illuminated trailing tear.
            px(g, -2, -8, 4, 4, charge ? '#fff6d4' : '#d5f1de');
            line(g, -7, 1, -12, 7, '#b1e8e1', 2);
            line(g, 7, 0, 11, 5, '#a9dddb', 1);
            px(g, -1, 10, 2, 3, '#d7c9f1');
            break;
        case 'archer':
            // A visible string distinguishes the bow from a club or arm.
            line(g, 11, -17, 15, -8, '#c8ad84', 1.6);
            line(g, 15, -8, 11, 5, '#c8ad84', 1.6);
            line(g, 10, -15, 10, 5, charge ? '#f2dcab' : '#7fb8ac', 1);
            px(g, -3, 0, 6, 4, '#8e829c');
            px(g, -2, -6, 3, 2, '#e8d5a7');
            break;
        case 'charger':
            // Large pale horn edge and riveted muzzle; forehoof pairs read as a beast.
            line(g, -13, -15, -9, -21, '#f2d9ab', 2.5);
            line(g, 13, -15, 9, -21, '#f2d9ab', 2.5);
            px(g, -5, 0, 10, 4, '#b59673');
            px(g, -2, 4, 4, 2, '#ecc58e');
            px(g, -11, 9, 4, 3, '#c49a69');
            px(g, 7, 9, 4, 3, '#c49a69');
            break;
        case 'sentinel':
            // Jagged shieldstone edges and a single concentrated runic eye.
            for (const xx of [-10, 8])
                for (const yy of [-7, 6])
                    px(g, xx, yy, 3, 3, '#9caa9f');
            px(g, -3, -4, 6, 7, charge ? '#f9dd8a' : '#a0ddd4');
            px(g, -1, -1, 2, 3, '#203f48');
            break;
        case 'shade':
            // Asymmetrical torn-veils and no solid legs, unmistakably a spirit.
            line(g, -10, 4, -15, 15, '#a49cbe', 2);
            line(g, 8, 3, 12, 13, '#d3c5da', 2);
            px(g, -3, -13, 6, 2, '#a4a3cd');
            px(g, -1, -8, 3, 2, '#f1e4ed');
            break;
        case 'warden':
            // Braided heartwood breastplate and phase-specific central eye.
            px(g, -13, -2, 26, 4, '#9f8562');
            px(g, -10, 5, 20, 2, '#516d5d');
            line(g, -9, -5, -14, 7, '#8fac85', 2.2);
            line(g, 9, -5, 14, 7, '#8fac85', 2.2);
            px(g, -3, -5, 6, 7, phase === 2 ? '#ff986f' : '#b6e5ba');
            for (const xx of [-17, 14])
                px(g, xx, -14, 3, 6, '#c59e64');
            break;
    }
}
