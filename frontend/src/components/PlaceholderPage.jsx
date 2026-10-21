import { Link } from 'react-router-dom';
import Icon from './ui/Icon';

const DESCRIPTIONS = {
  Inventory: 'Monitor stock levels, review low-stock items and manage restocking.',
  Products: 'Browse your product catalogue and manage product information.',
  Sales: 'Review recorded transactions and sale details.',
  Reports: 'Explore store performance using verified sales data.',
  Restock: 'Record stock receipts and update inventory levels.',
  Settings: 'Manage your store preferences and account settings.',
};

/** PlaceholderPage — shown for pages not built yet, or when access is denied. */
function PlaceholderPage({ page, forbidden = false }) {
  return (
    <section className="placeholder-page">
      <span className="placeholder-icon">
        <Icon name={forbidden ? 'alert' : page.icon} size={26} />
      </span>
      <p className="placeholder-eyebrow">{forbidden ? 'ACCESS RESTRICTED' : 'COMING SOON'}</p>
      <h2>{page.name}</h2>
      <p>
        {forbidden
          ? 'This area is only available to the store owner. Ask an owner if you need something changed here.'
          : DESCRIPTIONS[page.name] || 'This page is being built.'}
      </p>
      <Link to="/dashboard" className="btn btn-primary">← Back to Dashboard</Link>
    </section>
  );
}

export default PlaceholderPage;
