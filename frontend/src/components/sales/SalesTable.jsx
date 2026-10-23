import Icon from '../ui/Icon';
import '../../styles/sales-table.css';

export default function SalesTable({
  sales = [],
  loading,
  expandedIds,
  onToggleExpand,
  onViewSale,
}) {
  if (loading) {
    return <div className="sales-loading">Loading transactions...</div>;
  }

  if (sales.length === 0) {
    return (
      <div className="sales-empty">
        <Icon name="sales" size={32} />
        <p>No sales found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <table className="sales-table">
      <thead>
        <tr>
          <th style={{ width: '40px' }} />
          <th>RECEIPT</th>
          <th>CASHIER</th>
          <th>ITEMS</th>
          <th>PAYMENT</th>
          <th>TOTAL</th>
          <th style={{ textAlign: 'right' }}>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {sales.map(s => {
          const isExpanded = expandedIds.has(s.id);
          const itemsCount = (s.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0);
          const firstItem = s.items?.[0]?.product?.name || 'Item';
          const extraCount = (s.items?.length || 1) - 1;
          const itemsDesc = extraCount > 0 ? `${firstItem} +${extraCount} more` : firstItem;
          const when = new Date(s.created_at).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const initials = (s.user?.name || 'S')
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <tr key={s.id}>
              <td>
                <button
                  type="button"
                  className="btn-toggle-expand"
                  onClick={() => onToggleExpand(s.id)}
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </td>
              <td>
                <div className="sales-receipt-meta">
                  <span className="sales-receipt-id">CWG-{String(s.id).padStart(5, '0')}</span>
                  <span className="sales-receipt-time">{when}</span>
                </div>
              </td>
              <td>
                <div className="sales-cashier-cell">
                  <span className="sales-cashier-avatar">{initials}</span>
                  <span>{s.user?.name || 'Staff'}</span>
                </div>
              </td>
              <td>
                <div className="sales-items-cell">
                  <span className="sales-items-count">{itemsCount} units</span>
                  <span className="sales-items-desc">{itemsDesc}</span>
                </div>
              </td>
              <td>
                <span className={`sales-method-pill sales-method-pill--${s.payment_method}`}>
                  {s.payment_method === 'cash' ? '● Cash' : s.payment_method === 'card' ? '💳 Card' : 'Bank transfer'}
                </span>
              </td>
              <td>
                <span className="sales-total-amount">₦{Number(s.total).toLocaleString()}</span>
              </td>
              <td>
                <div className="sales-action-btns">
                  <button
                    type="button"
                    className="btn-sales-view"
                    onClick={() => onViewSale(s)}
                  >
                    <Icon name="eye" size={13} /> View
                  </button>
                  <button
                    type="button"
                    className="btn-sales-print"
                    onClick={() => onViewSale(s)}
                    title="Print receipt"
                  >
                    <Icon name="printer" size={13} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
