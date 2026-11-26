import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Truck } from "lucide-react";
import { FitmentFinder } from "@/components/fitment/fitment-finder";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { getStore } from "@/server/storage/json-store";
import { HeroBackgroundSlider } from "@/components/home/hero-background-slider";


export default async function HomePage() {
  const { catalog } = await getStore().readSnapshot();
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div className="hero-section-wrapper" style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <HeroBackgroundSlider />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <section className="hero">
            <Reveal>
              <p className="eyebrow">
                <BadgeCheck size={14} aria-hidden="true" />
                Sri Lanka&apos;s parts showcase
              </p>
              <h1 className="hero-title">
                The right part.
                <br />
                <span>First time.</span>
              </h1>
              <p className="hero-copy">
                Browse a curated catalog of automobile parts, confirm fitment for your vehicle,
                and check out in minutes. Cash on Delivery and a clearly labelled flow
                are ready for the showcase.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/products">
                  Shop all parts
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="hero-proof">
                <span><ShieldCheck size={16} aria-hidden="true" /> Fitment first catalog</span>
                <span><Truck size={16} aria-hidden="true" /> Free delivery</span>
                <span><Search size={16} aria-hidden="true" /> Instant catalog search</span>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="fitment-anchor">
              <div id="fitment">
                <FitmentFinder vehicles={catalog.vehicles} />
              </div>
            </Reveal>
          </section>
        </div>
      </div>

      <div className="container">

        <section className="section" aria-labelledby="categories-heading">
          <Reveal>
            <div className="section-heading">
            <div>
              <h2 id="categories-heading" className="section-title">Shop by system</h2>
              <p className="section-copy">
                Find the exact parts you need by system complete with live stock status and vehicle compatibility checks.
              </p>
            </div>
            <Link className="link-arrow" href="/products">
              View catalog <ArrowRight size={15} aria-hidden="true" />
            </Link>
            </div>
          </Reveal>
          <Stagger className="category-grid">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <Link
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="category-card"
                >
                  {category.imagePath ? (
                    <Image src={category.imagePath} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
                  ) : null}
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>
    </>
  );
}
