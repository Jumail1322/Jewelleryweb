"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ShopImage } from "@/lib/shop";

/** Main image with thumbnails; hovering the main image zooms toward the cursor (desktop). */
export function ProductGallery({ images, title }: { images: ShopImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");
  const current = images[index];

  if (!current) return <div className="pdp-gallery__main pdp-gallery__main--empty" />;

  return (
    <div className="pdp-gallery">
      <div
        className="pdp-gallery__main"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || title}
          fill
          preload
          sizes="(max-width: 989px) 100vw, 55vw"
          style={{ transformOrigin: origin }}
        />
      </div>
      {images.length > 1 && (
        <div className="pdp-gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`pdp-gallery__thumb${i === index ? " is-active" : ""}`}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <Image src={img.src} alt="" fill sizes="88px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
