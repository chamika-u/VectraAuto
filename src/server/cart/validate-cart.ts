import type { CartValidationRequest, CartValidationResponse, CartWarning } from "@/lib/contracts/cart";
import type { CartValidationItem } from "@/lib/contracts/cart";
import { formatLkr } from "@/lib/money";
import { resolveCompatibility } from "@/server/catalog/fitment";
import {
  getProductById,
  getVehicleProfileById,
} from "@/server/catalog/repository";
import { getAvailableStock } from "@/server/inventory/repository";
import type { JsonStore } from "@/server/storage/json-store";

export async function validateCart(
  store: JsonStore,
  input: CartValidationRequest,
): Promise<CartValidationResponse> {
  const { catalog, runtime } = await store.readSnapshot();
  const vehicle = getVehicleProfileById(catalog, input.vehicleId ?? null);
  const warnings: CartWarning[] = [];

  const items: CartValidationItem[] = input.items.map((requested) => {
    const product = getProductById(catalog, requested.productId);
    if (!product) {
      warnings.push({
        code: "PRODUCT_UNAVAILABLE",
        productId: requested.productId,
        message: "A product in your cart is no longer available. Please remove it.",
      });
      return {
        productId: requested.productId,
        slug: "",
        sku: "",
        name: "Unavailable product",
        quantity: requested.quantity,
        unitPriceCents: 0,
        lineTotalCents: 0,
        availableStock: 0,
        availability: "out_of_stock",
        priceChanged: false,
        compatibility: null,
        imagePath: "/products/placeholder.svg",
        imageAlt: "Unavailable product placeholder",
      };
    }

    const availableStock = getAvailableStock(runtime, product.id);
    const availability =
      availableStock <= 0
        ? ("out_of_stock" as const)
        : availableStock < requested.quantity
          ? ("insufficient_stock" as const)
          : ("available" as const);
    const priceChanged =
      requested.expectedUnitPriceCents !== undefined &&
      requested.expectedUnitPriceCents !== product.priceCents;
    const compatibility = resolveCompatibility(
      product,
      catalog.fitmentApplications,
      vehicle,
    ).compatibility;
    const image = product.images[0];

    if (availability === "out_of_stock") {
      warnings.push({
        code: "OUT_OF_STOCK",
        productId: product.id,
        message: `${product.name} is out of stock.`,
      });
    } else if (availability === "insufficient_stock") {
      warnings.push({
        code: "INSUFFICIENT_STOCK",
        productId: product.id,
        message: `Only ${availableStock} of ${product.name} remain in stock.`,
      });
    }

    if (priceChanged) {
      warnings.push({
        code: "PRICE_CHANGED",
        productId: product.id,
        message: `The price of ${product.name} changed to ${formatLkr(product.priceCents)}.`,
      });
    }

    if (compatibility === "incompatible") {
      warnings.push({
        code: "FITMENT_INCOMPATIBLE",
        productId: product.id,
        message: `${product.name} is not listed for the selected vehicle.`,
      });
    } else if (compatibility === "unknown") {
      warnings.push({
        code: "FITMENT_UNKNOWN",
        productId: product.id,
        message: `Fitment for ${product.name} is unknown for the selected vehicle.`,
      });
    }

    return {
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      quantity: requested.quantity,
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * requested.quantity,
      availableStock,
      availability,
      priceChanged,
      compatibility,
      imagePath: image?.path ?? "/products/placeholder.svg",
      imageAlt: image?.alt ?? `${product.name} placeholder`,
    };
  });

  const subtotalCents = items.reduce((total, item) => total + item.lineTotalCents, 0);
  const deliveryFeeCents = catalog.deliveryFeeCents;
  const canCheckout = items.every((item) => item.availability === "available");

  return {
    items,
    subtotalCents,
    deliveryFeeCents,
    grandTotalCents: subtotalCents + deliveryFeeCents,
    warnings,
    canCheckout,
  };
}
