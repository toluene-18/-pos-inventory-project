import { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '../components/ui/Icon';
import ProductFormModal from '../components/products/ProductFormModal';
import ProductsTable from '../components/products/ProductsTable';
import {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} from '../services/api';
import { PRODUCT_PAGE_CATEGORIES } from '../utils/categories';
import '../styles/products.css';
import '../styles/products-grid.css';

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
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const activeCatObj = PRODUCT_PAGE_CATEGORIES.find(c => c.id === selectedCategory);

    return products.filter(p => {
      if (selectedCategory !== 'all' && activeCatObj) {
        const matchesCategory =
          activeCatObj.match.includes(p.category) ||
          p.category === selectedCategory ||
          p.category?.toLowerCase().includes(selectedCategory);
        if (!matchesCategory) return false;
      }

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
      {/* Top Header matching Readdy Screenshot */}
      <header className="products-header-readdy">
        <div className="products-title-group">
          <div className="products-title-badge">
            <Icon name="tag" size={20} />
          </div>
          <div>
            <h2>Products</h2>
            <p>Manage the catalogue, pricing and reorder rules.</p>
          </div>
        </div>

        {isManagement && (
          <button
            type="button"
            className="btn-add-product"
            onClick={handleOpenCreate}
          >
            <Icon name="plus" size={15} />
            <span>Add product</span>
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

      {/* Filter Category Pills + Right-aligned Search Bar */}
      <div className="products-toolbar-readdy">
        <div className="products-category-pills">
          {PRODUCT_PAGE_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`prod-cat-pill ${isActive ? 'prod-cat-pill--active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="products-search-box-readdy">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Products Grid (no table view) */}
      <main className="products-grid-section">
        <ProductsTable
          products={filteredProducts}
          loading={loading}
          isManagement={isManagement}
          onEdit={handleOpenEdit}
          onDeactivate={handleDeactivate}
        />
      </main>

      <ProductFormModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
