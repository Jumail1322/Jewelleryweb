"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_VIDEOS, REEL } from "@/lib/content";
import { formatPrice, type Product } from "@/lib/shop";

/** Video reel with page dots; autoscrolls every 4s while on screen and only plays visible videos. */
export function ProductReel({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [page, setPage] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);

  const step = () => {
    const s = slider.current;
    if (!s?.firstElementChild) return 0;
    return s.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(s).gap) || 0);
  };

  const goTo = (i: number) => {
    slider.current?.scrollTo({ left: i * perPage * step(), behavior: "smooth" });
    setPage(i);
  };

  useEffect(() => {
    const layout = () => {
      const s = slider.current;
      if (!s) return;
      const per = Math.max(1, Math.floor(s.offsetWidth / (step() || 1)));
      setPerPage(per);
      setPages(Math.ceil(products.length / per));
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [products.length]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);

    // Play only the videos that are actually visible
    const videoIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.5 },
    );
    el.querySelectorAll("video").forEach((v) => videoIo.observe(v));
    return () => {
      io.disconnect();
      videoIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!inView || hovering || pages <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const next = page >= pages - 1 ? 0 : page + 1;
      slider.current?.scrollTo({ left: next * perPage * step(), behavior: "smooth" });
      setPage(next);
    }, 4000);
    return () => clearInterval(id);
  }, [inView, hovering, pages, page, perPage]);

  return (
    <section className="sma-reel" ref={root}>
      <div className="sma-reel__header">
        <p className="sma-label-text">{REEL.label}</p>
        <h2 className="sma-primary-heading">{REEL.heading}</h2>
        <p className="sma-body-text">{REEL.body}</p>
      </div>

      <div
        ref={slider}
        className="sma-reel__slider"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onScroll={() => {
          const s = slider.current;
          const width = perPage * step();
          if (!s || !width) return;
          const p = Math.round(s.scrollLeft / width);
          if (p !== page && p >= 0 && p < pages) setPage(p);
        }}
      >
        {products.map((p) => (
          <Link key={p.handle} href={`/products/${p.handle}`} className="sma-reel__slide">
            {PRODUCT_VIDEOS[p.handle] ? (
              <video src={PRODUCT_VIDEOS[p.handle]} muted loop playsInline preload="metadata" />
            ) : (
              p.images[0] && <Image className="sma-reel__photo" src={p.images[0].src} alt="" fill sizes="300px" />
            )}
            <div className="sma-reel__product">
              {p.images[0] && <Image src={p.images[0].src} alt="" width={85} height={85} sizes="85px" />}
              <div>
                <span className="sma-reel__product-title">{p.title}</span>
                <span className="sma-reel__product-price">{formatPrice(p.price)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <div className="sma-reel__dots">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              className={`sma-reel__dot${i === page ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <div className="sma-reel__cta">
        <a href={REEL.cta.href} className="sma-button-primary">
          {REEL.cta.label}
        </a>
      </div>
    </section>
  );
}
