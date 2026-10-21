import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';
import { stockOf, stockStatus } from '../../hooks/useProducts';

const STATUS_LABEL = { in: 'In stock', low: 'Low stock', out: 'Out of stock' };
const PALETTE = ['green', 'amber', 'violet', 'rose', 'sky'];

function toneFor(category = '') {
  const sum = [...category].reduce((s, c) => s + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

/** ProductTile — one product card. Uses image_path when present, else a tinted monogram. */
function ProductTile({ product, inCart, onAdd }) {
  const status = stockStatus(product);
  const qty = stockOf(product);
  const disabled = status === 'out' || inCart >= qty;

  return (
    <button
      type="button"
      className={`pos-tile pos-tile--${status}`}
      onClick={() => onAdd(product)}
      disabled={disabled}
      aria-label={`Add ${product.name}, ${formatMoney(product.sell_price)}, ${qty} in stock`}
    >
      <div className={`pos-tile-media tone-${toneFor(product.category)}`}>
        {product.image_path ? (
          <img src={product.image_path} alt="" loading="lazy" />
        ) : (
          <span className="pos-tile-mono">{initials(product.name)}</span>
        )}
        <span className={`pos-stock pos-stock--${status}`}>
          <i aria-hidden="true" /> {STATUS_LABEL[status]}
        </span>
        {inCart > 0 && <span className="pos-tile-count">{inCart} in cart</span>}
      </div>

      <div className="pos-tile-body">
        <strong className="pos-tile-name">{product.name}</strong>
        <small className="pos-tile-sku">{product.sku}</small>
        <div className="pos-tile-foot">
          <span className="pos-tile-price">{formatMoney(product.sell_price)}</span>
          <span className="pos-tile-left">{qty} left</span>
          {!disabled && (
            <span className="pos-tile-add" aria-hidden="true"><Icon name="plus" size={14} /></span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ProductTile;
