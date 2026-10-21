import Icon from '../ui/Icon';
import CartLine from './CartLine';
import PaymentPanel from './PaymentPanel';
import { formatMoney } from '../../utils/dashboardStats';

/** CartPanel — sticky right column: lines, payment, totals, checkout. */
function CartPanel({ cart, payment, submitting, error, onCheckout }) {
  const { lines, units, subtotal, total } = cart;
  const shortCash =
    payment.method === 'cash' && payment.tendered !== '' && Number(payment.tendered) < total;
  const canCheckout = lines.length > 0 && !submitting && !shortCash;

  return (
    <aside className="cart" aria-label="Current sale">
      <header className="cart-head">
        <span className="cart-head-icon"><Icon name="basket" size={17} /></span>
        <div>
          <strong>Current sale</strong>
          <small>{units} {units === 1 ? 'item' : 'items'} in cart</small>
        </div>
        {lines.length > 0 && (
          <button type="button" className="cart-clear" onClick={cart.clear}>
            <Icon name="trash" size={14} /> Clear
          </button>
        )}
      </header>

      {lines.length === 0 ? (
        <div className="cart-empty">
          <span><Icon name="basket" size={22} /></span>
          <strong>The cart is empty</strong>
          <p>Tap a product or scan a barcode to start ringing up a customer.</p>
        </div>
      ) : (
        <ul className="cart-lines">
          {lines.map(line => (
            <CartLine key={line.product.id} line={line} onQuantity={cart.setQuantity} onRemove={cart.remove} />
          ))}
        </ul>
      )}

      <footer className="cart-foot">
        <PaymentPanel
          method={payment.method}
          onMethod={payment.setMethod}
          total={total}
          tendered={payment.tendered}
          onTendered={payment.setTendered}
        />

        <dl className="cart-totals">
          <div><dt>Subtotal</dt><dd>{formatMoney(subtotal)}</dd></div>
          <div className="cart-total"><dt>Total</dt><dd>{formatMoney(total)}</dd></div>
        </dl>

        {error && <p className="cart-error" role="alert">{error}</p>}

        <button type="button" className="btn btn-primary cart-checkout" disabled={!canCheckout}
          onClick={onCheckout}>
          {submitting ? 'Processing…' : <><Icon name="check" size={16} /> Charge {formatMoney(total)}</>}
        </button>
      </footer>
    </aside>
  );
}

export default CartPanel;
