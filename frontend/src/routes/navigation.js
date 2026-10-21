/**
 * Single source of truth for app pages: URL, sidebar icon, and who may open it.
 * Roles mirror backend middleware:
 *   - product management, stock adjustments, and reports → owner + manager
 *   - sales checkout + history → owner, manager, and cashier
 */
export const PAGES = [
  { name: 'Dashboard',     path: '/dashboard', icon: 'dashboard', roles: ['owner', 'manager', 'cashier'] },
  { name: 'Point of Sale', path: '/pos',       icon: 'pos',       roles: ['owner', 'manager', 'cashier'] },
  { name: 'Sales',         path: '/sales',     icon: 'sales',     roles: ['owner', 'manager', 'cashier'] },
  { name: 'Inventory',     path: '/inventory', icon: 'inventory', roles: ['owner', 'manager'] },
  { name: 'Products',      path: '/products',  icon: 'products',  roles: ['owner', 'manager'] },
  { name: 'Restock',       path: '/restock',   icon: 'restock',   roles: ['owner', 'manager'] },
  { name: 'Reports',       path: '/reports',   icon: 'reports',   roles: ['owner', 'manager'] },
  { name: 'Settings',      path: '/settings',  icon: 'settings',  roles: ['owner', 'manager'] },
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
