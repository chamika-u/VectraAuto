import { describe, expect, it } from "vitest";
import { decrementInventory } from "@/server/inventory/decrement";
import { purgeExpiredData } from "@/server/retention/purge";
import type { RuntimeStore, Order } from "@/lib/contracts/orders";

describe("inventory and order lifecycle", () => {
  it("decrements inventory accurately", () => {
    const inventory = { prod_1: 10, prod_2: 5 };
    const result = decrementInventory(inventory, [
      { productId: "prod_1", quantity: 3 },
      { productId: "prod_2", quantity: 5 },
    ]);
    expect(result.prod_1).toBe(7);
    expect(result.prod_2).toBe(0);
  });

  it("throws when decrementing below zero", () => {
    const inventory = { prod_1: 2 };
    expect(() =>
      decrementInventory(inventory, [{ productId: "prod_1", quantity: 3 }]),
    ).toThrow(/insufficient stock/i);
  });

  it("purges orders older than retention period", () => {
    const now = new Date("2026-11-12T12:00:00Z");
    const activeOrder: Order = {
      id: "ord_1",
      reference: "VA-20261112-ABCD1234",
      idempotencyKey: "b8584dc5-131c-43ad-a0eb-bc28bc8da430",
      customer: { fullName: "Nimal", phone: "0771234567", email: "n@test.com" },
      delivery: { addressLine1: "Road", addressLine2: null, city: "City", postalCode: "00100", notes: null },
      vehicle: null,
      items: [],
      subtotalCents: 1000,
      deliveryFeeCents: 500,
      grandTotalCents: 1500,
      payment: { method: "cod", status: "cod_pending", cardDataStored: false },
      status: "confirmed",
      createdAt: "2026-11-10T12:00:00Z",
      expiresAt: "2026-12-10T12:00:00Z",
    };

    const expiredOrder: Order = {
      ...activeOrder,
      id: "ord_2",
      reference: "VA-20261001-EXPD1234",
      idempotencyKey: "12345678-1234-1234-1234-123456789abc",
      createdAt: "2026-09-01T12:00:00Z",
      expiresAt: "2026-10-01T12:00:00Z",
    };

    const runtimeStore: RuntimeStore = {
      schemaVersion: 1,
      inventory: { prod_1: 10 },
      orders: [activeOrder, expiredOrder],
      idempotency: [
        {
          key: activeOrder.idempotencyKey,
          orderId: activeOrder.id,
          createdAt: activeOrder.createdAt,
          expiresAt: activeOrder.expiresAt,
        },
        {
          key: expiredOrder.idempotencyKey,
          orderId: expiredOrder.id,
          createdAt: expiredOrder.createdAt,
          expiresAt: expiredOrder.expiresAt,
        },
      ],
    };

    const purgeResult = purgeExpiredData(runtimeStore, now, 30);
    expect(purgeResult.removedOrders).toBe(1);
    expect(purgeResult.removedIdempotency).toBe(1);
    expect(purgeResult.store.orders).toHaveLength(1);
    expect(purgeResult.store.orders[0].id).toBe("ord_1");
  });
});

