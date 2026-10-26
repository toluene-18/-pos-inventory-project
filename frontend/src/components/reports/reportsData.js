/**
 * Color palette and helpers for reports visualization.
 */

export const CATEGORY_COLORS = [
  '#10b981', // green
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
  '#eab308', // yellow
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f97316', // orange
  '#64748b', // slate
];

export function getCategoryColor(index) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
