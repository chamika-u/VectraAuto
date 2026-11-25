import type { Metadata } from "next";
import { findOrderByReference } from "@/server/orders/repository";
import { getStore } from "@/server/storage/json-store";
import { OrderConfirmationView } from "@/components/orders/order-confirmation-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await findOrderByReference(getStore(), reference);

  return <OrderConfirmationView initialOrder={order} reference={reference} />;
}
