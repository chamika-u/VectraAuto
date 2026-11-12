"use client";

import { useState } from "react";
import { AlertTriangle, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import type { Compatibility } from "@/lib/contracts/catalog";

export type AddToCartProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  priceCents: number;
  imagePath: string;
  imageAlt: string;
  availableStock: number;
};

export function AddToCartButton({
  product,
  compatibility,
  size = "sm",
  className,
}: {
  product: AddToCartProduct;
  compatibility: Compatibility | null;
  size?: "md" | "sm";
  className?: string;
}) {
  const { addItem } = useCart();
  const [warning, setWarning] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const outOfStock = product.availableStock <= 0;
  const needsWarning = compatibility === "incompatible" || compatibility === "unknown";

  function handleAdd() {
    if (outOfStock) return;
    if (needsWarning && !warning) {
      setWarning(
        compatibility === "incompatible"
          ? "This part is not listed for your selected vehicle. Add it anyway?"
          : "Fitment for your selected vehicle is not confirmed. Add it anyway?",
      );
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      unitPriceCents: product.priceCents,
      imagePath: product.imagePath,
      imageAlt: product.imageAlt,
      availableStock: product.availableStock,
      quantity: 1,
      compatibility,
    });
    setWarning(null);
    setAnnouncement(`${product.name} added to cart.`);
  }

  return (
    <div className={className}>
      <Button
        size={size}
        variant={warning ? "secondary" : "primary"}
        onClick={handleAdd}
        disabled={outOfStock}
        aria-describedby={warning ? `cart-warning-${product.id}` : undefined}
        style={{ width: "100%" }}
      >
        {warning ? (
          <AlertTriangle size={15} aria-hidden="true" />
        ) : announcement ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <ShoppingBag size={15} aria-hidden="true" />
        )}
        {outOfStock ? "Out of stock" : warning ? "Add anyway" : "Add to cart"}
      </Button>
      {warning ? (
        <p id={`cart-warning-${product.id}`} className="field-error" style={{ marginTop: 6 }}>
          {warning}
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
