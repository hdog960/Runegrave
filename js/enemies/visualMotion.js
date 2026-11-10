export function enemyVisualMotion(enemy, time) {
    if (!Number.isFinite(time))
        throw new RangeError('Invalid animation time');
    const moving = enemy.state === 'charge';
    const stride = Math.floor(Math.max(0, time) * (moving ? 14 : enemy.kind === 'draugr' ? 7 : 4));
    const step = (stride % 2);
    const hovering = enemy.kind === 'wisp' || enemy.kind === 'shade';
    const bob = hovering ? Math.round(Math.sin(time * 4) * 2) : moving ? (step ? 1 : -1) : Math.round(Math.sin(time * 2) * .65);
    const pulse = .5 + .5 * Math.sin(time * (enemy.kind === 'warden' ? 4 : 5) + enemy.kind.length);
    const lean = enemy.state === 'warning' ? .06 : enemy.state === 'charge' ? .16 : 0;
    return { facing: enemy.dx < -.08 ? -1 : 1, step, bob, pulse, lean, strike: enemy.state === 'warning' || enemy.state === 'charge' };
}
export function clampWarningLabel(x, labelWidth, worldWidth) {
    if (!(worldWidth >= 80 && labelWidth > 0))
        throw new RangeError('Invalid warning frame');
    return Math.min(worldWidth - labelWidth / 2 - 3, Math.max(labelWidth / 2 + 3, x));
}
/** Warning lines stay visible to the actual center canvas edge, not behind rails. */
export function visibleWarningEnd(x, y, dx, dy, length, width, height) {
    const margin = 9;
    return { x: Math.max(margin, Math.min(width - margin, x + dx * length)),
        y: Math.max(margin, Math.min(height - margin, y + dy * length)) };
}
