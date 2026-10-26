export default function ReportsTopProducts({ products = [] }) {
  const maxRevenue = Math.max(...products.map(p => Number(p.revenue) || 0), 1000);

  return (
    <div className="reports-section-card reports-top-card">
      <div className="reports-section-head">
        <div>
          <h3>Top selling products</h3>
          <p>Highest revenue contributors in selected period</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="reports-empty-box">
          No product sales recorded in this period.
        </div>
      ) : (
        <div className="top-products-list">
          {products.slice(0, 5).map((item, idx) => {
            const rev = Number(item.revenue) || 0;
            const widthPercent = maxRevenue > 0 ? (rev / maxRevenue) * 100 : 0;

            return (
              <div key={item.id || idx} className="top-product-card-item">
                <div className="top-product-header-line">
                  <div className="top-product-left">
                    <strong className="top-product-title" title={item.name}>
                      {item.name}
                    </strong>
                    <span className="top-product-units-pill">
                      {item.units || 1} {item.units === 1 ? 'unit' : 'units'}
                    </span>
                  </div>
                  <span className="top-product-amount">
                    ₦{rev.toLocaleString()}
                  </span>
                </div>

                <div className="top-product-bar-track">
                  <div
                    className="top-product-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(rev > 0 ? 6 : 0, widthPercent))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
