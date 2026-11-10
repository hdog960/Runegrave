import { GROUND_COLORS } from './motionTrails.js';
export function roomHeraldry(room) {
    const n = /^fs-(\d{2})$/.exec(room.id);
    if (!n || !Object.hasOwn(GROUND_COLORS, room.family))
        throw new RangeError('Unknown Gate A heraldry');
    const serial = Number(n[1]);
    if (serial < 1 || serial > 25)
        throw new RangeError('Invalid chamber heraldry serial');
    const families = ['ASH', 'IRON', 'ROOT', 'SPIRIT', 'FATE'];
    const sigil = families.indexOf(room.family);
    if (Math.floor((serial - 1) / 5) !== sigil)
        throw new RangeError('Room heraldry must match its canonical family');
    return { family: room.family, ordinal: serial, cuts: (serial - 1) % 5 + 1, sigil };
}
export function paintRoomHeraldry(g, W, H, room) {
    if (!(W > 150 && H > 145))
        return;
    const data = roomHeraldry(room), [ink, shaded] = GROUND_COLORS[data.family];
    const x = Math.round(W * .5), y = Math.round(Math.min(83, Math.max(71, H * .32)));
    g.save();
    g.translate(x, y);
    g.globalAlpha = .52;
    g.fillStyle = '#111b1a';
    g.fillRect(-29, -18, 58, 32);
    g.strokeStyle = shaded;
    g.lineWidth = 2;
    g.strokeRect(-28, -17, 56, 30);
    g.fillStyle = '#3b4540';
    g.fillRect(-24, -13, 48, 22);
    g.strokeStyle = ink;
    g.lineWidth = 1.5;
    g.beginPath();
    if (data.family === 'ASH') {
        // A split burning forge, made entirely from carved triangles.
        g.moveTo(-17, 3);
        g.lineTo(-10, -8);
        g.lineTo(-4, 0);
        g.lineTo(1, -11);
        g.lineTo(10, 0);
        g.lineTo(17, -5);
    }
    else if (data.family === 'IRON') {
        // Offset stair-stepped cog teeth; no glowing circular enemy cue.
        g.moveTo(-17, 6);
        g.lineTo(-17, -6);
        g.lineTo(-9, -6);
        g.lineTo(-9, -11);
        g.lineTo(3, -11);
        g.lineTo(3, -6);
        g.lineTo(16, -6);
        g.lineTo(16, 6);
    }
    else if (data.family === 'ROOT') {
        // Branch crown, three boughs and the central trunk.
        g.moveTo(0, 9);
        g.lineTo(0, -10);
        g.moveTo(0, -3);
        g.lineTo(-12, -10);
        g.moveTo(0, 1);
        g.lineTo(13, -9);
    }
    else if (data.family === 'SPIRIT') {
        // A fading lantern with two hanging ghostglass reflections.
        g.moveTo(-9, -11);
        g.lineTo(9, -11);
        g.lineTo(15, 6);
        g.lineTo(-15, 6);
        g.lineTo(-9, -11);
        g.moveTo(-5, -5);
        g.lineTo(0, 3);
        g.lineTo(5, -5);
    }
    else {
        // A Norn shuttle with paired threads / a knotted crossing.
        g.moveTo(-16, -9);
        g.lineTo(15, 8);
        g.moveTo(16, -9);
        g.lineTo(-15, 8);
        g.moveTo(-11, -11);
        g.lineTo(-11, 11);
        g.moveTo(11, -11);
        g.lineTo(11, 11);
    }
    g.stroke();
    // Each of the five numbered variations has a distinguishable cut-count.
    g.fillStyle = ink;
    for (let k = 0; k < data.cuts; k++)
        g.fillRect(-20 + k * 9, 11, 5, 2);
    g.restore();
}
