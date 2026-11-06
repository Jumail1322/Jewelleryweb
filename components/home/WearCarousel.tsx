"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/shop";

/** Scroll-snap carousel with bar dots; autoplays every 5s while on screen, pauses on hover/touch. */
export function WearCarousel({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => {
    const t = track.current;
    const card = t?.children[i] as HTMLElement | undefined;
    if (!t || !card) return;
    t.scrollTo({ left: card.offsetLeft - t.offsetLeft, behavior: "smooth" });
    setCurrent(i);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const t = track.current;
      if (!t) return;
      const next = (current + 1) % t.children.length;
      const card = t.children[next] as HTMLElement;
      t.scrollTo({ left: card.offsetLeft - t.offsetLeft, behavior: "smooth" });
      setCurrent(next);
    }, 5000);
    return () => clearInterval(id);
  }, [inView, paused, current]);

  // Keep the active dot in sync when the user swipes or drags
  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    let closest = 0;
    let min = Infinity;
    Array.from(t.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - t.offsetLeft - t.scrollLeft);
      if (d < min) {
        min = d;
        closest = i;
      }
    });
    if (closest !== current) setCurrent(closest);
  };

  return (
    <div
      ref={root}
      className="sma-wear-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div ref={track} className="sma-wear-carousel-track" onScroll={onScroll}>
        {products.map((p) => (
          <div key={p.handle} className="sma-wear-card">
            <ProductCard product={p} sizes="300px" />
          </div>
        ))}
      </div>
      <div className="sma-wear-dots" role="tablist">
        {products.map((p, i) => (
          <button
            key={p.handle}
            type="button"
            role="tab"
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            className={`sma-wear-dot${i === current ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      <div className="sma-wear-button-wrap">
        <Link href="/collections/all" className="sma-button-second">
          View all
        </Link>
      </div>
    </div>
  );
}
