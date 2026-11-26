"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartButton } from "@/components/cart/cart-button";
import { ArrowRight, Menu, Store, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "All Parts" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = pathname?.startsWith("/admin");

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
        {/* Left Side: Mobile Hamburger Button (iri thunak) + Logo */}
        <div className="header-brand-group">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>

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

        {/* Desktop Navigation Links */}
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

        {/* Right Actions: Cart Button */}
        <div className="header-actions flex items-center gap-3">
          <CartButton />
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-menu-drawer ${mobileMenuOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-menu-header">
          <Link
            href="/"
            className="brand"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="VectraAuto home"
          >
            <Image
              src="/vectraauto-logo.jpg"
              alt="VectraAuto"
              width={96}
              height={60}
              className="brand-logo"
            />
            <span>VectraAuto</span>
          </Link>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/products"
                ? pathname?.startsWith("/products")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive ? "is-active" : ""}`}
              >
                <span>{link.label}</span>
                <ArrowRight size={15} className="mobile-nav-arrow" aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <div className="mobile-menu-footer">
          <p className="mobile-snippet-title">VectraAuto Sri Lanka</p>
          <p className="mobile-snippet-text">
            Customer Hotline: <a href="tel:0757260688">0757260688</a>
          </p>
        </div>
      </div>
    </header>
  );
}
