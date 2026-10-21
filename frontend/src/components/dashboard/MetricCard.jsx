import Icon from '../ui/Icon';

/**
 * MetricCard — one KPI tile.
 * Props:
 *   label    string  — e.g. "Today's Sales"
 *   value    string  — e.g. "₦60,250"
 *   change   string  — e.g. "+12.4%" (optional)
 *   sub      string  — small line below value (optional)
 *   icon     string  — Icon name
 *   tone     string  — "green" | "amber" | "violet" | "rose"
 */
function MetricCard({ label, value, change, sub, icon, tone }) {
  const isPositive = change && !change.startsWith('-');

  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon metric-icon--${tone}`}>
          <Icon name={icon} size={17} />
        </span>
      </div>

      <p className="metric-value">{value}</p>

      {change && (
        <p className={`metric-change metric-change--${isPositive ? 'up' : 'down'}`}>
          <Icon name="trendUp" size={12} />
          {change}
        </p>
      )}

      {sub && <p className="metric-sub">{sub}</p>}
    </article>
  );
}

export default MetricCard;
