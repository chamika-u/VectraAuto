import { Badge } from "@/components/ui/badge";
import type { Compatibility } from "@/lib/contracts/catalog";

export function CompatibilityBadge({
  compatibility,
  compact = false,
}: {
  compatibility: Compatibility | null;
  compact?: boolean;
}) {
  if (!compatibility) return null;
  if (compatibility === "compatible") {
    return <Badge tone="success">{compact ? "Fits" : "Compatible"}</Badge>;
  }
  if (compatibility === "incompatible") {
    return <Badge tone="danger">{compact ? "No fit" : "Not compatible"}</Badge>;
  }
  return <Badge tone="warning">{compact ? "Unknown" : "Fitment unknown"}</Badge>;
}
