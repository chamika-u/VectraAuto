"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/contracts/catalog";
import {
  readStoredVehicle,
  storeVehicle,
} from "@/components/fitment/use-vehicle-selection";

function resolveVehicle(
  vehicles: Vehicle[],
  make: string | null,
  model: string | null,
  year: string | null,
): Vehicle | null {
  if (!make || !model || !year) return null;
  const numericYear = Number(year);
  return (
    vehicles.find(
      (vehicle) =>
        vehicle.make.toLowerCase() === make.toLowerCase() &&
        vehicle.model.toLowerCase() === model.toLowerCase() &&
        vehicle.year === numericYear,
    ) ?? null
  );
}

export function VehicleSync({ vehicles }: { vehicles: Vehicle[] }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const make = params.get("make");
    const model = params.get("model");
    const year = params.get("year");
    const stored = readStoredVehicle();

    if (make && model && year) {
      const matched = resolveVehicle(vehicles, make, model, year);
      if (matched) {
        const profile = {
          vehicleId: matched.id,
          make: matched.make,
          model: matched.model,
          year: matched.year,
          engine: matched.engine,
          variant: matched.variant,
          displayName: matched.displayName,
        };
        if (JSON.stringify(profile) !== JSON.stringify(stored)) {
          storeVehicle(profile);
        }
      }
      return;
    }

    if (make || model || year || !stored) return;
    if (
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/orders")
    ) {
      return;
    }

    const next = new URLSearchParams(params);
    next.set("make", stored.make);
    next.set("model", stored.model);
    next.set("year", String(stored.year));
    if (stored.engine) next.set("engine", stored.engine);
    if (stored.variant) next.set("variant", stored.variant);
    router.replace(`${pathname}?${next.toString()}`);
  }, [pathname, router, vehicles]);

  return null;
}
