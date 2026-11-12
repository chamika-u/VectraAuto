import { Mutex } from "async-mutex";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogSeed } from "@/lib/contracts/catalog";
import type { RuntimeStore } from "@/lib/contracts/orders";
import { getSettings, type AppSettings } from "@/server/config";
import { loadCatalogSeed } from "@/server/catalog/seed";
import { purgeExpiredData } from "@/server/retention/purge";

export type StoreSnapshot = {
  catalog: CatalogSeed;
  runtime: RuntimeStore;
};

export type StoreTransactionContext = StoreSnapshot & {
  save: (next: RuntimeStore) => Promise<void>;
};

export type StoreOptions = Partial<AppSettings> & {
  catalogPath?: string;
  runtimePath?: string;
};

export function buildRuntimeStore(catalog: CatalogSeed): RuntimeStore {
  return {
    schemaVersion: 1,
    inventory: Object.fromEntries(
      catalog.products.map((product) => [product.id, product.initialStock]),
    ),
    orders: [],
    idempotency: [],
  };
}

function isRuntimeStore(value: unknown): value is RuntimeStore {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<RuntimeStore>;
  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.inventory === "object" &&
    candidate.inventory !== null &&
    Array.isArray(candidate.orders) &&
    Array.isArray(candidate.idempotency)
  );
}

export class JsonStore {
  private readonly mutex = new Mutex();
  private readonly settings: AppSettings;
  private catalogPromise: Promise<CatalogSeed> | null = null;

  constructor(options: StoreOptions = {}) {
    const base = getSettings();
    this.settings = {
      ...base,
      ...options,
      dataDir: options.dataDir ?? base.dataDir,
      catalogPath: options.catalogPath ?? base.catalogPath,
      runtimePath: options.runtimePath ?? base.runtimePath,
      deliveryFeeCents: options.deliveryFeeCents ?? base.deliveryFeeCents,
      retentionDays: options.retentionDays ?? base.retentionDays,
    };
  }

  get paths(): AppSettings {
    return this.settings;
  }

  async getCatalog(): Promise<CatalogSeed> {
    this.catalogPromise ??= loadCatalogSeed(this.settings.catalogPath);
    return this.catalogPromise;
  }

  async initialize(options: { reset?: boolean } = {}): Promise<StoreSnapshot> {
    return this.mutex.runExclusive(async () => {
      const catalog = await this.getCatalog();
      await mkdir(this.settings.dataDir, { recursive: true });
      if (options.reset) {
        await rm(this.settings.runtimePath, { force: true });
      }
      const runtime = await this.loadRuntimeUnlocked(catalog);
      await this.writeRuntimeUnlocked(runtime);
      return structuredClone({ catalog, runtime });
    });
  }

  async readSnapshot(): Promise<StoreSnapshot> {
    return this.mutex.runExclusive(async () => {
      const catalog = await this.getCatalog();
      const runtime = await this.loadRuntimeUnlocked(catalog);
      return structuredClone({ catalog, runtime });
    });
  }

  async withLock<T>(callback: (context: StoreTransactionContext) => Promise<T>): Promise<T> {
    return this.mutex.runExclusive(async () => {
      const catalog = await this.getCatalog();
      const runtime = await this.loadRuntimeUnlocked(catalog);
      return callback({
        catalog,
        runtime,
        save: async (next) => {
          await this.writeRuntimeUnlocked(next);
        },
      });
    });
  }

  async reset(): Promise<void> {
    await this.mutex.runExclusive(async () => {
      await rm(this.settings.runtimePath, { force: true });
    });
  }

  async purgeNow(now = new Date()): Promise<{ removedOrders: number; removedIdempotency: number }> {
    return this.mutex.runExclusive(async () => {
      const catalog = await this.getCatalog();
      let runtime: RuntimeStore;
      try {
        const content = await readFile(this.settings.runtimePath, "utf8");
        const parsed = JSON.parse(content) as unknown;
        if (!isRuntimeStore(parsed)) {
          throw new Error("Runtime store has an unsupported shape.");
        }
        runtime = parsed;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return { removedOrders: 0, removedIdempotency: 0 };
        }
        throw error;
      }

      const purged = purgeExpiredData(runtime, now, catalog.retentionDays);
      if (purged.removedOrders > 0 || purged.removedIdempotency > 0) {
        await this.writeRuntimeUnlocked(purged.store);
      }
      return {
        removedOrders: purged.removedOrders,
        removedIdempotency: purged.removedIdempotency,
      };
    });
  }

  private async loadRuntimeUnlocked(catalog: CatalogSeed): Promise<RuntimeStore> {
    let runtime: RuntimeStore;
    try {
      const content = await readFile(this.settings.runtimePath, "utf8");
      const parsed = JSON.parse(content) as unknown;
      if (!isRuntimeStore(parsed)) {
        throw new Error("Runtime store has an unsupported shape.");
      }
      runtime = parsed;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      runtime = buildRuntimeStore(catalog);
      await this.writeRuntimeUnlocked(runtime);
      return runtime;
    }

    const purged = purgeExpiredData(runtime, new Date(), catalog.retentionDays);
    if (purged.removedOrders > 0 || purged.removedIdempotency > 0) {
      runtime = purged.store;
      await this.writeRuntimeUnlocked(runtime);
    }
    return runtime;
  }

  private async writeRuntimeUnlocked(runtime: RuntimeStore): Promise<void> {
    await mkdir(path.dirname(this.settings.runtimePath), { recursive: true });
    const tempPath = `${this.settings.runtimePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tempPath, `${JSON.stringify(runtime, null, 2)}\n`, "utf8");
    await rename(tempPath, this.settings.runtimePath);
  }
}

let defaultStore: JsonStore | null = null;

export function getStore(): JsonStore {
  defaultStore ??= new JsonStore();
  return defaultStore;
}

export function setStoreForTests(store: JsonStore | null): void {
  defaultStore = store;
}
