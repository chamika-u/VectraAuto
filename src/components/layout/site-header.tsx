"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { Store } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "All Parts" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="site-header">
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

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/products"
                ? pathname?.startsWith("/products")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-item ${isActive ? "nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions flex items-center gap-3">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
