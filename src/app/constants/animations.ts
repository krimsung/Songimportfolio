/**
 * Design System - Animation Constants
 * Central definition of animation timings and durations
 */

export const ANIMATIONS = {
  // Transition durations (in milliseconds)
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Transition timing functions
  EASING: {
    DEFAULT: 'ease',
    LINEAR: 'linear',
    IN: 'ease-in',
    OUT: 'ease-out',
    IN_OUT: 'ease-in-out',
  },

  // Carousel specific
  CAROUSEL: {
    ITEM_DELAY: 3, // seconds between items
    TOTAL_DURATION: 21, // total animation cycle in seconds
    ITEMS_COUNT: 7, // number of carousel items
  },

  // Hover effects
  HOVER: {
    SCALE: 'hover:scale-110',
    TRANSLATE_X: 'group-hover:-translate-x-1',
    OPACITY: 'hover:opacity-100',
  },

  // Tailwind classes for transitions
  TRANSITION: {
    DEFAULT: 'transition',
    ALL: 'transition-all',
    COLORS: 'transition-colors',
    TRANSFORM: 'transition-transform',
    OPACITY: 'transition-opacity',
  },

  // Duration classes
  DURATION_CLASS: {
    FAST: 'duration-150',
    NORMAL: 'duration-200',
    SLOW: 'duration-500',
  },
} as const;
