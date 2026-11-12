"use client";

import Link from "next/link";
import { AlertTriangle, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state } = useCart();
  const warnings = state.validation?.warnings ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="cart-drawer-description">
        <div className="cart-drawer-header" style={{ paddingLeft: 20 }}>
          <DialogTitle>Your cart</DialogTitle>
          <DialogDescription className="sr-only">
            Review the parts in your cart before checkout.
          </DialogDescription>
          <span className="result-count" style={{ marginRight: 48 }}>
            {state.items.length} line{state.items.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="cart-drawer-body">
          {state.items.length === 0 ? (
            <div className="empty-state" style={{ padding: "34px 20px" }}>
              <ShoppingBag size={28} aria-hidden="true" style={{ margin: "0 auto 12px" }} />
              <h2>Your cart is empty</h2>
              <p>Add a part from the catalog to start your build.</p>
              <Link className="button button-primary" href="/products" onClick={() => onOpenChange(false)}>
                Browse parts
              </Link>
            </div>
          ) : (
            <>
              {!state.storageAvailable ? (
                <div className="alert alert-warning" style={{ marginBottom: 8 }}>
                  <AlertTriangle size={16} aria-hidden="true" />
                  <span>Browser storage is unavailable. Your cart will last for this session only.</span>
                </div>
              ) : null}
              {warnings.length > 0 ? (
                <div className="alert alert-warning" style={{ marginBottom: 8 }}>
                  <AlertTriangle size={16} aria-hidden="true" />
                  <span>{warnings[0].message}</span>
                </div>
              ) : null}
              {state.items.map((item) => (
                <CartLineItem key={item.productId} item={item} compact />
              ))}
            </>
          )}
        </div>
        {state.items.length > 0 ? (
          <div className="cart-drawer-footer">
            <CartSummary items={state.items} />
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <Link className="button button-primary" href="/checkout" onClick={() => onOpenChange(false)}>
                Checkout
              </Link>
              <Link className="button button-secondary" href="/cart" onClick={() => onOpenChange(false)}>
                View full cart
              </Link>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function CartDrawerTriggerButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <Button variant="secondary" className="cart-button" onClick={onClick} aria-label={`Open cart, ${count} items`}>
      <ShoppingBag size={16} aria-hidden="true" />
      <span className="cart-label">Cart</span>
      <span className="cart-count">{count}</span>
    </Button>
  );
}
