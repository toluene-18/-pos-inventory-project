import { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import ReceiptViewModal from '../components/sales/ReceiptViewModal';
import SalesKpis from '../components/sales/SalesKpis';
import { getSales } from '../services/api';
import { formatMoney, paymentLabel } from '../utils/dashboardStats';
import '../styles/sales.css';

function toYmd(date) {
  return date.toISOString().slice(0, 10);
}

export default function Sales({ user, onSessionExpired }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [timePreset, setTimePreset] = useState('all');
  const [search, setSearch] = useState('');
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

  function handlePreset(preset) {
    setTimePreset(preset);
    setPage(1);
    const now = new Date();
    if (preset === 'today') {
      const todayStr = toYmd(now);
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === '7d') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFromDate(toYmd(past));
      setToDate(toYmd(now));
    } else if (preset === '30d') {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      setFromDate(toYmd(past));
      setToDate(toYmd(now));
    } else {
      setFromDate('');
      setToDate('');
    }
  }

  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(s => {
      const idStr = String(s.id);
      const cashier = s.user?.name?.toLowerCase() || '';
      return idStr.includes(q) || cashier.includes(q);
    });
  }, [sales, search]);

  const summary = useMemo(() => {
    const totalRev = filteredSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    return { count: filteredSales.length, revenue: totalRev };
  }, [filteredSales]);

  return (
    <div className="sales-page">
      <header className="sales-header">
        <div>
          <h2>Sales Transactions</h2>
          <p>
            {isManagement
              ? 'View and inspect store-wide transactions, receipts, and cashier settlements.'
              : 'View and reprint receipts for transactions you processed.'}
          </p>
        </div>
      </header>

      {error && (
        <div className="sales-alert sales-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <SalesKpis summary={summary} totalTransactions={pagination.total} />

      <div className="sales-controls-card">
        <div className="sales-preset-pills">
          <button
            type="button"
            className={`preset-btn ${timePreset === 'all' ? 'preset-btn--active' : ''}`}
            onClick={() => handlePreset('all')}
          >
            All Time
          </button>
          <button
            type="button"
            className={`preset-btn ${timePreset === 'today' ? 'preset-btn--active' : ''}`}
            onClick={() => handlePreset('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`preset-btn ${timePreset === '7d' ? 'preset-btn--active' : ''}`}
            onClick={() => handlePreset('7d')}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            className={`preset-btn ${timePreset === '30d' ? 'preset-btn--active' : ''}`}
            onClick={() => handlePreset('30d')}
          >
            Last 30 Days
          </button>
        </div>

        <div className="sales-filter-row">
          <input
            type="search"
            placeholder="Search by receipt ID or cashier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="sales-search-input"
          />

          <select
            value={paymentFilter}
            onChange={e => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="sales-select"
          >
            <option value="all">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Transfer</option>
          </select>
        </div>
      </div>

      <div className="sales-table-container">
        {loading ? (
          <div className="sales-loading">Loading transactions...</div>
        ) : filteredSales.length === 0 ? (
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
              {filteredSales.map(s => {
                const itemCount = (s.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
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
