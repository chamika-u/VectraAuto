import type {
  CatalogSeed,
  Category,
  Product,
  ProductCard,
  ProductDetail,
  Vehicle,
  VehicleProfile,
} from "@/lib/contracts/catalog";
import { formatLkr } from "@/lib/money";
import { resolveCompatibility, resolveVehicleFromParams, vehicleToProfile } from "./fitment";
import { productMatchesQuery } from "./search";
import { getAvailability, getAvailableStock } from "@/server/inventory/repository";
import type { RuntimeStore } from "@/lib/contracts/orders";

export type CatalogFilters = {
  categorySlug?: string;
  query?: string;
  vehicle?: VehicleProfile | null;
  compatibleOnly?: boolean;
};

export function getCategoryBySlug(catalog: CatalogSeed, slug: string): Category | undefined {
  return catalog.categories.find((category) => category.slug === slug);
}

export function getVehicleById(catalog: CatalogSeed, vehicleId: string | null): Vehicle | null {
  if (!vehicleId) return null;
  return catalog.vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null;
}

export function getProductBySlug(catalog: CatalogSeed, slug: string): Product | undefined {
  return catalog.products.find((product) => product.slug === slug && product.status === "active");
}

export function getProductById(catalog: CatalogSeed, productId: string): Product | undefined {
  return catalog.products.find((product) => product.id === productId && product.status === "active");
}

export function findVehicleSelection(
  catalog: CatalogSeed,
  params: Record<string, string | undefined>,
): VehicleProfile | null {
  return resolveVehicleFromParams(catalog.vehicles, params);
}

export function productToCard(
  catalog: CatalogSeed,
  runtime: RuntimeStore,
  product: Product,
  vehicle: VehicleProfile | null,
): ProductCard {
  const image = product.images[0];
  const compatibility = resolveCompatibility(
    product,
    catalog.fitmentApplications,
    vehicle,
  ).compatibility;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    priceCents: product.priceCents,
    priceFormatted: formatLkr(product.priceCents),
    imagePath: image?.path ?? "/products/placeholder.svg",
    imageAlt: image?.alt ?? `${product.name} placeholder`,
    availability: getAvailability(runtime, product.id),
    availableQuantity: getAvailableStock(runtime, product.id),
    compatibility,
  };
}

export function listProducts(
  catalog: CatalogSeed,
  runtime: RuntimeStore,
  filters: CatalogFilters = {},
): ProductCard[] {
  const category = filters.categorySlug
    ? getCategoryBySlug(catalog, filters.categorySlug)
    : undefined;

  return catalog.products
    .filter((product) => product.status === "active")
    .filter((product) => (category ? product.categoryId === category.id : true))
    .filter((product) => (filters.query ? productMatchesQuery(product, filters.query) : true))
    .map((product) => productToCard(catalog, runtime, product, filters.vehicle ?? null))
    .filter((product) =>
      filters.compatibleOnly ? product.compatibility === "compatible" : true,
    )
    .sort((a, b) => {
      const productA = catalog.products.find((product) => product.id === a.id);
      const productB = catalog.products.find((product) => product.id === b.id);
      if (productA?.isFeatured !== productB?.isFeatured) return productA?.isFeatured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function getFeaturedProducts(
  catalog: CatalogSeed,
  runtime: RuntimeStore,
  vehicle: VehicleProfile | null,
  limit = 6,
): ProductCard[] {
  const featured = catalog.products.filter((product) => product.isFeatured && product.status === "active");
  const selected = featured.length > 0 ? featured : catalog.products.filter((product) => product.status === "active");
  return selected
    .slice(0, limit)
    .map((product) => productToCard(catalog, runtime, product, vehicle));
}

export function getProductDetail(
  catalog: CatalogSeed,
  runtime: RuntimeStore,
  slug: string,
  vehicle: VehicleProfile | null,
): ProductDetail | null {
  const product = getProductBySlug(catalog, slug);
  if (!product) return null;
  const category = catalog.categories.find((item) => item.id === product.categoryId);
  if (!category) return null;
  const card = productToCard(catalog, runtime, product, vehicle);
  const compatibility = resolveCompatibility(product, catalog.fitmentApplications, vehicle);
  const applications = catalog.fitmentApplications
    .filter((application) => application.productId === product.id)
    .map((application) => {
      const matchedVehicle = catalog.vehicles.find((item) => item.id === application.vehicleId);
      return {
        vehicleId: application.vehicleId,
        displayName: matchedVehicle?.displayName ?? application.vehicleId,
        notes: application.notes,
      };
    });

  return {
    ...card,
    sku: product.sku,
    partNumber: product.partNumber,
    description: product.description,
    category,
    images: product.images,
    specifications: product.specifications,
    fitmentSummary: product.fitmentSummary,
    fitmentApplications: applications,
    compatibilityNote: compatibility.note,
  };
}

export function getVehicleList(catalog: CatalogSeed): Vehicle[] {
  return catalog.vehicles;
}

export function getVehicleProfileById(
  catalog: CatalogSeed,
  vehicleId: string | null,
): VehicleProfile | null {
  const vehicle = getVehicleById(catalog, vehicleId);
  return vehicle ? vehicleToProfile(vehicle) : null;
}
