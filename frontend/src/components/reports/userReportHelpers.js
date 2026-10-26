import { formatMoney } from '../../utils/dashboardStats';

export function buildStaffStats(staff, sales, searchQuery) {
  const statsMap = {};

  staff.forEach(u => {
    statsMap[u.id] = {
      user: u,
      saleCount: 0,
      revenue: 0,
      cash: 0,
      card: 0,
      transfer: 0,
      lastSaleTime: null,
    };
  });

  sales.forEach(s => {
    const uId = s.user_id || s.user?.id;
    if (!uId) return;
    if (!statsMap[uId]) {
      statsMap[uId] = {
        user: s.user || { id: uId, name: `User #${uId}`, role: 'staff' },
        saleCount: 0,
        revenue: 0,
        cash: 0,
        card: 0,
        transfer: 0,
        lastSaleTime: null,
      };
    }

    const total = Number(s.total) || 0;
    statsMap[uId].saleCount += 1;
    statsMap[uId].revenue += total;

    if (s.payment_method === 'cash') statsMap[uId].cash += total;
    else if (s.payment_method === 'card') statsMap[uId].card += total;
    else if (s.payment_method === 'bank_transfer') statsMap[uId].transfer += total;

    const saleTime = new Date(s.created_at).getTime();
    if (!statsMap[uId].lastSaleTime || saleTime > statsMap[uId].lastSaleTime) {
      statsMap[uId].lastSaleTime = saleTime;
    }
  });

  const q = searchQuery.trim().toLowerCase();
  return Object.values(statsMap).filter(st => {
    if (!q) return true;
    const name = st.user.name?.toLowerCase() || '';
    const email = st.user.email?.toLowerCase() || '';
    const role = st.user.role?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || role.includes(q);
  });
}

export function buildActivityEvents(sales, adjustments, searchQuery, selectedStaff) {
  const q = searchQuery.trim().toLowerCase();
  const events = [];

  sales.forEach(s => {
    const staffName = s.user?.name || 'Staff';
    const userRole = s.user?.role || 'cashier';
    const itemsCount = s.items?.length || 1;
    const total = Number(s.total) || 0;
    const timeMs = new Date(s.created_at).getTime();

    events.push({
      id: `sale-${s.id}`,
      timestamp: s.created_at,
      timeMs,
      userName: staffName,
      userRole,
      actionType: 'sale',
      actionLabel: 'Sale Completed',
      detail: `Receipt #${s.receipt_number || String(s.id).padStart(5, '0')} · ${itemsCount} line item(s) via ${s.payment_method || 'cash'}`,
      value: formatMoney(total),
    });
  });

  adjustments.forEach(a => {
    const staffName = a.staffName || a.user?.name || 'Manager';
    const userRole = a.user?.role || 'manager';
    const timeMs = a.timestamp || new Date(a.createdAt || a.created_at).getTime() || Date.now();
    const type = (a.type || 'restock').toLowerCase();

    events.push({
      id: `adj-${a.id || Math.random()}`,
      timestamp: a.createdAt || a.created_at || new Date().toISOString(),
      timeMs,
      userName: staffName,
      userRole,
      actionType: type.includes('damage') ? 'damage' : type.includes('correct') ? 'correction' : 'restock',
      actionLabel: type.includes('damage') ? 'Stock Damage' : type.includes('correct') ? 'Inventory Recount' : 'Stock Restocked',
      detail: `${a.productName || 'Product'} · ${a.reason || 'Inventory update'}`,
      value: `${a.quantityChange > 0 ? '+' : ''}${a.quantityChange || a.quantity || 0} units`,
    });
  });

  events.sort((a, b) => b.timeMs - a.timeMs);

  const filtered = selectedStaff === 'all' ? events : events.filter(e => e.userName === selectedStaff);

  if (!q) return filtered.slice(0, 50);
  return filtered.filter(e =>
    e.userName.toLowerCase().includes(q) ||
    e.actionLabel.toLowerCase().includes(q) ||
    e.detail.toLowerCase().includes(q)
  ).slice(0, 50);
}
