import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";

export function SiteHeader() {
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
        <div className="header-actions">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
