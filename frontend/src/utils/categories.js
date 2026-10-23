/**
 * categories.js — Shared category labels and formatting helpers
 */

export const CATEGORY_LABELS = {
  all: 'All categories',
  beverages: 'Beverages',
  dairy_breakfast: 'Dairy & Breakfast',
  groceries: 'Groceries',
  household: 'Household',
  personal_care: 'Personal Care',
  snacks: 'Snacks',
};

export function formatCategory(key) {
  if (!key) return 'General';
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return key
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
