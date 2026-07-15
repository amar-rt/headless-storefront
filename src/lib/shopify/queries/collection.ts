const PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
`;

export const HOME_COLLECTIONS_QUERY = `
  query HomeCollections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT) {
      nodes { id handle title image { url altText width height } }
    }
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes { ${PRODUCT_CARD_FIELDS} }
    }
  }
`;

// Forward-only pagination (first/after) — the numbered-pager strategy in
// useCursorPagination.js only ever walks forward and caches pages it has
// already fetched, so a reverse (last/before) variant isn't needed.
export const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      description
      image { url altText width height }
      products(first: $first, after: $after) {
        nodes { ${PRODUCT_CARD_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
