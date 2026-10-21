import Icon from '../ui/Icon';
import { formatMoney } from '../../utils/dashboardStats';
import { stockOf } from '../../hooks/useProducts';

/** CartLine — one product in the cart with − qty + and remove controls. */
function CartLine({ line, onQuantity, onRemove }) {
  const { product, quantity } = line;
  const max = stockOf(product);
  const lineTotal = Number(product.sell_price) * quantity;

  return (
    <li className="cart-line">
      <div className="cart-line-info">
        <strong>{product.name}</strong>
        <small>{formatMoney(product.sell_price)} each · {max} in stock</small>
      </div>

      <div className="cart-qty" role="group" aria-label={`Quantity of ${product.name}`}>
        <button type="button" onClick={() => onQuantity(product.id, quantity - 1)} aria-label="Decrease">
          <Icon name="minus" size={13} />
        </button>
        <input
          type="number"
          min="1"
          max={max}
          value={quantity}
          onChange={e => onQuantity(product.id, Number(e.target.value) || 0)}
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => onQuantity(product.id, quantity + 1)}
          disabled={quantity >= max}
          aria-label="Increase"
        >
          <Icon name="plus" size={13} />
        </button>
      </div>

      <span className="cart-line-total">{formatMoney(lineTotal)}</span>

      <button type="button" className="cart-remove" onClick={() => onRemove(product.id)}
        aria-label={`Remove ${product.name}`}>
        <Icon name="x" size={14} />
      </button>
    </li>
  );
}

export default CartLine;
