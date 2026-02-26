/**
 * Color Mapping Reference
 * This file documents the mapping from hardcoded hex colors to design tokens
 * Use this as a reference when refactoring components
 */

export const COLOR_MAPPINGS = {
  // Background colors
  'bg-[#F3F2F0]': 'bg-background',
  'bg-[#1C1A1F]': 'bg-card',
  'bg-[#0F0D13]': 'bg-background', // dark mode
  'bg-[#FFFFFF]': 'bg-card', // light mode card

  // Text colors
  'text-[#1C1A1F]': 'text-foreground',
  'text-[#FFFFFF]': 'text-white',
  'text-[#C9C6C0]': 'text-muted-foreground',
  'text-[#7E7A75]': 'text-muted',
  'text-[#D47A2B]': 'text-accent',
  'text-[#C07A2C]': 'text-accent/90',

  // Border colors
  'border-[#26242A]': 'border-border',
  'border-[#D47A2B]': 'border-accent',
  'border-[#C07A2C]': 'border-accent/90',

  // Hover states
  'hover:text-[#D47A2B]': 'hover:text-accent',
  'hover:text-[#C07A2C]': 'hover:text-accent/90',
  'hover:bg-[#D47A2B]': 'hover:bg-accent',
  'hover:bg-[#C07A2C]': 'hover:bg-accent/90',
  'hover:border-[#D47A2B]': 'hover:border-accent',

  // Opacity variants
  'bg-[#D47A2B]/10': 'bg-accent/10',
  'bg-[#D47A2B]/20': 'bg-accent/20',
  'border-[#D47A2B]/30': 'border-accent/30',
  'border-[#D47A2B]/40': 'border-accent/40',

  // Status colors
  'text-[#2F7A5E]': 'text-[#2F7A5E]', // success - keep for now
  'text-[#2F6DAA]': 'text-[#2F6DAA]', // info - keep for now
  'text-[#B23B3B]': 'text-destructive',
  'bg-[#B23B3B]': 'bg-destructive',

  // Group/Utility colors
  'from-[#1C1A1F]': 'from-card',

} as const;

// Common class combinations to replace
export const CLASS_COMBINATIONS = {
  // Container
  'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8': 'Use <Container> component',

  // Card
  'bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]': 'Use <Card> component',
  'bg-card rounded-lg p-8 border border-border': 'Use <Card> component',

  // Back button
  'inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors mb-8 group': 'Use <BackButton> component',

  // Badge
  'inline-flex items-center gap-1 px-2 py-1 bg-[#D47A2B]/10 border border-[#D47A2B]/30 rounded text-xs text-[#D47A2B]': 'Use <Badge variant="accent"> component',

  // Icon wrapper
  'p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors': 'Use .icon-wrapper class',

} as const;
