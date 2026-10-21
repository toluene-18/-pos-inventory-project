import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';

const METHODS = [
  { id: 'cash', label: 'Cash', icon: 'money' },
  { id: 'card', label: 'Card', icon: 'card' },
  { id: 'bank_transfer', label: 'Transfer', icon: 'transfer' },
];

/** Quick-tender buttons: exact amount plus the next round naira notes. */
function quickAmounts(total) {
  const steps = [500, 1000, 5000, 10000];
  const set = new Set([total]);
  for (const step of steps) {
    const rounded = Math.ceil(total / step) * step;
    if (rounded > total) set.add(rounded);
  }
  return [...set].slice(0, 4);
}

/**
 * PaymentPanel — method picker; for cash, amount tendered + live change.
 * Tendered/change are frontend-only helpers (backend stores method + totals).
 */
function PaymentPanel({ method, onMethod, total, tendered, onTendered }) {
  const tenderedNum = Number(tendered) || 0;
  const change = tenderedNum - total;

  return (
    <div className="pay">
      <p className="pay-label">Payment method</p>
      <div className="pay-methods" role="radiogroup" aria-label="Payment method">
        {METHODS.map(m => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={method === m.id}
            className={`pay-method${method === m.id ? ' active' : ''}`}
            onClick={() => onMethod(m.id)}
          >
            <Icon name={m.icon} size={15} /> {m.label}
          </button>
        ))}
      </div>

      {method === 'cash' && total > 0 && (
        <div className="pay-cash">
          <label>
            <span>Amount received</span>
            <input
              type="number"
              min="0"
              step="50"
              inputMode="decimal"
              value={tendered}
              onChange={e => onTendered(e.target.value)}
              placeholder={String(total)}
            />
          </label>
          <div className="pay-quick">
            {quickAmounts(total).map(a => (
              <button key={a} type="button" onClick={() => onTendered(String(a))}>
                {a === total ? 'Exact' : formatMoney(a).replace('.00', '')}
              </button>
            ))}
          </div>
          {tendered !== '' && (
            <p className={`pay-change${change < 0 ? ' is-short' : ''}`}>
              {change < 0 ? 'Short by' : 'Change due'}
              <strong>{formatMoney(Math.abs(change))}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentPanel;
