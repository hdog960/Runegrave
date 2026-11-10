import { ZERO, normalizeStick, combineDirections, clampVector } from './vector.js';
export const SETTINGS_KEY = 'runegrave:input:v1';
const DEFAULTS = { leftHanded: false, padScale: 100, padOffset: 0, deadZone: 0.15 };
export function sanitizeSettings(value) {
    if (typeof value !== 'object' || !value)
        return { ...DEFAULTS };
    const o = value;
    const clamp = (v, min, max, fallback) => typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
    return { leftHanded: o.leftHanded === true, padScale: clamp(o.padScale, 85, 110, 100), padOffset: clamp(o.padOffset, -9, 9, 0), deadZone: clamp(o.deadZone, .08, .30, .15) };
}
function loadSettings() { try {
    return sanitizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null'));
}
catch {
    return { ...DEFAULTS };
} }
function saveSettings(p) { try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(p));
}
catch { /* browser storage may be disabled */ } }
export class TwinStickControls {
    onPauseChange;
    prefs = loadSettings();
    held = new Set();
    pointers = new Map();
    vectors = { move: ZERO, aim: ZERO };
    paused = false;
    dead = false;
    startAt = performance.now();
    controls;
    pads;
    playStatus;
    pauseButton;
    overlay;
    deadZone;
    destroyed = false;
    stopListeners = [];
    constructor(onPauseChange = () => { }) {
        this.onPauseChange = onPauseChange;
        const get = (selector) => {
            const el = document.querySelector(selector);
            if (!el)
                throw new Error(`Missing input control ${selector}`);
            return el;
        };
        this.controls = { left: get('.grip-left'), right: get('.grip-right') };
        this.pads = { left: get('#move-rune-disc'), right: get('#aim-rune-disc') };
        this.playStatus = get('[data-run-status]');
        this.pauseButton = get('#pause-btn');
        this.overlay = get('#pause-overlay');
        this.deadZone = this.prefs.deadZone;
        for (const side of ['left', 'right']) {
            const pad = this.pads[side];
            this.listen(pad, 'pointerdown', event => this.down(side, event));
            this.listen(pad, 'pointermove', event => this.move(side, event));
            this.listen(pad, 'pointerup', event => this.end(event));
            this.listen(pad, 'pointercancel', event => this.end(event));
            this.listen(pad, 'lostpointercapture', event => this.end(event));
            this.listen(pad, 'contextmenu', event => event.preventDefault());
        }
        this.listen(window, 'keydown', event => this.keydown(event));
        this.listen(window, 'keyup', event => this.keyup(event));
        this.listen(window, 'blur', () => this.clearTransient());
        this.listen(window, 'pagehide', () => this.clearTransient());
        this.listen(document, 'visibilitychange', () => { if (document.hidden)
            this.clearTransient(); });
        this.listen(this.pauseButton, 'click', () => this.setPaused(!this.paused));
        this.listen(get('#resume-btn'), 'click', () => this.setPaused(false));
        const mirror = get('#handed-toggle');
        const scale = get('#pad-scale');
        const offset = get('#pad-offset');
        const deadZone = get('#dead-zone');
        mirror.checked = this.prefs.leftHanded;
        scale.value = String(this.prefs.padScale);
        offset.value = String(this.prefs.padOffset);
        deadZone.value = String(Math.round(this.prefs.deadZone * 100));
        this.listen(mirror, 'change', () => this.setPreferences({ leftHanded: mirror.checked }));
        this.listen(scale, 'input', () => this.setPreferences({ padScale: Number(scale.value) }));
        this.listen(offset, 'input', () => this.setPreferences({ padOffset: Number(offset.value) }));
        this.listen(deadZone, 'input', () => this.setPreferences({ deadZone: Number(deadZone.value) / 100 }));
        this.applyPreferences();
        this.refreshStatus();
    }
    listen(el, name, handler) { el.addEventListener(name, handler); this.stopListeners.push(() => el.removeEventListener(name, handler)); }
    roleFor(side) {
        return (side === 'left') !== this.prefs.leftHanded ? 'move' : 'aim';
    }
    down(side, event) {
        if (this.destroyed || this.paused || this.dead || !event.isPrimary && event.pointerType === 'mouse')
            return;
        const role = this.roleFor(side);
        if ([...this.pointers.values()].some(p => p.role === role) || this.pointers.has(event.pointerId))
            return;
        event.preventDefault();
        const pad = this.pads[side];
        try {
            pad.setPointerCapture(event.pointerId);
        }
        catch { /* synthetic browser tests need not own real hardware capture */ }
        this.pointers.set(event.pointerId, { side, role });
        this.updateVector(side, role, event);
        pad.dataset.held = 'true';
        this.refreshStatus();
    }
    move(side, event) {
        const owner = this.pointers.get(event.pointerId);
        if (!owner || owner.side !== side)
            return;
        event.preventDefault();
        this.updateVector(side, owner.role, event);
        this.refreshStatus();
    }
    updateVector(side, role, event) {
        const b = this.pads[side].getBoundingClientRect();
        const radius = Math.min(b.width, b.height) * .42;
        const v = normalizeStick(event.clientX - b.left - b.width / 2, event.clientY - b.top - b.height / 2, radius, this.deadZone);
        this.vectors[role] = v;
        this.pads[side].style.setProperty('--stick-x', `${v.x * 22}%`);
        this.pads[side].style.setProperty('--stick-y', `${v.y * 22}%`);
    }
    end(event) {
        const owner = this.pointers.get(event.pointerId);
        if (!owner)
            return;
        this.pointers.delete(event.pointerId);
        this.vectors[owner.role] = ZERO;
        const pad = this.pads[owner.side];
        pad.dataset.held = 'false';
        pad.style.setProperty('--stick-x', '0%');
        pad.style.setProperty('--stick-y', '0%');
        this.refreshStatus();
    }
    keydown(event) {
        const key = event.key.toLowerCase();
        if (this.dead)
            return;
        if (key === 'escape' || key === 'p') {
            if (event.repeat)
                return;
            event.preventDefault();
            this.setPaused(!this.paused);
            return;
        }
        const el = event.target;
        if (el?.matches('input,select,textarea,button'))
            return;
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'i', 'j', 'k', 'l'].includes(key)) {
            event.preventDefault();
            this.held.add(key);
            this.refreshStatus();
        }
    }
    keyup(event) { const key = event.key.toLowerCase(); if (this.held.delete(key))
        this.refreshStatus(); }
    clearTransient() {
        this.held.clear();
        this.pointers.clear();
        this.vectors = { move: ZERO, aim: ZERO };
        for (const pad of Object.values(this.pads)) {
            pad.dataset.held = 'false';
            pad.style.setProperty('--stick-x', '0%');
            pad.style.setProperty('--stick-y', '0%');
        }
        this.refreshStatus();
    }
    get snapshot() {
        if (this.paused || this.dead)
            return { move: ZERO, aim: ZERO, firing: false, paused: true };
        const keyMove = combineDirections(this.held, ['w', 'arrowup'], ['s', 'arrowdown'], ['a', 'arrowleft'], ['d', 'arrowright']);
        const keyAim = combineDirections(this.held, ['i'], ['k'], ['j'], ['l']);
        const move = clampVector(this.vectors.move.x + keyMove.x, this.vectors.move.y + keyMove.y);
        const aim = clampVector(this.vectors.aim.x + keyAim.x, this.vectors.aim.y + keyAim.y);
        const firing = Math.hypot(aim.x, aim.y) > .04 || this.held.has(' ');
        return { move, aim, firing, paused: false };
    }
    setPaused(value) {
        if (this.destroyed || this.dead)
            return;
        const changed = this.paused !== value;
        this.paused = value;
        this.clearTransient();
        this.overlay.hidden = !value;
        this.pauseButton.setAttribute('aria-pressed', String(value));
        this.pauseButton.textContent = value ? 'ᛏ RESUME' : 'ᛏ PAUSE';
        document.documentElement.dataset.paused = String(value);
        if (changed)
            this.onPauseChange(value);
    }
    setDead(value) {
        if (this.destroyed)
            return;
        this.dead = value;
        this.paused = false;
        this.overlay.hidden = true;
        this.clearTransient();
        this.pauseButton.disabled = value;
        this.pauseButton.textContent = value ? 'ᛉ FALLEN' : 'ᛏ PAUSE';
        this.pauseButton.setAttribute('aria-pressed', 'false');
        document.documentElement.dataset.dead = String(value);
        document.documentElement.dataset.paused = 'false';
        this.refreshStatus();
    }
    setPreferences(input) {
        this.prefs = sanitizeSettings({ ...this.prefs, ...input });
        this.deadZone = this.prefs.deadZone;
        this.clearTransient();
        this.applyPreferences();
        saveSettings(this.prefs);
    }
    applyPreferences() {
        for (const side of ['left', 'right']) {
            const role = this.roleFor(side), pad = this.pads[side];
            const label = pad.querySelector('.disc-label');
            if (label)
                label.textContent = role === 'move' ? 'MOVE' : 'AIM / FIRE';
            pad.setAttribute('aria-label', role === 'move' ? 'Movement rune thumb disc' : 'Aim and continuous-fire rune thumb disc');
            pad.dataset.role = role;
            pad.style.setProperty('--pad-scale', String(this.prefs.padScale / 100));
            pad.style.setProperty('--pad-offset', `${this.prefs.padOffset}px`);
        }
        document.documentElement.dataset.handed = this.prefs.leftHanded ? 'left' : 'standard';
    }
    refreshStatus() {
        const s = this.snapshot;
        this.playStatus.textContent = this.dead ? 'THREAD SEVERED · RESTART' : s.paused ? 'PAUSED · INPUT RELEASED' : s.firing ? 'SOULBOLT INPUT · ACTIVE' : Math.hypot(s.move.x, s.move.y) > .05 ? 'MOVEMENT INPUT · ACTIVE' : 'INPUT TRAINING · NO ENEMIES';
    }
    destroy() { this.destroyed = true; this.clearTransient(); for (const stop of this.stopListeners)
        stop(); this.stopListeners = []; }
}
