/** Scenic render for v0.02 canvas geometry validation. This is NOT combat/gameplay. */
import { rngStream } from '../core/rng.js';
const WIDTH = 420;
/** Camera width follows exactly the visible canvas; never renders under UI rails. */
export function stageMetrics(cssWidth, cssHeight, devicePixelRatio = 1) {
    if (!(cssWidth > 0 && cssHeight > 0) || !Number.isFinite(cssWidth + cssHeight)) {
        throw new RangeError('Stage must have a measurable nonzero central viewport');
    }
    const dpr = Math.min(2.5, Math.max(1, devicePixelRatio));
    return {
        cssWidth, cssHeight,
        pixelWidth: Math.max(1, Math.round(cssWidth * dpr)),
        pixelHeight: Math.max(1, Math.round(cssHeight * dpr)),
        cameraWidth: WIDTH,
        cameraHeight: WIDTH * cssHeight / cssWidth
    };
}
function rect(g, x, y, w, h, c) {
    g.fillStyle = c;
    g.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
}
function line(g, x, y, tx, ty, c, width = 1) {
    g.strokeStyle = c;
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(tx, ty);
    g.stroke();
}
function polygon(g, points, color) {
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++)
        g.lineTo(...points[i]);
    g.closePath();
    g.fill();
}
function drawnStone(g, x, y, w, h, choice) {
    rect(g, x, y, w, h, choice % 5 === 0 ? '#263431' : choice % 2 === 0 ? '#18282a' : '#1c2c2c');
    rect(g, x + 2, y + 2, w - 4, 1, '#39534b');
    rect(g, x + 2, y + h - 3, w - 4, 2, '#0a161a');
    if (choice % 4 === 0) {
        line(g, x + w * .25, y + h * .7, x + w * .42, y + h * .4, '#526051');
        line(g, x + w * .42, y + h * .4, x + w * .7, y + h * .48, '#526051');
    }
    if (choice % 9 === 0) {
        rect(g, x + w * .75, y + h * .35, 2, 2, '#71927a');
        rect(g, x + w * .70, y + h * .4, 2, 2, '#527968');
    }
}
function runestone(g, x, y, scale) {
    g.save();
    g.translate(x, y);
    g.scale(scale, scale);
    polygon(g, [[-13, 0], [-13, -27], [-8, -36], [4, -39], [14, -31], [14, 0]], '#0b171b');
    polygon(g, [[-11, -2], [-11, -27], [-7, -34], [4, -37], [11, -30], [11, -2]], '#465753');
    line(g, -9, -3, -9, -28, '#93a084', 1);
    line(g, 8, -4, 8, -29, '#1d292a', 2);
    line(g, -5, -16, 4, -25, '#8dbaad', 2);
    line(g, 4, -25, 4, -10, '#8dbaad', 2);
    line(g, -5, -16, 5, -12, '#8dbaad', 2);
    rect(g, -10, -5, 20, 4, '#182325');
    g.restore();
}
function pillar(g, x, y, size) {
    g.save();
    g.translate(x, y);
    g.scale(size, size);
    polygon(g, [[-10, 0], [-10, -60], [-7, -70], [8, -70], [11, -60], [11, 0]], '#0c1d20');
    polygon(g, [[-9, 0], [-9, -57], [-6, -67], [5, -67], [8, -60], [8, 0]], '#364a48');
    rect(g, -13, -58, 27, 6, '#647263');
    rect(g, -15, -61, 29, 3, '#9b8a61');
    rect(g, -12, -4, 26, 7, '#4f6158');
    line(g, -5, -49, -5, -9, '#556d62', 1);
    line(g, 3, -49, 3, -9, '#233735', 2);
    rect(g, -2, -43, 4, 3, '#9ab3a4');
    rect(g, -2, -27, 4, 3, '#a49c6f');
    g.restore();
}
function root(g, points, weight) {
    g.strokeStyle = '#081619';
    g.lineWidth = weight + 4;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++)
        g.lineTo(...points[i]);
    g.stroke();
    g.strokeStyle = '#344342';
    g.lineWidth = weight;
    g.beginPath();
    g.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++)
        g.lineTo(...points[i]);
    g.stroke();
    g.strokeStyle = '#5d6751';
    g.lineWidth = Math.max(1, weight / 4);
    g.beginPath();
    g.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++)
        g.lineTo(...points[i]);
    g.stroke();
}
function torch(g, x, y, t) {
    rect(g, x - 2, y - 1, 5, 10, '#493926');
    rect(g, x - 5, y - 2, 11, 3, '#917148');
    const flame = 4 + Math.sin(t * 2.1 + x) * 2;
    polygon(g, [[x, y - 3], [x - 3, y - 8], [x - 2, y - 14 - flame], [x + 2, y - 9], [x + 4, y - 15 - flame], [x + 4, y - 4]], '#eeb464');
    polygon(g, [[x, y - 5], [x - 1, y - 9], [x + 1, y - 13 - flame / 2], [x + 2, y - 6]], '#fff0ac');
}
function hero(g, cx, cy, t) {
    g.save();
    g.translate(cx, cy + Math.sin(t * 1.2) * 1.3);
    g.fillStyle = '#0009';
    g.beginPath();
    g.ellipse(0, 18, 19, 7, 0, 0, Math.PI * 2);
    g.fill();
    polygon(g, [[-8, 1], [-16, 15], [-10, 23], [9, 23], [15, 15], [8, 1]], '#142c32');
    polygon(g, [[-7, 1], [-13, 16], [-8, 20], [1, 16], [8, 20], [12, 16], [8, 2]], '#326570');
    rect(g, -8, 0, 16, 5, '#718788');
    rect(g, -7, -12, 14, 15, '#9b7b56');
    polygon(g, [[-10, -12], [-10, -18], [-6, -23], [5, -23], [10, -17], [9, -9], [5, -3], [-6, -3]], '#1c3239');
    polygon(g, [[-7, -17], [-3, -22], [6, -20], [8, -16], [7, -5], [-6, -6]], '#526b66');
    rect(g, -5, -10, 3, 2, '#d6e8c7');
    rect(g, 3, -10, 3, 2, '#d6e8c7');
    rect(g, -12, 2, 4, 8, '#8d856e');
    rect(g, 8, 2, 4, 8, '#8d856e');
    rect(g, -7, 22, 6, 3, '#755d47');
    rect(g, 3, 22, 6, 3, '#755d47');
    line(g, 0, -21, 0, -30, '#d2b87b', 2);
    g.restore();
}
/** Holds an entirely decorative precombat dungeon scene; no damage or fake gameplay. */
export function mountStage(canvas) {
    const parent = canvas.parentElement;
    const g = canvas.getContext('2d', { alpha: false });
    if (!parent || !g)
        throw new Error('Runegrave requires a dedicated stage canvas');
    const random = rngStream('runegrave-v0.02', 'visual-floor');
    const worldFloor = Array.from({ length: 500 }, () => random.int(100));
    const embers = Array.from({ length: 30 }, () => ({ x: random.next() * WIDTH, y: random.next() * 320, s: 1 + random.next() * 2, pace: .6 + random.next() * .8 }));
    let raf = 0;
    let lastTime = 0;
    let lastFrameMs = -Infinity;
    let metrics;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function resize() {
        const bounds = parent.getBoundingClientRect();
        if (bounds.width < 1 || bounds.height < 1)
            return;
        metrics = stageMetrics(bounds.width, bounds.height, window.devicePixelRatio || 1);
        canvas.width = metrics.pixelWidth;
        canvas.height = metrics.pixelHeight;
        render(lastTime);
    }
    function render(time) {
        if (!metrics)
            return;
        const W = metrics.cameraWidth, H = metrics.cameraHeight;
        g.setTransform(metrics.pixelWidth / W, 0, 0, metrics.pixelHeight / H, 0, 0);
        const gradient = g.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#071316');
        gradient.addColorStop(.3, '#142b2c');
        gradient.addColorStop(1, '#1a2a2b');
        g.fillStyle = gradient;
        g.fillRect(0, 0, W, H);
        // Scenery remains completely inside the actual canvas; no sprites hidden behind controls.
        rect(g, 0, 0, W, 14, '#081417');
        rect(g, 0, 9, W, 6, '#2a3c36');
        rect(g, 0, H - 15, W, 15, '#0b171a');
        const tile = 32;
        for (let row = 0; row < Math.ceil(H / tile) + 1; row++)
            for (let col = 0; col < Math.ceil(W / tile) + 1; col++) {
                const n = worldFloor[(row * 17 + col) % worldFloor.length];
                drawnStone(g, col * tile - 2 + (row % 2) * 8, row * tile - 3, tile + 1, tile + 1, n);
            }
        // Broken mausoleum masonry and a recessed rune-gate in the northern wall.
        rect(g, 0, 0, W, 30, '#091618');
        rect(g, 0, 12, W, 5, '#304741');
        for (let x = 0; x < W; x += 24) {
            rect(g, x + 3, 1, 17, 11, '#3f514a');
            rect(g, x + 3, 0, 17, 2, '#73816c');
            rect(g, x + 1, 18, 23, 7, '#182627');
        }
        const cx = W / 2, cy = H * .55;
        g.fillStyle = '#061219';
        g.beginPath();
        g.ellipse(cx, 31, 56, 31, 0, Math.PI, 0);
        g.fill();
        polygon(g, [[cx - 42, 20], [cx - 38, 7], [cx - 30, 0], [cx + 30, 0], [cx + 38, 7], [cx + 42, 20], [cx + 37, 44], [cx - 37, 44]], '#344641');
        polygon(g, [[cx - 27, 30], [cx - 23, 7], [cx - 15, -1], [cx + 15, -1], [cx + 23, 7], [cx + 27, 30], [cx + 20, 44], [cx - 20, 44]], '#081418');
        rect(g, cx - 20, 13, 40, 30, '#0e2429');
        polygon(g, [[cx - 13, 37], [cx - 10, 15], [cx, 4], [cx + 10, 15], [cx + 13, 37]], '#192f31');
        line(g, cx, 9, cx, 31, '#83a89e', 2);
        line(g, cx - 8, 20, cx + 8, 20, '#83a89e', 2);
        rect(g, cx - 44, 32, 88, 5, '#7b795d');
        rect(g, cx - 50, 42, 100, 5, '#273b37');
        pillar(g, 31, Math.max(70, H * .42), .95);
        pillar(g, W - 31, Math.max(70, H * .42), .95);
        pillar(g, 43, H * .93, .85);
        pillar(g, W - 43, H * .93, .85);
        root(g, [[0, H * .56], [14, H * .52], [26, H * .42], [44, H * .38], [60, H * .31]], 5);
        root(g, [[W, H * .61], [W - 21, H * .54], [W - 33, H * .44], [W - 53, H * .39], [W - 68, H * .30]], 5);
        root(g, [[0, H * .86], [23, H * .82], [50, H * .87], [88, H * .76]], 6);
        root(g, [[W, H * .9], [W - 20, H * .84], [W - 54, H * .85], [W - 82, H * .78]], 6);
        runestone(g, W * .2, H * .74, .85);
        runestone(g, W * .80, H * .74, .85);
        torch(g, cx - 54, 60, time);
        torch(g, cx + 54, 60, time);
        // A small rune circle grounds the *character preview* in the dungeon, not a HUD.
        g.strokeStyle = '#618e8866';
        g.lineWidth = 2;
        g.beginPath();
        g.ellipse(cx, cy + 18, 38, 13, 0, 0, Math.PI * 2);
        g.stroke();
        for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4;
            rect(g, cx + 32 * Math.cos(a) - 1, cy + 18 + 11 * Math.sin(a) - 1, 3, 3, '#80b9a1');
        }
        hero(g, cx, cy, time);
        for (let i = 0; i < embers.length; i++) {
            const e = embers[i];
            const y = (e.y - time * 6 * e.pace % 340 + 340) % 340;
            if (y < H)
                rect(g, e.x, y, e.s, e.s, i % 3 === 0 ? '#e9c582' : '#6d9e94');
        }
        const vignette = g.createRadialGradient(cx, H / 2, Math.min(W, H) * .15, cx, H / 2, Math.max(W, H) * .75);
        vignette.addColorStop(0, '#0000');
        vignette.addColorStop(1, '#000b');
        g.fillStyle = vignette;
        g.fillRect(0, 0, W, H);
    }
    function tick(ms) {
        if (document.hidden) {
            raf = 0;
            return;
        }
        if (ms - lastFrameMs >= 33) {
            lastFrameMs = ms;
            lastTime = ms / 1000;
            render(lastTime);
        }
        raf = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    if (!reduced.matches)
        raf = requestAnimationFrame(tick);
    window.addEventListener('orientationchange', resize, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) {
        if (raf)
            cancelAnimationFrame(raf);
        raf = 0;
    }
    else if (!raf && !reduced.matches) {
        raf = requestAnimationFrame(tick);
    }
    else
        resize(); });
    return { resize, getMetrics: () => metrics, stop: () => { observer.disconnect(); if (raf)
            cancelAnimationFrame(raf); } };
}
