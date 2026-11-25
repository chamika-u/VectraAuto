import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  CheckCircle2,
  Wrench,
  Gauge,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | VectraAuto Sri Lanka",
  description:
    "Learn about VectraAuto, Sri Lanka's trusted automobile spare parts specialist. Quality genuine & OEM parts with verified vehicle fitment.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container max-w-5xl mx-auto px-4 md:px-8 text-stone-800">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Hero Section */}
        <div className="mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight mb-4">
            Driving Confidence with Every Component.
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            VectraAuto is Sri Lanka&apos;s specialist provider of precision-matched automobile spare parts. We combine verified OEM manufacturing standards with an intelligent vehicle compatibility platform, giving drivers and mechanics across the island 100% confidence before every purchase.
          </p>
        </div>

        {/* Visual Featured Image Banner (Automotive Parts in action) */}
        <div className="relative rounded-2xl overflow-hidden shadow-md mb-16 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-72">
            <div className="relative h-48 md:h-full group overflow-hidden">
              <Image
                src="/products/brakes.jpg"
                alt="Braking Systems"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stopping Power</span>
                <h3 className="text-lg font-bold text-white">Braking Systems</h3>
              </div>
            </div>

            <div className="relative h-48 md:h-full group overflow-hidden border-t md:border-t-0 md:border-l md:border-r border-stone-200/40">
              <Image
                src="/products/suspension.jpg"
                alt="Suspension & Steering"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ride Dynamics</span>
                <h3 className="text-lg font-bold text-white">Suspension & Steering</h3>
              </div>
            </div>

            <div className="relative h-48 md:h-full group overflow-hidden">
              <Image
                src="/products/filters.jpg"
                alt="Engine Care & Filters"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pure Performance</span>
                <h3 className="text-lg font-bold text-white">Filters & Engine Care</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Company Mission & Core Values */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Our Vision & Promise
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              Solving the Sri Lankan Auto Parts Dilemma.
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              Finding the right replacement part in Sri Lanka often involves tedious physical searching, questionable quality, and compatibility guesswork. VectraAuto was founded to revolutionize this experience.
            </p>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              Our digital catalog indexes every part by vehicle make, model, manufacture year, and engine size. When you order from VectraAuto, you receive the right component the first time, backed by doorstep Cash on Delivery and prompt delivery.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl">
              <ShieldCheck className="text-red-600 mb-2" size={24} />
              <div className="text-2xl font-black text-stone-900 mb-0.5">100%</div>
              <div className="text-xs font-bold text-stone-800">Fitment Match</div>
              <p className="text-[11px] text-stone-500 mt-1">Cross-referenced against verified manufacturer spec databases.</p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl">
              <Award className="text-red-600 mb-2" size={24} />
              <div className="text-2xl font-black text-stone-900 mb-0.5">OEM</div>
              <div className="text-xs font-bold text-stone-800">Certified Parts</div>
              <p className="text-[11px] text-stone-500 mt-1">Direct from ISO-certified global automotive component makers.</p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl">
              <Truck className="text-red-600 mb-2" size={24} />
              <div className="text-2xl font-black text-stone-900 mb-0.5">Island-wide</div>
              <div className="text-xs font-bold text-stone-800">Doorstep Courier</div>
              <p className="text-[11px] text-stone-500 mt-1">Swift 1-4 day delivery across every province in Sri Lanka.</p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl">
              <CheckCircle2 className="text-red-600 mb-2" size={24} />
              <div className="text-2xl font-black text-stone-900 mb-0.5">COD</div>
              <div className="text-xs font-bold text-stone-800">Cash on Delivery</div>
              <p className="text-[11px] text-stone-500 mt-1">Pay only upon physical receipt and verification of your package.</p>
            </div>
          </div>
        </div>

        {/* Visual Component Quality Gallery */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-900">Precision Engineered Automotive Components</h2>
            <p className="text-xs md:text-sm text-stone-500 mt-1">
              From heavy-duty braking friction to high-flow filtration and durable suspension assemblies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 group text-center">
              <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-white">
                <Image
                  src="/products/brake-rotor.jpg"
                  alt="Ventilated Brake Rotor"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Ventilated Rotors</h4>
              <p className="text-[11px] text-stone-500">High thermal stability</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 group text-center">
              <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-white">
                <Image
                  src="/products/shock-absorber.jpg"
                  alt="Gas Shock Absorber"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Shock Absorbers</h4>
              <p className="text-[11px] text-stone-500">Precision road dampening</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 group text-center">
              <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-white">
                <Image
                  src="/products/oil-filter.jpg"
                  alt="Oil Filters"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Oil & Air Filters</h4>
              <p className="text-[11px] text-stone-500">Engine micro-filtration</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 group text-center">
              <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-white">
                <Image
                  src="/products/tail-light.jpg"
                  alt="Tail Light Assemblies"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-xs font-bold text-stone-900">Lighting Units</h4>
              <p className="text-[11px] text-stone-500">Crystal road visibility</p>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="bg-stone-900 text-white rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ready to find the exact parts for your vehicle?
          </h2>
          <p className="text-sm text-stone-400 max-w-lg">
            Use our built-in fitment finder to select your vehicle make, model, and year, and explore parts guaranteed to fit.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
            >
              Browse All Parts <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-sm transition-colors border border-stone-700"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
