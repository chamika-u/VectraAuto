"use client";

import { useEffect, useState, useMemo } from "react";
import type { AdminProductItem } from "@/server/admin/service";
import { formatLkr } from "@/lib/money";
import { StockAdjuster } from "@/components/admin/stock-adjuster";
import { ProductEditModal } from "@/components/admin/product-edit-modal";
import {
  Search,
  Package,
  RefreshCw,
  Edit,
  Car,
  Star,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("query", searchQuery);
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
      if (stockFilter !== "all") params.set("stockStatus", stockFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, stockFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleStockUpdated = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentStock: newStock } : p)),
    );
  };

  const handleProductSaved = (updated: AdminProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      map.set(p.categoryId, p.categoryName);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + p.currentStock, 0);
  }, [products]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Products & Inventory
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Real-time stock adjustment, catalog pricing, and vehicle compatibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Total Units In Stock</span>
            <span className="text-sm font-bold text-emerald-700">
              {totalStockUnits.toLocaleString()} units
            </span>
          </div>
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Stock Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: "all", label: "All Stock" },
            { id: "in_stock", label: "In Stock (>5)" },
            { id: "low_stock", label: "Low Stock (1-5)" },
            { id: "out_of_stock", label: "Out of Stock (0)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStockFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                stockFilter === tab.id
                  ? "bg-white text-stone-900 shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchSubmit} className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="search"
              placeholder="Search title, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
        {products.length === 0 ? (
          <div className="p-16 text-center text-stone-500">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-semibold text-stone-900">No products found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or clear category and stock filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Fitments</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Adjust Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((product) => {
                  return (
                    <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].path}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-stone-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900 line-clamp-1">
                                {product.name}
                              </span>
                              {product.isFeatured && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <span className="font-mono text-xs text-stone-400 block">
                              SKU: {product.sku} · Part: {product.partNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-stone-700">
                        {product.categoryName}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="inline-flex items-center gap-1 text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                          <Car className="w-3 h-3 text-stone-400" />
                          <span>{product.fitmentCount} vehicles</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                        {formatLkr(product.priceCents)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                            product.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block">
                          <StockAdjuster
                            productId={product.id}
                            initialStock={product.currentStock}
                            onStockUpdated={(newStock) => handleStockUpdated(product.id, newStock)}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shadow-2xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  );
}
