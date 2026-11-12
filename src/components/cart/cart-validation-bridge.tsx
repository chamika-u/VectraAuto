"use client";

import { useCartValidation } from "@/components/cart/use-cart-validation";

export function CartValidationBridge() {
  useCartValidation();
  return null;
}
