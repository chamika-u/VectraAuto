import { readFile } from "node:fs/promises";
import { catalogSeedSchema, type CatalogSeed } from "@/lib/contracts/catalog";
import { getSettings } from "@/server/config";

export class CatalogValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogValidationError";
  }
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      throw new CatalogValidationError(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

export function validateCatalogSeed(raw: unknown): CatalogSeed {
  const parsed = catalogSeedSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .slice(0, 6)
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");
    throw new CatalogValidationError(`Catalog seed is invalid: ${detail}`);
  }

  const catalog = parsed.data;
  assertUnique(catalog.categories.map((category) => category.id), "category id");
  assertUnique(catalog.categories.map((category) => category.slug), "category slug");
  assertUnique(catalog.products.map((product) => product.id), "product id");
  assertUnique(catalog.products.map((product) => product.slug), "product slug");
  assertUnique(catalog.products.map((product) => product.sku), "product SKU");
  assertUnique(catalog.vehicles.map((vehicle) => vehicle.id), "vehicle id");
  assertUnique(catalog.fitmentApplications.map((application) => application.id), "fitment id");

  const categoryIds = new Set(catalog.categories.map((category) => category.id));
  const productIds = new Set(catalog.products.map((product) => product.id));
  const vehicleIds = new Set(catalog.vehicles.map((vehicle) => vehicle.id));

  for (const product of catalog.products) {
    if (!categoryIds.has(product.categoryId)) {
      throw new CatalogValidationError(
        `Product ${product.id} references unknown category ${product.categoryId}.`,
      );
    }
  }

  const applicationKeys = new Set<string>();
  for (const application of catalog.fitmentApplications) {
    if (!productIds.has(application.productId)) {
      throw new CatalogValidationError(
        `Fitment ${application.id} references unknown product ${application.productId}.`,
      );
    }
    if (!vehicleIds.has(application.vehicleId)) {
      throw new CatalogValidationError(
        `Fitment ${application.id} references unknown vehicle ${application.vehicleId}.`,
      );
    }
    const key = `${application.productId}:${application.vehicleId}`;
    if (applicationKeys.has(key)) {
      throw new CatalogValidationError(`Duplicate fitment application for ${key}.`);
    }
    applicationKeys.add(key);
  }

  return catalog;
}

export async function loadCatalogSeed(catalogPath = getSettings().catalogPath): Promise<CatalogSeed> {
  const content = await readFile(catalogPath, "utf8");
  const raw = JSON.parse(content) as unknown;
  return validateCatalogSeed(raw);
}
