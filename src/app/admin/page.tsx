"use client";

import { useEffect, useState } from "react";
import { formatLkr } from "@/lib/money";
import type { Order } from "@/lib/contracts/orders";
import type { AdminOverview } from "@/server/admin/service";
import { StatCard } from "@/components/admin/stat-card";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { StockAdjuster } from "@/components/admin/stock-adjuster";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Package,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
        setLastRefreshed(new Date());
      }
    } catch (error) {
      console.error("Failed to load admin overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleStatusUpdated = (reference: string, newStatus: string) => {
    if (!overview) return;
    setOverview({
      ...overview,
      recentOrders: overview.recentOrders.map((o) =>
        o.reference === reference ? ({ ...o, status: newStatus } as unknown as Order) : o,
      ),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Store Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">
            Real-time sales, order fulfillment, and atomic inventory tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 hidden sm:inline">
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            type="button"
            onClick={fetchOverview}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={overview ? overview.totalRevenueFormatted : "..."}
          subtext="From confirmed customer orders"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Total Orders Placed"
          value={overview ? overview.totalOrdersCount : "..."}
          subtext={
            overview
              ? `${overview.confirmedOrdersCount} confirmed · ${overview.ordersByPayment.cod || 0} COD`
              : "..."
          }
          icon={ShoppingBag}
          variant="default"
        />
        <StatCard
          title="Low Stock Alerts"
          value={overview ? overview.lowStockCount + overview.outOfStockCount : "..."}
          subtext={
            overview
              ? `${overview.outOfStockCount} out of stock · ${overview.lowStockCount} critical`
              : "..."
          }
          icon={AlertTriangle}
          variant={overview && overview.outOfStockCount > 0 ? "danger" : "warning"}
        />
        <StatCard
          title="Active Catalog SKUs"
          value={overview ? overview.activeProductsCount : "..."}
          subtext={
            overview
              ? `Across ${overview.totalCategoriesCount} categories & ${overview.totalVehiclesCount} vehicles`
              : "..."
          }
          icon={Package}
          variant="info"
        />
      </div>

      {/* Quick Actions Band */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800/80 rounded-xl text-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Quick Store Maintenance</h3>
            <p className="text-xs text-emerald-200/80">Manage atomic runtime states and retention.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            All Orders
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Adjust Stock
          </Link>
          <Link
            href="/admin/settings"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-colors"
          >
            Settings & Reset
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              <h2 className="text-lg font-bold text-stone-900">Recent Customer Orders</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>View all ({overview?.totalOrdersCount ?? 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            {overview?.recentOrders.length === 0 ? (
              <div className="p-12 text-center text-stone-500">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="font-medium">No customer orders placed yet.</p>
                <p className="text-xs text-stone-400 mt-1">
                  Place an order from the storefront checkout to see it appear here.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <span>Go to Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {overview?.recentOrders.map((order) => {
                      const status = (order.status as string) || "confirmed";
                      const statusBadges: Record<string, string> = {
                        confirmed: "bg-blue-100 text-blue-800",
                        processing: "bg-amber-100 text-amber-800",
                        dispatched: "bg-purple-100 text-purple-800",
                        delivered: "bg-emerald-100 text-emerald-800",
                        cancelled: "bg-rose-100 text-rose-800",
                      };

                      return (
                        <tr key={order.reference} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-xs text-stone-900">
                            {order.reference}
                            <span className="block text-[11px] font-normal text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-900 block">
                              {order.customer.fullName}
                            </span>
                            <span className="text-xs text-stone-500">{order.customer.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-stone-600">
                            {order.delivery.city}
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-900">
                            {formatLkr(order.grandTotalCents)}
                            <span className="block text-[11px] font-normal text-stone-500 uppercase">
                              {order.payment.method}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                                statusBadges[status] || "bg-stone-100 text-stone-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                            >
                              Inspect
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
        </div>

        {/* Right 1 col: Stock Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-900">Stock Alerts</h2>
            </div>
            <Link
              href="/admin/products?stockStatus=low_stock"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All products
            </Link>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
            {overview?.lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-stone-500">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                <p className="text-sm font-medium text-stone-800">Healthy Stock Levels</p>
                <p className="text-xs text-stone-500">No products are currently low or out of stock.</p>
              </div>
            ) : (
              overview?.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="font-mono text-stone-400">{product.sku}</span>
                      <span>·</span>
                      <span className="text-stone-600">{product.categoryName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        product.currentStock === 0
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {product.currentStock === 0 ? "Out" : `${product.currentStock} left`}
                    </span>
                    <StockAdjuster
                      productId={product.id}
                      initialStock={product.currentStock}
                      onStockUpdated={() => fetchOverview()}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
