import Link from "next/link";

export function SiteFooter() {
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
          <span>Cash on Delivery · Demo card</span>
        </div>
      </div>
    </footer>
  );
}
