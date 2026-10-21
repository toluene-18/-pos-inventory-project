import Icon from '../ui/Icon';

/**
 * TopProductsPanel — bottom-left panel.
 * Lists best-selling products ranked by revenue.
 * Replace PLACEHOLDER_PRODUCTS with real data in Milestone 4/9.
 */

const PLACEHOLDER_PRODUCTS = [
  { rank: 1, name: 'Basmati Rice 5kg',          sku: 'CWG-GRN-001', units: 29,  amount: '₦817,000' },
  { rank: 2, name: 'Vegetable Oil 3L',           sku: 'CWG-COK-003', units: 24,  amount: '₦532,500' },
  { rank: 3, name: 'Indomie Noodles (Carton)',   sku: 'CWG-SNK-006', units: 34,  amount: '₦396,800' },
  { rank: 4, name: 'Bottled Water Pack of 12',   sku: 'CWG-BEV-008', units: 64,  amount: '₦104,400' },
  { rank: 5, name: 'Peak Milk Powder 400g',      sku: 'CWG-DRY-004', units: 47,  amount: '₦225,600' },
];

function TopProductsPanel({ onNavigate }) {
  return (
    <article className="panel products-panel">
      <div className="panel-head">
        <div>
          <h3>Top selling products</h3>
        </div>
        <button
          type="button"
          className="link-action"
          onClick={() => onNavigate('Reports')}
        >
          View report <Icon name="arrow" size={13} />
        </button>
      </div>

      <table className="products-table" aria-label="Top selling products">
        <thead className="sr-only">
          <tr>
            <th>Rank</th>
            <th>Product</th>
            <th>Units sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {PLACEHOLDER_PRODUCTS.map(p => (
            <tr key={p.rank} className="product-row">
              <td className="product-rank">{p.rank}</td>
              <td className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-sku">{p.sku}</span>
              </td>
              <td className="product-units">{p.units} sold</td>
              <td className="product-amount">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export default TopProductsPanel;
