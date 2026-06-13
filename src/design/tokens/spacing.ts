/* ============================================================
   Frencia · Spacing (port of tokens/spacing.css) — 8px base grid.
   ============================================================ */

export const space = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 32,
  9: 40,
  10: 48,
  11: 64,
  12: 80,
} as const;

// Semantic
export const spacing = {
  gapInline: space[3],
  gapStack: space[5],
  gapSection: space[8],
  padCard: space[6],
  padScreen: space[6], // iOS 20px gutters
  padControl: space[5],
} as const;

// Touch / sizing (iOS 44px min hit target)
export const sizing = {
  hitMin: 44,
  controlHSm: 36,
  controlHMd: 44,
  controlHLg: 52,
  tabbarH: 84,
  navbarH: 56,
} as const;
