import ProductTile from './ProductTile';

/** ProductGrid — responsive grid of product tiles with loading/empty states. */
function ProductGrid({ products, total, loading, error, cartQty, onAdd }) {
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
        <div className="pos-grid">
          {products.map(p => (
            <ProductTile key={p.id} product={p} inCart={cartQty[p.id] || 0} onAdd={onAdd} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProductGrid;
