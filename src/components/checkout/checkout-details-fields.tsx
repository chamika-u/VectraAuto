import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CheckoutFormValues } from "@/lib/validation/checkout";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export function CheckoutDetailsFields({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}) {
  return (
    <div className="form-grid">
      <div className="field field-full">
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          className="input"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          {...register("fullName")}
        />
        <span id="fullName-error"><FieldError message={errors.fullName?.message} /></span>
      </div>
      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          className="input"
          type="tel"
          autoComplete="tel"
          placeholder="0712345678"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
        />
        <span id="phone-error"><FieldError message={errors.phone?.message} /></span>
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        <span id="email-error"><FieldError message={errors.email?.message} /></span>
      </div>
      <div className="field field-full">
        <label htmlFor="addressLine1">Delivery address</label>
        <input
          id="addressLine1"
          className="input"
          autoComplete="address-line1"
          aria-invalid={Boolean(errors.addressLine1)}
          aria-describedby={errors.addressLine1 ? "addressLine1-error" : undefined}
          {...register("addressLine1")}
        />
        <span id="addressLine1-error"><FieldError message={errors.addressLine1?.message} /></span>
      </div>
      <div className="field field-full">
        <label htmlFor="addressLine2">Address line 2 <span className="field-hint">(optional)</span></label>
        <input
          id="addressLine2"
          className="input"
          autoComplete="address-line2"
          {...register("addressLine2")}
        />
      </div>
      <div className="field">
        <label htmlFor="city">City</label>
        <input
          id="city"
          className="input"
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? "city-error" : undefined}
          {...register("city")}
        />
        <span id="city-error"><FieldError message={errors.city?.message} /></span>
      </div>
      <div className="field">
        <label htmlFor="postalCode">Postal code</label>
        <input
          id="postalCode"
          className="input"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00300"
          aria-invalid={Boolean(errors.postalCode)}
          aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
          {...register("postalCode")}
        />
        <span id="postalCode-error"><FieldError message={errors.postalCode?.message} /></span>
      </div>
      <div className="field field-full">
        <label htmlFor="notes">Delivery notes <span className="field-hint">(optional)</span></label>
        <textarea
          id="notes"
          className="textarea"
          placeholder="Gate code, landmark, or a preferred call time"
          {...register("notes")}
        />
      </div>
    </div>
  );
}
