import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import { PRODUCT_PAGE_CATEGORIES } from '../../utils/categories';
import { humanizeErrorMessage } from '../../utils/errorMessage';
import '../../styles/products-modal.css';

const UNITS = [
  { value: 'bag', label: 'bag' },
  { value: 'tin', label: 'tin' },
  { value: 'bottle', label: 'bottle' },
  { value: 'pack', label: 'pack' },
  { value: 'carton', label: 'carton' },
  { value: 'piece', label: 'piece' },
  { value: 'sachet', label: 'sachet' },
  { value: 'roll', label: 'roll' },
  { value: 'kg', label: 'kg' },
  { value: 'litre', label: 'litre' },
];

function getInitialState(product) {
  if (product) {
    return {
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || 'grains_staples',
      unit: product.unit || 'piece',
      cost_price: product.cost_price ?? '',
      sell_price: product.sell_price ?? '',
      image_path: product.image_path || '',
      current_stock: product.inventory?.quantity ?? '0',
      reorder_threshold: product.inventory?.reorder_threshold ?? '5',
    };
  }
  return {
    name: '',
    sku: '',
    category: 'grains_staples',
    unit: 'piece',
    cost_price: '',
    sell_price: '',
    image_path: '',
    current_stock: '0',
    reorder_threshold: '5',
  };
}

export default function ProductFormModal({ product, isOpen, onClose, onSave }) {
  const isEditing = Boolean(product);
  const [formData, setFormData] = useState(() => getInitialState(product));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState(product));
      setError('');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const cost = parseFloat(formData.cost_price) || 0;
  const sell = parseFloat(formData.sell_price) || 0;
  const profit = sell - cost;
  const marginPercent = sell > 0 ? Math.round((profit / sell) * 100) : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        unit: formData.unit,
        cost_price: parseFloat(formData.cost_price),
        sell_price: parseFloat(formData.sell_price),
        image_path: formData.image_path || null,
        current_stock: parseInt(formData.current_stock, 10) || 0,
        reorder_threshold: parseInt(formData.reorder_threshold, 10) || 0,
      };

      await onSave(payload, product?.id);
      onClose();
    } catch (err) {
      setError(humanizeErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="product-modal-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal">
        <div className="product-modal-head">
          <h3>{isEditing ? 'Edit product' : 'Add product'}</h3>
          <button
            type="button"
            className="product-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {error && (
          <div className="product-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group full-width">
            <label htmlFor="prod-name">Product name</label>
            <input
              id="prod-name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Basmati Rice 5kg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-sku">SKU / Barcode</label>
              <input
                id="prod-sku"
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="CWG-GRN-001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-category">Category</label>
              <select
                id="prod-category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {PRODUCT_PAGE_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-sell">Selling price (₦)</label>
              <input
                id="prod-sell"
                type="number"
                step="any"
                min="0"
                required
                value={formData.sell_price}
                onChange={e => setFormData({ ...formData, sell_price: e.target.value })}
                placeholder="9500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-cost">Cost price (₦)</label>
              <input
                id="prod-cost"
                type="number"
                step="any"
                min="0"
                required
                value={formData.cost_price}
                onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                placeholder="7800"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-stock">Stock on hand</label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                required
                value={formData.current_stock}
                onChange={e => setFormData({ ...formData, current_stock: e.target.value })}
                placeholder="42"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-reorder">Reorder level</label>
              <input
                id="prod-reorder"
                type="number"
                min="0"
                required
                value={formData.reorder_threshold}
                onChange={e => setFormData({ ...formData, reorder_threshold: e.target.value })}
                placeholder="12"
              />
            </div>
          </div>

          <div className="form-row align-items-center">
            <div className="form-group">
              <label htmlFor="prod-unit">Unit</label>
              <select
                id="prod-unit"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              >
                {UNITS.map(u => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group profit-margin-col">
              <label className="profit-margin-label">Profit margin</label>
              <div
                className={`profit-margin-value ${
                  profit < 0 ? 'profit-margin-value--negative' : ''
                }`}
              >
                {sell > 0 ? `${marginPercent}%` : '—'}
              </div>
            </div>
          </div>

          <div className="product-modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-save"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
