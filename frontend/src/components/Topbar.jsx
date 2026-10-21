import Icon from './ui/Icon';
import NotificationMenu from './NotificationMenu';
import { useTheme } from '../context/ThemeContext';
import '../styles/topbar.css';

/**
 * Topbar — sticky top header.
 * Matches reference: search bar (left), notification bell + role pill + user avatar (right).
 * Props:
 *   user       object — { name, email, role }
 *   activePage string — current page name shown as breadcrumb
 *   onLogout   fn     — called when user clicks sign out
 */
function Topbar({ user, onLogout, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="topbar">
      {/* Left: search */}
      <label className="topbar-search" aria-label="Search products, receipts, staff…">
        <Icon name="search" size={16} />
        <input
          type="search"
          placeholder="Search products, receipts, staff…"
          aria-label="Search"
        />
      </label>

      {/* Right: controls */}
      <div className="topbar-right">
        {/* Date */}
        <span className="topbar-date" aria-label={`Today is ${today}`}>
          {today}
        </span>

        {/* Theme toggle */}
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={isDark}
        >
          <Icon name={isDark ? 'sun' : 'moon'} size={18} />
        </button>

        <NotificationMenu user={user} onNavigate={onNavigate} />

        {/* User / role pill */}
        <button
          type="button"
          className="topbar-user"
          onClick={onLogout}
          aria-label={`Signed in as ${user?.name || 'Staff'}. Click to sign out.`}
          title="Click to sign out"
        >
          <div className="topbar-avatar" aria-hidden="true">{initials}</div>
          <div className="topbar-user-info">
            <strong>{user?.name || user?.email}</strong>
            <small>{user?.role === 'owner' ? 'Owner / Admin' : 'Cashier'}</small>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
