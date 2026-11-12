"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/lib/contracts/catalog";
import Link from "next/link";
import { Search, Car, ExternalLink, RefreshCw } from "lucide-react";

type VehicleWithCount = Vehicle & { applicationsCount: number };

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);

      const res = await fetch(`/api/admin/vehicles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Vehicles & Fitment Rules
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Registered vehicle models and their associated compatible automobile parts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500">
            {vehicles.length} vehicle models registered
          </span>
          <button
            type="button"
            onClick={fetchVehicles}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="search"
            placeholder="Search make, model, or year (e.g. Toyota, Civic, 2018)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800">
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{v.year}</span>
                </span>
                <span className="text-xs font-mono font-medium text-stone-400">{v.id}</span>
              </div>

              <h3 className="font-bold text-base text-stone-900">{v.displayName}</h3>
              <p className="text-xs text-stone-500 mt-1">
                {v.make} · {v.model}
                {v.engine ? ` · Engine: ${v.engine}` : ""}
                {v.variant ? ` · Variant: ${v.variant}` : ""}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">
                {v.applicationsCount} compatible parts
              </span>

              <Link
                href={`/products?vehicle=${v.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>View in Store</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
