import Icon from '../ui/Icon';

function formatCompactCost(val) {
  const num = Number(val) || 0;
  if (num >= 1_000_000_000) return `₦${(num / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  if (num >= 1_000) return `₦${Math.round(num / 1_000)}k`;
  return `₦${num.toLocaleString()}`;
}

export default function InventoryKpis({ stats = {}, isManagement }) {
  const productCount = stats.productCount ?? 0;
  const totalUnits = stats.totalUnits ?? 0;
  const costValue = stats.stockValueCost ?? 0;
  const lowCount = stats.lowStockCount ?? 0;
  const outCount = stats.outOfStockCount ?? 0;
  const attentionCount = lowCount + outCount;

  return (
    <div className="inventory-kpis-grid">
      <div className="inv-kpi-card">
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">PRODUCTS TRACKED</span>
          <div className="inv-kpi-icon inv-kpi-icon--gray">
            <Icon name="products" size={15} />
          </div>
        </div>
        <div className="inv-kpi-val">{productCount}</div>
        <div className="inv-kpi-sub">Across every category in the store</div>
      </div>

      <div className="inv-kpi-card">
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">UNITS ON HAND</span>
          <div className="inv-kpi-icon inv-kpi-icon--gray">
            <Icon name="inventory" size={15} />
          </div>
        </div>
        <div className="inv-kpi-val">{totalUnits.toLocaleString()}</div>
        <div className="inv-kpi-sub">Total pieces across all products</div>
      </div>

      {isManagement && (
        <div className="inv-kpi-card">
          <div className="inv-kpi-header">
            <span className="inv-kpi-label">STOCK VALUE (COST)</span>
            <div className="inv-kpi-icon inv-kpi-icon--green">
              <Icon name="pos" size={15} />
            </div>
          </div>
          <div className="inv-kpi-val">
            {formatCompactCost(costValue)}
          </div>
          <div className="inv-kpi-sub">
            ₦{Number(costValue).toLocaleString()} at purchase price
          </div>
        </div>
      )}

      <div className="inv-kpi-card">
        <div className="inv-kpi-header">
          <span className="inv-kpi-label">NEEDS ATTENTION</span>
          <div className="inv-kpi-icon inv-kpi-icon--amber">
            <Icon name="alert" size={15} />
          </div>
        </div>
        <div className="inv-kpi-val">{attentionCount}</div>
        <div className="inv-kpi-sub">
          {lowCount} low · {outCount} out of stock
        </div>
      </div>
    </div>
  );
}
