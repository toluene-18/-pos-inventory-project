import Icon from '../ui/Icon';

/**
 * LiveActivityPanel — right panel in the middle row.
 * Shows a feed of recent sale, stock alert, and restock events.
 * Replace PLACEHOLDER_FEED with real API data in Milestone 4.
 */

const PLACEHOLDER_FEED = [
  {
    id: 1,
    type: 'sale',
    title: 'Sale completed — CWG-000184',
    detail: '₦20,000 · Cashier Grace',
    time: '2m ago',
  },
  {
    id: 2,
    type: 'stock',
    title: 'Low stock alert — Toothpaste 140g',
    detail: 'Only 3 left · reorder at 10',
    time: '18m ago',
  },
  {
    id: 3,
    type: 'restock',
    title: 'Restock received — Basmati Rice 5kg',
    detail: '+40 bags · by Daniel',
    time: '1h ago',
  },
  {
    id: 4,
    type: 'sale',
    title: 'Sale completed — CWG-000183',
    detail: '₦8,500 · Cashier Grace',
    time: '1h ago',
  },
  {
    id: 5,
    type: 'stock',
    title: 'Out of stock — Coca-Cola Pack of 12',
    detail: 'Reorder placed',
    time: '2h ago',
  },
];

const iconMap = {
  sale:    'basket',
  stock:   'alert',
  restock: 'inventory',
};

function LiveActivityPanel() {
  return (
    <article className="panel activity-panel">
      <div className="panel-head">
        <div>
          <h3>Live activity</h3>
        </div>
        <span className="live-badge">
          <span className="live-dot" aria-hidden="true" />
          Live
        </span>
      </div>

      <ul className="activity-feed" aria-label="Recent store activity">
        {PLACEHOLDER_FEED.map(item => (
          <li key={item.id} className={`activity-row activity-row--${item.type}`}>
            <span className={`activity-icon activity-icon--${item.type}`} aria-hidden="true">
              <Icon name={iconMap[item.type]} size={15} />
            </span>

            <div className="activity-body">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>

            <time className="activity-time">{item.time}</time>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default LiveActivityPanel;
