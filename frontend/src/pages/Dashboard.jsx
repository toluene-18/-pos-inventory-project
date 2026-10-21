import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardHome from './DashboardHome';
import PointOfSale from './PointOfSale';
import Icon from '../components/ui/Icon';
import '../styles/dashboard.css';

/**
 * Page descriptions for placeholder screens.
 * Remove each entry as the real page is built.
 */
const PAGE_INFO = {
  'Point of Sale': {
    icon: 'pos',
    description:
      'Select products, build a cart and complete customer transactions.',
  },
  Inventory: {
    icon: 'inventory',
    description:
      'Monitor stock levels, review low-stock items and manage restocking.',
  },
  Products: {
    icon: 'products',
    description: 'Browse your product catalogue and manage product information.',
  },
  Sales: {
    icon: 'sales',
    description: 'Review recorded transactions and sale details.',
  },
  Reports: {
    icon: 'reports',
    description: 'Explore store performance using verified sales data.',
  },
  Restock: {
    icon: 'restock',
    description: 'Record stock receipts and update inventory levels.',
  },
  Settings: {
    icon: 'settings',
    description: 'Manage your store preferences and account settings.',
  },
};

function PlaceholderPage({ name, onBack }) {
  const info = PAGE_INFO[name] || { icon: 'dashboard', description: 'Coming soon.' };

  return (
    <section className="placeholder-page">
      <span className="placeholder-icon">
        <Icon name={info.icon} size={26} />
      </span>
      <p className="placeholder-eyebrow">CWG RETAIL SUITE</p>
      <h2>{name}</h2>
      <p>{info.description}</p>
      <button type="button" className="btn btn-primary" onClick={onBack}>
        ← Back to Dashboard
      </button>
    </section>
  );
}

/**
 * Dashboard — app shell.
 * Owns page state and renders either the dashboard home or a placeholder.
 *
 * Props:
 *   user     object — authenticated user { name, email, role }
 *   onLogout fn     — clear auth and redirect to /login
 */
function Dashboard({ user = {}, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard');

  function renderContent() {
    if (activePage === 'Dashboard') {
      return <DashboardHome user={user} onNavigate={setActivePage} />;
    }
    if (activePage === 'Point of Sale') {
      return <PointOfSale user={user} onSessionExpired={onLogout} />;
    }
    return (
      <PlaceholderPage
        name={activePage}
        onBack={() => setActivePage('Dashboard')}
      />
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />

      <div className="app-main">
        <Topbar
          user={user}
          activePage={activePage}
          onLogout={onLogout}
          onNavigate={setActivePage}
        />

        <main className="app-content" id="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
