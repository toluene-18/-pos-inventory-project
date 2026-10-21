import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import { formatMoney, paymentLabel } from '../../utils/dashboardStats';
import '../../styles/receipt.css';

/** ReceiptModal — success screen with a printable receipt. */
function ReceiptModal({ sale, cashier, tendered, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const total = Number(sale.total);
  const paid = sale.payment_method === 'cash' && tendered ? Number(tendered) : null;
  const when = new Date(sale.created_at).toLocaleString('en-GB', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return (
    <div className="receipt-backdrop" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="receipt-modal">
        <div className="receipt-success no-print">
          <span><Icon name="check" size={22} /></span>
          <h2 id="receipt-title">Sale completed</h2>
          <p>Stock has been updated automatically.</p>
        </div>

        <article className="receipt" id="receipt-print">
          <header>
            <strong>CWG Provisions Store</strong>
            <small>12 Ogui Road, Enugu · +234 803 455 7788</small>
          </header>
          <div className="receipt-meta">
            <span>Receipt #CWG-{String(sale.id).padStart(6, '0')}</span>
            <span>{when}</span>
            <span>Cashier: {cashier}</span>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              {sale.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product?.name}<small>{formatMoney(item.unit_price)} each</small></td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatMoney(sale.subtotal)}</dd></div>
            <div className="receipt-total"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
            <div><dt>Paid by</dt><dd>{paymentLabel(sale.payment_method)}</dd></div>
            {paid !== null && (
              <>
                <div><dt>Cash received</dt><dd>{formatMoney(paid)}</dd></div>
                <div><dt>Change</dt><dd>{formatMoney(Math.max(paid - total, 0))}</dd></div>
              </>
            )}
          </dl>
          <footer>Thank you for shopping with us!</footer>
        </article>

        <div className="receipt-actions no-print">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <Icon name="printer" size={16} /> Print receipt
          </button>
          <button ref={closeRef} type="button" className="btn btn-primary" onClick={onClose}>
            <Icon name="plus" size={16} /> New sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
