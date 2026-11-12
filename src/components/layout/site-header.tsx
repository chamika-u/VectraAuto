"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { ShieldCheck, Store } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="site-header bg-white/95 border-b border-stone-200">
        <div className="container header-inner flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="brand" aria-label="VectraAuto home">
              <span className="brand-mark bg-emerald-800 text-white" aria-hidden="true">VA</span>
              <span className="font-bold text-stone-900">VectraAuto</span>
            </Link>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-stone-100 text-emerald-800 border border-stone-200 uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-stone-500" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="VectraAuto home">
          <span className="brand-mark" aria-hidden="true">VA</span>
          <span>VectraAuto</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop all</Link>
          <Link href="/products?category=brakes">Brakes</Link>
          <Link href="/products?category=filters">Filters</Link>
          <Link href="/products?category=lighting">Lighting</Link>
        </nav>
        <div className="header-actions flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-200/70 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 transition-colors"
            title="Open Admin Control Center"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
