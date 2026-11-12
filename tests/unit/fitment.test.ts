import { describe, expect, it } from "vitest";
import { resolveCompatibility, resolveVehicleFromParams, vehicleToProfile } from "@/server/catalog/fitment";
import type { FitmentApplication, Product, Vehicle } from "@/lib/contracts/catalog";

describe("fitment resolver", () => {
  const sampleVehicle: Vehicle = {
    id: "veh_toyota_corolla_2018",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    engine: "1.8L 2ZR-FE",
    variant: "Axio",
    displayName: "Toyota Corolla (2018) 1.8L 2ZR-FE Axio",
  };

  const sampleProduct: Product = {
    id: "prod_sample_pad",
    sku: "VA-PAD-01",
    partNumber: "04465-02220",
    slug: "sample-pad",
    name: "Sample Brake Pad",
    shortDescription: "Ceramic pad",
    description: "Full description",
    categoryId: "cat_brakes",
    priceCents: 1200000,
    initialStock: 10,
    images: [{ path: "/sample.svg", alt: "sample", width: 400, height: 300 }],
    specifications: [{ label: "Material", value: "Ceramic" }],
    fitmentSummary: "Fits Toyota Corolla 2018",
    status: "active",
  };

  const applications: FitmentApplication[] = [
    {
      id: "fit_1",
      productId: "prod_sample_pad",
      vehicleId: "veh_toyota_corolla_2018",
      notes: "Front axle only",
    },
  ];

  it("returns null compatibility when no vehicle is selected", () => {
    const result = resolveCompatibility(sampleProduct, applications, null);
    expect(result.compatibility).toBeNull();
    expect(result.note).toBeNull();
  });

  it("returns compatible when vehicle application matches", () => {
    const profile = vehicleToProfile(sampleVehicle);
    const result = resolveCompatibility(sampleProduct, applications, profile);
    expect(result.compatibility).toBe("compatible");
    expect(result.note).toBe("Front axle only");
  });

  it("returns incompatible when product has applications but none match vehicle", () => {
    const otherVehicle: Vehicle = {
      ...sampleVehicle,
      id: "veh_honda_civic_2020",
      make: "Honda",
      model: "Civic",
      year: 2020,
    };
    const result = resolveCompatibility(sampleProduct, applications, vehicleToProfile(otherVehicle));
    expect(result.compatibility).toBe("incompatible");
  });

  it("returns unknown when product has zero fitment applications", () => {
    const result = resolveCompatibility(sampleProduct, [], vehicleToProfile(sampleVehicle));
    expect(result.compatibility).toBe("unknown");
  });

  it("resolves vehicle profile from search parameters", () => {
    const resolved = resolveVehicleFromParams([sampleVehicle], {
      make: "Toyota",
      model: "Corolla",
      year: "2018",
    });
    expect(resolved).not.toBeNull();
    expect(resolved?.vehicleId).toBe(sampleVehicle.id);
  });
});
