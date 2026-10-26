import { useMemo } from 'react';
import { formatCategory } from '../../utils/categories';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/reports.css';

export default function ProductReportTab({
  products = [],
  sales = [],
  searchQuery = '',
  selectedCategory = 'all',
}) {
  const productStats = useMemo(() => {
    const statsMap = {};

    sales.forEach(s => {
      s.items?.forEach(i => {
        const pId = i.product_id || i.product?.id;
        if (!pId) return;
        if (!statsMap[pId]) {
          statsMap[pId] = { unitsSold: 0, revenue: 0, saleCount: 0 };
        }
        const qty = Number(i.quantity) || 1;
        const lineRev = Number(i.line_total || i.total) || (qty * (Number(i.unit_price) || 0));
        statsMap[pId].unitsSold += qty;
        statsMap[pId].revenue += lineRev;
        statsMap[pId].saleCount += 1;
      });
    });

    const q = searchQuery.trim().toLowerCase();

    return products
      .filter(p => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (!q) return true;
        return (
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      })
      .map(p => {
        const perf = statsMap[p.id] || { unitsSold: 0, revenue: 0, saleCount: 0 };
        const velocity =
          perf.unitsSold >= 20 ? 'High' : perf.unitsSold >= 5 ? 'Medium' : perf.unitsSold > 0 ? 'Low' : 'None';
        return {
          ...p,
          unitsSold: perf.unitsSold,
          revenue: perf.revenue,
          saleCount: perf.saleCount,
          velocity,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [products, sales, searchQuery, selectedCategory]);

  const summary = useMemo(() => {
    const totalSold = productStats.reduce((sum, p) => sum + p.unitsSold, 0);
    const totalRev = productStats.reduce((sum, p) => sum + p.revenue, 0);
    const activeProducts = productStats.filter(p => p.unitsSold > 0).length;
    const avgProductRev = productStats.length > 0 ? totalRev / productStats.length : 0;

    return { totalSold, totalRev, activeProducts, avgProductRev };
  }, [productStats]);

  return (
    <div className="reports-tab-body">
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <span className="kpi-label">TOTAL UNITS SOLD</span>
          <strong className="kpi-val text-green">{summary.totalSold.toLocaleString()}</strong>
          <small className="kpi-sub">Across {summary.activeProducts} moving catalog items</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">PRODUCT CATALOG REVENUE</span>
          <strong className="kpi-val">{formatMoney(summary.totalRev)}</strong>
          <small className="kpi-sub">Total product revenue in selected period</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">AVG REVENUE / PRODUCT</span>
          <strong className="kpi-val text-amber">{formatMoney(Math.round(summary.avgProductRev))}</strong>
          <small className="kpi-sub">Average yield across catalogue</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">MOVING PRODUCTS RATIO</span>
          <strong className="kpi-val">
            {productStats.length > 0 ? ((summary.activeProducts / productStats.length) * 100).toFixed(0) : 0}%
          </strong>
          <small className="kpi-sub">{summary.activeProducts} of {productStats.length} items recorded sales</small>
        </div>
      </div>

      <div className="reports-section-card">
        <div className="reports-section-head">
          <h3>Product Sales & Turnover Performance ({productStats.length})</h3>
          <p>Sales volume, generated revenue and stock on hand per product</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th className="text-right">SELL PRICE</th>
                <th className="text-right">UNITS SOLD</th>
                <th className="text-right">TOTAL REVENUE</th>
                <th className="text-right">ON HAND</th>
                <th>VELOCITY</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map(p => {
                const onHand = p.inventory?.quantity ?? 0;
                return (
                  <tr key={p.id}>
                    <td><code className="sku-tag">{p.sku}</code></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="cat-chip">{formatCategory(p.category)}</span></td>
                    <td className="text-right">{formatMoney(p.sell_price)}</td>
                    <td className="text-right"><strong>{p.unitsSold}</strong></td>
                    <td className="text-right"><strong className="text-green">{formatMoney(p.revenue)}</strong></td>
                    <td className="text-right">{onHand}</td>
                    <td>
                      <span className={`velocity-chip velocity-chip--${p.velocity.toLowerCase()}`}>
                        {p.velocity}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {productStats.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-muted">No products matched the filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
