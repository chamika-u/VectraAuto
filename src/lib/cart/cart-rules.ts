import { MAX_CART_ITEMS, MAX_CART_QUANTITY } from "../constants";
import type { CartItem } from "./types";

export function clampQuantity(quantity: number, availableStock: number): number {
  if (!Number.isFinite(quantity)) return 1;
  const rounded = Math.trunc(quantity);
  return Math.min(Math.max(rounded, 1), Math.min(MAX_CART_QUANTITY, Math.max(availableStock, 0)));
}

export function canAddToCart(availableStock: number): boolean {
  return Number.isFinite(availableStock) && availableStock > 0;
}

export function canIncreaseQuantity(item: CartItem): boolean {
  return item.quantity < Math.min(MAX_CART_QUANTITY, item.availableStock);
}

export function canDecreaseQuantity(item: CartItem): boolean {
  return item.quantity > 1;
}

export function hasCapacity(items: CartItem[], productId: string): boolean {
  return items.some((item) => item.productId === productId) || items.length < MAX_CART_ITEMS;
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
}
