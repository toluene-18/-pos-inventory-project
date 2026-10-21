import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import usePageNavigate from '../hooks/usePageNavigate';
import { pageByPath } from '../routes/navigation';
import '../styles/dashboard.css';

/**
 * AppLayout — authenticated shell (sidebar + topbar) around the routed page.
 * The active page comes from the URL, so refresh/back/forward all work.
 */
function AppLayout({ user, onLogout }) {
  const { pathname } = useLocation();
  const go = usePageNavigate();
  const activePage = pageByPath(pathname)?.name;

  return (
    <div className="app-layout">
      <Sidebar user={user} activePage={activePage} />
      <div className="app-main">
        <Topbar user={user} onLogout={onLogout} onNavigate={go} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
