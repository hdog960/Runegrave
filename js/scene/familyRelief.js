export const RELIEF_PATTERNS = Object.freeze({
    ASH: 'Kiln fracture channels',
    IRON: 'Interlocked gear plates',
    ROOT: 'Branching elderwood rings',
    SPIRIT: 'Ghostglass reflection arcs',
    FATE: 'Braided Norn fate-knots'
});
const rect = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
const stroke = (g, points, col, w = 2) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2)
    g.lineTo(points[i], points[i + 1]); g.stroke(); };
/** Keep the central dodge ring / player path open. Each family receives a truly
 * different arrangement at the left and right edges of the floor. */
export function paintFamilyRelief(g, width, height, room) {
    if (!(width > 150 && height > 145))
        return;
    const family = room.family;
    if (!Object.hasOwn(RELIEF_PATTERNS, family))
        throw new RangeError('Unknown relief family');
    const variant = (Number(room.id.replace(/\D/g, '')) || 0) % 4;
    const y = Math.max(111, Math.min(height - 62, height * .64));
    g.save();
    g.globalAlpha = .52;
    for (const side of [-1, 1]) {
        g.save();
        g.translate(side < 0 ? width * .16 : width * .84, y + (side === 1 ? 8 : -5));
        g.scale(side, 1);
        if (family === 'ASH') {
            // An old fractured lava drain with iron footbridges, colored like stone not attacks.
            stroke(g, [-45, 17, -22, 7, -17, -6, -3, -10, 4, -22, 19, -28], '#6c4233', 8);
            stroke(g, [-45, 17, -22, 7, -17, -6, -3, -10, 4, -22, 19, -28], '#d68c52', 2.1);
            for (let i = 0; i < 4; i++) {
                const x = -26 + i * 14;
                rect(g, x, -17 + i % 2 * 3, 10, 4, '#9a7b60');
                rect(g, x + 1, -16 + i % 2 * 3, 3, 2, '#4f3730');
            }
            stroke(g, [-22, 25, -8, 19, 11, 25], '#655143', 2);
        }
        else if (family === 'IRON') {
            // Flat gear teeth and plates (no glowing enemy-mimic circles).
            rect(g, -39, -18, 73, 49, '#2c4148');
            rect(g, -37, -16, 69, 3, '#93a1a1');
            for (let i = 0; i < 5; i++) {
                rect(g, -30 + i * 14, -20, 7, 6, '#87979b');
                rect(g, -30 + i * 14, 25, 7, 5, '#87979b');
                rect(g, -36 + i * 14, -9, 12, 3, '#5f717a');
            }
            for (const xx of [-29, -6, 17])
                for (const yy of [-10, 19])
                    rect(g, xx, yy, 3, 3, '#c7c4b1');
            stroke(g, [-30, 4, 27, 4], '#a3b6b8', 2);
        }
        else if (family === 'ROOT') {
            // Meandering braided bough and leaf veins, oriented away from the combat lane.
            stroke(g, [-46, 25, -25, 16, -21, -1, -7, -8, 2, -25], '#243e2b', 9);
            stroke(g, [-46, 25, -25, 16, -21, -1, -7, -8, 2, -25], '#79a573', 3);
            stroke(g, [-21, 1, -9, 13, 3, 15, 17, 5], '#4c8f68', 2);
            stroke(g, [-28, 12, -12, 27, 0, 27], '#567e55', 2);
            for (const [x, y] of [[3, -22], [15, 4], [-2, 27]]) {
                g.fillStyle = '#86b883';
                g.beginPath();
                g.ellipse(x, y, 5, 2.5, .7, 0, Math.PI * 2);
                g.fill();
            }
        }
        else if (family === 'SPIRIT') {
            // Staggered ghostglass mirrors and reflection rings, distinct from attack rings.
            for (let i = 0; i < 3; i++) {
                const x = -28 + i * 19, yy = -8 + (i % 2) * 8;
                rect(g, x - 7, yy - 10, 14, 28, '#383d65');
                rect(g, x - 5, yy - 8, 10, 24, '#777ca8');
                rect(g, x - 3, yy - 6, 5, 17, '#adabd2');
                rect(g, x + 1, yy + 11, 2, 3, '#4e456f');
            }
            stroke(g, [-43, 25, 30, 25], '#898bad', 2);
            rect(g, -12, 28, 15, 2, '#716b95');
        }
        else {
            // Thread shuttle and interlaced stone pattern, gold but unlike a pickup pedestal.
            rect(g, -36, -16, 66, 42, '#4d4333');
            rect(g, -33, -13, 60, 36, '#826d4f');
            for (let i = 0; i < 5; i++) {
                const x = -29 + i * 13;
                stroke(g, [x, -9, x + 5, 1, x - 1, 12, x + 5, 21], '#d9bb82', 1.5);
            }
            stroke(g, [-29, 4, 28, 4], '#bba474', 2);
            for (let i = 0; i < 3; i++)
                rect(g, -25 + i * 21, -14, 7, 3, '#ecdaa5');
        }
        // The variant slightly offsets a recessed footer without new dynamic cost.
        rect(g, -19 + variant * 3, 34, 22, 2, '#777467');
        g.restore();
    }
    g.restore();
}
