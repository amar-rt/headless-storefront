const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || "2025-01";

export const isShopifyConfigured = Boolean(domain && token);

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super("Shopify is not configured — set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.");
    this.name = "ShopifyNotConfiguredError";
  }
}

interface GraphQLError {
  message: string;
}

export async function shopifyFetch<T = unknown>(query: string, variables: object = {}): Promise<T> {
  if (!isShopifyConfigured) throw new ShopifyNotConfiguredError();

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: GraphQLError) => e.message).join("; "));
  }
  return json.data as T;
}

export const config = {
  productsPerPage: Number(import.meta.env.VITE_SHOPIFY_PRODUCTS_PER_PAGE) || 24,
  articlesPerPage: Number(import.meta.env.VITE_SHOPIFY_ARTICLES_PER_PAGE) || 10,
};
