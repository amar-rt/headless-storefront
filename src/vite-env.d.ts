/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string;
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN?: string;
  readonly VITE_SHOPIFY_API_VERSION?: string;
  readonly VITE_SHOPIFY_PRODUCTS_PER_PAGE?: string;
  readonly VITE_SHOPIFY_ARTICLES_PER_PAGE?: string;
  readonly VITE_SHOPIFY_DEFAULT_BLOG_HANDLE?: string;
  readonly VITE_SHOPIFY_FEATURED_COLLECTIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
