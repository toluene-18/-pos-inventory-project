import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import usePageNavigate from '../hooks/usePageNavigate';
import { pageByPath } from '../routes/navigation';
import '../styles/dashboard.css';

/**
 * AppLayout — authenticated shell (sidebar + topbar) around the routed page.
 * The active page comes from the URL, so refresh/back/forward all work.
 */
function AppLayout({ user, onLogout, onUserUpdated }) {
  const { pathname } = useLocation();
  const go = usePageNavigate();
  const activePage = pageByPath(pathname)?.name;

  return (
    <div className="app-layout">
      <Sidebar user={user} activePage={activePage} />
      <div className="app-main">
        <Topbar user={user} onLogout={onLogout} onNavigate={go} onUserUpdated={onUserUpdated} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            zIndex: 99999,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default AppLayout;
