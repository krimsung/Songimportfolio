/**
 * Design System - Project Constants
 * Central definition of project-related constants
 */

export const PROJECT_STATUS = {
  RELEASED: 'Released',
  IN_DEVELOPMENT: 'In Development',
  NOT_AVAILABLE: 'N/A',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const PROJECT_CATEGORIES = {
  GAME: 'Game',
  TOOL: 'Tool',
  PLUGIN: 'Plugin',
  ART: 'Art',
  RESEARCH: 'Research',
} as const;

// Thumbnail fallback is handled in src/data/projects.ts via static import.
