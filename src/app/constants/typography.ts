/**
 * Design System - Typography Constants
 * Central definition of text styles and font sizes
 */

export const TYPOGRAPHY = {
  // Heading sizes
  HEADING: {
    H1: 'text-4xl md:text-5xl font-bold',
    H2: 'text-3xl md:text-4xl font-bold',
    H3: 'text-2xl font-bold',
    H4: 'text-xl font-bold',
    H5: 'text-lg font-semibold',
    H6: 'text-base font-semibold',
  },

  // Body text sizes
  BODY: {
    LG: 'text-lg',
    BASE: 'text-base',
    SM: 'text-sm',
    XS: 'text-xs',
  },

  // Font weights
  WEIGHT: {
    NORMAL: 'font-normal',
    MEDIUM: 'font-medium',
    SEMIBOLD: 'font-semibold',
    BOLD: 'font-bold',
  },

  // Line heights
  LEADING: {
    TIGHT: 'leading-tight',
    NORMAL: 'leading-normal',
    RELAXED: 'leading-relaxed',
    LOOSE: 'leading-loose',
  },

  // Text colors (semantic)
  COLOR: {
    PRIMARY: 'text-foreground',
    SECONDARY: 'text-muted',
    ACCENT: 'text-accent',
    MUTED: 'text-muted-foreground',
    WHITE: 'text-white',
  },
} as const;
