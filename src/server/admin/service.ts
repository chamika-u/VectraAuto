import { formatLkr } from "@/lib/money";
import type { Product, Vehicle } from "@/lib/contracts/catalog";
import type { Order } from "@/lib/contracts/orders";
import { getStore, JsonStore } from "@/server/storage/json-store";
import { writeFile } from "node:fs/promises";

export type AdminOrderStatus = "confirmed" | "processing" | "dispatched" | "delivered" | "cancelled";

export type AdminOverview = {
  totalRevenueCents: number;
  totalRevenueFormatted: string;
  totalOrdersCount: number;
  confirmedOrdersCount: number;
  activeProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalVehiclesCount: number;
  totalCategoriesCount: number;
  ordersByStatus: Record<string, number>;
  ordersByPayment: Record<string, number>;
  recentOrders: Order[];
  lowStockProducts: Array<{
    id: string;
    sku: string;
    name: string;
    categoryName: string;
    currentStock: number;
    priceFormatted: string;
    status: string;
  }>;
};

export type AdminProductItem = Product & {
  currentStock: number;
  categoryName: string;
  fitmentCount: number;
};

export async function getAdminOverview(store: JsonStore = getStore()): Promise<AdminOverview> {
  const { catalog, runtime } = await store.readSnapshot();
  const categoryMap = new Map(catalog.categories.map((c) => [c.id, c.name]));

  let totalRevenueCents = 0;
  const ordersByStatus: Record<string, number> = {
    confirmed: 0,
    processing: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0,
  };
  const ordersByPayment: Record<string, number> = {
    cod: 0,
    simulated_card: 0,
  };

  for (const order of runtime.orders) {
    const status = order.status || "confirmed";
    ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    const paymentMethod = order.payment?.method || "cod";
    ordersByPayment[paymentMethod] = (ordersByPayment[paymentMethod] || 0) + 1;

    if ((status as string) !== "cancelled") {
      totalRevenueCents += order.grandTotalCents;
    }
  }

  let lowStockCount = 0;
  let outOfStockCount = 0;
  const lowStockProducts: AdminOverview["lowStockProducts"] = [];

  for (const product of catalog.products) {
    const stock = runtime.inventory[product.id] ?? product.initialStock;
    if (stock === 0) {
      outOfStockCount++;
      lowStockProducts.push({
        id: product.id,
        sku: product.sku,
        name: product.name,
        categoryName: categoryMap.get(product.categoryId) || "General",
        currentStock: stock,
        priceFormatted: formatLkr(product.priceCents),
        status: product.status,
      });
    } else if (stock <= 5) {
      lowStockCount++;
      lowStockProducts.push({
        id: product.id,
        sku: product.sku,
        name: product.name,
        categoryName: categoryMap.get(product.categoryId) || "General",
        currentStock: stock,
        priceFormatted: formatLkr(product.priceCents),
        status: product.status,
      });
    }
  }

  // Sort low stock by stock ascending
  lowStockProducts.sort((a, b) => a.currentStock - b.currentStock);

  // Recent orders sorted newest first
  const recentOrders = [...runtime.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return {
    totalRevenueCents,
    totalRevenueFormatted: formatLkr(totalRevenueCents),
    totalOrdersCount: runtime.orders.length,
    confirmedOrdersCount: ordersByStatus.confirmed || 0,
    activeProductsCount: catalog.products.filter((p) => p.status === "active").length,
    lowStockCount,
    outOfStockCount,
    totalVehiclesCount: catalog.vehicles.length,
    totalCategoriesCount: catalog.categories.length,
    ordersByStatus,
    ordersByPayment,
    recentOrders,
    lowStockProducts: lowStockProducts.slice(0, 10),
  };
}

export async function getAdminOrders(
  filters: {
    query?: string;
    status?: string;
    paymentMethod?: string;
  } = {},
  store: JsonStore = getStore(),
): Promise<Order[]> {
  const { runtime } = await store.readSnapshot();
  let orders = [...runtime.orders];

  if (filters.status && filters.status !== "all") {
    orders = orders.filter((o) => (o.status || "confirmed") === filters.status);
  }

  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    orders = orders.filter((o) => o.payment?.method === filters.paymentMethod);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    orders = orders.filter(
      (o) =>
        o.reference.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.delivery.city.toLowerCase().includes(q),
    );
  }

  // Newest first
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdminOrder(
  reference: string,
  store: JsonStore = getStore(),
): Promise<Order | null> {
  const { runtime } = await store.readSnapshot();
  const order = runtime.orders.find((o) => o.reference === reference || o.id === reference);
  return order || null;
}

export async function updateOrderStatus(
  reference: string,
  newStatus: AdminOrderStatus,
  store: JsonStore = getStore(),
): Promise<Order | null> {
  return store.withLock(async ({ runtime, save }) => {
    const orderIndex = runtime.orders.findIndex(
      (o) => o.reference === reference || o.id === reference,
    );
    if (orderIndex === -1) {
      return null;
    }

    const order = runtime.orders[orderIndex];
    // Allow updating status
    (order as unknown as { status: string }).status = newStatus;
    await save(runtime);
    return order;
  });
}

export async function getAdminProducts(
  filters: {
    query?: string;
    categoryId?: string;
    stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  } = {},
  store: JsonStore = getStore(),
): Promise<AdminProductItem[]> {
  const { catalog, runtime } = await store.readSnapshot();
  const categoryMap = new Map(catalog.categories.map((c) => [c.id, c.name]));

  // Fitment count map
  const fitmentCountMap = new Map<string, number>();
  for (const app of catalog.fitmentApplications) {
    fitmentCountMap.set(app.productId, (fitmentCountMap.get(app.productId) || 0) + 1);
  }

  let items: AdminProductItem[] = catalog.products.map((p) => {
    const currentStock = runtime.inventory[p.id] ?? p.initialStock;
    return {
      ...p,
      currentStock,
      categoryName: categoryMap.get(p.categoryId) || "General",
      fitmentCount: fitmentCountMap.get(p.id) || 0,
    };
  });

  if (filters.categoryId && filters.categoryId !== "all") {
    items = items.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.stockStatus && filters.stockStatus !== "all") {
    if (filters.stockStatus === "out_of_stock") {
      items = items.filter((p) => p.currentStock === 0);
    } else if (filters.stockStatus === "low_stock") {
      items = items.filter((p) => p.currentStock > 0 && p.currentStock <= 5);
    } else if (filters.stockStatus === "in_stock") {
      items = items.filter((p) => p.currentStock > 5);
    }
  }

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }

  return items;
}

