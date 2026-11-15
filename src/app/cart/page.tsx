"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, LockKeyhole, ShoppingBag, Wrench } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { state, removeItem, updateQuantity } = useCart();
  const router = useRouter();

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
        <CartEmpty />
      </div>
    );
  }

  const warnings = state.validation?.warnings ?? [];
  const blocked = state.validation?.canCheckout === false;

  const handleFixCart = () => {
    for (const item of state.items) {
      if (item.availableStock <= 0) {
        removeItem(item.productId);
      } else if (item.quantity > item.availableStock) {
        updateQuantity(item.productId, item.availableStock);
      }
    }
  };

  const handleFixAndCheckout = () => {
    handleFixCart();
    router.push("/checkout");
  };

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
              <div style={{ flex: 1 }}>
                {warnings.map((warning) => (
                  <div key={`${warning.code}-${warning.productId ?? "cart"}`}>{warning.message}</div>
                ))}
                {blocked && (
                  <button
                    type="button"
                    onClick={handleFixCart}
                    style={{
                      marginTop: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#b45309",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    <Wrench size={13} />
                    <span>Auto-adjust quantities to available stock</span>
                  </button>
                )}
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
              {blocked ? (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleFixAndCheckout}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <Wrench size={15} aria-hidden="true" />
                  <span>Fix Stock & Proceed to Checkout</span>
                </button>
              ) : (
                <Link
                  className="button button-primary"
                  href="/checkout"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <LockKeyhole size={15} aria-hidden="true" />
                  <span>Proceed to Checkout</span>
                </Link>
              )}

              <Link className="button button-secondary" href="/products">
                Keep shopping
              </Link>
            </div>

            {blocked ? (
              <p className="field-error" style={{ marginTop: 12 }}>
                Some items have stock limits. Click above to auto-adjust and proceed to checkout.
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
