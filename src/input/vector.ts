/** Pure dead-zone and normalization helpers, shared by touch and keyboard. */
export type Vector2 = Readonly<{ x: number; y: number }>;
export const ZERO: Vector2 = Object.freeze({ x: 0, y: 0 });
export function normalizeStick(dx: number, dy: number, radius: number, deadZone = 0.15): Vector2 {
  if (![dx,dy,radius,deadZone].every(Number.isFinite) || radius <= 0 || deadZone < 0 || deadZone >= 1) {
    throw new RangeError('Invalid stick geometry');
  }
  const nx = dx / radius, ny = dy / radius;
  const magnitude = Math.hypot(nx, ny);
  if (magnitude <= deadZone) return ZERO;
  const strength = Math.min(1, (magnitude - deadZone) / (1 - deadZone));
  return { x: (nx / magnitude) * strength, y: (ny / magnitude) * strength };
}
export function clampVector(x:number, y:number): Vector2 {
  const length=Math.hypot(x,y); return length>1?{x:x/length,y:y/length}:{x,y};
}
export function combineDirections(keys: ReadonlySet<string>, up: string[], down: string[], left: string[], right: string[]): Vector2 {
  const pressed=(set:string[])=>set.some(k=>keys.has(k));
  return clampVector(Number(pressed(right))-Number(pressed(left)),Number(pressed(down))-Number(pressed(up)));
}

/** Eight-way feedback for the physical rune discs, never an overlay over gameplay. */
export function stickDirectionGlyph(v:Vector2):string {
 const magnitude=Math.hypot(v.x,v.y);
 if(!Number.isFinite(magnitude)||magnitude<.04)return '·';
 const sectors=['→','↘','↓','↙','←','↖','↑','↗'] as const;
 return sectors[(Math.round(Math.atan2(v.y,v.x)/(Math.PI/4))+8)%8]!;
}
