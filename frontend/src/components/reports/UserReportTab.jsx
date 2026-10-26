import { useState, useMemo } from 'react';
import { formatMoney } from '../../utils/dashboardStats';
import { buildStaffStats, buildActivityEvents } from './userReportHelpers';
import '../../styles/reports.css';
import '../../styles/reports-tabs.css';
import '../../styles/reports-sections.css';

export default function UserReportTab({
  staff = [],
  sales = [],
  adjustments = [],
  searchQuery = '',
}) {
  const [selectedStaff, setSelectedStaff] = useState('all');

  const staffNames = useMemo(() => {
    const set = new Set();
    staff.forEach(s => s.name && set.add(s.name));
    sales.forEach(s => s.user?.name && set.add(s.user.name));
    adjustments.forEach(a => (a.staffName || a.user?.name) && set.add(a.staffName || a.user.name));
    return Array.from(set).sort();
  }, [staff, sales, adjustments]);

  const staffStats = useMemo(() => {
    return buildStaffStats(staff, sales, searchQuery);
  }, [staff, sales, searchQuery]);

  const activityLog = useMemo(() => {
    return buildActivityEvents(sales, adjustments, searchQuery, selectedStaff);
  }, [sales, adjustments, searchQuery, selectedStaff]);

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
        <div className="reports-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3>Staff Activity & Action Audit Log ({activityLog.length})</h3>
            <p>Chronological log of checkout sales, stock adjustments and actions recorded by users</p>
          </div>
          <select
            className="reports-select-filter"
            value={selectedStaff}
            onChange={e => setSelectedStaff(e.target.value)}
            style={{ minWidth: 200 }}
            aria-label="Filter audit log by staff member"
          >
            <option value="all">All staff actions ({staffNames.length})</option>
            {staffNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
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
