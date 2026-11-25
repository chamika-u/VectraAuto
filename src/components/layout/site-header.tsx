"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { Store } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="site-header bg-white/95 border-b border-stone-200">
        <div className="container header-inner flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="brand" aria-label="VectraAuto home">
              <Image
                src="/vectraauto-logo.jpg"
                alt="VectraAuto"
                width={112}
                height={80}
                className="brand-logo"
                priority
              />
              <span>VectraAuto</span>
            </Link>
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
          <Image
            src="/vectraauto-logo.jpg"
            alt="VectraAuto"
            width={112}
            height={80}
            className="brand-logo"
            priority
          />
          <span>VectraAuto</span>
        </Link>
        <div className="header-actions flex items-center gap-3">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
