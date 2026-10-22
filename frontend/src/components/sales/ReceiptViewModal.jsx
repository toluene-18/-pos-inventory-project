import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import { formatMoney, paymentLabel } from '../../utils/dashboardStats';
import '../../styles/receipt.css';

/**
 * ReceiptViewModal — view / reprint any completed sale receipt.
 */
export default function ReceiptViewModal({ sale, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!sale) return null;

  const total = Number(sale.total) || 0;
  const cashierName = sale.user?.name || sale.user?.email || 'Store Cashier';
  const when = sale.created_at
    ? new Date(sale.created_at).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

  return (
    <div className="receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="receipt-modal">
        <div className="receipt-view-header no-print">
          <div className="receipt-view-title">
            <span className="receipt-view-icon">
              <Icon name="sales" size={18} />
            </span>
            <h3 id="receipt-title">Transaction Receipt</h3>
          </div>
          <button type="button" className="receipt-view-close" onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <article className="receipt" id="receipt-print">
          <header>
            <strong>CWG Provisions Store</strong>
            <small>12 Ogui Road, Enugu · +234 803 455 7788</small>
          </header>
          <div className="receipt-meta">
            <span>Receipt #CWG-{String(sale.id).padStart(6, '0')}</span>
            <span>Date: {when}</span>
            <span>Cashier: {cashierName}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(sale.items || []).map(item => (
                <tr key={item.id}>
                  <td>
                    {item.product?.name || `Product #${item.product_id}`}
                    <small>{formatMoney(item.unit_price)} each</small>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(sale.subtotal)}</dd>
            </div>
            <div className="receipt-total">
              <dt>Total Paid</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
            <div>
              <dt>Payment Method</dt>
              <dd>{paymentLabel(sale.payment_method)}</dd>
            </div>
          </dl>
          <footer>Thank you for shopping with us!</footer>
        </article>

        <div className="receipt-actions no-print">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <Icon name="printer" size={16} /> Print Receipt
          </button>
          <button ref={closeRef} type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
