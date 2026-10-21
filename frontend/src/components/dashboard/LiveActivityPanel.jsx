import Icon from '../ui/Icon';
import PanelStatus from './PanelStatus';

const iconMap = {
  sale: 'basket',
  stock: 'alert',
  restock: 'inventory',
};

function LiveActivityPanel({ loading, error, items }) {
  return (
    <article className="panel activity-panel">
      <div className="panel-head">
        <div>
          <h3>Recent activity</h3>
        </div>
        <span className="live-badge">
          <span className="live-dot" aria-hidden="true" />
          Latest
        </span>
      </div>

      <PanelStatus
        loading={loading}
        error={error}
        empty={!items.length}
        emptyMessage="No recent sales or stock alerts yet."
      >
        <ul className="activity-feed" aria-label="Recent store activity">
          {items.map(item => (
            <li key={item.id} className={`activity-row activity-row--${item.type}`}>
              <span className={`activity-icon activity-icon--${item.type}`} aria-hidden="true">
                <Icon name={iconMap[item.type] || 'basket'} size={15} />
              </span>

              <div className="activity-body">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>

              <time className="activity-time">{item.time}</time>
            </li>
          ))}
        </ul>
      </PanelStatus>
    </article>
  );
}

export default LiveActivityPanel;
