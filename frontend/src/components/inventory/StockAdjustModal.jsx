import { useState } from 'react';
import Icon from '../ui/Icon';
import '../../styles/inventory-modal.css';

const REASON_PRESETS = [
  'Stock shipment / Delivery received',
  'Routine physical count reconciliation',
  'Damaged / Broken goods removed',
  'Expired / Spoilage write-off',
  'Theft / Missing inventory adjustment',
  'Internal store use',
];

export default function StockAdjustModal({ product, isOpen, onClose, onSave }) {
  const [type, setType] = useState('increase');
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const currentStock = product.inventory?.quantity ?? 0;
  const numQuantity = parseInt(quantity, 10) || 0;
  const projectedStock =
    type === 'increase'
      ? currentStock + numQuantity
      : Math.max(0, currentStock - numQuantity);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (numQuantity <= 0) {
      setError('Adjustment quantity must be at least 1.');
      return;
    }

    if (type === 'decrease' && numQuantity > currentStock) {
      setError(`Cannot reduce stock below zero (current: ${currentStock}).`);
      return;
    }

    const finalReason = reason === 'custom' ? customReason.trim() : reason;
    if (reason === 'custom' && !finalReason) {
      setError('Please provide a specific reason for this custom adjustment.');
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

  return (
    <div className="adjust-modal-backdrop" role="dialog" aria-modal="true">
      <div className="adjust-modal">
        <div className="adjust-modal-head">
          <div className="adjust-modal-title">
            <span className="adjust-modal-icon">
              <Icon name="inventory" size={18} />
            </span>
            <div>
              <h3>Adjust Stock Level</h3>
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
              onClick={() => setType('increase')}
            >
              <Icon name="plus" size={16} /> Add Stock (+)
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === 'decrease' ? 'toggle-btn--decrease' : ''}`}
              onClick={() => setType('decrease')}
            >
              <Icon name="minus" size={16} /> Deduct Stock (−)
            </button>
          </div>

          <div className="adjust-stock-preview">
            <div>
              <small>Current On Hand</small>
              <strong>{currentStock} units</strong>
            </div>
            <div className="adjust-arrow">→</div>
            <div>
              <small>New Level After</small>
              <strong className={type === 'increase' ? 'text-green' : 'text-amber'}>
                {projectedStock} units
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adjust-qty">Quantity to {type === 'increase' ? 'Add' : 'Deduct'} *</label>
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
            <label htmlFor="adjust-reason">Audit Reason *</label>
            <select
              id="adjust-reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            >
              {REASON_PRESETS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="custom">Other (specify below)...</option>
            </select>
          </div>

          {reason === 'custom' && (
            <div className="form-group">
              <label htmlFor="adjust-custom">Custom Reason Details *</label>
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
              {submitting ? 'Applying...' : `Confirm ${type === 'increase' ? 'Addition' : 'Deduction'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
