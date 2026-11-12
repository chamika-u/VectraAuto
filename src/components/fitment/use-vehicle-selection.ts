"use client";

import { useCallback, useEffect, useState } from "react";
import type { VehicleProfile } from "@/lib/contracts/catalog";
import { VEHICLE_STORAGE_KEY } from "@/lib/constants";

const CHANGE_EVENT = "vectra:vehicle-changed";

function isVehicleProfile(value: unknown): value is VehicleProfile {
  if (typeof value !== "object" || value === null) return false;
  const vehicle = value as Partial<VehicleProfile>;
  return (
    typeof vehicle.vehicleId === "string" &&
    typeof vehicle.make === "string" &&
    typeof vehicle.model === "string" &&
    typeof vehicle.year === "number" &&
    typeof vehicle.displayName === "string"
  );
}

export function readStoredVehicle(): VehicleProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isVehicleProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function storeVehicle(vehicle: VehicleProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (vehicle) {
      window.localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicle));
    } else {
      window.localStorage.removeItem(VEHICLE_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be unavailable; the current page remains fully usable.
  }
}

export function useVehicleSelection() {
  const [vehicle, setVehicle] = useState<VehicleProfile | null>(null);

  useEffect(() => {
    setVehicle(readStoredVehicle());
    const onChange = () => setVehicle(readStoredVehicle());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const selectVehicle = useCallback((next: VehicleProfile | null) => {
    storeVehicle(next);
    setVehicle(next);
  }, []);

  return { vehicle, selectVehicle, clearVehicle: () => selectVehicle(null) };
}
