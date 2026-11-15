"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useVehicleSelection } from "@/components/fitment/use-vehicle-selection";
import { EmptyState } from "@/components/catalog/empty-state";
import { CheckoutDetailsFields } from "@/components/checkout/checkout-details-fields";
import { CheckoutReview } from "@/components/checkout/checkout-review";
import { CartConflict } from "@/components/checkout/cart-conflict";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { SimulatedCardFields } from "@/components/checkout/simulated-card-fields";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CHECKOUT_KEY_STORAGE } from "@/lib/constants";
import { requestCartValidation } from "@/lib/client/cart-validation";
import type { CartItem } from "@/lib/cart/types";
import type { OrderConflictItem, PublicOrder } from "@/lib/contracts/orders";
import { toNullableString } from "@/lib/utils";
import {
  checkoutFormSchema,
  defaultCheckoutValues,
  type CheckoutFormValues,
} from "@/lib/validation/checkout";

function createCheckoutKey(): string {
  const cryptoApi = window.crypto;
  if (typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof cryptoApi.getRandomValues === "function") {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateCheckoutKey(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(CHECKOUT_KEY_STORAGE);
    if (existing) return existing;
    const next = createCheckoutKey();
    window.sessionStorage.setItem(CHECKOUT_KEY_STORAGE, next);
    return next;
  } catch {
    return createCheckoutKey();
  }
}

function clearCheckoutKey(): void {
  try {
    window.sessionStorage.removeItem(CHECKOUT_KEY_STORAGE);
  } catch {
    // Ignore storage failures; the server still enforces idempotency.
  }
}

function mapValidatedItems(items: CartItem[], response: Awaited<ReturnType<typeof requestCartValidation>>): CartItem[] {
  return items.map((item) => {
    const validated = response.items.find((entry) => entry.productId === item.productId);
    if (!validated) return item;
    return {
      ...item,
      slug: validated.slug || item.slug,
      sku: validated.sku || item.sku,
      name: validated.name || item.name,
      unitPriceCents: validated.unitPriceCents,
      availableStock: validated.availableStock,
      compatibility: validated.compatibility,
      imagePath: validated.imagePath || item.imagePath,
      imageAlt: validated.imageAlt || item.imageAlt,
    };
  });
}

export function CheckoutClient() {
  const router = useRouter();
  const { state, dispatch, clearCart, removeItem, updateQuantity } = useCart();
  const { vehicle } = useVehicleSelection();
  const keyRef = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<OrderConflictItem[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: defaultCheckoutValues,
    mode: "onBlur",
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    keyRef.current = getOrCreateCheckoutKey();
  }, []);

  async function refreshAfterConflict() {
    try {
      const response = await requestCartValidation({
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          expectedUnitPriceCents: item.unitPriceCents,
        })),
        vehicleId: vehicle?.vehicleId ? vehicle.vehicleId : null,
      });
      dispatch({
        type: "applyValidation",
        payload: {
          items: mapValidatedItems(state.items, response),
          warnings: response.warnings,
          canCheckout: response.canCheckout,
          checkedAt: new Date().toISOString(),
        },
      });
    } catch {
      // Keep the original cart and let the visitor retry.
    }
  }

  const handleFixWarnings = () => {
    for (const item of state.items) {
      if (item.availableStock <= 0) {
        removeItem(item.productId);
      } else if (item.quantity > item.availableStock) {
        updateQuantity(item.productId, item.availableStock);
      }
    }
  };

  async function submitOrder(values: CheckoutFormValues) {
    setFormError(null);
    setConflicts([]);
    setGatewayStatus(null);

    if (state.items.length === 0) {
      setFormError("Your cart is empty. Add a part before checking out.");
      return;
    }
    if (state.validation?.canCheckout === false) {
      setFormError("Resolve the stock warnings in your cart before placing the order.");
      return;
    }

    setSubmitting(true);
    try {
      // Demo card payments are authorized locally; no external payment service is contacted.
      if (values.paymentMethod === "simulated_card") {
        setGatewayStatus("Connecting to Demo Payment Gateway…");
        await new Promise((r) => setTimeout(r, 500));
        setGatewayStatus("Validating Card & Authorizing Payment…");
        await new Promise((r) => setTimeout(r, 600));
      } else {
        setGatewayStatus("Registering Cash on Delivery Order…");
        await new Promise((r) => setTimeout(r, 500));
      }

      const key = keyRef.current || getOrCreateCheckoutKey();
      keyRef.current = key;
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key,
        },
        cache: "no-store",
        body: JSON.stringify({
          customer: {
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
          },
          delivery: {
            addressLine1: values.addressLine1,
            addressLine2: toNullableString(values.addressLine2),
            city: values.city,
            postalCode: values.postalCode,
            notes: toNullableString(values.notes),
          },
          vehicleId: vehicle?.vehicleId ? vehicle.vehicleId : null,
          items: state.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            expectedUnitPriceCents: item.unitPriceCents,
          })),
          payment: { method: values.paymentMethod },
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | { order?: PublicOrder; error?: { message?: string; fields?: Record<string, string>; items?: OrderConflictItem[] } }
        | null;

      if (response.status === 201 || response.status === 200) {
        if (!body?.order) {
          setFormError("The order response was incomplete. Please try again.");
          return;
        }

        if (values.paymentMethod === "simulated_card") {
          setGatewayStatus("Payment Successful! Loading your receipt…");
          await new Promise((r) => setTimeout(r, 700));
        } else {
          setGatewayStatus("Order Placed Successfully! (Cash on Delivery Confirmed)…");
          await new Promise((r) => setTimeout(r, 700));
        }

        clearCart();
        clearCheckoutKey();
        router.push(`/orders/${body.order.reference}`);
        router.refresh();
        return;
      }

      if (response.status === 409) {
        setConflicts(body?.error?.items ?? []);
        setFormError("Review the changed items and try again.");
        await refreshAfterConflict();
        return;
      }

      if (response.status === 400 && body?.error?.fields) {
        for (const [field, message] of Object.entries(body.error.fields)) {
          const key = field.split(".").pop() as keyof CheckoutFormValues;
          if (key) setError(key, { message });
        }
        setFormError(body.error.message ?? "Please correct the highlighted fields.");
        return;
      }

      setFormError(body?.error?.message ?? "We could not place your order. Your cart is safe; please try again.");
    } catch {
      setFormError("We could not reach the store. Your cart is safe; please try again.");
    } finally {
      setSubmitting(false);
      setGatewayStatus(null);
    }
  }

  if (!state.hydrated) {
    return (
      <div className="container section">
        <Skeleton className="h-12 w-72" />
        <div style={{ height: 18 }} />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          title="Checkout needs a cart"
          message="Your cart is empty. Browse the catalog and add a part before starting checkout."
          actionLabel="Browse parts"
          actionHref="/products"
        />
      </div>
    );
  }

  const blocked = state.validation?.canCheckout === false;
  const warnings = state.validation?.warnings ?? [];

  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><LockKeyhole size={14} aria-hidden="true" /> Secure demo checkout</p>
          <h1 className="section-title">Complete your order</h1>
          <p className="section-copy">
            Enter contact and delivery details, choose a payment method, and review the final LKR total.
          </p>
        </div>
        <Link className="link-arrow" href="/cart">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to cart
        </Link>
      </div>

      {conflicts.length > 0 ? <CartConflict items={conflicts} /> : null}

      {blocked ? (
        <div className="alert alert-warning" style={{ marginBottom: 14 }}>
          <AlertTriangle size={17} aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <strong>Some items need attention before checkout:</strong>
            <div>{warnings.map((warning) => warning.message).join(" ")}</div>
            <button
              type="button"
              onClick={handleFixWarnings}
              className="link-arrow"
              style={{ marginTop: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 700 }}
            >
              Fix stock issues automatically →
            </button>
          </div>
        </div>
      ) : null}

      {formError ? (
        <div className="alert alert-danger" style={{ marginBottom: 14 }} role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      ) : null}

      {/* Local demo payment status while submitting */}
      {gatewayStatus && (
        <div
          className="alert alert-info"
          style={{
            marginBottom: 16,
            background: "#ecfdf5",
            border: "1px solid #10b981",
            color: "#065f46",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 12,
          }}
        >
          <Loader2 size={20} className="animate-spin text-emerald-600" />
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{gatewayStatus}</div>
        </div>
      )}

      <div className="checkout-layout">
        <form id="checkout-form" onSubmit={handleSubmit(submitOrder)} noValidate>
          <section className="panel checkout-card" aria-labelledby="contact-heading">
            <h2 id="contact-heading">Contact and delivery</h2>
            <CheckoutDetailsFields register={register} errors={errors} setValue={setValue} />
          </section>

          <section className="panel checkout-card" aria-labelledby="payment-heading">
            <h2 id="payment-heading">Payment</h2>
            <PaymentMethod register={register} errors={errors} />
            {paymentMethod === "simulated_card" ? (
              <SimulatedCardFields register={register} errors={errors} setValue={setValue} />
            ) : null}
          </section>
        </form>

        <aside className="checkout-aside">
          <div className="panel checkout-card">
            <h2>Order review</h2>
            <CheckoutReview items={state.items} />
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              {gatewayStatus ? (
                <div
                  className="alert alert-success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#047857",
                  }}
                >
                  {gatewayStatus.includes("Payment Successful") ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : (
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  )}
                  <span>{gatewayStatus}</span>
                </div>
              ) : null}
              <Button
                type="submit"
                form="checkout-form"
                disabled={submitting || blocked}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    <span>Processing Payment…</span>
                  </>
                ) : (
                  <>
                    <LockKeyhole size={15} aria-hidden="true" />
                    <span>Place order ({paymentMethod === "simulated_card" ? "Demo Card" : "COD"})</span>
                  </>
                )}
              </Button>
              <Link className="button button-secondary" href="/cart">Back to cart</Link>
            </div>
            {!state.validation ? (
              <p className="field-hint" style={{ marginTop: 12 }}>Checking current stock and prices…</p>
            ) : null}
            <p className="field-hint" style={{ marginTop: 12 }}>
              By placing the order, you confirm the delivery details above. No account is required.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
