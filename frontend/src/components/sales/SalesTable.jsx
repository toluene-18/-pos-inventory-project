import React from 'react';
import Icon from '../ui/Icon';
import '../../styles/sales-table.css';

export default function SalesTable({
  sales = [],
  loading,
  expandedIds = new Set(),
  onToggleExpand,
  onViewSale,
}) {
  if (loading) {
    return <div className="sales-loading">Loading transactions...</div>;
  }

  if (sales.length === 0) {
    return (
      <div className="sales-empty">
        <Icon name="sales" size={32} />
        <p>No sales found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <table className="sales-table">
      <thead>
        <tr>
          <th style={{ width: '44px' }} />
          <th>RECEIPT</th>
          <th>CASHIER</th>
          <th>ITEMS</th>
          <th>PAYMENT</th>
          <th>TOTAL</th>
          <th style={{ textAlign: 'right' }}>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {sales.map(s => {
          const isExpanded = expandedIds.has(s.id);
          const itemsCount = (s.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0);
          const firstItem = s.items?.[0]?.product?.name || 'Item';
          const extraCount = (s.items?.length || 1) - 1;
          const itemsDesc = extraCount > 0 ? `${firstItem} +${extraCount} more` : firstItem;
          const when = new Date(s.created_at).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const initials = (s.user?.name || 'S')
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <React.Fragment key={s.id}>
              <tr>
                <td>
                  <button
                    type="button"
                    className={`btn-toggle-expand ${isExpanded ? 'btn-toggle-expand--open' : ''}`}
                    onClick={() => onToggleExpand(s.id)}
                    aria-label={isExpanded ? 'Collapse transaction' : 'Expand transaction'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </td>
                <td>
                  <div className="sales-receipt-meta">
                    <span className="sales-receipt-id">CWG-{String(s.id).padStart(5, '0')}</span>
                    <span className="sales-receipt-time">{when}</span>
                  </div>
                </td>
                <td>
                  <div className="sales-cashier-cell">
                    <span className="sales-cashier-avatar">{initials}</span>
                    <span>{s.user?.name || 'Staff'}</span>
                  </div>
                </td>
                <td>
                  <div className="sales-items-cell">
                    <span className="sales-items-count">{itemsCount} units</span>
                    <span className="sales-items-desc">{itemsDesc}</span>
                  </div>
                </td>
                <td>
                  <span className={`sales-method-pill sales-method-pill--${s.payment_method}`}>
                    {s.payment_method === 'cash' ? (
                      <><i className="sales-dot-cash" /> Cash</>
                    ) : s.payment_method === 'card' ? (
                      <><Icon name="card" size={13} /> Card</>
                    ) : (
                      <><Icon name="bank" size={13} /> Bank transfer</>
                    )}
                  </span>
                </td>
                <td>
                  <span className="sales-total-amount">₦{Number(s.total).toLocaleString()}</span>
                </td>
                <td>
                  <div className="sales-action-btns">
                    <button
                      type="button"
                      className="btn-sales-view"
                      onClick={() => onViewSale(s)}
                    >
                      <Icon name="eye" size={13} /> View
                    </button>
                    <button
                      type="button"
                      className="btn-sales-print"
                      onClick={() => onViewSale(s)}
                      title="Print receipt"
                    >
                      <Icon name="printer" size={13} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Expanded Breakdown matching Readdy mockup */}
              {isExpanded && (
                <tr className="sales-expanded-row">
                  <td colSpan={7}>
                    <div className="sales-expanded-card">
                      <div className="sales-expanded-head">
                        <span className="sales-expanded-title">RECEIPT BREAKDOWN</span>
                        <span className="sales-expanded-lines">
                          {s.items?.length || 0} lines · {itemsCount} units
                        </span>
                      </div>

                      <div className="sales-breakdown-list">
                        {(s.items || []).map(item => (
                          <div key={item.id} className="sales-breakdown-item">
                            <div className="sales-breakdown-info">
                              <strong className="sales-breakdown-name">
                                {item.product?.name || `Product #${item.product_id}`}
                              </strong>
                              <small className="sales-breakdown-sku">
                                {item.product?.sku || 'SKU'} · {item.quantity} x ₦{Number(item.unit_price).toLocaleString()}
                              </small>
                            </div>
                            <div className="sales-breakdown-total">
                              ₦{Number(item.line_total).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="sales-expanded-foot">
                        <div className="sales-foot-totals">
                          <div className="sales-foot-total-col">
                            <small>SUBTOTAL</small>
                            <strong>₦{Number(s.subtotal).toLocaleString()}</strong>
                          </div>
                          <div className="sales-foot-total-col">
                            <small>TOTAL</small>
                            <strong>₦{Number(s.total).toLocaleString()}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-reprint-receipt"
                          onClick={() => onViewSale(s)}
                        >
                          <Icon name="printer" size={14} />
                          <span>Reprint receipt</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
