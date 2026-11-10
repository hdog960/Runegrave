/** RUNEGRAVE v0.06 — deterministic first combat foundation.
 * The rune effigies/urns are non-hostile training destructibles, NOT distinct enemies.
 * Projectile lifetime, hit ordering, target damage and knockback advance exclusively
 * on fixed simulation steps. No DOM or browser time appears in this module.
 */
import { isPositionFree, moveCircle, overlapsSolid } from '../physics/world.js';
export const SOULBOLT_STATS = Object.freeze({ damage: 2, cooldown: 0.20, speed: 258, range: 274, radius: 3, knockback: 10 });
export const MAX_BOLTS = 48;
const COMBAT_EPS = 1e-8;
/** Avoid spawning urns behind solid scenery or on top of the hero. */
export function makeTrainingTargets(world, hero) {
    const candidates = [
        { id: 'ash-ward-left', kind: 'effigy', x: world.width * .30, y: world.height * .48, radius: 12, hp: 6 },
        { id: 'ash-ward-right', kind: 'effigy', x: world.width * .70, y: world.height * .49, radius: 12, hp: 6 },
        { id: 'oath-urn', kind: 'urn', x: world.width * .48, y: world.height * .77, radius: 10, hp: 4 }
    ];
    return candidates.map((def, i) => {
        let found;
        // Search a deterministic small ring if the decorative geometry changes with camera height.
        for (let ring = 0; ring <= 12 && !found; ring++) {
            for (let step = 0; step < (ring === 0 ? 1 : 16); step++) {
                const a = step * Math.PI / 8;
                const p = { x: def.x + Math.cos(a) * ring * 6, y: def.y + Math.sin(a) * ring * 6 };
                const away = Math.hypot(p.x - hero.x, p.y - hero.y) > def.radius + 24;
                const awayFromOthers = i === 0 || candidates.slice(0, i).every(c => Math.hypot(p.x - c.x, p.y - c.y) > def.radius + c.radius + 15);
                if (away && awayFromOthers && isPositionFree(world, p, def.radius + 4)) {
                    found = p;
                    break;
                }
            }
        }
        if (!found)
            throw new Error('No safe training-target placement at current camera geometry');
        return { id: def.id, kind: def.kind, x: found.x, y: found.y, radius: def.radius, hp: def.hp, maxHp: def.hp, alive: true, respawn: 0, flash: 0 };
    });
}
/** Fixed-capacity object pool: projectile slots are reused instead of allocated per shot. */
export class SoulboltCombat {
    world;
    bolts = Array.from({ length: MAX_BOLTS }, () => ({ id: 0, active: false, x: 0, y: 0, dx: 0, dy: 0, travel: 0, damage: 0 }));
    targets;
    nextBulletId = 1;
    cooldown = 0;
    shots = 0;
    hits = 0;
    shattered = 0;
    listeners = new Map();
    emitting = false;
    constructor(world, hero) {
        this.world = world;
        this.targets = makeTrainingTargets(world, hero);
    }
    on(type, listener) {
        let set = this.listeners.get(type);
        if (!set) {
            set = new Set();
            this.listeners.set(type, set);
        }
        const handler = listener;
        set.add(handler);
        return () => set?.delete(handler);
    }
    emit(e) {
        if (this.emitting)
            throw new Error('Reentrant combat events are forbidden');
        this.emitting = true;
        try {
            for (const cb of this.listeners.get(e.type) || [])
                cb(e);
        }
        finally {
            this.emitting = false;
        }
    }
    get state() { return { shots: this.shots, hits: this.hits, shattered: this.shattered, activeBolts: this.bolts.filter(b => b.active).length, liveTargets: this.targets.filter(t => t.alive).length, pooledSlots: MAX_BOLTS }; }
    /** Dynamic scenery is solid to the hero, but removed immediately on destruction. */
    getMovementWorld() {
        const extras = this.targets.filter(t => t.alive).map(t => ({ id: `training-${t.id}`, kind: 'circle', x: t.x, y: t.y, radius: t.radius }));
        return { ...this.world, solids: [...this.world.solids, ...extras] };
    }
    fire(origin, aim) {
        if (this.cooldown > COMBAT_EPS || !Number.isFinite(aim.x + aim.y))
            return false;
        const magnitude = Math.hypot(aim.x, aim.y);
        if (magnitude <= .04)
            return false;
        const dx = aim.x / magnitude, dy = aim.y / magnitude;
        const slot = this.bolts.find(b => !b.active);
        if (!slot)
            return false;
        const p = { x: origin.x + dx * 13, y: origin.y + dy * 13 };
        if (!isPositionFree(this.world, p, SOULBOLT_STATS.radius))
            return false;
        slot.active = true;
        slot.id = this.nextBulletId++;
        slot.x = p.x;
        slot.y = p.y;
        slot.dx = dx;
        slot.dy = dy;
        slot.travel = 0;
        slot.damage = SOULBOLT_STATS.damage;
        this.cooldown = SOULBOLT_STATS.cooldown;
        this.shots++;
        this.emit({ type: 'shot', bulletId: slot.id, x: p.x, y: p.y });
        return true;
    }
    /** Small deterministic movement slices prevent high-velocity tunneling through thin obstacles. */
    stepBullet(b, dt) {
        let remaining = Math.min(SOULBOLT_STATS.speed * dt, Math.max(0, SOULBOLT_STATS.range - b.travel));
        while (remaining > COMBAT_EPS && b.active) {
            const advance = Math.min(2.5, remaining);
            const x = b.x + b.dx * advance, y = b.y + b.dy * advance;
            remaining -= advance;
            b.travel += advance;
            if (x < this.world.minX || x > this.world.maxX || y < this.world.minY || y > this.world.maxY) {
                b.active = false;
                this.emit({ type: 'expire', bulletId: b.id, reason: 'boundary' });
                break;
            }
            const p = { x, y };
            if (this.world.solids.some(s => overlapsSolid(p, SOULBOLT_STATS.radius, s))) {
                b.active = false;
                this.emit({ type: 'impact', bulletId: b.id, x, y, targetId: null, damage: 0 });
                this.emit({ type: 'expire', bulletId: b.id, reason: 'wall' });
                break;
            }
            const victim = this.targets.find(t => t.alive && Math.hypot(x - t.x, y - t.y) <= t.radius + SOULBOLT_STATS.radius);
            if (victim) {
                b.active = false;
                victim.hp = Math.max(0, victim.hp - b.damage);
                victim.flash = .18;
                this.hits++;
                this.emit({ type: 'impact', bulletId: b.id, x, y, targetId: victim.id, damage: b.damage });
                const knockX = b.dx * SOULBOLT_STATS.knockback, knockY = b.dy * SOULBOLT_STATS.knockback;
                // The target slides only where world geometry and other live objects permit.
                const moved = moveCircle(this.world, { x: victim.x, y: victim.y }, { x: knockX / dt, y: knockY / dt }, dt, victim.radius);
                if (isPositionFree(this.world, moved, victim.radius)) {
                    victim.x = moved.x;
                    victim.y = moved.y;
                }
                if (victim.hp === 0) {
                    victim.alive = false;
                    victim.respawn = 8;
                    this.shattered++;
                    this.emit({ type: 'break', targetId: victim.id, x: victim.x, y: victim.y, kind: victim.kind });
                }
                break;
            }
            b.x = x;
            b.y = y;
        }
        if (b.active && b.travel >= SOULBOLT_STATS.range - COMBAT_EPS) {
            b.active = false;
            this.emit({ type: 'expire', bulletId: b.id, reason: 'range' });
        }
    }
    update(dt, origin, aim, firing) {
        if (!Number.isFinite(dt) || dt <= 0 || dt > 1 / 30)
            throw new RangeError('Combat must be stepped with a bounded fixed tick');
        this.cooldown = Math.max(0, this.cooldown - dt);
        for (const t of this.targets) {
            t.flash = Math.max(0, t.flash - dt);
            if (!t.alive) {
                t.respawn = Math.max(0, t.respawn - dt);
                if (t.respawn <= COMBAT_EPS && Math.hypot(t.x - origin.x, t.y - origin.y) > t.radius + 22 && isPositionFree(this.world, { x: t.x, y: t.y }, t.radius + 4)) {
                    t.alive = true;
                    t.hp = t.maxHp;
                }
            }
        }
        if (firing)
            this.fire(origin, aim);
        for (const b of this.bolts)
            if (b.active)
                this.stepBullet(b, dt);
    }
}
