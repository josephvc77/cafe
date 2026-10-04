/**
 * A representative bean-temperature roast profile (seconds, °C).
 * Used by the hero readout and the roast-chapter chart so both tell the same story.
 */
const KEYS: [number, number][] = [
  [0, 200],
  [35, 128],
  [75, 94],
  [150, 116],
  [270, 150],
  [400, 176],
  [520, 196],
  [590, 201],
  [650, 205],
];

export const ROAST_DURATION = 650;
export const TEMP_MIN = 80;
export const TEMP_MAX = 215;

/** Catmull–Rom interpolation through the keyframes. */
export function tempAt(seconds: number): number {
  const t = Math.min(ROAST_DURATION, Math.max(0, seconds));
  let i = KEYS.findIndex(([s]) => s > t) - 1;
  if (i < 0) i = KEYS.length - 2;
  const p0 = KEYS[Math.max(0, i - 1)][1];
  const p1 = KEYS[i][1];
  const p2 = KEYS[i + 1][1];
  const p3 = KEYS[Math.min(KEYS.length - 1, i + 2)][1];
  const u = (t - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]);
  const u2 = u * u;
  const u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
}

/** Bean colour level for a point in the roast (0–1 of duration). */
export const roastLevelAt = (p: number) => Math.min(1, Math.max(0, p)) * 0.8;

export function formatClock(seconds: number): string {
  const s = Math.round(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** SVG path for the curve inside a `w × h` box. */
export function curvePath(w: number, h: number, samples = 120): string {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const s = (i / samples) * ROAST_DURATION;
    const x = (s / ROAST_DURATION) * w;
    const y = h - ((tempAt(s) - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * h;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
