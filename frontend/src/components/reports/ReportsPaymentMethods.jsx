export default function ReportsPaymentMethods({ paymentBreakdown = [], totalRevenue = 0 }) {
  const methodTemplates = [
    { method: 'Cash', key: 'cash', color: '#10b981' },
    { method: 'Card', key: 'card', color: '#f59e0b' },
    { method: 'Bank Transfer', key: 'bank_transfer', color: '#64748b' },
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
                  width: `${Math.min(100, Math.max(m.percent > 0 ? 4 : 0, m.percent))}%`,
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
