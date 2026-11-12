import type {
  IdempotencyRecord,
  Order,
  OrderConflict,
  OrderConflictItem,
  OrderRequest,
  PublicOrder,
  RuntimeStore,
} from "@/lib/contracts/orders";
import { resolveCompatibility } from "@/server/catalog/fitment";
import { getProductById, getVehicleProfileById } from "@/server/catalog/repository";
import { getAvailableStock } from "@/server/inventory/repository";
import { decrementInventory } from "@/server/inventory/decrement";
import { generateOrderReference, retentionExpiry } from "@/server/orders/reference";
import type { JsonStore } from "@/server/storage/json-store";

export type PlaceOrderResult =
  | { status: 201; order: PublicOrder }
  | { status: 200; order: PublicOrder }
  | { status: 409; conflict: OrderConflict }
  | { status: 400; fields: Record<string, string> };

export function toPublicOrder(order: Order): PublicOrder {
  return {
    reference: order.reference,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items,
    delivery: order.delivery,
    vehicle: order.vehicle,
    subtotalCents: order.subtotalCents,
    deliveryFeeCents: order.deliveryFeeCents,
    grandTotalCents: order.grandTotalCents,
    payment: order.payment,
  };
}

export async function placeOrder(
  store: JsonStore,
  idempotencyKey: string,
  input: OrderRequest,
): Promise<PlaceOrderResult> {
  return store.withLock(async ({ catalog, runtime, save }) => {
    const existing = runtime.idempotency.find((record) => record.key === idempotencyKey);
    if (existing) {
      const existingOrder = runtime.orders.find((order) => order.id === existing.orderId);
      if (existingOrder) {
        return { status: 200, order: toPublicOrder(existingOrder) };
      }
    }

    const vehicleProfile = input.vehicleId
      ? getVehicleProfileById(catalog, input.vehicleId)
      : null;
    if (input.vehicleId && !vehicleProfile) {
      return {
        status: 400,
        fields: { vehicleId: "Select a prepared vehicle from the fitment finder." },
      };
    }

    const conflicts: OrderConflictItem[] = [];
    const resolvedItems = input.items.map((requested) => {
      const product = getProductById(catalog, requested.productId);
      if (!product) {
        conflicts.push({
          productId: requested.productId,
          reason: "PRODUCT_UNAVAILABLE",
          currentUnitPriceCents: null,
          availableStock: null,
        });
        return null;
      }
      const availableStock = getAvailableStock(runtime, product.id);
      let reason: OrderConflictItem["reason"] | null = null;
      if (availableStock <= 0) reason = "OUT_OF_STOCK";
      else if (availableStock < requested.quantity) reason = "INSUFFICIENT_STOCK";
      else if (
        requested.expectedUnitPriceCents !== undefined &&
        requested.expectedUnitPriceCents !== product.priceCents
      ) {
        reason = "PRICE_CHANGED";
      }
      if (reason) {
        conflicts.push({
          productId: product.id,
          reason,
          currentUnitPriceCents: product.priceCents,
          availableStock,
        });
        return null;
      }
      return { product, requested };
    });

    if (conflicts.length > 0) {
      return {
        status: 409,
        conflict: {
          code: "CART_CONFLICT",
          message: "Some items changed while you were checking out.",
          items: conflicts,
        },
      };
    }

    const now = new Date();
    const createdAt = now.toISOString();
    const orderReference = generateOrderReference(
      now,
      runtime.orders.map((order) => order.reference),
    );

    const orderItems = resolvedItems
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .map(({ product, requested }) => {
        const compatibility = resolveCompatibility(
          product,
          catalog.fitmentApplications,
          vehicleProfile,
        ).compatibility;
        return {
          productId: product.id,
          sku: product.sku,
          partNumber: product.partNumber,
          name: product.name,
          quantity: requested.quantity,
          unitPriceCents: product.priceCents,
          lineTotalCents: product.priceCents * requested.quantity,
          compatibility,
        };
      });

    const subtotalCents = orderItems.reduce((total, item) => total + item.lineTotalCents, 0);
    const deliveryFeeCents = catalog.deliveryFeeCents;
    const order: Order = {
      id: crypto.randomUUID(),
      reference: orderReference,
      idempotencyKey,
      customer: input.customer,
      delivery: input.delivery,
      vehicle: vehicleProfile
        ? {
            vehicleId: vehicleProfile.vehicleId,
            displayName: vehicleProfile.displayName,
            make: vehicleProfile.make,
            model: vehicleProfile.model,
            year: vehicleProfile.year,
            engine: vehicleProfile.engine,
            variant: vehicleProfile.variant,
          }
        : null,
      items: orderItems,
      subtotalCents,
      deliveryFeeCents,
      grandTotalCents: subtotalCents + deliveryFeeCents,
      payment: {
        method: input.payment.method,
        status: input.payment.method === "cod" ? "cod_pending" : "simulated_demo",
        cardDataStored: false,
      },
      status: "confirmed",
      createdAt,
      expiresAt: retentionExpiry(now, catalog.retentionDays),
    };

    const nextInventory = decrementInventory(
      runtime.inventory,
      orderItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    );
    const idempotencyRecord: IdempotencyRecord = {
      key: idempotencyKey,
      orderId: order.id,
      createdAt,
      expiresAt: order.expiresAt,
    };
    const nextRuntime: RuntimeStore = {
      ...runtime,
      inventory: nextInventory,
      orders: [...runtime.orders, order],
      idempotency: [...runtime.idempotency, idempotencyRecord],
    };

    await save(nextRuntime);
    return { status: 201, order: toPublicOrder(order) };
  });
}
