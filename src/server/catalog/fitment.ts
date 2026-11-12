import type {
  Compatibility,
  FitmentApplication,
  Product,
  Vehicle,
  VehicleProfile,
} from "@/lib/contracts/catalog";

export type CompatibilityResult = {
  compatibility: Compatibility | null;
  note: string | null;
};

export function resolveCompatibility(
  product: Product,
  applications: FitmentApplication[],
  vehicle: VehicleProfile | Vehicle | null,
): CompatibilityResult {
  if (!vehicle) return { compatibility: null, note: null };
  const vehicleId = "vehicleId" in vehicle ? vehicle.vehicleId : vehicle.id;
  const productApplications = applications.filter(
    (application) => application.productId === product.id,
  );
  if (productApplications.length === 0) {
    return {
      compatibility: "unknown",
      note: "Fitment data is not available for this product yet.",
    };
  }
  const match = productApplications.find((application) => application.vehicleId === vehicleId);
  if (match) {
    return {
      compatibility: "compatible",
      note: match.notes ?? "Confirmed fit for the selected vehicle.",
    };
  }
  return {
    compatibility: "incompatible",
    note: "This part is not listed for the selected vehicle.",
  };
}

export function vehicleToProfile(vehicle: Vehicle): VehicleProfile {
  return {
    vehicleId: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    engine: vehicle.engine,
    variant: vehicle.variant,
    displayName: vehicle.displayName,
  };
}

export function resolveVehicleFromParams(
  vehicles: Vehicle[],
  params: {
    make?: string;
    model?: string;
    year?: string;
    engine?: string;
    variant?: string;
  },
): VehicleProfile | null {
  if (!params.make || !params.model || !params.year) return null;
  const year = Number(params.year);
  if (!Number.isInteger(year)) return null;
  const make = params.make.trim().toLowerCase();
  const model = params.model.trim().toLowerCase();
  const engine = params.engine?.trim().toLowerCase() || null;
  const variant = params.variant?.trim().toLowerCase() || null;

  const candidates = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase() === make &&
      vehicle.model.toLowerCase() === model &&
      vehicle.year === year,
  );
  const match =
    candidates.find(
      (vehicle) =>
        (!engine || vehicle.engine?.toLowerCase() === engine) &&
        (!variant || vehicle.variant?.toLowerCase() === variant),
    ) ?? candidates[0];

  return match ? vehicleToProfile(match) : null;
}

export function buildVehicleQuery(vehicle: VehicleProfile): URLSearchParams {
  return new URLSearchParams({
    make: vehicle.make,
    model: vehicle.model,
    year: String(vehicle.year),
    ...(vehicle.engine ? { engine: vehicle.engine } : {}),
    ...(vehicle.variant ? { variant: vehicle.variant } : {}),
  });
}

export function getVehicleOptions(vehicles: Vehicle[]) {
  const makes = [...new Set(vehicles.map((vehicle) => vehicle.make))].sort((a, b) =>
    a.localeCompare(b),
  );
  const modelsByMake = Object.fromEntries(
    makes.map((make) => [
      make,
      [
        ...new Set(
          vehicles
            .filter((vehicle) => vehicle.make === make)
            .map((vehicle) => vehicle.model),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    ]),
  );
  const yearsByMakeModel = Object.fromEntries(
    makes.flatMap((make) =>
      (modelsByMake[make] ?? []).map((model) => [
        `${make}::${model}`,
        [
          ...new Set(
            vehicles
              .filter((vehicle) => vehicle.make === make && vehicle.model === model)
              .map((vehicle) => vehicle.year),
          ),
        ].sort((a, b) => b - a),
      ]),
    ),
  );

  return { makes, modelsByMake, yearsByMakeModel, vehicles };
}
