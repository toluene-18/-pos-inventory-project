import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

export default function PreferencesTab({
  preferences,
  productCount = 14,
  lowStockCount = 4,
  onChange,
  onApplyThresholdToAll,
}) {
  const [draft, setDraft] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const presets = [5, 10, 15, 20, 25, 30];

  useEffect(() => {
    setDraft(preferences);
    setHasChanges(false);
  }, [preferences]);

  function setThreshold(val) {
    const nextVal = Math.max(1, Number(val) || 1);
    setDraft(prev => ({ ...prev, defaultThreshold: nextVal }));
    setHasChanges(true);
  }

  function toggleAlerts() {
    setDraft(prev => ({ ...prev, lowStockAlerts: !prev.lowStockAlerts }));
    setHasChanges(true);
  }

  function handleSave() {
    onChange(draft);
    setHasChanges(false);
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
              value={draft.defaultThreshold}
              onChange={e => setThreshold(e.target.value)}
              className="pref-threshold-box"
            />
            <div className="pref-preset-pills">
              {presets.map(val => (
                <button
                  key={val}
                  type="button"
                  className={`preset-pill ${draft.defaultThreshold === val ? 'preset-pill--active' : ''}`}
                  onClick={() => setThreshold(val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="pref-explain-text">
              When you add a product, falling below this number marks it with a <span className="text-amber font-semibold">Low Stock</span> badge and surfaces it in alerts.
            </p>
          </div>

          <div className="threshold-callout-side">
            <span className="callout-label">WHAT THIS MEANS RIGHT NOW</span>
            <div className="threshold-callout-box">
              <span className="callout-icon">
                <Icon name="bell" size={20} />
              </span>
              <p>
                <strong>{lowStockCount} products</strong> currently sit at or below {draft.defaultThreshold} units and would show as low or out of stock.
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
            className={`switch-toggle ${draft.lowStockAlerts ? 'switch-toggle--on' : ''}`}
            onClick={toggleAlerts}
            aria-label="Toggle low stock alerts"
          >
            <span className="switch-toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="settings-form-actions" style={{ marginTop: '20px' }}>
        <button
          type="button"
          className="btn-save-settings"
          onClick={handleSave}
        >
          <Icon name="check" size={16} />
          <span>Save preferences</span>
        </button>
        {hasChanges && <span className="unsaved-changes-hint">You have unsaved changes</span>}
      </div>
    </div>
  );
}
