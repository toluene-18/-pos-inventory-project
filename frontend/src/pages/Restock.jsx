import { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import RestockBatchTable from '../components/restock/RestockBatchTable';
import { getProducts, adjustStock } from '../services/api';
import '../styles/restock.css';

export default function Restock({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [waybillRef, setWaybillRef] = useState('');
  const [notes, setNotes] = useState('');
  const [batch, setBatch] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchCatalogue = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Failed to load products for restock.');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCatalogue();
  }, [fetchCatalogue]);

  const availableProducts = useMemo(() => {
    const inBatchIds = new Set(batch.map(b => b.product.id));
    return products.filter(p => !inBatchIds.has(p.id));
  }, [products, batch]);

  function handleAddProduct(prodId) {
    if (!prodId) return;
    const target = products.find(p => String(p.id) === String(prodId));
    if (!target) return;
    setBatch(prev => [...prev, { product: target, quantity: 10 }]);
    setSelectedProductId('');
  }

  function handleUpdateQuantity(productId, newQty) {
    setBatch(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, newQty) } : item
      )
    );
  }

  function handleRemoveItem(productId) {
    setBatch(prev => prev.filter(item => item.product.id !== productId));
  }

  const batchSummary = useMemo(() => {
    const totalUnits = batch.reduce((sum, b) => sum + (b.quantity || 0), 0);
    return { count: batch.length, totalUnits };
  }, [batch]);

  async function handleConfirmRestock(e) {
    e.preventDefault();
    if (batch.length === 0) {
      setError('Please add at least one product to the receiving batch.');
      return;
    }

    setSubmitting(true);
    setError('');

    const auditReason = `Delivery: ${supplierName || 'General Supplier'} (Ref: ${
      waybillRef || 'Direct Intake'
    })${notes ? ' - ' + notes : ''}`;

    try {
      for (const item of batch) {
        await adjustStock(item.product.id, {
          type: 'increase',
          quantity: item.quantity,
          reason: auditReason,
        });
      }

      setStatusMessage(
        `Successfully received ${batchSummary.totalUnits} units across ${batchSummary.count} products into inventory!`
      );
      setBatch([]);
      setSupplierName('');
      setWaybillRef('');
      setNotes('');
      await fetchCatalogue();
      setTimeout(() => setStatusMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to process restock batch.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isManagement) {
    return (
      <div className="restock-restricted">
        <Icon name="alert" size={32} />
        <h3>Access Restricted</h3>
        <p>Only store owners and managers are permitted to receive stock deliveries.</p>
      </div>
    );
  }

  return (
    <div className="restock-page">
      <header className="restock-header">
        <div>
          <h2>Stock Receiving & Delivery Intake</h2>
          <p>Register incoming inventory shipments, verify quantities, and apply bulk restock updates.</p>
        </div>
      </header>

      {statusMessage && (
        <div className="restock-alert restock-alert--success" role="status">
          <Icon name="check" size={16} /> {statusMessage}
        </div>
      )}

      {error && (
        <div className="restock-alert restock-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleConfirmRestock} className="restock-intake-form">
        <div className="restock-card">
          <div className="restock-card-head">
            <Icon name="inventory" size={18} />
            <h3>Delivery & Supplier Information</h3>
          </div>
          <div className="restock-fields-grid">
            <div className="form-group">
              <label htmlFor="restock-supplier">Supplier / Vendor Name</label>
              <input
                id="restock-supplier"
                type="text"
                placeholder="e.g. Nestlé Direct Distribution Ltd"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="restock-waybill">Invoice / Waybill Reference #</label>
              <input
                id="restock-waybill"
                type="text"
                placeholder="e.g. WB-2026-9042"
                value={waybillRef}
                onChange={e => setWaybillRef(e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="restock-notes">Delivery Remarks / Driver Notes</label>
              <input
                id="restock-notes"
                type="text"
                placeholder="e.g. Pallet 4 inspected; batch expiry verified 2028"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="restock-card">
          <div className="restock-card-head">
            <Icon name="plus" size={18} />
            <h3>Add Items to Intake Batch</h3>
          </div>
          <div className="restock-picker-bar">
            <select
              value={selectedProductId}
              onChange={e => {
                setSelectedProductId(e.target.value);
                handleAddProduct(e.target.value);
              }}
              disabled={loading || availableProducts.length === 0}
              className="restock-product-select"
            >
              <option value="">
                {availableProducts.length === 0
                  ? 'All products are in batch'
                  : 'Select a product to add to this intake batch...'}
              </option>
              {availableProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Current: {p.inventory?.quantity ?? 0} {p.unit || 'units'}
                </option>
              ))}
            </select>
          </div>

          <RestockBatchTable
            batch={batch}
            onUpdateQty={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {batch.length > 0 && (
            <div className="restock-summary-bar">
              <div className="restock-summary-counts">
                <span>Products in Batch: <strong>{batchSummary.count}</strong></span>
                <span>Total Units Being Received: <strong>+{batchSummary.totalUnits}</strong></span>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Icon name="check" size={16} />
                {submitting ? 'Applying Intake...' : `Receive & Apply Intake (+${batchSummary.totalUnits} units)`}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
