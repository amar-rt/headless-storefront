import { Link } from "../router/Router";
import { shopifyImageUrl, shopifyImageSrcSet } from "../lib/images";
import Money from "./Money";
import type { ProductCardFields } from "../types/shopify";

export default function ProductCard({ product }: { product: ProductCardFields }) {
  const price = product.priceRange?.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale = Boolean(compareAt && price && Number(compareAt.amount) > Number(price.amount));
  const image = product.featuredImage;

  return (
    <Link to={`/products/${product.handle}`} className="product-card">
      <div className="product-card-image">
        {image && (
          <img
            src={shopifyImageUrl(image.url, 600)}
            srcSet={shopifyImageSrcSet(image.url)}
            sizes="(min-width: 700px) 25vw, 50vw"
            alt={image.altText || product.title}
            loading="lazy"
          />
        )}
        {onSale && <span className="badge badge-sale">Sale</span>}
        {!product.availableForSale && <span className="badge badge-soldout">Sold out</span>}
      </div>
      <h3 className="product-card-title">{product.title}</h3>
      <p className="product-card-price">
        <Money data={price} />
        {onSale && <Money data={compareAt} className="price-compare" />}
      </p>
    </Link>
  );
}
