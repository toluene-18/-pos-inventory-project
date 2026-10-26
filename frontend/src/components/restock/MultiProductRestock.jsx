import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';
import ProductThumbnail from '../ui/ProductThumbnail';
import { formatMoney } from '../../utils/dashboardStats';
import '../../styles/restock-invoice-modal.css';

export default function MultiProductRestock({
  products = [],
  batchItems = [],
  onUpdateBatch,
  onSubmitBulk,
  submitting,
}) {
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reason, setReason] = useState('Bulk supplier shipment received');

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        p =>
          (p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)) &&
          !batchItems.some(b => b.product.id === p.id)
      )
      .slice(0, 6);
  }, [products, search, batchItems]);

  function handleSelectProduct(prod) {
    onUpdateBatch([...batchItems, { product: prod, quantity: 20 }]);
    setSearch('');
    setIsDropdownOpen(false);
  }

  function handleQuantityChange(productId, newQty) {
    const qty = Math.max(1, parseInt(newQty, 10) || 1);
    onUpdateBatch(
      batchItems.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  }

  function handleRemoveItem(productId) {
    onUpdateBatch(batchItems.filter(item => item.product.id !== productId));
  }

  function handleClearAll() {
    onUpdateBatch([]);
  }

  const totalUnits = batchItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalCostEstimate = batchItems.reduce((sum, item) => {
    const cost = Number(item.product.cost_price) || Number(item.product.sell_price) * 0.7 || 0;
    return sum + cost * (Number(item.quantity) || 0);
  }, 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (batchItems.length === 0) return;
    const items = batchItems.map(b => ({
      product_id: b.product.id,
      type: 'increase',
      quantity: b.quantity,
      reason: `BULK RESTOCK: ${reason}`,
    }));
    onSubmitBulk({ items, totalUnits, batchItems });
  }

  return (
    <div className="batch-restock-container">
      <div className="batch-restock-head">
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
            Multi-Product Batch Restock
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>
            Search and add multiple items to restock together in one operation
          </p>
        </div>
        {batchItems.length > 0 && (
          <button type="button" className="btn-load-sample" onClick={handleClearAll}>
            Clear all ({batchItems.length})
          </button>
        )}
      </div>

      <div className="batch-search-row">
        <div className="batch-search-input">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Type product name or SKU to add to batch..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="batch-search-dropdown">
            {searchResults.map(p => (
              <button
                key={p.id}
                type="button"
                className="batch-dropdown-item"
                onClick={() => handleSelectProduct(p)}
              >
                <div>
                  <strong>{p.name}</strong> &bull; <small>{p.sku}</small>
                </div>
                <span className="text-muted">Stock: {p.inventory?.quantity ?? 0}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {batchItems.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <table className="batch-queue-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>ON HAND</th>
                <th>ADD UNITS</th>
                <th>NEW STOCK</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {batchItems.map(({ product, quantity }) => {
                const onHand = product.inventory?.quantity ?? 0;
                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ProductThumbnail src={product.image_path} name={product.name} style={{ width: 28, height: 28, borderRadius: 4 }} />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td><code>{product.sku}</code></td>
                    <td>{onHand}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        className="batch-qty-input"
                        value={quantity}
                        onChange={e => handleQuantityChange(product.id, e.target.value)}
                      />
                    </td>
                    <td><strong className="text-green">{onHand + quantity}</strong></td>
                    <td>
                      <button
                        type="button"
                        className="batch-btn-remove"
                        onClick={() => handleRemoveItem(product.id)}
                        title="Remove from batch"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="batch-restock-actions">
            <input
              type="text"
              className="batch-reason-input"
              placeholder="Reason note for batch restock..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <button type="submit" className="btn-modal-confirm" disabled={submitting}>
              <Icon name="check" size={15} />
              <span>
                {submitting ? 'Applying...' : `Restock ${batchItems.length} Products (+${totalUnits} units)`}
              </span>
            </button>
          </div>
        </form>
      ) : (
        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
          No products currently queued for batch restock. Search above or click "Import Delivery Invoice" to auto-populate.
        </p>
      )}
    </div>
  );
}
