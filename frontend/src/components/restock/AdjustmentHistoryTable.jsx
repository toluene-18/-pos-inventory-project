import { useState, useMemo } from 'react';
import Icon from '../ui/Icon';

const TYPE_PILLS = [
  { id: 'all', label: 'All' },
  { id: 'restock', label: 'Restock' },
  { id: 'correction', label: 'Correction' },
  { id: 'damage', label: 'Damage' },
];

export default function AdjustmentHistoryTable({ adjustments = [] }) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const productNames = useMemo(() => {
    return Array.from(
      new Set(adjustments.map(a => a.productName || a.product?.name).filter(Boolean))
    );
  }, [adjustments]);

  const filtered = useMemo(() => {
    const list = adjustments.filter(item => {
      const type = (item.type || 'restock').toLowerCase();
      if (selectedType !== 'all' && type !== selectedType) {
        return false;
      }

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
  }, [adjustments, search, selectedProduct, selectedType, sortOrder]);

  return (
    <div className="adjustment-history-card">
      <div className="adjustment-history-head">
        <h3>Adjustment history</h3>
        <span className="adjustment-history-count">
          Showing {filtered.length} of {adjustments.length} entries
        </span>
      </div>

      <div className="adjustment-toolbar-grid">
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

      <div className="adjustment-type-pills">
        {TYPE_PILLS.map(pill => (
          <button
            key={pill.id}
            type="button"
            className={`type-pill-btn ${selectedType === pill.id ? 'type-pill-btn--active' : ''}`}
            onClick={() => setSelectedType(pill.id)}
          >
            {pill.label}
          </button>
        ))}
      </div>

      <div className="adjustment-table-wrapper">
        <table className="adjustment-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>PRODUCT</th>
              <th>CHANGE</th>
              <th>STOCK AFTER</th>
              <th>REASON</th>
              <th>RECORDED BY</th>
              <th>WHEN</th>
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
                const type = (item.type || 'restock').toLowerCase();
                const qty = item.quantityChange ?? item.quantity_change ?? 0;
                const next = item.newStock ?? '—';
                const staff = item.staffName || item.user?.name || 'Chinedu Okafor';
                const initials =
                  item.staffInitials ||
                  staff.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                const date = item.createdAt || new Date(item.created_at).toLocaleString('en-GB');

                return (
                  <tr key={item.id}>
                    <td>
                      <span className={`adj-pill adj-pill--${type}`}>
                        {type === 'restock' && '+ Restock'}
                        {type === 'correction' && '⇄ Correction'}
                        {type === 'damage' && '! Damage'}
                      </span>
                    </td>
                    <td>
                      <span className="adj-product-name">{pName}</span>
                    </td>
                    <td>
                      <span className={`adj-qty ${qty > 0 ? 'text-green' : 'text-rose'}`}>
                        {qty > 0 ? `+${qty}` : qty}
                      </span>
                    </td>
                    <td>
                      <span className="adj-after">{next}</span>
                    </td>
                    <td>
                      <span className="adj-reason">{item.reason || 'Manual adjustment'}</span>
                    </td>
                    <td>
                      <div className="adj-recorder-cell">
                        <span className="adj-avatar-mini">{initials}</span>
                        <span className="adj-staff">{staff}</span>
                      </div>
                    </td>
                    <td>
                      <span className="adj-when">{date}</span>
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
