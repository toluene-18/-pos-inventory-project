import { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import ProductFormModal from '../components/products/ProductFormModal';
import ProductKpis from '../components/products/ProductKpis';
import ProductsTable from '../components/products/ProductsTable';
import {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} from '../services/api';
import '../styles/products.css';

export default function Products({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
      else setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const stats = useMemo(() => {
    let totalProducts = products.length;
    let needsAttention = 0;
    let belowCostCount = 0;
    let marginSum = 0;
    let marginCount = 0;

    for (const p of products) {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.reorder_threshold ?? 0;
      if (qty <= threshold) needsAttention += 1;

      if (p.cost_price != null && p.sell_price != null) {
        const cost = Number(p.cost_price);
        const sell = Number(p.sell_price);
        if (sell < cost) belowCostCount += 1;
        if (sell > 0) {
          marginSum += ((sell - cost) / sell) * 100;
          marginCount += 1;
        }
      }
    }

    const avgMargin = marginCount > 0 ? Math.round(marginSum / marginCount) : 0;
    return { totalProducts, needsAttention, belowCostCount, avgMargin };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [products, search, selectedCategory]);

  function handleOpenCreate() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function handleOpenEdit(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleSaveProduct(payload, id) {
    if (id) {
      await updateProduct(id, payload);
      setStatusMessage('Product updated successfully.');
    } else {
      await createProduct(payload);
      setStatusMessage('Product created successfully.');
    }
    await fetchProducts();
    setTimeout(() => setStatusMessage(''), 4000);
  }

  async function handleDeactivate(product) {
    if (!window.confirm(`Are you sure you want to deactivate "${product.name}"?`)) {
      return;
    }
    try {
      await deactivateProduct(product.id);
      setStatusMessage(`Product "${product.name}" deactivated.`);
      await fetchProducts();
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to deactivate product.');
    }
  }

  return (
    <div className="products-page">
      <header className="products-header">
        <div>
          <h2>Product Catalogue</h2>
          <p>Manage items, prices, SKUs, product photos, and profit margin analysis.</p>
        </div>
        {isManagement && (
          <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
            <Icon name="plus" size={16} /> Add Product
          </button>
        )}
      </header>

      {statusMessage && (
        <div className="product-alert product-alert--success" role="status">
          <Icon name="check" size={16} /> {statusMessage}
        </div>
      )}

      {error && (
        <div className="product-alert product-alert--error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <ProductKpis stats={stats} isManagement={isManagement} />

      <div className="products-controls">
        <div className="products-search-wrap">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search by name, SKU or barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="products-filter-wrap">
          <select
            id="cat-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'view-btn--active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              Table
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      <div className="products-table-container">
        <ProductsTable
          products={filteredProducts}
          loading={loading}
          isManagement={isManagement}
          viewMode={viewMode}
          onEdit={handleOpenEdit}
          onDeactivate={handleDeactivate}
        />
      </div>

      <ProductFormModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
