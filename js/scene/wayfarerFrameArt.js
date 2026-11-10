export const EIGHT_FACINGS = Object.freeze(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);
export const HERO_FRAME_COUNT = 4;
export function heroAnimFrame(pose, time) {
    if (!Number.isFinite(time))
        throw new RangeError('Invalid hero animation clock');
    return (pose.moving ? Math.floor(Math.max(0, time) * 9) % HERO_FRAME_COUNT : 0);
}
/** Paint over the already-rendered physical silhouette, beneath the weapon. */
export function paintWayfarerFrames(g, pose, t, reducedMotion = false) {
    const frame = reducedMotion ? 0 : heroAnimFrame(pose, t);
    const phase = pose.moving && !reducedMotion ? [-2, 0, 2, 0][frame] : 0;
    const f = EIGHT_FACINGS.indexOf(pose.facing);
    if (f < 0)
        throw new RangeError('Invalid hero facing');
    const back = pose.back, side = pose.side;
    const px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
    g.save();
    // Two distinct articulated leg plates. Alternating positions are visible at
    // normal phone pixel scales, but never extend past the actor's 25px radius.
    for (const s of [-1, 1]) {
        const gait = s * phase;
        px(s * 5 - (s < 0 ? 4 : 0), 13 + gait, 6, 6, '#273c3d');
        px(s * 5 - (s < 0 ? 3 : 0), 14 + gait, 4, 3, '#aeb6a0');
        px(s * 5 - (s < 0 ? 3 : 0), 18 + gait, 5, 2, '#d2b27b');
    }
    // Back views expose a World Tree cloak spine; front views show a gold
    // chest buckle. Quarter turns show one illuminated shoulder-guard edge.
    if (back) {
        px(-2, 0, 4, 14, '#213f43');
        px(-1, 2, 2, 10, '#b4c7aa');
        px(-5, 6, 10, 2, '#739e8e');
    }
    else {
        px(-4, 1, 8, 6, '#182e31');
        px(-3, 2, 6, 4, '#ccad73');
        px(-1, 2, 2, 4, '#f0deb0');
    }
    if (side !== 0) {
        const sx = side > 0 ? 11 : -14;
        px(sx, -2, 4, 11, '#3a6264');
        px(sx + 1, 0, 2, 6, '#c2d0aa');
        px(sx, -12, 3, 6, '#d7be87');
    }
    // Four-frame fabric folds vary by facing. When the player enables reduced
    // motion, frame 0 is guaranteed to remain completely stationary.
    const taper = pose.moving && !reducedMotion ? (frame === 1 ? 2 : frame === 3 ? -2 : 0) : 0;
    g.strokeStyle = back ? '#7ea99a' : '#e1b981';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(-8, 8);
    g.lineTo(-11 + taper + side, 17);
    g.stroke();
    g.beginPath();
    g.moveTo(8, 8);
    g.lineTo(11 - taper + side, 17);
    g.stroke();
    // Eight facing variants each have an individually placed tiny helmet jewel.
    const directions = [
        [0, -25], [5, -22], [9, -17], [6, -12], [0, -9], [-6, -12], [-9, -17], [-5, -22]
    ];
    const [jx, jy] = directions[f];
    px(jx - 2, jy - 1, 4, 3, back ? '#a2dcc8' : '#e9ca8b');
    if (pose.recoil > .25) { // short real-attack recoil, not a looping decorative flash
        const arm = side < 0 ? -13 : 10;
        px(arm, -5, 4, 5, '#fff1ba');
        px(arm + 1, -3, 2, 2, '#d6f4e4');
    }
    g.restore();
}
