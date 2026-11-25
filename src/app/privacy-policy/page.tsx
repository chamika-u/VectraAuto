import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | VectraAuto Sri Lanka",
  description: "Official Privacy Policy of VectraAuto. Learn how we collect, protect, and process customer data in Sri Lanka.",
};

export default function PrivacyPolicyPage() {
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
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">
            VectraAuto Automobile Parts (Pvt) Ltd · Last Updated: November 2026
          </p>
        </div>

        {/* Lead Introduction Paragraph */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-stone-700">
          <p className="font-medium text-stone-800 text-justify">
            VectraAuto understands that our users care about their personal data and how it is collected, used, shared, protected and cared for. We are committed to handling your personal data in accordance with the applicable laws of Sri Lanka when you use any of the features and functions available on our Platform or Services, interact with us via telephone, customer service agents, or access our Services or our Platform through your computer, mobile device, or any other device with Internet connectivity.
          </p>

          {/* Uppercase Consent Notice Box (Daraz Style) */}
          <div className="p-5 md:p-6 bg-stone-50 border border-stone-200 rounded-lg text-xs md:text-sm font-semibold text-stone-800 leading-relaxed uppercase tracking-wide text-justify">
            PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY BROWSING, SELECTING VEHICLE FITMENTS, OR PLACING AN ORDER THROUGH VECTRAAUTO, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THE TERMS OF THIS PRIVACY POLICY AND THAT YOU HAVE AGREED AND CONSENTED TO THE COLLECTION, USE, DISCLOSURE, STORAGE, TRANSFER AND/OR PROCESSING OF YOUR PERSONAL DATA FOR THE PURPOSES STATED HEREIN AND UNDER THE TERMS OF THIS PRIVACY POLICY.
          </div>

          {/* Section 1 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              1. INTRODUCTION TO THIS PRIVACY POLICY
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-3 text-justify">
              1.1. Data protection is a matter of trust and your privacy is of vital importance to us. This Privacy Policy explains how VectraAuto collects, uses, shares, and protects information in connection with our automobile spare parts catalog, fitment finder, order processing, and delivery services across Sri Lanka.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              1.2. Depending on your location, the entity controlling your personal data is VectraAuto Automobile Parts (Pvt) Ltd, 375/77, Laurie’s Road, Galle Road, Colombo.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              2. COLLECTION OF PERSONAL DATA
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-2 text-justify">
              2.1. We collect personal data when you interact with our Platform, place an order, or communicate with our help desk. Such data includes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-stone-700">
              <li><strong>Contact & Identity Data:</strong> Full name, mobile telephone number, secondary contact number, and email address.</li>
              <li><strong>Delivery Address:</strong> Physical residential or workshop address, city, district, postal code, and specific delivery remarks.</li>
              <li><strong>Vehicle Specifications:</strong> Make, model, manufacture year, engine capacity, and variant to ensure verified part compatibility.</li>
              <li><strong>Order History:</strong> Spare parts ordered, unit quantities, total order value in Sri Lankan Rupees (LKR), and delivery status.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              3. USE AND DISCLOSURE OF PERSONAL DATA
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-2 text-justify">
              3.1. We process and use personal data for the following lawful business purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm text-stone-700">
              <li>To prepare, pack, and fulfill orders placed through our automotive parts storefront.</li>
              <li>To verify part compatibility against your specified vehicle profile before dispatching goods.</li>
              <li>To coordinate with domestic third-party courier and logistics partners for doorstep delivery.</li>
              <li>To contact you via phone call or SMS regarding order confirmation, dispatch status, or delivery scheduling.</li>
              <li>To provide customer support, warranty queries, and after-sales service.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              4. PAYMENT AND CASH ON DELIVERY (COD) TRANSACTIONS
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              4.1. VectraAuto operates predominantly on a <strong>Cash on Delivery (COD)</strong> fulfillment model. Payments are made directly to the courier agent upon physical receipt and inspection of the parts package. VectraAuto does not store your credit card numbers, debit card PINs, or online banking passwords on our web servers.
            </p>
          </div>

          {/* Section 5 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              5. SECURITY OF YOUR PERSONAL DATA
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              5.1. To safeguard your personal data from unauthorized access, collection, use, disclosure, copying, modification, or leakage, we have introduced technical, administrative, and physical security measures. Access to customer order information is strictly restricted to authorized customer care and dispatch personnel.
            </p>
          </div>

          {/* Section 6 */}
          <div className="pt-4">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              6. DATA RETENTION AND YOUR RIGHTS
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed text-justify">
              6.1. We retain your order records only for as long as necessary to satisfy legal, accounting, tax, and warranty verification requirements under Sri Lankan commerce regulations. You may request access to, correction of, or deletion of your personal records by contacting our customer care department.
            </p>
          </div>

          {/* Section 7 */}
          <div className="pt-4 border-t border-stone-200 mt-8">
            <h2 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-tight mb-2">
              7. CONTACT US & DATA PROTECTION OFFICER
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed mb-3">
              If you have any questions, feedback, or concerns regarding this Privacy Policy or how your personal data is handled, please contact our Help Desk:
            </p>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs md:text-sm text-stone-700 space-y-1">
              <p><strong>VectraAuto Automobile Parts (Pvt) Ltd</strong></p>
              <p>375/77, Laurie’s Road, Galle Road, Colombo</p>
              <p>Contact: 0757260688</p>
              <p>Email: <a href="mailto:privacy@vectraauto.lk" className="text-red-600 underline">privacy@vectraauto.lk</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
