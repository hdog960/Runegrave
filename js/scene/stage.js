/** v0.05: deterministic physical avatar in the artist-authored Rootvault sanctuary.
 * World geometry is camera-aware; decorative training projectiles are not damage mechanics.
 */
import { rngStream } from '../core/rng.js';
import { paintSanctuary, drawWayfarer } from './sanctuaryArt.js';
import { ZERO } from '../input/vector.js';
import { FixedStepClock } from '../physics/fixedStep.js';
import { makeRootvaultWorld, moveCircle, safeSpawn, isPositionFree, WALK_SPEED, HERO_RADIUS } from '../physics/world.js';
const WIDTH = 420;
/** The camera never renders behind either controller rail or any persistent HUD. */
export function stageMetrics(cssWidth, cssHeight, devicePixelRatio = 1) {
    if (!(cssWidth > 0 && cssHeight > 0) || !Number.isFinite(cssWidth + cssHeight))
        throw new RangeError('Stage requires a nonzero measurable center canvas');
    const dpr = Math.min(2.5, Math.max(1, devicePixelRatio));
    return { cssWidth, cssHeight, pixelWidth: Math.max(1, Math.round(cssWidth * dpr)), pixelHeight: Math.max(1, Math.round(cssHeight * dpr)), cameraWidth: WIDTH, cameraHeight: WIDTH * cssHeight / cssWidth };
}
function rect(g, x, y, w, h, color) { g.fillStyle = color; g.fillRect(x, y, w, h); }
export function mountStage(canvas, readInput = () => ({ move: ZERO, aim: ZERO, firing: false, paused: false })) {
    const parent = canvas.parentElement, g = canvas.getContext('2d', { alpha: false });
    if (!parent || !g)
        throw new Error('Runegrave requires a dedicated center-only canvas');
    const random = rngStream('runegrave-v0.04', 'visual-floor');
    const embers = Array.from({ length: 22 }, () => ({ x: random.next() * WIDTH, y: random.next() * 320, s: 1 + random.next() * 2, pace: .6 + random.next() * .8 }));
    const clock = new FixedStepClock();
    let raf = 0, lastTime = 0, lastFrameMs = -Infinity, paused = false, initialized = false, shotCooldown = 0;
    let walking = ZERO, firing = false, world;
    let actor = { x: WIDTH / 2, y: 120 };
    let lastAim = { x: 0, y: 1 };
    const bolts = [];
    let metrics;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function emitState() {
        canvas.dataset.actorX = actor.x.toFixed(2);
        canvas.dataset.actorY = actor.y.toFixed(2);
        canvas.dataset.boltCount = String(bolts.length);
        canvas.dataset.physicsTick = String(clock.ticks);
        canvas.dataset.hitboxRadius = String(HERO_RADIUS);
        canvas.dataset.safeSpawn = String(Boolean(world && isPositionFree(world, actor)));
    }
    function resize() {
        const bounds = parent.getBoundingClientRect();
        if (bounds.width < 1 || bounds.height < 1)
            return;
        const next = stageMetrics(bounds.width, bounds.height, window.devicePixelRatio || 1);
        // CSS can briefly report implausible dimensions during orientation changes. Avoid spawning into clipped geometry.
        if (next.cameraHeight < 148)
            return;
        metrics = next;
        world = makeRootvaultWorld(next.cameraWidth, next.cameraHeight);
        if (!initialized) {
            actor = safeSpawn(world);
            initialized = true;
        }
        else if (!isPositionFree(world, actor))
            actor = safeSpawn(world, actor);
        canvas.width = next.pixelWidth;
        canvas.height = next.pixelHeight;
        canvas.dataset.cameraWidth = next.cameraWidth.toFixed(2);
        canvas.dataset.cameraHeight = next.cameraHeight.toFixed(2);
        emitState();
        render(lastTime);
    }
    function render(time) {
        if (!metrics)
            return;
        const W = metrics.cameraWidth, H = metrics.cameraHeight;
        g.setTransform(metrics.pixelWidth / W, 0, 0, metrics.pixelHeight / H, 0, 0);
        paintSanctuary(g, W, H, time);
        for (const bolt of bolts) {
            g.globalAlpha = Math.max(.2, 1 - bolt.age / 1.3);
            g.fillStyle = '#b4d2c3';
            g.beginPath();
            g.arc(bolt.x, bolt.y, 4, 0, Math.PI * 2);
            g.fill();
            rect(g, bolt.x - 1, bolt.y - 1, 3, 3, '#f0e4ac');
            g.globalAlpha = 1;
        }
        drawWayfarer(g, actor.x, actor.y, time, walking.x, walking.y, lastAim.x, lastAim.y, firing);
        for (let i = 0; i < embers.length; i++) {
            const e = embers[i], y = (e.y - time * 6 * e.pace % 340 + 340) % 340;
            if (y < H)
                rect(g, e.x, y, e.s, e.s, i % 3 === 0 ? '#e9c582' : '#6d9e94');
        }
    }
    function update(dt) {
        if (paused || !world || !metrics)
            return;
        const input = readInput();
        if (input.paused)
            return;
        walking = input.move;
        firing = input.firing;
        actor = moveCircle(world, actor, { x: input.move.x * WALK_SPEED, y: input.move.y * WALK_SPEED }, dt, HERO_RADIUS);
        if (Math.hypot(input.aim.x, input.aim.y) > .04)
            lastAim = input.aim;
        shotCooldown = Math.max(0, shotCooldown - dt);
        if (input.firing && shotCooldown <= 0 && bolts.length < 24) {
            const len = Math.hypot(lastAim.x, lastAim.y) || 1, vx = lastAim.x / len, vy = lastAim.y / len;
            bolts.push({ x: actor.x + vx * 19, y: actor.y + vy * 19, vx: vx * 185, vy: vy * 185, age: 0 });
            shotCooldown = .18;
        }
        for (let i = bolts.length - 1; i >= 0; i--) {
            const b = bolts[i];
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.age += dt;
            if (b.age > 1.3 || b.x < 0 || b.y < 0 || b.x > metrics.cameraWidth || b.y > metrics.cameraHeight)
                bolts.splice(i, 1);
        }
        emitState();
    }
    function tick(ms) {
        if (document.hidden) {
            raf = 0;
            lastFrameMs = -Infinity;
            clock.reset();
            return;
        }
        const delta = lastFrameMs === -Infinity ? 0 : Math.min(.1, Math.max(0, (ms - lastFrameMs) / 1000));
        lastFrameMs = ms;
        if (!paused) {
            clock.advance(delta, dt => update(dt));
            if (ms - lastTime >= 1000 / 45) {
                lastTime = ms;
                render(reduced.matches ? 0 : ms / 1000);
            }
        }
        raf = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    raf = requestAnimationFrame(tick);
    const onOrientation = () => { clock.reset(); lastFrameMs = -Infinity; resize(); };
    const onVisibility = () => {
        clock.reset();
        lastFrameMs = -Infinity;
        if (document.hidden) {
            if (raf)
                cancelAnimationFrame(raf);
            raf = 0;
            walking = ZERO;
            firing = false;
        }
        else {
            resize();
            if (!raf)
                raf = requestAnimationFrame(tick);
        }
    };
    window.addEventListener('orientationchange', onOrientation, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return {
        resize, getMetrics: () => metrics, getActor: () => ({ ...actor, boltCount: bolts.length, physicsTick: clock.ticks }),
        setPaused: (value) => { paused = value; walking = ZERO; firing = false; clock.reset(); lastFrameMs = -Infinity; if (!value && raf === 0 && !document.hidden)
            raf = requestAnimationFrame(tick); },
        stop: () => { observer.disconnect(); window.removeEventListener('orientationchange', onOrientation); document.removeEventListener('visibilitychange', onVisibility); if (raf)
            cancelAnimationFrame(raf); }
    };
}
