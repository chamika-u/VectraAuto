import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

export function SimulatedCardFields({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}) {
  return (
    <div className="card-fields">
      <div className="alert alert-info" style={{ marginBottom: 14 }}>
        <ShieldCheck size={17} aria-hidden="true" />
        <span>
          <strong>Demo payment only.</strong> Card values are validated in this browser, never sent
          to the server, and never stored. Use <code>4242 4242 4242 4242</code>, any future expiry,
          and any 3 or 4 digit CVC.
        </span>
      </div>
      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="cardNumber">Demo card number</label>
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
          <label htmlFor="cardExpiry">Expiry</label>
          <input
            id="cardExpiry"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="MM/YY"
            aria-invalid={Boolean(errors.cardExpiry)}
            aria-describedby={errors.cardExpiry ? "cardExpiry-error" : undefined}
            {...register("cardExpiry")}
          />
          <span id="cardExpiry-error">{errors.cardExpiry ? <p className="field-error">{errors.cardExpiry.message}</p> : null}</span>
        </div>
        <div className="field">
          <label htmlFor="cardCvc">CVC</label>
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
