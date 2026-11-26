"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/hero-bg-1.jpg",
    alt: "VectraAuto Performance Car Showcase",
    caption: "Precision Engineered Performance",
  },
  {
    src: "/hero-bg-2.jpg",
    alt: "High Performance Brakes and Rotors",
    caption: "OEM & Performance Brake Systems",
  },
  {
    src: "/hero-bg-3.jpg",
    alt: "Precision Turbocharged Engine Engineering",
    caption: "Quality Powertrain & Engine Parts",
  },
];

export function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="hero-slider-container"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Slides with crossfade */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.src}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1.025)" : "scale(1)",
              transition: "opacity 1200ms ease-in-out, transform 7000ms ease-out",
              willChange: "opacity, transform",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center 38%",
              }}
            />
          </div>
        );
      })}

      {/* Directional gradient overlay: Solid enough on the left for maximum text contrast, reveals vehicle on right */}
      <div
        className="hero-slider-overlay-horizontal"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(245, 245, 247, 0.97) 0%, rgba(245, 245, 247, 0.91) 40%, rgba(245, 245, 247, 0.72) 72%, rgba(245, 245, 247, 0.42) 100%)",
        }}
      />

      {/* Top & bottom subtle blend into header & next section */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(245, 245, 247, 0.6) 0%, transparent 22%, transparent 78%, rgba(245, 245, 247, 0.95) 100%)",
        }}
      />

      {/* Interactive slide indicator dots */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 4,
          pointerEvents: "auto",
        }}
      >
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}: ${slide.caption}`}
            style={{
              width: index === currentIndex ? 26 : 7,
              height: 6,
              borderRadius: 999,
              border: "none",
              padding: 0,
              background:
                index === currentIndex ? "var(--accent)" : "rgba(29, 29, 31, 0.25)",
              cursor: "pointer",
              transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
