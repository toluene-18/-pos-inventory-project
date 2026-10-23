import Icon from '../ui/Icon';

export default function ReportsKpis({ kpis }) {
  const {
    revenue = 222550,
    transactions = 18,
    averageBasket = 12364,
    unitsSold = 77,
  } = kpis || {};

  return (
    <div className="reports-kpi-grid">
      <div className="reports-kpi-card">
        <div className="reports-kpi-header">
          <span className="reports-kpi-label">REVENUE</span>
          <div className="reports-kpi-badge reports-kpi-badge--green">
            <Icon name="pos" size={15} />
          </div>
        </div>
        <div className="reports-kpi-value">
          ₦{Number(revenue).toLocaleString()}
        </div>
        <div className="reports-kpi-sub">
          Last 30 days • vs. previous period
        </div>
      </div>

      <div className="reports-kpi-card">
        <div className="reports-kpi-header">
          <span className="reports-kpi-label">TRANSACTIONS</span>
          <div className="reports-kpi-badge reports-kpi-badge--blue">
            <Icon name="receipt" size={15} />
          </div>
        </div>
        <div className="reports-kpi-value">{transactions}</div>
        <div className="reports-kpi-sub">
          {(transactions / 30).toFixed(1)}/day across the selected range
        </div>
      </div>

      <div className="reports-kpi-card">
        <div className="reports-kpi-header">
          <span className="reports-kpi-label">AVERAGE BASKET</span>
          <div className="reports-kpi-badge reports-kpi-badge--amber">
            <Icon name="cart" size={15} />
          </div>
        </div>
        <div className="reports-kpi-value">
          ₦{Math.round(averageBasket).toLocaleString()}
        </div>
        <div className="reports-kpi-sub">
          Revenue divided by transactions
        </div>
      </div>

      <div className="reports-kpi-card">
        <div className="reports-kpi-header">
          <span className="reports-kpi-label">UNITS SOLD</span>
          <div className="reports-kpi-badge reports-kpi-badge--gray">
            <Icon name="inventory" size={15} />
          </div>
        </div>
        <div className="reports-kpi-value">{unitsSold}</div>
        <div className="reports-kpi-sub">
          Total items that left the shelf
        </div>
      </div>
    </div>
  );
}
