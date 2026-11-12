import { z } from "zod";
import { paymentMethodSchema } from "../contracts/orders";

export function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

export function isFutureExpiry(value: string, now = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (year > now.getUTCFullYear() + 20) return false;
  return year > now.getUTCFullYear() || (year === now.getUTCFullYear() && month >= now.getUTCMonth() + 1);
}

export const checkoutFormSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100),
    phone: z
      .string()
      .trim()
      .regex(/^(?:\+94|0)(?:7\d{8}|[1-9]\d{8})$/, "Enter a valid Sri Lankan phone number."),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    addressLine1: z.string().trim().min(3, "Enter your delivery address.").max(160),
    addressLine2: z.string().trim().max(160),
    city: z.string().trim().min(2, "Enter your city.").max(80),
    postalCode: z.string().trim().regex(/^\d{5}$/, "Postal code must be 5 digits."),
    notes: z.string().trim().max(500),
    paymentMethod: paymentMethodSchema,
    cardNumber: z.string().trim(),
    cardExpiry: z.string().trim(),
    cardCvc: z.string().trim(),
  })
  .superRefine((value, context) => {
    if (value.paymentMethod !== "simulated_card") return;
    if (!luhnCheck(value.cardNumber)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message: "Enter a valid demo card number.",
      });
    }
    if (!isFutureExpiry(value.cardExpiry)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardExpiry"],
        message: "Enter a future expiry as MM/YY.",
      });
    }
    if (!/^\d{3,4}$/.test(value.cardCvc)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardCvc"],
        message: "Enter a 3 or 4 digit CVC.",
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const defaultCheckoutValues: CheckoutFormValues = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  notes: "",
  paymentMethod: "cod",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};
