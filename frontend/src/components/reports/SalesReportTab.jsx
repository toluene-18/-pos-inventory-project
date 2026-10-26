import { useMemo } from 'react';
import ReportsKpis from './ReportsKpis';
import ReportsSalesBarChart from './ReportsSalesBarChart';
import ReportsCategoryBreakdown from './ReportsCategoryBreakdown';
import ReportsTopProducts from './ReportsTopProducts';
import ReportsPaymentMethods from './ReportsPaymentMethods';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/reports.css';
import '../../styles/reports-chart.css';
import '../../styles/reports-sections.css';

export default function SalesReportTab({
  sales = [],
  kpis,
  dailySales,
  periodTitle = 'Daily revenue',
  categories = [],
  topProducts = [],
  paymentBreakdown = [],
  searchQuery = '',
  selectedCategory = 'all',
}) {
  const filteredSales = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sales.filter(s => {
      if (selectedCategory !== 'all') {
        const hasCat = s.items?.some(i => i.product?.category === selectedCategory);
        if (!hasCat) return false;
      }
      if (!q) return true;
      const receiptMatch = String(s.id).includes(q) || (s.receipt_number && String(s.receipt_number).toLowerCase().includes(q));
      const cashierMatch = s.user?.name?.toLowerCase().includes(q) || s.user?.email?.toLowerCase().includes(q);
      const itemMatch = s.items?.some(i => i.product?.name?.toLowerCase().includes(q) || i.product?.sku?.toLowerCase().includes(q));
      return receiptMatch || cashierMatch || itemMatch;
    });
  }, [sales, searchQuery, selectedCategory]);

  return (
    <div className="reports-tab-body">
      <ReportsKpis kpis={kpis} />

      <div className="reports-two-col-grid">
        <div className="reports-col-chart">
          <ReportsSalesBarChart dailyData={dailySales} periodTitle={periodTitle} />
        </div>
        <div className="reports-col-side">
          <ReportsCategoryBreakdown categories={categories} />
        </div>
      </div>

      <div className="reports-two-col-grid">
        <div className="reports-col-chart">
          <ReportsTopProducts products={topProducts} />
        </div>
        <div className="reports-col-side">
          <ReportsPaymentMethods paymentBreakdown={paymentBreakdown} totalRevenue={kpis?.revenue || 0} />
        </div>
      </div>

      <div className="reports-table-card">
        <div className="reports-section-head">
          <h3>Filtered Sales Transactions ({filteredSales.length})</h3>
          <p>Recent checkout operations matching selected filters</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>RECEIPT</th>
                <th>DATE & TIME</th>
                <th>CASHIER</th>
                <th>ITEMS</th>
                <th>PAYMENT</th>
                <th className="text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.slice(0, 50).map(s => (
                <tr key={s.id}>
                  <td><strong>#{s.receipt_number || String(s.id).padStart(5, '0')}</strong></td>
                  <td>{new Date(s.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{s.user?.name || 'Staff'}</td>
                  <td>{s.items?.length || 1} line item(s)</td>
                  <td>
                    <span className={`method-badge method-badge--${s.payment_method}`}>
                      {s.payment_method ? s.payment_method.replace('_', ' ') : 'cash'}
                    </span>
                  </td>
                  <td className="text-right"><strong>{formatMoney(s.total)}</strong></td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-muted">No sales matched the specified filter criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
