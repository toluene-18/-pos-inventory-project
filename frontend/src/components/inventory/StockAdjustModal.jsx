import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';
import '../../styles/inventory-modal.css';

const RESTOCK_REASONS = [
  'Supplier shipment / Delivery received',
  'Physical audit found excess stock',
  'Customer return to inventory',
  'Internal store transfer in',
  'Other (specify note)...',
];

const REMOVE_REASONS = [
  'Damaged / Broken goods removed',
  'Expired / Spoilage write-off',
  'Physical count discrepancy (theft/loss)',
  'Internal store consumption',
  'Returned back to supplier/vendor',
  'Other (specify note)...',
];

export default function StockAdjustModal({ product, isOpen, onClose, onSave }) {
  const [type, setType] = useState('increase');
  const [quantity, setQuantity] = useState('1');
  const [reasonIndex, setReasonIndex] = useState(0);
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasonList = useMemo(
    () => (type === 'increase' ? RESTOCK_REASONS : REMOVE_REASONS),
    [type]
  );

  if (!isOpen || !product) return null;

  const currentStock = product.inventory?.quantity ?? 0;
  const numQuantity = parseInt(quantity, 10) || 0;
  const unit = product.unit || 'units';

  const projectedStock =
    type === 'increase'
      ? currentStock + numQuantity
      : Math.max(0, currentStock - numQuantity);

  const selectedReason = reasonList[reasonIndex] || reasonList[0];
  const isCustom = selectedReason.startsWith('Other');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (numQuantity <= 0) {
      setError(`Adjustment quantity must be at least 1 ${unit}.`);
      return;
    }

    if (type === 'decrease' && numQuantity > currentStock) {
      setError(`Cannot reduce stock below zero (current on hand: ${currentStock} ${unit}).`);
      return;
    }

    const finalReason = isCustom ? customReason.trim() : selectedReason;
    if (isCustom && !finalReason) {
      setError('Please provide a specific reason note.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        type,
        quantity: numQuantity,
        reason: finalReason,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to adjust stock.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleTypeChange(newType) {
    setType(newType);
    setReasonIndex(0);
    setError('');
  }

  return (
    <div className="adjust-modal-backdrop" role="dialog" aria-modal="true">
      <div className="adjust-modal">
        <div className="adjust-modal-head">
          <div className="adjust-modal-title">
            <span className="adjust-modal-icon">
              <Icon name="inventory" size={18} />
            </span>
            <div>
              <h3>Adjust Stock</h3>
              <p>{product.name} ({product.sku})</p>
            </div>
          </div>
          <button type="button" className="adjust-modal-close" onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {error && (
          <div className="adjust-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="adjust-form">
          <div className="adjust-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${type === 'increase' ? 'toggle-btn--increase' : ''}`}
              onClick={() => handleTypeChange('increase')}
            >
              ↓ Restock in
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === 'decrease' ? 'toggle-btn--decrease' : ''}`}
              onClick={() => handleTypeChange('decrease')}
            >
              ↑ Remove out
            </button>
          </div>

          <div className="adjust-stock-preview">
            <div className="adjust-preview-step">
              <small>Current On Hand</small>
              <strong>{currentStock} {unit}</strong>
            </div>
            <div className="adjust-arrow">→</div>
            <div className="adjust-preview-step">
              <small>New Level After</small>
              <strong className={type === 'increase' ? 'text-green' : 'text-amber'}>
                {projectedStock} {unit}
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adjust-qty">
              Quantity ({unit}) *
            </label>
            <input
              id="adjust-qty"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adjust-reason">Reason *</label>
            <select
              id="adjust-reason"
              value={reasonIndex}
              onChange={e => setReasonIndex(parseInt(e.target.value, 10))}
            >
              {reasonList.map((r, idx) => (
                <option key={r} value={idx}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {isCustom && (
            <div className="form-group">
              <label htmlFor="adjust-custom">Reason Details *</label>
              <textarea
                id="adjust-custom"
                rows="2"
                required
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Explain why this inventory adjustment is being made..."
              />
            </div>
          )}

          <div className="adjust-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${type === 'increase' ? 'btn-primary' : 'btn-danger'}`}
              disabled={submitting}
            >
              {submitting ? 'Applying...' : 'Apply adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
