export function carvedWaystones(path, spacing = 23) {
    if (!Number.isFinite(spacing) || spacing < 8)
        throw new RangeError('Stone spacing too small');
    if (path.length < 2)
        return [];
    const marks = [];
    let since = 0;
    for (let i = 1; i < path.length; i++) {
        const a = path[i - 1], b = path[i];
        const step = Math.hypot(b.x - a.x, b.y - a.y);
        if (!Number.isFinite(step) || step > 14 || step <= 0)
            continue;
        since += step;
        if (since >= spacing) {
            since = 0;
            marks.push({ x: b.x, y: b.y });
        }
    }
    return marks.slice(0, 25);
}
export function paintWaystones(g, stones, time) {
    g.save();
    for (let i = 0; i < stones.length; i++) {
        const { x, y } = stones[i], pulse = .48 + .22 * Math.sin(time * 3 - i * .6);
        g.fillStyle = '#061514aa';
        g.fillRect(Math.round(x - 5), Math.round(y - 3), 10, 6);
        g.fillStyle = `rgba(132,224,163,${pulse})`;
        g.beginPath();
        g.moveTo(x, y - 4);
        g.lineTo(x + 4, y);
        g.lineTo(x, y + 4);
        g.lineTo(x - 4, y);
        g.closePath();
        g.fill();
        g.strokeStyle = '#d1c187';
        g.lineWidth = .9;
        g.stroke();
    }
    g.restore();
}
