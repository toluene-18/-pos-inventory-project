import { useState } from 'react';
import Icon from '../ui/Icon';
import '../../styles/products-modal.css';

const CATEGORIES = [
  'groceries',
  'beverages',
  'snacks',
  'household',
  'personal_care',
  'dairy_breakfast',
  'stationery',
];

function getInitialState(product) {
  if (product) {
    return {
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || 'groceries',
      cost_price: product.cost_price ?? '',
      sell_price: product.sell_price ?? '',
      current_stock: product.inventory?.quantity ?? '0',
      reorder_threshold: product.inventory?.reorder_threshold ?? '5',
    };
  }
  return {
    name: '',
    sku: '',
    category: 'groceries',
    cost_price: '',
    sell_price: '',
    current_stock: '0',
    reorder_threshold: '5',
  };
}

export default function ProductFormModal({ product, isOpen, onClose, onSave }) {
  const isEditing = Boolean(product);
  const [formData, setFormData] = useState(() => getInitialState(product));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category,
        cost_price: parseFloat(formData.cost_price),
        sell_price: parseFloat(formData.sell_price),
      };

      if (!isEditing) {
        payload.current_stock = parseInt(formData.current_stock, 10) || 0;
        payload.reorder_threshold = parseInt(formData.reorder_threshold, 10) || 0;
      }

      await onSave(payload, product?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="product-modal-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal">
        <div className="product-modal-head">
          <div className="product-modal-title">
            <span className="product-modal-icon">
              <Icon name="products" size={18} />
            </span>
            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <button type="button" className="product-modal-close" onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {error && (
          <div className="product-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="prod-name">Product Name *</label>
            <input
              id="prod-name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Golden Morn Cereal 900g"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-sku">SKU / Barcode *</label>
              <input
                id="prod-sku"
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. GM-900"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-category">Category *</label>
              <select
                id="prod-category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-cost">Cost Price (₦) *</label>
              <input
                id="prod-cost"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost_price}
                onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-sell">Selling Price (₦) *</label>
              <input
                id="prod-sell"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.sell_price}
                onChange={e => setFormData({ ...formData, sell_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prod-stock">Initial Stock Quantity *</label>
                <input
                  id="prod-stock"
                  type="number"
                  min="0"
                  required
                  value={formData.current_stock}
                  onChange={e => setFormData({ ...formData, current_stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="prod-threshold">Reorder Alert Threshold *</label>
                <input
                  id="prod-threshold"
                  type="number"
                  min="0"
                  required
                  value={formData.reorder_threshold}
                  onChange={e => setFormData({ ...formData, reorder_threshold: e.target.value })}
                  placeholder="5"
                />
              </div>
            </div>
          )}

          <div className="product-modal-actions">
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
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
