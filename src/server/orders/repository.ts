import type { PublicOrder } from "@/lib/contracts/orders";
import { toPublicOrder } from "@/server/orders/place-order";
import type { JsonStore } from "@/server/storage/json-store";

export async function findOrderByReference(
  store: JsonStore,
  reference: string,
): Promise<PublicOrder | null> {
  const { runtime } = await store.readSnapshot();
  const order = runtime.orders.find((candidate) => candidate.reference === reference);
  return order ? toPublicOrder(order) : null;
}
