import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';
  const diffMs = Date.now() - Number(timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export default function ActivityLogTab({ activityLog = [], staff = [] }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [search, setSearch] = useState('');

  const staffOptions = useMemo(() => {
    const names = new Set();
    staff.forEach(s => s.name && names.add(s.name));
    activityLog.forEach(e => e.actor && names.add(e.actor));
    return Array.from(names).sort();
  }, [staff, activityLog]);

  const totalEvents = activityLog.length;
  const staffChanges = activityLog.filter(e => e.category === 'staff').length;
  const thresholdChanges = activityLog.filter(e => e.category === 'threshold').length;
  const uniqueActors = new Set(activityLog.map(e => e.actor)).size;

  const [currentTime] = useState(() => Date.now());

  const filteredEvents = useMemo(() => {
    return activityLog.filter(event => {
      if (categoryFilter !== 'all' && event.category !== categoryFilter) {
        return false;
      }
      if (staffFilter !== 'all' && event.actor !== staffFilter) {
        return false;
      }
      if (timeFilter === 'today') {
        const isToday = currentTime - (event.createdAt || currentTime) < 24 * 3600 * 1000;
        if (!isToday) return false;
      } else if (timeFilter === '7d') {
        const is7d = currentTime - (event.createdAt || currentTime) < 7 * 86400 * 1000;
        if (!is7d) return false;
      } else if (timeFilter === '30d') {
        const is30d = currentTime - (event.createdAt || currentTime) < 30 * 86400 * 1000;
        if (!is30d) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(q);
        const matchesDetail = event.detail?.toLowerCase().includes(q);
        const matchesActor = event.actor?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDetail && !matchesActor) return false;
      }

      return true;
    });
  }, [activityLog, categoryFilter, timeFilter, search, currentTime]);

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'staff':
        return 'users';
      case 'threshold':
        return 'sliders';
      case 'profile':
        return 'store';
      case 'receipt':
        return 'receipt';
      default:
        return 'clock';
    }
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel-head">
        <span className="settings-panel-icon">
          <Icon name="clock" size={18} />
        </span>
        <div>
          <h3>Activity log</h3>
          <p>A running record of every change to staff accounts, reorder thresholds and store settings — who did it and exactly when.</p>
        </div>
      </div>

      <div className="activity-kpi-grid">
        <div className="activity-kpi-card">
          <div className="activity-kpi-icon activity-kpi-icon--gray">
            <Icon name="clock" size={16} />
          </div>
          <div>
            <div className="activity-kpi-value">{totalEvents}</div>
            <div className="activity-kpi-label">Total events</div>
          </div>
        </div>

        <div className="activity-kpi-card">
          <div className="activity-kpi-icon activity-kpi-icon--green">
            <Icon name="users" size={16} />
          </div>
          <div>
            <div className="activity-kpi-value">{staffChanges}</div>
            <div className="activity-kpi-label">Staff changes</div>
          </div>
        </div>

        <div className="activity-kpi-card">
          <div className="activity-kpi-icon activity-kpi-icon--amber">
            <Icon name="sliders" size={16} />
          </div>
          <div>
            <div className="activity-kpi-value">{thresholdChanges}</div>
            <div className="activity-kpi-label">Threshold changes</div>
          </div>
        </div>

        <div className="activity-kpi-card">
          <div className="activity-kpi-icon activity-kpi-icon--gray">
            <Icon name="user" size={16} />
          </div>
          <div>
            <div className="activity-kpi-value">{uniqueActors}</div>
            <div className="activity-kpi-label">People involved</div>
          </div>
        </div>
      </div>

      <div className="activity-filters-row">
        <div className="activity-category-pills">
          {[
            { id: 'all', label: 'All activity' },
            { id: 'staff', label: 'Staff' },
            { id: 'threshold', label: 'Thresholds' },
            { id: 'profile', label: 'Profile' },
            { id: 'receipt', label: 'Receipt' },
          ].map(p => (
            <button
              key={p.id}
              type="button"
              className={`activity-filter-pill ${categoryFilter === p.id ? 'activity-filter-pill--active' : ''}`}
              onClick={() => setCategoryFilter(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="activity-time-and-search">
          <select
            className="inv-select"
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            style={{ fontSize: 12.5, padding: '6px 10px', height: 34, borderRadius: 8 }}
            aria-label="Filter activity by staff member"
          >
            <option value="all">All staff members ({staffOptions.length})</option>
            {staffOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <div className="activity-time-pills">
            {[
              { id: 'all', label: 'All time' },
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 days' },
              { id: '30d', label: 'Last 30 days' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                className={`activity-time-pill ${timeFilter === t.id ? 'activity-time-pill--active' : ''}`}
                onClick={() => setTimeFilter(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="activity-search-box">
            <Icon name="search" size={14} />
            <input
              type="text"
              placeholder="Search people or action..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="activity-stream">
        {filteredEvents.length === 0 ? (
          <div className="activity-stream-empty">
            <p>No activity found matching your filters.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="activity-event-card">
              <div className={`activity-event-badge-icon activity-event-badge-icon--${event.category}`}>
                <Icon name={getCategoryIcon(event.category)} size={16} />
              </div>
              <div className="activity-event-content">
                <div className="activity-event-headline">
                  <span className="activity-event-title">{event.title}</span>
                  <span className={`activity-status-tag activity-status-tag--${event.category}`}>
                    {event.badge || event.category}
                  </span>
                </div>
                {event.detail && <p className="activity-event-detail">{event.detail}</p>}
                <div className="activity-event-meta">
                  <span className="activity-actor-avatar">{event.actorInitials || 'AA'}</span>
                  <span className="activity-actor-name">{event.actor}</span>
                  <span className="activity-meta-dot">•</span>
                  <span className="activity-time-ago">{formatRelativeTime(event.createdAt)}</span>
                  <span className="activity-meta-dot">•</span>
                  <span className="activity-timestamp">{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
