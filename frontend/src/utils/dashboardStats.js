const moneyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return '₦0.00';
  }

  return moneyFormatter.format(amount);
}

export function formatDateYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateYmd(ymd, days) {
  const [year, month, day] = ymd.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateYmd(date);
}

export function eachDateYmd(from, to) {
  const dates = [];
  let current = from;

  while (current <= to) {
    dates.push(current);
    current = shiftDateYmd(current, 1);
  }

  return dates;
}

export function addMoney(left, right) {
  return Math.round((Number(left) + Number(right)) * 100) / 100;
}

export function summarizeSales(sales) {
  const count = sales.length;
  const revenue = sales.reduce((sum, sale) => addMoney(sum, sale.total), 0);
  const average = count === 0 ? 0 : Math.round((revenue / count) * 100) / 100;

  return { count, revenue, average };
}

export function chartLabel(ymd) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export function buildChartPoints(sales, from, to) {
  const totals = new Map();

  for (const sale of sales) {
    if (!sale.created_at) continue;
    const day = formatDateYmd(new Date(sale.created_at));
    if (!day) continue;
    const cur = totals.get(day) || { value: 0, count: 0 };
    totals.set(day, { value: addMoney(cur.value, sale.total), count: cur.count + 1 });
  }

  return eachDateYmd(from, to).map(day => {
    const [y, m, d] = day.split('-').map(Number);
    return {
      day: chartLabel(day),
      fullDate: new Date(y, m - 1, d).toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short',
      }),
      value: totals.get(day)?.value || 0,
      count: totals.get(day)?.count || 0,
    };
  });
}

export function buildTopProducts(sales, limit = 5) {
  const ranked = new Map();

  for (const sale of sales) {
    for (const item of sale.items || []) {
      const id = item.product_id;
      if (!id) continue;

      const current = ranked.get(id) || {
        id,
        name: item.product?.name || `Product #${id}`,
        sku: item.product?.sku || '—',
        units: 0,
        revenue: 0,
      };

      current.units += Number(item.quantity) || 0;
      current.revenue = addMoney(current.revenue, item.line_total);
      ranked.set(id, current);
    }
  }

  return [...ranked.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((product, index) => ({
      ...product,
      rank: index + 1,
      amount: formatMoney(product.revenue),
    }));
}

export function buildLowStock(products) {
  return products
    .map(product => {
      const quantity = Number(product.inventory?.quantity);
      const reorder = Number(product.inventory?.reorder_threshold);

      if (!Number.isFinite(quantity) || !Number.isFinite(reorder)) {
        return null;
      }

      if (quantity > reorder) {
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        qty: quantity,
        reorder,
        status: quantity <= 0 ? 'out' : 'low',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.qty - b.qty);
}

export function formatRelativeTime(isoDate) {
  const timestamp = new Date(isoDate).getTime();

  if (!Number.isFinite(timestamp)) {
    return '';
  }

  const deltaSeconds = Math.round((Date.now() - timestamp) / 1000);

  if (deltaSeconds < 60) return 'just now';
  if (deltaSeconds < 3600) return `${Math.floor(deltaSeconds / 60)}m ago`;
  if (deltaSeconds < 86400) return `${Math.floor(deltaSeconds / 3600)}h ago`;
  return `${Math.floor(deltaSeconds / 86400)}d ago`;
}

export function paymentLabel(method) {
  if (method === 'bank_transfer') return 'Bank transfer';
  if (method === 'card') return 'Card';
  if (method === 'cash') return 'Cash';
  return method || 'Sale';
}

export function buildActivity({ sales, lowStock }, limit = 6) {
  const saleItems = sales.slice(0, limit).map(sale => ({
    id: `sale-${sale.id}`,
    type: 'sale',
    title: `Sale #${sale.id} completed`,
    detail: `${formatMoney(sale.total)} · ${paymentLabel(sale.payment_method)}${
      sale.user?.name ? ` · ${sale.user.name}` : ''
    }`,
    time: formatRelativeTime(sale.created_at),
    sortKey: new Date(sale.created_at).getTime() || 0,
  }));

  const stockItems = lowStock.slice(0, 3).map(item => ({
    id: `stock-${item.id}`,
    type: 'stock',
    title:
      item.status === 'out'
        ? `Out of stock — ${item.name}`
        : `Low stock — ${item.name}`,
    detail: `${item.qty} left · reorder at ${item.reorder}`,
    time: 'Now',
    sortKey: Date.now(),
  }));

  return [...saleItems, ...stockItems]
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, limit);
}
