type LogLevel = "info" | "warn" | "error";

const sensitiveKey = /card|email|phone|address|fullname|customer|delivery|authorization|idempotency/i;

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[redacted]";
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  if (typeof value !== "object" || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      sensitiveKey.test(key) ? "[redacted]" : redact(entry, depth + 1),
    ]),
  );
}

export function logEvent(level: LogLevel, event: string, meta: Record<string, unknown> = {}): void {
  const line = JSON.stringify({
    level,
    event,
    at: new Date().toISOString(),
    ...(redact(meta) as Record<string, unknown>),
  });
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}
