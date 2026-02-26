/**
 * Design System - Layout Constants
 * Central definition of spacing, sizing, and layout values
 */

export const LAYOUT = {
  // Container widths
  MAX_WIDTH: 'max-w-6xl',
  CONTAINER_PADDING: 'px-4 sm:px-6 lg:px-8',

  // Page spacing
  PAGE_PADDING_TOP: 'pt-20',
  SECTION_PADDING_Y: 'py-12',
  SECTION_SPACING: 'space-y-8',

  // Grid patterns
  GRID_SIZE: 50, // pixels for background grid
  GRID_LINE_WIDTH: 1, // pixels

  // Heights
  CAROUSEL_HEIGHT: 'h-32',
  HERO_MIN_HEIGHT: 'min-h-[600px]',

  // Z-index layers
  Z_INDEX: {
    NAVIGATION: 50,
    MODAL: 50,
    LIGHTBOX: 50,
    DROPDOWN: 40,
    OVERLAY: 30,
    STICKY: 20,
  },

  // Border radius
  RADIUS: {
    SM: 'rounded',
    MD: 'rounded-lg',
    LG: 'rounded-xl',
    FULL: 'rounded-full',
  },

  // Shadows
  SHADOW: {
    SM: 'shadow-sm',
    MD: 'shadow-md',
    LG: 'shadow-lg',
  },
} as const;

/**
 * Responsive breakpoints (Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
