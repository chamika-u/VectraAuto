import { describe, expect, it, beforeEach } from "vitest";
import {
  getAdminOverview,
  getAdminOrders,
  getAdminProducts,
  updateOrderStatus,
  updateProductStock,
  getAdminVehicles,
} from "@/server/admin/service";
import { getStore } from "@/server/storage/json-store";

describe("admin panel services", () => {
  const store = getStore();

  beforeEach(async () => {
    await store.initialize();
  });

  it("loads admin overview with catalog metrics", async () => {
    const overview = await getAdminOverview(store);
    expect(overview.totalCategoriesCount).toBeGreaterThan(0);
    expect(overview.activeProductsCount).toBeGreaterThan(0);
    expect(overview.totalVehiclesCount).toBeGreaterThan(0);
    expect(Array.isArray(overview.recentOrders)).toBe(true);
    expect(Array.isArray(overview.lowStockProducts)).toBe(true);
  });

  it("lists products enriched with real-time runtime stock", async () => {
    const products = await getAdminProducts({}, store);
    expect(products.length).toBeGreaterThan(0);
    const first = products[0];
    expect(first).toHaveProperty("currentStock");
    expect(first).toHaveProperty("categoryName");
    expect(first).toHaveProperty("fitmentCount");
  });

  it("adjusts product stock atomically", async () => {
    const products = await getAdminProducts({}, store);
    const targetProduct = products[0];

    const updated = await updateProductStock(targetProduct.id, 42, store);
    expect(updated).not.toBeNull();
    expect(updated?.newStock).toBe(42);

    const reloaded = await getAdminProducts({ query: targetProduct.sku }, store);
    const found = reloaded.find((p) => p.id === targetProduct.id);
    expect(found?.currentStock).toBe(42);
  });

  it("lists registered vehicles with fitment count", async () => {
    const vehicles = await getAdminVehicles(undefined, store);
    expect(vehicles.length).toBeGreaterThan(0);
    expect(vehicles[0]).toHaveProperty("applicationsCount");
  });
});
