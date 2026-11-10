export function wayfarerFacing(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y))
        throw new RangeError('Nonfinite hero direction');
    if (Math.hypot(x, y) < .10)
        return 'S';
    const eighth = Math.round(Math.atan2(y, x) * 4 / Math.PI);
    return ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][((eighth % 8) + 8) % 8];
}
export function wayfarerPose(time, moveX, moveY, aimX, aimY, firing) {
    if (![time, moveX, moveY, aimX, aimY].every(Number.isFinite))
        throw new RangeError('Invalid Wayfarer pose');
    const moving = Math.hypot(moveX, moveY) > .10;
    const aimValid = Math.hypot(aimX, aimY) > .12;
    const ax = aimValid ? aimX : moving ? moveX : 0, ay = aimValid ? aimY : moving ? moveY : 1;
    const facing = wayfarerFacing(ax, ay);
    const cadence = moving ? Math.sin(time * 10.8) : 0;
    const side = ax > .38 ? 1 : ax < -.38 ? -1 : 0;
    return { facing, side, back: ay < -.42, moving,
        bootLeft: Math.round(cadence * 3), bootRight: Math.round(-cadence * 3),
        cape: Math.round(moving ? Math.sin(time * 7.2) * 2 : 0),
        shoulder: Math.round(moving ? Math.cos(time * 10.8) * 1.5 : 0),
        recoil: firing ? Math.max(0, Math.sin(time * 18)) * .75 : 0,
        aimX: ax, aimY: ay };
}
