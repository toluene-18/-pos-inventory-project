import { useState, useRef, useEffect } from 'react';
import Icon from './ui/Icon';
import NotificationMenu from './NotificationMenu';
import AccountSettingsModal from './auth/AccountSettingsModal';
import { useTheme } from '../context/ThemeContext';
import '../styles/topbar.css';

export default function Topbar({ user, onLogout, onNavigate, onUserUpdated }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const profileRef = useRef(null);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!profileOpen) return undefined;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  function handleAccountSettings() {
    setProfileOpen(false);
    if (user?.role === 'owner') {
      onNavigate?.('Settings');
    } else {
      setShowAccountModal(true);
    }
  }

  function handleSignOut() {
    setProfileOpen(false);
    onLogout();
  }

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

        {/* User profile dropdown pill */}
        <div className="topbar-user-wrap" ref={profileRef}>
          <button
            type="button"
            className="topbar-user"
            onClick={() => setProfileOpen(v => !v)}
            aria-expanded={profileOpen}
            aria-label={`User menu for ${user?.name || 'Staff'}`}
          >
            <div className="topbar-avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="topbar-user-info">
              <strong>{user?.name || user?.email}</strong>
              <small>
                {user?.role === 'owner'
                  ? 'Owner / Admin'
                  : user?.role === 'manager'
                    ? 'Manager'
                    : 'Cashier'}
              </small>
            </div>
            <span className="topbar-chevron" aria-hidden="true">▼</span>
          </button>

          {profileOpen && (
            <div className="topbar-profile-dropdown" role="menu">
              <div className="topbar-profile-head">
                <strong>{user?.name || 'Staff Member'}</strong>
                <small>{user?.email || ''}</small>
              </div>

              <div className="topbar-profile-actions">
                <button
                  type="button"
                  className="topbar-profile-btn"
                  onClick={handleAccountSettings}
                  role="menuitem"
                >
                  <Icon name="staff" size={14} />
                  <span>Account settings</span>
                </button>

                <button
                  type="button"
                  className="topbar-profile-btn topbar-profile-btn--logout"
                  onClick={handleSignOut}
                  role="menuitem"
                >
                  <Icon name="close" size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AccountSettingsModal
        user={user}
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onUserUpdated={onUserUpdated}
      />
    </header>
  );
}
