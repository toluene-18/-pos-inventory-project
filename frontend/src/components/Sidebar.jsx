import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from './ui/Icon';
import { pagesFor } from '../routes/navigation';
import '../styles/sidebar.css';

const REPORT_SUB_ITEMS = [
  { id: 'sales', name: 'Sales Report', icon: 'sales' },
  { id: 'inventory', name: 'Inventory Report', icon: 'inventory' },
  { id: 'stock', name: 'Stock Level Report', icon: 'alert' },
  { id: 'products', name: 'Product Report', icon: 'products' },
  { id: 'users', name: 'User Report', icon: 'users' },
];

/**
 * Sidebar — main navigation. Shows only pages the user's role may open.
 * Supports push-down collapsible submenu under Reports.
 */
function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'sales';
  const isReportsPath = location.pathname.startsWith('/reports');

  const [reportsOpen, setReportsOpen] = useState(isReportsPath);

  useEffect(() => {
    if (isReportsPath) {
      setReportsOpen(true);
    }
  }, [isReportsPath]);

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleReportsClick(e) {
    if (isReportsPath) {
      e.preventDefault();
      setReportsOpen(prev => !prev);
    } else {
      setReportsOpen(true);
    }
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon" aria-hidden="true">
          C
        </span>
        <div className="sidebar-brand-text">
          <strong>CWG Retail</strong>
          <small>Management Suite</small>
        </div>
      </div>

      <p className="sidebar-section-label">OPERATIONS</p>

      <nav>
        <ul className="sidebar-nav" role="list">
          {pagesFor(user).map(page => {
            if (page.name === 'Reports') {
              return (
                <li key={page.path} className="sidebar-nav-group">
                  <NavLink
                    to="/reports"
                    onClick={handleReportsClick}
                    className={({ isActive }) =>
                      `sidebar-nav-item${isActive ? ' active' : ''}`
                    }
                  >
                    <Icon name={page.icon} size={17} />
                    <span className="sidebar-nav-label">{page.name}</span>
                    <Icon
                      name={reportsOpen ? 'chevronDown' : 'chevronRight'}
                      size={12}
                      className="sidebar-caret"
                    />
                  </NavLink>

                  {reportsOpen && (
                    <ul className="sidebar-subnav" role="list">
                      {REPORT_SUB_ITEMS.map(sub => {
                        const isSubActive =
                          isReportsPath && activeTab === sub.id;
                        return (
                          <li key={sub.id}>
                            <button
                              type="button"
                              className={`sidebar-subnav-item${
                                isSubActive ? ' active' : ''
                              }`}
                              onClick={() => {
                                navigate(`/reports?tab=${sub.id}`);
                              }}
                            >
                              <Icon name={sub.icon} size={13} />
                              <span>{sub.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={page.path}>
                <NavLink
                  to={page.path}
                  className={({ isActive }) =>
                    `sidebar-nav-item${isActive ? ' active' : ''}`
                  }
                >
                  <Icon name={page.icon} size={17} />
                  <span>{page.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="sidebar-user-info">
            <strong>{user?.name || user?.email || 'Staff'}</strong>
            <small>
              {user?.role === 'owner'
                ? 'Owner / Admin'
                : user?.role === 'manager'
                  ? 'Manager'
                  : 'Cashier'}
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
