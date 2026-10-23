/**
 * imageUrl.js — Resolves product image paths with safe fallbacks
 */

export function resolveProductImage(path) {
  if (!path) return '';
  // If absolute URL or data URI, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Remove leading slash if needed
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean;
}
