import { describe, expect, it } from "vitest";
import { normalizeSearch, productMatchesQuery } from "@/server/catalog/search";
import type { Product } from "@/lib/contracts/catalog";

describe("search matcher", () => {
  const sampleProduct: Product = {
    id: "prod_1",
    sku: "VA-FLT-004",
    partNumber: "90915-YZZE1",
    slug: "oil-filter-corolla",
    name: "Genuine Engine Oil Filter",
    shortDescription: "High-efficiency oil filter for 4-cylinder engines",
    description: "Contains synthetic blend media with silicone anti-drain valve.",
    categoryId: "cat_filters",
    priceCents: 240000,
    initialStock: 25,
    images: [{ path: "/sample.svg", alt: "sample", width: 400, height: 300 }],
    specifications: [{ label: "Type", value: "Spin-on" }],
    fitmentSummary: "Toyota models",
    status: "active",
  };

  it("normalizes extra spaces and lowercase", () => {
    expect(normalizeSearch("  Oil   FILTER ")).toBe("oil filter");
  });

  it("matches product by name", () => {
    expect(productMatchesQuery(sampleProduct, "oil filter")).toBe(true);
  });

  it("matches product by part number", () => {
    expect(productMatchesQuery(sampleProduct, "90915-YZZE1")).toBe(true);
  });

  it("matches product by SKU", () => {
    expect(productMatchesQuery(sampleProduct, "VA-FLT-004")).toBe(true);
  });

  it("returns true on empty search string", () => {
    expect(productMatchesQuery(sampleProduct, "")).toBe(true);
  });

  it("returns false when query does not match", () => {
    expect(productMatchesQuery(sampleProduct, "spark plug")).toBe(false);
  });
});

