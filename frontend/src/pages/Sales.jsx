import { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import ReceiptViewModal from '../components/sales/ReceiptViewModal';
import { getSales } from '../services/api';
import { formatMoney, paymentLabel } from '../utils/dashboardStats';
import '../styles/sales.css';

export default function Sales({ user, onSessionExpired }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [viewingSale, setViewingSale] = useState(null);

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page };
      if (paymentFilter !== 'all') params.payment_method = paymentFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await getSales(params);
      setSales(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || 0,
      });
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Failed to load sales history.');
    } finally {
      setLoading(false);
    }
  }, [page, paymentFilter, fromDate, toDate, onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSales();
  }, [fetchSales]);

  const summary = useMemo(() => {
    const totalRev = sales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    return { count: sales.length, revenue: totalRev };
  }, [sales]);

  function handleResetFilters() {
    setPaymentFilter('all');
    setFromDate('');
    setToDate('');
    setPage(1);
  }

  return (
    <div className="sales-page">
      <header className="sales-header">
        <div>
          <h2>Sales Transactions</h2>
          <p>
            {isManagement
              ? 'View and inspect all store-wide transactions, receipts, and cashier settlements.'
              : 'View and reprint receipts for transactions you processed.'}
          </p>
        </div>
      </header>

      {error && (
        <div className="sales-alert sales-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <div className="sales-stat-cards">
        <div className="sales-stat-card">
          <span className="sales-stat-icon sales-stat-icon--rev">
            <Icon name="money" size={18} />
          </span>
          <div className="sales-stat-info">
            <small>Page Revenue ({summary.count} sales)</small>
            <strong>{formatMoney(summary.revenue)}</strong>
          </div>
        </div>

        <div className="sales-stat-card">
          <span className="sales-stat-icon sales-stat-icon--count">
            <Icon name="sales" size={18} />
          </span>
          <div className="sales-stat-info">
            <small>Total Historical Sales</small>
            <strong>{pagination.total} transactions</strong>
          </div>
        </div>
      </div>

      <div className="sales-filters-bar">
        <div className="sales-filter-group">
          <label htmlFor="sales-pay-filter">Payment:</label>
          <select
            id="sales-pay-filter"
            value={paymentFilter}
            onChange={e => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Transfer</option>
          </select>
        </div>

        <div className="sales-filter-group">
          <label htmlFor="sales-from">From:</label>
          <input
            id="sales-from"
            type="date"
            value={fromDate}
            onChange={e => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="sales-filter-group">
          <label htmlFor="sales-to">To:</label>
          <input
            id="sales-to"
            type="date"
            value={toDate}
            onChange={e => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {(paymentFilter !== 'all' || fromDate || toDate) && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
            Reset Filters
          </button>
        )}
      </div>

      <div className="sales-table-container">
        {loading ? (
          <div className="sales-loading">Loading transactions...</div>
        ) : sales.length === 0 ? (
          <div className="sales-empty">
            <Icon name="sales" size={32} />
            <p>No sales found for the selected filters.</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Date & Time</th>
                {isManagement && <th>Cashier</th>}
                <th>Items Count</th>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => {
                const itemCount = (s.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
                const when = new Date(s.created_at).toLocaleString('en-GB', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <tr key={s.id}>
                    <td>
                      <span className="sales-receipt-badge">
                        #CWG-{String(s.id).padStart(6, '0')}
                      </span>
                    </td>
                    <td>{when}</td>
                    {isManagement && (
                      <td>
                        <span className="sales-cashier-cell">
                          {s.user?.name || s.user?.email || `Staff #${s.user_id}`}
                        </span>
                      </td>
                    )}
                    <td>{itemCount} {itemCount === 1 ? 'item' : 'items'}</td>
                    <td>
                      <span className={`sales-pay-pill sales-pay-pill--${s.payment_method}`}>
                        {paymentLabel(s.payment_method)}
                      </span>
                    </td>
                    <td>
                      <strong className="sales-total-val">{formatMoney(s.total)}</strong>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingSale(s)}
                      >
                        <Icon name="printer" size={14} /> View Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pagination.last_page > 1 && (
        <div className="sales-pagination">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span>Page {pagination.current_page} of {pagination.last_page}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page >= pagination.last_page}
            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
          >
            Next →
          </button>
        </div>
      )}

      {viewingSale && (
        <ReceiptViewModal
          sale={viewingSale}
          onClose={() => setViewingSale(null)}
        />
      )}
    </div>
  );
}
