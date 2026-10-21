import Icon from './ui/Icon';
import '../styles/sidebar.css';

const NAV_ITEMS = [
  { name: 'Dashboard',    icon: 'dashboard' },
  { name: 'Point of Sale', icon: 'pos'      },
  { name: 'Inventory',    icon: 'inventory' },
  { name: 'Products',     icon: 'products'  },
  { name: 'Sales',        icon: 'sales'     },
  { name: 'Reports',      icon: 'reports'   },
  { name: 'Restock',      icon: 'restock'   },
  { name: 'Settings',     icon: 'settings'  },
];

/**
 * Sidebar — main navigation.
 * Props:
 *   user       object  — { name, email, role }
 *   activePage string  — currently active page name
 *   onNavigate fn      — called with the page name when a nav item is clicked
 *   onLogout   fn      — called when the user triggers sign-out
 */
function Sidebar({ user, activePage, onNavigate }) {
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon" aria-hidden="true">C</span>
        <div className="sidebar-brand-text">
          <strong>CWG Retail</strong>
          <small>Management Suite</small>
        </div>
      </div>

      {/* Nav group label */}
      <p className="sidebar-section-label">OPERATIONS</p>

      {/* Nav links */}
      <nav>
        <ul className="sidebar-nav" role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.name}>
              <button
                type="button"
                className={`sidebar-nav-item${activePage === item.name ? ' active' : ''}`}
                onClick={() => onNavigate(item.name)}
                aria-current={activePage === item.name ? 'page' : undefined}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User card at the bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
          <div className="sidebar-user-info">
            <strong>{user?.name || user?.email || 'Staff'}</strong>
            <small>{user?.role === 'owner' ? 'Owner / Admin' : 'Cashier'}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
