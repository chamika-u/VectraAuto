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
          <span>Pay the rider in cash when your parts are delivered. Your order has been confirmed with payment pending.</span>
        </span>
      </label>
      <label className="payment-option">
        <input type="radio" value="simulated_card" {...register("paymentMethod")} />
        <span>
          <strong>Credit / Debit Card</strong>
          <span>Pay securely online with your Visa or MasterCard.</span>
        </span>
      </label>
      {errors.paymentMethod ? <p className="field-error">{errors.paymentMethod.message}</p> : null}
    </div>
  );
}
