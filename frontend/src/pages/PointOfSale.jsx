import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/ui/Icon';
import ProductSearchBar from '../components/pos/ProductSearchBar';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import ReceiptModal from '../components/pos/ReceiptModal';
import useProducts from '../hooks/useProducts';
import useCart from '../hooks/useCart';
import { createSale } from '../services/api';
import '../styles/pos.css';
import '../styles/pos-cart.css';

/** PointOfSale — product browser + cart + checkout + receipt. */
function PointOfSale({ user, onSessionExpired }) {
  const catalog = useProducts({ onSessionExpired });
  const cart = useCart();
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const searchRef = useRef(null);

  const cartQty = useMemo(
    () => Object.fromEntries(cart.lines.map(l => [l.product.id, l.quantity])),
    [cart.lines]
  );

  // "/" focuses search, like most POS / admin tools.
  useEffect(() => {
    const onKey = e => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function handleAdd(product) {
    setError('');
    cart.add(product);
  }

  function handleSku(sku) {
    const match = catalog.findBySku(sku);
    if (match) {
      handleAdd(match);
      catalog.setQuery('');
    } else if (catalog.products.length === 1) {
      handleAdd(catalog.products[0]);
      catalog.setQuery('');
    }
  }

  async function handleCheckout() {
    setSubmitting(true);
    setError('');
    try {
      const sale = await createSale({
        paymentMethod: method,
        items: cart.lines.map(l => ({ product_id: l.product.id, quantity: l.quantity })),
      });
      setReceipt({ sale, tendered });
      cart.clear();
      catalog.reload();
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Checkout failed. Please try again.');
      // Stock may have changed under us — refresh so the cart caps update.
      if (err.status === 422) catalog.reload();
    } finally {
      setSubmitting(false);
    }
  }

  const closeReceipt = useCallback(() => {
    setReceipt(null);
    setTendered('');
    setMethod('cash');
    searchRef.current?.focus();
  }, []);

  return (
    <div className="pos">
      <header className="pos-header">
        <span className="pos-header-icon"><Icon name="pos" size={20} /></span>
        <div>
          <h2>Point of Sale</h2>
          <p>Scan or tap items to build a sale — stock updates automatically.</p>
        </div>
      </header>

      <div className="pos-layout">
        <section className="pos-catalog" aria-label="Products">
          <ProductSearchBar
            inputRef={searchRef}
            query={catalog.query}
            onQuery={catalog.setQuery}
            onSubmitSku={handleSku}
            categories={catalog.categories}
            category={catalog.category}
            onCategory={catalog.setCategory}
          />
          <ProductGrid
            products={catalog.products}
            total={catalog.total}
            loading={catalog.loading}
            error={catalog.error}
            cartQty={cartQty}
            onAdd={handleAdd}
          />
        </section>

        <CartPanel
          cart={cart}
          payment={{ method, setMethod, tendered, setTendered }}
          submitting={submitting}
          error={error}
          onCheckout={handleCheckout}
        />
      </div>

      {receipt && (
        <ReceiptModal
          sale={receipt.sale}
          tendered={receipt.tendered}
          cashier={user?.name || user?.email || 'Staff'}
          onClose={closeReceipt}
        />
      )}
    </div>
  );
}

export default PointOfSale;
