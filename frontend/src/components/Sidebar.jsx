import { NavLink } from 'react-router-dom';
import Icon from './ui/Icon';
import { pagesFor } from '../routes/navigation';
import '../styles/sidebar.css';

/**
 * Sidebar — main navigation. Shows only pages the user's role may open.
 * Props:
 *   user  object — { name, email, role }
 */
function Sidebar({ user }) {
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon" aria-hidden="true">C</span>
        <div className="sidebar-brand-text">
          <strong>CWG Retail</strong>
          <small>Management Suite</small>
        </div>
      </div>

      <p className="sidebar-section-label">OPERATIONS</p>

      <nav>
        <ul className="sidebar-nav" role="list">
          {pagesFor(user).map(page => (
            <li key={page.path}>
              <NavLink
                to={page.path}
                className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              >
                <Icon name={page.icon} size={17} />
                <span>{page.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
          <div className="sidebar-user-info">
            <strong>{user?.name || user?.email || 'Staff'}</strong>
            <small>
              {user?.role === 'owner' ? 'Owner / Admin' : user?.role === 'manager' ? 'Manager' : 'Cashier'}
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
