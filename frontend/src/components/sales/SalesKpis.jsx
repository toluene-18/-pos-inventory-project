import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';

export default function SalesKpis({ summary, totalTransactions }) {
  return (
    <div className="sales-stat-cards">
      <div className="sales-stat-card">
        <span className="sales-stat-icon sales-stat-icon--rev">
          <Icon name="money" size={18} />
        </span>
        <div className="sales-stat-info">
          <small>Filtered Revenue ({summary.count} sales)</small>
          <strong>{formatMoney(summary.revenue)}</strong>
        </div>
      </div>

      <div className="sales-stat-card">
        <span className="sales-stat-icon sales-stat-icon--count">
          <Icon name="sales" size={18} />
        </span>
        <div className="sales-stat-info">
          <small>Total Historical Sales</small>
          <strong>{totalTransactions} transactions</strong>
        </div>
      </div>

      <div className="sales-stat-card">
        <span className="sales-stat-icon sales-stat-icon--basket">
          <Icon name="pos" size={18} />
        </span>
        <div className="sales-stat-info">
          <small>Average Basket Size</small>
          <strong>
            {summary.count > 0 ? formatMoney(summary.revenue / summary.count) : '₦0.00'}
          </strong>
        </div>
      </div>
    </div>
  );
}
