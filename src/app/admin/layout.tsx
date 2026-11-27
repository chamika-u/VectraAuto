import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Control Center | VectraAuto",
  description: "Manage orders, real-time inventory, catalog products, and fitment rules.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
}
