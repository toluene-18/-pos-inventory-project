/**
 * Single source of truth for app pages: URL, sidebar icon, and who may open it.
 * Roles mirror backend middleware:
 *   - products create/update/delete, stock adjustments, reports → owner only
 *   - sales checkout + own sales history → owner and cashier
 */
export const PAGES = [
  { name: 'Dashboard',     path: '/dashboard', icon: 'dashboard', roles: ['owner', 'cashier'] },
  { name: 'Point of Sale', path: '/pos',       icon: 'pos',       roles: ['owner', 'cashier'] },
  { name: 'Sales',         path: '/sales',     icon: 'sales',     roles: ['owner', 'cashier'] },
  { name: 'Inventory',     path: '/inventory', icon: 'inventory', roles: ['owner'] },
  { name: 'Products',      path: '/products',  icon: 'products',  roles: ['owner'] },
  { name: 'Restock',       path: '/restock',   icon: 'restock',   roles: ['owner'] },
  { name: 'Reports',       path: '/reports',   icon: 'reports',   roles: ['owner'] },
  { name: 'Settings',      path: '/settings',  icon: 'settings',  roles: ['owner'] },
];

export function canAccess(user, page) {
  return Boolean(user && page && page.roles.includes(user.role));
}

export function pagesFor(user) {
  return PAGES.filter(page => canAccess(user, page));
}

export function pageByName(name) {
  return PAGES.find(page => page.name === name);
}

export function pageByPath(pathname) {
  return PAGES.find(page => pathname === page.path || pathname.startsWith(`${page.path}/`));
}
