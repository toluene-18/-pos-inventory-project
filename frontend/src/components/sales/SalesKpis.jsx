import Icon from '../ui/Icon';

function formatCompact(num) {
  const n = Number(num) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return `${n.toLocaleString()}`;
}

export default function SalesKpis({
  revenue = 0,
  transactionsCount = 0,
  averageBasket = 0,
  unitsSold = 0,
  cashPercent = 33,
  periodLabel = 'All time',
}) {
  return (
    <div className="sales-kpis-grid">
      {/* 1. REVENUE */}
      <div className="sales-kpi-card">
        <div className="sales-kpi-head">
          <span className="sales-kpi-title">REVENUE</span>
          <span className="sales-kpi-badge sales-kpi-badge--green">
            <Icon name="money" size={15} />
          </span>
        </div>
        <div className="sales-kpi-val">₦{Number(revenue).toLocaleString()}</div>
        <div className="sales-kpi-sub">
          ₦{formatCompact(revenue)} across the selected period
        </div>
      </div>

      {/* 2. TRANSACTIONS */}
      <div className="sales-kpi-card">
        <div className="sales-kpi-head">
          <span className="sales-kpi-title">TRANSACTIONS</span>
          <span className="sales-kpi-badge sales-kpi-badge--dark">
            <Icon name="sales" size={15} />
          </span>
        </div>
        <div className="sales-kpi-val">{transactionsCount}</div>
        <div className="sales-kpi-sub">{periodLabel}</div>
      </div>

      {/* 3. AVERAGE BASKET */}
      <div className="sales-kpi-card">
        <div className="sales-kpi-head">
          <span className="sales-kpi-title">AVERAGE BASKET</span>
          <span className="sales-kpi-badge sales-kpi-badge--dark">
            <Icon name="pos" size={15} />
          </span>
        </div>
        <div className="sales-kpi-val">₦{Math.round(averageBasket).toLocaleString()}</div>
        <div className="sales-kpi-sub">Spend per completed sale</div>
      </div>

      {/* 4. UNITS SOLD */}
      <div className="sales-kpi-card">
        <div className="sales-kpi-head">
          <span className="sales-kpi-title">UNITS SOLD</span>
          <span className="sales-kpi-badge sales-kpi-badge--amber">
            <Icon name="inventory" size={15} />
          </span>
        </div>
        <div className="sales-kpi-val">{unitsSold}</div>
        <div className="sales-kpi-sub">
          {cashPercent}% of revenue taken in cash
        </div>
      </div>
    </div>
  );
}
