/** Pure, reproducible random stream. Separate streams must be used for world and combat. */
export function hashSeed(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
export class SeededRng {
    state;
    constructor(seed) {
        this.state = (typeof seed === 'string' ? hashSeed(seed) : seed >>> 0) || 0x6d2b79f5;
    }
    nextUint32() {
        let n = this.state;
        n ^= n << 13;
        n ^= n >>> 17;
        n ^= n << 5;
        this.state = n >>> 0;
        return this.state;
    }
    next() { return this.nextUint32() / 0x100000000; }
    int(maxExclusive) {
        if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0xffffffff)
            throw new RangeError('maxExclusive must be a positive 32-bit integer');
        // Rejection sampling prevents modulo bias in weighted content selection.
        const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
        let value;
        do {
            value = this.nextUint32();
        } while (value >= limit);
        return value % maxExclusive;
    }
    snapshot() { return this.state; }
}
export function rngStream(runSeed, channel) {
    if (!channel)
        throw new Error('Stream channel required');
    return new SeededRng(`${runSeed}::${channel}`);
}
