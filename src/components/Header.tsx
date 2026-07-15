import { useState } from "react";
import { Link } from "../router/Router";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { totalQuantity, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <Link to="/" className="brand">
          Storefront
        </Link>

        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary">
          <Link to="/collections/all" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/blogs/news" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
        </nav>

        <button type="button" className="cart-toggle" onClick={openCart} aria-label="Open cart">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 8h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
          </svg>
          {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
        </button>
      </div>
    </header>
  );
}
