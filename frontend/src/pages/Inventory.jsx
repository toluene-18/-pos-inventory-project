import { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import StockAdjustModal from '../components/inventory/StockAdjustModal';
import InventoryKpis from '../components/inventory/InventoryKpis';
import InventoryTable from '../components/inventory/InventoryTable';
import { getProducts, adjustStock } from '../services/api';
import '../styles/inventory.css';

export default function Inventory({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
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

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort();
    return ['all', ...list];
  }, [products]);

  const stats = useMemo(() => {
    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let stockValueCost = 0;

    for (const p of products) {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;
      totalUnits += qty;
      if (p.cost_price) {
        stockValueCost += Number(p.cost_price) * qty;
      }
      if (qty <= 0) outOfStockCount += 1;
      else if (qty <= threshold) lowStockCount += 1;
    }

    return {
      productCount: products.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      stockValueCost,
      needsAttention: lowStockCount + outOfStockCount,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = products.filter(p => {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;

      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
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

    result.sort((a, b) => {
      const qtyA = a.inventory?.quantity ?? 0;
      const qtyB = b.inventory?.quantity ?? 0;
      if (sortBy === 'qty-desc') return qtyB - qtyA;
      if (sortBy === 'qty-asc') return qtyA - qtyB;
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [products, search, stockFilter, categoryFilter, sortBy]);

  async function handleSaveAdjustment(adjustmentData) {
    if (!adjustingProduct) return;
    await adjustStock(adjustingProduct.id, adjustmentData);
    setStatusMessage(
      `Stock for "${adjustingProduct.name}" ${
        adjustmentData.type === 'increase' ? 'increased' : 'decreased'
      } by ${adjustmentData.quantity} ${adjustingProduct.unit || 'units'}.`
    );
    await fetchProducts();
    setTimeout(() => setStatusMessage(''), 4000);
  }

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div>
          <h2>Inventory Management</h2>
          <p>Track stock levels, review alerts, monitor valuation, and audit physical counts.</p>
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

      <InventoryKpis stats={stats} isManagement={isManagement} />

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

        <div className="inventory-filter-group">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="inv-select"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="inv-select"
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="qty-desc">Sort: Highest Stock First</option>
            <option value="qty-asc">Sort: Lowest Stock First</option>
          </select>
        </div>

        <div className="inventory-tabs">
          <button
            type="button"
            className={`inv-tab ${stockFilter === 'all' ? 'inv-tab--active' : ''}`}
            onClick={() => setStockFilter('all')}
          >
            All Items
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
        <InventoryTable
          products={filteredProducts}
          loading={loading}
          isManagement={isManagement}
          onAdjust={setAdjustingProduct}
        />
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
