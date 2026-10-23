import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';
import '../../styles/inventory-modal.css';

const QUICK_CHIPS = [10, 25, 50, 100];

export default function StockAdjustModal({
  selectedProducts = [],
  isOpen,
  onClose,
  onConfirmRestock,
}) {
  const [unitsToAdd, setUnitsToAdd] = useState('100');
  const [reason, setReason] = useState('Bulk restock from inventory');
  const [submitting, setSubmitting] = useState(false);

  const productList = useMemo(() => {
    return Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts].filter(Boolean);
  }, [selectedProducts]);

  const numUnits = Math.max(1, parseInt(unitsToAdd, 10) || 1);
  const totalUnitsAdded = numUnits * productList.length;

  const addedCostValue = useMemo(() => {
    return productList.reduce((sum, p) => {
      const cost = Number(p.cost_price) || Number(p.sell_price) * 0.7 || 0;
      return sum + cost * numUnits;
    }, 0);
  }, [productList, numUnits]);

  const primaryProduct = productList[0];
  const onHand = primaryProduct?.inventory?.quantity ?? 0;

  if (!isOpen || productList.length === 0) return null;

  function handleChipClick(val) {
    setUnitsToAdd(String(val));
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmRestock({
        products: productList,
        unitsPerProduct: numUnits,
        totalUnits: totalUnitsAdded,
        addedCost: addedCostValue,
        reason,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="stock-restock-modal" onClick={e => e.stopPropagation()}>
        <div className="restock-modal-head">
          <div className="restock-modal-badge">
            <Icon name="plus" size={16} />
          </div>
          <div className="restock-modal-titles">
            <h3>Restock {productList.length} product{productList.length > 1 ? 's' : ''}</h3>
            <p>Adds units to every selected product at once.</p>
          </div>
          <button type="button" className="restock-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="selected-stock-section">
          <div className="selected-stock-label">
            SELECTED STOCK · {onHand} UNITS ON HAND
          </div>
          <div className="selected-stock-card">
            <div className="selected-stock-thumb">
              {primaryProduct?.image_path ? (
                <img src={primaryProduct.image_path} alt="" />
              ) : (
                <span>{primaryProduct?.name?.slice(0, 2).toUpperCase() || 'PR'}</span>
              )}
            </div>
            <div className="selected-stock-info">
              <h4>{primaryProduct?.name}</h4>
              <p>{primaryProduct?.sku}</p>
            </div>
            <div className="selected-stock-onhand">
              {onHand} on hand
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="restock-modal-form">
          <div className="form-group">
            <label htmlFor="modal-units-input">UNITS TO ADD PER PRODUCT</label>
            <input
              id="modal-units-input"
              type="number"
              min="1"
              value={unitsToAdd}
              onChange={e => setUnitsToAdd(e.target.value)}
              className="modal-big-input"
            />
            <div className="modal-quick-chips">
              {QUICK_CHIPS.map(val => (
                <button
                  key={val}
                  type="button"
                  className={`modal-chip-btn ${numUnits === val ? 'modal-chip-btn--active' : ''}`}
                  onClick={() => handleChipClick(val)}
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal-reason-input">REASON NOTE</label>
            <input
              id="modal-reason-input"
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="modal-text-input"
            />
          </div>

          <div className="modal-summary-box">
            <div className="summary-row">
              <span className="summary-label">Total units added</span>
              <span className="summary-val text-green">+{totalUnitsAdded}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Added stock value (cost)</span>
              <span className="summary-val">₦{Math.round(addedCostValue).toLocaleString()}</span>
            </div>
          </div>

          <div className="restock-modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-confirm" disabled={submitting}>
              <Icon name="check" size={15} />
              <span>{submitting ? 'Applying...' : 'Confirm restock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
