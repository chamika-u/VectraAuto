"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SmartContactLink } from "@/components/contact/smart-contact-link";
import {
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";

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
    <footer className="bg-[#12161f] text-stone-300 pt-16 pb-8 border-t border-stone-800 mt-auto text-sm">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
          
          {/* Left Section (Brand, Description, More About Us, Links) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Logo & Brand Name */}
              <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
                <div className="bg-white p-1.5 rounded-xl shadow-sm">
                  <Image
                    src="/vectraauto-logo.jpg"
                    alt="VectraAuto"
                    width={90}
                    height={55}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  VectraAuto
                </span>
              </Link>

              {/* Company Description */}
              <p className="text-stone-400 text-sm leading-relaxed max-w-xl mb-4">
                VectraAuto is Sri Lanka&apos;s trusted automotive parts specialist, providing high-grade genuine and OEM components with verified vehicle compatibility and secure island-wide Cash on Delivery.
              </p>

              {/* More About Us Link */}
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold text-sm mb-10 transition-colors"
              >
                <span>More About Us</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Navigation Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4 border-t border-stone-800/80">
              {/* Column 1: Company */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3.5">
                  Company
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-400">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <SmartContactLink className="hover:text-white transition-colors cursor-pointer">
                      Contact Us
                    </SmartContactLink>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions" className="hover:text-white transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3.5">
                  Store
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-400">
                  <li>
                    <Link href="/products" className="hover:text-white transition-colors">
                      All Parts
                    </Link>
                  </li>
                  <li>
                    <Link href="/fitment" className="hover:text-white transition-colors">
                      Fitment Finder
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-white transition-colors">
                      Shopping Cart
                    </Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="hover:text-white transition-colors">
                      Checkout
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-3.5">
                  Systems
                </h4>
                <ul className="space-y-2.5 text-xs text-stone-400">
                  <li>
                    <Link href="/products?category=brakes" className="hover:text-white transition-colors">
                      Brakes
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=filters" className="hover:text-white transition-colors">
                      Filters
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=suspension" className="hover:text-white transition-colors">
                      Suspension
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=lighting" className="hover:text-white transition-colors">
                      Lighting
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section (Head Office, Help Desk, Business Hours) */}
          <div className="lg:col-span-5 space-y-7 lg:pl-6">
            
            {/* Head Office */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-stone-700 bg-stone-800/60 flex items-center justify-center shrink-0 text-stone-300">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Business Address</h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  VectraAuto Automobile Parts (Pvt) Ltd<br />
                  375/77, Laurie’s Road, Galle Road, Colombo.
                </p>
              </div>
            </div>

            {/* Help Desk */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-stone-700 bg-stone-800/60 flex items-center justify-center shrink-0 text-stone-300">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Help Desk</h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Contact: <a href="tel:0757260688" className="hover:text-white transition-colors">0757260688</a><br />
                  Send a Mail: <a href="mailto:info@vectraauto.lk" className="text-emerald-400 hover:underline">info@vectraauto.lk</a>
                </p>
              </div>
            </div>

            {/* We are Open */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-stone-700 bg-stone-800/60 flex items-center justify-center shrink-0 text-stone-300">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">We are Open</h4>
                <p className="text-stone-300 text-xs font-semibold mb-0">
                  Mon - Sat: 8.30am to 5.30pm
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 border-t border-stone-800/50 flex flex-col items-center justify-center gap-4 text-xs text-stone-400 text-center">
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 text-stone-400">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <Facebook size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <Instagram size={14} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <Linkedin size={14} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <Youtube size={14} />
            </a>
            <a
              href="https://wa.me/94757260688"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <MessageCircle size={14} />
            </a>
          </div>

          <p className="m-0 text-center text-stone-400">
            Copyright © {new Date().getFullYear()} VectraAuto. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
