const lkrFormatter = new Intl.NumberFormat("en-LK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatLkr(cents: number): string {
  if (!Number.isFinite(cents)) return "LKR 0.00";
  return `LKR ${lkrFormatter.format(cents / 100)}`;
}

export function formatLkrAmount(amount: number): string {
  return formatLkr(Math.round(amount * 100));
}

export function calculateLineTotal(unitPriceCents: number, quantity: number): number {
  return unitPriceCents * quantity;
}

export function calculateGrandTotal(subtotalCents: number, deliveryFeeCents: number): number {
  return subtotalCents + deliveryFeeCents;
}
