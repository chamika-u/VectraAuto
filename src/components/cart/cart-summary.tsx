import type { CartItem } from "@/lib/cart/types";
import { cartSubtotalCents } from "@/lib/cart/cart-rules";
import { DELIVERY_FEE_CENTS } from "@/lib/constants";
import { formatLkr } from "@/lib/money";

export function CartSummary({
  items,
  deliveryFeeCents = DELIVERY_FEE_CENTS,
}: {
  items: CartItem[];
  deliveryFeeCents?: number;
}) {
  const subtotalCents = cartSubtotalCents(items);
  return (
    <div className="summary">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatLkr(subtotalCents)}</span>
      </div>
      <div className="summary-row">
        <span>Delivery</span>
        <span style={deliveryFeeCents === 0 ? { color: "#059669", fontWeight: 700 } : undefined}>
          {deliveryFeeCents > 0 ? formatLkr(deliveryFeeCents) : "FREE"}
        </span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>{formatLkr(subtotalCents + deliveryFeeCents)}</span>
      </div>
    </div>
  );
}
