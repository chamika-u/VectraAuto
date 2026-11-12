import { randomBytes, randomUUID } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function generateOrderReference(
  now = new Date(),
  existingReferences: Iterable<string> = [],
): string {
  const existing = new Set(existingReferences);
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const reference = `VA-${datePart}-${randomCode(8)}`;
    if (!existing.has(reference)) return reference;
  }
  return `VA-${datePart}-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

export function retentionExpiry(createdAt: Date, retentionDays: number): string {
  return new Date(createdAt.getTime() + retentionDays * 24 * 60 * 60 * 1000).toISOString();
}

export function newIdempotencyKey(): string {
  return randomUUID();
}
