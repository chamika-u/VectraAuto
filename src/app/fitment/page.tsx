import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FitmentFinder } from "@/components/fitment/fitment-finder";
import { loadCatalogSeed } from "@/server/catalog/seed";

export const metadata: Metadata = {
  title: "Vehicle Fitment Finder | VectraAuto",
  description:
    "Find exact matching automobile spare parts for your vehicle make, model, year, and engine with 100% fitment guarantee.",
};

export default async function FitmentPage() {
  const catalog = await loadCatalogSeed();

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

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold tracking-wider uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Fitment Intelligence
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mt-3 mb-3">
            Vehicle Fitment Finder
          </h1>
          <p className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Select your vehicle make, model, and manufacture year below. Our catalog will automatically filter and present components verified to match your automobile.
          </p>
        </div>

        {/* Fitment Finder Box */}
        <div className="bg-stone-50 p-6 md:p-10 rounded-2xl border border-stone-200 shadow-sm">
          <FitmentFinder
            vehicles={catalog.vehicles}
            redirectPath="/products"
            title="Choose Your Vehicle"
          />
        </div>
      </div>
    </div>
  );
}
