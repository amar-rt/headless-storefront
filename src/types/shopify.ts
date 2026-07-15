export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  selectedOptions: SelectedOption[];
  image: ShopifyImage | null;
}

export interface ProductCardFields {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: MoneyV2 };
  compareAtPriceRange?: { minVariantPrice: MoneyV2 } | null;
}

export interface Product extends ProductCardFields {
  descriptionHtml: string;
  images: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 };
  options: ProductOption[];
  variants: { nodes: ProductVariant[] };
  seo: { title: string | null; description: string | null };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image: ShopifyImage | null;
}

export interface CartLineMerchandise extends ProductVariant {
  product: { handle: string; title: string };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: MoneyV2 };
  merchandise: CartLineMerchandise;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: MoneyV2; totalAmount: MoneyV2 };
  lines: { nodes: CartLine[] };
}

export interface Article {
  id: string;
  handle?: string;
  title: string;
  excerpt?: string;
  contentHtml?: string;
  publishedAt: string;
  image: ShopifyImage | null;
  authorV2: { name: string } | null;
}

export interface PageContent {
  id: string;
  title: string;
  body: string;
  bodySummary?: string;
  seo?: { title: string | null; description: string | null };
}

export interface UserError {
  field: string[] | null;
  message: string;
}
