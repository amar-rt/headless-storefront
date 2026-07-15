import { useCart } from "../context/CartContext";
import CartLineItem from "./CartLineItem";
import Money from "./Money";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, status, error, goToCheckout } = useCart();

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? " is-open" : ""}`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      <aside className={`cart-drawer${isOpen ? " is-open" : ""}`} aria-label="Cart" aria-hidden={!isOpen}>
        <div className="cart-drawer-header">
          <h2>Your cart</h2>
          <button type="button" className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {error && <p className="state state-error">{error}</p>}

        {lines.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-lines">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <Money data={subtotal} />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-checkout"
              onClick={goToCheckout}
              disabled={status === "loading"}
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
