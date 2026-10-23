import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';

const PRESET_CHIPS = {
  restock: [
    'Supplier delivery',
    'Transfer from store room',
    'Customer return to stock',
    'Back-order received',
  ],
  correction: [
    'Physical recount audit',
    'Stocktake reconciliation',
    'System miscount fix',
  ],
  damage: [
    'Expired product',
    'Broken in transit',
    'Damaged packaging',
    'Customer breakage',
  ],
};

export default function StockChangeForm({ products = [], onSubmit, submitting }) {
  const [mode, setMode] = useState('restock'); // 'restock' | 'correction' | 'damage'
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('New units received from a supplier or transfer');

  const selectedProduct = useMemo(
    () => products.find(p => String(p.id) === String(selectedId)),
    [products, selectedId]
  );

  const currentStock = selectedProduct?.inventory?.quantity ?? 0;
  const numQty = parseInt(quantity, 10) || 0;

  const projectedStock = useMemo(() => {
    if (!selectedProduct || !numQty) return currentStock;
    if (mode === 'restock') return currentStock + numQty;
    if (mode === 'damage') return Math.max(0, currentStock - numQty);
    if (mode === 'correction') return numQty;
    return currentStock;
  }, [selectedProduct, numQty, currentStock, mode]);

  function handleModeChange(nextMode) {
    setMode(nextMode);
    if (nextMode === 'restock') {
      setReason('New units received from a supplier or transfer');
    } else if (nextMode === 'correction') {
      setReason('Physical recount audit after inventory stocktake');
    } else {
      setReason('Damaged or expired units taken off the shelf');
    }
  }

  function handlePresetClick(chip) {
    setReason(chip);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedProduct || numQty <= 0) return;
    onSubmit({
      productId: selectedProduct.id,
      product: selectedProduct,
      mode,
      quantity: numQty,
      reason,
      currentStock,
      projectedStock,
    });
    setQuantity('');
  }

  return (
    <div className="stock-change-card">
      <div className="stock-change-head">
        <span className="stock-change-icon">
          <Icon name="inventory" size={18} />
        </span>
        <div>
          <h3>Record a stock change</h3>
          <p>Every entry updates the product's stock and lands in the adjustment history below.</p>
        </div>
      </div>

      <div className="stock-mode-selector">
        <button
          type="button"
          className={`stock-mode-card ${mode === 'restock' ? 'stock-mode-card--active' : ''}`}
          onClick={() => handleModeChange('restock')}
        >
          <div className="stock-mode-badge stock-mode-badge--restock">
            <Icon name="plus" size={16} />
          </div>
          <div>
            <div className="stock-mode-title">Restock</div>
            <div className="stock-mode-desc">New units received from a supplier or transfer</div>
          </div>
        </button>

        <button
          type="button"
          className={`stock-mode-card ${mode === 'correction' ? 'stock-mode-card--active' : ''}`}
          onClick={() => handleModeChange('correction')}
        >
          <div className="stock-mode-badge stock-mode-badge--correction">
            <Icon name="repeat" size={16} />
          </div>
          <div>
            <div className="stock-mode-title">Correction</div>
            <div className="stock-mode-desc">Reconcile to the physical count after a stock take</div>
          </div>
        </button>

        <button
          type="button"
          className={`stock-mode-card ${mode === 'damage' ? 'stock-mode-card--active' : ''}`}
          onClick={() => handleModeChange('damage')}
        >
          <div className="stock-mode-badge stock-mode-badge--damage">
            <Icon name="alert" size={16} />
          </div>
          <div>
            <div className="stock-mode-title">Damage</div>
            <div className="stock-mode-desc">Broken, expired or spoiled units taken off the shelf</div>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="stock-form-body">
        <div className="stock-form-row">
          <div className="form-group flex-wide">
            <label htmlFor="restock-product-select">PRODUCT</label>
            <div className="input-with-icon">
              <Icon name="search" size={14} />
              <select
                id="restock-product-select"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="stock-select"
              >
                <option value="">Search a product by name or SKU...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — {p.inventory?.quantity ?? 0} {p.unit || 'units'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group flex-narrow">
            <label htmlFor="restock-qty-input">
              {mode === 'restock' && 'UNITS RECEIVED'}
              {mode === 'correction' && 'PHYSICAL COUNT'}
              {mode === 'damage' && 'UNITS DAMAGED'}
            </label>
            <input
              id="restock-qty-input"
              type="number"
              min="1"
              placeholder="e.g. 24"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="restock-reason-input">REASON NOTE</label>
          <input
            id="restock-reason-input"
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <div className="reason-chips-row">
            {PRESET_CHIPS[mode]?.map(chip => (
              <button
                key={chip}
                type="button"
                className={`reason-chip-btn ${reason === chip ? 'reason-chip-btn--active' : ''}`}
                onClick={() => handlePresetClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="stock-form-footer">
          <div className="stock-projection-box">
            <div className="projection-col">
              <span className="projection-label">STOCK NOW</span>
              <span className="projection-val">
                {selectedProduct ? `${currentStock}` : '—'}
              </span>
            </div>
            <span className="projection-arrow">→</span>
            <div className="projection-col">
              <span className="projection-label">AFTER CHANGE</span>
              <span className={`projection-val ${selectedProduct && numQty ? 'projection-val--active' : ''}`}>
                {selectedProduct && numQty ? `${projectedStock}` : '—'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-confirm-restock"
            disabled={!selectedProduct || numQty <= 0 || submitting}
          >
            <Icon name="check" size={16} />
            <span>
              {submitting
                ? 'Applying...'
                : mode === 'restock'
                ? 'Confirm restock'
                : mode === 'correction'
                ? 'Confirm correction'
                : 'Confirm damage'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
