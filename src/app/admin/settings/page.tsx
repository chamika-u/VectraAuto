"use client";

import { useState } from "react";
import {
  RotateCcw,
  Trash2,
  Download,
  Database,
  ShieldCheck,
  Loader2,
  Clock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isReseeding, setIsReseeding] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [resetOrdersToggle, setResetOrdersToggle] = useState(false);
  const [reseedResult, setReseedResult] = useState<string | null>(null);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

  const handleReseed = async () => {
    if (resetOrdersToggle && !confirm("Are you sure? This will delete all placed customer orders and restore initial stock.")) {
      return;
    }

    setIsReseeding(true);
    setReseedResult(null);

    try {
      const res = await fetch("/api/admin/maintenance/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: resetOrdersToggle }),
      });

      if (res.ok) {
        const data = await res.json();
        setReseedResult(
          `Success: Initialized ${data.productsCount} products, ${data.vehiclesCount} vehicles, ${data.fitmentApplicationsCount} fitment rules.`,
        );
      } else {
        setReseedResult("Error: Failed to reseed catalog.");
      }
    } catch {
      setReseedResult("Network error triggering reseed.");
    } finally {
      setIsReseeding(false);
    }
  };

  const handlePurge = async () => {
    setIsPurging(true);
    setPurgeResult(null);

    try {
      const res = await fetch("/api/admin/maintenance/purge", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setPurgeResult(
          `Retention Purge complete: ${data.removedOrders} expired orders and ${data.removedIdempotency} idempotency records removed.`,
        );
      } else {
        setPurgeResult("Error executing purge.");
      }
    } catch {
      setPurgeResult("Network error triggering purge.");
    } finally {
      setIsPurging(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vectraauto-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          System Maintenance & Settings
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Configure storage directories, execute data retention purges, and reset database states.
        </p>
      </div>

      {/* System Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>JSON Atomic Storage</span>
          </div>
          <div className="space-y-2 text-xs text-stone-600">
            <p className="flex justify-between">
              <span className="text-stone-400">Runtime Store:</span>
              <span className="font-mono text-stone-800 font-semibold">data/runtime.store.json</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Catalog Seed:</span>
              <span className="font-mono text-stone-800 font-semibold">data/catalog.seed.json</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Lock Mechanism:</span>
              <span className="text-emerald-700 font-semibold">async-mutex with Atomic Rename</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Retention & Policy</span>
          </div>
          <div className="space-y-2 text-xs text-stone-600">
            <p className="flex justify-between">
              <span className="text-stone-400">Order Retention:</span>
              <span className="font-semibold text-stone-800">30 Days</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Delivery Fee:</span>
              <span className="font-semibold text-stone-800">LKR 500.00 (Flat)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Idempotency UUID:</span>
              <span className="text-emerald-700 font-semibold">Required for Orders</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Storefront Currency</span>
          </div>
          <div className="space-y-2 text-xs text-stone-600">
            <p className="flex justify-between">
              <span className="text-stone-400">ISO Code:</span>
              <span className="font-bold text-stone-800">LKR (Sri Lankan Rupee)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Payment Simulation:</span>
              <span className="font-semibold text-stone-800">Enabled (Demo Cards)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-400">Cash on Delivery:</span>
              <span className="text-emerald-700 font-semibold">Active & Supported</span>
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Actions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Administrative Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reseed Database Box */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Reseed / Initialize Database</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Re-synchronizes product stock and categories with the seed catalog.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={resetOrdersToggle}
                  onChange={(e) => setResetOrdersToggle(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <span>Also wipe all orders and reset runtime store completely (--reset)</span>
              </label>
            </div>

            {reseedResult && (
              <div
                className={`p-3 text-xs rounded-xl ${
                  reseedResult.startsWith("Success")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {reseedResult}
              </div>
            )}

            <button
              type="button"
              onClick={handleReseed}
              disabled={isReseeding}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
            >
              {isReseeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              <span>Execute Database Reseed</span>
            </button>
          </div>

          {/* Purge Retention Box */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Purge Expired Orders</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Deletes completed orders older than 30 days and clears stale idempotency keys.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              Orders past their retention period will be permanently cleaned up from the runtime store.
            </div>

            {purgeResult && (
              <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                {purgeResult}
              </div>
            )}

            <button
              type="button"
              onClick={handlePurge}
              disabled={isPurging}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-stone-800 hover:bg-stone-900 text-white transition-colors shadow-xs"
            >
              {isPurging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>Run Retention Purge Now</span>
            </button>
          </div>
        </div>

        {/* Export Data Backup */}
        <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Export Store Data Backup</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Download a JSON snapshot of the overview metrics and recent orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
