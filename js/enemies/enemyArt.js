import { drawRuneDoor } from '../scene/doorArt.js';
import { enemyVisualMotion, clampWarningLabel, visibleWarningEnd } from './visualMotion.js';
import { warningBeat, warningLabelY, drawWarningBeats } from './warningClarity.js';
import { drawEnemyGesture } from './gestureArt.js';
import { paintEnemyAccents } from './armorAccents.js';
import { paintHostileProjectiles } from './hostileProjectileArt.js';
const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
/** Each hostile has a concrete, behavior-specific tell, not an interchangeable flash. */
export const ENEMY_ATTACK_TELLS = Object.freeze({
    draugr: { label: 'CLAW', color: '#f5c78b' },
    wisp: { label: 'SPIRIT SHOT', color: '#9fe6f2' },
    archer: { label: 'AIMED SHOT', color: '#f3cb94' },
    charger: { label: 'CHARGE!', color: '#ffa47a' },
    sentinel: { label: 'RUNE VOLLEY', color: '#f5c27d' },
    shade: { label: 'BLINK', color: '#c6b2fa' },
    warden: { label: 'WARDEN STRIKE', color: '#f6a37b' }
});
function lineHead(g, x, y, dx, dy, color) {
    const nx = -dy, ny = dx;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - dx * 11 + nx * 5, y - dy * 11 + ny * 5);
    g.lineTo(x - dx * 11 - nx * 5, y - dy * 11 - ny * 5);
    g.closePath();
    g.fill();
}
function runeWarning(g, e, t) {
    if (e.state !== 'warning')
        return;
    const tell = ENEMY_ATTACK_TELLS[e.kind];
    const imminent = warningBeat(e.windup) === 3;
    const r = e.radius + 9 + Math.sin(t * 11) * 1.5;
    const tf = g.getTransform();
    const worldWidth = tf.a > 0 ? g.canvas.width / tf.a : 420;
    const worldHeight = tf.d > 0 ? g.canvas.height / tf.d : 240;
    g.save();
    // Telegraph sits in world space around the attacker; the central HUD remains empty.
    g.strokeStyle = imminent ? '#ff684f' : tell.color;
    g.lineWidth = imminent ? 3 : 2;
    g.beginPath();
    g.arc(e.x, e.y, r, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = imminent ? '#ffab8a' : tell.color;
    g.lineWidth = 1.5;
    for (let a = 0; a < 4; a++) {
        const theta = Math.PI * a / 2 + t * .25, x = e.x + Math.cos(theta) * (r + 5), y = e.y + Math.sin(theta) * (r + 5);
        px(g, x - 3, y - 2, 6, 4, imminent ? '#ff855e' : tell.color);
    }
    if (e.kind === 'charger' || e.kind === 'archer' || e.kind === 'warden') {
        const length = e.kind === 'charger' ? 104 : e.kind === 'warden' ? 117 : 124;
        const endpoint = visibleWarningEnd(e.x, e.y, e.dx, e.dy, length, worldWidth, worldHeight);
        const endX = endpoint.x, endY = endpoint.y;
        g.strokeStyle = imminent ? '#ff6b4b' : '#f7c883';
        g.lineWidth = imminent ? 2.5 : 1.7;
        g.setLineDash([7, 4]);
        g.beginPath();
        g.moveTo(e.x, e.y);
        g.lineTo(endX, endY);
        g.stroke();
        g.setLineDash([]);
        // The tip indicates where the windup will travel. Arrowheads and a targeted
        // endpoint stay visible in both color-vision and reduced-motion modes.
        const nx = -e.dy, ny = e.dx;
        lineHead(g, endX, endY, e.dx, e.dy, imminent ? '#ff816a' : tell.color);
        if (e.kind === 'charger') {
            g.strokeStyle = imminent ? '#ff816a' : '#aa7658';
            g.lineWidth = 1;
            for (const side of [-1, 1]) {
                g.beginPath();
                g.moveTo(e.x + nx * 12 * side, e.y + ny * 12 * side);
                g.lineTo(endX + nx * 12 * side, endY + ny * 12 * side);
                g.stroke();
            }
        }
        else {
            g.strokeStyle = imminent ? '#ff9b7c' : '#dfc18e';
            g.lineWidth = 1;
            g.beginPath();
            g.arc(endX, endY, 6, 0, Math.PI * 2);
            g.stroke();
        }
    }
    else if (e.kind === 'sentinel' || e.kind === 'wisp') {
        // Distinguish an expanding volley from a single spirit shot.
        g.strokeStyle = tell.color;
        g.lineWidth = 1.4;
        g.beginPath();
        g.arc(e.x, e.y, e.radius + (e.kind === 'sentinel' ? 18 : 14), 0, Math.PI * 2);
        g.stroke();
    }
    // Short, specific attack labels appear ONLY during windup, not as permanent text clutter.
    const text = tell.label, wide = Math.max(33, Math.ceil(text.length * 4.65) + 10);
    const yy = warningLabelY(e.y, e.radius, worldHeight, e.kind === 'warden');
    const labelX = clampWarningLabel(e.x, wide, worldWidth);
    g.fillStyle = '#09191dec';
    g.fillRect(Math.round(labelX - wide / 2), Math.round(yy - 13), wide, 19);
    g.strokeStyle = imminent ? '#ff856c' : tell.color;
    g.lineWidth = 1;
    g.strokeRect(Math.round(labelX - wide / 2), Math.round(yy - 13), wide, 19);
    g.fillStyle = imminent ? '#ffddd0' : '#fff1d5';
    g.font = 'bold 8px system-ui,sans-serif';
    g.textAlign = 'center';
    g.fillText(text, labelX, yy - 3);
    drawWarningBeats(g, labelX, yy, e.windup, imminent ? '#ff8f78' : tell.color);
    if (imminent) {
        g.fillStyle = '#ff8d70';
        g.beginPath();
        g.arc(e.x, e.y - e.radius - 4, 2.5, 0, Math.PI * 2);
        g.fill();
    }
    g.restore();
}
function sprite(g, e, t) {
    const x = Math.round(e.x), y = Math.round(e.y), f = e.flash > 0;
    const motion = enemyVisualMotion(e, t);
    g.save();
    g.translate(x, y + motion.bob);
    g.scale(motion.facing, 1);
    if (motion.lean)
        g.rotate(motion.lean * (motion.facing === 1 ? 1 : -1));
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
        px(g, -19, 12 + (motion.step ? 1 : 0), 13, 11, '#756d50');
        px(g, 6, 12 + (motion.step ? 0 : 1), 13, 11, '#756d50');
        px(g, -23, -3, 7, 17, '#6a533f');
        px(g, 16, -3, 7, 17, '#6a533f');
        // Living braided crown and phase-two root glow.
        g.strokeStyle = e.phase === 2 ? '#ff996a' : '#9cb38d';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(-16, -24);
        g.lineTo(-25, -31);
        g.lineTo(-23, -37);
        g.moveTo(16, -24);
        g.lineTo(25, -31);
        g.lineTo(23, -37);
        g.stroke();
        px(g, -12, -8, 4, 2, e.phase === 2 ? '#ff7854' : '#e9c888');
        px(g, 8, -8, 4, 2, e.phase === 2 ? '#ff7854' : '#e9c888');
        if (e.phase === 2) {
            g.strokeStyle = '#ff9060';
            g.lineWidth = 2;
            g.beginPath();
            g.arc(0, -2, 23, 0, Math.PI * 2);
            g.stroke();
        }
    }
    drawEnemyGesture(g, e.kind, e.state, e.phase, t);
    paintEnemyAccents(g, e.kind, e.state, e.phase, t);
    g.restore();
    if (e.hp < e.maxHp || e.kind === 'warden' || e.state === 'warning') {
        const width = e.kind === 'warden' ? 45 : 19;
        px(g, x - width / 2, y - e.radius - 17, width, 4, '#171d21');
        px(g, x - width / 2, y - e.radius - 17, width * e.hp / e.maxHp, 3, e.kind === 'warden' ? '#d3a15c' : '#b5c68a');
    }
}
export function drawEncounter(g, encounter, t, relicCollected = true) {
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
    paintHostileProjectiles(g, state.projectiles, t);
    // Large recognizable carved doorway with LOCKED / EXIT sign and compass arrow.
    drawRuneDoor(g, encounter.exit, encounter.exitDirection, state.phase === 'gate' && relicCollected, t);
}
