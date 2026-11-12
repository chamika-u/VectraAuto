"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/contracts/catalog";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const active = images[activeIndex] ?? images[0];
  const src = failed || !active ? "/products/placeholder.svg" : active.path;

  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={src}
          alt={failed ? `${productName} placeholder image` : active.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          onError={() => setFailed(true)}
        />
      </div>
      {images.length > 1 ? (
        <div style={{ display: "flex", gap: 10 }}>
          {images.map((image, index) => (
            <button
              key={image.path}
              type="button"
              className="button button-secondary button-icon"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              onClick={() => {
                setActiveIndex(index);
                setFailed(false);
              }}
            >
              <Image src={image.path} alt="" width={34} height={34} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
