/**
 * Maps a roast level (0 = green coffee, 1 = very dark) to a bean colour.
 * Shared by the WebGL bean, its SVG fallback and roast swatches so all agree.
 */
const STOPS: [number, [number, number, number]][] = [
  [0.0, [134, 150, 98]], // green coffee
  [0.22, [176, 164, 104]], // drying — straw
  [0.42, [178, 118, 62]], // cinnamon
  [0.62, [124, 72, 40]], // city
  [0.8, [82, 46, 28]], // full city
  [1.0, [40, 24, 17]], // dark
];

export function roastRgb(level: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, level));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    if (t <= p1) {
      const [p0, c0] = STOPS[i - 1];
      const k = (t - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export function roastCss(level: number): string {
  const [r, g, b] = roastRgb(level);
  return `rgb(${r} ${g} ${b})`;
}

export function roastName(level: number): string {
  if (level < 0.2) return 'Green';
  if (level < 0.4) return 'Drying';
  if (level < 0.55) return 'Light';
  if (level < 0.72) return 'Medium';
  if (level < 0.88) return 'Medium-dark';
  return 'Dark';
}
