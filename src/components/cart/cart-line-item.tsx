"use client";

import Image from "next/image";
import Link from "next/link";
import { CompatibilityBadge } from "@/components/fitment/compatibility-badge";
import { useCart } from "@/components/cart/cart-provider";
import { canDecreaseQuantity, canIncreaseQuantity } from "@/lib/cart/cart-rules";
import type { CartItem } from "@/lib/cart/types";
import { formatLkr } from "@/lib/money";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-line">
      <Link href={`/products/${item.slug}`} className="cart-line-media" aria-label={`View ${item.name}`}>
        <Image src={item.imagePath} alt={item.imageAlt} fill sizes="66px" />
      </Link>
      <div>
        <p className="cart-line-name">
          <Link href={`/products/${item.slug}`}>{item.name}</Link>
        </p>
        <p className="cart-line-meta">
          {formatLkr(item.unitPriceCents)} each
          {item.compatibility ? " · " : ""}
          <CompatibilityBadge compatibility={item.compatibility} compact />
        </p>
        <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={!canDecreaseQuantity(item)}
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          >
            −
          </button>
          <span aria-live="polite">{item.quantity}</span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.name}`}
            disabled={!canIncreaseQuantity(item)}
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <p className="cart-line-price">{formatLkr(item.unitPriceCents * item.quantity)}</p>
        {!compact ? null : (
          <button
            type="button"
            className="cart-line-remove"
            onClick={() => removeItem(item.productId)}
          >
            Remove
          </button>
        )}
      </div>
      {!compact ? (
        <button
          type="button"
          className="cart-line-remove"
          style={{ gridColumn: "2 / -1", justifySelf: "start" }}
          onClick={() => removeItem(item.productId)}
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}
