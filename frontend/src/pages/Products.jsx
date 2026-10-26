import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
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

const PRODUCTS_PER_PAGE = 8;

export default function Products({ user, onSessionExpired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const isManagement = ['owner', 'manager'].includes(user?.role);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else toast.error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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
      toast.success('Product updated successfully.');
    } else {
      await createProduct(payload);
      toast.success('Product created successfully.');
    }
    await fetchProducts();
  }

  async function handleDeactivate(product) {
    if (!window.confirm(`Are you sure you want to deactivate "${product.name}"?`)) {
      return;
    }
    try {
      await deactivateProduct(product.id);
      toast.success(`Product "${product.name}" deactivated.`);
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate product.');
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

      {/* Products Grid (max 8 per page) */}
      <main className="products-grid-section">
        <ProductsTable
          products={paginatedProducts}
          loading={loading}
          isManagement={isManagement}
          onEdit={handleOpenEdit}
          onDeactivate={handleDeactivate}
        />

        {filteredProducts.length > PRODUCTS_PER_PAGE && (
          <div className="products-pagination">
            <span className="pagination-text">
              Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
              {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} items
            </span>
            <div className="pagination-btn-group">
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="pagination-current-page">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
