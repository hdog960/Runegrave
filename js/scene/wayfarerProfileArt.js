export const FACING_STITCHES = Object.freeze({ N: 1, NE: 2, E: 3, SE: 4, S: 5, SW: 6, W: 7, NW: 8 });
export function paintWayfarerProfile(g, pose, t) {
    if (!Number.isFinite(t))
        throw new RangeError('Invalid hero art time');
    const face = FACING_STITCHES[pose.facing], side = pose.side;
    // Mantle's asymmetric runic seam clearly distinguishes front/back/diagonals.
    g.strokeStyle = pose.back ? '#a5c6af' : '#c4a26a';
    g.lineWidth = 1.4;
    const heel = pose.back ? -2 : 2, flow = pose.moving ? Math.sin(t * 7) * 1.2 : 0;
    g.beginPath();
    g.moveTo(-7 + side * 2, 5);
    g.lineTo(-5 + side * 3, 12 + flow);
    g.lineTo(-3 + side * 3, 16 + heel);
    g.stroke();
    g.beginPath();
    g.moveTo(7 + side * 2, 5);
    g.lineTo(5 + side * 3, 12 - flow);
    g.lineTo(3 + side * 3, 16 + heel);
    g.stroke();
    // A distinctive runic chevron on the chest/back, never an external label.
    g.strokeStyle = pose.back ? '#77b9a7' : '#e7ce91';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(-3, -1);
    g.lineTo(0, 2 + (face % 2));
    g.lineTo(3, -1);
    g.stroke();
    // The helmet plume tilts toward facing; two different silhouettes for N/S.
    g.fillStyle = pose.back ? '#82aea0' : '#d7b679';
    g.beginPath();
    g.moveTo(side * 2 - 2, -25);
    g.lineTo(side * 5 - 1, -31);
    g.lineTo(side * 4 + 2, -24);
    g.closePath();
    g.fill();
    // Amber ring changes subtly when actually firing; reduced-motion t=0 is static.
    if (pose.recoil > .05) {
        g.strokeStyle = '#ffdc9a';
        g.lineWidth = 1;
        g.beginPath();
        g.arc(0, -3, 14 + pose.recoil, Math.PI * 1.15, Math.PI * 1.85);
        g.stroke();
    }
}
