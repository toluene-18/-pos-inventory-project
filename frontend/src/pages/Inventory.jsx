import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import StockAdjustModal from '../components/inventory/StockAdjustModal';
import InventoryKpis from '../components/inventory/InventoryKpis';
import InventoryTable from '../components/inventory/InventoryTable';
import { getProducts, adjustStock } from '../services/api';
import { formatCategory } from '../utils/categories';
import '../styles/inventory.css';
import '../styles/inventory-modal.css';
import '../styles/inventory-table.css';

export default function Inventory({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('low-to-high');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [restockTargets, setRestockTargets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
      const cost = Number(p.cost_price) || 0;
      stockValueCost += cost * qty;
      if (qty <= 0) outOfStockCount += 1;
      else if (qty <= threshold) lowStockCount += 1;
    }

    return {
      productCount: products.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      stockValueCost,
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
      if (sortBy === 'low-to-high') return qtyA - qtyB;
      if (sortBy === 'high-to-low') return qtyB - qtyA;
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [products, search, stockFilter, categoryFilter, sortBy]);

  function handleToggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleToggleSelectAll() {
    if (filteredProducts.every(p => selectedIds.has(p.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  }

  function handleSelectAttention() {
    const attention = products.filter(p => {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;
      return qty <= threshold;
    });
    setSelectedIds(new Set(attention.map(p => p.id)));
  }

  function handleQuickRestock(product) {
    setRestockTargets([product]);
    setIsModalOpen(true);
  }

  function handleBulkRestockClick() {
    const selected = products.filter(p => selectedIds.has(p.id));
    if (selected.length === 0) return;
    setRestockTargets(selected);
    setIsModalOpen(true);
  }

  async function handleConfirmRestock({ products: targetProducts, unitsPerProduct, totalUnits, reason }) {
    for (const p of targetProducts) {
      await adjustStock(p.id, {
        type: 'increase',
        quantity: unitsPerProduct,
        reason,
      });
    }

    setToastMessage(
      `Restocked ${targetProducts.length} product${targetProducts.length > 1 ? 's' : ''} — +${totalUnits} units added.`
    );
    setSelectedIds(new Set());
    await fetchProducts();
    setTimeout(() => setToastMessage(''), 4000);
  }

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div>
          <h2>Inventory</h2>
          <p>Every product on the shelf, with live stock levels, filters, and one-tap restocking.</p>
        </div>

        <div className="inventory-header-actions">
          <Link to="/restock" className="inv-btn-secondary">
            <Icon name="clock" size={14} />
            <span>Adjustment history</span>
          </Link>
          <Link to="/products" className="inv-btn-primary">
            <Icon name="plus" size={14} />
            <span>Add product</span>
          </Link>
        </div>
      </header>

      {error && (
        <div className="inventory-alert inventory-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <InventoryKpis stats={stats} isManagement={isManagement} />

      <div className="inventory-controls">
        <div className="inventory-toolbar-top">
          <div className="inventory-search-wrap">
            <Icon name="search" size={15} />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
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
              <option value="all">All categories</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="inv-select"
            >
              <option value="low-to-high">Stock: low to high</option>
              <option value="high-to-low">Stock: high to low</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>

            <button
              type="button"
              className="btn-select-attention"
              onClick={handleSelectAttention}
            >
              ⚡ Select all low & out of stock
            </button>
          </div>
        </div>

        <div className="inventory-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'ok', label: 'In stock' },
            { id: 'low', label: 'Low' },
            { id: 'out', label: 'Out' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`inv-tab ${stockFilter === tab.id ? 'inv-tab--active' : ''}`}
              onClick={() => setStockFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          {selectedIds.size > 0 && (
            <button
              type="button"
              className="btn-select-attention ml-auto"
              onClick={handleBulkRestockClick}
            >
              Restock {selectedIds.size} Selected Items
            </button>
          )}
        </div>
      </div>

      <div className="inventory-table-container">
        <InventoryTable
          products={filteredProducts}
          loading={loading}
          isManagement={isManagement}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onQuickRestock={handleQuickRestock}
        />
      </div>

      <StockAdjustModal
        isOpen={isModalOpen}
        selectedProducts={restockTargets}
        onClose={() => setIsModalOpen(false)}
        onConfirmRestock={handleConfirmRestock}
      />

      {toastMessage && (
        <div className="floating-toast-popup" role="status">
          <Icon name="check" size={15} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
