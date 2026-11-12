export type InventoryDecrementItem = {
  productId: string;
  quantity: number;
};

export function decrementInventory(
  inventory: Record<string, number>,
  items: InventoryDecrementItem[],
): Record<string, number> {
  const next = { ...inventory };
  for (const item of items) {
    const current = Math.trunc(next[item.productId] ?? 0);
    if (current < item.quantity) {
      throw new Error(`Insufficient stock for ${item.productId}.`);
    }
    next[item.productId] = current - item.quantity;
  }
  return next;
}
