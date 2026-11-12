"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/contracts/catalog";
import { buildVehicleQuery, vehicleToProfile } from "@/server/catalog/fitment";
import { useVehicleSelection } from "@/components/fitment/use-vehicle-selection";

export function FitmentFinder({
  vehicles,
  redirectPath = "/products",
  title = "Find parts for your vehicle",
}: {
  vehicles: Vehicle[];
  redirectPath?: string;
  title?: string;
}) {
  const router = useRouter();
  const { vehicle, selectVehicle, clearVehicle } = useVehicleSelection();
  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [year, setYear] = useState(vehicle ? String(vehicle.year) : "");
  const [engine, setEngine] = useState(vehicle?.engine ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMake(vehicle?.make ?? "");
    setModel(vehicle?.model ?? "");
    setYear(vehicle ? String(vehicle.year) : "");
    setEngine(vehicle?.engine ?? "");
  }, [vehicle?.vehicleId, vehicle?.make, vehicle?.model, vehicle?.year, vehicle?.engine]);

  const makes = useMemo(
    () => [...new Set(vehicles.map((entry) => entry.make))].sort((a, b) => a.localeCompare(b)),
    [vehicles],
  );
  const models = useMemo(
    () =>
      [
        ...new Set(
          vehicles
            .filter((entry) => entry.make === make)
            .map((entry) => entry.model),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [vehicles, make],
  );
  const years = useMemo(
    () =>
      [
        ...new Set(
          vehicles
            .filter((entry) => entry.make === make && entry.model === model)
            .map((entry) => entry.year),
        ),
      ].sort((a, b) => b - a),
    [vehicles, make, model],
  );
  const matching = useMemo(
    () =>
      vehicles.filter(
        (entry) =>
          entry.make === make &&
          entry.model === model &&
          String(entry.year) === year &&
          (!engine || entry.engine === engine),
      ),
    [vehicles, make, model, year, engine],
  );
  const engines = useMemo(
    () =>
      [...new Set(matching.map((entry) => entry.engine).filter((value): value is string => Boolean(value)))],
    [matching],
  );

  function buildNextPath(nextVehicle: ReturnType<typeof vehicleToProfile> | null): string {
    const params = new URLSearchParams(
      typeof window === "undefined" ? "" : window.location.search,
    );
    for (const key of ["make", "model", "year", "engine", "variant", "compatible"]) {
      params.delete(key);
    }
    if (nextVehicle) {
      const vehicleParams = buildVehicleQuery(nextVehicle);
      vehicleParams.forEach((value, key) => params.set(key, value));
    }
    const query = params.toString();
    return query ? `${redirectPath}?${query}` : redirectPath;
  }

  function handleConfirm() {
    if (!make || !model || !year) {
      setError("Choose a make, model, and year to continue.");
      return;
    }
    const selected = matching[0];
    if (!selected) {
      setError("That combination is not in the prepared fitment set yet.");
      return;
    }
    const profile = vehicleToProfile(selected);
    selectVehicle(profile);
    setError(null);
    router.push(buildNextPath(profile));
  }

  function handleClear() {
    clearVehicle();
    setMake("");
    setModel("");
    setYear("");
    setEngine("");
    setError(null);
    router.push(buildNextPath(null));
  }

  return (
    <section className="panel fitment-panel" aria-labelledby="fitment-heading">
      <h2 id="fitment-heading" className="panel-title">{title}</h2>
      <p className="panel-subtitle">
        Choose a prepared vehicle to see compatible parts across the catalog.
      </p>

      {vehicle ? (
        <div className="selected-vehicle" style={{ marginTop: 18 }}>
          <div>
            <strong>{vehicle.displayName}</strong>
            <span>Saved for this browser</span>
          </div>
          <Check size={18} aria-hidden="true" />
        </div>
      ) : null}

      <div className="fitment-grid">
        <div className="field">
          <label htmlFor="fitment-make">Make</label>
          <select
            id="fitment-make"
            className="select"
            value={make}
            onChange={(event) => {
              setMake(event.target.value);
              setModel("");
              setYear("");
              setEngine("");
              setError(null);
            }}
          >
            <option value="">Select make</option>
            {makes.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fitment-model">Model</label>
          <select
            id="fitment-model"
            className="select"
            value={model}
            disabled={!make}
            onChange={(event) => {
              setModel(event.target.value);
              setYear("");
              setEngine("");
              setError(null);
            }}
          >
            <option value="">Select model</option>
            {models.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fitment-year">Year</label>
          <select
            id="fitment-year"
            className="select"
            value={year}
            disabled={!model}
            onChange={(event) => {
              setYear(event.target.value);
              setEngine("");
              setError(null);
            }}
          >
            <option value="">Select year</option>
            {years.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </div>
        {engines.length > 1 ? (
          <div className="field">
            <label htmlFor="fitment-engine">Engine</label>
            <select
              id="fitment-engine"
              className="select"
              value={engine}
              onChange={(event) => setEngine(event.target.value)}
            >
              <option value="">Any engine</option>
              {engines.map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {error ? <p className="field-error" style={{ marginTop: 12 }}>{error}</p> : null}

      <div className="fitment-actions">
        <Button onClick={handleConfirm} disabled={!make || !model || !year}>
          <Check size={16} aria-hidden="true" />
          Show compatible parts
        </Button>
        {vehicle ? (
          <Button variant="ghost" onClick={handleClear}>
            <RotateCcw size={15} aria-hidden="true" />
            Clear vehicle
          </Button>
        ) : null}
      </div>
    </section>
  );
}
