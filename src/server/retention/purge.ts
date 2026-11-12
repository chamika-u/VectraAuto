import type { RuntimeStore } from "@/lib/contracts/orders";

export type PurgeResult = {
  store: RuntimeStore;
  removedOrders: number;
  removedIdempotency: number;
};

export function purgeExpiredData(
  store: RuntimeStore,
  now = new Date(),
  retentionDays = 30,
): PurgeResult {
  const nowIso = now.toISOString();
  const fallbackCutoff = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const orders = store.orders.filter((order) => {
    const expiresAt = order.expiresAt ?? fallbackCutoff;
    return expiresAt > nowIso;
  });

  const orderIds = new Set(orders.map((order) => order.id));
  const idempotency = store.idempotency.filter(
    (record) =>
      record.expiresAt > nowIso &&
      orderIds.has(record.orderId),
  );

  return {
    store: {
      ...store,
      orders,
      idempotency,
    },
    removedOrders: store.orders.length - orders.length,
    removedIdempotency: store.idempotency.length - idempotency.length,
  };
}
