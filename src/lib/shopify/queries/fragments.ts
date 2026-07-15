// Reused via plain string interpolation in cart.js — real GraphQL fragment
// syntax needs no codegen/tooling to work with a hand-rolled fetch client.
export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText width height }
            price { amount currencyCode }
            product { handle title }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;
