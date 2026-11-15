"use client";

import { useState } from "react";
import type { AdminProductItem } from "@/server/admin/service";
import { X, Loader2, Save } from "lucide-react";

type ProductEditModalProps = {
  product: AdminProductItem | null;
  onClose: () => void;
  onSaved?: (updated: AdminProductItem) => void;
};

export function ProductEditModal({
  product,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const [name, setName] = useState(product?.name || "");
  const [priceLkr, setPriceLkr] = useState(
    product ? (product.priceCents / 100).toString() : "0",
  );
  const [stock, setStock] = useState(product?.currentStock || 0);
  const [status, setStatus] = useState<"active" | "inactive">(
    product?.status || "active",
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    Boolean(product?.isFeatured),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!product) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const priceCents = Math.round(parseFloat(priceLkr) * 100);
    if (isNaN(priceCents) || priceCents <= 0) {
      setErrorMsg("Please enter a valid price in LKR.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          priceCents,
          stock: Math.max(0, stock),
          status,
          isFeatured,
        }),
      });

      if (res.ok) {
        onSaved?.({
          ...product,
          name: name.trim(),
          priceCents,
          currentStock: Math.max(0, stock),
          status,
          isFeatured,
        });
        onClose();
      } else {
        const data = await res.json();
        setErrorMsg(data?.error?.message || "Failed to update product.");
      }
    } catch {
      setErrorMsg("Network error saving product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-edit-modal-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 id="product-edit-modal-title" className="text-lg font-bold text-stone-900">
              Edit Product
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              SKU: {product.sku} · Part #{product.partNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Product Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Price (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">
                  LKR
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={priceLkr}
                  onChange={(e) => setPriceLkr(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Current Inventory Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium capitalize"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-stone-800">Featured Item</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
