export const slugToId: Record<string, string> = {
  'ethereal-realms': 'project-1',
  'nexus-station': 'project-2',
  'pixel-legends': 'project-3',
  'shadow-protocol': 'project-4',
  'mystic-chronicles': 'project-5',
  'cyber-nexus': 'project-6',
};

export const idToSlug: Record<string, string> = Object.fromEntries(
  Object.entries(slugToId).map(([slug, id]) => [id, slug])
);