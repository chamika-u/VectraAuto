import { AdminNav } from "@/components/admin/admin-nav";
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
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
