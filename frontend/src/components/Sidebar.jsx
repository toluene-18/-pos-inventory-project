function Sidebar({ user, activePage, onNavigate, onLogout }) {
  const navigation = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Products', icon: '□' },
    { name: 'Point of Sale', icon: '＋' },
    { name: 'Sales', icon: '↗' },
    { name: 'Reports', icon: '▤' },
    { name: 'Staff', icon: '♙' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <a className="dashboard-brand" href="/" aria-label="CWG Retail">
        <span className="dashboard-brand-icon">C</span>
        <span>
          <strong>CWG Retail</strong>
          <small>Management Suite</small>
        </span>
      </a>

      <p className="dashboard-nav-label">WORKSPACE</p>

      <nav className="dashboard-nav" aria-label="Main navigation">
        {navigation.map(item => (
          <button
            key={item.name}
            type="button"
            className={`dashboard-nav-item ${
              activePage === item.name ? 'active' : ''
            }`}
            onClick={() => onNavigate(item.name)}
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar-bottom">
        <div className="dashboard-user">
          <div className="dashboard-avatar">
            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>

          <div className="dashboard-user-info">
            <strong>{user.name || user.email}</strong>
            <small>{user.role || 'Staff'}</small>
          </div>
        </div>

        <button type="button" className="dashboard-logout" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
