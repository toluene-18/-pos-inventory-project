import Icon from '../ui/Icon';
import PanelStatus from './PanelStatus';

function TopProductsPanel({ items, loading, error, isOwner, onNavigate }) {
  return (
    <article className="panel products-panel">
      <div className="panel-head">
        <div>
          <h3>Top selling products</h3>
          <p>From sales in the selected period</p>
        </div>
        {isOwner && (
          <button
            type="button"
            className="link-action"
            onClick={() => onNavigate('Reports')}
          >
            View report <Icon name="arrow" size={13} />
          </button>
        )}
      </div>

      <PanelStatus
        loading={loading}
        error={error}
        empty={!items.length}
        emptyMessage="No sold products in this period yet."
      >
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
            {items.map(product => (
              <tr key={product.id} className="product-row">
                <td className="product-rank">{product.rank}</td>
                <td className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-sku">{product.sku}</span>
                </td>
                <td className="product-units">{product.units} sold</td>
                <td className="product-amount">{product.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelStatus>
    </article>
  );
}

export default TopProductsPanel;
