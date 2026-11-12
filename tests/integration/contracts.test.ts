import { describe, expect, it } from "vitest";
import {
  catalogSeedSchema,
  categorySchema,
  productSchema,
  vehicleSchema,
} from "@/lib/contracts/catalog";
import { orderRequestSchema, customerContactSchema, deliveryDetailsSchema } from "@/lib/contracts/orders";
import { cartValidationRequestSchema } from "@/lib/contracts/cart";

describe("data contract validation schemas", () => {
  it("validates valid customer contact", () => {
    const contact = {
      fullName: "Kasun Perera",
      phone: "0771234567",
      email: "kasun@example.com",
    };
    const parsed = customerContactSchema.safeParse(contact);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid Sri Lankan phone number", () => {
    const contact = {
      fullName: "Kasun Perera",
      phone: "12345",
      email: "kasun@example.com",
    };
    const parsed = customerContactSchema.safeParse(contact);
    expect(parsed.success).toBe(false);
  });

  it("validates delivery details with 5 digit postal code", () => {
    const delivery = {
      addressLine1: "123 Galle Road",
      addressLine2: null,
      city: "Colombo",
      postalCode: "00300",
      notes: "Leave with security",
    };
    const parsed = deliveryDetailsSchema.safeParse(delivery);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid postal code", () => {
    const delivery = {
      addressLine1: "123 Galle Road",
      addressLine2: null,
      city: "Colombo",
      postalCode: "ABC",
      notes: null,
    };
    const parsed = deliveryDetailsSchema.safeParse(delivery);
    expect(parsed.success).toBe(false);
  });

  it("validates cart validation request without duplicates", () => {
    const req = {
      items: [
        { productId: "prod_1", quantity: 2 },
        { productId: "prod_2", quantity: 1 },
      ],
      vehicleId: null,
    };
    const parsed = cartValidationRequestSchema.safeParse(req);
    expect(parsed.success).toBe(true);
  });

  it("rejects duplicate product IDs in cart validation request", () => {
    const req = {
      items: [
        { productId: "prod_1", quantity: 2 },
        { productId: "prod_1", quantity: 1 },
      ],
      vehicleId: null,
    };
    const parsed = cartValidationRequestSchema.safeParse(req);
    expect(parsed.success).toBe(false);
  });
});
