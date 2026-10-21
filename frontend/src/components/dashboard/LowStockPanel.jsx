import Icon from '../ui/Icon';

/**
 * LowStockPanel — bottom-right panel.
 * Shows items that are out of stock or below reorder threshold.
 * Replace PLACEHOLDER_ITEMS with real inventory data in Milestone 6.
 */

const PLACEHOLDER_ITEMS = [
  {
    id: 1,
    name:      'Semovita 2kg',
    qty:       8,
    reorder:   15,
    status:    'low',
    thumbnail: null,
  },
  {
    id: 2,
    name:      'Golden Morn Cereal 900g',
    qty:       5,
    reorder:   12,
    status:    'low',
    thumbnail: null,
  },
  {
    id: 3,
    name:      'Coca-Cola Pack of 12',
    qty:       0,
    reorder:   10,
    status:    'out',
    thumbnail: null,
  },
  {
    id: 4,
    name:      'Toothpaste 140g',
    qty:       3,
    reorder:   10,
    status:    'low',
    thumbnail: null,
  },
];

const ALERT_LABEL = {
  out: 'Out of Stock',
  low: 'Low Stock',
};

function LowStockPanel({ onNavigate }) {
  const outCount = PLACEHOLDER_ITEMS.filter(i => i.status === 'out').length;

  return (
    <article className="panel lowstock-panel">
      <div className="panel-head">
        <div>
          <h3>Low stock alerts</h3>
          <p>{PLACEHOLDER_ITEMS.length} items need attention</p>
        </div>
        <button
          type="button"
          className="link-action"
          onClick={() => onNavigate('Inventory')}
        >
          View all <Icon name="arrow" size={13} />
        </button>
      </div>

      {outCount > 0 && (
        <div className="lowstock-summary-banner" role="alert">
          <Icon name="alert" size={15} />
          <span>
            <strong>{outCount} product{outCount !== 1 ? 's' : ''}</strong> {outCount === 1 ? 'is' : 'are'} completely out of stock
          </span>
        </div>
      )}

      <ul className="lowstock-list" aria-label="Low stock items">
        {PLACEHOLDER_ITEMS.map(item => {
          const pct = item.status === 'out'
            ? 0
            : Math.round((item.qty / item.reorder) * 100);

          return (
            <li key={item.id} className="lowstock-row">
              <span className="lowstock-thumb" aria-hidden="true">
                <Icon name="products" size={16} />
              </span>

              <div className="lowstock-info">
                <strong>{item.name}</strong>
                <span>
                  {item.qty} left · reorder at {item.reorder}
                </span>
              </div>

              <span className={`stock-badge stock-badge--${item.status}`}>
                {ALERT_LABEL[item.status]}
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default LowStockPanel;
