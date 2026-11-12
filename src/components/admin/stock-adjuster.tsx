"use client";

import { useState } from "react";
import { Plus, Minus, Check, Loader2 } from "lucide-react";

type StockAdjusterProps = {
  productId: string;
  initialStock: number;
  onStockUpdated?: (newStock: number) => void;
};

export function StockAdjuster({
  productId,
  initialStock,
  onStockUpdated,
}: StockAdjusterProps) {
  const [stock, setStock] = useState(initialStock);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const updateStock = async (newQuantity: number) => {
    const validated = Math.max(0, newQuantity);
    setStock(validated);
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: validated }),
      });

      if (res.ok) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        onStockUpdated?.(validated);
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
      <button
        type="button"
        onClick={() => updateStock(stock - 1)}
        disabled={stock <= 0 || isUpdating}
        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors"
        title="Decrease stock by 1"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        value={stock}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) setStock(Math.max(0, val));
        }}
        onBlur={() => updateStock(stock)}
        className="w-12 text-center text-sm font-semibold text-stone-900 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
      />

      <button
        type="button"
        onClick={() => updateStock(stock + 1)}
        disabled={isUpdating}
        className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors"
        title="Increase stock by 1"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {isUpdating && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin ml-1" />}
      {showSaved && <Check className="w-4 h-4 text-emerald-600 ml-1" />}
    </div>
  );
}
