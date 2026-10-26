import { useState, useEffect, useMemo } from 'react';
import ProductTile from './ProductTile';

const POS_PAGE_SIZE = 12;

/** ProductGrid — responsive grid of product tiles with 12-item pagination and loading/empty states. */
function ProductGrid({ products, total, loading, error, cartQty, onAdd }) {
  const [page, setPage] = useState(1);

  // Reset to page 1 if product catalogue/search results change
  useEffect(() => {
    setPage(1);
  }, [products.length]);

  const totalPages = Math.max(1, Math.ceil(products.length / POS_PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * POS_PAGE_SIZE;
    return products.slice(start, start + POS_PAGE_SIZE);
  }, [products, page]);

  if (loading) {
    return (
      <div className="pos-grid" aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="pos-tile pos-skeleton" />)}
      </div>
    );
  }

  if (error) return <p className="pos-empty pos-empty--error" role="alert">{error}</p>;

  return (
    <>
      <div className="pos-grid-meta">
        <span>{products.length} of {total} products</span>
        <span>Tap a product to add it to the cart</span>
      </div>
      {products.length === 0 ? (
        <p className="pos-empty">No products match your search.</p>
      ) : (
        <>
          <div className="pos-grid">
            {paginated.map(p => (
              <ProductTile key={p.id} product={p} inCart={cartQty[p.id] || 0} onAdd={onAdd} />
            ))}
          </div>

          {products.length > POS_PAGE_SIZE && (
            <div className="pos-pagination-bar">
              <span className="pos-pagination-info">
                Showing {(page - 1) * POS_PAGE_SIZE + 1}–{Math.min(page * POS_PAGE_SIZE, products.length)} of {products.length}
              </span>
              <div className="pos-pagination-controls">
                <button
                  type="button"
                  className="pos-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="pos-page-indicator">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="pos-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ProductGrid;
