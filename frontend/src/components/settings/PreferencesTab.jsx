import Icon from '../ui/Icon';

export default function PreferencesTab({
  preferences,
  productCount = 14,
  lowStockCount = 4,
  onChange,
  onApplyThresholdToAll,
}) {
  const presets = [5, 10, 15, 20, 25, 30];

  function setThreshold(val) {
    onChange({ ...preferences, defaultThreshold: Math.max(1, Number(val) || 1) });
  }

  function toggleAlerts() {
    onChange({ ...preferences, lowStockAlerts: !preferences.lowStockAlerts });
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel-head">
        <span className="settings-panel-icon">
          <Icon name="sliders" size={18} />
        </span>
        <div>
          <h3>Default reorder threshold</h3>
          <p>The alert level every new product starts with, until you override it per product.</p>
        </div>
      </div>

      <div className="preferences-card">
        <div className="preferences-row">
          <div className="threshold-input-side">
            <label htmlFor="pref-threshold-input">THRESHOLD (UNITS)</label>
            <input
              id="pref-threshold-input"
              type="number"
              min="1"
              value={preferences.defaultThreshold}
              onChange={e => setThreshold(e.target.value)}
              className="pref-threshold-box"
            />
            <div className="pref-preset-pills">
              {presets.map(val => (
                <button
                  key={val}
                  type="button"
                  className={`preset-pill ${preferences.defaultThreshold === val ? 'preset-pill--active' : ''}`}
                  onClick={() => setThreshold(val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="pref-explain-text">
              When you add a product, raising its stock below this number flips it to a <span className="text-amber font-semibold">Low Stock</span> badge and surfaces it in alerts.
            </p>
          </div>

          <div className="threshold-callout-side">
            <span className="callout-label">WHAT THIS MEANS RIGHT NOW</span>
            <div className="threshold-callout-box">
              <span className="callout-icon">
                <Icon name="bell" size={20} />
              </span>
              <p>
                <strong>{lowStockCount} products</strong> currently sit at or below {preferences.defaultThreshold} units and would show as low or out of stock.
              </p>
            </div>
          </div>
        </div>

        <div className="preferences-card-foot">
          <span className="pref-foot-info">
            Apply to all products in your inventory.
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onApplyThresholdToAll}
          >
            Apply to all {productCount} products
          </button>
        </div>
      </div>

      <div className="settings-panel-head mt-lg">
        <span className="settings-panel-icon">
          <Icon name="bell" size={18} />
        </span>
        <div>
          <h3>Low stock alerts</h3>
          <p>Show low-stock warnings on the dashboard and the inventory summary.</p>
        </div>
        <div className="panel-right-toggle">
          <button
            type="button"
            className={`switch-toggle ${preferences.lowStockAlerts ? 'switch-toggle--on' : ''}`}
            onClick={toggleAlerts}
            aria-label="Toggle low stock alerts"
          >
            <span className="switch-toggle-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}
