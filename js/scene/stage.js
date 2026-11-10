/** v0.07: deterministic health/death/restart added to the Rootvault Soulbolt training.
 * Environmental ember glyphs are NOT enemies (enemy AI begins at v0.08).
 */
import { rngStream } from '../core/rng.js';
import { paintSanctuary, drawWayfarer } from './sanctuaryArt.js';
import { ZERO } from '../input/vector.js';
import { FixedStepClock } from '../physics/fixedStep.js';
import { makeRootvaultWorld, moveCircle, safeSpawn, isPositionFree, WALK_SPEED, HERO_RADIUS } from '../physics/world.js';
import { SoulboltCombat } from '../combat/soulbolts.js';
import { drawPracticeTargets, drawSoulbolts, drawCombatSparks } from '../combat/combatArt.js';
import { MortalHearts, heartSlots } from '../health/mortalHearts.js';
import { EmberTrial } from '../health/emberTrial.js';
import { drawEmberTrial } from '../health/healthArt.js';
const WIDTH = 420;
/** The camera never renders behind either controller rail or any persistent HUD. */
export function stageMetrics(cssWidth, cssHeight, devicePixelRatio = 1) {
    if (!(cssWidth > 0 && cssHeight > 0) || !Number.isFinite(cssWidth + cssHeight))
        throw new RangeError('Stage requires a nonzero measurable center canvas');
    const dpr = Math.min(2.5, Math.max(1, devicePixelRatio));
    return { cssWidth, cssHeight, pixelWidth: Math.max(1, Math.round(cssWidth * dpr)), pixelHeight: Math.max(1, Math.round(cssHeight * dpr)), cameraWidth: WIDTH, cameraHeight: WIDTH * cssHeight / cssWidth };
}
function rect(g, x, y, w, h, color) { g.fillStyle = color; g.fillRect(x, y, w, h); }
export function mountStage(canvas, readInput = () => ({ move: ZERO, aim: ZERO, firing: false, paused: false }), onDeath = () => { }) {
    const parent = canvas.parentElement, g = canvas.getContext('2d', { alpha: false });
    if (!parent || !g)
        throw new Error('Runegrave requires a dedicated center-only canvas');
    const random = rngStream('runegrave-v0.04', 'visual-floor');
    const embers = Array.from({ length: 22 }, () => ({ x: random.next() * WIDTH, y: random.next() * 320, s: 1 + random.next() * 2, pace: .6 + random.next() * .8 }));
    const clock = new FixedStepClock();
    let raf = 0, lastTime = 0, lastFrameMs = -Infinity, paused = false, initialized = false;
    let walking = ZERO, firing = false, world, combat, trial;
    const health = new MortalHearts();
    let dead = false, restarts = 0;
    const deathOverlay = document.querySelector('#death-overlay');
    const heartLine = document.querySelector('[data-heart-icons]');
    const heartReadout = document.querySelector('[data-heart-readout]');
    const deathCount = document.querySelector('[data-death-summary]');
    let actor = { x: WIDTH / 2, y: 120 };
    let lastAim = { x: 0, y: 1 };
    const sparks = [];
    const score = document.querySelector('[data-combat-score]');
    function attachCombat(nextWorld) {
        combat = new SoulboltCombat(nextWorld, actor);
        sparks.length = 0;
        combat.on('impact', e => {
            if (sparks.length >= 24)
                sparks.shift();
            sparks.push({ x: e.x, y: e.y, life: .3, maxLife: .3, kind: e.targetId ? 'impact' : 'wall' });
        });
        combat.on('break', e => {
            if (sparks.length >= 24)
                sparks.shift();
            sparks.push({ x: e.x, y: e.y, life: .65, maxLife: .65, kind: 'break' });
        });
    }
    let metrics;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function emitState() {
        canvas.dataset.actorX = actor.x.toFixed(2);
        canvas.dataset.actorY = actor.y.toFixed(2);
        const state = combat?.state;
        canvas.dataset.boltCount = String(state?.activeBolts || 0);
        canvas.dataset.physicsTick = String(clock.ticks);
        canvas.dataset.hitboxRadius = String(HERO_RADIUS);
        canvas.dataset.safeSpawn = String(Boolean(world && isPositionFree(world, actor)));
        canvas.dataset.shots = String(state?.shots || 0);
        canvas.dataset.hits = String(state?.hits || 0);
        canvas.dataset.shattered = String(state?.shattered || 0);
        canvas.dataset.liveTargets = String(state?.liveTargets || 0);
        if (score)
            score.textContent = `ᛉ ${state?.shattered || 0} SHATTERED`;
        const hs = health.state;
        canvas.dataset.heartUnits = String(hs.units);
        canvas.dataset.heartMax = String(hs.maxUnits);
        canvas.dataset.invulnerability = hs.grace.toFixed(4);
        canvas.dataset.dead = String(hs.dead);
        canvas.dataset.healthHits = String(hs.hits);
        canvas.dataset.healthHealed = String(hs.healed);
        canvas.dataset.hazardHits = String(trial?.state.contacts || 0);
        canvas.dataset.shrineReady = String(trial?.shrine.ready ?? false);
        canvas.dataset.restarts = String(restarts);
        if (heartLine) {
            heartLine.replaceChildren();
            for (const [i, slot] of heartSlots(hs.units, hs.maxUnits).entries()) {
                const el = document.createElement('span');
                el.className = `heart-icon mortal-${slot}`;
                el.textContent = slot === 'full' ? '♥' : slot === 'half' ? '◐' : '♡';
                el.setAttribute('aria-hidden', 'true');
                el.dataset.slot = String(i);
                heartLine.append(el);
            }
        }
        const description = `${(hs.units / 2).toFixed(hs.units % 2 ? 1 : 0)} / ${hs.containers} HEARTS`;
        if (heartReadout)
            heartReadout.textContent = hs.dead ? 'THREAD SEVERED' : description;
        if (heartLine)
            heartLine.setAttribute('aria-label', `Mortal Hearts ${description}`);
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
        // Rebuild training objects to fit the new, physically unobstructed room bounds.
        const previous = trial?.exportState();
        attachCombat(world);
        const movement = combat?.getMovementWorld() || world;
        if (!isPositionFree(movement, actor))
            actor = safeSpawn(movement, actor);
        trial = new EmberTrial(world, actor, combat?.targets || []);
        if (previous)
            trial.restoreState(previous);
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
        if (trial)
            drawEmberTrial(g, trial, time);
        if (combat) {
            drawPracticeTargets(g, combat.targets, time);
            drawSoulbolts(g, combat.bolts, time);
        }
        drawCombatSparks(g, sparks);
        // A subtle flicker is a shape-independent i-frame indicator; no HUD covers the playfield.
        if (health.state.grace === 0 || Math.floor(health.state.grace * 12) % 2 === 0)
            drawWayfarer(g, actor.x, actor.y, time, walking.x, walking.y, lastAim.x, lastAim.y, firing);
        for (let i = 0; i < embers.length; i++) {
            const e = embers[i], y = (e.y - time * 6 * e.pace % 340 + 340) % 340;
            if (y < H)
                rect(g, e.x, y, e.s, e.s, i % 3 === 0 ? '#e9c582' : '#6d9e94');
        }
    }
    function update(dt) {
        if (paused || dead || !world || !metrics)
            return;
        const input = readInput();
        if (input.paused)
            return;
        walking = input.move;
        firing = input.firing;
        const physicalWorld = combat?.getMovementWorld() || world;
        actor = moveCircle(physicalWorld, actor, { x: input.move.x * WALK_SPEED, y: input.move.y * WALK_SPEED }, dt, HERO_RADIUS);
        if (Math.hypot(input.aim.x, input.aim.y) > .04)
            lastAim = input.aim;
        combat?.update(dt, actor, lastAim, input.firing);
        health.step(dt);
        const outcome = trial?.step(dt, actor, health);
        if (outcome?.damage === 'dead') {
            dead = true;
            walking = ZERO;
            firing = false;
            if (deathOverlay)
                deathOverlay.hidden = false;
            if (deathCount)
                deathCount.textContent = `${health.state.hits} WOUNDS · ${combat?.state.shattered || 0} RUNESTONES SHATTERED`;
            // No further simulation when the thread breaks. The replacement menu is only
            // displayed after the simulation has genuinely stopped.
            onDeath();
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].life -= dt;
            if (sparks[i].life <= 0)
                sparks.splice(i, 1);
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
        if (!paused && !dead) {
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
        resize, getMetrics: () => metrics,
        getActor: () => ({ ...actor, boltCount: combat?.state.activeBolts || 0, physicsTick: clock.ticks, shattered: combat?.state.shattered || 0 }),
        getHealth: () => health.state,
        restart: () => {
            if (!world || !dead)
                return false;
            health.reset();
            dead = false;
            paused = false;
            restarts++;
            clock.reset();
            lastFrameMs = -Infinity;
            actor = safeSpawn(world);
            lastAim = { x: 0, y: 1 };
            walking = ZERO;
            firing = false;
            attachCombat(world);
            actor = safeSpawn(combat?.getMovementWorld() || world, actor);
            trial = new EmberTrial(world, actor, combat?.targets || []);
            if (deathOverlay)
                deathOverlay.hidden = true;
            emitState();
            render(lastTime);
            if (!raf && !document.hidden)
                raf = requestAnimationFrame(tick);
            return true;
        },
        setPaused: (value) => { if (dead)
            return; paused = value; walking = ZERO; firing = false; clock.reset(); lastFrameMs = -Infinity; if (!value && raf === 0 && !document.hidden)
            raf = requestAnimationFrame(tick); },
        stop: () => { observer.disconnect(); window.removeEventListener('orientationchange', onOrientation); document.removeEventListener('visibilitychange', onVisibility); if (raf)
            cancelAnimationFrame(raf); }
    };
}
