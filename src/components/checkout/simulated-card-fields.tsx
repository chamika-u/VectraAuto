import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

export function SimulatedCardFields({
  register,
  errors,
  setValue,
}: {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  setValue?: UseFormSetValue<CheckoutFormValues>;
}) {
  const handleAutoFill = () => {
    if (!setValue) return;
    setValue("cardNumber", "4242 4242 4242 4242", { shouldValidate: true, shouldDirty: true });
    setValue("cardExpiry", "12/29", { shouldValidate: true, shouldDirty: true });
    setValue("cardCvc", "123", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="card-fields" style={{ marginTop: 14 }}>
      {/* Local demo payment banner */}
      <div className="alert alert-info" style={{ marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <ShieldCheck size={20} className="shrink-0 text-emerald-700" style={{ marginTop: 2 }} aria-hidden="true" />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <strong>Secure Local Demo Payment</strong>
            {setValue && (
              <button
                type="button"
                onClick={handleAutoFill}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: 8,
                  background: "#064e3b",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Sparkles size={13} />
                <span>Auto-fill Demo Card</span>
              </button>
            )}
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--ink-soft)" }}>
            Card details are verified locally for testing and never sent to a payment provider. Click{" "}
            <strong>Auto-fill Demo Card</strong> or enter{" "}
            <code>4242 4242 4242 4242</code>, expiry <code>12/29</code>, CVC <code>123</code>.
          </p>
        </div>
      </div>

      {/* Visual Demo Card Preview */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          padding: "16px 20px",
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#94a3b8" }}>
            <CreditCard size={16} />
            <span>VectraAuto Demo Payment</span>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: 1, color: "#38bdf8" }}>VISA DEMO</span>
        </div>
        <div style={{ fontSize: "1.15rem", fontFamily: "monospace", letterSpacing: "2px", fontWeight: 600 }}>
          4242 •••• •••• 4242
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#cbd5e1" }}>
          <span>EXP: 12/29</span>
          <span>CVC: 123</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#4ade80", fontWeight: 700 }}>
            <CheckCircle2 size={13} /> Verified
          </span>
        </div>
      </div>

      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="cardNumber">Demo Card Number</label>
          <input
            id="cardNumber"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="4242 4242 4242 4242"
            aria-invalid={Boolean(errors.cardNumber)}
            aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
            {...register("cardNumber")}
          />
          <span id="cardNumber-error">{errors.cardNumber ? <p className="field-error">{errors.cardNumber.message}</p> : null}</span>
        </div>
        <div className="field">
          <label htmlFor="cardExpiry">Expiry (MM/YY)</label>
          <input
            id="cardExpiry"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="12/29"
            aria-invalid={Boolean(errors.cardExpiry)}
            aria-describedby={errors.cardExpiry ? "cardExpiry-error" : undefined}
            {...register("cardExpiry")}
          />
          <span id="cardExpiry-error">{errors.cardExpiry ? <p className="field-error">{errors.cardExpiry.message}</p> : null}</span>
        </div>
        <div className="field">
          <label htmlFor="cardCvc">CVC Code</label>
          <input
            id="cardCvc"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="123"
            aria-invalid={Boolean(errors.cardCvc)}
            aria-describedby={errors.cardCvc ? "cardCvc-error" : undefined}
            {...register("cardCvc")}
          />
          <span id="cardCvc-error">{errors.cardCvc ? <p className="field-error">{errors.cardCvc.message}</p> : null}</span>
        </div>
      </div>
    </div>
  );
}