export async function updateProductStock(
  productId: string,
  newStock: number,
  store: JsonStore = getStore(),
): Promise<{ productId: string; newStock: number } | null> {
  return store.withLock(async ({ catalog, runtime, save }) => {
    const product = catalog.products.find((p) => p.id === productId);
    if (!product) return null;

    runtime.inventory[productId] = Math.max(0, Math.floor(newStock));
    await save(runtime);
    return { productId, newStock: runtime.inventory[productId] };
  });
}

export async function updateProductDetails(
  productId: string,
  updates: {
    priceCents?: number;
    status?: "active" | "inactive";
    isFeatured?: boolean;
    name?: string;
    stock?: number;
  },
  store: JsonStore = getStore(),
): Promise<Product | null> {
  const { catalog } = await store.readSnapshot();
  const product = catalog.products.find((p) => p.id === productId);
  if (!product) return null;

  if (updates.priceCents !== undefined) {
    product.priceCents = Math.max(1, Math.floor(updates.priceCents));
  }
  if (updates.status !== undefined) {
    product.status = updates.status;
  }
  if (updates.isFeatured !== undefined) {
    product.isFeatured = updates.isFeatured;
  }
  if (updates.name !== undefined && updates.name.trim()) {
    product.name = updates.name.trim();
  }

  // Update in catalog seed file on disk so changes persist across reloads
  await writeFile(store.paths.catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  // If stock was also provided, update runtime
  if (updates.stock !== undefined) {
    await updateProductStock(productId, updates.stock, store);
  }

  return product;
}

export async function getAdminVehicles(
  query?: string,
  store: JsonStore = getStore(),
): Promise<Array<Vehicle & { applicationsCount: number }>> {
  const { catalog } = await store.readSnapshot();
  const appMap = new Map<string, number>();
  for (const app of catalog.fitmentApplications) {
    appMap.set(app.vehicleId, (appMap.get(app.vehicleId) || 0) + 1);
  }

  let vehicles = catalog.vehicles.map((v) => ({
    ...v,
    applicationsCount: appMap.get(v.id) || 0,
  }));

  if (query) {
    const q = query.toLowerCase().trim();
    vehicles = vehicles.filter(
      (v) =>
        v.displayName.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.year.toString().includes(q),
    );
  }

  return vehicles;
}
