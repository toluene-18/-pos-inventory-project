import { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import StockAdjustModal from '../components/inventory/StockAdjustModal';
import { getProducts, adjustStock } from '../services/api';
import '../styles/inventory.css';

export default function Inventory({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const stats = useMemo(() => {
    let totalItems = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;
      totalItems += qty;
      if (qty <= 0) outOfStockCount += 1;
      else if (qty <= threshold) lowStockCount += 1;
    }

    return { totalItems, lowStockCount, outOfStockCount };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;

      if (stockFilter === 'out' && qty > 0) return false;
      if (stockFilter === 'low' && (qty <= 0 || qty > threshold)) return false;
      if (stockFilter === 'ok' && qty <= threshold) return false;

      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [products, search, stockFilter]);

  async function handleSaveAdjustment(adjustmentData) {
    if (!adjustingProduct) return;
    await adjustStock(adjustingProduct.id, adjustmentData);
    setStatusMessage(
      `Stock for "${adjustingProduct.name}" ${
        adjustmentData.type === 'increase' ? 'increased' : 'decreased'
      } by ${adjustmentData.quantity}.`
    );
    await fetchProducts();
    setTimeout(() => setStatusMessage(''), 4000);
  }

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div>
          <h2>Inventory Management</h2>
          <p>Audit stock quantities, review reorder alerts, and register manual stock adjustments.</p>
        </div>
      </header>

      {statusMessage && (
        <div className="inventory-alert inventory-alert--success" role="status">
          <Icon name="check" size={16} /> {statusMessage}
        </div>
      )}

      {error && (
        <div className="inventory-alert inventory-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <div className="inventory-stat-cards">
        <div className="inv-stat-card">
          <span className="inv-stat-icon inv-stat-icon--total">
            <Icon name="products" size={18} />
          </span>
          <div className="inv-stat-info">
            <small>Total Units in Store</small>
            <strong>{stats.totalItems.toLocaleString()}</strong>
          </div>
        </div>

        <div className="inv-stat-card">
          <span className="inv-stat-icon inv-stat-icon--low">
            <Icon name="alert" size={18} />
          </span>
          <div className="inv-stat-info">
            <small>Low Stock Alerts</small>
            <strong>{stats.lowStockCount}</strong>
          </div>
        </div>

        <div className="inv-stat-card">
          <span className="inv-stat-icon inv-stat-icon--out">
            <Icon name="x" size={18} />
          </span>
          <div className="inv-stat-info">
            <small>Completely Out of Stock</small>
            <strong>{stats.outOfStockCount}</strong>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="inventory-search-wrap">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search by product name, SKU or barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="inventory-tabs">
          <button
            type="button"
            className={`inv-tab ${stockFilter === 'all' ? 'inv-tab--active' : ''}`}
            onClick={() => setStockFilter('all')}
          >
            All Stock
          </button>
          <button
            type="button"
            className={`inv-tab ${stockFilter === 'low' ? 'inv-tab--active' : ''}`}
            onClick={() => setStockFilter('low')}
          >
            Low Stock ({stats.lowStockCount})
          </button>
          <button
            type="button"
            className={`inv-tab ${stockFilter === 'out' ? 'inv-tab--active' : ''}`}
            onClick={() => setStockFilter('out')}
          >
            Out of Stock ({stats.outOfStockCount})
          </button>
        </div>
      </div>

      <div className="inventory-table-container">
        {loading ? (
          <div className="inventory-loading">Checking inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            <Icon name="inventory" size={32} />
            <p>No inventory items match your current filter.</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>On Hand Qty</th>
                <th>Reorder Point</th>
                <th>Stock Status</th>
                {isManagement && <th className="text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const qty = p.inventory?.quantity ?? 0;
                const threshold = p.inventory?.reorder_threshold ?? 0;
                const isLow = qty <= threshold && qty > 0;
                const isOut = qty <= 0;

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="inv-prod-cell">
                        <strong>{p.name}</strong>
                        <span className="inv-sku-tag">{p.sku}</span>
                      </div>
                    </td>
                    <td>
                      <span className="inv-cat-pill">
                        {p.category ? p.category.replace('_', ' ') : 'General'}
                      </span>
                    </td>
                    <td>
                      <strong className="inv-qty-value">{qty}</strong>
                    </td>
                    <td>{threshold}</td>
                    <td>
                      <span
                        className={`inv-badge ${
                          isOut ? 'inv-badge--out' : isLow ? 'inv-badge--low' : 'inv-badge--ok'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    {isManagement && (
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setAdjustingProduct(p)}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <StockAdjustModal
        isOpen={Boolean(adjustingProduct)}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSave={handleSaveAdjustment}
      />
    </div>
  );
}
