export const ZERO = Object.freeze({ x: 0, y: 0 });
export function normalizeStick(dx, dy, radius, deadZone = 0.15) {
    if (![dx, dy, radius, deadZone].every(Number.isFinite) || radius <= 0 || deadZone < 0 || deadZone >= 1) {
        throw new RangeError('Invalid stick geometry');
    }
    const nx = dx / radius, ny = dy / radius;
    const magnitude = Math.hypot(nx, ny);
    if (magnitude <= deadZone)
        return ZERO;
    const strength = Math.min(1, (magnitude - deadZone) / (1 - deadZone));
    return { x: (nx / magnitude) * strength, y: (ny / magnitude) * strength };
}
export function clampVector(x, y) {
    const length = Math.hypot(x, y);
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
}
export function combineDirections(keys, up, down, left, right) {
    const pressed = (set) => set.some(k => keys.has(k));
    return clampVector(Number(pressed(right)) - Number(pressed(left)), Number(pressed(down)) - Number(pressed(up)));
}
/** Eight-way feedback for the physical rune discs, never an overlay over gameplay. */
export function stickDirectionGlyph(v) {
    const magnitude = Math.hypot(v.x, v.y);
    if (!Number.isFinite(magnitude) || magnitude < .04)
        return '·';
    const sectors = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
    return sectors[(Math.round(Math.atan2(v.y, v.x) / (Math.PI / 4)) + 8) % 8];
}
