import { CartSummary } from "@/components/cart/cart-summary";
import type { CartItem } from "@/lib/cart/types";
import { formatLkr } from "@/lib/money";

export function CheckoutReview({ items }: { items: CartItem[] }) {
  return (
    <div>
      <div className="review-list">
        {items.map((item) => (
          <div key={item.productId} className="review-item">
            <span>
              {item.name}
              <br />
              <small>{item.quantity} × {formatLkr(item.unitPriceCents)}</small>
            </span>
            <strong>{formatLkr(item.unitPriceCents * item.quantity)}</strong>
          </div>
        ))}
      </div>
      <CartSummary items={items} />
    </div>
  );
}
