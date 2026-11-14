"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <footer className="py-5 text-center border-t border-stone-200 bg-stone-50 text-xs font-medium text-stone-500 w-full mt-auto">
        <p className="m-0 text-center">
          VectraAuto Admin · © {new Date().getFullYear()}
        </p>
      </footer>
    );
  }
  return (
    <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-800 mt-auto">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white tracking-wide m-0">VectraAuto</h3>
          <p className="text-xs text-stone-400 m-0">
            © {new Date().getFullYear()} VectraAuto. Showcase storefront for Sri Lankan drivers.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
          <Link href="/products" className="hover:text-emerald-400 transition-colors duration-200">
            Catalog
          </Link>
          <Link href="/cart" className="hover:text-emerald-400 transition-colors duration-200">
            Cart
          </Link>
          <Link href="/checkout" className="hover:text-emerald-400 transition-colors duration-200">
            Checkout
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 text-stone-200 rounded-md text-xs font-semibold border border-stone-700 shadow-sm cursor-default">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
            Cash on Delivery
          </span>
        </div>
      </div>
    </footer>
  );
}