import { shopifyImageUrl } from "../lib/images";
import { useCart } from "../context/CartContext";
import Money from "./Money";
import type { CartLine } from "../types/shopify";

export default function CartLineItem({ line }: { line: CartLine }) {
  const { updateLineQuantity, removeLine } = useCart();
  const { merchandise } = line;
  const image = merchandise.image;

  return (
    <li className="cart-line">
      {image && (
        <img
          src={shopifyImageUrl(image.url, 160)}
          alt={image.altText || merchandise.product.title}
          width={80}
          height={80}
        />
      )}
      <div className="cart-line-details">
        <p className="cart-line-title">{merchandise.product.title}</p>
        {merchandise.selectedOptions
          .filter((o) => o.value !== "Default Title")
          .map((o) => (
            <p key={o.name} className="cart-line-option">
              {o.name}: {o.value}
            </p>
          ))}
        <div className="cart-line-controls">
          <div className="qty-stepper">
            <button type="button" onClick={() => updateLineQuantity(line.id, line.quantity - 1)}>
              −
            </button>
            <span>{line.quantity}</span>
            <button type="button" onClick={() => updateLineQuantity(line.id, line.quantity + 1)}>
              +
            </button>
          </div>
          <button type="button" className="cart-line-remove" onClick={() => removeLine(line.id)}>
            Remove
          </button>
        </div>
      </div>
      <Money data={line.cost.totalAmount} className="cart-line-price" />
    </li>
  );
}
