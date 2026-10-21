import Icon from '../ui/Icon';
import PanelStatus from './PanelStatus';

const ALERT_LABEL = {
  out: 'Out of Stock',
  low: 'Low Stock',
};

function LowStockPanel({ items, loading, error, onNavigate }) {
  const outCount = items.filter(item => item.status === 'out').length;

  return (
    <article className="panel lowstock-panel">
      <div className="panel-head">
        <div>
          <h3>Low stock alerts</h3>
          <p>
            {loading
              ? 'Checking inventory…'
              : `${items.length} item${items.length === 1 ? '' : 's'} need attention`}
          </p>
        </div>
        <button
          type="button"
          className="link-action"
          onClick={() => onNavigate('Inventory')}
        >
          View all <Icon name="arrow" size={13} />
        </button>
      </div>

      <PanelStatus
        loading={loading}
        error={error}
        empty={!items.length}
        emptyMessage="All tracked products are above their reorder level."
      >
        <>
          {outCount > 0 && (
            <div className="lowstock-summary-banner" role="alert">
              <Icon name="alert" size={15} />
              <span>
                <strong>
                  {outCount} product{outCount !== 1 ? 's' : ''}
                </strong>{' '}
                {outCount === 1 ? 'is' : 'are'} completely out of stock
              </span>
            </div>
          )}

          <ul className="lowstock-list" aria-label="Low stock items">
            {items.map(item => {
              const pct =
                item.status === 'out' || item.reorder <= 0
                  ? 0
                  : Math.min(100, Math.round((item.qty / item.reorder) * 100));

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
                    <span
                      className="lowstock-bar"
                      role="meter"
                      aria-label={`${item.name} stock level`}
                      aria-valuemin={0}
                      aria-valuemax={item.reorder}
                      aria-valuenow={item.qty}
                    >
                      <span style={{ width: `${pct}%` }} />
                    </span>
                  </div>

                  <span className={`stock-badge stock-badge--${item.status}`}>
                    {ALERT_LABEL[item.status]}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      </PanelStatus>
    </article>
  );
}

export default LowStockPanel;
