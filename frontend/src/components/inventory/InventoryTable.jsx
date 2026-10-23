import Icon from '../ui/Icon';
import '../../styles/inventory-table.css';

export default function InventoryTable({
  products = [],
  loading,
  isManagement,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onQuickRestock,
}) {
  if (loading) {
    return <div className="inventory-loading">Loading inventory records...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="inventory-empty">
        <Icon name="inventory" size={32} />
        <p>No inventory items match your current filter.</p>
      </div>
    );
  }

  const allSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));

  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th className="th-checkbox">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              aria-label="Select all products"
            />
          </th>
          <th>PRODUCT</th>
          <th>CATEGORY</th>
          <th>STATUS</th>
          <th>ON HAND</th>
          <th>REORDER AT</th>
          {isManagement && <th>COST</th>}
          <th>SELL</th>
          {isManagement && <th>STOCK VALUE</th>}
          {isManagement && <th className="text-right">ACTION</th>}
        </tr>
      </thead>
      <tbody>
        {products.map(p => {
          const qty = p.inventory?.quantity ?? 0;
          const threshold = p.inventory?.reorder_threshold ?? 0;
          const isSelected = selectedIds.has(p.id);
          const isOut = qty <= 0;
          const isLow = qty <= threshold && qty > 0;
          const cost = Number(p.cost_price) || 0;
          const sell = Number(p.sell_price) || 0;
          const stockVal = cost * qty;

          return (
            <tr key={p.id} className={isSelected ? 'inv-row--selected' : ''}>
              <td className="td-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(p.id)}
                  aria-label={`Select ${p.name}`}
                />
              </td>
              <td>
                <div className="inv-prod-cell">
                  <div className="inv-prod-thumb">
                    {p.image_path ? (
                      <img src={p.image_path} alt="" />
                    ) : (
                      <span>{p.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="inv-prod-meta">
                    <span className="inv-prod-name">{p.name}</span>
                    <span className="inv-prod-sku">{p.sku}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="inv-cat-text">
                  {p.category ? p.category.replace('_', ' ') : 'General'}
                </span>
              </td>
              <td>
                <span
                  className={`inv-status-pill ${
                    isOut
                      ? 'inv-status-pill--out'
                      : isLow
                      ? 'inv-status-pill--low'
                      : 'inv-status-pill--ok'
                  }`}
                >
                  <span className="status-dot" />
                  {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td>
                <span className="inv-onhand-val">{qty}</span>
              </td>
              <td>
                <span className="inv-threshold-val">{threshold}</span>
              </td>
              {isManagement && (
                <td>
                  <span className="inv-cost-val">
                    {cost ? `₦${cost.toLocaleString()}` : '—'}
                  </span>
                </td>
              )}
              <td>
                <span className="inv-sell-val">
                  {sell ? `₦${sell.toLocaleString()}` : '—'}
                </span>
              </td>
              {isManagement && (
                <td>
                  <span className="inv-stockval">
                    {cost ? `₦${stockVal.toLocaleString()}` : '₦0'}
                  </span>
                </td>
              )}
              {isManagement && (
                <td className="text-right">
                  <button
                    type="button"
                    className="inv-action-btn-circle"
                    title={`Restock ${p.name}`}
                    onClick={() => onQuickRestock(p)}
                  >
                    <Icon name="plus" size={14} />
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
