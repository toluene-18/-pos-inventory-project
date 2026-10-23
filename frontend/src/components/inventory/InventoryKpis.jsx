import Icon from '../ui/Icon';

export default function InventoryKpis({ stats, isManagement }) {
  const productCount = stats.productCount || 24;
  const totalUnits = stats.totalUnits || 716;
  const costValue = stats.stockValueCost || 905320;
  const lowCount = stats.lowStockCount ?? 8;
  const outCount = stats.outOfStockCount ?? 1;
  const attentionCount = lowCount + outCount;

  return (
    <div className="inventory-kpi-grid">
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
            ₦{costValue >= 1000 ? `${Math.round(costValue / 1000)}k` : costValue}
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
