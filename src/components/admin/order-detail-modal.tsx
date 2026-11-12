"use client";

import { useState } from "react";
import type { Order } from "@/lib/contracts/orders";
import { formatLkr } from "@/lib/money";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Package,
  CreditCard,
  Loader2,
} from "lucide-react";
import type { AdminOrderStatus } from "@/server/admin/service";

type OrderDetailModalProps = {
  order: Order | null;
  onClose: () => void;
  onStatusUpdated?: (reference: string, newStatus: AdminOrderStatus) => void;
};

export function OrderDetailModal({
  order,
  onClose,
  onStatusUpdated,
}: OrderDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<AdminOrderStatus>(
    (order?.status as AdminOrderStatus) || "confirmed",
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!order) return null;

  const handleStatusChange = async (newStatus: AdminOrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setCurrentStatus(newStatus);
        setToastMsg(`Order marked as ${newStatus}`);
        setTimeout(() => setToastMsg(null), 3000);
        onStatusUpdated?.(order.reference, newStatus);
      } else {
        setToastMsg("Failed to update status");
      }
    } catch {
      setToastMsg("Network error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors: Record<AdminOrderStatus, string> = {
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-amber-100 text-amber-800 border-amber-200",
    dispatched: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/95 backdrop-blur-md border-b border-stone-200">
          <div>
            <div className="flex items-center gap-3">
              <h2 id="order-modal-title" className="text-xl font-bold text-stone-900">
                Order {order.reference}
              </h2>
              <span
                className={`px-3 py-0.5 text-xs font-semibold rounded-full border capitalize ${statusColors[currentStatus]}`}
              >
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()} · ID: {order.id.slice(0, 8)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status changer bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Fulfillment Status
              </p>
              <p className="text-sm text-stone-800">Change current processing stage:</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as AdminOrderStatus)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-stone-300 text-stone-800 shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {isUpdating && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />}
              {toastMsg && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {toastMsg}
                </span>
              )}
            </div>
          </div>

          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                <User className="w-4 h-4 text-stone-500" />
                <span>Customer Contact</span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                <p className="flex items-center gap-2 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`tel:${order.customer.phone}`} className="hover:underline text-emerald-700">
                    {order.customer.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2 text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`mailto:${order.customer.email}`} className="hover:underline text-emerald-700">
                    {order.customer.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                <MapPin className="w-4 h-4 text-stone-500" />
                <span>Delivery Destination</span>
              </div>
              <div className="space-y-1 text-sm text-stone-700">
                <p>{order.delivery.addressLine1}</p>
                {order.delivery.addressLine2 && <p>{order.delivery.addressLine2}</p>}
                <p className="font-medium text-stone-900">
                  {order.delivery.city}, {order.delivery.postalCode}
                </p>
                {order.delivery.notes && (
                  <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="font-semibold">Note:</span> {order.delivery.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Snapshot */}
          {order.vehicle && (
            <div className="p-4 rounded-xl border border-stone-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2">
                <Car className="w-4 h-4 text-emerald-700" />
                <span>Selected Fitment Vehicle</span>
              </div>
              <p className="text-sm font-bold text-emerald-950">{order.vehicle.displayName}</p>
              <p className="text-xs text-stone-600 mt-0.5">
                {order.vehicle.year} · {order.vehicle.make} {order.vehicle.model}
                {order.vehicle.engine ? ` · Engine: ${order.vehicle.engine}` : ""}
                {order.vehicle.variant ? ` · Variant: ${order.vehicle.variant}` : ""}
              </p>
            </div>
          )}

          {/* Itemized Order Table */}
          <div>
            <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
              <Package className="w-4 h-4 text-stone-500" />
              <span>Purchased Line Items ({order.items.length})</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">SKU / Part #</th>
                    <th className="py-2.5 px-3 text-center">Fitment</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item, idx) => (
                    <tr key={`${item.productId}-${idx}`} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-medium text-stone-900">{item.name}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-stone-600">
                        {item.sku}
                        <br />
                        <span className="text-stone-400">{item.partNumber}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.compatibility === "compatible" ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            Fit
                          </span>
                        ) : item.compatibility === "incompatible" ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
                            No Fit
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-600">
                            Universal
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right text-stone-700">
                        {formatLkr(item.unitPriceCents)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-stone-800">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-stone-900">
                        {formatLkr(item.lineTotalCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-1">
                <CreditCard className="w-4 h-4 text-stone-500" />
                <span>Payment Method</span>
              </div>
              <p className="text-sm font-semibold capitalize text-stone-900">
                {order.payment.method === "cod" ? "Cash on Delivery (COD)" : "Simulated Credit Card"}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">Status: {order.payment.status}</p>
            </div>

            <div className="w-full md:w-64 space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>{formatLkr(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Standard Delivery:</span>
                <span>{formatLkr(order.deliveryFeeCents)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-300 font-bold text-base text-stone-900">
                <span>Grand Total:</span>
                <span className="text-emerald-700">{formatLkr(order.grandTotalCents)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
