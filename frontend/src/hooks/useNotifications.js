import { useCallback, useEffect, useState } from 'react';
import { getProducts, getSalesInRange, getStaff, updateStaffStatus } from '../services/api';
import {
  buildLowStock,
  formatDateYmd,
  formatMoney,
  formatRelativeTime,
  paymentLabel,
} from '../utils/dashboardStats';

const STORAGE_KEY = 'cwg-read-notifications';
const REFRESH_MS = 30_000;

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
    // storage unavailable
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

export default function useNotifications(user) {
  const [items, setItems] = useState([]);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [read, setRead] = useState(loadRead);

  const isOwner = user?.role === 'owner';

  const refresh = useCallback(async () => {
    const today = formatDateYmd(new Date());
    const tasks = [
      getProducts(),
      getSalesInRange({ from: today, to: today }),
    ];

    if (isOwner) {
      tasks.push(getStaff());
    }

    const [productsRes, salesRes, staffRes] = await Promise.allSettled(tasks);

    setItems(
      toNotifications(
        productsRes.status === 'fulfilled' ? productsRes.value : [],
        salesRes.status === 'fulfilled' ? salesRes.value.sales : []
      )
    );

    if (isOwner && staffRes && staffRes.status === 'fulfilled') {
      const allStaff = Array.isArray(staffRes.value) ? staffRes.value : [];
      setPendingStaff(allStaff.filter(s => s.status === 'pending'));
    }
  }, [isOwner]);

  useEffect(() => {
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

  const approveStaff = useCallback(async (userId) => {
    await updateStaffStatus(userId, { status: 'active' });
    setPendingStaff(prev => prev.filter(s => s.id !== userId));
  }, []);

  const withRead = items.map(item => ({ ...item, unread: !read.has(item.id) }));
  const unreadCount = withRead.filter(item => item.unread).length + pendingStaff.length;

  return {
    items: withRead,
    unreadCount,
    pendingStaff,
    approveStaff,
    markAllRead,
    refresh,
  };
}
