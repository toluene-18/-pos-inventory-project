import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';

export default function InventoryKpis({ stats, isManagement }) {
  return (
    <div className="inventory-stat-cards">
      <div className="inv-stat-card">
        <span className="inv-stat-icon inv-stat-icon--total">
          <Icon name="products" size={18} />
        </span>
        <div className="inv-stat-info">
          <small>Products Tracked</small>
          <strong>{stats.productCount} items</strong>
        </div>
      </div>

      <div className="inv-stat-card">
        <span className="inv-stat-icon inv-stat-icon--units">
          <Icon name="inventory" size={18} />
        </span>
        <div className="inv-stat-info">
          <small>Units on Hand</small>
          <strong>{stats.totalUnits.toLocaleString()} units</strong>
        </div>
      </div>

      {isManagement && (
        <div className="inv-stat-card">
          <span className="inv-stat-icon inv-stat-icon--value">
            <Icon name="money" size={18} />
          </span>
          <div className="inv-stat-info">
            <small>Stock Value (at cost)</small>
            <strong>{formatMoney(stats.stockValueCost)}</strong>
          </div>
        </div>
      )}

      <div className="inv-stat-card">
        <span
          className={`inv-stat-icon ${
            stats.needsAttention > 0 ? 'inv-stat-icon--out' : 'inv-stat-icon--ok'
          }`}
        >
          <Icon name="alert" size={18} />
        </span>
        <div className="inv-stat-info">
          <small>Needs Attention</small>
          <strong className={stats.needsAttention > 0 ? 'text-rose' : 'text-green'}>
            {stats.needsAttention} ({stats.lowStockCount} low, {stats.outOfStockCount} out)
          </strong>
        </div>
      </div>
    </div>
  );
}
