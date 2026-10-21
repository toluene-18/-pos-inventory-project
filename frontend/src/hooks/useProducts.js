import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProducts } from '../services/api';

export function stockOf(product) {
  return Number(product.inventory?.quantity) || 0;
}

export function stockStatus(product) {
  const qty = stockOf(product);
  const reorder = Number(product.inventory?.reorder_threshold) || 0;
  if (qty <= 0) return 'out';
  if (qty <= reorder) return 'low';
  return 'in';
}

/** useProducts — active products with search + category filtering. */
export default function useProducts({ onSessionExpired } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const reload = useCallback(async () => {
    try {
      const list = await getProducts();
      setProducts(list.filter(p => p.is_active !== false && p.is_active !== 0));
      setError('');
    } catch (err) {
      if (err.status === 401) onSessionExpired?.();
      else setError(err.message || 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, [onSessionExpired]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))].sort(),
    [products]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || String(p.sku).toLowerCase().includes(q);
    });
  }, [products, query, category]);

  /** Exact SKU match — used when a barcode scanner "types" a SKU + Enter. */
  const findBySku = useCallback(
    sku => products.find(p => String(p.sku).toLowerCase() === sku.trim().toLowerCase()),
    [products]
  );

  return {
    products: visible, total: products.length, categories, loading, error,
    query, setQuery, category, setCategory, findBySku, reload,
  };
}
