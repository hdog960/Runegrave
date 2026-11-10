/** Rendering cadence cannot influence the simulation. Standard accumulator; no wall-clock in physics. */
export const FIXED_DT = 1 / 120;
export const MAX_CATCH_UP_STEPS = 12;
export const MAX_FRAME_SECONDS = 0.1;
export class FixedStepClock {
    accumulator = 0;
    steps = 0;
    advance(frameSeconds, step) {
        if (!Number.isFinite(frameSeconds) || frameSeconds < 0)
            throw new RangeError('Invalid frame seconds');
        // Never replay an entire background interval as a burst of damage or movement.
        this.accumulator += Math.min(frameSeconds, MAX_FRAME_SECONDS);
        let executed = 0;
        while (this.accumulator + 1e-10 >= FIXED_DT && executed < MAX_CATCH_UP_STEPS) {
            step(FIXED_DT, ++this.steps);
            this.accumulator -= FIXED_DT;
            executed++;
        }
        if (this.accumulator < 0)
            this.accumulator = 0;
        if (executed === MAX_CATCH_UP_STEPS && this.accumulator >= FIXED_DT)
            this.accumulator = 0;
        return executed;
    }
    reset() { this.accumulator = 0; }
    get ticks() { return this.steps; }
    get remainder() { return this.accumulator; }
}
