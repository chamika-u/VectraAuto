import { z } from "zod";
import { compatibilitySchema } from "./catalog";

export const customerContactSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .regex(/^(?:\+94|0)(?:7\d{8}|[1-9]\d{8})$/, "Enter a valid Sri Lankan phone number."),
    email: z.string().trim().email().max(254),
  })
  .strict();

export const deliveryDetailsSchema = z
  .object({
    addressLine1: z.string().trim().min(3).max(160),
    addressLine2: z.string().trim().max(160).nullable(),
    city: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().regex(/^\d{5}$/, "Postal code must be 5 digits."),
    notes: z.string().trim().max(500).nullable(),
  })
  .strict();

export const orderItemInputSchema = z
  .object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
    expectedUnitPriceCents: z.number().int().positive().optional(),
  })
  .strict();

export const paymentMethodSchema = z.enum(["cod", "simulated_card"]);

export const orderRequestSchema = z
  .object({
    customer: customerContactSchema,
    delivery: deliveryDetailsSchema,
    vehicleId: z.string().min(1).nullable(),
    items: z.array(orderItemInputSchema).min(1).max(50),
    payment: z
      .object({
        method: paymentMethodSchema,
      })
      .strict(),
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

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export const idempotencyKeySchema = z.string().uuid();

export type CustomerContact = z.infer<typeof customerContactSchema>;
export type DeliveryDetails = z.infer<typeof deliveryDetailsSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type PaymentSummary = {
  method: PaymentMethod;
  status: "cod_pending" | "simulated_demo";
  cardDataStored: false;
};

export type VehicleSnapshot = {
  vehicleId: string;
  displayName: string;
  make: string;
  model: string;
  year: number;
  engine: string | null;
  variant: string | null;
};

export type OrderItem = {
  productId: string;
  sku: string;
  partNumber: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  compatibility: z.infer<typeof compatibilitySchema> | null;
};

export type Order = {
  id: string;
  reference: string;
  idempotencyKey: string;
  customer: CustomerContact;
  delivery: DeliveryDetails;
  vehicle: VehicleSnapshot | null;
  items: OrderItem[];
  subtotalCents: number;
  deliveryFeeCents: number;
  grandTotalCents: number;
  payment: PaymentSummary;
  status: "confirmed";
  createdAt: string;
  expiresAt: string;
};

export type PublicOrder = Omit<Order, "id" | "idempotencyKey" | "customer" | "expiresAt">;

export type OrderConflictReason =
  | "PRICE_CHANGED"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "PRODUCT_UNAVAILABLE";

export type OrderConflictItem = {
  productId: string;
  reason: OrderConflictReason;
  currentUnitPriceCents: number | null;
  availableStock: number | null;
};

export type OrderConflict = {
  code: "CART_CONFLICT";
  message: string;
  items: OrderConflictItem[];
};

export type OrderSuccessResponse = {
  order: PublicOrder;
};

export type IdempotencyRecord = {
  key: string;
  orderId: string;
  createdAt: string;
  expiresAt: string;
};

export type RuntimeStore = {
  schemaVersion: 1;
  inventory: Record<string, number>;
  orders: Order[];
  idempotency: IdempotencyRecord[];
};
