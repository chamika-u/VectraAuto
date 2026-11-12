import path from "node:path";

export type AppSettings = {
  dataDir: string;
  catalogPath: string;
  runtimePath: string;
  deliveryFeeCents: number;
  retentionDays: number;
};

export function getSettings(): AppSettings {
  const dataDir = process.env.VECTRA_DATA_DIR
    ? path.resolve(process.env.VECTRA_DATA_DIR)
    : path.join(process.cwd(), "data");

  return {
    dataDir,
    catalogPath:
      process.env.VECTRA_CATALOG_PATH ?? path.join(dataDir, "catalog.seed.json"),
    runtimePath:
      process.env.VECTRA_RUNTIME_STORE_PATH ?? path.join(dataDir, "runtime.store.json"),
    deliveryFeeCents: Number(process.env.VECTRA_DELIVERY_FEE_CENTS ?? 50000),
    retentionDays: Number(process.env.VECTRA_RETENTION_DAYS ?? 30),
  };
}
