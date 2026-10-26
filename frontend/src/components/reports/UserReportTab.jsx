import { useMemo } from 'react';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/reports.css';
import '../../styles/reports-tabs.css';
import '../../styles/reports-sections.css';

export default function UserReportTab({
  staff = [],
  sales = [],
  adjustments = [],
  searchQuery = '',
}) {
  const staffStats = useMemo(() => {
    const statsMap = {};

    staff.forEach(u => {
      statsMap[u.id] = {
        user: u,
        saleCount: 0,
        revenue: 0,
        cash: 0,
        card: 0,
        transfer: 0,
        lastSaleTime: null,
      };
    });

    sales.forEach(s => {
      const uId = s.user_id || s.user?.id;
      if (!uId) return;
      if (!statsMap[uId]) {
        statsMap[uId] = {
          user: s.user || { id: uId, name: `User #${uId}`, role: 'staff' },
          saleCount: 0,
          revenue: 0,
          cash: 0,
          card: 0,
          transfer: 0,
          lastSaleTime: null,
        };
      }

      const total = Number(s.total) || 0;
      statsMap[uId].saleCount += 1;
      statsMap[uId].revenue += total;

      if (s.payment_method === 'cash') statsMap[uId].cash += total;
      else if (s.payment_method === 'card') statsMap[uId].card += total;
      else if (s.payment_method === 'bank_transfer') statsMap[uId].transfer += total;

      const saleTime = new Date(s.created_at).getTime();
      if (!statsMap[uId].lastSaleTime || saleTime > statsMap[uId].lastSaleTime) {
        statsMap[uId].lastSaleTime = saleTime;
      }
    });

    const q = searchQuery.trim().toLowerCase();
    return Object.values(statsMap).filter(st => {
      if (!q) return true;
      const name = st.user.name?.toLowerCase() || '';
      const email = st.user.email?.toLowerCase() || '';
      const role = st.user.role?.toLowerCase() || '';
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [staff, sales, searchQuery]);

  const activityLog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const events = [];

    // Sales events
    sales.forEach(s => {
      const staffName = s.user?.name || 'Staff';
      const userRole = s.user?.role || 'cashier';
      const itemsCount = s.items?.length || 1;
      const total = Number(s.total) || 0;
      const timeMs = new Date(s.created_at).getTime();

      events.push({
        id: `sale-${s.id}`,
        timestamp: s.created_at,
        timeMs,
        userName: staffName,
        userRole,
        actionType: 'sale',
        actionLabel: 'Sale Completed',
        detail: `Receipt #${s.receipt_number || String(s.id).padStart(5, '0')} · ${itemsCount} line item(s) via ${s.payment_method || 'cash'}`,
        value: formatMoney(total),
      });
    });

    // Stock adjustment events
    adjustments.forEach(a => {
      const staffName = a.staffName || a.user?.name || 'Manager';
      const userRole = a.user?.role || 'manager';
      const timeMs = a.timestamp || new Date(a.createdAt || a.created_at).getTime() || Date.now();
      const type = (a.type || 'restock').toLowerCase();

      events.push({
        id: `adj-${a.id || Math.random()}`,
        timestamp: a.createdAt || a.created_at || new Date().toISOString(),
        timeMs,
        userName: staffName,
        userRole,
        actionType: type.includes('damage') ? 'damage' : type.includes('correct') ? 'correction' : 'restock',
        actionLabel: type.includes('damage') ? 'Stock Damage' : type.includes('correct') ? 'Inventory Recount' : 'Stock Restocked',
        detail: `${a.productName || 'Product'} · ${a.reason || 'Inventory update'}`,
        value: `${a.quantityChange > 0 ? '+' : ''}${a.quantityChange || a.quantity || 0} units`,
      });
    });

    events.sort((a, b) => b.timeMs - a.timeMs);

    if (!q) return events.slice(0, 50);
    return events.filter(e =>
      e.userName.toLowerCase().includes(q) ||
      e.actionLabel.toLowerCase().includes(q) ||
      e.detail.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [sales, adjustments, searchQuery]);

  const summary = useMemo(() => {
    let totalSalesCount = 0;
    let totalRevenue = 0;
    let totalCash = 0;
    let totalCard = 0;
    let totalTransfer = 0;

    staffStats.forEach(s => {
      totalSalesCount += s.saleCount;
      totalRevenue += s.revenue;
      totalCash += s.cash;
      totalCard += s.card;
      totalTransfer += s.transfer;
    });

    return { totalSalesCount, totalRevenue, totalCash, totalCard, totalTransfer };
  }, [staffStats]);

  return (
    <div className="reports-tab-body">
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <span className="kpi-label">TOTAL STAFF AUDITED</span>
          <strong className="kpi-val">{staffStats.length}</strong>
          <small className="kpi-sub">{summary.totalSalesCount} recorded sales operations</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">TOTAL CASHIER REVENUE</span>
          <strong className="kpi-val text-green">{formatMoney(summary.totalRevenue)}</strong>
          <small className="kpi-sub">Total payments processed by staff</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">CASH COLLECTED</span>
          <strong className="kpi-val">{formatMoney(summary.totalCash)}</strong>
          <small className="kpi-sub">Total physical cash received in drawer</small>
        </div>
        <div className="report-kpi-card">
          <span className="kpi-label">CARD & TRANSFER VALUE</span>
          <strong className="kpi-val text-amber">{formatMoney(summary.totalCard + summary.totalTransfer)}</strong>
          <small className="kpi-sub">{formatMoney(summary.totalCard)} POS &bull; {formatMoney(summary.totalTransfer)} Transfer</small>
        </div>
      </div>

      <div className="reports-table-card">
        <div className="reports-section-head">
          <h3>Cashier & Staff Performance Breakdown ({staffStats.length})</h3>
          <p>Sales volume and payment collections handled by each staff member</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>STAFF MEMBER</th>
                <th>ROLE</th>
                <th className="text-right">SALES PROCESSED</th>
                <th className="text-right">CASH COLLECTED</th>
                <th className="text-right">CARD PAYMENTS</th>
                <th className="text-right">TRANSFER</th>
                <th className="text-right">TOTAL PROCESSED</th>
                <th>LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody>
              {staffStats.map(st => (
                <tr key={st.user.id}>
                  <td>
                    <div className="user-table-cell">
                      <strong>{st.user.name || 'Staff'}</strong>
                      <small className="text-dim">{st.user.email}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-badge--${st.user.role}`}>
                      {st.user.role}
                    </span>
                  </td>
                  <td className="text-right"><strong>{st.saleCount}</strong></td>
                  <td className="text-right">{formatMoney(st.cash)}</td>
                  <td className="text-right">{formatMoney(st.card)}</td>
                  <td className="text-right">{formatMoney(st.transfer)}</td>
                  <td className="text-right"><strong className="text-green">{formatMoney(st.revenue)}</strong></td>
                  <td>
                    {st.lastSaleTime ? (
                      <span className="text-dim">{new Date(st.lastSaleTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    ) : (
                      <span className="text-muted">No sales yet</span>
                    )}
                  </td>
                </tr>
              ))}
              {staffStats.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-muted">No staff records match the search query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Action & Activity Log */}
      <div className="reports-table-card">
        <div className="reports-section-head">
          <h3>Staff Activity & Action Audit Log ({activityLog.length})</h3>
          <p>Chronological log of checkout sales, stock adjustments and actions recorded by users</p>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-data-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>STAFF MEMBER</th>
                <th>ROLE</th>
                <th>ACTION TYPE</th>
                <th>ACTION DETAILS</th>
                <th className="text-right">VALUE / UNITS</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map(event => (
                <tr key={event.id}>
                  <td>
                    <span className="text-dim">
                      {new Date(event.timestamp).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td><strong>{event.userName}</strong></td>
                  <td>
                    <span className={`role-badge role-badge--${event.userRole}`}>
                      {event.userRole}
                    </span>
                  </td>
                  <td>
                    <span className={`action-type-pill action-type-pill--${event.actionType}`}>
                      {event.actionLabel}
                    </span>
                  </td>
                  <td><span className="text-muted">{event.detail}</span></td>
                  <td className="text-right"><strong>{event.value}</strong></td>
                </tr>
              ))}
              {activityLog.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-muted">
                    No activity recorded by staff in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
