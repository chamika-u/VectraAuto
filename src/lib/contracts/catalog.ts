import { z } from "zod";

export const compatibilitySchema = z.enum(["compatible", "incompatible", "unknown"]);
export type Compatibility = z.infer<typeof compatibilitySchema>;

export const categorySchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1).max(80),
    description: z.string().max(300),
    imagePath: z.string().nullable(),
    sortOrder: z.number().int().nonnegative(),
  })
  .strict();
export type Category = z.infer<typeof categorySchema>;

export const productImageSchema = z
  .object({
    path: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();
export type ProductImage = z.infer<typeof productImageSchema>;

export const specificationSchema = z
  .object({
    label: z.string().min(1).max(60),
    value: z.string().min(1).max(160),
  })
  .strict();
export type Specification = z.infer<typeof specificationSchema>;

export const productSchema = z
  .object({
    id: z.string().min(1),
    sku: z.string().min(3).max(40),
    partNumber: z.string().min(1).max(60),
    slug: z.string().min(1),
    name: z.string().min(1).max(140),
    shortDescription: z.string().min(1).max(200),
    description: z.string().min(1).max(4000),
    categoryId: z.string().min(1),
    priceCents: z.number().int().positive(),
    initialStock: z.number().int().nonnegative(),
    images: z.array(productImageSchema).min(1),
    specifications: z.array(specificationSchema).max(30),
    fitmentSummary: z.string().min(1).max(300),
    status: z.enum(["active", "inactive"]),
    isFeatured: z.boolean().optional(),
  })
  .strict();
export type Product = z.infer<typeof productSchema>;

export const vehicleSchema = z
  .object({
    id: z.string().min(1),
    make: z.string().min(1).max(40),
    model: z.string().min(1).max(60),
    year: z.number().int().min(1990).max(new Date().getUTCFullYear() + 1),
    engine: z.string().max(80).nullable(),
    variant: z.string().max(80).nullable(),
    displayName: z.string().min(1).max(160),
  })
  .strict();
export type Vehicle = z.infer<typeof vehicleSchema>;

export const fitmentApplicationSchema = z
  .object({
    id: z.string().min(1),
    productId: z.string().min(1),
    vehicleId: z.string().min(1),
    notes: z.string().max(300).nullable(),
  })
  .strict();
export type FitmentApplication = z.infer<typeof fitmentApplicationSchema>;

export const catalogSeedSchema = z
  .object({
    schemaVersion: z.literal(1),
    currency: z.literal("LKR"),
    deliveryFeeCents: z.number().int().nonnegative(),
    retentionDays: z.number().int().positive(),
    categories: z.array(categorySchema).min(3),
    products: z.array(productSchema).min(20),
    vehicles: z.array(vehicleSchema).min(1),
    fitmentApplications: z.array(fitmentApplicationSchema),
  })
  .strict();
export type CatalogSeed = z.infer<typeof catalogSeedSchema>;

export type VehicleProfile = {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  engine: string | null;
  variant: string | null;
  displayName: string;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  priceFormatted: string;
  imagePath: string;
  imageAlt: string;
  availability: "available" | "out_of_stock";
  availableQuantity: number;
  compatibility: Compatibility | null;
};

export type ProductDetail = ProductCard & {
  sku: string;
  partNumber: string;
  description: string;
  category: Category;
  images: ProductImage[];
  specifications: Specification[];
  fitmentSummary: string;
  fitmentApplications: {
    vehicleId: string;
    displayName: string;
    notes: string | null;
  }[];
  compatibilityNote: string | null;
};

export type EmptyState = {
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
};

export type CatalogPageData = {
  categories: Category[];
  products: ProductCard[];
  vehicleSelection: VehicleProfile | null;
  totalResults: number;
  emptyState: EmptyState | null;
};
