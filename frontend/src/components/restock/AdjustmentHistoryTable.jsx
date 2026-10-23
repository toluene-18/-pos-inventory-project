import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';

export default function AdjustmentHistoryTable({ adjustments = [] }) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const productNames = useMemo(() => {
    return Array.from(new Set(adjustments.map(a => a.productName || a.product?.name).filter(Boolean)));
  }, [adjustments]);

  const filtered = useMemo(() => {
    let list = adjustments.filter(item => {
      const pName = (item.productName || item.product?.name || '').toLowerCase();
      const reason = (item.reason || '').toLowerCase();
      const staff = (item.staffName || item.user?.name || '').toLowerCase();
      const sku = (item.sku || item.product?.sku || '').toLowerCase();

      if (selectedProduct !== 'all') {
        const itemPName = item.productName || item.product?.name;
        if (itemPName !== selectedProduct) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!pName.includes(q) && !reason.includes(q) && !staff.includes(q) && !sku.includes(q)) {
          return false;
        }
      }

      return true;
    });

    list.sort((a, b) => {
      if (sortOrder === 'oldest') {
        return (a.timestamp || 0) - (b.timestamp || 0);
      }
      if (sortOrder === 'largest') {
        const qtyA = Math.abs(a.quantityChange ?? a.quantity_change ?? 0);
        const qtyB = Math.abs(b.quantityChange ?? b.quantity_change ?? 0);
        return qtyB - qtyA;
      }
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

    return list;
  }, [adjustments, search, selectedProduct, sortOrder]);

  return (
    <div className="adjustment-history-card">
      <div className="adjustment-history-head">
        <h3>Adjustment history</h3>
        <span className="adjustment-history-count">
          Showing {filtered.length} of {adjustments.length} entries
        </span>
      </div>

      <div className="adjustment-filter-bar">
        <div className="adjustment-search-box">
          <Icon name="search" size={14} />
          <input
            type="text"
            placeholder="Search product, reason or staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="adjustment-dropdowns">
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="filter-select"
          >
            <option value="all">All products</option>
            {productNames.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="largest">Largest change</option>
          </select>
        </div>
      </div>

      <div className="adjustment-table-wrapper">
        <table className="adjustment-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Change</th>
              <th>Stock Before / After</th>
              <th>Reason & Note</th>
              <th>Staff</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-muted">
                  No adjustments found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const pName = item.productName || item.product?.name || 'Product';
                const sku = item.sku || item.product?.sku || 'SKU';
                const type = (item.type || 'restock').toLowerCase();
                const qty = item.quantityChange ?? item.quantity_change ?? 0;
                const prev = item.previousStock ?? '—';
                const next = item.newStock ?? '—';
                const staff = item.staffName || item.user?.name || 'Staff';
                const date = item.createdAt || new Date(item.created_at).toLocaleString('en-GB');

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="adj-product-cell">
                        <span className="adj-product-name">{pName}</span>
                        <span className="adj-product-sku">{sku}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`adj-badge adj-badge--${type}`}>
                        {type === 'restock' && 'Restock'}
                        {type === 'correction' && 'Correction'}
                        {type === 'damage' && 'Damage'}
                      </span>
                    </td>
                    <td>
                      <span className={`adj-qty ${qty > 0 ? 'text-green' : 'text-rose'}`}>
                        {qty > 0 ? `+${qty}` : qty}
                      </span>
                    </td>
                    <td>
                      <span className="adj-movement">
                        {prev} → <strong>{next}</strong>
                      </span>
                    </td>
                    <td>
                      <span className="adj-reason">{item.reason || 'Manual adjustment'}</span>
                    </td>
                    <td>
                      <span className="adj-staff">{staff}</span>
                    </td>
                    <td>
                      <span className="adj-date">{date}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
