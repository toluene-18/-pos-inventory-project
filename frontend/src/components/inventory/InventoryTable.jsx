import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/inventory-table.css';

export default function InventoryTable({
  products,
  loading,
  isManagement,
  onAdjust,
}) {
  if (loading) {
    return <div className="inventory-loading">Checking inventory records...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="inventory-empty">
        <Icon name="inventory" size={32} />
        <p>No inventory items match your current filter.</p>
      </div>
    );
  }

  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Product & SKU</th>
          <th>Category</th>
          <th>On Hand</th>
          <th>Reorder At</th>
          {isManagement && <th>Cost Price</th>}
          <th>Selling Price</th>
          {isManagement && <th>Stock Value</th>}
          <th>Status</th>
          {isManagement && <th className="text-right">Action</th>}
        </tr>
      </thead>
      <tbody>
        {products.map(p => {
          const qty = p.inventory?.quantity ?? 0;
          const threshold = p.inventory?.reorder_threshold ?? 0;
          const unit = p.unit || 'units';
          const isLow = qty <= threshold && qty > 0;
          const isOut = qty <= 0;
          const costVal = (p.cost_price ? Number(p.cost_price) : 0) * qty;

          return (
            <tr key={p.id}>
              <td>
                <div className="inv-prod-cell">
                  {p.image_path ? (
                    <img src={p.image_path} alt="" className="table-thumb" />
                  ) : (
                    <span className="table-thumb-mono">
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="inv-prod-meta">
                    <strong>{p.name}</strong>
                    <span className="inv-sku-tag">{p.sku}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="inv-cat-pill">
                  {p.category ? p.category.replace('_', ' ') : 'General'}
                </span>
              </td>
              <td>
                <strong className="inv-qty-value">
                  {qty} <small className="unit-label">{unit}</small>
                </strong>
              </td>
              <td>{threshold} {unit}</td>
              {isManagement && (
                <td>{p.cost_price ? formatMoney(p.cost_price) : '—'}</td>
              )}
              <td>
                <strong>{formatMoney(p.sell_price)}</strong>
              </td>
              {isManagement && (
                <td>
                  <strong className="text-muted-dark">
                    {p.cost_price ? formatMoney(costVal) : '—'}
                  </strong>
                </td>
              )}
              <td>
                <span
                  className={`inv-badge ${
                    isOut
                      ? 'inv-badge--out'
                      : isLow
                      ? 'inv-badge--low'
                      : 'inv-badge--ok'
                  }`}
                >
                  {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                </span>
              </td>
              {isManagement && (
                <td className="text-right">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onAdjust(p)}
                  >
                    Adjust
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
