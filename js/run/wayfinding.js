/** Gate A clarity: curated cardinal exits, NOT a v0.10 procedural room graph. */
export const EXIT_DIRECTIONS = ['north', 'west', 'south', 'east'];
const ROUTE_DIRECTIONS = ['north', 'west', 'south', 'east', 'south', 'north', 'west', 'east'];
export const directionForChamber = (index) => {
    if (!Number.isSafeInteger(index) || index < 0 || index >= ROUTE_DIRECTIONS.length)
        throw new RangeError('Invalid First Soul chamber');
    return ROUTE_DIRECTIONS[index];
};
export const EXIT_LABELS = Object.freeze({
    north: { label: 'NORTH', arrow: '↑', short: 'UP' },
    south: { label: 'SOUTH', arrow: '↓', short: 'DOWN' },
    east: { label: 'EAST', arrow: '→', short: 'RIGHT' },
    west: { label: 'WEST', arrow: '←', short: 'LEFT' }
});
