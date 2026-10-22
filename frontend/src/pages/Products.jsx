import { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import ProductFormModal from '../components/products/ProductFormModal';
import {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} from '../services/api';
import { formatMoney } from '../utils/dashboardStats';
import '../styles/products.css';

export default function Products({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
          <p>Manage items, prices, SKUs, and stock tracking across all categories.</p>
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
          <label htmlFor="cat-filter">Category:</label>
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
        </div>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="products-loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty">
            <Icon name="products" size={32} />
            <p>No products found matching your filters.</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                {isManagement && <th>Cost Price</th>}
                <th>Sell Price</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                {isManagement && <th className="text-right">Actions</th>}
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
                      <div className="product-name-cell">
                        <strong>{p.name}</strong>
                        <span className="product-sku-tag">{p.sku}</span>
                      </div>
                    </td>
                    <td>
                      <span className="product-cat-pill">
                        {p.category ? p.category.replace('_', ' ') : 'General'}
                      </span>
                    </td>
                    {isManagement && (
                      <td className="product-cost-cell">
                        {p.cost_price ? formatMoney(p.cost_price) : '—'}
                      </td>
                    )}
                    <td className="product-price-cell">
                      <strong>{formatMoney(p.sell_price)}</strong>
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          isOut ? 'stock-badge--out' : isLow ? 'stock-badge--low' : 'stock-badge--ok'
                        }`}
                      >
                        {qty} {isOut ? '(Out)' : isLow ? '(Low)' : 'in stock'}
                      </span>
                    </td>
                    <td className="product-threshold-cell">{threshold}</td>
                    {isManagement && (
                      <td className="text-right product-actions-cell">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Product"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon--danger"
                          title="Deactivate Product"
                          onClick={() => handleDeactivate(p)}
                        >
                          <Icon name="trash" size={16} />
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

      <ProductFormModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
