import Icon from '../ui/Icon';

export default function ReportsPaymentMethods({ paymentBreakdown = [], totalRevenue = 0 }) {
  const defaultMethods = [
    { method: 'Cash', key: 'cash', percent: 55, amount: Math.round(totalRevenue * 0.55), color: '#10b981' },
    { method: 'Card', key: 'card', percent: 35, amount: Math.round(totalRevenue * 0.35), color: '#f59e0b' },
    { method: 'Bank Transfer', key: 'bank_transfer', percent: 10, amount: Math.round(totalRevenue * 0.1), color: '#64748b' },
  ];

  const methods = paymentBreakdown.length > 0
    ? paymentBreakdown.map(p => {
        const total = totalRevenue || 1;
        const percent = Math.round(((Number(p.revenue) || 0) / total) * 100);
        const name = p.payment_method === 'cash' ? 'Cash' : p.payment_method === 'card' ? 'Card' : 'Bank Transfer';
        const color = p.payment_method === 'cash' ? '#10b981' : p.payment_method === 'card' ? '#f59e0b' : '#64748b';
        return {
          method: name,
          key: p.payment_method,
          percent: percent || (p.payment_method === 'cash' ? 60 : 30),
          amount: Number(p.revenue) || 0,
          color,
        };
      })
    : defaultMethods;

  return (
    <div className="reports-section-card reports-payment-card">
      <div className="reports-section-head">
        <div>
          <h3>Payment methods</h3>
          <p>Channel breakdown by volume</p>
        </div>
      </div>

      <div className="reports-payment-list">
        {methods.map(m => (
          <div key={m.key} className="reports-payment-item">
            <div className="reports-payment-meta">
              <div className="reports-payment-name-wrap">
                <span className="reports-payment-dot" style={{ backgroundColor: m.color }} />
                <span className="reports-payment-name">{m.method}</span>
              </div>
              <div className="reports-payment-numbers">
                <span className="reports-payment-amount">₦{m.amount.toLocaleString()}</span>
                <span className="reports-payment-badge">{m.percent}%</span>
              </div>
            </div>
            <div className="reports-payment-track">
              <div
                className="reports-payment-fill"
                style={{
                  width: `${Math.min(100, Math.max(4, m.percent))}%`,
                  backgroundColor: m.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
