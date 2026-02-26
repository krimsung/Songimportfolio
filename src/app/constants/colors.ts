/**
 * Design System - Color Constants
 * Mirrors the CSS custom properties defined in src/styles/theme.css.
 * These are kept in sync for use in JS/TS logic — prefer Tailwind token
 * classes (e.g. `text-accent`, `bg-card`) in JSX wherever possible.
 */

export const COLORS = {
  // ── Neon Accent Palette (dark mode — full saturation) ───────────────────
  ACCENT_PRIMARY:   '#FF6B35',   // Neon coral — hero, nav, contact
  ACCENT_CYAN:      '#00E5FF',   // Electric cyan — about section
  ACCENT_VIOLET:    '#A855F7',   // Neon violet — skills section
  ACCENT_LIME:      '#39FF14',   // Neon lime — projects section
  ACCENT_AMBER:     '#FFB800',   // Neon amber — gallery section

  // ── Light Mode Backgrounds ───────────────────────────────────────────────
  BACKGROUND:          '#F8F7F4',
  BACKGROUND_ALT:      '#F0EEE9',
  CARD:                '#FFFFFF',

  // ── Dark Mode Backgrounds ────────────────────────────────────────────────
  BACKGROUND_DARK:          '#0E0D11',
  BACKGROUND_ALT_DARK:      '#141318',
  CARD_DARK:                '#1C1A22',

  // ── Text (Light Mode) ───────────────────────────────────────────────────
  FOREGROUND:           '#1A1916',
  FOREGROUND_SECONDARY: '#44403C',
  MUTED_FOREGROUND:     '#78716C',

  // ── Text (Dark Mode) ────────────────────────────────────────────────────
  FOREGROUND_DARK:           '#EDE9E3',
  FOREGROUND_SECONDARY_DARK: '#C4BDB4',
  MUTED_FOREGROUND_DARK:     '#8C8680',

  // ── Status ──────────────────────────────────────────────────────────────
  STATUS_SUCCESS:  '#22C55E',
  STATUS_WARNING:  '#FFB800',
  STATUS_INFO:     '#38BFFF',
  STATUS_ERROR:    '#FF4444',
} as const;

/**
 * Status badge Tailwind classes using CSS token references.
 * Uses var() tokens so they automatically respond to light/dark mode.
 */
export const STATUS_COLORS = {
  'Released': {
    bg: 'bg-[var(--status-success)]/15',
    border: 'border-[var(--status-success)]/35',
    text: 'text-[var(--status-success)]',
  },
  'In Development': {
    bg: 'bg-[var(--accent-amber)]/15',
    border: 'border-[var(--accent-amber)]/35',
    text: 'text-[var(--accent-amber)]',
  },
  'default': {
    bg: 'bg-[var(--status-info)]/15',
    border: 'border-[var(--status-info)]/35',
    text: 'text-[var(--status-info)]',
  },
} as const;

export type ProjectStatus = 'Released' | 'In Development' | 'default';
