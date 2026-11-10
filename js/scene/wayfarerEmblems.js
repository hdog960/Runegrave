const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
export function paintWayfarerEmblems(g, pose, time) {
    if (!Number.isFinite(time))
        throw new RangeError('Invalid Wayfarer art time');
    // Triangular World Tree brooch pins the cloak to armor; reads from any angle.
    g.strokeStyle = '#f0d0a0';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(0, -2);
    g.lineTo(-4, 4);
    g.lineTo(4, 4);
    g.closePath();
    g.stroke();
    px(g, -1, 0, 2, 3, '#fff4c1');
    // Engraved knot clasp and layered brass plate are slightly different when
    // facing away, not an instantaneous player-character replacement sprite.
    if (pose.back) {
        px(g, -5, 7, 10, 3, '#7fa099');
        px(g, -2, 10, 4, 2, '#dbc390');
    }
    else {
        px(g, -5, 6, 10, 2, '#91b3aa');
        px(g, -2, 8, 4, 3, '#dabd82');
        px(g, -1, 4, 2, 2, '#fff2be');
    }
    for (const side of [-1, 1]) {
        const sx = side * 10;
        // Forged shoulder wing with a readable edge highlight.
        px(g, sx - 3, -8, 6, 2, '#e0bd7e');
        px(g, sx - 2, -4, 4, 2, '#284e50');
        px(g, sx - 2, 1, 2, 4, '#bed3bf');
    }
    // Small cloth seam and two embroidered runes keep the boots distinct when
    // the 8-direction pose is animated. The seam never reaches the attack reticle.
    px(g, -8, 12, 3, 2, '#b6a77d');
    px(g, 5, 12, 3, 2, '#b6a77d');
    if (pose.moving) {
        const bend = Math.round(Math.sin(time * 10.8));
        px(g, -13 + bend, 13, 2, 3, '#79a39a');
        px(g, 11 - bend, 13, 2, 3, '#79a39a');
    }
}
