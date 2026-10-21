import { useCallback, useMemo, useState } from 'react';
import { stockOf } from './useProducts';

/**
 * useCart — cart lines keyed by product id.
 * Quantities are capped at available stock; the server re-validates anyway.
 */
export default function useCart() {
  const [lines, setLines] = useState([]);

  const add = useCallback(product => {
    setLines(prev => {
      const max = stockOf(product);
      const existing = prev.find(l => l.product.id === product.id);
      if (existing) {
        return prev.map(l =>
          l.product.id === product.id ? { ...l, quantity: Math.min(l.quantity + 1, max) } : l
        );
      }
      return max > 0 ? [...prev, { product, quantity: 1 }] : prev;
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setLines(prev =>
      prev
        .map(l => (l.product.id === id
          ? { ...l, quantity: Math.min(Math.max(quantity, 0), stockOf(l.product)) }
          : l))
        .filter(l => l.quantity > 0)
    );
  }, []);

  const remove = useCallback(id => setLines(prev => prev.filter(l => l.product.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  /** Refresh product data (stock) on lines after a product reload. */
  const sync = useCallback(products => {
    setLines(prev =>
      prev
        .map(l => {
          const fresh = products.find(p => p.id === l.product.id);
          return fresh ? { product: fresh, quantity: Math.min(l.quantity, stockOf(fresh)) } : null;
        })
        .filter(l => l && l.quantity > 0)
    );
  }, []);

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, l) => Math.round((sum + Number(l.product.sell_price) * l.quantity) * 100) / 100,
      0
    );
    const units = lines.reduce((sum, l) => sum + l.quantity, 0);
    return { subtotal, total: subtotal, units };
  }, [lines]);

  return { lines, add, setQuantity, remove, clear, sync, ...totals };
}
