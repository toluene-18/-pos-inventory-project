import Icon from '../ui/Icon';
import ProductThumbnail from '../ui/ProductThumbnail';
import { formatCategory } from '../../utils/categories';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/products-grid.css';

export default function ProductsTable({
  products = [],
  loading,
  isManagement,
  onEdit,
  onDeactivate,
}) {
  if (loading) {
    return <div className="products-loading">Loading products catalogue...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <Icon name="products" size={32} />
        <p>No products found matching your search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="products-card-grid">
      {products.map(p => {
        const qty = p.inventory?.quantity ?? 0;
        const threshold = p.inventory?.reorder_threshold ?? 0;
        const isOut = qty <= 0;
        const isLow = qty <= threshold && qty > 0;
        const unit = p.unit || 'piece';

        return (
          <div key={p.id} className="prod-grid-card">
            <div className="prod-card-thumb-wrap">
              <span className="prod-card-cat-badge">
                {formatCategory(p.category)}
              </span>
              <ProductThumbnail
                src={p.image_path}
                name={p.name}
                className="prod-card-img-container"
              />
            </div>

            <div className="prod-card-body">
              <div className="prod-card-top-row">
                <strong className="prod-card-name" title={p.name}>
                  {p.name}
                </strong>
                <span
                  className={`prod-status-chip ${
                    isOut
                      ? 'prod-status-chip--out'
                      : isLow
                      ? 'prod-status-chip--low'
                      : 'prod-status-chip--ok'
                  }`}
                >
                  <Icon
                    name={isOut ? 'close' : isLow ? 'alert' : 'check'}
                    size={11}
                  />
                  <span>{isOut ? 'Out' : isLow ? 'Low' : 'OK'}</span>
                </span>
              </div>

              <div className="prod-card-sku">{p.sku}</div>

              <div className="prod-card-bottom-row">
                <div className="prod-card-pricing-stock">
                  <span className="prod-card-price">{formatMoney(p.sell_price)}</span>
                  <span className="prod-card-stock-sub">{qty} {unit} in stock</span>
                </div>

                {isManagement && (
                  <div className="prod-card-actions">
                    <button
                      type="button"
                      className="prod-btn-action"
                      onClick={() => onEdit(p)}
                      title={`Edit ${p.name}`}
                    >
                      <Icon name="edit" size={13} />
                    </button>
                    <button
                      type="button"
                      className="prod-btn-action prod-btn-action--danger"
                      onClick={() => onDeactivate(p)}
                      title={`Deactivate ${p.name}`}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
