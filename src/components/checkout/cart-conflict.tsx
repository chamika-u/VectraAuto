import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { OrderConflictItem } from "@/lib/contracts/orders";

const reasons: Record<OrderConflictItem["reason"], string> = {
  PRICE_CHANGED: "The price changed",
  OUT_OF_STOCK: "This part is now out of stock",
  INSUFFICIENT_STOCK: "There is not enough stock for this quantity",
  PRODUCT_UNAVAILABLE: "This part is no longer available",
};

export function CartConflict({ items }: { items: OrderConflictItem[] }) {
  return (
    <div className="alert alert-danger" style={{ marginBottom: 14 }}>
      <AlertTriangle size={17} aria-hidden="true" />
      <div>
        <strong>Your cart changed while you were checking out.</strong>
        <ul style={{ margin: "8px 0", paddingLeft: 18 }}>
          {items.map((item) => (
            <li key={`${item.productId}-${item.reason}`}>
              {reasons[item.reason]}
              {item.availableStock !== null ? ` (${item.availableStock} available)` : ""}.
            </li>
          ))}
        </ul>
        <Link className="link-arrow" href="/cart">Review your cart</Link>
      </div>
    </div>
  );
}
