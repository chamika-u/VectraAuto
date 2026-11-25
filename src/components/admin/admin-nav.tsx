"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Car,
  ArrowLeft,
  Shield,
  Loader2,
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
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  // Clear navigating state whenever pathname finishes updating
  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If clicking current route, ignore
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    setNavigatingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

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
          const isTargetPending = navigatingHref === item.href;
          const isCurrentActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          // Optimistically show active if user just clicked it
          const isActive = navigatingHref ? isTargetPending : isCurrentActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isTargetPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300 shrink-0" />
              )}
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

        <Link href="/" prefetch={true} className="admin-return-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </nav>
  );
}
