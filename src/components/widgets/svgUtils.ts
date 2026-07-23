export const SIZE = 320;
export const RANGE = 8;
export const TICKS = [-8, -6, -4, -2, 2, 4, 6, 8];

export function toPx(x: number): number {
  return ((x + RANGE) / (2 * RANGE)) * SIZE;
}

export function toPy(y: number): number {
  return SIZE - ((y + RANGE) / (2 * RANGE)) * SIZE;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
