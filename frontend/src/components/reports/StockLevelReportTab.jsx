import { useMemo } from 'react';
import { formatCategory } from '../../utils/categories';
import Icon from '../ui/Icon';
import '../../styles/reports.css';

export default function StockLevelReportTab({
  products = [],
  searchQuery = '',
  selectedCategory = 'all',
}) {
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    let healthyCount = 0;
    let lowCount = 0;
    let outCount = 0;
    let totalDeficit = 0;

    filteredProducts.forEach(p => {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;
      if (qty <= 0) {
        outCount += 1;
        totalDeficit += threshold + 10;
      } else if (qty <= threshold) {
        lowCount += 1;
        totalDeficit += (threshold - qty) + 5;
      } else {
        healthyCount += 1;
      }
    });

    const total = filteredProducts.length;
    const healthRatio = total > 0 ? ((healthyCount / total) * 100).toFixed(0) : 100;

    return { healthyCount, lowCount, outCount, totalDeficit, healthRatio };
  }, [filteredProducts]);

  return (
    <div className="reports-tab-body">
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <span className="kpi-label">STOCK HEALTH RATIO</span>
          <strong className="kpi-val text-green">{stats.healthRatio}%</strong>
          <small className="kpi-sub">{stats.healthyCount} items in healthy stock levels</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">LOW STOCK WARNINGS</span>
          <strong className="kpi-val text-amber">{stats.lowCount}</strong>
          <small className="kpi-sub">Items at or below reorder threshold</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">OUT OF STOCK (URGENT)</span>
          <strong className="kpi-val text-rose">{stats.outCount}</strong>
          <small className="kpi-sub">Products with zero shelves inventory</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">RECOMMENDED REORDER UNITS</span>
          <strong className="kpi-val">+{stats.totalDeficit}</strong>
          <small className="kpi-sub">Total restock units needed for stability</small>
        </div>
      </div>

      <div className="reports-section-card">
        <div className="reports-section-head">
          <h3>Stock Level Audit & Reorder Deficits ({filteredProducts.length})</h3>
          <p>Real-time inventory levels against minimum safety thresholds</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th className="text-right">CURRENT STOCK</th>
                <th className="text-right">REORDER AT</th>
                <th className="text-right">DEFICIT / SHORTFALL</th>
                <th>URGENCY</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const qty = p.inventory?.quantity ?? 0;
                const threshold = p.inventory?.reorder_threshold ?? 0;
                const isOut = qty <= 0;
                const isLow = qty <= threshold && qty > 0;
                const deficit = isOut ? threshold + 10 : isLow ? (threshold - qty) + 5 : 0;

                return (
                  <tr key={p.id}>
                    <td>
                      <span className={`prod-status-chip ${isOut ? 'prod-status-chip--out' : isLow ? 'prod-status-chip--low' : 'prod-status-chip--ok'}`}>
                        <Icon name={isOut ? 'close' : isLow ? 'alert' : 'check'} size={11} />
                        <span>{isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy'}</span>
                      </span>
                    </td>
                    <td><code className="sku-tag">{p.sku}</code></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="cat-chip">{formatCategory(p.category)}</span></td>
                    <td className="text-right"><strong className={isOut ? 'text-rose' : isLow ? 'text-amber' : ''}>{qty}</strong></td>
                    <td className="text-right">{threshold}</td>
                    <td className="text-right">
                      {deficit > 0 ? <strong className="text-rose">+{deficit} units</strong> : <span className="text-muted">0</span>}
                    </td>
                    <td>
                      <span className={`urgency-badge urgency-badge--${isOut ? 'high' : isLow ? 'med' : 'low'}`}>
                        {isOut ? 'Restock Immediately' : isLow ? 'Order Soon' : 'Adequate'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
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
