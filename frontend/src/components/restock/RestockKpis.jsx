import Icon from '../ui/Icon';

export default function RestockKpis({ adjustments = [] }) {
  const totalAdjustments = adjustments.length;
  const uniqueProducts = new Set(adjustments.map(a => a.productName || a.product_id)).size;

  const unitsAdded = adjustments.reduce((sum, a) => {
    const qty = a.quantityChange ?? a.quantity_change ?? 0;
    return qty > 0 ? sum + qty : sum;
  }, 0);

  const unitsRemoved = adjustments.reduce((sum, a) => {
    const qty = a.quantityChange ?? a.quantity_change ?? 0;
    return qty < 0 ? sum + Math.abs(qty) : sum;
  }, 0);

  const netMovement = unitsAdded - unitsRemoved;

  return (
    <div className="restock-kpis-grid">
      <div className="restock-kpi-card">
        <div className="restock-kpi-info">
          <div className="restock-kpi-label">ADJUSTMENTS</div>
          <div className="restock-kpi-val">{totalAdjustments}</div>
          <div className="restock-kpi-sub">Across {uniqueProducts} products</div>
        </div>
        <div className="restock-kpi-icon restock-kpi-icon--gray">
          <Icon name="clock" size={18} />
        </div>
      </div>

      <div className="restock-kpi-card">
        <div className="restock-kpi-info">
          <div className="restock-kpi-label">UNITS ADDED</div>
          <div className="restock-kpi-val text-green">+{unitsAdded}</div>
          <div className="restock-kpi-sub">Restocks and upward corrections</div>
        </div>
        <div className="restock-kpi-icon restock-kpi-icon--green">
          <Icon name="plus" size={18} />
        </div>
      </div>

      <div className="restock-kpi-card">
        <div className="restock-kpi-info">
          <div className="restock-kpi-label">UNITS REMOVED</div>
          <div className="restock-kpi-val text-rose">-{unitsRemoved}</div>
          <div className="restock-kpi-sub">Damages and downward corrections</div>
        </div>
        <div className="restock-kpi-icon restock-kpi-icon--rose">
          <Icon name="alert" size={18} />
        </div>
      </div>

      <div className="restock-kpi-card">
        <div className="restock-kpi-info">
          <div className="restock-kpi-label">NET MOVEMENT</div>
          <div className={`restock-kpi-val ${netMovement >= 0 ? 'text-green' : 'text-rose'}`}>
            {netMovement >= 0 ? `+${netMovement}` : netMovement}
          </div>
          <div className="restock-kpi-sub">Total stock change from adjustments</div>
        </div>
        <div className="restock-kpi-icon restock-kpi-icon--green">
          <Icon name="reports" size={18} />
        </div>
      </div>
    </div>
  );
}
