"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Receipt,
  ShieldCheck,
  Truck,
  AlertCircle,
} from "lucide-react";
import { CompatibilityBadge } from "@/components/fitment/compatibility-badge";
import { formatLkr } from "@/lib/money";
import type { PublicOrder } from "@/lib/contracts/orders";

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-LK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Colombo",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function OrderConfirmationView({
  initialOrder,
  reference,
}: {
  initialOrder: PublicOrder | null;
  reference: string;
}) {
  const [order, setOrder] = useState<PublicOrder | null>(initialOrder);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    if (!order && typeof window !== "undefined") {
      try {
        const stored =
          sessionStorage.getItem(`vectra_order_${reference}`) ||
          localStorage.getItem(`vectra_order_${reference}`) ||
          sessionStorage.getItem("vectra_last_order") ||
          localStorage.getItem("vectra_last_order");

        if (stored) {
          const parsed = JSON.parse(stored) as PublicOrder;
          if (parsed && (!parsed.reference || parsed.reference === reference)) {
            setOrder(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to read cached order from browser storage", e);
      }
      setCheckedStorage(true);
    } else {
      setCheckedStorage(true);
    }
  }, [order, reference]);

  if (!order) {
    if (!checkedStorage) {
      return (
        <div className="container section" style={{ textAlign: "center", padding: "80px 20px" }}>
          <p className="section-copy">Loading your order confirmation…</p>
        </div>
      );
    }

    return (
      <div className="container section" style={{ maxWidth: 600, textAlign: "center", margin: "60px auto" }}>
        <div className="panel checkout-card" style={{ padding: "40px 24px" }}>
          <span
            style={{
              display: "inline-flex",
              padding: 16,
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#dc2626",
              marginBottom: 16,
            }}
          >
            <AlertCircle size={36} aria-hidden="true" />
          </span>
          <h1 className="section-title" style={{ fontSize: "1.4rem", marginBottom: 10 }}>
            Order Reference Not Found
          </h1>
          <p className="section-copy" style={{ marginBottom: 20 }}>
            We could not find order details for reference <strong>{reference}</strong>. If you recently placed this order, your confirmation details might be associated with a different browser session.
          </p>
          <div style={{ display: "grid", gap: 10, maxWidth: 300, margin: "0 auto" }}>
            <Link className="button button-primary" href="/products">
              Continue shopping
            </Link>
            <Link className="button button-secondary" href="/">
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const o = order;
  const isCardPaid = o.payment.method === "simulated_card";

  return (
    <div className="container section">
      <div className="confirmation-hero">
        <span
          className="confirmation-icon"
          style={{
            background: isCardPaid ? "rgba(16, 185, 129, 0.15)" : "var(--accent-soft)",
            color: isCardPaid ? "#059669" : "var(--accent-strong)",
            boxShadow: isCardPaid
              ? "0 12px 30px rgba(16, 185, 129, 0.22)"
              : "0 12px 30px rgba(27, 100, 84, 0.14)",
          }}
        >
          {isCardPaid ? (
            <BadgeCheck size={40} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={36} aria-hidden="true" />
          )}
        </span>

        {isCardPaid ? (
          <>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(16, 185, 129, 0.14)",
                  color: "#047857",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Payment Successful
              </span>
            </div>
            <h1 className="section-title" style={{ color: "#065f46" }}>
              Payment Successful!
            </h1>
            <p className="section-copy" style={{ maxWidth: 620, margin: "0 auto" }}>
              Your payment has been successfully authorized and confirmed via the Demo Payment Gateway.
              Your order reference is <strong>{o.reference}</strong>.
            </p>
          </>
        ) : (
          <>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(16, 185, 129, 0.14)",
                  color: "#047857",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                <Truck size={16} aria-hidden="true" />
                Cash on Delivery Confirmed
              </span>
            </div>
            <h1 className="section-title" style={{ color: "#065f46" }}>
              COD Order Confirmed!
            </h1>
            <p className="section-copy" style={{ maxWidth: 620, margin: "0 auto" }}>
              Your Cash on Delivery order has been successfully placed and registered. Your items are
              being prepared for delivery. Your order reference is <strong>{o.reference}</strong>.
            </p>
          </>
        )}

        {/* Highlighted Payment Confirmation Box */}
        <div
          style={{
            maxWidth: 640,
            margin: "24px auto 0",
            padding: "16px 20px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid rgba(16, 185, 129, 0.35)",
            background: "rgba(16, 185, 129, 0.05)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 14,
            textAlign: "left",
          }}
        >
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>
              {isCardPaid ? "Payment Status" : "Order Status"}
            </div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#059669", display: "flex", alignItems: "center", gap: 5 }}>
              <CheckCircle2 size={16} />
              {isCardPaid ? "PAID (SUCCESS)" : "CONFIRMED (COD)"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>
              {isCardPaid ? "Total Paid" : "Pay on Delivery"}
            </div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--ink)" }}>
              {formatLkr(o.grandTotalCents)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>
              Payment Method
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
              {isCardPaid ? "Demo Card (Instant)" : "Cash on Delivery"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>
              Placed At
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--ink-soft)" }}>
              {formatDate(o.createdAt)}
            </div>
          </div>
        </div>

        {!isCardPaid ? (
          <div
            style={{
              maxWidth: 640,
              margin: "18px auto 0",
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1.5px solid rgba(16, 185, 129, 0.3)",
              color: "#065f46",
              textAlign: "left",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "0.95rem", marginBottom: 6 }}>
              <Truck size={18} aria-hidden="true" />
              <span>Cash on Delivery (COD) Confirmation</span>
            </div>
            <p style={{ margin: "0 0 8px", color: "var(--ink-soft)" }}>
              Your order is now being processed by VectraAuto. You do not need to make any payment online.
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, color: "var(--ink)" }}>
              <li><strong>Amount to pay:</strong> {formatLkr(o.grandTotalCents)} in cash to the delivery courier upon arrival.</li>
              <li><strong>Delivery destination:</strong> {o.delivery.addressLine1}, {o.delivery.city}.</li>
              <li><strong>Phone verification:</strong> The courier will call your provided contact number before arrival.</li>
            </ul>
          </div>
        ) : null}

        <div className="confirmation-meta" style={{ marginTop: 20 }}>
          <span><PackageCheck size={15} aria-hidden="true" /> {o.items.length} line{o.items.length === 1 ? "" : "s"}</span>
          <span><Truck size={15} aria-hidden="true" /> {o.deliveryFeeCents > 0 ? `Delivery ${formatLkr(o.deliveryFeeCents)}` : "Free Delivery"}</span>
          <span><Receipt size={15} aria-hidden="true" /> Ref: {o.reference}</span>
        </div>
      </div>

      <div className="checkout-layout" style={{ marginTop: 26 }}>
        <section className="panel checkout-card" aria-labelledby="order-items-heading">
          <h2 id="order-items-heading">Items</h2>
          <div className="review-list">
            {o.items.map((item) => (
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
            <div className="summary-row"><span>Subtotal</span><span>{formatLkr(o.subtotalCents)}</span></div>
            <div className="summary-row"><span>Delivery</span><span style={o.deliveryFeeCents === 0 ? { color: "#059669", fontWeight: 700 } : undefined}>{o.deliveryFeeCents > 0 ? formatLkr(o.deliveryFeeCents) : "FREE"}</span></div>
            <div className="summary-row total"><span>Total</span><span>{formatLkr(o.grandTotalCents)}</span></div>
          </div>
          <p className="field-hint" style={{ marginTop: 12 }}>Placed {formatDate(o.createdAt)}</p>
        </section>

        <aside className="checkout-aside">
          <div className="panel checkout-card">
            <h2><MapPin size={17} aria-hidden="true" /> Delivery</h2>
            <address style={{ fontStyle: "normal", lineHeight: 1.7, color: "var(--ink-soft)" }}>
              {o.delivery.addressLine1}
              <br />
              {o.delivery.addressLine2 ? <>{o.delivery.addressLine2}<br /></> : null}
              {o.delivery.city} {o.delivery.postalCode}
            </address>
            {o.delivery.notes ? (
              <p className="field-hint">Notes: {o.delivery.notes}</p>
            ) : null}
            <div className="alert alert-success" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
              {isCardPaid ? <ShieldCheck size={16} aria-hidden="true" /> : <Truck size={16} aria-hidden="true" />}
              <span>
                <strong>{isCardPaid ? "Payment:" : "Order Mode:"}</strong>{" "}
                {isCardPaid ? "Paid in full (Demo Gateway)" : "Cash on Delivery (Pay upon arrival)"}
              </span>
            </div>
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
