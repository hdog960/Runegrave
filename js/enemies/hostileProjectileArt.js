export function hostileProjectileStyle(b) {
    if (![b.damage, b.dx, b.dy].every(Number.isFinite) || b.damage <= 0)
        throw new RangeError('Invalid hostile bolt');
    return b.damage >= 2 ? { kind: 'warden-ember', color: '#ffac76', core: '#ffefb0', tail: '#b65247', size: 5.2 }
        : { kind: 'spectral-dart', color: '#9ee2e0', core: '#f0f5db', tail: '#4f8d94', size: 3.5 };
}
export function paintHostileProjectiles(g, bolts, t) {
    if (!Number.isFinite(t))
        throw new RangeError('Invalid projectile frame');
    for (const b of bolts) {
        const s = hostileProjectileStyle(b);
        if (![b.x, b.y, b.life].every(Number.isFinite) || b.life <= 0)
            continue;
        const heading = Math.atan2(b.dy, b.dx);
        const flicker = 1 + .08 * Math.sin(t * 12 + b.id);
        g.save();
        g.translate(Math.round(b.x), Math.round(b.y));
        g.rotate(heading);
        g.globalAlpha = clampAlpha(b.life);
        g.strokeStyle = s.tail;
        g.lineWidth = s.kind === 'warden-ember' ? 3 : 2;
        g.beginPath();
        g.moveTo(-s.size * 2.4, 0);
        g.lineTo(-s.size * .45, 0);
        g.stroke();
        g.fillStyle = s.color;
        g.beginPath();
        g.moveTo(s.size * flicker, 0);
        g.lineTo(-s.size * .7, s.size * .72);
        g.lineTo(-s.size * .4, 0);
        g.lineTo(-s.size * .7, -s.size * .72);
        g.closePath();
        g.fill();
        g.fillStyle = s.core;
        g.fillRect(-1.4, -1.4, 2.8, 2.8);
        if (s.kind === 'warden-ember') {
            g.strokeStyle = '#ffd19a';
            g.lineWidth = 1;
            g.beginPath();
            g.arc(-1, 0, s.size + 2, Math.PI * .3, Math.PI * 1.7);
            g.stroke();
        }
        g.restore();
    }
}
function clampAlpha(life) { return Math.max(.3, Math.min(1, life * 2)); }
