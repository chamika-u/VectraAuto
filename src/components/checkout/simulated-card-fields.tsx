import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

export function SimulatedCardFields({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  setValue?: UseFormSetValue<CheckoutFormValues>;
}) {
  return (
    <div className="card-fields" style={{ marginTop: 14 }}>
      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="•••• •••• •••• ••••"
            aria-invalid={Boolean(errors.cardNumber)}
            aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
            {...register("cardNumber")}
          />
          <span id="cardNumber-error">
            {errors.cardNumber ? <p className="field-error">{errors.cardNumber.message}</p> : null}
          </span>
        </div>
        <div className="field">
          <label htmlFor="cardExpiry">Expiry (MM/YY)</label>
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
          <span id="cardExpiry-error">
            {errors.cardExpiry ? <p className="field-error">{errors.cardExpiry.message}</p> : null}
          </span>
        </div>
        <div className="field">
          <label htmlFor="cardCvc">CVC Code</label>
          <input
            id="cardCvc"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="CVC"
            aria-invalid={Boolean(errors.cardCvc)}
            aria-describedby={errors.cardCvc ? "cardCvc-error" : undefined}
            {...register("cardCvc")}
          />
          <span id="cardCvc-error">
            {errors.cardCvc ? <p className="field-error">{errors.cardCvc.message}</p> : null}
          </span>
        </div>
      </div>
    </div>
  );
}
