"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, LockKeyhole, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/catalog/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { state } = useCart();

  if (!state.hydrated) {
    return (
      <div className="container section">
        <Skeleton className="h-10 w-64" />
        <div style={{ height: 18 }} />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          title="Your cart is empty"
          message="Browse the catalog, choose a part, and add it to your cart to begin checkout."
          actionLabel="Browse parts"
          actionHref="/products"
        />
      </div>
    );
  }

  const warnings = state.validation?.warnings ?? [];
  const blocked = state.validation?.canCheckout === false;

  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><ShoppingBag size={14} aria-hidden="true" /> Cart</p>
          <h1 className="section-title">Review your parts</h1>
          <p className="section-copy">
            Quantities, prices, and compatibility are checked again before your order is placed.
          </p>
        </div>
        <Link className="link-arrow" href="/products">
          Continue shopping <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="checkout-layout">
        <section aria-label="Cart items">
          {!state.storageAvailable ? (
            <div className="alert alert-warning" style={{ marginBottom: 14 }}>
              <AlertTriangle size={16} aria-hidden="true" />
              <span>Browser storage is unavailable. This cart will last for the current session only.</span>
            </div>
          ) : null}
          {warnings.length > 0 ? (
            <div className="alert alert-warning" style={{ marginBottom: 14 }}>
              <AlertTriangle size={16} aria-hidden="true" />
              <div>
                {warnings.map((warning) => (
                  <div key={`${warning.code}-${warning.productId ?? "cart"}`}>{warning.message}</div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="panel" style={{ padding: "6px 20px" }}>
            {state.items.map((item) => (
              <CartLineItem key={item.productId} item={item} />
            ))}
          </div>
        </section>

        <aside className="checkout-aside">
          <div className="panel checkout-card">
            <h2>Order summary</h2>
            <CartSummary items={state.items} />
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              <Link
                className="button button-primary"
                href={blocked ? "/cart" : "/checkout"}
                aria-disabled={blocked}
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  if (blocked) event.preventDefault();
                }}
              >
                <LockKeyhole size={15} aria-hidden="true" />
                Checkout
              </Link>
              <Link className="button button-secondary" href="/products">
                Keep shopping
              </Link>
            </div>
            {blocked ? (
              <p className="field-error" style={{ marginTop: 12 }}>
                Resolve the stock warnings above before checking out.
              </p>
            ) : null}
            <p className="field-hint" style={{ marginTop: 12 }}>
              Simulated card details stay in your browser. We never send or store them.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
