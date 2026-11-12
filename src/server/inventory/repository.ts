import type { RuntimeStore } from "@/lib/contracts/orders";

export function getAvailableStock(runtime: RuntimeStore, productId: string): number {
  return Math.max(0, Math.trunc(runtime.inventory[productId] ?? 0));
}

export function getAvailability(
  runtime: RuntimeStore,
  productId: string,
): "available" | "out_of_stock" {
  return getAvailableStock(runtime, productId) > 0 ? "available" : "out_of_stock";
}

export function hasSufficientStock(
  runtime: RuntimeStore,
  productId: string,
  quantity: number,
): boolean {
  return getAvailableStock(runtime, productId) >= quantity;
}
