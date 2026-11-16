export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smootherstep = (value: number) => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };
