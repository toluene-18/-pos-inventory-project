/**
 * categories.js — Shared category labels and formatting helpers
 */

export const CATEGORY_LABELS = {
  all: 'All',
  grains_staples: 'Grains & Staples',
  cooking_essentials: 'Cooking Essentials',
  dairy_breakfast: 'Dairy & Breakfast',
  beverages: 'Beverages',
  snacks_noodles: 'Snacks & Noodles',
  groceries: 'Grains & Staples',
  snacks: 'Snacks & Noodles',
  household: 'Household',
  personal_care: 'Personal Care',
};

export const PRODUCT_PAGE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'grains_staples', label: 'Grains & Staples', match: ['grains_staples', 'groceries'] },
  { id: 'cooking_essentials', label: 'Cooking Essentials', match: ['cooking_essentials'] },
  { id: 'dairy_breakfast', label: 'Dairy & Breakfast', match: ['dairy_breakfast'] },
  { id: 'beverages', label: 'Beverages', match: ['beverages'] },
  { id: 'snacks_noodles', label: 'Snacks & Noodles', match: ['snacks_noodles', 'snacks'] },
  { id: 'household', label: 'Household', match: ['household'] },
  { id: 'personal_care', label: 'Personal Care', match: ['personal_care'] },
];

export function formatCategory(key) {
  if (!key) return 'General';
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return key
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
