export function warningBeat(remainingSeconds) {
    if (!Number.isFinite(remainingSeconds) || remainingSeconds < 0)
        throw new RangeError('Invalid warning time');
    return remainingSeconds > .65 ? 0 : remainingSeconds > .40 ? 1 : remainingSeconds >= .20 ? 2 : 3;
}
/** Keep both the warning inscription and its beat bar inside the camera. */
export function warningLabelY(enemyY, radius, height, warden) {
    if (![enemyY, radius, height].every(Number.isFinite) || radius < 0 || height < 70)
        throw new RangeError('Invalid warning frame');
    const intended = enemyY - radius - (warden ? 38 : 27);
    return Math.max(19, Math.min(height - 9, intended));
}
/** Three separated countdown blocks, high contrast even without red/green cues. */
export function drawWarningBeats(g, x, baseline, remainingSeconds, urgentColor) {
    const filled = warningBeat(remainingSeconds);
    g.save();
    for (let i = 0; i < 3; i++) {
        g.fillStyle = i < filled ? urgentColor : '#354448';
        g.fillRect(Math.round(x - 11 + i * 8), Math.round(baseline), 6, 3);
        g.strokeStyle = '#e1c8a2';
        g.lineWidth = .5;
        g.strokeRect(Math.round(x - 11 + i * 8), Math.round(baseline), 6, 3);
    }
    g.restore();
}
