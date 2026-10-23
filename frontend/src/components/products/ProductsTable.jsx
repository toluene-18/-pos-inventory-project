import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';
import ProductThumbnail from '../ui/ProductThumbnail';
import { formatCategory } from '../../utils/categories';
import '../../styles/products-grid.css';

export default function ProductsTable({
  products,
  loading,
  isManagement,
  viewMode = 'table',
  onEdit,
  onDeactivate,
}) {
  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <Icon name="products" size={32} />
        <p>No products found matching your search or category filter.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="products-card-grid">
        {products.map(p => {
          const qty = p.inventory?.quantity ?? 0;
          const cost = Number(p.cost_price) || 0;
          const sell = Number(p.sell_price) || 0;
          const profit = sell - cost;
          const margin = sell > 0 ? Math.round((profit / sell) * 100) : 0;

          return (
            <div key={p.id} className="prod-grid-card">
              <div className="prod-grid-thumb-wrap">
                <ProductThumbnail src={p.image_path} name={p.name} className="prod-grid-img" />
                <span className="prod-grid-cat">
                  {formatCategory(p.category)}
                </span>
              </div>
              <div className="prod-grid-content">
                <strong>{p.name}</strong>
                <span className="prod-sku-tag">{p.sku}</span>
                <div className="prod-grid-prices">
                  <span className="prod-sell-price">{formatMoney(p.sell_price)}</span>
                  {isManagement && p.cost_price && (
                    <span className="prod-margin-pill">+{margin}%</span>
                  )}
                </div>
                <div className="prod-grid-stock">
                  <span>{qty} {p.unit || 'units'} left</span>
                </div>
              </div>
              {isManagement && (
                <div className="prod-grid-actions">
                  <button type="button" className="btn-icon" onClick={() => onEdit(p)} title="Edit">
                    <Icon name="edit" size={15} />
                  </button>
                  <button type="button" className="btn-icon btn-icon--danger" onClick={() => onDeactivate(p)} title="Deactivate">
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Product & SKU</th>
          <th>Category</th>
          {isManagement && <th>Cost Price</th>}
          <th>Selling Price</th>
          {isManagement && <th>Margin</th>}
          <th>Current Stock</th>
          {isManagement && <th className="text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {products.map(p => {
          const qty = p.inventory?.quantity ?? 0;
          const threshold = p.inventory?.reorder_threshold ?? 0;
          const isLow = qty <= threshold && qty > 0;
          const isOut = qty <= 0;
          const cost = Number(p.cost_price) || 0;
          const sell = Number(p.sell_price) || 0;
          const profit = sell - cost;
          const margin = sell > 0 ? Math.round((profit / sell) * 100) : 0;

          return (
            <tr key={p.id}>
              <td>
                <div className="product-thumb-cell">
                  <ProductThumbnail src={p.image_path} name={p.name} className="table-thumb" />
                  <div className="product-name-meta">
                    <strong>{p.name}</strong>
                    <span className="product-sku-tag">{p.sku}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="product-cat-pill">
                  {formatCategory(p.category)}
                </span>
              </td>
              {isManagement && (
                <td className="product-cost-cell">
                  {p.cost_price ? formatMoney(p.cost_price) : '—'}
                </td>
              )}
              <td className="product-price-cell">
                <strong>{formatMoney(p.sell_price)}</strong>
              </td>
              {isManagement && (
                <td>
                  {p.cost_price ? (
                    <span
                      className={`margin-pill ${
                        profit < 0 ? 'margin-pill--negative' : 'margin-pill--positive'
                      }`}
                    >
                      {profit >= 0 ? '+' : ''}{margin}%
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              )}
              <td>
                <span
                  className={`stock-badge ${
                    isOut ? 'stock-badge--out' : isLow ? 'stock-badge--low' : 'stock-badge--ok'
                  }`}
                >
                  {qty} {p.unit || 'units'} {isOut ? '(Out)' : isLow ? '(Low)' : ''}
                </span>
              </td>
              {isManagement && (
                <td className="text-right product-actions-cell">
                  <button
                    type="button"
                    className="btn-icon"
                    title="Edit Product"
                    onClick={() => onEdit(p)}
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon btn-icon--danger"
                    title="Deactivate Product"
                    onClick={() => onDeactivate(p)}
                  >
                    <Icon name="trash" size={16} />
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
