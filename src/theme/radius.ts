export const radius = {
  none: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  full: 9999,
};

export type BorderRadius = keyof typeof radius;
