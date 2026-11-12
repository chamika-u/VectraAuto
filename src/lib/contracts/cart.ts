import { z } from "zod";
import { compatibilitySchema } from "./catalog";

export const cartValidationItemSchema = z
  .object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
    expectedUnitPriceCents: z.number().int().positive().optional(),
  })
  .strict();

export const cartValidationRequestSchema = z
  .object({
    items: z.array(cartValidationItemSchema).min(1).max(50),
    vehicleId: z.string().min(1).nullable().optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const seen = new Set<string>();
    value.items.forEach((item, index) => {
      if (seen.has(item.productId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items", index, "productId"],
          message: "Duplicate product IDs are not allowed.",
        });
      }
      seen.add(item.productId);
    });
  });

export type CartValidationRequest = z.infer<typeof cartValidationRequestSchema>;

export const cartWarningCodeSchema = z.enum([
  "PRICE_CHANGED",
  "OUT_OF_STOCK",
  "INSUFFICIENT_STOCK",
  "PRODUCT_UNAVAILABLE",
  "FITMENT_INCOMPATIBLE",
  "FITMENT_UNKNOWN",
]);
export type CartWarningCode = z.infer<typeof cartWarningCodeSchema>;

export type CartWarning = {
  code: CartWarningCode;
  productId: string | null;
  message: string;
};

export type CartValidationItem = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  availableStock: number;
  availability: "available" | "out_of_stock" | "insufficient_stock";
  priceChanged: boolean;
  compatibility: z.infer<typeof compatibilitySchema> | null;
  imagePath: string;
  imageAlt: string;
};

export type CartValidationResponse = {
  items: CartValidationItem[];
  subtotalCents: number;
  deliveryFeeCents: number;
  grandTotalCents: number;
  warnings: CartWarning[];
  canCheckout: boolean;
};
