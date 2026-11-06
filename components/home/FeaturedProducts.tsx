"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FEATURED, PRODUCT_CUTOUTS, PRODUCT_VIDEOS } from "@/lib/content";
import { formatPrice, type Product } from "@/lib/shop";

/**
 * "Pieces that stay" — the signature hover effect.
 * Desktop is pure CSS (:hover + :has, see globals.css): the hovered box blurs,
 * siblings fade out, and that product's video fills the section.
 * On touch devices the first tap sets the same state via .is-active and a
 * second tap follows the link.
 */
export function FeaturedProducts({ products }: { products: Product[] }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // On touch, only the active product's section video plays
  useEffect(() => {
    if (!touch || !section.current) return;
    section.current.querySelectorAll<HTMLVideoElement>(".sma-featured-section-video").forEach((v, i) => {
      if (!(v instanceof HTMLVideoElement)) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, touch]);

  useEffect(() => {
    if (!touch || active === null) return;
    const onDocClick = (e: MouseEvent) => {
      const box = section.current?.querySelectorAll(".sma-featured-product-box")[active];
      if (box && !box.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [active, touch]);

  return (
    <section className="sma-featured-products" ref={section}>
      {products.map((p, i) =>
        PRODUCT_VIDEOS[p.handle] ? (
          <video
            key={p.handle}
            className={`sma-featured-section-video sma-featured-section-video--${i + 1}`}
            src={PRODUCT_VIDEOS[p.handle]}
            autoPlay={!touch}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          // No video for this product: its photo fills the section on hover instead
          <div key={p.handle} className={`sma-featured-section-video sma-featured-section-video--${i + 1}`}>
            {p.images[0] && <Image src={p.images[0].src} alt="" fill sizes="100vw" />}
          </div>
        ),
      )}

      <div className="sma-featured-inner">
        <div className="sma-featured-heading-box">
          <span className="sma-label-text">{FEATURED.label}</span>
          <h2 className="sma-primary-heading">{FEATURED.heading}</h2>
        </div>

        <div className="sma-featured-grid">
          {products.map((p, i) => (
            <Link
              key={p.handle}
              href={`/products/${p.handle}`}
              className={`sma-featured-product-box sma-featured-product-box--${i + 1}${active === i ? " is-active" : ""}`}
              onClick={(e) => {
                if (touch && active !== i) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
            >
              {PRODUCT_VIDEOS[p.handle] ? (
                <video className="sma-featured-product-video" src={PRODUCT_VIDEOS[p.handle]} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                p.images[0] && (
                  <div className="sma-featured-product-video">
                    <Image src={p.images[0].src} alt="" fill sizes="240px" />
                  </div>
                )
              )}
              <div className="sma-featured-product-header">
                <div className="sma-featured-product-info">
                  <span className="sma-featured-product-name">{p.title}</span>
                  <span className="sma-featured-product-price">{formatPrice(p.price)}</span>
                </div>
                <span className="sma-chotta-text sma-featured-product-number">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="sma-featured-product-image">
                {(PRODUCT_CUTOUTS[p.handle] ?? p.images[0]?.src) && (
                  <Image src={PRODUCT_CUTOUTS[p.handle] ?? p.images[0].src} alt={p.title} width={400} height={400} sizes="240px" />
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="sma-featured-content-box">
          <div className="sma-body-text">
            <p>
              <strong>{FEATURED.bodyStrong}</strong> {FEATURED.body}
            </p>
          </div>
          <Link className="sma-button-second" href={FEATURED.cta.href}>
            {FEATURED.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
