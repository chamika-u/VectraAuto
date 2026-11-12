import { JsonStore } from "@/server/storage/json-store";

async function main(): Promise<void> {
  const store = new JsonStore();
  const result = await store.purgeNow();
  console.info(JSON.stringify({ event: "retention.purged", ...result }));
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      event: "retention.failed",
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  );
  process.exitCode = 1;
});
