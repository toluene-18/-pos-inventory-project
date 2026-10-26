import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import ProductThumbnail from '../ui/ProductThumbnail';
import { getSales } from '../../services/api';
import { formatCategory } from '../../utils/categories';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/inventory-modal.css';
import '../../styles/inventory-sales-modal.css';

export default function ProductSalesModal({ product, isOpen, onClose }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !product?.id) {
      setSales([]);
      return;
    }

    let isMounted = true;
    async function fetchSales() {
      try {
        setLoading(true);
        setError('');
        const res = await getSales({ product_id: product.id, all: true });
        const list = Array.isArray(res.data) ? res.data : [];
        if (isMounted) setSales(list);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load sales history');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSales();
    return () => {
      isMounted = false;
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const currentStock = product.inventory?.quantity ?? 0;

  let totalUnitsSold = 0;
  let totalRevenue = 0;

  const salesRows = [];
  sales.forEach(s => {
    const matchedItems = s.items?.filter(i => String(i.product_id) === String(product.id)) || [];
    matchedItems.forEach(item => {
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.unit_price) || Number(product.sell_price) || 0;
      const lineTotal = Number(item.line_total || item.total) || qty * unitPrice;
      totalUnitsSold += qty;
      totalRevenue += lineTotal;
      salesRows.push({
        id: `${s.id}-${item.id || Math.random()}`,
        receipt: s.receipt_number || String(s.id).padStart(5, '0'),
        date: s.created_at,
        cashier: s.user?.name || 'Cashier',
        paymentMethod: s.payment_method || 'cash',
        quantity: qty,
        unitPrice,
        lineTotal,
      });
    });
  });

  return (
    <div className="restock-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="restock-modal-card prod-sales-modal-card" onClick={e => e.stopPropagation()}>
        <div className="restock-modal-head">
          <div className="restock-modal-icon-badge">
            <Icon name="sales" size={17} />
          </div>
          <div className="restock-modal-titles">
            <h3>Sales History</h3>
            <p>Order transactions recorded for this product</p>
          </div>
          <button type="button" className="restock-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="prod-sales-summary-card">
          <ProductThumbnail src={product.image_path} name={product.name} className="prod-sales-thumb" />
          <div className="prod-sales-info">
            <h4>{product.name}</h4>
            <div className="prod-sales-meta">
              <code>{product.sku}</code>
              <span>&bull;</span>
              <span>{formatCategory(product.category)}</span>
              <span>&bull;</span>
              <span>{formatMoney(product.sell_price)}</span>
            </div>
          </div>
          <div className="prod-sales-stock-badge">
            <strong>{currentStock}</strong>
            <small>in stock</small>
          </div>
        </div>

        <div className="prod-sales-kpis-mini">
          <div className="sales-mini-kpi">
            <span>UNITS SOLD</span>
            <strong>{totalUnitsSold}</strong>
          </div>
          <div className="sales-mini-kpi">
            <span>TOTAL REVENUE</span>
            <strong className="text-green">{formatMoney(totalRevenue)}</strong>
          </div>
          <div className="sales-mini-kpi">
            <span>TRANSACTIONS</span>
            <strong>{salesRows.length}</strong>
          </div>
        </div>

        <div className="prod-sales-table-container">
          {loading ? (
            <div className="prod-sales-loading">Loading sales history...</div>
          ) : error ? (
            <div className="prod-sales-error">{error}</div>
          ) : salesRows.length === 0 ? (
            <div className="prod-sales-empty">
              <Icon name="receipt" size={28} />
              <p>No sales recorded for this product yet.</p>
              <small>Once transactions occur at POS, checkout receipts will appear here.</small>
            </div>
          ) : (
            <table className="prod-sales-table">
              <thead>
                <tr>
                  <th>RECEIPT</th>
                  <th>DATE & TIME</th>
                  <th>CASHIER</th>
                  <th className="text-right">QTY</th>
                  <th className="text-right">PRICE</th>
                  <th className="text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {salesRows.map(row => (
                  <tr key={row.id}>
                    <td><strong>#{row.receipt}</strong></td>
                    <td>{new Date(row.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{row.cashier}</td>
                    <td className="text-right"><strong>{row.quantity}</strong></td>
                    <td className="text-right">{formatMoney(row.unitPrice)}</td>
                    <td className="text-right"><strong className="text-green">{formatMoney(row.lineTotal)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="restock-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
