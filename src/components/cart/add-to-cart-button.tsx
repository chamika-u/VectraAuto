"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
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
  const [announcement, setAnnouncement] = useState("");

  const outOfStock = product.availableStock <= 0;

  function handleAdd() {
    if (outOfStock) return;
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
    setAnnouncement(`${product.name} added to cart.`);
  }

  return (
    <div className={className}>
      <Button
        size={size}
        variant="primary"
        onClick={handleAdd}
        disabled={outOfStock}
        style={{ width: "100%" }}
      >
        {announcement ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <ShoppingBag size={15} aria-hidden="true" />
        )}
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
