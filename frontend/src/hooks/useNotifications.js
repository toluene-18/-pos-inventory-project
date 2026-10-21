import { useCallback, useEffect, useState } from 'react';
import { getProducts, getSalesInRange } from '../services/api';
import {
  buildLowStock,
  formatDateYmd,
  formatMoney,
  formatRelativeTime,
  paymentLabel,
} from '../utils/dashboardStats';

const STORAGE_KEY = 'cwg-read-notifications';
const REFRESH_MS = 60_000;

function loadRead() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveRead(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].slice(-200)));
  } catch {
    // storage unavailable — read state just won't persist
  }
}

function toNotifications(products, sales) {
  const stock = buildLowStock(products).map(item => ({
    id: `stock-${item.id}-${item.qty}`,
    type: item.status === 'out' ? 'out' : 'low',
    title: item.status === 'out' ? `Out of stock — ${item.name}` : `Low stock — ${item.name}`,
    detail: `${item.qty} left · reorder at ${item.reorder}`,
    time: 'Now',
    target: 'Inventory',
  }));

  const recent = sales.slice(0, 5).map(sale => ({
    id: `sale-${sale.id}`,
    type: 'sale',
    title: `Sale #${sale.id} completed`,
    detail: `${formatMoney(sale.total)} · ${paymentLabel(sale.payment_method)}`,
    time: formatRelativeTime(sale.created_at),
    target: 'Sales',
  }));

  return [...stock, ...recent];
}

/** useNotifications — low-stock + today's sales alerts with read tracking. */
export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [read, setRead] = useState(loadRead);

  const refresh = useCallback(async () => {
    const today = formatDateYmd(new Date());
    const [products, sales] = await Promise.allSettled([
      getProducts(),
      getSalesInRange({ from: today, to: today }),
    ]);
    setItems(
      toNotifications(
        products.status === 'fulfilled' ? products.value : [],
        sales.status === 'fulfilled' ? sales.value.sales : []
      )
    );
  }, []);

  useEffect(() => {
    // Initial fetch + polling; setState happens after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const markAllRead = useCallback(() => {
    setRead(prev => {
      const next = new Set(prev);
      items.forEach(item => next.add(item.id));
      saveRead(next);
      return next;
    });
  }, [items]);

  const withRead = items.map(item => ({ ...item, unread: !read.has(item.id) }));
  const unreadCount = withRead.filter(item => item.unread).length;

  return { items: withRead, unreadCount, markAllRead, refresh };
}
