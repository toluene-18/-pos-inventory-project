import Icon from '../ui/Icon';

export default function RestockBatchTable({ batch, onUpdateQty, onRemoveItem }) {
  if (batch.length === 0) {
    return (
      <div className="restock-empty-state">
        <Icon name="inventory" size={32} />
        <p>No products added to this receiving batch yet.</p>
        <small>Use the search or dropdown above to select products from your catalogue.</small>
      </div>
    );
  }

  return (
    <div className="restock-table-container">
      <table className="restock-table">
        <thead>
          <tr>
            <th>Product & SKU</th>
            <th>Category</th>
            <th>On Hand</th>
            <th>Incoming Quantity</th>
            <th>Projected Stock</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {batch.map(item => {
            const currentQty = item.product.inventory?.quantity ?? 0;
            const incoming = item.quantity || 0;
            const projected = currentQty + incoming;
            const unit = item.product.unit || 'units';

            return (
              <tr key={item.product.id}>
                <td>
                  <div className="restock-prod-cell">
                    {item.product.image_path ? (
                      <img
                        src={item.product.image_path}
                        alt=""
                        className="table-thumb"
                      />
                    ) : (
                      <span className="table-thumb-mono">
                        {item.product.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="restock-prod-meta">
                      <strong>{item.product.name}</strong>
                      <span className="restock-sku">{item.product.sku}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="restock-cat-pill">
                    {item.product.category ? item.product.category.replace('_', ' ') : 'General'}
                  </span>
                </td>
                <td>
                  <strong className="restock-current-val">
                    {currentQty} {unit}
                  </strong>
                </td>
                <td>
                  <div className="restock-qty-input-wrap">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        onUpdateQty(item.product.id, parseInt(e.target.value, 10) || 1)
                      }
                      className="restock-qty-input"
                    />
                    <span className="restock-unit-tag">{unit}</span>
                  </div>
                </td>
                <td>
                  <span className="restock-projected-badge">
                    {currentQty} → <strong>{projected} {unit}</strong>
                  </span>
                </td>
                <td className="text-right">
                  <button
                    type="button"
                    className="btn-icon btn-icon--danger"
                    title="Remove from batch"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
