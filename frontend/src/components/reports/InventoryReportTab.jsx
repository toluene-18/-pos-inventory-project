import { useMemo } from 'react';
import { formatCategory } from '../../utils/categories';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/reports.css';

export default function InventoryReportTab({
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
    let totalItems = filteredProducts.length;
    let totalUnits = 0;
    let totalCostVal = 0;
    let totalSellVal = 0;

    filteredProducts.forEach(p => {
      const qty = p.inventory?.quantity ?? 0;
      const cost = Number(p.cost_price) || 0;
      const sell = Number(p.sell_price) || 0;
      totalUnits += qty;
      totalCostVal += cost * qty;
      totalSellVal += sell * qty;
    });

    const potentialProfit = Math.max(0, totalSellVal - totalCostVal);
    const marginPercent = totalSellVal > 0 ? ((potentialProfit / totalSellVal) * 100).toFixed(1) : '0.0';

    return {
      totalItems,
      totalUnits,
      totalCostVal,
      totalSellVal,
      potentialProfit,
      marginPercent,
    };
  }, [filteredProducts]);

  return (
    <div className="reports-tab-body">
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <span className="kpi-label">TOTAL CATALOG ITEMS</span>
          <strong className="kpi-val">{stats.totalItems}</strong>
          <small className="kpi-sub">{stats.totalUnits.toLocaleString()} total units on shelf</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">TOTAL STOCK VALUE (COST)</span>
          <strong className="kpi-val text-green">{formatMoney(stats.totalCostVal)}</strong>
          <small className="kpi-sub">Total capital tied up in inventory</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">RETAIL VALUE (POTENTIAL)</span>
          <strong className="kpi-val">{formatMoney(stats.totalSellVal)}</strong>
          <small className="kpi-sub">Expected sales return when fully sold</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">PROJECTED GROSS MARGIN</span>
          <strong className="kpi-val text-amber">{stats.marginPercent}%</strong>
          <small className="kpi-sub">{formatMoney(stats.potentialProfit)} projected gross profit</small>
        </div>
      </div>

      <div className="reports-section-card">
        <div className="reports-section-head">
          <h3>Stock Valuation & Margin Breakdown ({filteredProducts.length})</h3>
          <p>Product cost prices, selling rates and inventory assets on record</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th className="text-right">STOCK QTY</th>
                <th className="text-right">COST PRICE</th>
                <th className="text-right">SELL PRICE</th>
                <th className="text-right">TOTAL COST</th>
                <th className="text-right">RETAIL VALUE</th>
                <th className="text-right">MARGIN %</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const qty = p.inventory?.quantity ?? 0;
                const cost = Number(p.cost_price) || 0;
                const sell = Number(p.sell_price) || 0;
                const lineCost = cost * qty;
                const lineSell = sell * qty;
                const margin = sell > 0 ? (((sell - cost) / sell) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={p.id}>
                    <td><code className="sku-tag">{p.sku}</code></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="cat-chip">{formatCategory(p.category)}</span></td>
                    <td className="text-right"><strong>{qty}</strong></td>
                    <td className="text-right">{cost ? formatMoney(cost) : '—'}</td>
                    <td className="text-right">{formatMoney(sell)}</td>
                    <td className="text-right">{cost ? formatMoney(lineCost) : '—'}</td>
                    <td className="text-right"><strong>{formatMoney(lineSell)}</strong></td>
                    <td className="text-right"><span className="text-green font-semibold">{margin}%</span></td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-muted">No inventory records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
