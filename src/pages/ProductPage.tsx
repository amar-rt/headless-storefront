import { useMemo, useState } from "react";
import { useShopifyQuery } from "../lib/useShopifyQuery";
import { PRODUCT_BY_HANDLE_QUERY } from "../lib/shopify/queries/product";
import { shopifyImageUrl, shopifyImageSrcSet } from "../lib/images";
import { useCart } from "../context/CartContext";
import Money from "../components/Money";
import RichText from "../components/RichText";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import type { RouteParams } from "../router/Router";
import type { Product } from "../types/shopify";

export default function ProductPage({ params }: { params: RouteParams }) {
  const { data, loading, error } = useShopifyQuery<{ product: Product | null }>(PRODUCT_BY_HANDLE_QUERY, {
    handle: params.handle,
  });
  const { addToCart, status } = useCart();
  const product = data?.product;

  const [selected, setSelected] = useState<Record<string, string>>({});
  const variants = product?.variants.nodes || [];
  const options = product?.options || [];

  const activeSelection = useMemo(() => {
    const base: Record<string, string> = {};
    for (const opt of options) {
      base[opt.name] = selected[opt.name] || opt.values[0];
    }
    return base;
  }, [options, selected]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v.selectedOptions.every((o) => activeSelection[o.name] === o.value)) || variants[0];
  }, [variants, activeSelection]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!product) return <ErrorState message="Product not found." />;

  const image = selectedVariant?.image || product.featuredImage;

  return (
    <div className="page page-product container product-detail">
      <div className="product-gallery">
        {image && (
          <img
            src={shopifyImageUrl(image.url, 800)}
            srcSet={shopifyImageSrcSet(image.url)}
            sizes="(min-width: 900px) 50vw, 100vw"
            alt={image.altText || product.title}
            width={image.width}
            height={image.height}
          />
        )}
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="product-price">
          <Money data={selectedVariant?.price || product.priceRange.minVariantPrice} />
        </p>

        {options.map((opt) => (
          <div key={opt.name} className="option-group">
            <span className="option-label">{opt.name}</span>
            <div className="option-values">
              {opt.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`option-pill${activeSelection[opt.name] === value ? " is-selected" : ""}`}
                  onClick={() => setSelected((s) => ({ ...s, [opt.name]: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary btn-add-to-cart"
          disabled={!selectedVariant?.availableForSale || status === "loading"}
          onClick={() => selectedVariant && addToCart(selectedVariant.id, 1)}
        >
          {selectedVariant?.availableForSale ? "Add to cart" : "Sold out"}
        </button>

        <RichText html={product.descriptionHtml} className="product-description" />
      </div>
    </div>
  );
}
