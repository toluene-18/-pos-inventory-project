export default function ReportsTopProducts({ products = [] }) {
  const maxRevenue = Math.max(...products.map(p => p.revenue), 10000);

  return (
    <div className="reports-section-card reports-top-card">
      <div className="reports-section-head">
        <div>
          <h3>Top selling products</h3>
        </div>
      </div>

      <div className="top-products-list">
        {products.slice(0, 6).map((item, idx) => {
          const widthPercent = (item.revenue / maxRevenue) * 100;

          return (
            <div key={item.id || idx} className="top-product-row">
              <div className="top-product-info">
                <div className="top-product-meta">
                  <div className="top-product-title-wrap">
                    <span className="top-product-name">{item.name}</span>
                    <small className="top-product-units">{item.units} units</small>
                  </div>
                  <span className="top-product-revenue">₦{item.revenue.toLocaleString()}</span>
                </div>

                <div className="top-product-bar-track">
                  <div
                    className="top-product-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(6, widthPercent))}%` }}
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
