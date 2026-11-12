"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Car,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
    exact: false,
  },
  {
    href: "/admin/products",
    label: "Products & Stock",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/vehicles",
    label: "Vehicles & Fitment",
    icon: Car,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "System & Settings",
    icon: Settings,
    exact: false,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar" aria-label="Admin Navigation">
      <div className="admin-brand-section">
        <div className="admin-brand-badge">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span className="admin-brand-title">VectraAdmin</span>
        </div>
        <span className="admin-env-pill">Control Center</span>
      </div>

      <div className="admin-nav-group">
        <span className="admin-nav-header">Management</span>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="admin-nav-bottom">
        <div className="admin-status-box">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Store Online</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">JSON Atomic Runtime</p>
        </div>

        <Link href="/" className="admin-return-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </nav>
  );
}
