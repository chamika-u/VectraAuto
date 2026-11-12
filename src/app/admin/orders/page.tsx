"use client";

import { useEffect, useState, useMemo } from "react";
import type { Order } from "@/lib/contracts/orders";
import { formatLkr } from "@/lib/money";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import type { AdminOrderStatus } from "@/server/admin/service";
import {
  Search,
  ShoppingBag,
  RefreshCw,
  Car,
  Eye,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("query", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (paymentFilter !== "all") params.set("paymentMethod", paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusUpdated = (reference: string, newStatus: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.reference === reference ? ({ ...o, status: newStatus } as unknown as Order) : o,
      ),
    );
  };

  const handleQuickStatusChange = async (
    reference: string,
    newStatus: AdminOrderStatus,
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        handleStatusUpdated(reference, newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const totalFilteredValue = useMemo(() => {
    return orders.reduce((sum, o) => {
      const status = (o.status as string) || "confirmed";
      return status !== "cancelled" ? sum + o.grandTotalCents : sum;
    }, 0);
  }, [orders]);

  const statusBadges: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-amber-100 text-amber-800 border-amber-200",
    dispatched: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Orders Management
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Track, inspect, and fulfill customer automobile parts orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Filtered Order Value</span>
            <span className="text-sm font-bold text-emerald-700">
              {formatLkr(totalFilteredValue)}
            </span>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
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
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: "all", label: "All Orders" },
            { id: "confirmed", label: "Confirmed" },
            { id: "processing", label: "Processing" },
            { id: "dispatched", label: "Dispatched" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-white text-stone-900 shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Payment filter */}
        <div className="flex items-center gap-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Payments</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="simulated_card">Simulated Card</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="search"
              placeholder="Search reference, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-stone-500">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-semibold text-stone-900">No orders match criteria</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Try clearing filters or search queries to view all recorded customer orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Vehicle Fitment</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => {
                  const status = (order.status as AdminOrderStatus) || "confirmed";

                  return (
                    <tr key={order.reference} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-stone-900">
                        {order.reference}
                        <span className="block font-sans text-[11px] font-normal text-stone-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">
                          {order.customer.fullName}
                        </span>
                        <span className="text-xs text-stone-500 block">{order.customer.phone}</span>
                        <span className="text-xs text-stone-400 block">{order.customer.email}</span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        <span className="font-medium text-stone-800 block">{order.delivery.city}</span>
                        <span className="text-stone-400 block truncate max-w-[140px]">
                          {order.delivery.addressLine1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        {order.vehicle ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-100 text-stone-700 font-medium">
                            <Car className="w-3.5 h-3.5 text-stone-500" />
                            <span className="truncate max-w-[130px]" title={order.vehicle.displayName}>
                              {order.vehicle.displayName}
                            </span>
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">None selected</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-stone-700">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                        <span className="block text-[11px] text-stone-400">
                          ({order.items.length} unique)
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">
                          {formatLkr(order.grandTotalCents)}
                        </span>
                        <span className="text-[11px] text-stone-500 uppercase block">
                          {order.payment.method === "cod" ? "COD" : "Card"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={status}
                          onChange={(e) =>
                            handleQuickStatusChange(order.reference, e.target.value as AdminOrderStatus)
                          }
                          className={`text-xs font-bold py-1 px-2 rounded-lg border focus:ring-1 focus:ring-emerald-500 focus:outline-none capitalize ${
                            statusBadges[status] || "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
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
