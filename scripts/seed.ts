import { JsonStore } from "@/server/storage/json-store";

async function main(): Promise<void> {
  const reset = process.argv.includes("--reset");
  const store = new JsonStore();
  const snapshot = await store.initialize({ reset });
  const activeProducts = snapshot.catalog.products.filter((product) => product.status === "active");
  console.info(
    JSON.stringify({
      event: reset ? "seed.reset" : "seed.initialized",
      categories: snapshot.catalog.categories.length,
      products: activeProducts.length,
      vehicles: snapshot.catalog.vehicles.length,
      fitmentApplications: snapshot.catalog.fitmentApplications.length,
      runtimePath: store.paths.runtimePath,
    }),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      event: "seed.failed",
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  );
  process.exitCode = 1;
});
