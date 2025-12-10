// Design System Spacing Tokens
// Based on 4px/8px grid system for consistent visual rhythm

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

// Minimum touch target sizes (WCAG AA compliance)
export const TOUCH_TARGET = {
  minimum: 44, // iOS HIG / WCAG AA minimum
  comfortable: 48, // Material Design / WCAG AAA
} as const;
