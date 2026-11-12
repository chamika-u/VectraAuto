import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartValidationBridge } from "@/components/cart/cart-validation-bridge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VehicleSync } from "@/components/fitment/vehicle-sync";
import { loadCatalogSeed } from "@/server/catalog/seed";

export const metadata: Metadata = {
  title: {
    default: "VectraAuto | Quality automobile parts in Sri Lanka",
    template: "%s | VectraAuto",
  },
  description:
    "Discover compatible automobile parts by vehicle, build your cart, and check out with Cash on Delivery or a clearly labelled demo card flow.",
  applicationName: "VectraAuto",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f7",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await loadCatalogSeed();

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <a className="sr-only" href="#main-content">
            Skip to main content
          </a>
          <div className="site-shell">
            <VehicleSync vehicles={catalog.vehicles} />
            <CartValidationBridge />
            <SiteHeader />
            <main id="main-content" className="motion-page">
              {children}
            </main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
