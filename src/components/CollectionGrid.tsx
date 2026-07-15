import ProductCard from "./ProductCard";
import type { ProductCardFields } from "../types/shopify";

export default function CollectionGrid({ products }: { products: ProductCardFields[] }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 7Z" strokeLinejoin="round" />
          <path d="M8 7V5a4 4 0 0 1 8 0v2" strokeLinecap="round" />
        </svg>
        <p>No products found.</p>
      </div>
    );
  }
  return (
    <div className="collection-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
