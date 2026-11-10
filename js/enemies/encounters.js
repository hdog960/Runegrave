/** v0.08 — deterministic two-wave hostile room and first genuine boss.
 * All attack warnings precede damage; simulation uses fixed ticks, never wall time.
 * The compact central viewport is the complete arena: no concealed offscreen attacks.
 */
import { HERO_RADIUS, isPositionFree, moveCircle, safeSpawn } from '../physics/world.js';
export const ENEMY_KINDS = ['draugr', 'wisp', 'archer', 'charger', 'sentinel', 'shade'];
const EPS = 1e-8;
const DT_LIMIT = 1 / 30;
const MAG = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const norm = (dx, dy) => { const m = Math.hypot(dx, dy); return m < EPS ? { x: 0, y: 1 } : { x: dx / m, y: dy / m }; };
const ENEMY_HP = { draugr: 6, wisp: 4, archer: 4, charger: 7, sentinel: 8, shade: 5, warden: 28 };
const ENEMY_RADII = { draugr: 9, wisp: 8, archer: 8, charger: 10, sentinel: 11, shade: 8, warden: 18 };
const ENEMY_SPEED = { draugr: 33, wisp: 42, archer: 28, charger: 0, sentinel: 0, shade: 0, warden: 22 };
/** Search a reproducible legal, readable on-camera point. Reject invalid placements. */
export function findEnemySpawn(world, preferred, radius, hero, others) {
    const start = { x: Math.max(world.minX + radius + 3, Math.min(world.maxX - radius - 3, preferred.x)), y: Math.max(world.minY + radius + 3, Math.min(world.maxY - radius - 3, preferred.y)) };
    for (let ring = 0; ring < 36; ring++)
        for (let dir = 0; dir < (ring === 0 ? 1 : 24); dir++) {
            const theta = dir * Math.PI / 12;
            const p = { x: start.x + Math.cos(theta) * ring * 5, y: start.y + Math.sin(theta) * ring * 5 };
            if (!isPositionFree(world, p, radius + 2) || MAG(p, hero) < radius + HERO_RADIUS + 27)
                continue;
            if (others.some(o => o.alive && MAG(o, p) < o.radius + radius + 11))
                continue;
            return p;
        }
    throw new Error('No unobstructed enemy spawn in current camera');
}
/** Reachability-validated grid for east gates; an unconnected pocket is not a legal exit. */
export function reachableFloor(world, from, radius = HERO_RADIUS) {
    const step = 5, x0 = world.minX + radius, y0 = world.minY + radius;
    const nx = Math.floor((world.maxX - radius - x0) / step) + 1;
    const ny = Math.floor((world.maxY - radius - y0) / step) + 1;
    const point = (ix, iy) => ({ x: x0 + ix * step, y: y0 + iy * step });
    const valid = (ix, iy) => ix >= 0 && iy >= 0 && ix < nx && iy < ny && isPositionFree(world, point(ix, iy), radius);
    const ix0 = Math.round((from.x - x0) / step), iy0 = Math.round((from.y - y0) / step);
    let seed;
    for (let range = 0; range < 9 && seed === undefined; range++)
        for (let dy = -range; dy <= range; dy++)
            for (let dx = -range; dx <= range; dx++)
                if (valid(ix0 + dx, iy0 + dy)) {
                    seed = (iy0 + dy) * nx + ix0 + dx;
                    break;
                }
    if (seed === undefined)
        throw new Error('Room has no reachable entry grid');
    const visited = new Uint8Array(nx * ny), queue = [seed], found = [];
    visited[seed] = 1;
    for (let head = 0; head < queue.length; head++) {
        const k = queue[head], ix = k % nx, iy = Math.floor(k / nx), a = point(ix, iy);
        found.push(a);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const xx = ix + dx, yy = iy + dy, n = yy * nx + xx;
            if (!valid(xx, yy) || visited[n])
                continue;
            // Mid-edge clearance is essential: diagonal/capsule contacts must not divide a passable cell.
            const b = point(xx, yy), mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            if (!isPositionFree(world, mid, radius))
                continue;
            visited[n] = 1;
            queue.push(n);
        }
    }
    return found;
}
/** A route of collision-free grid waypoints, used by room-validation tests and tooling. */
export function walkableRoute(world, from, to, radius = HERO_RADIUS) {
    const step = 5, x0 = world.minX + radius, y0 = world.minY + radius;
    const nx = Math.floor((world.maxX - radius - x0) / step) + 1, ny = Math.floor((world.maxY - radius - y0) / step) + 1;
    const point = (index) => ({ x: x0 + (index % nx) * step, y: y0 + Math.floor(index / nx) * step });
    const valid = (x, y) => x >= 0 && y >= 0 && x < nx && y < ny && isPositionFree(world, { x: x0 + x * step, y: y0 + y * step }, radius);
    const nearest = (pos) => {
        const ix = Math.round((pos.x - x0) / step), iy = Math.round((pos.y - y0) / step);
        for (let r = 0; r < 10; r++)
            for (let dy = -r; dy <= r; dy++)
                for (let dx = -r; dx <= r; dx++)
                    if (valid(ix + dx, iy + dy))
                        return (iy + dy) * nx + ix + dx;
        return -1;
    };
    const start = nearest(from), end = nearest(to);
    if (start < 0 || end < 0)
        return [];
    const prev = new Int32Array(nx * ny).fill(-1), queue = [start];
    prev[start] = start;
    for (let head = 0; head < queue.length; head++) {
        const k = queue[head];
        if (k === end)
            break;
        const ix = k % nx, iy = Math.floor(k / nx), a = point(k);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const x = ix + dx, y = iy + dy, n = y * nx + x;
            if (!valid(x, y) || prev[n] !== -1)
                continue;
            const b = point(n);
            if (!isPositionFree(world, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, radius))
                continue;
            prev[n] = k;
            queue.push(n);
        }
    }
    if (prev[end] === -1)
        return [];
    const steps = [];
    for (let k = end; k !== start; k = prev[k])
        steps.push(point(k));
    steps.push(point(start));
    steps.reverse();
    return steps;
}
export function placeRoomExit(world) {
    const entry = safeSpawn(world, { x: world.width * .27, y: world.minY + 24 });
    const candidates = reachableFloor(world, entry).filter(p => p.x > world.width * .55);
    if (!candidates.length)
        throw new Error('No connected east exit in combat camera');
    candidates.sort((a, b) => {
        // Prefer the furthest east reachable spot, then upper corridor for predictable readability.
        const sa = a.x - Math.abs(a.y - (world.minY + 24)) * .16;
        const sb = b.x - Math.abs(b.y - (world.minY + 24)) * .16;
        return sb - sa || a.y - b.y;
    });
    return candidates[0];
}
function enemyOf(id, kind, p) { return { id, kind, ...p, radius: ENEMY_RADII[kind], hp: ENEMY_HP[kind], maxHp: ENEMY_HP[kind], alive: true, flash: 0, cooldown: 1.1, windup: 0, state: 'idle', dx: 0, dy: 1, time: 0, phase: 1, attackCount: 0 }; }
export class HostileEncounter {
    world;
    enemies = [];
    projectiles = [];
    exit;
    room;
    state = 'locked';
    wave = 0;
    kills = 0;
    shots = 0;
    lastId = 0;
    bossDefeated = false;
    spawn;
    constructor(world, room, hero) {
        this.world = world;
        this.room = room;
        this.spawn = hero ? { ...hero } : safeSpawn(world, { x: world.width * .27, y: world.minY + 24 });
        this.exit = placeRoomExit(world);
        if (room === 'warden') {
            const p = findEnemySpawn(world, { x: world.width * .74, y: world.minY + (world.maxY - world.minY) * .56 }, ENEMY_RADII.warden, this.spawn, []);
            this.enemies.push(enemyOf('rootbound-warden', 'warden', p));
            this.wave = 1;
        }
        else
            this.spawnWave(1);
    }
    /** Reflow live enemies on an orientation/viewport change without restoring HP or waves. */
    reframe(world) {
        const previous = this.world;
        this.world = world;
        this.spawn = safeSpawn(world, { x: this.spawn.x * world.width / previous.width, y: this.spawn.y * world.height / previous.height });
        this.exit = placeRoomExit(world);
        const settled = [];
        for (const enemy of this.enemies) {
            if (!enemy.alive)
                continue;
            const p = findEnemySpawn(world, { x: enemy.x * world.width / previous.width, y: enemy.y * world.height / previous.height }, enemy.radius, this.spawn, settled);
            enemy.x = p.x;
            enemy.y = p.y;
            settled.push(enemy);
        }
        // Never preserve unseen, off-camera hostile projectiles across camera changes.
        this.projectiles.length = 0;
    }
    get snapshot() { return { room: this.room, phase: this.state, wave: this.wave, kills: this.kills, bossDefeated: this.bossDefeated, bossPhase: this.enemies.find(e => e.kind === 'warden')?.phase || 0, enemies: this.enemies, projectiles: this.projectiles, shots: this.shots }; }
    spawnWave(wave) {
        this.wave = wave;
        const kinds = wave === 1 ? ['draugr', 'wisp', 'archer'] : ['charger', 'sentinel', 'shade'];
        const fractions = [.36, .61, .79];
        for (const [i, kind] of kinds.entries()) {
            const preferred = { x: this.world.width * fractions[i], y: this.world.minY + (this.world.maxY - this.world.minY) * (i === 1 ? .71 : .32) };
            const p = findEnemySpawn(this.world, preferred, ENEMY_RADII[kind], this.spawn, this.enemies);
            this.enemies.push(enemyOf(`${kind}-${wave}`, kind, p));
        }
    }
    /** A path is calculated from the current player, not from an ungrounded room marker. */
    pathToExit(hero) { return walkableRoute(this.world, hero, this.exit); }
    /** Hero Soulbolts apply real damage via the shared v0.06 projectile pipeline. */
    hitAt(p, boltRadius, damage, impactDirection) {
        if (this.state !== 'locked')
            return null;
        for (const e of this.enemies) {
            if (!e.alive || e.state === 'hidden' || MAG(e, p) > e.radius + boltRadius)
                continue;
            e.hp = Math.max(0, e.hp - damage);
            e.flash = .14;
            if (e.kind === 'warden' && e.hp <= e.maxHp / 2 && e.phase === 1) {
                e.phase = 2;
                e.cooldown = .35;
            }
            if (e.hp === 0) {
                e.alive = false;
                this.kills++;
                if (e.kind === 'warden') {
                    this.bossDefeated = true;
                    this.projectiles.length = 0;
                    this.state = 'gate';
                }
            }
            else if (e.kind !== 'warden' && e.kind !== 'sentinel') {
                const pushed = moveCircle(this.world, { x: e.x, y: e.y }, { x: impactDirection.x * 75, y: impactDirection.y * 75 }, .065, e.radius);
                if (isPositionFree(this.world, pushed, e.radius)) {
                    e.x = pushed.x;
                    e.y = pushed.y;
                }
            }
            return e.id;
        }
        return null;
    }
    move(e, dir, speed, dt) {
        const p = moveCircle(this.world, e, { x: dir.x * speed, y: dir.y * speed }, dt, e.radius);
        if (isPositionFree(this.world, p, e.radius)) {
            e.x = p.x;
            e.y = p.y;
        }
    }
    shoot(e, direction, speed = 115, damage = 1) {
        if (this.projectiles.length >= 90)
            return;
        const dir = norm(direction.x, direction.y);
        const origin = { x: e.x + dir.x * (e.radius + 5), y: e.y + dir.y * (e.radius + 5) };
        if (!isPositionFree(this.world, origin, 3))
            return;
        this.projectiles.push({ id: ++this.lastId, x: origin.x, y: origin.y, dx: dir.x, dy: dir.y, speed, radius: 3.4, damage, life: 2.8 });
        this.shots++;
        e.attackCount++;
    }
    aim(e, hero) { return norm(hero.x - e.x, hero.y - e.y); }
    /** Simulate one fixed tick. Damage is never applied in telegraph state. */
    step(dt, hero, health) {
        if (!Number.isFinite(dt) || dt <= 0 || dt > DT_LIMIT)
            throw new RangeError('Hostile simulation requires bounded fixed steps');
        if (health.state.dead || this.state !== 'locked')
            return;
        for (const e of this.enemies) {
            if (!e.alive)
                continue;
            e.time += dt;
            e.flash = Math.max(0, e.flash - dt);
            e.cooldown = Math.max(0, e.cooldown - dt);
            const distance = MAG(e, hero), toward = this.aim(e, hero);
            if (e.kind === 'draugr') {
                this.move(e, toward, ENEMY_SPEED.draugr, dt);
            }
            else if (e.kind === 'wisp') {
                const tangent = { x: -toward.y, y: toward.x };
                const dir = norm(tangent.x * .77 + toward.x * (distance > 78 ? .46 : distance < 52 ? -.55 : 0), tangent.y * .77 + toward.y * (distance > 78 ? .46 : distance < 52 ? -.55 : 0));
                this.move(e, dir, ENEMY_SPEED.wisp, dt);
                if (e.state === 'idle' && e.cooldown === 0) {
                    e.state = 'warning';
                    e.windup = .52;
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        this.shoot(e, toward, 100);
                        e.state = 'idle';
                        e.cooldown = 2.1;
                    }
                }
            }
            else if (e.kind === 'archer') {
                if (e.state === 'idle' && e.cooldown === 0) {
                    e.state = 'warning';
                    e.windup = .70;
                    e.dx = toward.x;
                    e.dy = toward.y;
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        this.shoot(e, { x: e.dx, y: e.dy }, 155);
                        e.state = 'idle';
                        e.cooldown = 1.6;
                    }
                }
                else if (distance < 86)
                    this.move(e, { x: -toward.x, y: -toward.y }, ENEMY_SPEED.archer, dt);
            }
            else if (e.kind === 'charger') {
                if (e.state === 'idle') {
                    if (e.cooldown === 0) {
                        e.state = 'warning';
                        e.windup = .8;
                        e.dx = toward.x;
                        e.dy = toward.y;
                    }
                    else
                        this.move(e, toward, 22, dt);
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'charge';
                        e.windup = .38;
                    }
                }
                else if (e.state === 'charge') {
                    this.move(e, { x: e.dx, y: e.dy }, 160, dt);
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'recover';
                        e.windup = .65;
                    }
                }
                else if (e.state === 'recover') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'idle';
                        e.cooldown = 1.0;
                    }
                }
            }
            else if (e.kind === 'sentinel') {
                if (e.state === 'idle' && e.cooldown === 0) {
                    e.state = 'warning';
                    e.windup = .90;
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        for (let a = 0; a < 6; a++) {
                            const theta = (a + e.attackCount * .10) * Math.PI / 3;
                            this.shoot(e, { x: Math.cos(theta), y: Math.sin(theta) }, 90);
                        }
                        e.state = 'idle';
                        e.cooldown = 2.7;
                    }
                }
            }
            else if (e.kind === 'shade') {
                if (e.state === 'idle' && e.cooldown === 0) {
                    e.state = 'warning';
                    e.windup = .65;
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'hidden';
                        e.windup = .40;
                    }
                }
                else if (e.state === 'hidden') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        const p = findEnemySpawn(this.world, { x: hero.x + 38, y: hero.y + 18 }, e.radius, hero, []);
                        e.x = p.x;
                        e.y = p.y;
                        e.state = 'recover';
                        e.windup = .32;
                    }
                }
                else if (e.state === 'recover') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'idle';
                        e.cooldown = 2.1;
                    }
                }
            }
            else if (e.kind === 'warden') {
                if (e.state === 'idle') {
                    if (distance > 58)
                        this.move(e, toward, ENEMY_SPEED.warden + (e.phase === 2 ? 13 : 0), dt);
                    if (e.cooldown === 0) {
                        e.state = 'warning';
                        e.windup = e.phase === 2 ? .66 : 1.05;
                        e.dx = toward.x;
                        e.dy = toward.y;
                    }
                }
                else if (e.state === 'warning') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        const base = Math.atan2(e.dy, e.dx);
                        for (const angle of [-.36, -.18, 0, .18, .36])
                            this.shoot(e, { x: Math.cos(base + angle), y: Math.sin(base + angle) }, e.phase === 2 ? 145 : 115, e.phase === 2 ? 2 : 1);
                        if (e.phase === 2)
                            for (const angle of [Math.PI / 2, -Math.PI / 2])
                                this.shoot(e, { x: Math.cos(base + angle), y: Math.sin(base + angle) }, 100);
                        e.state = 'recover';
                        e.windup = e.phase === 2 ? .28 : .48;
                    }
                }
                else if (e.state === 'recover') {
                    e.windup -= dt;
                    if (e.windup <= 0) {
                        e.state = 'idle';
                        e.cooldown = e.phase === 2 ? .75 : 1.3;
                    }
                }
            }
            if (e.state !== 'hidden' && MAG(e, hero) < e.radius + HERO_RADIUS - 2) {
                health.hurt(e.kind === 'warden' ? 2 : 1, `enemy:${e.kind}`);
            }
            if (health.state.dead)
                return;
        }
        // Sweep each hostile projectile in small slices to prevent tunneling or hidden hits.
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const b = this.projectiles[i];
            b.life -= dt;
            let exhausted = b.life <= 0;
            const travel = b.speed * dt, steps = Math.ceil(travel / 2.5);
            for (let j = 0; j < steps && !exhausted; j++) {
                const next = { x: b.x + b.dx * travel / steps, y: b.y + b.dy * travel / steps };
                if (!isPositionFree(this.world, next, b.radius)) {
                    exhausted = true;
                    break;
                }
                b.x = next.x;
                b.y = next.y;
                if (MAG(b, hero) <= b.radius + HERO_RADIUS - 1) {
                    health.hurt(b.damage, `soulshot:${this.room}`);
                    exhausted = true;
                    break;
                }
            }
            if (exhausted)
                this.projectiles.splice(i, 1);
        }
        if (health.state.dead)
            return;
        if (this.room === 'crypt' && this.enemies.every(e => !e.alive)) {
            if (this.wave === 1) {
                this.projectiles.length = 0;
                this.spawnWave(2);
            }
            else {
                this.state = 'gate';
                this.projectiles.length = 0;
            }
        }
    }
    /** Doorway accepts movement only when every required enemy is defeated. */
    canLeave(hero) { return this.state === 'gate' && MAG(hero, this.exit) < 19; }
}
