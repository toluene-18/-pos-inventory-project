import { useState, useEffect, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import ReportsKpis from '../components/reports/ReportsKpis';
import ReportsSalesBarChart from '../components/reports/ReportsSalesBarChart';
import ReportsCategoryBreakdown from '../components/reports/ReportsCategoryBreakdown';
import ReportsTopProducts from '../components/reports/ReportsTopProducts';
import { getSalesReport } from '../services/api';
import {
  DEFAULT_REPORT_KPIS,
  DEFAULT_DAILY_SALES,
  DEFAULT_CATEGORIES,
  DEFAULT_TOP_PRODUCTS,
} from '../components/reports/reportsData';
import '../styles/reports.css';
import '../styles/reports-chart.css';
import '../styles/reports-sections.css';

const RANGE_OPTIONS = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: 'all', label: 'All time', days: 365 },
  { id: 'custom', label: 'Custom', days: 30 },
];

export default function Reports({ user, onSessionExpired }) {
  const [activeRange, setActiveRange] = useState('30d');
  const [kpis, setKpis] = useState(DEFAULT_REPORT_KPIS);
  const [dailySales] = useState(DEFAULT_DAILY_SALES);
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [topProducts] = useState(DEFAULT_TOP_PRODUCTS);
  const [, setLoading] = useState(false);
  const [, setError] = useState('');

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchReportsData = useCallback(async () => {
    if (!isManagement) return;
    try {
      setLoading(true);
      const selected = RANGE_OPTIONS.find(r => r.id === activeRange) || RANGE_OPTIONS[1];
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - selected.days);

      const fromStr = fromDate.toISOString().split('T')[0];
      const toStr = toDate.toISOString().split('T')[0];

      const res = await getSalesReport({ from: fromStr, to: toStr });

      if (res && res.summary && res.summary.total_sales > 0) {
        setKpis({
          revenue: Number(res.summary.total_revenue) || DEFAULT_REPORT_KPIS.revenue,
          transactions: Number(res.summary.total_sales) || DEFAULT_REPORT_KPIS.transactions,
          averageBasket:
            Number(res.summary.average_sale_value) || DEFAULT_REPORT_KPIS.averageBasket,
          unitsSold: DEFAULT_REPORT_KPIS.unitsSold,
        });
      }
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      // Keep fallback data if API returns empty
    } finally {
      setLoading(false);
    }
  }, [activeRange, isManagement, onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReportsData();
  }, [fetchReportsData]);

  function handleExportCsv() {
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue (NGN)', kpis.revenue],
      ['Total Transactions', kpis.transactions],
      ['Average Basket (NGN)', kpis.averageBasket],
      ['Total Units Sold', kpis.unitsSold],
      [],
      ['Category Breakdown', 'Amount (NGN)', 'Share (%)'],
      ...categories.map(c => [c.name, c.amount, `${c.percent}%`]),
      [],
      ['Top Products', 'Units Sold', 'Revenue (NGN)'],
      ...topProducts.map(p => [p.name, p.units, p.revenue]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CWG_Retail_Sales_Report_${activeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!isManagement) {
    return (
      <div className="reports-page">
        <div className="reports-alert reports-alert--error">
          <Icon name="alert" size={20} />
          <span>Access Restricted: Reports are only accessible to Store Owners and Managers.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h2>Reports</h2>
          <p>Understand what sells, what sits on the shelf, and how revenue moves over time.</p>
        </div>
      </header>

      <div className="reports-controls-bar">
        <div className="reports-range-pills">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`range-pill-btn ${activeRange === opt.id ? 'range-pill-btn--active' : ''}`}
              onClick={() => setActiveRange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="reports-header-actions">
          <div className="date-indicator-pill">
            <Icon name="clock" size={13} />
            <span>
              {activeRange === '7d' && 'Last 7 days'}
              {activeRange === '30d' && 'Last 30 days'}
              {activeRange === '90d' && 'Last 90 days'}
              {activeRange === 'all' && 'All time'}
              {activeRange === 'custom' && 'Custom range'}
            </span>
          </div>

          <button type="button" className="btn-export" onClick={handleExportCsv}>
            <Icon name="reports" size={14} />
            <span>Export ▾</span>
          </button>
        </div>
      </div>

      <ReportsKpis kpis={kpis} />

      <ReportsSalesBarChart dailyData={dailySales} />

      <div className="reports-bottom-grid">
        <ReportsCategoryBreakdown categories={categories} totalRevenue={kpis.revenue} />
        <ReportsTopProducts products={topProducts} />
      </div>
    </div>
  );
}
