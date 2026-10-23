import Icon from '../ui/Icon';

export default function ReportsTopProducts({ products = [] }) {
  const maxUnits = Math.max(...products.map(p => p.units), 10);

  return (
    <div className="reports-section-card">
      <div className="reports-section-head">
        <span className="reports-section-icon">
          <Icon name="pos" size={16} />
        </span>
        <div>
          <h3>Top products</h3>
          <p>Best sellers • Last 30 days</p>
        </div>
        <div className="top-products-badge">All units</div>
      </div>

      <div className="top-products-list">
        {products.map(item => {
          const widthPercent = (item.units / maxUnits) * 100;

          return (
            <div key={item.id} className="top-product-row">
              <div className={`top-product-rank ${item.rank === 1 ? 'top-product-rank--gold' : ''}`}>
                {item.rank}
              </div>

              <div className="top-product-info">
                <div className="top-product-meta">
                  <span className="top-product-name">{item.name}</span>
                  <div className="top-product-stats">
                    <span className="top-product-units">{item.units} units</span>
                    <span className="top-product-revenue">₦{item.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="top-product-bar-track">
                  <div
                    className="top-product-bar-fill"
                    style={{ width: `${Math.max(8, widthPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
