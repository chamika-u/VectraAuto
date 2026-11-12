import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { CompatibilityBadge } from "@/components/fitment/compatibility-badge";
import { formatLkr } from "@/lib/money";
import { findOrderByReference } from "@/server/orders/repository";
import { getStore } from "@/server/storage/json-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date(value));
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await findOrderByReference(getStore(), reference);
  if (!order) notFound();

  const paymentLabel =
    order.payment.method === "cod"
      ? "Cash on Delivery — payment pending"
      : "Simulated card — demo payment, not charged";

  return (
    <div className="container section">
      <div className="confirmation-hero">
        <span className="confirmation-icon">
          <CheckCircle2 size={34} aria-hidden="true" />
        </span>
        <p className="eyebrow" style={{ justifyContent: "center" }}>Order confirmed</p>
        <h1 className="section-title">Thank you for your order</h1>
        <p className="section-copy" style={{ maxWidth: 620, margin: "0 auto" }}>
          Your reference is <strong>{order.reference}</strong>. Keep it handy if you need to contact us
          about this order. Order data is automatically removed after 30 days.
        </p>
        <div className="confirmation-meta">
          <span><PackageCheck size={15} aria-hidden="true" /> {order.items.length} line{order.items.length === 1 ? "" : "s"}</span>
          <span><Truck size={15} aria-hidden="true" /> Delivery {formatLkr(order.deliveryFeeCents)}</span>
          <span><CreditCard size={15} aria-hidden="true" /> {paymentLabel}</span>
        </div>
      </div>

      <div className="checkout-layout" style={{ marginTop: 26 }}>
        <section className="panel checkout-card" aria-labelledby="order-items-heading">
          <h2 id="order-items-heading">Items</h2>
          <div className="review-list">
            {order.items.map((item) => (
              <div className="review-item" key={item.productId}>
                <span>
                  <strong>{item.name}</strong>
                  <br />
                  <small>
                    SKU {item.sku} · {item.quantity} × {formatLkr(item.unitPriceCents)}
                  </small>
                  {item.compatibility ? (
                    <span style={{ display: "block", marginTop: 6 }}>
                      <CompatibilityBadge compatibility={item.compatibility} />
                    </span>
                  ) : null}
                </span>
                <strong>{formatLkr(item.lineTotalCents)}</strong>
              </div>
            ))}
          </div>
          <div className="summary">
            <div className="summary-row"><span>Subtotal</span><span>{formatLkr(order.subtotalCents)}</span></div>
            <div className="summary-row"><span>Delivery</span><span>{formatLkr(order.deliveryFeeCents)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{formatLkr(order.grandTotalCents)}</span></div>
          </div>
          <p className="field-hint" style={{ marginTop: 12 }}>Placed {formatDate(order.createdAt)}</p>
        </section>

        <aside className="checkout-aside">
          <div className="panel checkout-card">
            <h2><MapPin size={17} aria-hidden="true" /> Delivery</h2>
            <address style={{ fontStyle: "normal", lineHeight: 1.7, color: "var(--ink-soft)" }}>
              {order.delivery.addressLine1}
              <br />
              {order.delivery.addressLine2 ? <>{order.delivery.addressLine2}<br /></> : null}
              {order.delivery.city} {order.delivery.postalCode}
            </address>
            {order.delivery.notes ? (
              <p className="field-hint">Notes: {order.delivery.notes}</p>
            ) : null}
            {order.vehicle ? (
              <div className="alert alert-success" style={{ marginTop: 14 }}>
                <span>Vehicle: <strong>{order.vehicle.displayName}</strong></span>
              </div>
            ) : null}
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              <Link className="button button-primary" href="/products">Continue shopping</Link>
              <Link className="button button-secondary" href="/">Back home</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
