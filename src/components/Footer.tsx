import { Link } from "../router/Router";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {year} Storefront.</p>
        <nav aria-label="Footer">
          <Link to="/pages/about">About</Link>
          <Link to="/pages/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
