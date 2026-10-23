import Icon from '../ui/Icon';

export default function ProductKpis({ stats, isManagement }) {
  return (
    <div className="product-stat-cards">
      <div className="prod-stat-card">
        <span className="prod-stat-icon prod-stat-icon--total">
          <Icon name="products" size={18} />
        </span>
        <div className="prod-stat-info">
          <small>Total Products</small>
          <strong>{stats.totalProducts} items</strong>
        </div>
      </div>

      {isManagement && (
        <div className="prod-stat-card">
          <span className="prod-stat-icon prod-stat-icon--margin">
            <Icon name="money" size={18} />
          </span>
          <div className="prod-stat-info">
            <small>Average Margin</small>
            <strong className="text-green">+{stats.avgMargin}%</strong>
          </div>
        </div>
      )}

      <div className="prod-stat-card">
        <span
          className={`prod-stat-icon ${
            stats.needsAttention > 0 ? 'prod-stat-icon--warn' : 'prod-stat-icon--ok'
          }`}
        >
          <Icon name="alert" size={18} />
        </span>
        <div className="prod-stat-info">
          <small>Needs Attention</small>
          <strong className={stats.needsAttention > 0 ? 'text-amber' : 'text-green'}>
            {stats.needsAttention} items
          </strong>
        </div>
      </div>

      {isManagement && (
        <div className="prod-stat-card">
          <span
            className={`prod-stat-icon ${
              stats.belowCostCount > 0 ? 'prod-stat-icon--danger' : 'prod-stat-icon--ok'
            }`}
          >
            <Icon name="x" size={18} />
          </span>
          <div className="prod-stat-info">
            <small>Priced Below Cost</small>
            <strong className={stats.belowCostCount > 0 ? 'text-rose' : 'text-muted'}>
              {stats.belowCostCount}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
