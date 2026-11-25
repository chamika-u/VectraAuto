import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | VectraAuto Sri Lanka",
  description: "Official Terms and Conditions governing sales, vehicle fitment, delivery, and returns at VectraAuto.",
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4 md:px-8 text-stone-800">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Centered Heading like Daraz */}
        <div className="text-center mb-10 pb-6 border-b border-stone-200">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 uppercase">
            TERMS & CONDITIONS OF SALE
          </h1>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">
            VectraAuto Automobile Parts (Pvt) Ltd · Last Updated: November 2026
          </p>
        </div>

        {/* Lead Introduction Paragraph */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-stone-700">
          <p className="font-medium text-stone-800 text-justify">
            Welcome to VectraAuto. These Terms & Conditions constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;User&quot;, &quot;You&quot;) and VectraAuto Automobile Parts (Pvt) Ltd (&quot;VectraAuto&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By browsing our catalog, selecting parts for your vehicle, or confirming an order through this website, you agree to be bound by these terms.
          </p>

          {/* Uppercase Consent Notice Box (Daraz Style) */}
          <div className="p-5 md:p-6 bg-stone-50 border border-stone-200 rounded-lg text-xs md:text-sm font-semibold text-stone-800 leading-relaxed uppercase tracking-wide text-justify">
            PLEASE READ THESE TERMS & CONDITIONS CAREFULLY BEFORE PLACING AN ORDER. IF YOU DO NOT AGREE WITH ANY PART OF THESE TERMS, YOU SHOULD REFRAIN FROM ACCESSING OR ORDERING PRODUCTS THROUGH THIS PLATFORM.
          </div>

          {/* Section 1 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              1. ACCOUNTABILITY & ORDERS
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-3 text-justify">
              1.1. No mandatory user account is required to browse or order. All orders require an accurate full name, active Sri Lankan mobile contact number, and valid doorstep delivery address.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              1.2. Each submitted order generates a unique Order Reference code (e.g. VA-XXXXXX). Order placement constitutes an offer to purchase, subject to stock verification and dispatch confirmation by our team.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              2. VEHICLE COMPATIBILITY & FITMENT ACCURACY
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-2 text-justify">
              2.1. VectraAuto provides vehicle fitment information compiled from OEM specifications. However, customers are advised to ensure that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-stone-700">
              <li>The vehicle make, model, manufacture year, and engine capacity match their vehicle registration document.</li>
              <li>Modifications or aftermarket retrofits previously carried out on the vehicle do not alter component sizing.</li>
              <li>When in doubt, customers contact our parts help desk (0757260688) prior to dispatch.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              3. PRICING & PAYMENT TERMS (CASH ON DELIVERY)
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              3.1. All prices are listed in Sri Lankan Rupees (LKR) inclusive of applicable taxes. Delivery is charged at a flat rate of LKR 500 across Sri Lanka unless a free delivery promotion is active.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed text-justify mt-2">
              3.2. Payment must be rendered in full in cash to the delivery representative upon physical arrival of the package. Couriers are authorized to withhold delivery if payment is not tendered.
            </p>
          </div>

          {/* Section 4 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              4. DELIVERY TIMELINES & DISPATCH
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              4.1. Orders are processed within 24 business hours. Deliveries within the Colombo District and Western Province typically conclude in 1 to 2 business days. Outstation deliveries across Sri Lanka are fulfilled within 2 to 4 business days.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed text-justify mt-2">
              4.2. In the event of adverse weather, public emergencies, or courier logistics delays, our support team will notify you via telephone or SMS.
            </p>
          </div>

          {/* Section 5 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              5. RETURNS, EXCHANGES & WARRANTY
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              5.1. Unused, uninstalled components in their original manufacturer packaging may be exchanged or returned within <strong>7 calendar days</strong> from delivery date.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed text-justify mt-2">
              5.2. Parts that have been mounted, greased, welded, or altered are strictly non-returnable. Electrical items (sensors, bulbs) are covered by manufacturer warranty against defects prior to installation.
            </p>
          </div>

          {/* Section 6 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              6. GOVERNING LAW & JURISDICTION
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              6.1. These Terms & Conditions shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Colombo, Sri Lanka.
            </p>
          </div>

          {/* Section 7 */}
          <div className="pt-4 border-t border-stone-200 mt-8">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              7. CUSTOMER SERVICE INQUIRIES
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              For order status inquiries, fitment assistance, or return requests, please contact:
            </p>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs md:text-sm text-stone-700 space-y-1">
              <p><strong>VectraAuto Automobile Parts (Pvt) Ltd</strong></p>
              <p>375/77, Laurie’s Road, Galle Road, Colombo</p>
              <p>Contact: 0757260688</p>
              <p>Email: <a href="mailto:support@vectraauto.lk" className="text-red-600 underline">support@vectraauto.lk</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
