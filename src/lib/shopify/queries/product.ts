// variants(first: 100) covers virtually every real product. A product with
// more than 100 variant combinations (rare) would need cursor pagination on
// variants too — out of scope here.
export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      availableForSale
      featuredImage { url altText width height }
      images(first: 8) { nodes { url altText width height } }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      options { name values }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
      seo { title description }
    }
  }
`;
