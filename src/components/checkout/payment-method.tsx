import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

export function PaymentMethod({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}) {
  return (
    <div className="payment-options" role="radiogroup" aria-label="Payment method">
      <label className="payment-option">
        <input type="radio" value="cod" {...register("paymentMethod")} />
        <span>
          <strong>Cash on Delivery</strong>
          <span>Pay the rider when your parts arrive. The order is recorded with payment pending.</span>
        </span>
      </label>
      <label className="payment-option">
        <input type="radio" value="simulated_card" {...register("paymentMethod")} />
        <span>
          <strong>Simulated card payment</strong>
          <span>Demo only. Enter test card values to preview a card checkout. No real charge is made.</span>
        </span>
      </label>
      {errors.paymentMethod ? <p className="field-error">{errors.paymentMethod.message}</p> : null}
    </div>
  );
}
