export default function ReportsPaymentMethods({ paymentBreakdown = [], totalRevenue = 0 }) {
  const methodTemplates = [
    { method: 'Cash', key: 'cash', color: '#10b981' },
    { method: 'Card', key: 'card', color: '#f59e0b' },
    { method: 'Bank Transfer', key: 'bank_transfer', color: '#6366f1' },
  ];

  const breakdownMap = Object.fromEntries(
    paymentBreakdown.map(p => [p.payment_method, Number(p.revenue) || 0])
  );

  const methods = methodTemplates.map(m => {
    const amount = breakdownMap[m.key] || 0;
    const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
    return {
      ...m,
      amount,
      percent,
    };
  });

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
          <div key={m.key} className="payment-method-card-item">
            <div className="payment-method-header-line">
              <div className="payment-method-left">
                <span className="payment-method-dot" style={{ backgroundColor: m.color }} />
                <span className="payment-method-name">{m.method}</span>
              </div>
              <div className="payment-method-right">
                <strong className="payment-method-amount">₦{m.amount.toLocaleString()}</strong>
                <span className="payment-method-percent-pill">{m.percent}%</span>
              </div>
            </div>
            <div className="payment-method-track">
              <div
                className="payment-method-fill"
                style={{
                  width: `${Math.min(100, Math.max(m.amount > 0 ? 6 : 0, m.percent))}%`,
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
