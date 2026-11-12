"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <footer className="py-4 text-center border-t border-stone-200 bg-white text-xs text-stone-500">
        <p style={{ margin: 0 }}>
          VectraAuto Admin Portal · Atomic JSON Runtime · © {new Date().getFullYear()}
        </p>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} VectraAuto. Showcase storefront for Sri Lankan drivers.
        </p>
        <div className="footer-links">
          <Link href="/products">Catalog</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/admin" className="font-semibold text-emerald-800 hover:underline">
            Admin Panel
          </Link>
          <span>Cash on Delivery · Demo card</span>
        </div>
      </div>
    </footer>
  );
}
