import { Link } from "../router/Router";
import { useShopifyQuery } from "../lib/useShopifyQuery";
import { HOME_COLLECTIONS_QUERY, FEATURED_PRODUCTS_QUERY } from "../lib/shopify/queries/collection";
import { shopifyImageUrl } from "../lib/images";
import CollectionGrid from "../components/CollectionGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import type { Collection, ProductCardFields } from "../types/shopify";

export default function Home() {
  const collectionsQuery = useShopifyQuery<{ collections: { nodes: Collection[] } }>(HOME_COLLECTIONS_QUERY, {
    first: 4,
  });
  const productsQuery = useShopifyQuery<{ products: { nodes: ProductCardFields[] } }>(FEATURED_PRODUCTS_QUERY, {
    first: 8,
  });

  return (
    <div className="page page-home">
      <section className="hero container">
        <h1>Shop the collection</h1>
        <p className="hero-tagline">Fresh drops, straight from Shopify.</p>
        <Link to="/collections/all" className="btn btn-primary">
          Shop now
        </Link>
      </section>

      <section className="container">
        <h2>Collections</h2>
        {collectionsQuery.loading && <LoadingState />}
        {collectionsQuery.error && <ErrorState message={collectionsQuery.error} />}
        {collectionsQuery.data && (
          <div className="collections-grid">
            {collectionsQuery.data.collections.nodes.map((c) => (
              <Link key={c.id} to={`/collections/${c.handle}`} className="collection-card">
                {c.image && (
                  <img
                    src={shopifyImageUrl(c.image.url, 400)}
                    alt={c.image.altText || c.title}
                    loading="lazy"
                  />
                )}
                <h3>{c.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container">
        <h2>Featured products</h2>
        {productsQuery.loading && <LoadingState />}
        {productsQuery.error && <ErrorState message={productsQuery.error} />}
        {productsQuery.data && <CollectionGrid products={productsQuery.data.products.nodes} />}
      </section>
    </div>
  );
}
