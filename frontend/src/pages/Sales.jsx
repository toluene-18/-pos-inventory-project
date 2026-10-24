import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import ReceiptViewModal from '../components/sales/ReceiptViewModal';
import SalesKpis from '../components/sales/SalesKpis';
import SalesTable from '../components/sales/SalesTable';
import { getSales } from '../services/api';
import '../styles/sales.css';

function toYmd(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Sales({ user }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [cashierFilter, setCashierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [timePreset, setTimePreset] = useState('all');
  const [search, setSearch] = useState('');
  const [viewingSale, setViewingSale] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (paymentFilter !== 'all') params.payment_method = paymentFilter;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await getSales(params);
      setSales(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load sales history.');
    } finally {
      setLoading(false);
    }
  }, [paymentFilter, fromDate, toDate]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  function handlePreset(preset) {
    setTimePreset(preset);
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

  const cashiersList = useMemo(() => {
    const names = new Set(sales.map(s => s.user?.name).filter(Boolean));
    return ['all', ...Array.from(names)];
  }, [sales]);

  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = sales.filter(s => {
      if (cashierFilter !== 'all' && s.user?.name !== cashierFilter) return false;
      if (!q) return true;
      const receiptStr = `cwg-${String(s.id).padStart(5, '0')}`;
      const cashierName = s.user?.name?.toLowerCase() || '';
      const itemsMatch = (s.items || []).some(i => i.product?.name?.toLowerCase().includes(q));
      return receiptStr.includes(q) || cashierName.includes(q) || itemsMatch;
    });

    result.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'highest') return (Number(b.total) || 0) - (Number(a.total) || 0);
      if (sortBy === 'lowest') return (Number(a.total) || 0) - (Number(b.total) || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }, [sales, search, cashierFilter, sortBy]);

  const stats = useMemo(() => {
    let rev = 0;
    let units = 0;
    let cashRev = 0;

    for (const s of filteredSales) {
      const val = Number(s.total) || 0;
      rev += val;
      if (s.payment_method === 'cash') cashRev += val;
      for (const item of s.items || []) {
        units += Number(item.quantity) || 0;
      }
    }

    const count = filteredSales.length;
    const avg = count > 0 ? rev / count : 0;
    const cashPct = rev > 0 ? Math.round((cashRev / rev) * 100) : 0;

    return { rev, count, avg, units, cashPct };
  }, [filteredSales]);

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpandAll() {
    if (expandedIds.size === filteredSales.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredSales.map(s => s.id)));
    }
  }

  return (
    <div className="sales-page">
      <header className="sales-page-header">
        <div>
          <h2>Sales history</h2>
          <p>Every transaction across the store, filtered by date, cashier and payment method.</p>
        </div>
        <Link to="/pos" className="btn-new-sale">
          <Icon name="plus" size={14} />
          <span>New sale</span>
        </Link>
      </header>

      {error && (
        <div className="sales-alert sales-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <SalesKpis
        revenue={stats.rev}
        transactionsCount={stats.count}
        averageBasket={stats.avg}
        unitsSold={stats.units}
        cashPercent={stats.cashPct}
        periodLabel={timePreset === 'all' ? 'All time' : timePreset}
      />

      <div className="sales-filter-card">
        <div className="sales-filter-top-row">
          <div className="sales-search-bar">
            <Icon name="search" size={15} />
            <input
              type="text"
              placeholder="Search receipt no., cashier or product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {isManagement && (
            <select
              value={cashierFilter}
              onChange={e => setCashierFilter(e.target.value)}
              className="sales-select-filter"
            >
              <option value="all">All cashiers</option>
              {cashiersList.filter(c => c !== 'all').map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}

          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="sales-select-filter"
          >
            <option value="all">All methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank transfer</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sales-select-filter"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest total</option>
            <option value="lowest">Lowest total</option>
          </select>
        </div>

        <div className="sales-date-pills">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 days' },
            { id: '30d', label: '30 days' },
            { id: 'all', label: 'All time' },
          ].map(p => (
            <button
              key={p.id}
              type="button"
              className={`sales-date-pill ${timePreset === p.id ? 'sales-date-pill--active' : ''}`}
              onClick={() => handlePreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sales-table-subhead">
        <span>SHOWING {filteredSales.length} OF {sales.length} TRANSACTIONS · ALL TIME</span>
        <button type="button" className="sales-expand-all-btn" onClick={toggleExpandAll}>
          {expandedIds.size === filteredSales.length ? '- Collapse all' : '+ Expand all'}
        </button>
      </div>

      <div className="sales-table-wrap">
        <SalesTable
          sales={filteredSales}
          loading={loading}
          expandedIds={expandedIds}
          onToggleExpand={toggleExpand}
          onViewSale={setViewingSale}
        />
      </div>

      {viewingSale && (
        <ReceiptViewModal
          sale={viewingSale}
          onClose={() => setViewingSale(null)}
        />
      )}
    </div>
  );
}
