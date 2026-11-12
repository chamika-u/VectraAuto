import type { Product } from "@/lib/contracts/catalog";

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function productMatchesQuery(product: Product, query: string): boolean {
  const normalized = normalizeSearch(query);
  if (!normalized) return true;
  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    product.partNumber,
    product.sku,
  ]
    .join(" ")
    .toLowerCase();
  return normalized.split(" ").every((token) => haystack.includes(token));
}
