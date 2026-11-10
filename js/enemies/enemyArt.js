const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
function runeWarning(g, e, t) {
    if (e.state !== 'warning')
        return;
    const r = e.radius + 8 + Math.sin(t * 13) * 2;
    g.strokeStyle = e.kind === 'warden' ? '#ffb96b' : '#ffcb80';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(e.x, e.y, r, 0, Math.PI * 2);
    g.stroke();
    for (let a = 0; a < 4; a++) {
        const theta = Math.PI * a / 2 + t * .35;
        const x = e.x + Math.cos(theta) * (r + 4), y = e.y + Math.sin(theta) * (r + 4);
        px(g, x - 2, y - 2, 4, 4, '#f5d59c');
    }
    if (e.kind === 'charger' || e.kind === 'archer' || e.kind === 'warden') {
        g.strokeStyle = '#f7b86a';
        g.lineWidth = 1.5;
        g.setLineDash([5, 4]);
        g.beginPath();
        g.moveTo(e.x, e.y);
        g.lineTo(e.x + e.dx * 85, e.y + e.dy * 85);
        g.stroke();
        g.setLineDash([]);
    }
}
function sprite(g, e, t) {
    const x = Math.round(e.x), y = Math.round(e.y), f = e.flash > 0;
    const bob = Math.round(Math.sin(t * 3 + (e.id.length % 4)) * 1.5);
    g.save();
    g.translate(x, y + bob);
    g.fillStyle = '#0009';
    g.beginPath();
    g.ellipse(0, e.radius * .7, e.radius + 3, 4, 0, 0, Math.PI * 2);
    g.fill();
    if (e.kind === 'draugr') {
        px(g, -7, -13, 14, 18, f ? '#fff2c7' : '#5b7772');
        px(g, -6, -18, 12, 9, '#7faaa0');
        px(g, -4, -16, 3, 3, '#e5cb84');
        px(g, 2, -16, 3, 3, '#e5cb84');
        px(g, -10, -5, 4, 12, '#3b585b');
        px(g, 6, -5, 4, 12, '#3b585b');
        px(g, -8, 5, 16, 3, '#8d7350');
    }
    else if (e.kind === 'wisp') {
        g.fillStyle = f ? '#fff2ce' : '#76b8c5';
        g.beginPath();
        g.moveTo(0, -16);
        g.lineTo(8, -3);
        g.lineTo(2, 9);
        g.lineTo(-8, 1);
        g.closePath();
        g.fill();
        px(g, -3, -5, 6, 6, '#e8e3bd');
        px(g, -1, -3, 2, 2, '#2f5c65');
    }
    else if (e.kind === 'archer') {
        px(g, -8, -13, 16, 17, f ? '#fceec6' : '#453e57');
        px(g, -6, -17, 12, 8, '#716688');
        px(g, -4, -12, 3, 3, '#d2c797');
        px(g, 2, -12, 3, 3, '#d2c797');
        px(g, 8, -13, 3, 18, '#ac966f');
        px(g, 10, -8, 3, 10, '#77c0b2');
    }
    else if (e.kind === 'charger') {
        px(g, -12, -10, 24, 18, f ? '#fff2c7' : '#695d49');
        px(g, -14, -17, 6, 13, '#baa37c');
        px(g, 8, -17, 6, 13, '#baa37c');
        px(g, -7, -13, 14, 6, '#9d7b53');
        px(g, -5, -8, 4, 3, '#ffab67');
        px(g, 3, -8, 4, 3, '#ffab67');
        px(g, -10, 6, 6, 7, '#454a40');
        px(g, 4, 6, 6, 7, '#454a40');
    }
    else if (e.kind === 'sentinel') {
        px(g, -11, -13, 22, 23, f ? '#ffe6a3' : '#344952');
        px(g, -8, -16, 16, 5, '#8a795c');
        px(g, -6, -6, 12, 12, '#182b39');
        px(g, -3, -3, 6, 6, '#b5ded5');
        px(g, -13, 7, 26, 4, '#ab9065');
    }
    else if (e.kind === 'shade') {
        px(g, -7, -12, 14, 9, f ? '#fff2c7' : '#5f5a78');
        px(g, -10, -4, 20, 12, '#383046');
        px(g, -5, -9, 3, 2, '#bdc6ee');
        px(g, 3, -9, 3, 2, '#bdc6ee');
        px(g, -7, 8, 4, 5, '#74658b');
        px(g, 3, 8, 4, 5, '#74658b');
    }
    else {
        // Rootbound Warden: large, bespoke armored silhouette with animated root horns.
        px(g, -19, -12, 38, 27, '#251f24');
        px(g, -15, -17, 30, 29, f ? '#f9edc1' : '#49634e');
        px(g, -12, -22, 24, 10, '#807251');
        px(g, -19, -27, 8, 18, '#9d7952');
        px(g, 11, -27, 8, 18, '#9d7952');
        px(g, -7, -13, 6, 4, '#f0b276');
        px(g, 3, -13, 6, 4, '#f0b276');
        px(g, -7, -4, 14, 10, '#183035');
        px(g, -3, -2, 6, 6, e.phase === 2 ? '#fd7844' : '#8dd2b0');
        px(g, -19, 12, 13, 11, '#756d50');
        px(g, 6, 12, 13, 11, '#756d50');
        px(g, -23, -3, 7, 17, '#6a533f');
        px(g, 16, -3, 7, 17, '#6a533f');
        if (e.phase === 2) {
            g.strokeStyle = '#ff9060';
            g.lineWidth = 2;
            g.beginPath();
            g.arc(0, -2, 23, 0, Math.PI * 2);
            g.stroke();
        }
    }
    g.restore();
    if (e.hp < e.maxHp || e.kind === 'warden') {
        const width = e.kind === 'warden' ? 45 : 19;
        px(g, x - width / 2, y - e.radius - 17, width, 4, '#171d21');
        px(g, x - width / 2, y - e.radius - 17, width * e.hp / e.maxHp, 3, e.kind === 'warden' ? '#d3a15c' : '#b5c68a');
    }
}
export function drawEncounter(g, encounter, t) {
    const state = encounter.snapshot;
    for (const e of state.enemies) {
        if (!e.alive)
            continue;
        if (e.state === 'hidden') {
            g.strokeStyle = '#a697c1';
            g.setLineDash([2, 3]);
            g.beginPath();
            g.arc(e.x, e.y, e.radius + 6, 0, Math.PI * 2);
            g.stroke();
            g.setLineDash([]);
            continue;
        }
        runeWarning(g, e, t);
        sprite(g, e, t);
    }
    for (const b of state.projectiles) {
        g.fillStyle = b.damage === 2 ? '#e5916b' : '#c7b7a0';
        g.beginPath();
        g.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = '#713f3b';
        g.lineWidth = 1;
        g.stroke();
    }
    // Door is a physical world object; no button, map, or permanent HUD intrudes.
    const door = encounter.exit;
    g.save();
    g.translate(door.x, door.y);
    px(g, -9, -16, 16, 32, '#1b252b');
    px(g, -7, -13, 12, 25, state.phase === 'gate' ? '#547e72' : '#473f3c');
    px(g, -3, -10, 4, 18, state.phase === 'gate' ? '#b8e5ac' : '#a17c57');
    g.strokeStyle = state.phase === 'gate' ? '#d4e5ae' : '#ac735b';
    g.lineWidth = 1.5;
    g.strokeRect(-10, -17, 18, 34);
    g.restore();
}
